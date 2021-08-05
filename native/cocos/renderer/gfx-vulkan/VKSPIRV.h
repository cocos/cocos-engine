/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/Log.h"
#include "gfx-base/GFXDef.h"

#include "glslang/StandAlone/ResourceLimits.h"
#include "glslang/Public/ShaderLang.h"
#include "glslang/SPIRV/GlslangToSpv.h"

namespace cc {
namespace gfx {

inline EShLanguage getShaderStage(ShaderStageFlagBit type) {
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

inline glslang::EShTargetClientVersion getClientVersion(int vulkanMinorVersion) {
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

inline glslang::EShTargetLanguageVersion getTargetVersion(int vulkanMinorVersion) {
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

inline bool glslangInitialized = false;

inline vector<unsigned int> glsl2spirv(ShaderStageFlagBit type, const String &source, int vulkanMinorVersion = 0) {
    if (!glslangInitialized) {
        glslang::InitializeProcess();
        glslangInitialized = true;
    }

    EShLanguage      stage  = getShaderStage(type);
    const char *     string = source.c_str();
    glslang::TShader shader(stage);
    shader.setStrings(&string, 1);

    int                               clientInputSemanticsVersion = 100 + vulkanMinorVersion * 10;
    glslang::EShTargetClientVersion   clientVersion               = getClientVersion(vulkanMinorVersion);
    glslang::EShTargetLanguageVersion targetVersion               = getTargetVersion(vulkanMinorVersion);

    shader.setEnvInput(glslang::EShSourceGlsl, stage, glslang::EShClientVulkan, clientInputSemanticsVersion);
    shader.setEnvClient(glslang::EShClientVulkan, clientVersion);
    shader.setEnvTarget(glslang::EShTargetSpv, targetVersion);

    auto messages = static_cast<EShMessages>(EShMsgSpvRules | EShMsgVulkanRules);

    if (!shader.parse(&glslang::DefaultTBuiltInResource, clientInputSemanticsVersion, false, messages)) {
        CC_LOG_ERROR("GLSL Parsing Failed:\n%s\n%s", shader.getInfoLog(), shader.getInfoDebugLog());
    }

    glslang::TProgram program;
    program.addShader(&shader);

    if (!program.link(messages)) {
        CC_LOG_ERROR("GLSL Linking Failed:\n%s\n%s", program.getInfoLog(), program.getInfoDebugLog());
    }

    vector<unsigned int> spirv;
    spv::SpvBuildLogger  logger;
    glslang::SpvOptions  spvOptions;
    glslang::GlslangToSpv(*program.getIntermediate(stage), spirv, &logger, &spvOptions);

    return spirv;
}

} // namespace gfx
} // namespace cc
