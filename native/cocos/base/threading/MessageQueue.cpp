#include "MessageQueue.h"
#include <cassert>

namespace cc {

namespace {
uint32_t constexpr kMemoryChunkSize = 4096 * 16;
uint32_t constexpr kMemoryChunkPoolCapacity = 64;
uint32_t constexpr kSwitchChunkMemoryRequirement = sizeof(MemoryChunkSwitchMessage) + sizeof(DummyMessage);
} // namespace

MessageQueue::MemoryAllocator &MessageQueue::MemoryAllocator::getInstance() noexcept {
    static MessageQueue::MemoryAllocator instance;
    return instance;
}

uint8_t *MessageQueue::MemoryAllocator::request() noexcept {
    uint8_t *newChunk = nullptr;

    if (mChunkPool.try_dequeue(newChunk)) {
        mChunkCount.fetch_sub(1, std::memory_order_acq_rel);
    } else {
        newChunk = memoryAllocateForMultiThread<uint8_t>(kMemoryChunkSize);
    }

    return newChunk;
}

void MessageQueue::MemoryAllocator::recycle(uint8_t *const chunk, bool const freeByUser) noexcept {
    if (freeByUser) {
        mChunkFreeQueue.enqueue(chunk);
    } else {
        free(chunk);
    }
}

void MessageQueue::MemoryAllocator::freeByUser(MessageQueue *const mainMessageQueue) noexcept {
    auto queue = &mChunkFreeQueue;

    ENQUEUE_MESSAGE_1(
        mainMessageQueue, FreeChunksInFreeQueue,
        queue, queue,
        {
            uint8_t *chunk = nullptr;

            while (queue->try_dequeue(chunk)) {
                MessageQueue::MemoryAllocator::getInstance().free(chunk);
            }
        });

    mainMessageQueue->kick();
}

void MessageQueue::MemoryAllocator::free(uint8_t *const chunk) noexcept {
    if (mChunkCount.load(std::memory_order_acquire) >= kMemoryChunkPoolCapacity) {
        memoryFreeForMultiThread(chunk);
    } else {
        mChunkPool.enqueue(chunk);
        mChunkCount.fetch_add(1, std::memory_order_acq_rel);
    }
}

MessageQueue::MessageQueue() {
    uint8_t *const chunk = MemoryAllocator::getInstance().request();

    mW.mCurrentMemoryChunk = chunk;
    mR.mCurrentMemoryChunk = chunk;

    // sentinel node will not be executed
    Message *const msg = allocate<DummyMessage>(1);
    pushMessages();
    pullMessages();
    mR.mLastMessage = msg;
    --mR.mNewMessageCount;
}

void MessageQueue::kick() noexcept {
    pushMessages();
    mN.Signal();
}

void MessageQueue::kickAndWait() noexcept {
    EventSem event;
    EventSem *const pEvent = &event;

    ENQUEUE_MESSAGE_1(this, WaitUntilFinish,
                      pEvent, pEvent,
                      {
                          pEvent->Signal();
                      });

    kick();
    event.Wait();
}

void MessageQueue::runConsumerThread() noexcept {
    if (mWorkerAttached) {
        return;
    }

    std::thread consumerThread(&MessageQueue::consumerThreadLoop, this);
    consumerThread.detach();
    mWorkerAttached = true;
}

void MessageQueue::terminateConsumerThread() noexcept {
    if (!mWorkerAttached) {
        return;
    }

    EventSem event;
    EventSem *const pEvent = &event;

    ReaderContext *const pR = &mR;

    new (allocate<TerminateConsumerThreadMessage>(1)) TerminateConsumerThreadMessage(pEvent, pR);

    kick();
    event.Wait();
}

void MessageQueue::finishWriting(bool wait) noexcept {
    if (!mImmediateMode) {
        bool *const flushingFinished = &mR.mFlushingFinished;

        ENQUEUE_MESSAGE_1(this, finishWriting,
                          flushingFinished, flushingFinished,
                          {
                              *flushingFinished = true;
                          });

        if (wait) {
            kickAndWait();
        } else {
            kick();
        }
    }
}

void MessageQueue::recycleMemoryChunk(uint8_t *const chunk) const noexcept {
    MessageQueue::MemoryAllocator::getInstance().recycle(chunk, mFreeChunksByUser);
}

void MessageQueue::freeChunksInFreeQueue(MessageQueue *const mainMessageQueue) noexcept {
    MessageQueue::MemoryAllocator::getInstance().freeByUser(mainMessageQueue);
}

uint8_t *MessageQueue::allocateImpl(uint32_t &allocatedSize, uint32_t const requestSize) noexcept {
    uint32_t const alignedSize = align(requestSize, 16);
    assert(alignedSize + kSwitchChunkMemoryRequirement <= kMemoryChunkSize); // exceeds the block size

    uint32_t const newOffset = mW.mOffset + alignedSize;

    if (newOffset + kSwitchChunkMemoryRequirement <= kMemoryChunkSize) {
        allocatedSize = alignedSize;
        uint8_t *const allocatedMemory = mW.mCurrentMemoryChunk + mW.mOffset;
        mW.mOffset = newOffset;
        return allocatedMemory;
    } else {
        uint8_t *const newChunk = MessageQueue::MemoryAllocator::getInstance().request();
        MemoryChunkSwitchMessage *const switchMessage = reinterpret_cast<MemoryChunkSwitchMessage *>(mW.mCurrentMemoryChunk + mW.mOffset);
        new (switchMessage) MemoryChunkSwitchMessage(this, newChunk, mW.mCurrentMemoryChunk);
        switchMessage->mNext = reinterpret_cast<Message *>(newChunk); // point to start position
        mW.mLastMessage = switchMessage;
        ++mW.mPendingMessageCount;
        mW.mCurrentMemoryChunk = newChunk;
        mW.mOffset = 0;

        DummyMessage *const head = allocate<DummyMessage>(1);
        new (head) DummyMessage;

        if (mImmediateMode) {
            pushMessages();
            pullMessages();
            assert(mR.mNewMessageCount == 2);
            executeMessages();
            executeMessages();
        }

        return allocateImpl(allocatedSize, requestSize);
    }
}

void MessageQueue::pushMessages() noexcept {
    mW.mWrittenMessageCount.fetch_add(mW.mPendingMessageCount, std::memory_order_acq_rel);
    mW.mPendingMessageCount = 0;
}

void MessageQueue::pullMessages() noexcept {
    uint32_t const writtenMessageCountNew = mW.mWrittenMessageCount.load(std::memory_order_acquire);
    mR.mNewMessageCount += writtenMessageCountNew - mR.mWrittenMessageCountSnap;
    mR.mWrittenMessageCountSnap = writtenMessageCountNew;
}

void MessageQueue::flushMessages() noexcept {
    while (!mR.mFlushingFinished) {
        executeMessages();
    }

    mR.mFlushingFinished = false;
}

void MessageQueue::executeMessages() noexcept {
    Message *const msg = readMessage();

    if (!msg) {
        return;
    }

    msg->execute();
    msg->~Message();
}

Message *MessageQueue::readMessage() noexcept {
    while (!hasNewMessage()) { // if empty
        pullMessages();        // try pulling data from consumer

        if (!hasNewMessage()) { // still empty
            mN.Wait();          // wait for the producer to wake me up
            pullMessages();     // pulling again
        }
    }

    Message *const msg = mR.mLastMessage->getNext();
    mR.mLastMessage = msg;
    --mR.mNewMessageCount;
    assert(msg);
    return msg;
}

void MessageQueue::consumerThreadLoop() noexcept {
    while (!mR.mTerminateConsumerThread) {
        flushMessages();
    }

    mWorkerAttached = false;
}

char const *DummyMessage::getName() const noexcept {
    return "Dummy";
}

MemoryChunkSwitchMessage::MemoryChunkSwitchMessage(MessageQueue *const queue, uint8_t *const newChunk, uint8_t *const oldChunk) noexcept
: mMessageQueue(queue), mNewChunk(newChunk), mOldChunk(oldChunk) {
}

MemoryChunkSwitchMessage::~MemoryChunkSwitchMessage() {
    mMessageQueue->recycleMemoryChunk(mOldChunk);
}

void MemoryChunkSwitchMessage::execute() noexcept {
    mMessageQueue->mR.mCurrentMemoryChunk = mNewChunk;
    mMessageQueue->pullMessages();
}

char const *MemoryChunkSwitchMessage::getName() const noexcept {
    return "MemoryChunkSwitch";
}

TerminateConsumerThreadMessage::TerminateConsumerThreadMessage(EventSem *const pEvent, ReaderContext *const pR) noexcept
: mEvent(pEvent), mR(pR) {
}

void TerminateConsumerThreadMessage::execute() noexcept {
    mR->mTerminateConsumerThread = true;
    mR->mFlushingFinished = true;
    mEvent->Signal();
}

char const *TerminateConsumerThreadMessage::getName() const noexcept {
    return "TerminateConsumerThread";
}

} // namespace cc
