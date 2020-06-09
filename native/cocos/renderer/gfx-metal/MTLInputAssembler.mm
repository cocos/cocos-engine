#include "MTLStd.h"
#include "MTLInputAssembler.h"
#include "MTLCommands.h"
#include "MTLGPUObjects.h"
#include "MTLBuffer.h"

NS_CC_BEGIN

CCMTLInputAssembler::CCMTLInputAssembler(GFXDevice *device) : GFXInputAssembler(device) {}
CCMTLInputAssembler::~CCMTLInputAssembler() { destroy(); }

bool CCMTLInputAssembler::initialize(const GFXInputAssemblerInfo &info) {
    _attributes = info.attributes;
    _vertexBuffers = info.vertexBuffers;
    _indexBuffer = info.indexBuffer;
    _indirectBuffer = info.indirectBuffer;
    
    if (_indexBuffer)
        _indexCount = _indexBuffer->getCount();
    else if (_vertexBuffers.size())
        _vertexCount = _vertexBuffers[0]->getCount();
    
    _GPUInputAssembler = CC_NEW(CCMTLGPUInputAssembler);
    if (!_GPUInputAssembler)
        return false;
    
    if (info.indexBuffer)
        _GPUInputAssembler->mtlIndexBuffer = static_cast<CCMTLBuffer*>(info.indexBuffer)->getMTLBuffer();
    if (info.indirectBuffer)
        _GPUInputAssembler->mtlIndirectBuffer = static_cast<CCMTLBuffer*>(info.indirectBuffer)->getMTLBuffer();
    
    for (const auto& vertexBuffer : info.vertexBuffers)
        _GPUInputAssembler->mtlVertexBufers.push_back(static_cast<CCMTLBuffer*>(vertexBuffer)->getMTLBuffer() );
    
    _attributesHash = computeAttributesHash();
    _status = GFXStatus::SUCCESS;
    
    return true;
}

void CCMTLInputAssembler::destroy() {
    CC_SAFE_DELETE(_GPUInputAssembler);
    _status = GFXStatus::UNREADY;
}

void CCMTLInputAssembler::extractDrawInfo(CCMTLCmdDraw *cmd) const {
    cmd->drawInfo.vertexCount = _vertexCount;
    cmd->drawInfo.firstVertex = _firstVertex;
    cmd->drawInfo.indexCount = _indexCount;
    cmd->drawInfo.firstIndex = _firstIndex;
    cmd->drawInfo.vertexOffset = _vertexOffset;
    cmd->drawInfo.instanceCount = _instanceCount;
    cmd->drawInfo.firstInstance = _firstInstance;
}

NS_CC_END
