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

bool GLES3InputAssembler::Initialize(const GFXInputAssemblerInfo &info) {
  
  attributes_ = info.attributes;
  vertex_buffers_ = info.vertex_buffers;
  index_buffer_ = info.index_buffer;
  indirect_buffer_ = info.indirect_buffer;
  
  if (index_buffer_) {
    index_count_ = index_buffer_->count();
  } else if (vertex_buffers_.size()) {
    vertex_count_ = vertex_buffers_[0]->count();
  }
  
  gpu_input_assembler_ = CC_NEW(GLES3GPUInputAssembler);
  gpu_input_assembler_->attribs = attributes_;
  gpu_input_assembler_->gpu_vertex_buffers.resize(vertex_buffers_.size());
  for (size_t i = 0; i < gpu_input_assembler_->gpu_vertex_buffers.size(); ++i) {
    GLES3Buffer* vb = (GLES3Buffer*)vertex_buffers_[i];
    gpu_input_assembler_->gpu_vertex_buffers[i] = vb->gpu_buffer();
  }
  
  GLES3CmdFuncCreateInputAssembler((GLES3Device*)device_, gpu_input_assembler_);
  
  return true;
}

void GLES3InputAssembler::Destroy() {
  if (gpu_input_assembler_) {
    GLES3CmdFuncDestroyInputAssembler((GLES3Device*)device_, gpu_input_assembler_);
    CC_DELETE(gpu_input_assembler_);
    gpu_input_assembler_ = nullptr;
  }
}

void GLES3InputAssembler::ExtractCmdDraw(GLES3CmdDraw* cmd) {
  cmd->draw_info.vertex_count = vertex_count_;
  cmd->draw_info.first_vertex = first_vertex_;
  cmd->draw_info.index_count = index_count_;
  cmd->draw_info.first_index = first_index_;
  cmd->draw_info.vertex_offset = vertex_offset_;
  cmd->draw_info.instance_count = instance_count_;
  cmd->draw_info.first_instance = first_instance_;
}

NS_CC_END
