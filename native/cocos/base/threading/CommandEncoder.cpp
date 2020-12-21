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

    // sentinel node will not be executed
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

    new (allocate<TerminateConsumerThreadCommand>(1)) TerminateConsumerThreadCommand(pEvent, pR);

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
    assert(alignedSize + kSwitchChunkMemoryRequirement <= kMemoryChunkSize); // exceeds the block size

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
        switchCommand->mNext = reinterpret_cast<Command *>(newChunk); // point to start position
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
    while (!hasNewCommand()) { // if empty
        pullCommands();        // try pulling data from consumer

        if (!hasNewCommand()) { // still empty
            mN.Wait();          // wait for the producer to wake me up
            pullCommands();     // pulling again
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

MemoryChunkSwitchCommand::MemoryChunkSwitchCommand(CommandEncoder *const encoder, uint8_t *const newChunk, uint8_t *const oldChunk) noexcept
: mCommandEncoder(encoder), mNewChunk(newChunk), mOldChunk(oldChunk) {
}

MemoryChunkSwitchCommand::~MemoryChunkSwitchCommand() {
    mCommandEncoder->recycleMemoryChunk(mOldChunk);
}

void MemoryChunkSwitchCommand::execute() noexcept {
    mCommandEncoder->mR.mCurrentMemoryChunk = mNewChunk;
    mCommandEncoder->pullCommands();
}

char const *MemoryChunkSwitchCommand::getName() const noexcept {
    return "MemoryChunkSwitch";
}

TerminateConsumerThreadCommand::TerminateConsumerThreadCommand(EventSem *const pEvent, ReaderContext *const pR) noexcept
: mEvent(pEvent), mR(pR) {
}

void TerminateConsumerThreadCommand::execute() noexcept {
    mR->mTerminateConsumerThread = true;
    mR->mFlushingFinished = true;
    mEvent->Signal();
}

char const *TerminateConsumerThreadCommand::getName() const noexcept {
    return "TerminateConsumerThread";
}

} // namespace cc
