#include "MTLStd.h"
#include "MTLInputAssembler.h"
#include "MTLCommands.h"
#include "MTLGPUObjects.h"
#include "MTLBuffer.h"

NS_CC_BEGIN

CCMTLInputAssembler::CCMTLInputAssembler(GFXDevice* device) : GFXInputAssembler(device) {}
CCMTLInputAssembler::~CCMTLInputAssembler() { Destroy(); }

bool CCMTLInputAssembler::Initialize(const GFXInputAssemblerInfo& info)
{
    attributes_ = info.attributes;
    vertex_buffers_ = info.vertex_buffers;
    index_buffer_ = info.index_buffer;
    indirect_buffer_ = info.indirect_buffer;
    
    if (index_buffer_)
        index_count_ = index_buffer_->count();
    else if (vertex_buffers_.size())
        vertex_count_ = vertex_buffers_[0]->count();
    
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

void CCMTLInputAssembler::Destroy()
{
    CC_SAFE_DELETE(_GPUInputAssembler);
}

void CCMTLInputAssembler::extractDrawInfo(CCMTLCmdDraw* cmd) const
{
    cmd->drawInfo.vertex_count = vertex_count_;
    cmd->drawInfo.first_vertex = first_vertex_;
    cmd->drawInfo.index_count = index_count_;
    cmd->drawInfo.first_index = first_index_;
    cmd->drawInfo.vertex_offset = vertex_offset_;
    cmd->drawInfo.instance_count = instance_count_;
    cmd->drawInfo.first_instance = first_instance_;
}

NS_CC_END
