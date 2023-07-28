#include "GLESBuffer.h"
#include "GLESCommands.h"
#include "GLESDevice.h"

namespace cc::gfx {

GLESBuffer::GLESBuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESBuffer::~GLESBuffer() {
    destroy();
}

void GLESBuffer::doInit(const BufferInfo & /*info*/) {
    _gpuBufferView = ccnew GLESGPUBufferView;
    _gpuBufferView->offset = 0;
    _gpuBufferView->range = _size;

    _gpuBufferView->gpuBuffer = ccnew GLESGPUBuffer;
    _gpuBufferView->gpuBuffer->usage = _usage;
    _gpuBufferView->gpuBuffer->memUsage = _memUsage;
    _gpuBufferView->gpuBuffer->size = _size;
    _gpuBufferView->stride = _stride;

    glesCreateBuffer(GLESDevice::getInstance(), _gpuBufferView->gpuBuffer);
}

void GLESBuffer::doInit(const BufferViewInfo &info) {
    auto *buffer = static_cast<GLESBuffer *>(info.buffer);
    _gpuBufferView = ccnew GLESGPUBufferView;
    _gpuBufferView->gpuBuffer = buffer->_gpuBufferView->gpuBuffer;
    _gpuBufferView->offset = info.offset;
    _gpuBufferView->range = info.range;
    _gpuBufferView->stride = _stride;
}

void GLESBuffer::doDestroy() {
    _gpuBufferView = nullptr;
}

void GLESBuffer::doResize(uint32_t size, uint32_t  /*count*/) {
    _gpuBufferView->gpuBuffer->size = size;
    _gpuBufferView->range = size;
    glesResizeBuffer(GLESDevice::getInstance(), _gpuBufferView->gpuBuffer);
}

void GLESBuffer::update(const void *buffer, uint32_t size) {
    auto *gpuBuffer = _gpuBufferView->gpuBuffer.get();

    auto *queue = GLESDevice::getInstance()->getQueue(QueueType::GRAPHICS);
    if (queue->isAsyncQueue()) {
        uint8_t *tmp = GLESDevice::getInstance()->stagingBuffer()->allocate(size);
        memcpy(tmp, buffer, size);
        GLESDevice::getInstance()->getQueue(QueueType::GRAPHICS)->queueTask(
                [=]() {
                    glesUpdateBuffer(GLESDevice::getInstance(), gpuBuffer, tmp, 0, size, true, true);
                });
    } else {
        glesUpdateBuffer(GLESDevice::getInstance(), gpuBuffer, buffer, 0, size, true, true);
    }
}

GLESGPUBuffer::~GLESGPUBuffer() {
    GLESDevice::getInstance()->recycleBin()->collect(this);
}

} // namespace cc::gfx
