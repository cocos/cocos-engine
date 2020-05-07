#include "MTLStd.h"
#include "MTLUtils.h"
#include "SPIRV/GlslangToSpv.h"
#include "spirv_cross/spirv_msl.hpp"
#include <vector>

NS_CC_BEGIN
namespace {
    const TBuiltInResource DefaultTBuiltInResource = {
        /* .MaxLights = */ 32,
        /* .MaxClipPlanes = */ 6,
        /* .MaxTextureUnits = */ 32,
        /* .MaxTextureCoords = */ 32,
        /* .MaxVertexAttribs = */ 64,
        /* .MaxVertexUniformComponents = */ 4096,
        /* .MaxVaryingFloats = */ 64,
        /* .MaxVertexTextureImageUnits = */ 32,
        /* .MaxCombinedTextureImageUnits = */ 80,
        /* .MaxTextureImageUnits = */ 32,
        /* .MaxFragmentUniformComponents = */ 4096,
        /* .MaxDrawBuffers = */ 32,
        /* .MaxVertexUniformVectors = */ 128,
        /* .MaxVaryingVectors = */ 8,
        /* .MaxFragmentUniformVectors = */ 16,
        /* .MaxVertexOutputVectors = */ 16,
        /* .MaxFragmentInputVectors = */ 15,
        /* .MinProgramTexelOffset = */ -8,
        /* .MaxProgramTexelOffset = */ 7,
        /* .MaxClipDistances = */ 8,
        /* .MaxComputeWorkGroupCountX = */ 65535,
        /* .MaxComputeWorkGroupCountY = */ 65535,
        /* .MaxComputeWorkGroupCountZ = */ 65535,
        /* .MaxComputeWorkGroupSizeX = */ 1024,
        /* .MaxComputeWorkGroupSizeY = */ 1024,
        /* .MaxComputeWorkGroupSizeZ = */ 64,
        /* .MaxComputeUniformComponents = */ 1024,
        /* .MaxComputeTextureImageUnits = */ 16,
        /* .MaxComputeImageUniforms = */ 8,
        /* .MaxComputeAtomicCounters = */ 8,
        /* .MaxComputeAtomicCounterBuffers = */ 1,
        /* .MaxVaryingComponents = */ 60,
        /* .MaxVertexOutputComponents = */ 64,
        /* .MaxGeometryInputComponents = */ 64,
        /* .MaxGeometryOutputComponents = */ 128,
        /* .MaxFragmentInputComponents = */ 128,
        /* .MaxImageUnits = */ 8,
        /* .MaxCombinedImageUnitsAndFragmentOutputs = */ 8,
        /* .MaxCombinedShaderOutputResources = */ 8,
        /* .MaxImageSamples = */ 0,
        /* .MaxVertexImageUniforms = */ 0,
        /* .MaxTessControlImageUniforms = */ 0,
        /* .MaxTessEvaluationImageUniforms = */ 0,
        /* .MaxGeometryImageUniforms = */ 0,
        /* .MaxFragmentImageUniforms = */ 8,
        /* .MaxCombinedImageUniforms = */ 8,
        /* .MaxGeometryTextureImageUnits = */ 16,
        /* .MaxGeometryOutputVertices = */ 256,
        /* .MaxGeometryTotalOutputComponents = */ 1024,
        /* .MaxGeometryUniformComponents = */ 1024,
        /* .MaxGeometryVaryingComponents = */ 64,
        /* .MaxTessControlInputComponents = */ 128,
        /* .MaxTessControlOutputComponents = */ 128,
        /* .MaxTessControlTextureImageUnits = */ 16,
        /* .MaxTessControlUniformComponents = */ 1024,
        /* .MaxTessControlTotalOutputComponents = */ 4096,
        /* .MaxTessEvaluationInputComponents = */ 128,
        /* .MaxTessEvaluationOutputComponents = */ 128,
        /* .MaxTessEvaluationTextureImageUnits = */ 16,
        /* .MaxTessEvaluationUniformComponents = */ 1024,
        /* .MaxTessPatchComponents = */ 120,
        /* .MaxPatchVertices = */ 32,
        /* .MaxTessGenLevel = */ 64,
        /* .MaxViewports = */ 16,
        /* .MaxVertexAtomicCounters = */ 0,
        /* .MaxTessControlAtomicCounters = */ 0,
        /* .MaxTessEvaluationAtomicCounters = */ 0,
        /* .MaxGeometryAtomicCounters = */ 0,
        /* .MaxFragmentAtomicCounters = */ 8,
        /* .MaxCombinedAtomicCounters = */ 8,
        /* .MaxAtomicCounterBindings = */ 1,
        /* .MaxVertexAtomicCounterBuffers = */ 0,
        /* .MaxTessControlAtomicCounterBuffers = */ 0,
        /* .MaxTessEvaluationAtomicCounterBuffers = */ 0,
        /* .MaxGeometryAtomicCounterBuffers = */ 0,
        /* .MaxFragmentAtomicCounterBuffers = */ 1,
        /* .MaxCombinedAtomicCounterBuffers = */ 1,
        /* .MaxAtomicCounterBufferSize = */ 16384,
        /* .MaxTransformFeedbackBuffers = */ 4,
        /* .MaxTransformFeedbackInterleavedComponents = */ 64,
        /* .MaxCullDistances = */ 8,
        /* .MaxCombinedClipAndCullDistances = */ 8,
        /* .MaxSamples = */ 4,
        /*  max_mesh_output_vertices_nv;   */ 0,
        /*  max_mesh_output_primitives_nv; */ 0,
        /*  max_mesh_work_group_size_x_nv; */ 0,
        /*  max_mesh_work_group_size_y_nv; */ 0,
        /*  max_mesh_work_group_size_z_nv; */ 0,
        /*  max_task_work_group_size_x_nv; */ 0,
        /*  max_task_work_group_size_y_nv; */ 0,
        /*  max_task_work_group_size_z_nv; */ 0,
        /*  max_mesh_view_count_nv; */ 8,
        /* .limits = */ {
            /* .nonInductiveForLoops = */ 1,
            /* .whileLoops = */ 1,
            /* .doWhileLoops = */ 1,
            /* .generalUniformIndexing = */ 1,
            /* .generalAttributeMatrixVectorIndexing = */ 1,
            /* .generalVaryingIndexing = */ 1,
            /* .generalSamplerIndexing = */ 1,
            /* .generalVariableIndexing = */ 1,
            /* .generalConstantMatrixVectorIndexing = */ 1,
        }
    };

    EShLanguage getShaderStage(GFXShaderType type)
    {
        switch (type)
        {
        case GFXShaderType::VERTEX: return EShLangVertex;
        case GFXShaderType::CONTROL: return EShLangTessControl;
        case GFXShaderType::EVALUATION: return EShLangTessEvaluation;
        case GFXShaderType::GEOMETRY: return EShLangGeometry;
        case GFXShaderType::FRAGMENT: return EShLangFragment;
        case GFXShaderType::COMPUTE: return EShLangCompute;
        default:
        {
            CCASSERT(false, "Unsupported GFXShaderType, convert to EShLanguage failed.");
            return EShLangVertex;
        }
        }
    }

    glslang::EShTargetClientVersion getClientVersion(int vulkanMinorVersion)
    {
        switch (vulkanMinorVersion)
        {
        case 0: return glslang::EShTargetVulkan_1_0;
        case 1: return glslang::EShTargetVulkan_1_1;
        case 2: return glslang::EShTargetVulkan_1_2;
        default:
        {
            CCASSERT(false, "Unsupported vulkan version, convert to EShTargetClientVersion failed.");
            return glslang::EShTargetVulkan_1_0;
        }
        }
    }

    glslang::EShTargetLanguageVersion getTargetVersion(int vulkanMinorVersion)
    {
        switch (vulkanMinorVersion)
        {
        case 0: return glslang::EShTargetSpv_1_0;
        case 1: return glslang::EShTargetSpv_1_3;
        case 2: return glslang::EShTargetSpv_1_5;
        default:
        {
            CCASSERT(false, "Unsupported vulkan version, convert to EShTargetLanguageVersion failed.");
            return glslang::EShTargetSpv_1_0;
        }
        }
    }

    const std::vector<unsigned int> GLSL2SPIRV(GFXShaderType type, const String& source, int vulkanMinorVersion = 2)
    {
        static bool glslangInitialized = false;
        if (!glslangInitialized)
        {
            glslang::InitializeProcess();
            glslangInitialized = true;
        }
        std::vector<unsigned int> spirv;
        auto stage = getShaderStage(type);
        auto string = source.c_str();
        glslang::TShader shader(stage);
        shader.setStrings(&string, 1);

        //Set up Vulkan/SpirV Environment
        int clientInputSemanticsVersion = 100 + vulkanMinorVersion * 10; // maps to, say, #define VULKAN 120
        glslang::EShTargetClientVersion clientVersion = getClientVersion(vulkanMinorVersion); // map to, say, Vulkan 1.2
        glslang::EShTargetLanguageVersion targetVersion = getTargetVersion(vulkanMinorVersion); // maps to, say, SPIR-V 1.5

        shader.setEnvInput(glslang::EShSourceGlsl, stage, glslang::EShClientVulkan, clientInputSemanticsVersion);
        shader.setEnvClient(glslang::EShClientVulkan, clientVersion);
        shader.setEnvTarget(glslang::EShTargetSpv, targetVersion);

        EShMessages messages = (EShMessages)(EShMsgSpvRules | EShMsgVulkanRules);

        if (!shader.parse(&DefaultTBuiltInResource, clientInputSemanticsVersion, false, messages))
        {
            CC_LOG_ERROR("GLSL Parsing Failed:\n%s\n%s", shader.getInfoLog(), shader.getInfoDebugLog());
            CC_LOG_ERROR("%s", string);
            return spirv;
        }

        glslang::TProgram program;
        program.addShader(&shader);

        if (!program.link(messages))
        {
            CC_LOG_ERROR("GLSL Linking Failed:\n%s\n%s", program.getInfoLog(), program.getInfoDebugLog());
            CC_LOG_ERROR("%s", string);
            return spirv;
        }

        spv::SpvBuildLogger logger;
        glslang::SpvOptions spvOptions;
        glslang::GlslangToSpv(*program.getIntermediate(stage), spirv, &logger, &spvOptions);
        if(!spirv.size())
        {
            CC_LOG_ERROR("GlslangToSpv Failed:\n%s\n%s", program.getInfoLog(), program.getInfoDebugLog());
            CC_LOG_ERROR("%s", string);
            return spirv;
        }
        return spirv;
    }

    //See more details at https://developer.apple.com/documentation/metal/mtlfeatureset
    enum class GPUFamily : uint
    {
        Apple1, // A7,
        Apple2, // A8
        Apple3, // A9, A10
        Apple4, // A11
        Apple5, // A12
        Apple6, // A13
        
        Mac1,
        Mac2,
    };
}

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
        MTLClearColor mtlColor;
        mtlColor = MTLClearColorMake(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
        return MTLClearColorMake(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    }
    
    MTLVertexFormat toMTLVertexFormat(GFXFormat format, bool isNormalized)
    {
        switch (format) {
            case GFXFormat::R32F: return MTLVertexFormatFloat;
            case GFXFormat::R32I: return MTLVertexFormatInt;
            case GFXFormat::R32UI: return MTLVertexFormatUInt;
            case GFXFormat::RG8: return isNormalized ? MTLVertexFormatUChar2Normalized : MTLVertexFormatUChar2;
            case GFXFormat::RG8I: return isNormalized ? MTLVertexFormatChar2Normalized : MTLVertexFormatChar2;
            case GFXFormat::RG16F: return MTLVertexFormatHalf2;
            case GFXFormat::RG16UI: return isNormalized ? MTLVertexFormatUShort2Normalized : MTLVertexFormatUShort2;
            case GFXFormat::RG16I: return isNormalized ? MTLVertexFormatShort2Normalized : MTLVertexFormatShort2;
            case GFXFormat::RG32I: return MTLVertexFormatInt2;
            case GFXFormat::RG32UI: return MTLVertexFormatUInt2;
            case GFXFormat::RG32F: return MTLVertexFormatFloat2;
            case GFXFormat::RGB8: return isNormalized ? MTLVertexFormatUChar3Normalized : MTLVertexFormatUChar3;
            case GFXFormat::RGB8I: return isNormalized ? MTLVertexFormatChar3Normalized : MTLVertexFormatChar3;
            case GFXFormat::RGB16I: return isNormalized ? MTLVertexFormatShort3Normalized : MTLVertexFormatShort3;
            case GFXFormat::RGB16UI: return isNormalized ? MTLVertexFormatUShort3Normalized : MTLVertexFormatUShort3;
            case GFXFormat::RGB16F: return MTLVertexFormatHalf3;
            case GFXFormat::RGB32I: return MTLVertexFormatInt3;
            case GFXFormat::RGB32UI: return MTLVertexFormatUInt3;
            case GFXFormat::RGB32F: return MTLVertexFormatFloat3;
            case GFXFormat::RGBA8: return isNormalized ? MTLVertexFormatUChar4Normalized : MTLVertexFormatUChar4;
            case GFXFormat::RGBA8I: return isNormalized ? MTLVertexFormatChar4Normalized : MTLVertexFormatChar4;
            case GFXFormat::RGBA16I: return isNormalized ? MTLVertexFormatShort4Normalized : MTLVertexFormatShort4;
            case GFXFormat::RGBA16UI: return isNormalized ? MTLVertexFormatUShort4Normalized : MTLVertexFormatUShort4;
            case GFXFormat::RGBA16F: return MTLVertexFormatHalf4;
            case GFXFormat::RGBA32I: return MTLVertexFormatInt4;
            case GFXFormat::RGBA32UI: return MTLVertexFormatUInt4;
            case GFXFormat::RGBA32F: return MTLVertexFormatFloat4;
            case GFXFormat::RGB10A2: return isNormalized ? MTLVertexFormatInt1010102Normalized : MTLVertexFormatInvalid;
            case GFXFormat::RGB10A2UI: return isNormalized ? MTLVertexFormatUInt1010102Normalized : MTLVertexFormatInvalid;
            case GFXFormat::BGRA8:
            {
                #if CC_PLATFORM == CC_PLATFORM_MAC_IOS
                    if(@available(iOS 11.0, *))
                    {
                        if(isNormalized)
                        {
                            return MTLVertexFormatUChar4Normalized_BGRA;
                        }
                        else
                        {
                            CC_LOG_ERROR("Invalid metal vertex format %u", format);
                            return MTLVertexFormatInvalid;
                        }
                    }
                #else
                    if(@available(macOS 10.13, *))
                    {
                        if(isNormalized)
                        {
                            return MTLVertexFormatUChar4Normalized_BGRA;
                        }
                        else
                        {
                            CC_LOG_ERROR("Invalid metal vertex format %u", format);
                            return MTLVertexFormatInvalid;
                        }
                    }
                #endif
            }
            default:
            {
                CC_LOG_ERROR("Invalid vertex format %u", format);
                return MTLVertexFormatInvalid;
            }
        }
    }
    
    GFXFormat convertGFXPixelFormat(GFXFormat format)
    {
        switch (format) {
            case GFXFormat::RGB8:   return GFXFormat::RGBA8;
            case GFXFormat::RGB32F: return GFXFormat::RGBA32F;
            default: return format;
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
                
            case GFXFormat::RG8: return MTLPixelFormatRG8Unorm;
            case GFXFormat::RG8SN: return MTLPixelFormatRG8Snorm;
            case GFXFormat::RG8UI: return MTLPixelFormatRG8Uint;
            case GFXFormat::RG8I: return MTLPixelFormatRG8Sint;
            case GFXFormat::RG16F: return MTLPixelFormatRG16Float;
            case GFXFormat::RG16UI: return MTLPixelFormatRG16Uint;
            case GFXFormat::RG16I: return MTLPixelFormatRG16Sint;
                
//            case GFXFormat::RGB8SN: return MTLPixelFormatRGBA8Snorm;
//            case GFXFormat::RGB8UI: return MTLPixelFormatRGBA8Uint;
//            case GFXFormat::RGB8I: return MTLPixelFormatRGBA8Sint;
//            case GFXFormat::RGB16F: return MTLPixelFormatRGBA16Float;
//            case GFXFormat::RGB16UI: return MTLPixelFormatRGBA16Uint;
//            case GFXFormat::RGB16I: return MTLPixelFormatRGBA16Sint;
//            case GFXFormat::RGB32F: return MTLPixelFormatRGBA32Float;
//            case GFXFormat::RGB32UI: return MTLPixelFormatRGBA32Uint;
//            case GFXFormat::RGB32I: return MTLPixelFormatRGBA32Sint;
                
            case GFXFormat::RGBA8: return MTLPixelFormatRGBA8Unorm;
            case GFXFormat::RGBA8SN: return MTLPixelFormatRGBA8Snorm;
            case GFXFormat::RGBA8UI: return MTLPixelFormatRGBA8Uint;
            case GFXFormat::RGBA8I: return MTLPixelFormatRGBA8Sint;
            case GFXFormat::RGBA16F: return MTLPixelFormatRGBA16Float;
            case GFXFormat::RGBA16UI: return MTLPixelFormatRGBA16Uint;
            case GFXFormat::RGBA16I: return MTLPixelFormatRGBA16Sint;
            case GFXFormat::RGBA32F: return MTLPixelFormatRGBA32Float;
            case GFXFormat::RGBA32UI: return MTLPixelFormatRGBA32Uint;
            case GFXFormat::RGBA32I: return MTLPixelFormatRGBA32Sint;
            case GFXFormat::BGRA8: return MTLPixelFormatBGRA8Unorm;
                
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
    
    MTLTextureUsage toMTLTextureUsage(GFXTextureUsage usage)
    {
        if (usage == GFXTextureUsage::NONE)
            return MTLTextureUsageUnknown;
        
        MTLTextureUsage ret = MTLTextureUsageUnknown;
        if (usage & GFXTextureUsage::TRANSFER_SRC)
            ret |= MTLTextureUsageShaderRead;
        if (usage & GFXTextureUsage::TRANSFER_DST)
            ret |= MTLTextureUsageShaderWrite;
        if (usage & GFXTextureUsage::SAMPLED)
            ret |= MTLTextureUsageShaderRead;
        if (usage & GFXTextureUsage::STORAGE)
            ret |= MTLTextureUsageShaderWrite;
        if (usage & GFXTextureUsage::COLOR_ATTACHMENT ||
            usage & GFXTextureUsage::DEPTH_STENCIL_ATTACHMENT ||
            usage & GFXTextureUsage::TRANSIENT_ATTACHMENT ||
            usage & GFXTextureUsage::INPUT_ATTACHMENT)
        {
            ret |= MTLTextureUsageRenderTarget;
        }
        
        return ret;
    }
    
    MTLTextureType toMTLTextureType(GFXTextureType type, uint arrayLength, GFXTextureFlags flags)
    {
        switch(type) {
            case GFXTextureType::TEX1D:
                if (arrayLength <= 1)
                    return MTLTextureType1D;
                else
                    return MTLTextureType1DArray;
            case GFXTextureType::TEX2D:
                if (arrayLength <= 1)
                    return MTLTextureType2D;
                else if (flags & GFXTextureFlagBit::CUBEMAP)
                    return MTLTextureTypeCube;
                else
                    return MTLTextureType2DArray;
            case GFXTextureType::TEX3D:
                return MTLTextureType3D;
            default:
                return MTLTextureType2D;
        }
    }
    
    MTLTextureType toMTLTextureType(GFXTextureViewType type)
    {
        switch (type) {
            case GFXTextureViewType::TV1D:          return MTLTextureType1D;
            case GFXTextureViewType::TV1D_ARRAY:    return MTLTextureType1DArray;
            case GFXTextureViewType::TV2D:          return MTLTextureType2D;
            case GFXTextureViewType::TV2D_ARRAY:    return MTLTextureType2DArray;
            case GFXTextureViewType::CUBE:          return MTLTextureTypeCube;
            case GFXTextureViewType::TV3D:          return MTLTextureType3D;
        }
    }
    
    NSUInteger toMTLSampleCount(GFXSampleCount count)
    {
        switch (count) {
            case GFXSampleCount::X1: return 1;
            case GFXSampleCount::X2: return 2;
            case GFXSampleCount::X4: return 4;
            case GFXSampleCount::X8: return 8;
            case GFXSampleCount::X16: return 16;
            case GFXSampleCount::X32: return 32;
            case GFXSampleCount::X64: return 64;
        }
    }
    
    MTLSamplerAddressMode toMTLSamplerAddressMode(GFXAddress mode)
    {
        switch (mode) {
            case GFXAddress::WRAP: return MTLSamplerAddressModeRepeat;
            case GFXAddress::MIRROR: return MTLSamplerAddressModeMirrorRepeat;
            case GFXAddress::CLAMP: return MTLSamplerAddressModeClampToEdge;
            case GFXAddress::BORDER: return MTLSamplerAddressModeClampToBorderColor;
        }
    }
    
    MTLSamplerBorderColor toMTLSamplerBorderColor(const GFXColor& color)
    {
        float diff = color.r - 0.5f;
        if (math::IsEqualF(color.a, 0.f) )
            return MTLSamplerBorderColorTransparentBlack;
        else if (math::IsEqualF(diff, 0.f) )
            return MTLSamplerBorderColorOpaqueBlack;
        else
            return MTLSamplerBorderColorOpaqueWhite;
    }
    
    MTLSamplerMinMagFilter toMTLSamplerMinMagFilter(GFXFilter filter)
    {
        switch (filter) {
            case GFXFilter::LINEAR:
            case GFXFilter::ANISOTROPIC:
                return MTLSamplerMinMagFilterLinear;
            default:
                return MTLSamplerMinMagFilterNearest;
        }
    }
    
    MTLSamplerMipFilter toMTLSamplerMipFilter(GFXFilter filter)
    {
        switch (filter) {
            case GFXFilter::NONE:
                return MTLSamplerMipFilterNotMipmapped;
            case GFXFilter::LINEAR:
            case GFXFilter::ANISOTROPIC:
                return MTLSamplerMipFilterLinear;
            case GFXFilter::POINT:
                return MTLSamplerMipFilterNearest;
        }
    }
    
    std::string compileGLSLShader2Mtl(const std::string& src, bool isVertexShader)
    {
#if USE_METAL
        std::string shaderSource("#version 310 es\n");
        shaderSource.append(src);
        auto type = isVertexShader ? GFXShaderType::VERTEX : GFXShaderType::FRAGMENT;
        const auto& spv = GLSL2SPIRV(type, shaderSource);
        if(spv.size() == 0)
            return "";
        
        spirv_cross::CompilerMSL msl(std::move(spv));
    
        // Set some options.
        spirv_cross::CompilerMSL::Options options;
#if(CC_PLATFORM == CC_PLATFORM_MAC_IOS)
        options.platform = spirv_cross::CompilerMSL::Options::Platform::iOS;
#else
        options.platform = spirv_cross::CompilerMSL::Options::Platform::macOS;
#endif
        msl.set_msl_options(options);

        // Compile to MSL, ready to give to metal driver.
        std::string output = msl.compile();
        if(!output.size())
        {
            CC_LOG_ERROR("Compile to MSL failed.");
            CC_LOG_ERROR("%s", shaderSource.c_str());
        }
        return output;
#else
        return src;
#endif
    }

    uint8_t* convertRGB8ToRGBA8(uint8_t* source, uint length)
    {
        uint finalLength = length * 4;
        uint8* out = (uint8*)CC_MALLOC(finalLength);
        if (!out)
        {
            CC_LOG_WARNING("Failed to alloc memory in convertRGB8ToRGBA8().");
            return source;
        }
        
        uint8_t* src = source;
        uint8_t* dst = out;
        for (uint i = 0; i < length; ++i)
        {
            *dst++ = *src++;
            *dst++ = *src++;
            *dst++ = *src++;
            *dst++ = 255;
        }
        
        return out;
    }

    uint8_t* convertRGB32FToRGBA32F(uint8_t* source, uint length)
    {
        uint finalLength = length * sizeof(float) * 4;
        uint8* out = (uint8*)CC_MALLOC(finalLength);
        if (!out)
        {
            CC_LOG_WARNING("Failed to alloc memory in convertRGB32FToRGBA32F().");
            return source;
        }
        
        float* src = reinterpret_cast<float*>(source);
        float* dst = reinterpret_cast<float*>(out);
        for (uint i = 0; i < length; ++i)
        {
            *dst++ = *src++;
            *dst++ = *src++;
            *dst++ = *src++;
            *dst++ = 1.0f;
        }
        
        return out;
    }

    NSUInteger highestSupportedFeatureSet(id<MTLDevice> device)
    {
        NSUInteger maxKnownFeatureSet;
        NSUInteger defaultFeatureSet;
#if CC_PLATFORM == CC_PLATFORM_MAC_IOS
        defaultFeatureSet = MTLFeatureSet_iOS_GPUFamily1_v1;
        if(@available(iOS 12.0, *)) {
            maxKnownFeatureSet = MTLFeatureSet_iOS_GPUFamily4_v2;
        }
        else if(@available(iOS 11.0, *)) {
            maxKnownFeatureSet = MTLFeatureSet_iOS_GPUFamily4_v1;
        }
        else if(@available(iOS 10.0, *)) {
            maxKnownFeatureSet = MTLFeatureSet_iOS_GPUFamily3_v2;
        }
        else if(@available(iOS 9.0, *)) {
            maxKnownFeatureSet = MTLFeatureSet_iOS_GPUFamily3_v1;
        }
        else {
            maxKnownFeatureSet = MTLFeatureSet_iOS_GPUFamily2_v1;
        }
#else
        defaultFeatureSet = MTLFeatureSet_macOS_GPUFamily1_v1;
        if (@available(macOS 10.14, *)) {
            maxKnownFeatureSet = MTLFeatureSet_macOS_GPUFamily2_v1;
        }
        else if(@available(macOS 10.13, *)) {
            maxKnownFeatureSet = MTLFeatureSet_macOS_GPUFamily1_v3;
        }
        else if(@available(macOS 10.12, *)) {
            maxKnownFeatureSet = MTLFeatureSet_macOS_GPUFamily1_v2;
        }
        else {
            maxKnownFeatureSet = MTLFeatureSet_macOS_GPUFamily1_v1;
        }
#endif
        for (auto featureSet = maxKnownFeatureSet; featureSet >= 0; --featureSet)
        {
            if ([device supportsFeatureSet:MTLFeatureSet(featureSet)])
            {
                return featureSet;
            }
        }
        return defaultFeatureSet;
    }

#if CC_PLATFORM == CC_PLATFORM_MAC_IOS
    String getIOSFeatureSetToString(MTLFeatureSet featureSet)
    {
        if(@available(iOS 8.0, *))
        {
            switch (featureSet) {
            case MTLFeatureSet_iOS_GPUFamily1_v1:
                return "MTLFeatureSet_iOS_GPUFamily1_v1";
            case MTLFeatureSet_iOS_GPUFamily2_v1:
                return "MTLFeatureSet_iOS_GPUFamily2_v1";
            default:
                break;
            }
        }
        if(@available(iOS 9.0, *))
        {
            switch (featureSet) {
            case MTLFeatureSet_iOS_GPUFamily1_v2:
                return "MTLFeatureSet_iOS_GPUFamily1_v2";
            case MTLFeatureSet_iOS_GPUFamily2_v2:
                return "MTLFeatureSet_iOS_GPUFamily2_v2";
            case MTLFeatureSet_iOS_GPUFamily3_v1:
                return "MTLFeatureSet_iOS_GPUFamily3_v1";
            default:
                break;
            }
        }
        if(@available(iOS 10.0, *))
        {
            switch (featureSet) {
            case MTLFeatureSet_iOS_GPUFamily1_v3:
                return "MTLFeatureSet_iOS_GPUFamily1_v3";
            case MTLFeatureSet_iOS_GPUFamily2_v3:
                return "MTLFeatureSet_iOS_GPUFamily2_v3";
            case MTLFeatureSet_iOS_GPUFamily3_v2:
                return "MTLFeatureSet_iOS_GPUFamily3_v2";
            default:
                break;
            }
        }
        if(@available(iOS 11.0, *))
        {
            switch (featureSet) {
            case MTLFeatureSet_iOS_GPUFamily1_v4:
                return "MTLFeatureSet_iOS_GPUFamily2_v4";
            case MTLFeatureSet_iOS_GPUFamily2_v3:
                return "MTLFeatureSet_iOS_GPUFamily2_v3";
            case MTLFeatureSet_iOS_GPUFamily3_v3:
                return "MTLFeatureSet_iOS_GPUFamily3_v3";
            case MTLFeatureSet_iOS_GPUFamily4_v1:
                return "MTLFeatureSet_iOS_GPUFamily4_v1";
            default:
                break;
            }
        }
        if(@available(iOS 12.0, *))
        {
            switch (featureSet) {
            case MTLFeatureSet_iOS_GPUFamily1_v5:
                return "MTLFeatureSet_iOS_GPUFamily1_v5";
            case MTLFeatureSet_iOS_GPUFamily2_v5:
                return "MTLFeatureSet_iOS_GPUFamily2_v5";
            case MTLFeatureSet_iOS_GPUFamily3_v4:
                return "MTLFeatureSet_iOS_GPUFamily3_v4";
            case MTLFeatureSet_iOS_GPUFamily4_v2:
                return "MTLFeatureSet_iOS_GPUFamily4_v2";
            default:
                break;
            }
        }
        return "Invalid metal feature set";
    }

    GPUFamily getIOSGPUFamily(MTLFeatureSet featureSet)
    {
        if(@available(iOS 12.0, *)) {
            switch (featureSet) {
                case MTLFeatureSet_iOS_GPUFamily1_v5:
                    return GPUFamily::Apple1;
                case MTLFeatureSet_iOS_GPUFamily2_v5:
                    return GPUFamily::Apple2;
                case MTLFeatureSet_iOS_GPUFamily3_v4:
                    return GPUFamily::Apple3;
                case MTLFeatureSet_iOS_GPUFamily4_v2:
                    return GPUFamily::Apple4;
                default:
                   break;
            }
        }
        if(@available(iOS 11.0, *)) {
            switch (featureSet) {
                case MTLFeatureSet_iOS_GPUFamily1_v4:
                    return GPUFamily::Apple1;
                case MTLFeatureSet_iOS_GPUFamily2_v4:
                    return GPUFamily::Apple2;
                case MTLFeatureSet_iOS_GPUFamily3_v3:
                    return GPUFamily::Apple3;
                case MTLFeatureSet_iOS_GPUFamily4_v1:
                    return GPUFamily::Apple4;
                default:
                    break;
            }
        }
        if(@available(iOS 10.0, *)) {
            switch (featureSet) {
                case MTLFeatureSet_iOS_GPUFamily1_v3:
                    return GPUFamily::Apple1;
                case MTLFeatureSet_iOS_GPUFamily2_v3:
                    return GPUFamily::Apple2;
                case MTLFeatureSet_iOS_GPUFamily3_v2:
                    return GPUFamily::Apple3;
                default:
                    break;
            }
        }
        if(@available(iOS 9.0, *)) {
            switch (featureSet) {
                case MTLFeatureSet_iOS_GPUFamily1_v2:
                    return GPUFamily::Apple1;
                case MTLFeatureSet_iOS_GPUFamily2_v2:
                    return GPUFamily::Apple2;
                case MTLFeatureSet_iOS_GPUFamily3_v1:
                    return GPUFamily::Apple3;
                default:
                    break;
            }
        }
        if (@available(iOS 8.0, *)) {
            switch (featureSet) {
                case MTLFeatureSet_iOS_GPUFamily1_v1:
                    return GPUFamily::Apple1;
                case MTLFeatureSet_iOS_GPUFamily2_v1:
                    return GPUFamily::Apple2;
                default:
                    break;
            }
        }
        return GPUFamily::Apple1;
    }
#else
    String getMacFeatureSetToString(MTLFeatureSet featureSet)
    {
        if(@available(macOS 10.11, *))
        {
            switch (featureSet) {
            case MTLFeatureSet_macOS_GPUFamily1_v1:
                return "MTLFeatureSet_macOS_GPUFamily1_v1";
            default:
                break;
            }
        }
        if(@available(macOS 10.12, *))
        {
            switch (featureSet) {
            case MTLFeatureSet_macOS_GPUFamily1_v2:
                return "MTLFeatureSet_macOS_GPUFamily1_v2";
            default:
                break;
            }
        }
        if(@available(macOS 10.13, *))
        {
            switch (featureSet) {
            case MTLFeatureSet_macOS_GPUFamily1_v3:
                return "MTLFeatureSet_macOS_GPUFamily1_v3";
            default:
                break;
            }
        }
        if(@available(macOS 10.14, *))
        {
            switch (featureSet) {
            case MTLFeatureSet_macOS_GPUFamily1_v4:
                return "MTLFeatureSet_macOS_GPUFamily1_v4";
            case MTLFeatureSet_macOS_GPUFamily2_v1:
                return "MTLFeatureSet_macOS_GPUFamily2_v1";
            default:
                break;
            }
        }
        return "Invalid metal feature set";
    }

    GPUFamily getMacGPUFamily(MTLFeatureSet featureSet)
    {
        if(@available(macOS 10.14, *)) {
            if (MTLFeatureSet_macOS_GPUFamily2_v1 <= featureSet) {
                return GPUFamily::Mac2;
            }
        }
        return GPUFamily::Mac1;
    }
#endif

    uint getGPUFamily(MTLFeatureSet featureSet)
    {
#if CC_PLATFORM == CC_PLATFORM_MAC_IOS
        return static_cast<uint>(getIOSGPUFamily(featureSet));
#else
        return static_cast<uint>(getMacGPUFamily(featureSet));
#endif
    }
    
    int getMaxVertexAttributes(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return 31;
            default:
                return 31;
        }
    }

    int getMaxEntriesInBufferArgumentTable(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return 31;
            default:
                return 31;
        }
    }

    int getMaxEntriesInTextureArgumentTable(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
                return 31;
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
                return 96;
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return 128;
            default:
                return 31;
        }
    }

    int getMaxEntriesInSamplerStateArgumentTable(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return 16;
            default:
                return 16;
        }
    }

    int getMaxTexture2DWidthHeight(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
                return 8192;
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return 16384;
            default:
                return 8192;
        }
    }

    int getMaxCubeMapTextureWidthHeight(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
                return 8192;
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return 16384;
            default:
                return 8192;
        }
    }

    int getMaxColorRenderTarget(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
                return 4;
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return 8;
            default:
                return 4;
        }
    }

    bool isPVRTCSuppported(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
                return true;
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return false;
            default:
                return false;
        }
    }

    bool isEAC_ETCCSuppported(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
                return true;
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return false;
            default:
                return false;
        }
    }

    bool isASTCSuppported(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
                return false;
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
                return true;
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return false;
            default:
                return false;
        }
    }

    bool isBCSupported(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
                return false;
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return true;
            default:
                return false;
        }
    }

    bool isColorBufferFloatSupported(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return true;
            default:
                return false;
        }
    }

    bool isColorBufferHalfFloatSupported(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return true;
            default:
                return false;
        }
    }

    bool isLinearTextureSupported(uint family)
    {
        switch (static_cast<GPUFamily>(family)) {
            case GPUFamily::Apple1:
            case GPUFamily::Apple2:
            case GPUFamily::Apple3:
            case GPUFamily::Apple4:
            case GPUFamily::Apple5:
            case GPUFamily::Apple6:
            case GPUFamily::Mac1:
            case GPUFamily::Mac2:
                return true;
            default:
                return false;
        }
    }

    
    String featureSetToString(MTLFeatureSet featureSet)
    {
    #if CC_PLATFORM == CC_PLATFORM_MAC_IOS
        return getIOSFeatureSetToString(featureSet);
    #else
        return getMacFeatureSetToString(featureSet);
    #endif
    }

} //namespace mu

NS_CC_END
