/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
#include "base/std/container/unordered_map.h"
#include "gfx-base/GFXDef.h"

namespace cc {
namespace gfx {
class CCMTLGPUShader;
class CCMTLDevice;
namespace mu {

API_AVAILABLE(ios(12.0))
MTLMultisampleStencilResolveFilter toMTLStencilResolveMode(ResolveMode mode);

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
ccstd::string spirv2MSL(const uint32_t *ir, size_t word_count, ShaderStageFlagBit shaderType, CCMTLGPUShader *gpuShader, RenderPass* renderpass, uint32_t subpassIndex);
const uint8_t *convertRGB8ToRGBA8(const uint8_t *source, uint32_t length);
const uint8_t *convertRGB32FToRGBA32F(const uint8_t *source, uint32_t length);
NSUInteger highestSupportedFeatureSet(id<MTLDevice> device);
uint32_t getGPUFamily(MTLFeatureSet featureSet);
uint32_t getMaxVertexAttributes(uint32_t family);
uint32_t getMaxUniformBufferBindings(uint32_t family);
uint32_t getMaxEntriesInBufferArgumentTable(uint32_t family);
uint32_t getMaxEntriesInTextureArgumentTable(uint32_t family);
uint32_t getMaxEntriesInSamplerStateArgumentTable(uint32_t family);
uint32_t getMaxTexture2DWidthHeight(uint32_t family);
uint32_t getMaxCubeMapTextureWidthHeight(uint32_t family);
uint32_t getMaxColorRenderTarget(uint32_t family);
uint32_t getMinBufferOffsetAlignment(uint32_t family);
uint32_t getMaxThreadsPerGroup(uint32_t family);
bool isPVRTCSuppported(uint32_t family);
bool isEAC_ETCCSuppported(uint32_t family);
bool isASTCSuppported(uint32_t family);
bool isBCSupported(uint32_t family);
bool isColorBufferFloatSupported(uint32_t family);
bool isColorBufferHalfFloatSupported(uint32_t family);
bool isLinearTextureSupported(uint32_t family);
bool isUISamplerSupported(uint32_t family);
bool isRGB10A2UIStorageSupported(uint32_t family);
bool isDDepthStencilFilterSupported(uint32_t family);
bool isIndirectCommandBufferSupported(MTLFeatureSet featureSet);
bool isDepthStencilFormatSupported(id<MTLDevice> device, Format format, uint32_t family);
MTLPixelFormat getSupportedDepthStencilFormat(id<MTLDevice> device, uint32_t family, uint32_t &depthBits);
bool isIndirectDrawSupported(uint32_t family);
bool isImageBlockSupported();
bool isFramebufferFetchSupported();
ccstd::string featureSetToString(MTLFeatureSet featureSet);
const uint8_t *const convertData(const uint8_t *source, uint32_t length, Format type);
uint32_t getBlockSize(Format format);
uint32_t getBytesPerRow(Format format, uint32_t width);
bool pixelFormatIsColorRenderable(Format format);
bool isSamplerDescriptorCompareFunctionSupported(uint32_t family);
void clearRenderArea(CCMTLDevice *device, id<MTLRenderCommandEncoder> renderEncoder, RenderPass *renderPass, const Rect &renderArea, const Color *colors, float depth, uint32_t stencil);
inline uint32_t alignUp(uint32_t inSize, uint32_t align) { return ((inSize + align - 1) / align) * align; }
void clearUtilResource();
inline uint32_t roundUp(uint32_t dividend, uint32_t divisor) { return (dividend - 1) / divisor + 1; }
} // namespace mu

} // namespace gfx
} // namespace cc
