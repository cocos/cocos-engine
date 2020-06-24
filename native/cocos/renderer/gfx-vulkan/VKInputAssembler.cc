#include "VKStd.h"

#include "VKBuffer.h"
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

    if (_indexBuffer) {
        _indexCount = _indexBuffer->getCount();
    } else if (_vertexBuffers.size()) {
        _vertexCount = _vertexBuffers[0]->getCount();
    }

    _gpuInputAssembler = CC_NEW(CCVKGPUInputAssembler);
    _gpuInputAssembler->attributes = _attributes;
    _gpuInputAssembler->gpuVertexBuffers.resize(_vertexBuffers.size());

    for (size_t i = 0u; i < _gpuInputAssembler->gpuVertexBuffers.size(); ++i) {
        CCVKBuffer *vb = (CCVKBuffer *)_vertexBuffers[i];
        _gpuInputAssembler->gpuVertexBuffers[i] = vb->gpuBuffer();
    }

    if (info.indexBuffer) {
        _gpuInputAssembler->gpuIndexBuffer = static_cast<CCVKBuffer *>(info.indexBuffer)->gpuBuffer();
    }

    if (info.indirectBuffer) {
        _gpuInputAssembler->gpuIndirectBuffer = static_cast<CCVKBuffer *>(info.indirectBuffer)->gpuBuffer();
    }

    CCVKCmdFuncCreateInputAssembler((CCVKDevice *)_device, _gpuInputAssembler);
    _attributesHash = computeAttributesHash();
    _status = Status::SUCCESS;

    return true;
}

void CCVKInputAssembler::destroy() {
    if (_gpuInputAssembler) {
        CCVKCmdFuncDestroyInputAssembler((CCVKDevice *)_device, _gpuInputAssembler);
        CC_DELETE(_gpuInputAssembler);
        _gpuInputAssembler = nullptr;
    }

    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
