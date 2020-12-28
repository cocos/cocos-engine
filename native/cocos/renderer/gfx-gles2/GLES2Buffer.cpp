#include "GLES2Std.h"

#include "GLES2Buffer.h"
#include "GLES2Commands.h"

namespace cc {
namespace gfx {

GLES2Buffer::GLES2Buffer(Device *device)
: Buffer(device) {
}

GLES2Buffer::~GLES2Buffer() {
}

bool GLES2Buffer::initialize(const BufferInfo &info) {

    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _stride = std::max(info.stride, 1u);
    _count = _size / _stride;
    _flags = info.flags;

    if ((_flags & BufferFlagBit::BAKUP_BUFFER) && _size > 0) {
        _buffer = (uint8_t *)CC_MALLOC(_size);
        if (!_buffer) {
            CC_LOG_ERROR("GLES2Buffer: CC_MALLOC backup buffer faild.");
            return false;
        }
        _device->getMemoryStatus().bufferSize += _size;
    }

    _gpuBuffer = CC_NEW(GLES2GPUBuffer);
    if (!_gpuBuffer) {
        CC_LOG_ERROR("GLES2Buffer: CC_NEW GLES2GPUBuffer failed.");
        return false;
    }
    _gpuBuffer->usage = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size = _size;
    _gpuBuffer->stride = _stride;
    _gpuBuffer->count = _count;

    if (_usage & BufferUsageBit::INDIRECT) {
        _gpuBuffer->indirects.resize(_count);
    } else {
        _gpuBuffer->buffer = _buffer;
    }

    GLES2CmdFuncCreateBuffer((GLES2Device *)_device, _gpuBuffer);
    _device->getMemoryStatus().bufferSize += _size;

    return true;
}

bool GLES2Buffer::initialize(const BufferViewInfo &info) {

    _isBufferView = true;

    GLES2Buffer *buffer = (GLES2Buffer *)info.buffer;

    _usage = buffer->_usage;
    _memUsage = buffer->_memUsage;
    _size = _stride = info.range;
    _count = 1u;
    _flags = buffer->_flags;

    _gpuBufferView = CC_NEW(GLES2GPUBufferView);
    _gpuBufferView->gpuBuffer = buffer->gpuBuffer();
    _gpuBufferView->range = _size;
    _gpuBufferView->offset = info.offset;

    return true;
}

void GLES2Buffer::destroy() {
    if (_gpuBuffer) {
        GLES2CmdFuncDestroyBuffer((GLES2Device *)_device, _gpuBuffer);
        _device->getMemoryStatus().bufferSize -= _size;
        CC_DELETE(_gpuBuffer);
        _gpuBuffer = nullptr;
    }

    CC_SAFE_DELETE(_gpuBufferView);

    if (_buffer) {
        CC_FREE(_buffer);
        _device->getMemoryStatus().bufferSize -= _size;
        _buffer = nullptr;
    }
}

void GLES2Buffer::resize(uint size) {
    CCASSERT(!_isBufferView, "Cannot resize buffer views");

    if (_size != size) {
        const uint oldSize = _size;
        _size = size;
        _count = _size / _stride;

        MemoryStatus &status = _device->getMemoryStatus();
        _gpuBuffer->size = _size;
        _gpuBuffer->count = _count;
        GLES2CmdFuncResizeBuffer((GLES2Device *)_device, _gpuBuffer);
        status.bufferSize -= oldSize;
        status.bufferSize += _size;

        if (_buffer) {
            const uint8_t *oldBuffer = _buffer;
            uint8_t *buffer = (uint8_t *)CC_MALLOC(_size);
            if (!buffer) {
                CC_LOG_ERROR("GLES2Buffer: CC_MALLOC backup buffer failed.");
                return;
            }
            memcpy(buffer, oldBuffer, std::min(oldSize, size));
            _buffer = buffer;
            CC_FREE(oldBuffer);
            status.bufferSize -= oldSize;
            status.bufferSize += _size;
        }
    }
}

void GLES2Buffer::update(void *buffer, uint size) {
    CCASSERT(!_isBufferView, "Cannot update through buffer views");
    CCASSERT(size != 0, "Should not update buffer with 0 bytes of data");
    CCASSERT(buffer, "Buffer should not be nullptr");

    if (_buffer) {
        memcpy(_buffer, buffer, size);
    }
    GLES2CmdFuncUpdateBuffer((GLES2Device *)_device, _gpuBuffer, buffer, 0u, size);
}

} // namespace gfx
} // namespace cc
