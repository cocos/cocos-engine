#include "MTLStd.h"
#include "MTLUtils.h"

NS_CC_BEGIN

namespace mu
{
    MTLLoadAction toMTLLoadAction(GFXLoadOp op)
    {
        switch (op) {
            case GFXLoadOp::CLEAR: return MTLLoadActionClear;
            case GFXLoadOp::LOAD: return MTLLoadActionLoad;
            case GFXLoadOp::DISCARD: return MTLLoadActionDontCare;
            default: return MTLLoadActionDontCare;
        }
    }
    
    MTLStoreAction toMTLStoreAction(GFXStoreOp op)
    {
        switch (op) {
            case GFXStoreOp::STORE: return MTLStoreActionStore;
            case GFXStoreOp::DISCARD: return MTLStoreActionDontCare;
            default: return MTLStoreActionDontCare;
        }
    }
    
    MTLClearColor toMTLClearColor(const GFXColor& clearColor)
    {
        return MTLClearColorMake(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    }
    
    MTLVertexFormat toMTLVertexFormat(GFXFormat format)
    {
        switch (format) {
            case GFXFormat::R32F: return MTLVertexFormatFloat;
            case GFXFormat::R32I: return MTLVertexFormatInt;
            case GFXFormat::R32UI: return MTLVertexFormatUInt;
            case GFXFormat::RG8: return MTLVertexFormatUChar2;
            case GFXFormat::RG8I: return MTLVertexFormatChar2;
            case GFXFormat::RG16F: return MTLVertexFormatHalf2;
            case GFXFormat::RG16I: return MTLVertexFormatUShort2;
            case GFXFormat::RG32I: return MTLVertexFormatInt2;
            case GFXFormat::RG32UI: return MTLVertexFormatUInt2;
            case GFXFormat::RG32F: return MTLVertexFormatFloat2;
            case GFXFormat::RGB8: return MTLVertexFormatUChar3;
            case GFXFormat::RGB8I: return MTLVertexFormatChar3;
            case GFXFormat::RGB16I: return MTLVertexFormatShort3;
            case GFXFormat::RGB16UI: return MTLVertexFormatUShort3;
            case GFXFormat::RGB16F: return MTLVertexFormatHalf3;
            case GFXFormat::RGB32I: return MTLVertexFormatInt3;
            case GFXFormat::RGB32UI: return MTLVertexFormatUInt3;
            case GFXFormat::RGB32F: return MTLVertexFormatFloat3;
            case GFXFormat::RGBA8: return MTLVertexFormatUChar4;
            case GFXFormat::RGBA8I: return MTLVertexFormatChar4;
            case GFXFormat::RGBA16I: return MTLVertexFormatShort4;
            case GFXFormat::RGBA16UI: return MTLVertexFormatUShort4;
            case GFXFormat::RGBA16F: return MTLVertexFormatHalf4;
            case GFXFormat::RGBA32I: return MTLVertexFormatInt4;
            case GFXFormat::RGBA32UI: return MTLVertexFormatUInt4;
            case GFXFormat::RGBA32F: return MTLVertexFormatFloat4;
            default:
            {
                CC_LOG_ERROR("Invalid vertex format %u", format);
                return MTLVertexFormatInvalid;
            }
        }
    }
    
    MTLPixelFormat toMTLPixelFormat(GFXFormat format)
    {
        switch (format) {
            case GFXFormat::A8: return MTLPixelFormatA8Unorm;
            case GFXFormat::R8: return MTLPixelFormatR8Uint;
            case GFXFormat::R8SN: return MTLPixelFormatR8Snorm;
            case GFXFormat::R8UI: return MTLPixelFormatR8Uint;
            case GFXFormat::R16F: return MTLPixelFormatR16Float;
            case GFXFormat::R32F: return MTLPixelFormatR32Float;
            case GFXFormat::R32UI: return MTLPixelFormatR32Uint;
            case GFXFormat::R32I: return MTLPixelFormatR32Sint;
                
            case GFXFormat::RG8: return MTLPixelFormatRG8Uint;
            case GFXFormat::RG8SN: return MTLPixelFormatRG8Snorm;
            case GFXFormat::RG8UI: return MTLPixelFormatRG8Uint;
            case GFXFormat::RG8I: return MTLPixelFormatRG8Sint;
            case GFXFormat::RG16F: return MTLPixelFormatRG16Float;
            case GFXFormat::RG16UI: return MTLPixelFormatRG16Uint;
            case GFXFormat::RG16I: return MTLPixelFormatRG16Sint;
                
            // RGB should convert to RGBA
//            case GFXFormat::RGB8: return MTLPixelFormatRGBA8Uint;
//            case GFXFormat::RGB8SN: return MTLPixelFormatRGBA8Snorm;
//            case GFXFormat::RGB8UI: return MTLPixelFormatRGBA8Uint;
//            case GFXFormat::RGB8I: return MTLPixelFormatRGBA8Sint;
//            case GFXFormat::RGB16F: return MTLPixelFormatRGBA16Float;
//            case GFXFormat::RGB16UI: return MTLPixelFormatRGBA16Uint;
//            case GFXFormat::RGB16I: return MTLPixelFormatRGBA16Sint;
//            case GFXFormat::RGB32F: return MTLPixelFormatRGBA32Float;
//            case GFXFormat::RGB32UI: return MTLPixelFormatRGBA32Uint;
//            case GFXFormat::RGB32I: return MTLPixelFormatRGBA32Sint;
                
            case GFXFormat::RGBA8: return MTLPixelFormatRGBA8Uint;
            case GFXFormat::RGBA8SN: return MTLPixelFormatRGBA8Snorm;
            case GFXFormat::RGBA8UI: return MTLPixelFormatRGBA8Uint;
            case GFXFormat::RGBA8I: return MTLPixelFormatRGBA8Sint;
            case GFXFormat::RGBA16F: return MTLPixelFormatRGBA16Float;
            case GFXFormat::RGBA16UI: return MTLPixelFormatRGBA16Uint;
            case GFXFormat::RGBA16I: return MTLPixelFormatRGBA16Sint;
            case GFXFormat::RGBA32F: return MTLPixelFormatRGBA32Float;
            case GFXFormat::RGBA32UI: return MTLPixelFormatRGBA32Uint;
            case GFXFormat::RGBA32I: return MTLPixelFormatRGBA32Sint;
                
            // Should convert.
//            case GFXFormat::R5G6B5: return MTLPixelFormatB5G6R5Unorm;
//            case GFXFormat::RGB5A1: return MTLPixelFormatBGR5A1Unorm;
//            case GFXFormat::RGBA4: return MTLPixelFormatABGR4Unorm;
//            case GFXFormat::RGB10A2: return MTLPixelFormatBGR10A2Unorm;
            case GFXFormat::RGB9E5: return MTLPixelFormatRGB9E5Float;
            case GFXFormat::RGB10A2UI: return MTLPixelFormatRGB10A2Uint;
            case GFXFormat::R11G11B10F: return MTLPixelFormatRG11B10Float;
            
            case GFXFormat::D16: return MTLPixelFormatDepth16Unorm;
            case GFXFormat::D24S8: return MTLPixelFormatDepth24Unorm_Stencil8;
            case GFXFormat::D32F: return MTLPixelFormatDepth32Float;
            case GFXFormat::D32F_S8: return MTLPixelFormatDepth32Float_Stencil8;
                
            case GFXFormat::BC1_ALPHA: return MTLPixelFormatBC1_RGBA;
            case GFXFormat::BC1_SRGB_ALPHA: return MTLPixelFormatBC1_RGBA_sRGB;
                
            default:
            {
                CC_LOG_ERROR("Invalid pixel format %u", format);
                return MTLPixelFormatInvalid;
            }
        }
    }
    
    MTLColorWriteMask toMTLColorWriteMask(GFXColorMask mask)
    {
        switch (mask) {
            case GFXColorMask::R: return MTLColorWriteMaskRed;
            case GFXColorMask::G: return MTLColorWriteMaskGreen;
            case GFXColorMask::B: return MTLColorWriteMaskBlue;
            case GFXColorMask::A: return MTLColorWriteMaskAlpha;
            case GFXColorMask::ALL: return MTLColorWriteMaskAll;
            default: return MTLColorWriteMaskNone;
        }
    }
    
    MTLBlendFactor toMTLBlendFactor(GFXBlendFactor factor)
    {
        switch (factor) {
            case GFXBlendFactor::ZERO: return MTLBlendFactorZero;
            case GFXBlendFactor::ONE: return MTLBlendFactorOne;
            case GFXBlendFactor::SRC_ALPHA: return MTLBlendFactorSourceAlpha;
            case GFXBlendFactor::DST_ALPHA: return MTLBlendFactorDestinationAlpha;
            case GFXBlendFactor::ONE_MINUS_SRC_ALPHA: return MTLBlendFactorOneMinusSourceAlpha;
            case GFXBlendFactor::ONE_MINUS_DST_ALPHA: return MTLBlendFactorOneMinusDestinationAlpha;
            case GFXBlendFactor::SRC_COLOR: return MTLBlendFactorSourceColor;
            case GFXBlendFactor::DST_COLOR: return MTLBlendFactorDestinationColor;
            case GFXBlendFactor::ONE_MINUS_SRC_COLOR: return MTLBlendFactorOneMinusSourceColor;
            case GFXBlendFactor::ONE_MINUS_DST_COLOR: return MTLBlendFactorOneMinusDestinationColor;
            case GFXBlendFactor::SRC_ALPHA_SATURATE: return MTLBlendFactorSourceAlphaSaturated;
            default:
            {
                CC_LOG_ERROR("Unsupported blend factor %u", (uint)factor);
                return MTLBlendFactorZero;
            }
        }
    }
    
    MTLBlendOperation toMTLBlendOperation(GFXBlendOp op)
    {
        switch (op) {
            case GFXBlendOp::ADD: return MTLBlendOperationAdd;
            case GFXBlendOp::SUB: return MTLBlendOperationSubtract;
            case GFXBlendOp::REV_SUB: return MTLBlendOperationReverseSubtract;
            case GFXBlendOp::MIN: return MTLBlendOperationMin;
            case GFXBlendOp::MAX: return MTLBlendOperationMax;
        }
    }
    
    MTLCullMode toMTLCullMode(GFXCullMode mode)
    {
        switch (mode) {
            case GFXCullMode::FRONT: return MTLCullModeFront;
            case GFXCullMode::BACK: return MTLCullModeBack;
            case GFXCullMode::NONE: return MTLCullModeNone;
        }
    }
    
    MTLWinding toMTLWinding(bool isFrontFaceCCW)
    {
        if (isFrontFaceCCW)
            return MTLWindingCounterClockwise;
        else
            return MTLWindingClockwise;
    }
    
    MTLViewport toMTLViewport(const GFXViewport& viewport)
    {
        MTLViewport mtlViewport;
        mtlViewport.originX = viewport.left;
        mtlViewport.originY = viewport.top;
        mtlViewport.width = viewport.width;
        mtlViewport.height = viewport.height;
        mtlViewport.znear = viewport.minDepth;
        mtlViewport.zfar = viewport.maxDepth;
        
        return mtlViewport;
    }
    
    MTLScissorRect toMTLScissorRect(const GFXRect& rect)
    {
        MTLScissorRect scissorRect;
        scissorRect.x = rect.x;
        scissorRect.y = rect.y;
        scissorRect.width = rect.width;
        scissorRect.height = rect.height;
        
        return scissorRect;
    }
    
    MTLTriangleFillMode toMTLTriangleFillMode(GFXPolygonMode mode)
    {
        switch (mode) {
            case GFXPolygonMode::FILL: return MTLTriangleFillModeFill;
            case GFXPolygonMode::LINE: return MTLTriangleFillModeLines;
            case GFXPolygonMode::POINT:
            {
                CC_LOG_WARNING("Metal doesn't support GFXPolygonMode::POINT, translate to GFXPolygonMode::LINE.");
                return MTLTriangleFillModeLines;
            }
        }
    }
    
    MTLDepthClipMode toMTLDepthClipMode(bool isClip)
    {
        if (isClip)
            return MTLDepthClipModeClip;
        else
            return MTLDepthClipModeClamp;
    }
    
    MTLCompareFunction toMTLCompareFunction(GFXComparisonFunc func)
    {
        switch (func) {
            case GFXComparisonFunc::NEVER: return MTLCompareFunctionNever;
            case GFXComparisonFunc::LESS: return MTLCompareFunctionLess;
            case GFXComparisonFunc::EQUAL: return MTLCompareFunctionEqual;
            case GFXComparisonFunc::LESS_EQUAL: return MTLCompareFunctionLessEqual;
            case GFXComparisonFunc::GREATER: return MTLCompareFunctionGreater;
            case GFXComparisonFunc::NOT_EQUAL: return MTLCompareFunctionNotEqual;
            case GFXComparisonFunc::GREATER_EQUAL: return MTLCompareFunctionGreaterEqual;
            case GFXComparisonFunc::ALWAYS: return MTLCompareFunctionAlways;
        }
    }
    
    MTLStencilOperation toMTLStencilOperation(GFXStencilOp op)
    {
        switch (op) {
            case GFXStencilOp::ZERO: return MTLStencilOperationZero;
            case GFXStencilOp::KEEP: return MTLStencilOperationKeep;
            case GFXStencilOp::REPLACE: return MTLStencilOperationReplace;
            case GFXStencilOp::INCR: return MTLStencilOperationIncrementClamp;
            case GFXStencilOp::DECR: return MTLStencilOperationDecrementClamp;
            case GFXStencilOp::INVERT: return MTLStencilOperationInvert;
            case GFXStencilOp::INCR_WRAP: return MTLStencilOperationIncrementWrap;
            case GFXStencilOp::DECR_WRAP: return MTLStencilOperationDecrementWrap;
        }
    }
    
    MTLPrimitiveType toMTLPrimitiveType(GFXPrimitiveMode mode)
    {
        switch (mode) {
            case GFXPrimitiveMode::POINT_LIST: return MTLPrimitiveTypePoint;
            case GFXPrimitiveMode::LINE_LIST: return MTLPrimitiveTypeLine;
            case GFXPrimitiveMode::LINE_STRIP: return MTLPrimitiveTypeLineStrip;
            case GFXPrimitiveMode::TRIANGLE_LIST: return MTLPrimitiveTypeTriangle;
            case GFXPrimitiveMode::TRIANGLE_STRIP: return MTLPrimitiveTypeTriangleStrip;
                
            case GFXPrimitiveMode::LINE_LOOP:
            {
                CC_LOG_ERROR("Metal doesn't support GFXPrimitiveMode::LINE_LOOP. Translate to GFXPrimitiveMode::LINE_LIST.");
                return MTLPrimitiveTypeLine;
            }
            default:
            {
                //TODO: how to support these mode?
                CC_ASSERT(false);
                return MTLPrimitiveTypeTriangle;
            }
        }
    }
}

NS_CC_END
