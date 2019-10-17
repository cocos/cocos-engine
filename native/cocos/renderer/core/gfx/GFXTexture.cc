#include "CoreStd.h"
#include "GFXTexture.h"

CC_NAMESPACE_BEGIN

GFXTexture::GFXTexture(GFXDevice* device)
    : device_(device),
      type_(GFXTextureType::TEX2D),
      usage_(GFXTextureUsageBit::NONE),
      format_(GFXFormat::UNKNOWN),
      width_(0),
      height_(0),
      depth_(1),
      array_layer_(1),
      mip_level_(1),
      size_(0),
      samples_(GFXSampleCount::X1),
      flags_(GFXTextureFlagBit::NONE),
      buffer_(nullptr) {
}

GFXTexture::~GFXTexture() {
}

CC_NAMESPACE_END
