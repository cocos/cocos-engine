#include "GLESBuffer.h"

namespace cc::gfx::gles {

enum class BufferAccessFrequency {
    STREAM = 0,
    STATIC,
    DYNAMIC
};

enum class BufferAccessNature {
    DRAW = 0,
    READ,
    COPY
};

/**
 *  freq\nature    STREAM,          STATIC,             DYNAMIC
 *  DRAW           GL_STREAM_DRAW   GL_STATIC_DRAW    GL_DYNAMIC_DRAW
 *  READ           GL_STREAM_READ   GL_STATIC_READ    GL_DYNAMIC_READ
 *  COPY           GL_STREAM_COPY   GL_STATIC_COPY    GL_DYNAMIC_COPY
 */
static GLenum BUFFER_USAGE_MAP[3][3] = {
    {GL_STREAM_DRAW, GL_STATIC_DRAW, GL_DYNAMIC_DRAW},
    {GL_STREAM_READ, GL_STATIC_READ, GL_DYNAMIC_READ},
    {GL_STREAM_COPY, GL_STATIC_COPY, GL_DYNAMIC_COPY},
};

Buffer::Buffer() {
    _typedID = generateObjectID<decltype(this)>();
}

Buffer::~Buffer() {
    destroy();
}

void Buffer::update(const void *buffer, uint32_t size) {
    if (_gpuBufferView) {
        _gpuBufferView->update(buffer, size);
    }
}

void Buffer::initGPUBuffer(uint32_t size, uint32_t count) {
    auto *gpuBuffer = ccnew GPUBuffer();
    gpuBuffer->usage = _usage;
    gpuBuffer->size = size;
    gpuBuffer->count = count;
    gpuBuffer->stride = _stride;
    gpuBuffer->memoryUsage = _memUsage;
    gpuBuffer->initBuffer();

    _gpuBufferView = ccnew GPUBufferView();
    _gpuBufferView->buffer = gpuBuffer;
    _gpuBufferView->offset = 0;
    _gpuBufferView->range = size;
}

void Buffer::doInit(const BufferInfo &info) {
    std::ignore = info;
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
    BufferAccessFrequency freq = BufferAccessFrequency::DYNAMIC;
    BufferAccessNature nat = BufferAccessNature::DRAW;

    if (hasFlag(usage, BufferUsageBit::VERTEX)) {
        target = GL_ARRAY_BUFFER;
    } else if (hasFlag(usage, BufferUsageBit::INDEX)) {
        target = GL_ELEMENT_ARRAY_BUFFER;
    } else if (hasFlag(usage, BufferUsageBit::UNIFORM)) {
        target = GL_UNIFORM_BUFFER;
    } else if (hasFlag(usage, BufferUsageBit::STORAGE)) {
        target = GL_SHADER_STORAGE_BUFFER;
    } else if (hasFlag(usage, BufferUsageBit::INDIRECT)){
        target = GL_ARRAY_BUFFER; //
    } else if (hasFlag(usage, BufferUsageBit::TRANSFER_DST)) {
        target = GL_COPY_READ_BUFFER;
        nat = BufferAccessNature::READ;
    } else {
        target = GL_COPY_WRITE_BUFFER;
        nat = BufferAccessNature::COPY;
    }

    if (size == 0) {
        return;
    }

    if (!hasFlag(memoryUsage, MemoryUsageBit::HOST)) {
        freq = BufferAccessFrequency::STATIC;
    }
    GLenum usage = BUFFER_USAGE_MAP[static_cast<int32_t>(nat)][static_cast<int32_t>(freq)];
    GL_CHECK(glGenBuffers(1, &bufferId));
    if (target != GL_NONE) {
        GL_CHECK(glBindBuffer(target, bufferId));
        GL_CHECK(glBufferData(target, size, nullptr, usage));
        GL_CHECK(glBindBuffer(target, 0));
    }
}

void GPUBufferView::update(const void *src, uint32_t size) {
    GL_CHECK(glBindBuffer(buffer->target, buffer->bufferId));
    if (hasFlag(buffer->memoryUsage, MemoryUsageBit::HOST)) {
        void *mappedAddress = nullptr;
        GL_CHECK(mappedAddress = glMapBufferRange(buffer->target, offset, range, GL_MAP_WRITE_BIT | GL_MAP_INVALIDATE_BUFFER_BIT));
        if (mappedAddress != nullptr) {
            memcpy(mappedAddress, buffer, size);
            GL_CHECK(glUnmapBuffer(buffer->target));
            return;
        }
    }

    GL_CHECK(glBufferSubData(buffer->target, offset, size, src));
}
} // namespace cc::gfx::gles
