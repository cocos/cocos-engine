#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommands.h"

namespace cc {

CCVKBuffer::CCVKBuffer(GFXDevice *device)
: GFXBuffer(device) {
}

CCVKBuffer::~CCVKBuffer() {
}

bool CCVKBuffer::initialize(const GFXBufferInfo &info) {
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _stride = std::max(info.stride, 1u);
    _count = _size / _stride;
    _flags = info.flags;

    if ((_flags & GFXBufferFlagBit::BAKUP_BUFFER) && _size > 0) {
        _buffer = (uint8_t *)CC_MALLOC(_size);
        _device->getMemoryStatus().bufferSize += _size;
    }

    _gpuBuffer = CC_NEW(CCVKGPUBuffer);
    _gpuBuffer->usage = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size = _size;
    _gpuBuffer->stride = _stride;
    _gpuBuffer->count = _count;

    if (!(_usage & GFXBufferUsageBit::INDIRECT)) {
        _gpuBuffer->buffer = _buffer;
    }

    CCVKCmdFuncCreateBuffer((CCVKDevice *)_device, _gpuBuffer);
    _device->getMemoryStatus().bufferSize += _size;
    _status = GFXStatus::SUCCESS;

    return true;
}

void CCVKBuffer::destroy() {
    if (_gpuBuffer) {
        CCVKCmdFuncDestroyBuffer((CCVKDevice *)_device, _gpuBuffer);
        _device->getMemoryStatus().bufferSize -= _size;
        CC_DELETE(_gpuBuffer);
        _gpuBuffer = nullptr;
    }

    if (_buffer) {
        CC_FREE(_buffer);
        _device->getMemoryStatus().bufferSize -= _size;
        _buffer = nullptr;
    }

    _status = GFXStatus::UNREADY;
}

void CCVKBuffer::resize(uint size) {
    if (_size != size) {
        const uint old_size = _size;
        _size = size;
        _count = _size / _stride;

        GFXMemoryStatus &status = _device->getMemoryStatus();
        _gpuBuffer->size = _size;
        _gpuBuffer->count = _count;
        CCVKCmdFuncResizeBuffer((CCVKDevice *)_device, _gpuBuffer);
        status.bufferSize -= old_size;
        status.bufferSize += _size;

        if (_buffer) {
            const uint8_t *old_buff = _buffer;
            _buffer = (uint8_t *)CC_MALLOC(_size);
            memcpy(_buffer, old_buff, old_size);
            CC_FREE(_buffer);
            status.bufferSize -= old_size;
            status.bufferSize += _size;
        }
    }
}

void CCVKBuffer::update(void *buffer, uint offset, uint size) {
    if (_buffer) {
        memcpy(_buffer + offset, buffer, size);
    }
    CCVKCmdFuncUpdateBuffer((CCVKDevice *)_device, _gpuBuffer, buffer, offset, size);
}

}
