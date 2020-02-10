#include "GLES3Std.h"
#include "GLES3InputAssembler.h"
#include "GLES3Commands.h"
#include "GLES3Buffer.h"

NS_CC_BEGIN

GLES3InputAssembler::GLES3InputAssembler(GFXDevice* device)
    : GFXInputAssembler(device),
      gpu_input_assembler_(nullptr) {
}

GLES3InputAssembler::~GLES3InputAssembler() {
}

bool GLES3InputAssembler::initialize(const GFXInputAssemblerInfo &info) {
  
  _attributes = info.attributes;
  _vertexBuffers = info.vertex_buffers;
  _indexBuffer = info.index_buffer;
  _indirectBuffer = info.indirect_buffer;
  
  if (_indexBuffer) {
    _indexCount = _indexBuffer->count();
  } else if (_vertexBuffers.size()) {
    _vertexCount = _vertexBuffers[0]->count();
  }
  
  gpu_input_assembler_ = CC_NEW(GLES3GPUInputAssembler);
  gpu_input_assembler_->attribs = _attributes;
  gpu_input_assembler_->gpu_vertex_buffers.resize(_vertexBuffers.size());
  for (size_t i = 0; i < gpu_input_assembler_->gpu_vertex_buffers.size(); ++i) {
    GLES3Buffer* vb = (GLES3Buffer*)_vertexBuffers[i];
    gpu_input_assembler_->gpu_vertex_buffers[i] = vb->gpu_buffer();
  }
    if(info.index_buffer)
        gpu_input_assembler_->gpu_index_buffer = static_cast<GLES3Buffer*>(info.index_buffer)->gpu_buffer();
  
  GLES3CmdFuncCreateInputAssembler((GLES3Device*)_device, gpu_input_assembler_);
  
  return true;
}

void GLES3InputAssembler::destroy() {
  if (gpu_input_assembler_) {
    GLES3CmdFuncDestroyInputAssembler((GLES3Device*)_device, gpu_input_assembler_);
    CC_DELETE(gpu_input_assembler_);
    gpu_input_assembler_ = nullptr;
  }
}

void GLES3InputAssembler::ExtractCmdDraw(GLES3CmdDraw* cmd) {
  cmd->draw_info.vertex_count = _vertexCount;
  cmd->draw_info.first_vertex = _firstVertex;
  cmd->draw_info.index_count = _indexCount;
  cmd->draw_info.first_index = _firstIndex;
  cmd->draw_info.vertex_offset = _vertexOffset;
  cmd->draw_info.instance_count = _instanceCount;
  cmd->draw_info.first_instance = _firstInstance;
}

NS_CC_END
