#pragma once

#include "gfx-base/GFXDef-common.h"
#include "gfx-gles-new/GLESCore.h"

namespace cc::gfx::gles {

const InternalFormat &getInternalType(Format format);
GLenum getWrapMode(Address address);
GLenum getShaderStage(ShaderStageFlagBit stage);
GLenum getCompareFunc(ComparisonFunc compare);
GLenum getStencilOP(StencilOp op);
GLenum getBlendOP(BlendOp op);
GLenum getBlendFactor(BlendFactor factor);
GLenum getPrimitive(PrimitiveMode primitive);

} // namespace cc::gfx::gles
