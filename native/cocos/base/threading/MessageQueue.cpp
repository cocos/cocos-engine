/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "MessageQueue.h"
#include "AutoReleasePool.h"
#include "base/Utils.h"

namespace cc {

namespace {
uint32_t constexpr MEMORY_CHUNK_POOL_CAPACITY      = 64;
uint32_t constexpr SWITCH_CHUNK_MEMORY_REQUIREMENT = sizeof(MemoryChunkSwitchMessage) + utils::ALIGN_TO<sizeof(DummyMessage), 16>;
} // namespace

MessageQueue::MemoryAllocator &MessageQueue::MemoryAllocator::getInstance() noexcept {
    static MessageQueue::MemoryAllocator instance;
    return instance;
}

uint8_t *MessageQueue::MemoryAllocator::request() noexcept {
    uint8_t *newChunk = nullptr;

    if (_chunkPool.try_dequeue(newChunk)) {
        _chunkCount.fetch_sub(1, std::memory_order_acq_rel);
    } else {
        newChunk = memoryAllocateForMultiThread<uint8_t>(MEMORY_CHUNK_SIZE);
    }

    return newChunk;
}

void MessageQueue::MemoryAllocator::recycle(uint8_t *const chunk, bool const freeByUser) noexcept {
    if (freeByUser) {
        _chunkFreeQueue.enqueue(chunk);
    } else {
        free(chunk);
    }
}

void MessageQueue::MemoryAllocator::freeByUser(MessageQueue *const mainMessageQueue) noexcept {
    auto *queue = &_chunkFreeQueue;

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
    if (_chunkCount.load(std::memory_order_acquire) >= MEMORY_CHUNK_POOL_CAPACITY) {
        memoryFreeForMultiThread(chunk);
    } else {
        _chunkPool.enqueue(chunk);
        _chunkCount.fetch_add(1, std::memory_order_acq_rel);
    }
}

MessageQueue::MessageQueue() {
    uint8_t *const chunk = MemoryAllocator::getInstance().request();

    _writer.currentMemoryChunk = chunk;
    _reader.currentMemoryChunk = chunk;

    // sentinel node will not be executed
    Message *const msg = allocate<DummyMessage>(1);
    pushMessages();
    pullMessages();
    _reader.lastMessage = msg;
    --_reader.newMessageCount;
}

void MessageQueue::kick() noexcept {
    pushMessages();
    _event.signal();
}

void MessageQueue::kickAndWait() noexcept {
    EventSem        event;
    EventSem *const pEvent = &event;

    ENQUEUE_MESSAGE_1(this, WaitUntilFinish,
                      pEvent, pEvent,
                      {
                          pEvent->signal();
                      });

    kick();
    event.wait();
}

void MessageQueue::runConsumerThread() noexcept {
    if (_immediateMode || _workerAttached) return;

    _reader.terminateConsumerThread = false;
    _reader.flushingFinished        = false;

    std::thread consumerThread(&MessageQueue::consumerThreadLoop, this);
    consumerThread.detach();
    _workerAttached = true;
}

void MessageQueue::terminateConsumerThread() noexcept {
    if (_immediateMode || !_workerAttached) return;

    EventSem        event;
    EventSem *const pEvent = &event;

    ReaderContext *const pR = &_reader;

    new (allocate<TerminateConsumerThreadMessage>(1)) TerminateConsumerThreadMessage(pEvent, pR);

    kick();
    event.wait();
}

void MessageQueue::finishWriting() noexcept {
    if (!_immediateMode) {
        bool *const flushingFinished = &_reader.flushingFinished;

        ENQUEUE_MESSAGE_1(this, finishWriting,
                          flushingFinished, flushingFinished,
                          {
                              *flushingFinished = true;
                          });

        kick();
    }
}

void MessageQueue::recycleMemoryChunk(uint8_t *const chunk) const noexcept {
    MessageQueue::MemoryAllocator::getInstance().recycle(chunk, _freeChunksByUser);
}

void MessageQueue::freeChunksInFreeQueue(MessageQueue *const mainMessageQueue) noexcept {
    MessageQueue::MemoryAllocator::getInstance().freeByUser(mainMessageQueue);
}

// NOLINTNEXTLINE(misc-no-recursion)
uint8_t *MessageQueue::allocateImpl(uint32_t allocatedSize, uint32_t const requestSize) noexcept {
    uint32_t const alignedSize = align(requestSize, 16);
    CCASSERT(alignedSize + SWITCH_CHUNK_MEMORY_REQUIREMENT <= MEMORY_CHUNK_SIZE, "block size exceeded");

    uint32_t const newOffset = _writer.offset + alignedSize;

    // newOffset contains the DummyMessage
    if (newOffset + sizeof(MemoryChunkSwitchMessage) <= MEMORY_CHUNK_SIZE) {
        uint8_t *const allocatedMemory = _writer.currentMemoryChunk + _writer.offset;
        _writer.offset                 = newOffset;
        return allocatedMemory;
    }
    uint8_t *const newChunk      = MessageQueue::MemoryAllocator::getInstance().request();
    auto *const    switchMessage = reinterpret_cast<MemoryChunkSwitchMessage *>(_writer.currentMemoryChunk + _writer.offset);
    new (switchMessage) MemoryChunkSwitchMessage(this, newChunk, _writer.currentMemoryChunk);
    switchMessage->_next = reinterpret_cast<Message *>(newChunk); // point to start position
    _writer.lastMessage  = switchMessage;
    ++_writer.pendingMessageCount;
    _writer.currentMemoryChunk = newChunk;
    _writer.offset             = 0;

    DummyMessage *const head = allocate<DummyMessage>(1);
    new (head) DummyMessage;

    if (_immediateMode) {
        pushMessages();
        pullMessages();
        assert(_reader.newMessageCount == 2);
        executeMessages();
        executeMessages();
    }

    return allocateImpl(allocatedSize, requestSize);
}

void MessageQueue::pushMessages() noexcept {
    _writer.writtenMessageCount.fetch_add(_writer.pendingMessageCount, std::memory_order_acq_rel);
    _writer.pendingMessageCount = 0;
}

void MessageQueue::pullMessages() noexcept {
    uint32_t const writtenMessageCountNew = _writer.writtenMessageCount.load(std::memory_order_acquire);
    _reader.newMessageCount += writtenMessageCountNew - _reader.writtenMessageCountSnap;
    _reader.writtenMessageCountSnap = writtenMessageCountNew;
}

void MessageQueue::flushMessages() noexcept {
    while (!_reader.flushingFinished) {
        executeMessages();
    }

    _reader.flushingFinished = false;
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
            _event.wait();      // wait for the producer to wake me up
            pullMessages();     // pulling again
        }
    }

    Message *const msg  = _reader.lastMessage->getNext();
    _reader.lastMessage = msg;
    --_reader.newMessageCount;
    assert(msg);
    return msg;
}

void MessageQueue::consumerThreadLoop() noexcept {
    while (!_reader.terminateConsumerThread) {
        AutoReleasePool autoReleasePool;
        flushMessages();
    }

    _workerAttached = false;
}

char const *DummyMessage::getName() const noexcept {
    return "Dummy";
}

MemoryChunkSwitchMessage::MemoryChunkSwitchMessage(MessageQueue *const queue, uint8_t *const newChunk, uint8_t *const oldChunk) noexcept
: _messageQueue(queue),
  _newChunk(newChunk),
  _oldChunk(oldChunk) {
}

MemoryChunkSwitchMessage::~MemoryChunkSwitchMessage() {
    _messageQueue->recycleMemoryChunk(_oldChunk);
}

void MemoryChunkSwitchMessage::execute() noexcept {
    _messageQueue->_reader.currentMemoryChunk = _newChunk;
    _messageQueue->pullMessages();
}

char const *MemoryChunkSwitchMessage::getName() const noexcept {
    return "MemoryChunkSwitch";
}

TerminateConsumerThreadMessage::TerminateConsumerThreadMessage(EventSem *const pEvent, ReaderContext *const pR) noexcept
: _event(pEvent),
  _reader(pR) {
}

void TerminateConsumerThreadMessage::execute() noexcept {
    _reader->terminateConsumerThread = true;
    _reader->flushingFinished        = true;
    _event->signal();
}

char const *TerminateConsumerThreadMessage::getName() const noexcept {
    return "TerminateConsumerThread";
}

} // namespace cc
