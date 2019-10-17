#include "GLES2Std.h"
#include "GLES2Texture.h"
#include "GLES2Commands.h"

CC_NAMESPACE_BEGIN

GLES2Texture::GLES2Texture(GFXDevice* device)
    : GFXTexture(device),
      gpu_texture_(nullptr) {
}

GLES2Texture::~GLES2Texture() {
}

bool GLES2Texture::Initialize(const GFXTextureInfo &info) {
  
  type_ = info.type;
  usage_ = info.usage;
  format_ = info.format;
  width_ = info.width;
  height_ = info.height;
  depth_ = info.depth;
  array_layer_ = info.array_layer;
  mip_level_ = info.mip_level;
  samples_ = info.samples;
  flags_ = info.flags;
  size_ = GFXFormatSize(format_, width_, height_, depth_);
  
  if (flags_ & GFXTextureFlags::BAKUP_BUFFER) {
    buffer_ = (uint8_t*)CC_MALLOC(size_);
    device_->mem_status().texture_size += size_;
  }
  
  gpu_texture_ = CC_NEW(GLES2GPUTexture);
  gpu_texture_->type = type_;
  
  switch (type_) {
    case GFXTextureType::TEX1D: {
      if (array_layer_) {
        gpu_texture_->view_type = array_layer_ <= 1 ? GFXTextureViewType::TV1D : GFXTextureViewType::TV1D_ARRAY;
      } else {
        gpu_texture_->view_type = GFXTextureViewType::TV1D;
      }
      break;
    }
    case GFXTextureType::TEX2D: {
      if (array_layer_) {
        if (array_layer_ <= 1) {
          gpu_texture_->view_type = GFXTextureViewType::TV2D;
        } else if (flags_ & GFXTextureFlagBit::CUBEMAP) {
          gpu_texture_->view_type = GFXTextureViewType::CUBE;
        } else {
          gpu_texture_->view_type = GFXTextureViewType::TV2D_ARRAY;
        }
      } else {
        gpu_texture_->view_type = GFXTextureViewType::TV2D;
      }
      break;
    }
    case GFXTextureType::TEX3D: {
      gpu_texture_->view_type = GFXTextureViewType::TV3D;
      break;
    }
    default: {
      gpu_texture_->view_type = GFXTextureViewType::TV2D;
    }
  }
  
  gpu_texture_->format = format_;
  gpu_texture_->usage = usage_;
  gpu_texture_->width = width_;
  gpu_texture_->height = height_;
  gpu_texture_->depth = depth_;
  gpu_texture_->size = size_;
  gpu_texture_->array_layer = array_layer_;
  gpu_texture_->mip_level = mip_level_;
  gpu_texture_->samples = samples_;
  gpu_texture_->flags = flags_;
  gpu_texture_->is_pot = math::IsPowerOfTwo(width_) && math::IsPowerOfTwo(height_);
  
  GLES2CmdFuncCreateTexture((GLES2Device*)device_, gpu_texture_);
  device_->mem_status().texture_size += size_;
  
  return true;
}

void GLES2Texture::Destroy() {
  if (gpu_texture_) {
    GLES2CmdFuncDestroyTexture((GLES2Device*)device_, gpu_texture_);
    device_->mem_status().texture_size -= size_;
    CC_DELETE(gpu_texture_);
    gpu_texture_ = nullptr;
  }
  
  if (buffer_) {
    CC_FREE(buffer_);
    device_->mem_status().texture_size -= size_;
    buffer_ = nullptr;
  }
}

void GLES2Texture::Resize(uint width, uint height) {
  uint size = GFXFormatSize(format_, width, height, depth_);
  if (size_ != size) {
    const uint old_size = size_;
    width_ = width;
    height_ = height;
    size_ = size;
    
    GFXMemoryStatus& status = device_->mem_status();
    gpu_texture_->width = width_;
    gpu_texture_->height = height_;
    gpu_texture_->size = size_;
    GLES2CmdFuncResizeTexture((GLES2Device*)device_, gpu_texture_);
    status.buffer_size -= old_size;
    status.buffer_size += size_;
    
    if (buffer_) {
      const uint8_t* old_buff = buffer_;
      buffer_ = (uint8_t*)CC_MALLOC(size_);
      memcpy(buffer_, old_buff, old_size);
      CC_FREE(buffer_);
      status.buffer_size -= old_size;
      status.buffer_size += size_;
    }
  }
}

CC_NAMESPACE_END
