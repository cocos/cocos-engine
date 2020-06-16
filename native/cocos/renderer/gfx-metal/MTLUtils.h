#pragma once

#import <Metal/MTLDepthStencil.h>
#import <Metal/MTLRenderPass.h>
#import <Metal/MTLRenderPipeline.h>
#import <Metal/MTLSampler.h>
#import <Metal/MTLTexture.h>
#import <Metal/MTLVertexDescriptor.h>
#include <unordered_map>


namespace cc {

namespace mu {
MTLResourceOptions toMTLResourseOption(GFXMemoryUsage usage);
MTLLoadAction toMTLLoadAction(GFXLoadOp op);
MTLStoreAction toMTLStoreAction(GFXStoreOp op);
MTLClearColor toMTLClearColor(const GFXColor &clearColor);
MTLVertexFormat toMTLVertexFormat(GFXFormat, bool);
MTLPixelFormat toMTLPixelFormat(GFXFormat);
// Because some pixel format is not supported on metal, so need to convert to supported pixel format.
GFXFormat convertGFXPixelFormat(GFXFormat);
MTLColorWriteMask toMTLColorWriteMask(GFXColorMask);
MTLBlendFactor toMTLBlendFactor(GFXBlendFactor);
MTLBlendOperation toMTLBlendOperation(GFXBlendOp);
MTLCullMode toMTLCullMode(GFXCullMode);
MTLWinding toMTLWinding(bool isFrontFaceCCW);
MTLViewport toMTLViewport(const GFXViewport &);
MTLScissorRect toMTLScissorRect(const GFXRect &);
MTLTriangleFillMode toMTLTriangleFillMode(GFXPolygonMode);
MTLDepthClipMode toMTLDepthClipMode(bool isClip);
MTLCompareFunction toMTLCompareFunction(GFXComparisonFunc);
MTLStencilOperation toMTLStencilOperation(GFXStencilOp);
MTLPrimitiveType toMTLPrimitiveType(GFXPrimitiveMode);
MTLTextureUsage toMTLTextureUsage(GFXTextureUsage);
MTLTextureType toMTLTextureType(GFXTextureType type);
NSUInteger toMTLSampleCount(GFXSampleCount);
MTLSamplerAddressMode toMTLSamplerAddressMode(GFXAddress);
MTLSamplerBorderColor toMTLSamplerBorderColor(const GFXColor &);
MTLSamplerMinMagFilter toMTLSamplerMinMagFilter(GFXFilter);
MTLSamplerMipFilter toMTLSamplerMipFilter(GFXFilter);
String compileGLSLShader2Msl(const String &src, GFXShaderType shaderType, int maxSamplerUnits, std::unordered_map<uint, uint> &samplerBindings);
uint8_t *convertRGB8ToRGBA8(uint8_t *source, uint length);
uint8_t *convertRGB32FToRGBA32F(uint8_t *source, uint length);
NSUInteger highestSupportedFeatureSet(id<MTLDevice> device);
uint getGPUFamily(MTLFeatureSet featureSet);
uint getMaxVertexAttributes(uint family);
uint getMaxEntriesInBufferArgumentTable(uint family);
uint getMaxEntriesInTextureArgumentTable(uint family);
uint getMaxEntriesInSamplerStateArgumentTable(uint family);
uint getMaxTexture2DWidthHeight(uint family);
uint getMaxCubeMapTextureWidthHeight(uint family);
uint getMaxColorRenderTarget(uint family);
bool isPVRTCSuppported(uint family);
bool isEAC_ETCCSuppported(uint family);
bool isASTCSuppported(uint family);
bool isBCSupported(uint family);
bool isColorBufferFloatSupported(uint family);
bool isColorBufferHalfFloatSupported(uint family);
bool isLinearTextureSupported(uint family);
bool isIndirectCommandBufferSupported(MTLFeatureSet featureSet);
bool isDepthStencilFormatSupported(GFXFormat format, uint family);
String featureSetToString(MTLFeatureSet featureSet);
} // namespace mu

}
