#include "CommandEncoder.h"
#include <cassert>

namespace cc {
namespace gfx {

namespace
{
uint32_t constexpr kMemoryChunkSize = 4096 * 16;
uint32_t constexpr kMemoryChunkPoolCapacity = 64;
uint32_t constexpr kSwitchChunkMemoryRequirement = sizeof(MemoryChunkSwitchCommand) + sizeof(DummyCommand);
}

CommandEncoder::MemoryAllocator& CommandEncoder::MemoryAllocator::GetInstance() noexcept
{
    static CommandEncoder::MemoryAllocator instance;
    return instance;
}

uint8_t* CommandEncoder::MemoryAllocator::Request() noexcept
{
    uint8_t* newChunk = nullptr;

    if (mChunkPool.pop(newChunk))
    {
        mChunkCount.fetch_sub(1, std::memory_order_acq_rel);
    }
    else
    {
        newChunk = MemoryAllocateForMultiThread<uint8_t>(kMemoryChunkSize);
    }

    return newChunk;
}

void CommandEncoder::MemoryAllocator::Recycle(uint8_t* const chunk, bool const freeByUser) noexcept
{
    if (freeByUser)
    {
        mChunkFreeQueue.push(chunk);
    }
    else
    {
        Free(chunk);
    }
}

void CommandEncoder::MemoryAllocator::Free(uint8_t* const chunk) noexcept
{
    if (mChunkCount.load(std::memory_order_acquire) >= kMemoryChunkPoolCapacity)
    {
        MemoryFreeForMultiThread(chunk);
    }
    else
    {
        mChunkPool.push(chunk);
        mChunkCount.fetch_add(1, std::memory_order_acq_rel);
    }
}

CommandEncoder::CommandEncoder()
{
    uint8_t* const chunk = MemoryAllocator::GetInstance().Request();

    mW.mCurrentMemoryChunk = chunk;
    mR.mCurrentMemoryChunk = chunk;

    // 分配一个头节点 不要被Execute
    Command* const cmd = Allocate<DummyCommand>(1);
    PushCommands();
    PullCommands();
    mR.mLastCommand = cmd;
    --mR.mNewCommandCount;
}

void CommandEncoder::Kick() noexcept
{
    PushCommands();
    mN.Signal();
}

void CommandEncoder::KickAndWait() noexcept
{
    EventSem event;
    EventSem* const pEvent = &event;

    ENCODE_COMMAND_1(this, WaitUntilFinish,
            pEvent, pEvent,
            {
                pEvent->Signal();
            });

    Kick();
    event.Wait();
}

void CommandEncoder::RunConsumerThread() noexcept
{
    if (mWorkerAttached)
    {
        return;
    }

    std::thread consumerThread(std::bind(&CommandEncoder::ConsumerThreadLoop, this));
    consumerThread.detach();
    mWorkerAttached = true;
}

void CommandEncoder::TerminateConsumerThread() noexcept
{
    if (! mWorkerAttached)
    {
        return;
    }

    EventSem event;
    EventSem* const pEvent = &event;

    ReaderContext* const pR = &mR;
    ENCODE_COMMAND_2(
            this,   TerminateConsumerThread,
             pR,    pR,
            pEvent, pEvent,
            {
                pR->mTerminateConsumerThread = true;
                pR->mFlushingFinished = true;
                pEvent->Signal();
            });

    Kick();
    event.Wait();
}

void CommandEncoder::FinishWriting(bool wait) noexcept
{
    bool* const flushingFinished = &mR.mFlushingFinished;

    ENCODE_COMMAND_1(this, FinishWriting,
            flushingFinished, flushingFinished,
            {
                *flushingFinished = true;
            });

    wait ? KickAndWait() : Kick();
}

void CommandEncoder::RecycleMemoryChunk(uint8_t* const chunk) const noexcept
{
    CommandEncoder::MemoryAllocator::GetInstance().Recycle(chunk, mFreeChunksByUser);
}

void CommandEncoder::FreeChunksInFreeQueue() noexcept
{
    // TODO
}

uint8_t* CommandEncoder::AllocateImpl(uint32_t& allocatedSize, uint32_t const requestSize) noexcept
{
    uint32_t const alignedSize = Align(requestSize, 16);
    assert(alignedSize + kSwitchChunkMemoryRequirement <= kMemoryChunkSize);    // 一个Command直接把整个Chunk填满了

    uint32_t const newOffset = mW.mOffset + alignedSize;

    if (newOffset + kSwitchChunkMemoryRequirement <= kMemoryChunkSize)
    {
        allocatedSize = alignedSize;
        uint8_t* const allocatedMemory = mW.mCurrentMemoryChunk + mW.mOffset;
        mW.mOffset = newOffset;
        return allocatedMemory;
    }
    else
    {
        uint8_t* const newChunk = CommandEncoder::MemoryAllocator::GetInstance().Request();
        MemoryChunkSwitchCommand* const switchCommand = reinterpret_cast<MemoryChunkSwitchCommand*>(mW.mCurrentMemoryChunk + mW.mOffset);
        new(switchCommand) MemoryChunkSwitchCommand(this, newChunk, mW.mCurrentMemoryChunk);
        switchCommand->mNext = reinterpret_cast<Command*>(newChunk);  // 注意这里还指向原位置
        mW.mLastCommand = switchCommand;
        ++mW.mPendingCommandCount;
        mW.mCurrentMemoryChunk = newChunk;
        mW.mOffset = 0;

        DummyCommand* const head = Allocate<DummyCommand>(1);
        new(head) DummyCommand;

        if (mImmediateMode)
        {
            PushCommands();
            PullCommands();
            ExecuteCommand();
            ExecuteCommand();
        }

        return AllocateImpl(allocatedSize, requestSize);
    }
}

void CommandEncoder::PushCommands() noexcept
{
    mW.mWrittenCommandCount.fetch_add(mW.mPendingCommandCount, std::memory_order_acq_rel);
    mW.mPendingCommandCount = 0;
}

void CommandEncoder::PullCommands() noexcept
{
    uint32_t const writtenCommandCountNew = mW.mWrittenCommandCount.load(std::memory_order_acquire);
    mR.mNewCommandCount += writtenCommandCountNew - mR.mWrittenCommandCountSnap;
    mR.mWrittenCommandCountSnap = writtenCommandCountNew;
}

void CommandEncoder::FlushCommands() noexcept
{
    while (! mR.mFlushingFinished)
    {
        ExecuteCommand();
    }

    mR.mFlushingFinished = false;
}

void CommandEncoder::ExecuteCommand() noexcept
{
    Command* const cmd = ReadCommand();

    if (! cmd)
    {
        return;
    }

    cmd->Execute();
    cmd->~Command();
}

Command* CommandEncoder::ReadCommand() noexcept
{
    while (! HasNewCommand())
    {
        // 如果当前没有可读的Command 尝试同步一下生产者线程的数据
        PullCommands();

        // 如果依然没有 挂起消费者线程 等待生产者线程填充Command并唤醒消费者线程
        if (! HasNewCommand())
        {
            mN.Wait();
            PullCommands();
        }
    }

    Command* const cmd = mR.mLastCommand->GetNext();
    mR.mLastCommand = cmd;
    --mR.mNewCommandCount;
    return cmd;
}

void CommandEncoder::ConsumerThreadLoop() noexcept
{
    while (! mR.mTerminateConsumerThread)
    {
        FlushCommands();
    }

    mWorkerAttached = false;
}

char const* DummyCommand::GetName() const noexcept
{
    return "Dummy";
}

MemoryChunkSwitchCommand::MemoryChunkSwitchCommand(CommandEncoder* const cb, uint8_t* const newChunk, uint8_t* const oldChunk) noexcept
    : mCommandBuffer(cb)
    , mNewChunk(newChunk)
    , mOldChunk(oldChunk)
{
}

MemoryChunkSwitchCommand::~MemoryChunkSwitchCommand()
{
    mCommandBuffer->RecycleMemoryChunk(mOldChunk);
}

void MemoryChunkSwitchCommand::Execute() noexcept
{
    mCommandBuffer->mR.mCurrentMemoryChunk = mNewChunk;
    mCommandBuffer->PullCommands();
}

char const* MemoryChunkSwitchCommand::GetName() const noexcept
{
    return "MemoryChunkSwitch";
}

} // namespace gfx
} // namespace cc
