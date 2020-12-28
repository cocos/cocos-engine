#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3Commands.h"

namespace cc {
namespace gfx {

GLES3Buffer::GLES3Buffer(Device *device)
: Buffer(device) {
}

GLES3Buffer::~GLES3Buffer() {
}

bool GLES3Buffer::initialize(const BufferInfo &info) {
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _stride = std::max(info.stride, 1U);
    _count = _size / _stride;
    _flags = info.flags;

    if ((_flags & BufferFlagBit::BAKUP_BUFFER) && _size > 0) {
        _buffer = (uint8_t *)CC_MALLOC(_size);
        if (!_buffer) {
            CC_LOG_ERROR("GLES3Buffer: CC_MALLOC backup buffer failed.");
            return false;
        }
        _device->getMemoryStatus().bufferSize += _size;
    }

    _gpuBuffer = CC_NEW(GLES3GPUBuffer);
    if (!_gpuBuffer) {
        CC_LOG_ERROR("GLES3Buffer: CC_NEW GLES3GPUBuffer failed.");
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

    GLES3CmdFuncCreateBuffer((GLES3Device *)_device, _gpuBuffer);
    _device->getMemoryStatus().bufferSize += _size;
    
    return true;
}

bool GLES3Buffer::initialize(const BufferViewInfo &info) {

    _isBufferView = true;

    GLES3Buffer *buffer = (GLES3Buffer *)info.buffer;

    _usage = buffer->_usage;
    _memUsage = buffer->_memUsage;
    _size = _stride = info.range;
    _count = 1u;
    _flags = buffer->_flags;

    _gpuBuffer = CC_NEW(GLES3GPUBuffer);
    _gpuBuffer->usage = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size = _size;
    _gpuBuffer->stride = _stride;
    _gpuBuffer->count = _count;
    _gpuBuffer->glTarget = buffer->_gpuBuffer->glTarget;
    _gpuBuffer->glBuffer = buffer->_gpuBuffer->glBuffer;
    _gpuBuffer->glOffset = info.offset;
    _gpuBuffer->buffer = buffer->_gpuBuffer->buffer;
    _gpuBuffer->indirects = buffer->_gpuBuffer->indirects;

    return true;
}

void GLES3Buffer::destroy() {
    if (_gpuBuffer) {
        if (!_isBufferView) {
            GLES3CmdFuncDestroyBuffer((GLES3Device *)_device, _gpuBuffer);
            _device->getMemoryStatus().bufferSize -= _size;
        }
        CC_DELETE(_gpuBuffer);
        _gpuBuffer = nullptr;
    }

    if (_buffer) {
        CC_FREE(_buffer);
        _device->getMemoryStatus().bufferSize -= _size;
        _buffer = nullptr;
    }
}

void GLES3Buffer::resize(uint size) {
    CCASSERT(!_isBufferView, "Cannot resize buffer views");

    if (_size != size) {
        const uint oldSize = _size;
        _size = size;
        _count = _size / _stride;

        MemoryStatus &status = _device->getMemoryStatus();
        _gpuBuffer->size = _size;
        _gpuBuffer->count = _count;
        GLES3CmdFuncResizeBuffer((GLES3Device *)_device, _gpuBuffer);
        status.bufferSize -= oldSize;
        status.bufferSize += _size;

        if (_buffer) {
            const uint8_t *oldBuffer = _buffer;
            uint8_t *buffer = (uint8_t *)CC_MALLOC(_size);
            if (!buffer) {
                CC_LOG_ERROR("GLES3Buffer: CC_MALLOC resize backup buffer failed.");
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

void GLES3Buffer::update(void *buffer, uint size) {
    CCASSERT(!_isBufferView, "Cannot update through buffer views");

    if (_buffer) {
        memcpy(_buffer, buffer, size);
    }
    GLES3CmdFuncUpdateBuffer((GLES3Device *)_device, _gpuBuffer, buffer, 0u, size);
}

} // namespace gfx
} // namespace cc
