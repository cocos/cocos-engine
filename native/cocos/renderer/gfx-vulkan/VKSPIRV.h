#ifndef CC_GFXVULKAN_SPIRV_H_
#define CC_GFXVULKAN_SPIRV_H_

#include "SPIRV/GlslangToSpv.h"
#include "glslang/Public/ShaderLang.h"
#include "StandAlone/ResourceLimits.h"

namespace cc {
namespace gfx {

namespace {
EShLanguage getShaderStage(ShaderStageFlagBit type) {
    switch (type) {
        case ShaderStageFlagBit::VERTEX: return EShLangVertex;
        case ShaderStageFlagBit::CONTROL: return EShLangTessControl;
        case ShaderStageFlagBit::EVALUATION: return EShLangTessEvaluation;
        case ShaderStageFlagBit::GEOMETRY: return EShLangGeometry;
        case ShaderStageFlagBit::FRAGMENT: return EShLangFragment;
        case ShaderStageFlagBit::COMPUTE: return EShLangCompute;
        default: {
            CCASSERT(false, "Unsupported ShaderStageFlagBit, convert to EShLanguage failed.");
            return EShLangVertex;
        }
    }
}

glslang::EShTargetClientVersion getClientVersion(int vulkanMinorVersion) {
    switch (vulkanMinorVersion) {
        case 0: return glslang::EShTargetVulkan_1_0;
        case 1: return glslang::EShTargetVulkan_1_1;
        case 2: return glslang::EShTargetVulkan_1_2;
        default: {
            CCASSERT(false, "Unsupported vulkan version, convert to EShTargetClientVersion failed.");
            return glslang::EShTargetVulkan_1_0;
        }
    }
}

glslang::EShTargetLanguageVersion getTargetVersion(int vulkanMinorVersion) {
    switch (vulkanMinorVersion) {
        case 0: return glslang::EShTargetSpv_1_0;
        case 1: return glslang::EShTargetSpv_1_3;
        case 2: return glslang::EShTargetSpv_1_5;
        default: {
            CCASSERT(false, "Unsupported vulkan version, convert to EShTargetLanguageVersion failed.");
            return glslang::EShTargetSpv_1_0;
        }
    }
}

bool glslangInitialized = false;

const vector<unsigned int> GLSL2SPIRV(ShaderStageFlagBit type, const String &source, int vulkanMinorVersion = 0) {
    if (!glslangInitialized) {
        glslang::InitializeProcess();
        glslangInitialized = true;
    }

    EShLanguage stage = getShaderStage(type);
    const char *string = source.c_str();
    glslang::TShader shader(stage);
    shader.setStrings(&string, 1);

    int clientInputSemanticsVersion = 100 + vulkanMinorVersion * 10;
    glslang::EShTargetClientVersion clientVersion = getClientVersion(vulkanMinorVersion);
    glslang::EShTargetLanguageVersion targetVersion = getTargetVersion(vulkanMinorVersion);

    shader.setEnvInput(glslang::EShSourceGlsl, stage, glslang::EShClientVulkan, clientInputSemanticsVersion);
    shader.setEnvClient(glslang::EShClientVulkan, clientVersion);
    shader.setEnvTarget(glslang::EShTargetSpv, targetVersion);

    EShMessages messages = (EShMessages)(EShMsgSpvRules | EShMsgVulkanRules);

    if (!shader.parse(&glslang::DefaultTBuiltInResource, clientInputSemanticsVersion, false, messages)) {
        CC_LOG_ERROR("GLSL Parsing Failed:\n%s\n%s", shader.getInfoLog(), shader.getInfoDebugLog());
    }

    glslang::TProgram program;
    program.addShader(&shader);

    if (!program.link(messages)) {
        CC_LOG_ERROR("GLSL Linking Failed:\n%s\n%s", program.getInfoLog(), program.getInfoDebugLog());
    }

    vector<unsigned int> spirv;
    spv::SpvBuildLogger logger;
    glslang::SpvOptions spvOptions;
    glslang::GlslangToSpv(*program.getIntermediate(stage), spirv, &logger, &spvOptions);

    return spirv;
}

} // namespace

} // namespace gfx
} // namespace cc

#endif
