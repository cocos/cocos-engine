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

#pragma once

#include <memory>
#include "gfx-base/GFXDef.h"
#include "glslang/Public/ShaderLang.h"
#include "spirv-tools/optimizer.hpp"

namespace cc {
namespace gfx {

class SPIRVUtils {
public:
    static SPIRVUtils *getInstance() { return &instance; }

    // void initialize(int clientVersion, int spvTargetVersion);
    void initialize(gfx::SpirvClientVersion version);
    void destroy();

    ccstd::vector<uint32_t> compileGLSL(ShaderStageFlagBit type, const ccstd::string &source);

    // SPIRVUtils &compileSPV(ShaderStageFlagBit type, const ccstd::string &source);
    // SPIRVUtils &optimize();
    // SPIRVUtils &crossCompile(gfx::API api);

    ccstd::vector<uint32_t> compileGLSL2SPIRV(ShaderStageFlagBit type, const ccstd::string &source);
    ccstd::string compileSPIRV2GLSL(ShaderStageFlagBit type, const ccstd::vector<uint32_t> &source);
    ccstd::string compileSPIRV2MSL(ShaderStageFlagBit type, const ccstd::vector<uint32_t> &source);
    ccstd::string compileSPIRV2WGSL(ShaderStageFlagBit type, const ccstd::vector<uint32_t> &source);
    ccstd::vector<uint32_t> optimizeSPIRV(ShaderStageFlagBit type, const ccstd::vector<uint32_t> &source);

    ccstd::vector<uint32_t> compressInputLocations(gfx::AttributeList &attributes);

    inline uint32_t *getOutputData() {
        _shader.reset();
        _program.reset();
        return _output.data();
    }

    inline ccstd::string getOutputSource(){
        return _source;
    };

    inline size_t getOutputSize() {
        return _output.size() * sizeof(uint32_t);
    }

private:
    glslang::EShClient _clientPlatform{glslang::EShClientVulkan};

    // client version is the version of the env platform, _targetVersion is the version of target language, _languageVersion is the version of spirv
    glslang::EShTargetClientVersion _clientVersion{glslang::EShTargetClientVersion::EShTargetVulkan_1_0};
    uint32_t _targetVersion{100};
    glslang::EShTargetLanguageVersion _languageVersion{glslang::EShTargetLanguageVersion::EShTargetSpv_1_0};
    uint32_t _optimizerEnv{0};

    std::unique_ptr<glslang::TShader> _shader{nullptr};
    std::unique_ptr<glslang::TProgram> _program{nullptr};
    ccstd::vector<uint32_t> _output;
    ccstd::string _source;

    static SPIRVUtils instance;
};

} // namespace gfx
} // namespace cc
