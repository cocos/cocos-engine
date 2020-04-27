#pragma once

#include <tuple>
#include <string>
#import <Metal/MTLRenderPass.h>
#import <Metal/MTLVertexDescriptor.h>
#import <Metal/MTLRenderPipeline.h>
#import <Metal/MTLDepthStencil.h>
#import <Metal/MTLTexture.h>
#import <Metal/MTLSampler.h>

NS_CC_BEGIN

namespace mu
{
    MTLLoadAction toMTLLoadAction(GFXLoadOp op);
    MTLStoreAction toMTLStoreAction(GFXStoreOp op);
    MTLClearColor toMTLClearColor(const GFXColor& clearColor);
    MTLVertexFormat toMTLVertexFormat(GFXFormat, bool);
    MTLPixelFormat toMTLPixelFormat(GFXFormat);
    // Because some pixel format is not supported on metal, so need to convert to supported pixel format.
    GFXFormat convertGFXPixelFormat(GFXFormat);
    MTLColorWriteMask toMTLColorWriteMask(GFXColorMask);
    MTLBlendFactor toMTLBlendFactor(GFXBlendFactor);
    MTLBlendOperation toMTLBlendOperation(GFXBlendOp);
    MTLCullMode toMTLCullMode(GFXCullMode);
    MTLWinding toMTLWinding(bool isFrontFaceCCW);
    MTLViewport toMTLViewport(const GFXViewport&);
    MTLScissorRect toMTLScissorRect(const GFXRect&);
    MTLTriangleFillMode toMTLTriangleFillMode(GFXPolygonMode);
    MTLDepthClipMode toMTLDepthClipMode(bool isClip);
    MTLCompareFunction toMTLCompareFunction(GFXComparisonFunc);
    MTLStencilOperation toMTLStencilOperation(GFXStencilOp);
    MTLPrimitiveType toMTLPrimitiveType(GFXPrimitiveMode);
    MTLTextureUsage toMTLTextureUsage(GFXTextureUsage);
    MTLTextureType toMTLTextureType(GFXTextureType type, uint arrayLength, GFXTextureFlags flags);
    MTLTextureType toMTLTextureType(GFXTextureViewType type);
    NSUInteger toMTLSampleCount(GFXSampleCount);
    MTLSamplerAddressMode toMTLSamplerAddressMode(GFXAddress);
    MTLSamplerBorderColor toMTLSamplerBorderColor(const GFXColor&);
    MTLSamplerMinMagFilter toMTLSamplerMinMagFilter(GFXFilter);
    MTLSamplerMipFilter toMTLSamplerMipFilter(GFXFilter);
    std::string compileGLSLShader2Mtl(const std::string& src, bool isVertexShader);
    uint8_t* convertRGB8ToRGBA8(uint8_t* source, uint length);
    uint8_t* convertRGB32FToRGBA32F(uint8_t* source, uint length);
    NSUInteger highestSupportedFeatureSet(id<MTLDevice> device);
    uint getGPUFamily(MTLFeatureSet featureSet);
    int getMaxVertexAttributes(uint family);
    int getMaxEntriesInBufferArgumentTable(uint family);
    int getMaxEntriesInTextureArgumentTable(uint family);
    int getMaxEntriesInSamplerStateArgumentTable(uint family);
    int getMaxTexture2DWidthHeight(uint family);
    int getMaxCubeMapTextureWidthHeight(uint family);
    int getMaxColorRenderTarget(uint family);
    bool isPVRTCSuppported(uint family);
    bool isEAC_ETCCSuppported(uint family);
    bool isASTCSuppported(uint family);
    bool isBCSupported(uint family);
    bool isColorBufferFloatSupported(uint family);
    bool isColorBufferHalfFloatSupported(uint family);
    bool isLinearTextureSupported(uint family);
    String featureSetToString(MTLFeatureSet featureSet);
}

NS_CC_END
