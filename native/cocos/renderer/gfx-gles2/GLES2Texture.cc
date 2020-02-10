#include "GLES2Std.h"
#include "GLES2Texture.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

GLES2Texture::GLES2Texture(GFXDevice* device)
    : GFXTexture(device),
      gpu_texture_(nullptr) {
}

GLES2Texture::~GLES2Texture() {
}

bool GLES2Texture::initialize(const GFXTextureInfo &info) {
  
  _type = info.type;
  _usage = info.usage;
  _format = info.format;
  _width = info.width;
  _height = info.height;
  _depth = info.depth;
  _arrayLayer = info.array_layer;
  _mipLevel = info.mip_level;
  _samples = info.samples;
  _flags = info.flags;
  _size = GFXFormatSize(_format, _width, _height, _depth);
  
  if (_flags & GFXTextureFlags::BAKUP_BUFFER) {
    _buffer = (uint8_t*)CC_MALLOC(_size);
    _device->memoryStatus().texture_size += _size;
  }
  
  gpu_texture_ = CC_NEW(GLES2GPUTexture);
  gpu_texture_->type = _type;
  
  switch (_type) {
    case GFXTextureType::TEX1D: {
      if (_arrayLayer) {
        gpu_texture_->view_type = _arrayLayer <= 1 ? GFXTextureViewType::TV1D : GFXTextureViewType::TV1D_ARRAY;
      } else {
        gpu_texture_->view_type = GFXTextureViewType::TV1D;
      }
      break;
    }
    case GFXTextureType::TEX2D: {
      if (_arrayLayer) {
        if (_arrayLayer <= 1) {
          gpu_texture_->view_type = GFXTextureViewType::TV2D;
        } else if (_flags & GFXTextureFlagBit::CUBEMAP) {
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
  
  gpu_texture_->format = _format;
  gpu_texture_->usage = _usage;
  gpu_texture_->width = _width;
  gpu_texture_->height = _height;
  gpu_texture_->depth = _depth;
  gpu_texture_->size = _size;
  gpu_texture_->array_layer = _arrayLayer;
  gpu_texture_->mip_level = _mipLevel;
  gpu_texture_->samples = _samples;
  gpu_texture_->flags = _flags;
    gpu_texture_->is_pot = math::IsPowerOfTwo(_width) && math::IsPowerOfTwo(_height);
  
  GLES2CmdFuncCreateTexture((GLES2Device*)_device, gpu_texture_);
  _device->memoryStatus().texture_size += _size;
  
  return true;
}

void GLES2Texture::destroy() {
  if (gpu_texture_) {
    GLES2CmdFuncDestroyTexture((GLES2Device*)_device, gpu_texture_);
    _device->memoryStatus().texture_size -= _size;
    CC_DELETE(gpu_texture_);
    gpu_texture_ = nullptr;
  }
  
  if (_buffer) {
    CC_FREE(_buffer);
    _device->memoryStatus().texture_size -= _size;
    _buffer = nullptr;
  }
}

void GLES2Texture::resize(uint width, uint height) {
  uint size = GFXFormatSize(_format, width, height, _depth);
  if (_size != size) {
    const uint old_size = _size;
    _width = width;
    _height = height;
    _size = size;
    
    GFXMemoryStatus& status = _device->memoryStatus();
    gpu_texture_->width = _width;
    gpu_texture_->height = _height;
    gpu_texture_->size = _size;
    GLES2CmdFuncResizeTexture((GLES2Device*)_device, gpu_texture_);
    status.buffer_size -= old_size;
    status.buffer_size += _size;
    
    if (_buffer) {
      const uint8_t* old_buff = _buffer;
      _buffer = (uint8_t*)CC_MALLOC(_size);
      memcpy(_buffer, old_buff, old_size);
      CC_FREE(_buffer);
      status.buffer_size -= old_size;
      status.buffer_size += _size;
    }
  }
}

NS_CC_END
