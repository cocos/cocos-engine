#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"

namespace cc {
namespace gfx {

CCVKBuffer::CCVKBuffer(Device *device)
: Buffer(device) {
}

CCVKBuffer::~CCVKBuffer() {
}

bool CCVKBuffer::initialize(const BufferInfo &info) {
    _usage = info.usage;
    _memUsage = info.memUsage;
    _size = info.size;
    _stride = std::max(info.stride, 1u);
    _count = _size / _stride;
    _flags = info.flags;

    if ((_flags & BufferFlagBit::BAKUP_BUFFER) && _size > 0) {
        _buffer = (uint8_t *)CC_MALLOC(_size);
        _device->getMemoryStatus().bufferSize += _size;
    }

    _gpuBuffer = CC_NEW(CCVKGPUBuffer);
    _gpuBuffer->usage = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size = _size;
    _gpuBuffer->stride = _stride;
    _gpuBuffer->count = _count;

    if (_usage & BufferUsageBit::INDIRECT) {
        const size_t drawInfoCount = _size / sizeof(DrawInfo);
        _gpuBuffer->indexedIndirectCmds.resize(drawInfoCount);
        _gpuBuffer->indirectCmds.resize(drawInfoCount);
    } else {
        _gpuBuffer->buffer = _buffer;
    }

    CCVKCmdFuncCreateBuffer((CCVKDevice *)_device, _gpuBuffer);
    _device->getMemoryStatus().bufferSize += _size;

    _gpuBufferView = CC_NEW(CCVKGPUBufferView);
    createBufferView();

    return true;
}

bool CCVKBuffer::initialize(const BufferViewInfo &info) {
    _isBufferView = true;

    CCVKBuffer *buffer = (CCVKBuffer *)info.buffer;

    _usage = buffer->_usage;
    _memUsage = buffer->_memUsage;
    _size = _stride = info.range;
    _count = 1u;
    _flags = buffer->_flags;
    _offset = info.offset;

    _gpuBuffer = ((CCVKBuffer*)info.buffer)->gpuBuffer();
    _gpuBufferView = CC_NEW(CCVKGPUBufferView);
    createBufferView();

    return true;
}

void CCVKBuffer::createBufferView() {
    _gpuBufferView->gpuBuffer = _gpuBuffer;
    _gpuBufferView->offset = _offset;
    _gpuBufferView->range = _size;
    ((CCVKDevice *)_device)->gpuDescriptorHub()->update(_gpuBufferView);
}

void CCVKBuffer::destroy() {
    if (_gpuBufferView) {
        ((CCVKDevice *)_device)->gpuDescriptorHub()->disengage(_gpuBufferView);
        CC_DELETE(_gpuBufferView);
        _gpuBufferView = nullptr;
    }

    if (_gpuBuffer) {
        if (!_isBufferView) {
            ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuBuffer);
            _device->getMemoryStatus().bufferSize -= _size;
            CC_DELETE(_gpuBuffer);
        }
        _gpuBuffer = nullptr;
    }

    if (_buffer) {
        CC_FREE(_buffer);
        _device->getMemoryStatus().bufferSize -= _size;
        _buffer = nullptr;
    }
}

void CCVKBuffer::resize(uint size) {
    CCASSERT(!_isBufferView, "Cannot resize buffer views");

    if (_size != size) {
        const uint oldSize = _size;
        _size = size;
        _count = _size / _stride;

        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuBuffer);

        _gpuBuffer->size = _size;
        _gpuBuffer->count = _count;
        CCVKCmdFuncCreateBuffer((CCVKDevice *)_device, _gpuBuffer);

        createBufferView();

        MemoryStatus &status = _device->getMemoryStatus();
        status.bufferSize -= oldSize;
        status.bufferSize += _size;

        if (_buffer) {
            const uint8_t *oldBuff = _buffer;
            _buffer = (uint8_t *)CC_MALLOC(_size);
            memcpy(_buffer, oldBuff, oldSize);
            CC_FREE(oldBuff);
            status.bufferSize -= oldSize;
            status.bufferSize += _size;
        }

        if (_usage & BufferUsageBit::INDIRECT) {
            const size_t drawInfoCount = _size / sizeof(DrawInfo);
            _gpuBuffer->indexedIndirectCmds.resize(drawInfoCount);
            _gpuBuffer->indirectCmds.resize(drawInfoCount);
        } else {
            _gpuBuffer->buffer = _buffer;
        }
    }
}

void CCVKBuffer::update(void *buffer, uint offset, uint size) {
    CCASSERT(!_isBufferView, "Cannot update through buffer views");

#if CC_DEBUG > 0
    if (_usage & BufferUsageBit::INDIRECT) {
        DrawInfo *drawInfo = static_cast<DrawInfo *>(buffer);
        const size_t drawInfoCount = size / sizeof(DrawInfo);
        const bool isIndexed = drawInfoCount > 0 && drawInfo->indexCount > 0;
        for (size_t i = 1u; i < drawInfoCount; i++) {
            if ((++drawInfo)->indexCount > 0 != isIndexed) {
                CC_LOG_WARNING("Inconsistent indirect draw infos on using index buffer");
                return;
            }
        }
    }
#endif

    if (_buffer) {
        memcpy(_buffer + offset, buffer, size);
    }
    CCVKCmdFuncUpdateBuffer((CCVKDevice *)_device, _gpuBuffer, buffer, offset, size);
}

} // namespace gfx
} // namespace cc
