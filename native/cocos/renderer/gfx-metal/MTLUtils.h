#pragma once

#import <Metal/MTLDepthStencil.h>
#import <Metal/MTLRenderPass.h>
#import <Metal/MTLRenderPipeline.h>
#import <Metal/MTLSampler.h>
#import <Metal/MTLTexture.h>
#import <Metal/MTLVertexDescriptor.h>
#include <unordered_map>

namespace cc {
namespace gfx {
class CCMTLGPUShader;
namespace mu {
MTLResourceOptions toMTLResourseOption(MemoryUsage usage);
MTLLoadAction toMTLLoadAction(LoadOp op);
MTLStoreAction toMTLStoreAction(StoreOp op);
MTLClearColor toMTLClearColor(const Color &clearColor);
MTLVertexFormat toMTLVertexFormat(Format, bool);
MTLPixelFormat toMTLPixelFormat(Format);
// Because some pixel format is not supported on metal, so need to convert to supported pixel format.
Format convertGFXPixelFormat(Format);
MTLColorWriteMask toMTLColorWriteMask(ColorMask);
MTLBlendFactor toMTLBlendFactor(BlendFactor);
MTLBlendOperation toMTLBlendOperation(BlendOp);
MTLCullMode toMTLCullMode(CullMode);
MTLWinding toMTLWinding(bool isFrontFaceCCW);
MTLViewport toMTLViewport(const Viewport &);
MTLScissorRect toMTLScissorRect(const Rect &);
MTLTriangleFillMode toMTLTriangleFillMode(PolygonMode);
MTLDepthClipMode toMTLDepthClipMode(bool isClip);
MTLCompareFunction toMTLCompareFunction(ComparisonFunc);
MTLStencilOperation toMTLStencilOperation(StencilOp);
MTLPrimitiveType toMTLPrimitiveType(PrimitiveMode);
MTLTextureUsage toMTLTextureUsage(TextureUsage);
MTLTextureType toMTLTextureType(TextureType type);
NSUInteger toMTLSampleCount(SampleCount);
MTLSamplerAddressMode toMTLSamplerAddressMode(Address);
int toMTLSamplerBorderColor(const Color &);
MTLSamplerMinMagFilter toMTLSamplerMinMagFilter(Filter);
MTLSamplerMipFilter toMTLSamplerMipFilter(Filter);
String compileGLSLShader2Msl(const String &src, ShaderStageFlagBit shaderType, Device *device, CCMTLGPUShader *gpuShader);
const uint8_t *convertRGB8ToRGBA8(const uint8_t *source, uint length);
const uint8_t *convertRGB32FToRGBA32F(const uint8_t *source, uint length);
NSUInteger highestSupportedFeatureSet(id<MTLDevice> device);
uint getGPUFamily(MTLFeatureSet featureSet);
uint getMaxVertexAttributes(uint family);
uint getMaxEntriesInBufferArgumentTable(uint family);
uint getMaxEntriesInTextureArgumentTable(uint family);
uint getMaxEntriesInSamplerStateArgumentTable(uint family);
uint getMaxTexture2DWidthHeight(uint family);
uint getMaxCubeMapTextureWidthHeight(uint family);
uint getMaxColorRenderTarget(uint family);
uint getMinBufferOffsetAlignment(uint family);
bool isPVRTCSuppported(uint family);
bool isEAC_ETCCSuppported(uint family);
bool isASTCSuppported(uint family);
bool isBCSupported(uint family);
bool isColorBufferFloatSupported(uint family);
bool isColorBufferHalfFloatSupported(uint family);
bool isLinearTextureSupported(uint family);
bool isIndirectCommandBufferSupported(MTLFeatureSet featureSet);
bool isDepthStencilFormatSupported(Format format, uint family);
String featureSetToString(MTLFeatureSet featureSet);
const uint8_t *const convertData(const uint8_t *source, uint length, Format type);

CC_INLINE uint alignUp(uint inSize, uint align) { return ((inSize + align - 1) / align) * align; }
} // namespace mu

} // namespace gfx
} // namespace cc
