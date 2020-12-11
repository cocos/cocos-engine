#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLCommands.h"
#include "MTLGPUObjects.h"
#include "MTLInputAssembler.h"

namespace cc {
namespace gfx {

CCMTLInputAssembler::CCMTLInputAssembler(Device *device) : InputAssembler(device) {}

bool CCMTLInputAssembler::initialize(const InputAssemblerInfo &info) {
    _attributes = info.attributes;
    _vertexBuffers = info.vertexBuffers;
    _indexBuffer = info.indexBuffer;
    _indirectBuffer = info.indirectBuffer;

    if (_indexBuffer) {
        _indexCount = _indexBuffer->getCount();
        _firstIndex = 0;
    } else if (_vertexBuffers.size()) {
        _vertexCount = _vertexBuffers[0]->getCount();
        _firstVertex = 0;
        _vertexOffset = 0;
    }

    _GPUInputAssembler = CC_NEW(CCMTLGPUInputAssembler);
    if (!_GPUInputAssembler)
        return false;

    if (info.indexBuffer) {
        _GPUInputAssembler->mtlIndexBuffer = static_cast<CCMTLBuffer *>(info.indexBuffer)->getMTLBuffer();
    }
    if (info.indirectBuffer)
        _GPUInputAssembler->mtlIndirectBuffer = static_cast<CCMTLBuffer *>(info.indirectBuffer)->getMTLBuffer();

    for (const auto &vertexBuffer : info.vertexBuffers)
        _GPUInputAssembler->mtlVertexBufers.push_back(static_cast<CCMTLBuffer *>(vertexBuffer)->getMTLBuffer());

    _attributesHash = computeAttributesHash();

    return true;
}

void CCMTLInputAssembler::destroy() {
    CC_SAFE_DELETE(_GPUInputAssembler);
}

} // namespace gfx
} // namespace cc
