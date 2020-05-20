#ifndef CC_GFXVULKAN_SPIRV_H_
#define CC_GFXVULKAN_SPIRV_H_

#include "SPIRV/GlslangToSpv.h"
#include "glslang/public/ShaderLang.h"

NS_CC_BEGIN

namespace
{
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

    bool glslangInitialized = false;

    const TBuiltInResource defaultTBuiltInResource{
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
        /* .maxMeshOutputVerticesNV = */ 256,
        /* .maxMeshOutputPrimitivesNV = */ 512,
        /* .maxMeshWorkGroupSizeX_NV = */ 32,
        /* .maxMeshWorkGroupSizeY_NV = */ 1,
        /* .maxMeshWorkGroupSizeZ_NV = */ 1,
        /* .maxTaskWorkGroupSizeX_NV = */ 32,
        /* .maxTaskWorkGroupSizeY_NV = */ 1,
        /* .maxTaskWorkGroupSizeZ_NV = */ 1,
        /* .maxMeshViewCountNV = */ 4,

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
    } };

    const vector<unsigned int>::type GLSL2SPIRV(GFXShaderType type, const String &source, int vulkanMinorVersion = 2)
    {
        if (!glslangInitialized)
        {
            glslang::InitializeProcess();
            glslangInitialized = true;
        }

        EShLanguage stage = getShaderStage(type);
        const char* string = source.c_str();
        glslang::TShader shader(stage);
        shader.setStrings(&string, 1);

        int clientInputSemanticsVersion = 100 + vulkanMinorVersion * 10;
        glslang::EShTargetClientVersion clientVersion = getClientVersion(vulkanMinorVersion);
        glslang::EShTargetLanguageVersion targetVersion = getTargetVersion(vulkanMinorVersion);

        shader.setEnvInput(glslang::EShSourceGlsl, stage, glslang::EShClientVulkan, clientInputSemanticsVersion);
        shader.setEnvClient(glslang::EShClientVulkan, clientVersion);
        shader.setEnvTarget(glslang::EShTargetSpv, targetVersion);

        EShMessages messages = (EShMessages)(EShMsgSpvRules | EShMsgVulkanRules);

        if (!shader.parse(&defaultTBuiltInResource, clientInputSemanticsVersion, false, messages))
        {
            CC_LOG_ERROR("GLSL Parsing Failed:\n%s\n%s", shader.getInfoLog(), shader.getInfoDebugLog());
        }

        glslang::TProgram program;
        program.addShader(&shader);

        if (!program.link(messages))
        {
            CC_LOG_ERROR("GLSL Linking Failed:\n%s\n%s", program.getInfoLog(), program.getInfoDebugLog());
        }

        std::vector<unsigned int> spirv;
        spv::SpvBuildLogger logger;
        glslang::SpvOptions spvOptions;
        glslang::GlslangToSpv(*program.getIntermediate(stage), spirv, &logger, &spvOptions);

        return std::move(spirv);
    }
}

#endif

NS_CC_END
