/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include <memory>
#include "gfx-base/GFXDef.h"
#include "glslang/Public/ShaderLang.h"

namespace cc {
namespace gfx {

class SPIRVUtils {
public:
    static SPIRVUtils *getInstance() { return &instance; }

    void initialize(int vulkanMinorVersion);
    void destroy();

    void compileGLSL(ShaderStageFlagBit type, const ccstd::string &source);
    void compressInputLocations(gfx::AttributeList &attributes);

    inline uint32_t *getOutputData() {
        _shader.reset();
        _program.reset();
        return _output.data();
    }

    inline size_t getOutputSize() {
        return _output.size() * sizeof(uint32_t);
    }

private:
    int _clientInputSemanticsVersion{0};
    glslang::EShTargetClientVersion _clientVersion{glslang::EShTargetClientVersion::EShTargetVulkan_1_0};
    glslang::EShTargetLanguageVersion _targetVersion{glslang::EShTargetLanguageVersion::EShTargetSpv_1_0};

    std::unique_ptr<glslang::TShader> _shader{nullptr};
    std::unique_ptr<glslang::TProgram> _program{nullptr};
    ccstd::vector<uint32_t> _output;

    static SPIRVUtils instance;
};

} // namespace gfx
} // namespace cc
