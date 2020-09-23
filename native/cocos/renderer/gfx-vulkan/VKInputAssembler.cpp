#include "VKStd.h"

#include "VKBuffer.h"
#include "VKDevice.h"
#include "VKCommands.h"
#include "VKInputAssembler.h"

namespace cc {
namespace gfx {

CCVKInputAssembler::CCVKInputAssembler(Device *device)
: InputAssembler(device) {
}

CCVKInputAssembler::~CCVKInputAssembler() {
}

bool CCVKInputAssembler::initialize(const InputAssemblerInfo &info) {
    _attributes = info.attributes;
    _vertexBuffers = info.vertexBuffers;
    _indexBuffer = info.indexBuffer;
    _indirectBuffer = info.indirectBuffer;
    size_t vbCount = _vertexBuffers.size();

    if (_indexBuffer) {
        _indexCount = _indexBuffer->getCount();
        _firstIndex = 0;
    } else if (_vertexBuffers.size()) {
        _vertexCount = _vertexBuffers[0]->getCount();
        _firstVertex = 0;
        _vertexOffset = 0;
    }

    _gpuInputAssembler = CC_NEW(CCVKGPUInputAssembler);
    _gpuInputAssembler->attributes = _attributes;
    _gpuInputAssembler->gpuVertexBuffers.resize(vbCount);

    for (size_t i = 0u; i < vbCount; ++i) {
        CCVKBuffer *vb = (CCVKBuffer *)_vertexBuffers[i];
        _gpuInputAssembler->gpuVertexBuffers[i] = vb->gpuBuffer();
    }

    if (info.indexBuffer) {
        _gpuInputAssembler->gpuIndexBuffer = static_cast<CCVKBuffer *>(info.indexBuffer)->gpuBuffer();
    }

    if (info.indirectBuffer) {
        _gpuInputAssembler->gpuIndirectBuffer = static_cast<CCVKBuffer *>(info.indirectBuffer)->gpuBuffer();
    }

    _gpuInputAssembler->vertexBuffers.resize(vbCount);
    _gpuInputAssembler->vertexBufferOffsets.resize(vbCount);

    for (size_t i = 0u; i < vbCount; i++) {
        _gpuInputAssembler->vertexBuffers[i] = _gpuInputAssembler->gpuVertexBuffers[i]->vkBuffer;
        _gpuInputAssembler->vertexBufferOffsets[i] = _gpuInputAssembler->gpuVertexBuffers[i]->startOffset;
    }

    _attributesHash = computeAttributesHash();

    return true;
}

void CCVKInputAssembler::destroy() {
    if (_gpuInputAssembler) {
        _gpuInputAssembler->vertexBuffers.clear();
        _gpuInputAssembler->vertexBufferOffsets.clear();
        CC_DELETE(_gpuInputAssembler);
        _gpuInputAssembler = nullptr;
    }
}

} // namespace gfx
} // namespace cc
