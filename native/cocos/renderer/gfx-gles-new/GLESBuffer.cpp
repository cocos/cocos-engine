#include "GLESBuffer.h"

namespace cc::gfx::gles {

Buffer::Buffer() {
    _typedID = generateObjectID<decltype(this)>();
}

Buffer::~Buffer() {
    destroy();
}

void Buffer::update(const void *buffer, uint32_t size) {

}

void Buffer::initGPUBuffer(uint32_t size, uint32_t count) {
    auto *gpuBuffer = ccnew GPUBuffer();
    gpuBuffer->usage = _usage;
    gpuBuffer->size = size;
    gpuBuffer->count = count;
    gpuBuffer->stride = _stride;
    gpuBuffer->memoryUsage = hasFlag(_memUsage, MemoryUsageBit::HOST) ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW;
    gpuBuffer->initBuffer();

    _gpuBufferView = ccnew GPUBufferView();
    _gpuBufferView->buffer = gpuBuffer;
}

void Buffer::doInit(const BufferInfo &info) {
    initGPUBuffer(_size, _count);
}

void Buffer::doInit(const BufferViewInfo &info) {
    auto *source = static_cast<Buffer*>(info.buffer);

    _gpuBufferView = ccnew GPUBufferView();
    _gpuBufferView->buffer = source->_gpuBufferView->buffer;
    _gpuBufferView->range = info.range;
    _gpuBufferView->offset = info.offset;
}

void Buffer::doDestroy() {
    _gpuBufferView = nullptr;
}

void Buffer::doResize(uint32_t size, uint32_t count) {
    initGPUBuffer(size, count);
}

GPUBuffer::~GPUBuffer() noexcept {
    if (bufferId != 0) {
        glDeleteBuffers(1, &bufferId);
    }
}

void GPUBuffer::initBuffer() {
    if (hasFlag(usage, BufferUsageBit::VERTEX)) {
        target = GL_ARRAY_BUFFER;
    } else if (hasFlag(usage, BufferUsageBit::INDEX)) {
        target = GL_ELEMENT_ARRAY_BUFFER;
    } else if (hasFlag(usage, BufferUsageBit::UNIFORM)) {
        target = GL_UNIFORM_BUFFER;
    } else if (hasFlag(usage, BufferUsageBit::STORAGE)) {
        target = GL_SHADER_STORAGE_BUFFER;
    } else {
        target = GL_NONE;
    }

    if (size == 0) {
        return;
    }
    GL_CHECK(glGenBuffers(1, &bufferId));
    if (target != GL_NONE) {
        GL_CHECK(glBindBuffer(target, bufferId));
        GL_CHECK(glBufferData(target, size, nullptr, memoryUsage));
        GL_CHECK(glBindBuffer(target, 0));
    }

}
} // namespace cc::gfx::gles
