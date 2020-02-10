#include "GLES3Std.h"
#include "GLES3CommandBuffer.h"
#include "GLES3CommandAllocator.h"
#include "GLES3Framebuffer.h"
#include "GLES3PipelineState.h"
#include "GLES3BindingLayout.h"
#include "GLES3InputAssembler.h"
#include "GLES3Buffer.h"
#include "GLES3Texture.h"

NS_CC_BEGIN

GLES3CommandBuffer::GLES3CommandBuffer(GFXDevice* device)
    : GFXCommandBuffer(device),
      cmd_package_(nullptr),
      gles3_allocator_(nullptr),
      is_in_render_pass_(false),
      cur_gpu_pso_(nullptr),
      cur_gpu_bl_(nullptr),
      cur_gpu_ia_(nullptr),
      cur_line_width_(1.0f),
      is_state_invalid_(false) {
}

GLES3CommandBuffer::~GLES3CommandBuffer() {
}

bool GLES3CommandBuffer::initialize(const GFXCommandBufferInfo& info) {
  
  if (!info.allocator) {
    return false;
  }
  
  _allocator = info.allocator;
  gles3_allocator_ = (GLES3CommandAllocator*)info.allocator;
  _type = info.type;

  cmd_package_ = CC_NEW(GLES3CmdPackage);
  
  return true;
}

void GLES3CommandBuffer::destroy() {
  if (gles3_allocator_) {
    gles3_allocator_->clearCmds(cmd_package_);
    gles3_allocator_ = nullptr;
  }
  _allocator = nullptr;

  CC_SAFE_DELETE(cmd_package_);
}

void GLES3CommandBuffer::begin() {
  gles3_allocator_->clearCmds(cmd_package_);
  cur_gpu_pso_ = nullptr;
  cur_gpu_bl_ = nullptr;
  cur_gpu_ia_ = nullptr;
  _numDrawCalls = 0;
  _numTriangles = 0;
}

void GLES3CommandBuffer::end() {
  if (is_state_invalid_) {
    BindStates();
  }
  is_in_render_pass_ = false;
}

void GLES3CommandBuffer::beginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, GFXColor* colors, uint count, float depth, int stencil) {
  is_in_render_pass_ = true;
  
  GLES3CmdBeginRenderPass* cmd = gles3_allocator_->beginRenderPassCmdPool.alloc();
  cmd->gpu_fbo = ((GLES3Framebuffer*)fbo)->gpu_fbo();
  cmd->render_area = render_area;
  cmd->clear_flags = clear_flags;
  cmd->num_clear_colors = count;
  for (uint i = 0; i < count; ++i) {
    cmd->clear_colors[i] = colors[i];
  }
  cmd->clear_depth = depth;
  cmd->clear_stencil = stencil;
    cur_viewport_.left = render_area.x;
    cur_viewport_.top = render_area.y;
    cur_viewport_.width = render_area.width;
    cur_viewport_.height = render_area.height;
  cmd_package_->begin_render_pass_cmds.push(cmd);
  cmd_package_->cmd_types.push(GFXCmdType::BEGIN_RENDER_PASS);
}

void GLES3CommandBuffer::endRenderPass() {
  is_in_render_pass_ = false;
  cmd_package_->cmd_types.push(GFXCmdType::END_RENDER_PASS);
}

void GLES3CommandBuffer::bindPipelineState(GFXPipelineState* pso) {
  cur_gpu_pso_ = ((GLES3PipelineState*)pso)->gpu_pso();
  is_state_invalid_ = true;
}


void GLES3CommandBuffer::bindBindingLayout(GFXBindingLayout* layout) {
  cur_gpu_bl_ = ((GLES3BindingLayout*)layout)->gpu_binding_layout();
  is_state_invalid_ = true;
}

void GLES3CommandBuffer::bindInputAssembler(GFXInputAssembler* ia) {
  cur_gpu_ia_ = ((GLES3InputAssembler*)ia)->gpu_input_assembler();
  is_state_invalid_ = true;
}

void GLES3CommandBuffer::setViewport(const GFXViewport& vp) {
  
  if ((cur_viewport_.left != vp.left) ||
      (cur_viewport_.top != vp.top) ||
      (cur_viewport_.width != vp.width) ||
      (cur_viewport_.height != vp.height) ||
      math::IsNotEqualF(cur_viewport_.minDepth, vp.minDepth) ||
      math::IsNotEqualF(cur_viewport_.maxDepth, vp.maxDepth)) {
    cur_viewport_ = vp;
    is_state_invalid_ = true;
  }
}

void GLES3CommandBuffer::setScissor(const GFXRect& rect) {
  if ((cur_scissor_.x != rect.x) ||
      (cur_scissor_.y != rect.y) ||
      (cur_scissor_.width != rect.width) ||
      (cur_scissor_.height != rect.height)) {
    cur_scissor_ = rect;
    is_state_invalid_ = true;
  }
}

void GLES3CommandBuffer::setLineWidth(const float width) {
  if (math::IsNotEqualF(cur_line_width_, width)) {
    cur_line_width_ = width;
    is_state_invalid_ = true;
  }
}

void GLES3CommandBuffer::setDepthBias(float constant, float clamp, float slope) {
  if (math::IsNotEqualF(cur_depth_bias_.constant, constant) ||
      math::IsNotEqualF(cur_depth_bias_.clamp, clamp) ||
      math::IsNotEqualF(cur_depth_bias_.slope, slope)) {
    cur_depth_bias_.constant = constant;
    cur_depth_bias_.clamp = clamp;
    cur_depth_bias_.slope = slope;
    is_state_invalid_ = true;
  }
}

void GLES3CommandBuffer::setBlendConstants(const GFXColor& constants) {
  if (math::IsNotEqualF(cur_blend_constants_.r, constants.r) ||
      math::IsNotEqualF(cur_blend_constants_.g, constants.g) ||
      math::IsNotEqualF(cur_blend_constants_.b, constants.b) ||
      math::IsNotEqualF(cur_blend_constants_.a, constants.a)) {
    cur_blend_constants_.r = constants.r;
    cur_blend_constants_.g = constants.g;
    cur_blend_constants_.b = constants.b;
    cur_blend_constants_.a = constants.a;
    is_state_invalid_ = true;
  }
}

void GLES3CommandBuffer::setDepthBound(float min_bounds, float max_bounds) {
  if (math::IsNotEqualF(cur_depth_bounds_.min_bounds, min_bounds) ||
      math::IsNotEqualF(cur_depth_bounds_.max_bounds, max_bounds)) {
    cur_depth_bounds_.min_bounds = min_bounds;
    cur_depth_bounds_.max_bounds = max_bounds;
    is_state_invalid_ = true;
  }
}

void GLES3CommandBuffer::setStencilWriteMask(GFXStencilFace face, uint mask) {
  if ((cur_stencil_write_mask_.face != face) ||
      (cur_stencil_write_mask_.write_mask != mask)) {
    cur_stencil_write_mask_.face = face;
    cur_stencil_write_mask_.write_mask = mask;
    is_state_invalid_ = true;
  }
}

void GLES3CommandBuffer::setStencilCompareMask(GFXStencilFace face, int ref, uint mask) {
  if ((cur_stencil_compare_mask_.face != face) ||
      (cur_stencil_compare_mask_.refrence != ref) ||
      (cur_stencil_compare_mask_.compare_mask != mask)) {
    cur_stencil_compare_mask_.face = face;
    cur_stencil_compare_mask_.refrence = ref;
    cur_stencil_compare_mask_.compare_mask = mask;
    is_state_invalid_ = true;
  }
}

void GLES3CommandBuffer::draw(GFXInputAssembler* ia) {
  if ((_type == GFXCommandBufferType::PRIMARY && is_in_render_pass_) ||
      (_type == GFXCommandBufferType::SECONDARY)) {
    if (is_state_invalid_) {
      BindStates();
    }
    
    GLES3CmdDraw* cmd = gles3_allocator_->drawCmdPool.alloc();
    ((GLES3InputAssembler*)ia)->ExtractCmdDraw(cmd);
    cmd_package_->draw_cmds.push(cmd);
    cmd_package_->cmd_types.push(GFXCmdType::DRAW);
    
    ++_numDrawCalls;
    if(cur_gpu_pso_) {
      switch (cur_gpu_pso_->gl_primitive) {
        case GL_TRIANGLES: {
          _numTriangles += ia->indexCount() / 3 * std::max(ia->instanceCount(), 1U);
          break;
        }
        case GL_TRIANGLE_STRIP:
        case GL_TRIANGLE_FAN: {
          _numTriangles += (ia->indexCount() - 2) * std::max(ia->instanceCount(), 1U);
          break;
        }
        default:
          break;
      }
    }
  } else {
    CC_LOG_ERROR("Command 'draw' must be recorded inside a render pass.");
  }
}

void GLES3CommandBuffer::updateBuffer(GFXBuffer* buff, void* data, uint size, uint offset) {
  if ((_type == GFXCommandBufferType::PRIMARY && is_in_render_pass_) ||
      (_type == GFXCommandBufferType::SECONDARY)) {
    GLES3GPUBuffer* gpu_buffer = ((GLES3Buffer*)buff)->gpu_buffer();
    if (gpu_buffer) {
      GLES3CmdUpdateBuffer* cmd = gles3_allocator_->updateBufferCmdPool.alloc();
      cmd->gpu_buffer = gpu_buffer;
      cmd->buffer = (uint8_t*)data;
      cmd->size = size;
      cmd->offset = offset;
      
      cmd_package_->update_buffer_cmds.push(cmd);
      cmd_package_->cmd_types.push(GFXCmdType::UPDATE_BUFFER);
    }
  } else {
    CC_LOG_ERROR("Command 'updateBuffer' must be recorded inside a render pass.");
  }
}

void GLES3CommandBuffer::copyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, GFXBufferTextureCopy* regions, uint count) {
  if ((_type == GFXCommandBufferType::PRIMARY && is_in_render_pass_) ||
      (_type == GFXCommandBufferType::SECONDARY)) {
    GLES3GPUBuffer* gpu_buffer = ((GLES3Buffer*)src)->gpu_buffer();
    GLES3GPUTexture* gpu_texture = ((GLES3Texture*)dst)->gpu_texture();
    if (gpu_buffer && gpu_texture) {
      GLES3CmdCopyBufferToTexture* cmd = gles3_allocator_->copyBufferToTextureCmdPool.alloc();
      cmd->gpu_buffer = gpu_buffer;
      cmd->gpu_texture = gpu_texture;
      cmd->dst_layout = layout;
      cmd->regions.resize(count);
      for (uint i = 0; i < count; ++i) {
        cmd->regions[i] = regions[i];
      }
      
      cmd_package_->copy_buffer_to_texture_cmds.push(cmd);
      cmd_package_->cmd_types.push(GFXCmdType::COPY_BUFFER_TO_TEXTURE);
    }
  } else {
    CC_LOG_ERROR("Command 'copyBufferToTexture' must be recorded inside a render pass.");
  }
}

void GLES3CommandBuffer::execute(GFXCommandBuffer** cmd_buffs, uint count) {
  for (uint i = 0; i < count; ++i) {
    GLES3CommandBuffer* cmd_buff = (GLES3CommandBuffer*)cmd_buffs[i];
    
    for (uint j = 0; j < cmd_buff->cmd_package_->begin_render_pass_cmds.size(); ++j) {
      GLES3CmdBeginRenderPass* cmd = cmd_buff->cmd_package_->begin_render_pass_cmds[j];
      ++cmd->ref_count;
      cmd_buff->cmd_package_->begin_render_pass_cmds.push(cmd);
    }
    for (uint j = 0; j < cmd_buff->cmd_package_->bind_states_cmds.size(); ++j) {
      GLES3CmdBindStates* cmd = cmd_buff->cmd_package_->bind_states_cmds[j];
      ++cmd->ref_count;
      cmd_buff->cmd_package_->bind_states_cmds.push(cmd);
    }
    for (uint j = 0; j < cmd_buff->cmd_package_->draw_cmds.size(); ++j) {
      GLES3CmdDraw* cmd = cmd_buff->cmd_package_->draw_cmds[j];
      ++cmd->ref_count;
      cmd_buff->cmd_package_->draw_cmds.push(cmd);
    }
    for (uint j = 0; j < cmd_buff->cmd_package_->update_buffer_cmds.size(); ++j) {
      GLES3CmdUpdateBuffer* cmd = cmd_buff->cmd_package_->update_buffer_cmds[j];
      ++cmd->ref_count;
      cmd_buff->cmd_package_->update_buffer_cmds.push(cmd);
    }
    for (uint j = 0; j < cmd_buff->cmd_package_->copy_buffer_to_texture_cmds.size(); ++j) {
      GLES3CmdCopyBufferToTexture* cmd = cmd_buff->cmd_package_->copy_buffer_to_texture_cmds[j];
      ++cmd->ref_count;
      cmd_buff->cmd_package_->copy_buffer_to_texture_cmds.push(cmd);
    }
    cmd_package_->cmd_types.concat(cmd_buff->cmd_package_->cmd_types);
    
    _numDrawCalls += cmd_buff->numDrawCalls();
    _numTriangles += cmd_buff->numTris();
  }
}

void GLES3CommandBuffer::BindStates() {
  GLES3CmdBindStates* cmd = gles3_allocator_->bindStatesCmdPool.alloc();
  cmd->gpu_pso = cur_gpu_pso_;
  cmd->gpu_binding_layout = cur_gpu_bl_;
  cmd->gpu_ia = cur_gpu_ia_;
  cmd->viewport = cur_viewport_;
  cmd->scissor = cur_scissor_;
  cmd->line_width = cur_line_width_;
  cmd->depth_bias = cur_depth_bias_;
  cmd->blend_constants.r = cur_blend_constants_.r;
  cmd->blend_constants.g = cur_blend_constants_.g;
  cmd->blend_constants.b = cur_blend_constants_.b;
  cmd->blend_constants.a = cur_blend_constants_.a;
  cmd->depth_bounds = cur_depth_bounds_;
  cmd->stencil_write_mask = cur_stencil_write_mask_;
  cmd->stencil_compare_mask = cur_stencil_compare_mask_;
  
  cmd_package_->bind_states_cmds.push(cmd);
  cmd_package_->cmd_types.push(GFXCmdType::BIND_STATES);
  is_state_invalid_ = false;
}

NS_CC_END
