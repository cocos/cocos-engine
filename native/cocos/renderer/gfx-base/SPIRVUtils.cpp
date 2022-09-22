/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "SPIRVUtils.h"

#include "base/Log.h"
#include "base/Utils.h"
#include "glslang/Public/ShaderLang.h"
#include "glslang/SPIRV/GlslangToSpv.h"
#include "glslang/StandAlone/ResourceLimits.h"
#include "spirv/spirv.h"

#include <type_traits>
#include "spirv-cross/spirv_glsl.hpp"
#include "spirv-cross/spirv_msl.hpp"
#include "spirv-tools/optimizer.hpp"

namespace cc {
namespace gfx {

namespace {

static_assert(sizeof(std::underlying_type<spv_target_env>) <= sizeof(uint32_t));

EShLanguage getShaderStage(ShaderStageFlagBit type) {
    switch (type) {
        case ShaderStageFlagBit::VERTEX: return EShLangVertex;
        case ShaderStageFlagBit::CONTROL: return EShLangTessControl;
        case ShaderStageFlagBit::EVALUATION: return EShLangTessEvaluation;
        case ShaderStageFlagBit::GEOMETRY: return EShLangGeometry;
        case ShaderStageFlagBit::FRAGMENT: return EShLangFragment;
        case ShaderStageFlagBit::COMPUTE: return EShLangCompute;
        default: {
            CC_ASSERT(false);
            return EShLangVertex;
        }
    }
}

#include <glslang/build_info.h>

glslang::EShTargetClientVersion getClientVersion(int vulkanMinorVersion) {
    switch (vulkanMinorVersion) {
        case 0: return glslang::EShTargetVulkan_1_0;
        case 1: return glslang::EShTargetVulkan_1_1;
        case 2: return glslang::EShTargetVulkan_1_2;
#if GLSLANG_VERSION_LESS_OR_EQUAL_TO(11, 10, 0)
            // This macro is defined in glslang/build_info.h. This expression means that the
            // lib version is greater than or equal to 11.10.0 (not less than or equal to),
            // which is very counterintuitive. But it's the only way to do it.
        case 3: return glslang::EShTargetVulkan_1_3;
#else
        case 3: return glslang::EShTargetVulkan_1_2;
#endif
        default: {
            CC_ASSERT(false);
            return glslang::EShTargetVulkan_1_0;
        }
    }
}

glslang::EShTargetLanguageVersion getTargetVersion(int vulkanMinorVersion) {
    switch (vulkanMinorVersion) {
        case 0: return glslang::EShTargetSpv_1_0;
        case 1: return glslang::EShTargetSpv_1_3;
        case 2: return glslang::EShTargetSpv_1_5;
#if GLSLANG_VERSION_LESS_OR_EQUAL_TO(11, 10, 0)
            // This macro is defined in glslang/build_info.h. This expression means that the
            // lib version is greater than or equal to 11.10.0 (not less than or equal to),
            // which is very counterintuitive. But it's the only way to do it.
        case 3: return glslang::EShTargetSpv_1_6;
#else
        case 3: return glslang::EShTargetSpv_1_5;
#endif
        default: {
            CC_ASSERT(false);
            return glslang::EShTargetSpv_1_0;
        }
    }
}

glslang::EShClient getClientPlatform(gfx::SpirvClientVersion version) {
    switch (version) {
        case gfx::SpirvClientVersion::OPENGL_ES_2_0:
        case gfx::SpirvClientVersion::OPENGL_ES_3_0:
        case gfx::SpirvClientVersion::OPENGL_ES_3_1:
        case gfx::SpirvClientVersion::OPENGL_4_5:
            return glslang::EShClientOpenGL;

        case gfx::SpirvClientVersion::VULKAN_1_0:
        case gfx::SpirvClientVersion::VULKAN_1_1:
        case gfx::SpirvClientVersion::VULKAN_1_2:
        case gfx::SpirvClientVersion::VULKAN_1_3:
            return glslang::EShClientVulkan;

        case gfx::SpirvClientVersion::METAL:
            return glslang::EShClientVulkan;

        default: {
            CC_ASSERT(false);
            return glslang::EShClientVulkan;
        }
    }
}

glslang::EshTargetClientVersion getClientVersion(gfx::SpirvClientVersion version) {
    switch (version) {
        case gfx::SpirvClientVersion::OPENGL_ES_2_0:
        case gfx::SpirvClientVersion::OPENGL_ES_3_0:
        case gfx::SpirvClientVersion::OPENGL_ES_3_1:
        case gfx::SpirvClientVersion::OPENGL_4_5:
            return glslang::EShTargetOpenGL_450;

        case gfx::SpirvClientVersion::VULKAN_1_0: return glslang::EShTargetVulkan_1_0;
        case gfx::SpirvClientVersion::VULKAN_1_1: return glslang::EShTargetVulkan_1_1;
        case gfx::SpirvClientVersion::VULKAN_1_2: return glslang::EShTargetVulkan_1_2;
#if GLSLANG_VERSION_LESS_OR_EQUAL_TO(11, 10, 0)
        case gfx::SpirvClientVersion::VULKAN_1_3: return glslang::EShTargetVulkan_1_3;
#else
        case gfx::SpirvClientVersion::VULKAN_1_3: return glslang::EShTargetVulkan_1_2;
#endif
        case gfx::SpirvClientVersion::METAL:
            return glslang::EShTargetVulkan_1_2;

        default: {
            CC_ASSERT(false);
            return glslang::EShTargetVulkan_1_0;
        }
    }
}

uint32_t getTargetVersion(gfx::SpirvClientVersion version) {
    switch (version) {
        case gfx::SpirvClientVersion::OPENGL_ES_2_0:
            return 300;
        case gfx::SpirvClientVersion::OPENGL_ES_3_0:
        case gfx::SpirvClientVersion::OPENGL_ES_3_1: return 310;
        case gfx::SpirvClientVersion::OPENGL_4_5: return 450;

        case gfx::SpirvClientVersion::VULKAN_1_0: return glslang::EShTargetSpv_1_0;
        case gfx::SpirvClientVersion::VULKAN_1_1: return glslang::EShTargetSpv_1_3;
        case gfx::SpirvClientVersion::VULKAN_1_2: return glslang::EShTargetSpv_1_5;
#if GLSLANG_VERSION_LESS_OR_EQUAL_TO(11, 10, 0)
        case gfx::SpirvClientVersion::VULKAN_1_3: return glslang::EShTargetSpv_1_6;
#else
        case gfx::SpirvClientVersion::VULKAN_1_3: return glslang::EShTargetSpv_1_5;
#endif
        default: {
            CC_ASSERT(false);
            return glslang::EShTargetSpv_1_0;
        }
    }
}

glslang::EShTargetLanguageVersion getLanguageVersion(gfx::SpirvClientVersion version) {
    switch (version) {
        case gfx::SpirvClientVersion::OPENGL_ES_2_0:
        case gfx::SpirvClientVersion::OPENGL_ES_3_0:
        case gfx::SpirvClientVersion::OPENGL_ES_3_1:
        case gfx::SpirvClientVersion::OPENGL_4_5:
            return glslang::EShTargetSpv_1_0;

        default: {
            return static_cast<glslang::EShTargetLanguageVersion> (getTargetVersion(version));
        }
    };
}

spv_target_env getTargetEnv(gfx::SpirvClientVersion version) {
    switch (version) {
        case gfx::SpirvClientVersion::OPENGL_ES_2_0:
        case gfx::SpirvClientVersion::OPENGL_ES_3_0:
        case gfx::SpirvClientVersion::OPENGL_ES_3_1: return SPV_ENV_OPENGL_4_5;
        case gfx::SpirvClientVersion::VULKAN_1_0: return SPV_ENV_VULKAN_1_0;
        case gfx::SpirvClientVersion::VULKAN_1_1: return SPV_ENV_VULKAN_1_1;
        case gfx::SpirvClientVersion::VULKAN_1_2:
        case gfx::SpirvClientVersion::VULKAN_1_3: return SPV_ENV_VULKAN_1_2;
        default:
            CC_LOG_ERROR("Unsupported SPIRV version: %d", version);
            return SPV_ENV_UNIVERSAL_1_0;
    }
}

// https://www.khronos.org/registry/spir-v/specs/1.0/SPIRV.pdf
struct Id {
    uint32_t opcode{0};
    uint32_t typeId{0};
    uint32_t storageClass{0};
    uint32_t *pLocation{nullptr};
};
} // namespace

SPIRVUtils SPIRVUtils::instance;

void SPIRVUtils::initialize(gfx::SpirvClientVersion clientVersion) {
    glslang::InitializeProcess();
    _clientPlatform = getClientPlatform(clientVersion);
    _clientVersion = getClientVersion(clientVersion);
    _languageVersion = getLanguageVersion(clientVersion);
    _targetVersion = getTargetVersion(clientVersion);
    _optimizerEnv = getTargetEnv(clientVersion);
}

void SPIRVUtils::destroy() {
    glslang::FinalizeProcess();
    _output.clear();
}

ccstd::vector<uint32_t> SPIRVUtils::compileGLSL(ShaderStageFlagBit type, const ccstd::string &source) {
    EShLanguage stage = getShaderStage(type);
    const char *string = source.c_str();

    _shader = std::make_unique<glslang::TShader>(stage);
    _shader->setStrings(&string, 1);

    _shader->setEnvInput(glslang::EShSourceGlsl, stage, _clientPlatform, _clientVersion);
    _shader->setEnvClient(_clientPlatform, _clientVersion);
    _shader->setEnvTarget(glslang::EShTargetSpv, _languageVersion);

    if (_clientPlatform == glslang::EShClientOpenGL) {
        _shader->setAutoMapBindings(true);
        _shader->setAutoMapLocations(true);
    }

    auto rules = (_clientPlatform == glslang::EShClientOpenGL) ? EShMsgSpvRules : (EShMsgSpvRules | EShMsgVulkanRules);

    auto messages = static_cast<EShMessages>(rules);

    if (!_shader->parse(&glslang::DefaultTBuiltInResource, _clientVersion, false, messages)) {
        CC_LOG_ERROR("GLSL Parsing Failed:\n%s\n%s", _shader->getInfoLog(), _shader->getInfoDebugLog());
    }

    _program = std::make_unique<glslang::TProgram>();
    _program->addShader(_shader.get());

    if (!_program->link(messages)) {
        CC_LOG_ERROR("GLSL Linking Failed:\n%s\n%s", _program->getInfoLog(), _program->getInfoDebugLog());
    }

    _output.clear();
    spv::SpvBuildLogger logger;
    glslang::SpvOptions spvOptions;
    spvOptions.disableOptimizer = false;
    spvOptions.optimizeSize = true;
#if CC_DEBUG > 0
    // spvOptions.validate = true;
#else
    spvOptions.stripDebugInfo = true;
#endif
    glslang::GlslangToSpv(*_program->getIntermediate(stage), _output, &logger, &spvOptions);
    return _output;
}

 ccstd::vector<uint32_t> SPIRVUtils::compressInputLocations(gfx::AttributeList &attributes) {
    static ccstd::vector<Id> ids;
    static ccstd::vector<uint32_t> activeLocations;
    static ccstd::vector<uint32_t> newLocations;

    uint32_t *code = _output.data();
    uint32_t codeSize = utils::toUint(_output.size());

    CC_ASSERT(code[0] == SpvMagicNumber);

    uint32_t idBound = code[3];
    ids.assign(idBound, {});

    uint32_t *insn = code + 5;
    while (insn != code + codeSize) {
        auto opcode = static_cast<uint16_t>(insn[0]);
        auto wordCount = static_cast<uint16_t>(insn[0] >> 16);

        switch (opcode) {
            case SpvOpDecorate: {
                CC_ASSERT(wordCount >= 3);

                uint32_t id = insn[1];
                CC_ASSERT(id < idBound);

                switch (insn[2]) {
                    case SpvDecorationLocation:
                        CC_ASSERT(wordCount == 4);
                        ids[id].pLocation = &insn[3];
                        break;
                }
            } break;
            case SpvOpVariable: {
                CC_ASSERT(wordCount >= 4);

                uint32_t id = insn[2];
                CC_ASSERT(id < idBound);

                CC_ASSERT(ids[id].opcode == 0);
                ids[id].opcode = opcode;
                ids[id].typeId = insn[1];
                ids[id].storageClass = insn[3];
            } break;
        }

        CC_ASSERT(insn + wordCount <= code + codeSize);
        insn += wordCount;
    }

    _program->buildReflection();
    activeLocations.clear();
    int activeCount = _program->getNumPipeInputs();
    for (int i = 0; i < activeCount; ++i) {
        activeLocations.push_back(_program->getPipeInput(i).getType()->getQualifier().layoutLocation);
    }

    uint32_t location = 0;
    uint32_t unusedLocation = activeCount;
    newLocations.assign(attributes.size(), UINT_MAX);

    for (auto &id : ids) {
        if (id.opcode == SpvOpVariable && id.storageClass == SpvStorageClassInput && id.pLocation) {
            uint32_t oldLocation = *id.pLocation;

            // update locations in SPIRV
            if (std::find(activeLocations.begin(), activeLocations.end(), *id.pLocation) != activeLocations.end()) {
                *id.pLocation = location++;
            } else {
                *id.pLocation = unusedLocation++;
            }

            // save record
            bool found{false};
            for (size_t i = 0; i < attributes.size(); ++i) {
                if (attributes[i].location == oldLocation) {
                    newLocations[i] = *id.pLocation;
                    found = true;
                    break;
                }
            }

            // Missing attribute declarations?
            CC_ASSERT(found);
        }
    }

    // update gfx references
    for (size_t i = 0; i < attributes.size(); ++i) {
        attributes[i].location = newLocations[i];
    }

    attributes.erase(std::remove_if(attributes.begin(), attributes.end(), [](const auto &attr) {
                         return attr.location == UINT_MAX;
                     }),
                     attributes.end());
    return _output;
 }

ccstd::vector<uint32_t> SPIRVUtils::compileGLSL2SPIRV(ShaderStageFlagBit type, const ccstd::string &source) {
    return compileGLSL(type, source);
    EShLanguage stage = getShaderStage(type);
    const char *string = source.c_str();

    auto _shader = std::make_unique<glslang::TShader>(stage);
    _shader->setStrings(&string, 1);
    _shader->setEnvInput(glslang::EShSourceGlsl, stage, _clientPlatform, _clientVersion);
    _shader->setEnvClient(_clientPlatform, _clientVersion);
    _shader->setEnvTarget(glslang::EShTargetSpv, _languageVersion);
    _shader->setEntryPoint("main");

    if (_clientPlatform == glslang::EShClientOpenGL) {
        _shader->setAutoMapBindings(true);
        _shader->setAutoMapLocations(true);
    }

    auto messages = static_cast<EShMessages>(EShMsgSpvRules);

    if (!_shader->parse(&glslang::DefaultTBuiltInResource, _languageVersion, false, messages)) {
        CC_LOG_ERROR("GLSL Parsing Failed:\n%s\n%s", _shader->getInfoLog(), _shader->getInfoDebugLog());
    }

    _program = std::make_unique<glslang::TProgram>();
    _program->addShader(_shader.get());

    if (!_program->link(messages)) {
        CC_LOG_ERROR("GLSL Linking Failed:\n%s\n%s", _program->getInfoLog(), _program->getInfoDebugLog());
    }

    _output.clear();
    spv::SpvBuildLogger logger;
    glslang::SpvOptions spvOptions;
    spvOptions.disableOptimizer = false;
    spvOptions.optimizeSize = true;
#if CC_DEBUG > 0
    spvOptions.validate = true;
#else
    spvOptions.stripDebugInfo = true;
#endif
    glslang::GlslangToSpv(*_program->getIntermediate(stage), _output, &logger, &spvOptions);
    return _output;
}

ccstd::string SPIRVUtils::compileSPIRV2GLSL(ShaderStageFlagBit type, const ccstd::vector<uint32_t> &source) {
    auto isOpenGLES = [](uint32_t targetVersion) {
        return targetVersion == 300 || targetVersion == 310 || targetVersion == 450;
    };

    spirv_cross::CompilerGLSL glsl(source);
    spirv_cross::CompilerGLSL::Options options;
    options.version = _targetVersion;
    options.es = isOpenGLES(_targetVersion);
    glsl.set_common_options(options);

    std::string output = glsl.compile();
    if (output.empty()) {
        printf("Failed to compile shader to GLSL");
    }
    return output;
}

ccstd::string SPIRVUtils::compileSPIRV2MSL(ShaderStageFlagBit type, const ccstd::vector<uint32_t> &source) {
    spirv_cross::CompilerMSL msl(source);

    spirv_cross::CompilerMSL::Options options;
    options.platform = spirv_cross::CompilerMSL::Options::macOS;
    options.set_msl_version(2, 3, 0);
    options.emulate_subgroups = true;

    msl.set_msl_options(options);

    std::string output = msl.compile();
    if (output.empty()) {
        printf("Failed to compile shader to MSL");
    }
    return output;
}

ccstd::string compileSPIRV2WGSL(ShaderStageFlagBit type, const ccstd::vector<uint32_t> &source) {
    // not supported yet
    CC_ASSERT(false);
    return {};
}


ccstd::string SPIRVUtils::compileSPIRV2WGSL(ShaderStageFlagBit type, const ccstd::vector<uint32_t> &source) {
    return {};
}

ccstd::vector<uint32_t> SPIRVUtils::optimizeSPIRV(ShaderStageFlagBit type, const ccstd::vector<uint32_t> &source) {
    std::vector<uint32_t> output;
    spvtools::Optimizer optimizer(static_cast<spv_target_env>(_optimizerEnv));

    // enable all optimizations
    optimizer.RegisterPass(spvtools::CreateWrapOpKillPass());
    optimizer.RegisterPass(spvtools::CreateDeadBranchElimPass());
    optimizer.RegisterPass(spvtools::CreateMergeReturnPass());
    optimizer.RegisterPass(spvtools::CreateInlineExhaustivePass());
    optimizer.RegisterPass(spvtools::CreateEliminateDeadFunctionsPass());
    optimizer.RegisterPass(spvtools::CreateAggressiveDCEPass());
    optimizer.RegisterPass(spvtools::CreatePrivateToLocalPass());
    optimizer.RegisterPass(spvtools::CreateLocalSingleBlockLoadStoreElimPass());
    optimizer.RegisterPass(spvtools::CreateLocalSingleStoreElimPass());
    optimizer.RegisterPass(spvtools::CreateAggressiveDCEPass());
    optimizer.RegisterPass(spvtools::CreateScalarReplacementPass(100));
    optimizer.RegisterPass(spvtools::CreateLocalAccessChainConvertPass());
    optimizer.RegisterPass(spvtools::CreateLocalSingleBlockLoadStoreElimPass());
    optimizer.RegisterPass(spvtools::CreateLocalSingleStoreElimPass());
    optimizer.RegisterPass(spvtools::CreateAggressiveDCEPass());
    optimizer.RegisterPass(spvtools::CreateSimplificationPass());
    optimizer.RegisterPass(spvtools::CreateAggressiveDCEPass());
    optimizer.RegisterPass(spvtools::CreateCCPPass());
    optimizer.RegisterPass(spvtools::CreateAggressiveDCEPass());
    optimizer.RegisterPass(spvtools::CreateLoopUnrollPass(true));
    optimizer.RegisterPass(spvtools::CreateDeadBranchElimPass());
    optimizer.RegisterPass(spvtools::CreateRedundancyEliminationPass());
    optimizer.RegisterPass(spvtools::CreateCombineAccessChainsPass());
    optimizer.RegisterPass(spvtools::CreateSimplificationPass());
    optimizer.RegisterPass(spvtools::CreateScalarReplacementPass(100));
    optimizer.RegisterPass(spvtools::CreateLocalAccessChainConvertPass());
    optimizer.RegisterPass(spvtools::CreateLocalSingleBlockLoadStoreElimPass());
    optimizer.RegisterPass(spvtools::CreateLocalSingleStoreElimPass());
    optimizer.RegisterPass(spvtools::CreateAggressiveDCEPass());
    optimizer.RegisterPass(spvtools::CreateSimplificationPass());
    optimizer.RegisterPass(spvtools::CreateVectorDCEPass());
    optimizer.RegisterPass(spvtools::CreateDeadInsertElimPass());
    optimizer.RegisterPass(spvtools::CreateDeadBranchElimPass());
    optimizer.RegisterPass(spvtools::CreateSimplificationPass());
    optimizer.RegisterPass(spvtools::CreateIfConversionPass());
    optimizer.RegisterPass(spvtools::CreateCopyPropagateArraysPass());
    optimizer.RegisterPass(spvtools::CreateReduceLoadSizePass());
    optimizer.RegisterPass(spvtools::CreateAggressiveDCEPass());
    optimizer.RegisterPass(spvtools::CreateBlockMergePass());
    optimizer.RegisterPass(spvtools::CreateRedundancyEliminationPass());
    optimizer.RegisterPass(spvtools::CreateDeadBranchElimPass());
    optimizer.RegisterPass(spvtools::CreateBlockMergePass());
    optimizer.RegisterPass(spvtools::CreateSimplificationPass());

    // optimize the shader
    optimizer.Run(source.data(), source.size(), &output);
    return output;
}

} // namespace gfx
} // namespace cc
