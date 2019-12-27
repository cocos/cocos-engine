#include "GLES2Std.h"
#include "GLES2InputAssembler.h"
#include "GLES2Commands.h"
#include "GLES2Buffer.h"

NS_CC_BEGIN

GLES2InputAssembler::GLES2InputAssembler(GFXDevice* device)
    : GFXInputAssembler(device),
      gpu_input_assembler_(nullptr) {
}

GLES2InputAssembler::~GLES2InputAssembler() {
}

bool GLES2InputAssembler::Initialize(const GFXInputAssemblerInfo &info) {
  
  attributes_ = info.attributes;
  vertex_buffers_ = info.vertex_buffers;
  index_buffer_ = info.index_buffer;
  indirect_buffer_ = info.indirect_buffer;
  
  if (index_buffer_) {
    index_count_ = index_buffer_->count();
  } else if (vertex_buffers_.size()) {
    vertex_count_ = vertex_buffers_[0]->count();
  }
  
  gpu_input_assembler_ = CC_NEW(GLES2GPUInputAssembler);
  gpu_input_assembler_->attribs = attributes_;
  gpu_input_assembler_->gpu_vertex_buffers.resize(vertex_buffers_.size());
  for (size_t i = 0; i < gpu_input_assembler_->gpu_vertex_buffers.size(); ++i) {
    GLES2Buffer* vb = (GLES2Buffer*)vertex_buffers_[i];
    gpu_input_assembler_->gpu_vertex_buffers[i] = vb->gpu_buffer();
  }
    if(info.index_buffer)
        gpu_input_assembler_->gpu_index_buffer = static_cast<GLES2Buffer*>(info.index_buffer)->gpu_buffer();
  
  GLES2CmdFuncCreateInputAssembler((GLES2Device*)device_, gpu_input_assembler_);
  
  return true;
}

void GLES2InputAssembler::Destroy() {
  if (gpu_input_assembler_) {
    GLES2CmdFuncDestroyInputAssembler((GLES2Device*)device_, gpu_input_assembler_);
    CC_DELETE(gpu_input_assembler_);
    gpu_input_assembler_ = nullptr;
  }
}

void GLES2InputAssembler::ExtractCmdDraw(GLES2CmdDraw* cmd) {
  cmd->draw_info.vertex_count = vertex_count_;
  cmd->draw_info.first_vertex = first_vertex_;
  cmd->draw_info.index_count = index_count_;
  cmd->draw_info.first_index = first_index_;
  cmd->draw_info.vertex_offset = vertex_offset_;
  cmd->draw_info.instance_count = instance_count_;
  cmd->draw_info.first_instance = first_instance_;
}

NS_CC_END
