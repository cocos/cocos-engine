#include "CommandEncoder.h"
#include <cassert>

namespace cc {

namespace {
uint32_t constexpr kMemoryChunkSize = 32 * 1024 * 1024;
uint32_t constexpr kMemoryChunkPoolCapacity = 16;
uint32_t constexpr kSwitchChunkMemoryRequirement = sizeof(MemoryChunkSwitchCommand) + sizeof(DummyCommand);
} // namespace

CommandEncoder::MemoryAllocator &CommandEncoder::MemoryAllocator::getInstance() noexcept {
    static CommandEncoder::MemoryAllocator instance;
    return instance;
}

uint8_t *CommandEncoder::MemoryAllocator::request() noexcept {
    uint8_t *newChunk = nullptr;

    if (mChunkPool.try_dequeue(newChunk)) {
        mChunkCount.fetch_sub(1, std::memory_order_acq_rel);
    } else {
        newChunk = memoryAllocateForMultiThread<uint8_t>(kMemoryChunkSize);
    }

    return newChunk;
}

void CommandEncoder::MemoryAllocator::recycle(uint8_t *const chunk, bool const freeByUser) noexcept {
    if (freeByUser) {
        mChunkFreeQueue.enqueue(chunk);
    } else {
        free(chunk);
    }
}

void CommandEncoder::MemoryAllocator::freeByUser(CommandEncoder *const mainCommandbuffer) noexcept {
    auto queue = &mChunkFreeQueue;

    ENCODE_COMMAND_1(
        mainCommandbuffer, freeChunksInFreeQueue,
        queue, queue,
        {
            uint8_t *chunk = nullptr;

            while (queue->try_dequeue(chunk)) {
                CommandEncoder::MemoryAllocator::getInstance().free(chunk);
            }
        });

    mainCommandbuffer->kick();
}

void CommandEncoder::MemoryAllocator::free(uint8_t *const chunk) noexcept {
    if (mChunkCount.load(std::memory_order_acquire) >= kMemoryChunkPoolCapacity) {
        memoryFreeForMultiThread(chunk);
    } else {
        mChunkPool.enqueue(chunk);
        mChunkCount.fetch_add(1, std::memory_order_acq_rel);
    }
}

CommandEncoder::CommandEncoder() {
    uint8_t *const chunk = MemoryAllocator::getInstance().request();

    mW.mCurrentMemoryChunk = chunk;
    mR.mCurrentMemoryChunk = chunk;

    // 分配一个头节点 不要被Execute
    Command *const cmd = allocate<DummyCommand>(1);
    pushCommands();
    pullCommands();
    mR.mLastCommand = cmd;
    --mR.mNewCommandCount;
}

void CommandEncoder::kick() noexcept {
    pushCommands();
    mN.Signal();
}

void CommandEncoder::kickAndWait() noexcept {
    EventSem event;
    EventSem *const pEvent = &event;

    ENCODE_COMMAND_1(this, WaitUntilFinish,
                     pEvent, pEvent,
                     {
                         pEvent->Signal();
                     });

    kick();
    event.Wait();
}

void CommandEncoder::runConsumerThread() noexcept {
    if (mWorkerAttached) {
        return;
    }

    std::thread consumerThread(&CommandEncoder::consumerThreadLoop, this);
    consumerThread.detach();
    mWorkerAttached = true;
}

void CommandEncoder::terminateConsumerThread() noexcept {
    if (!mWorkerAttached) {
        return;
    }

    EventSem event;
    EventSem *const pEvent = &event;

    ReaderContext *const pR = &mR;

    bool immediateMode = mImmediateMode;
    mImmediateMode = false;
    ENCODE_COMMAND_2(
        this, terminateConsumerThread,
        pR, pR,
        pEvent, pEvent,
        {
            pR->mTerminateConsumerThread = true;
            pR->mFlushingFinished = true;
            pEvent->Signal();
        });
    mImmediateMode = immediateMode;

    kick();
    event.Wait();
}

void CommandEncoder::finishWriting(bool wait) noexcept {
    if (!mImmediateMode) {
        bool *const flushingFinished = &mR.mFlushingFinished;

        ENCODE_COMMAND_1(this, finishWriting,
                         flushingFinished, flushingFinished,
                         {
                             *flushingFinished = true;
                         });

        if (wait)
            kickAndWait();
        else
            kick();
    }
}

void CommandEncoder::recycleMemoryChunk(uint8_t *const chunk) const noexcept {
    CommandEncoder::MemoryAllocator::getInstance().recycle(chunk, mFreeChunksByUser);
}

void CommandEncoder::freeChunksInFreeQueue(CommandEncoder *const mainCommandbuffer) noexcept {
    CommandEncoder::MemoryAllocator::getInstance().freeByUser(mainCommandbuffer);
}

uint8_t *CommandEncoder::allocateImpl(uint32_t &allocatedSize, uint32_t const requestSize) noexcept {
    uint32_t const alignedSize = align(requestSize, 16);
    assert(alignedSize + kSwitchChunkMemoryRequirement <= kMemoryChunkSize); // 一个Command直接把整个Chunk填满了

    uint32_t const newOffset = mW.mOffset + alignedSize;

    if (newOffset + kSwitchChunkMemoryRequirement <= kMemoryChunkSize) {
        allocatedSize = alignedSize;
        uint8_t *const allocatedMemory = mW.mCurrentMemoryChunk + mW.mOffset;
        mW.mOffset = newOffset;
        return allocatedMemory;
    } else {
        uint8_t *const newChunk = CommandEncoder::MemoryAllocator::getInstance().request();
        MemoryChunkSwitchCommand *const switchCommand = reinterpret_cast<MemoryChunkSwitchCommand *>(mW.mCurrentMemoryChunk + mW.mOffset);
        new (switchCommand) MemoryChunkSwitchCommand(this, newChunk, mW.mCurrentMemoryChunk);
        switchCommand->mNext = reinterpret_cast<Command *>(newChunk); // 注意这里还指向原位置
        mW.mLastCommand = switchCommand;
        ++mW.mPendingCommandCount;
        mW.mCurrentMemoryChunk = newChunk;
        mW.mOffset = 0;

        DummyCommand *const head = allocate<DummyCommand>(1);
        new (head) DummyCommand;

        if (mImmediateMode) {
            pushCommands();
            pullCommands();
            assert(mR.mNewCommandCount == 2);
            executeCommand();
            executeCommand();
        }

        return allocateImpl(allocatedSize, requestSize);
    }
}

void CommandEncoder::pushCommands() noexcept {
    mW.mWrittenCommandCount.fetch_add(mW.mPendingCommandCount, std::memory_order_acq_rel);
    mW.mPendingCommandCount = 0;
}

void CommandEncoder::pullCommands() noexcept {
    uint32_t const writtenCommandCountNew = mW.mWrittenCommandCount.load(std::memory_order_acquire);
    mR.mNewCommandCount += writtenCommandCountNew - mR.mWrittenCommandCountSnap;
    mR.mWrittenCommandCountSnap = writtenCommandCountNew;
}

void CommandEncoder::flushCommands() noexcept {
    while (!mR.mFlushingFinished) {
        executeCommand();
    }

    mR.mFlushingFinished = false;
}

void CommandEncoder::executeCommand() noexcept {
    Command *const cmd = readCommand();

    if (!cmd) {
        return;
    }

    cmd->execute();
    cmd->~Command();
}

Command *CommandEncoder::readCommand() noexcept {
    while (!hasNewCommand()) {
        // 如果当前没有可读的Command 尝试同步一下生产者线程的数据
        pullCommands();

        // 如果依然没有 挂起消费者线程 等待生产者线程填充Command并唤醒消费者线程
        if (!hasNewCommand()) {
            mN.Wait();
            pullCommands();
        }
    }

    Command *const cmd = mR.mLastCommand->getNext();
    mR.mLastCommand = cmd;
    --mR.mNewCommandCount;
    assert(cmd);
    return cmd;
}

void CommandEncoder::consumerThreadLoop() noexcept {
    while (!mR.mTerminateConsumerThread) {
        flushCommands();
    }

    mWorkerAttached = false;
}

char const *DummyCommand::getName() const noexcept {
    return "Dummy";
}

MemoryChunkSwitchCommand::MemoryChunkSwitchCommand(CommandEncoder *const cb, uint8_t *const newChunk, uint8_t *const oldChunk) noexcept
: mCommandBuffer(cb), mNewChunk(newChunk), mOldChunk(oldChunk) {
}

MemoryChunkSwitchCommand::~MemoryChunkSwitchCommand() {
    mCommandBuffer->recycleMemoryChunk(mOldChunk);
}

void MemoryChunkSwitchCommand::execute() noexcept {
    mCommandBuffer->mR.mCurrentMemoryChunk = mNewChunk;
    mCommandBuffer->pullCommands();
}

char const *MemoryChunkSwitchCommand::getName() const noexcept {
    return "MemoryChunkSwitch";
}

} // namespace cc
