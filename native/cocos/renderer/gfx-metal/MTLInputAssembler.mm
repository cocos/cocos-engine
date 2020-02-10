#include "MTLStd.h"
#include "MTLInputAssembler.h"
#include "MTLCommands.h"
#include "MTLGPUObjects.h"
#include "MTLBuffer.h"

NS_CC_BEGIN

CCMTLInputAssembler::CCMTLInputAssembler(GFXDevice* device) : GFXInputAssembler(device) {}
CCMTLInputAssembler::~CCMTLInputAssembler() { destroy(); }

bool CCMTLInputAssembler::initialize(const GFXInputAssemblerInfo& info)
{
    _attributes = info.attributes;
    _vertexBuffers = info.vertex_buffers;
    _indexBuffer = info.index_buffer;
    _indirectBuffer = info.indirect_buffer;
    
    if (_indexBuffer)
        _indexCount = _indexBuffer->count();
    else if (_vertexBuffers.size())
        _vertexCount = _vertexBuffers[0]->count();
    
    _GPUInputAssembler = CC_NEW(CCMTLGPUInputAssembler);
    if (!_GPUInputAssembler)
        return false;
    
    if (info.index_buffer)
        _GPUInputAssembler->mtlIndexBuffer = static_cast<CCMTLBuffer*>(info.index_buffer)->getMTLBuffer();
    if (info.indirect_buffer)
        _GPUInputAssembler->mtlIndirectBuffer = static_cast<CCMTLBuffer*>(info.indirect_buffer)->getMTLBuffer();
    
    for (const auto& vertexBuffer : info.vertex_buffers)
        _GPUInputAssembler->mtlVertexBufers.push_back(static_cast<CCMTLBuffer*>(vertexBuffer)->getMTLBuffer() );
    
    return true;
}

void CCMTLInputAssembler::destroy()
{
    CC_SAFE_DELETE(_GPUInputAssembler);
}

void CCMTLInputAssembler::extractDrawInfo(CCMTLCmdDraw* cmd) const
{
    cmd->drawInfo.vertex_count = _vertexCount;
    cmd->drawInfo.first_vertex = _firstVertex;
    cmd->drawInfo.index_count = _indexCount;
    cmd->drawInfo.first_index = _firstIndex;
    cmd->drawInfo.vertex_offset = _vertexOffset;
    cmd->drawInfo.instance_count = _instanceCount;
    cmd->drawInfo.first_instance = _firstInstance;
}

NS_CC_END
