/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#import <Metal/MTLDepthStencil.h>
#import <Metal/MTLRenderPass.h>
#import <Metal/MTLRenderPipeline.h>
#import <Metal/MTLSampler.h>
#import <Metal/MTLTexture.h>
#import <Metal/MTLVertexDescriptor.h>
#include <unordered_map>
#include "gfx-base/GFXDef.h"

namespace cc {
namespace gfx {
class CCMTLGPUShader;
class CCMTLDevice;
namespace mu {

API_AVAILABLE(ios(12.0)) MTLMultisampleStencilResolveFilter toMTLStencilResolveMode(ResolveMode mode);

MTLResourceOptions toMTLResourceOption(MemoryUsage usage);
MTLLoadAction toMTLLoadAction(LoadOp op);
MTLStoreAction toMTLStoreAction(StoreOp op);
MTLStoreAction toMTLMSAAStoreAction(StoreOp op);
MTLClearColor toMTLClearColor(const Color &clearColor);
MTLVertexFormat toMTLVertexFormat(Format, bool);
MTLPixelFormat toMTLPixelFormat(Format);
MTLMultisampleDepthResolveFilter toMTLDepthResolveMode(ResolveMode mode);
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
String spirv2MSL(const uint32_t *ir, size_t word_count, ShaderStageFlagBit shaderType, CCMTLGPUShader *gpuShader);
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
uint getMaxThreadsPerGroup(uint family);
bool isPVRTCSuppported(uint family);
bool isEAC_ETCCSuppported(uint family);
bool isASTCSuppported(uint family);
bool isBCSupported(uint family);
bool isColorBufferFloatSupported(uint family);
bool isColorBufferHalfFloatSupported(uint family);
bool isLinearTextureSupported(uint family);
bool isIndirectCommandBufferSupported(MTLFeatureSet featureSet);
bool isDepthStencilFormatSupported(id<MTLDevice> device, Format format, uint family);
MTLPixelFormat getSupportedDepthStencilFormat(id<MTLDevice> device, uint family, uint &depthBits);
bool isIndirectDrawSupported(uint family);
bool isImageBlockSupported();
bool isFramebufferFetchSupported();
String featureSetToString(MTLFeatureSet featureSet);
const uint8_t *const convertData(const uint8_t *source, uint length, Format type);
uint getBlockSize(Format format);
uint getBytesPerRow(Format format, uint width);
bool pixelFormatIsColorRenderable(Format format);
bool isSamplerDescriptorCompareFunctionSupported(uint family);
void clearRenderArea(CCMTLDevice *device, id<MTLRenderCommandEncoder> renderEncoder, RenderPass *renderPass, const Rect &renderArea, const Color *colors, float depth, uint stencil);
inline uint alignUp(uint inSize, uint align) { return ((inSize + align - 1) / align) * align; }
void clearUtilResource();
inline uint roundUp(uint dividend, uint divisor) { return (dividend - 1) / divisor + 1; }
} // namespace mu

} // namespace gfx
} // namespace cc
