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
#include "gfx-base/GFXDef-common.h"
#ifdef CC_WGPU_WASM
    #include "WGPUDef.h"
#endif
#include "gfx-base/GFXShader.h"

namespace cc {
namespace gfx {

struct CCWGPUShaderObject;
class SPIRVUtils;

class CCWGPUShader final : public Shader {
public:
    CCWGPUShader();
    ~CCWGPUShader();

    inline CCWGPUShaderObject *gpuShaderObject() { return _gpuShaderObject; }

    void initialize(const ShaderInfo &info) { doInit(info); }

    // ems export
    EXPORT_EMS(
        void initialize(const ShaderInfo &info, emscripten::val &spirvs);
        void reflectBinding(const emscripten::val& bindings);
        )

    void initialize(const ShaderInfo &info, const std::vector<std::vector<uint32_t>> &spirvs);
    void initWithWGSL(const ShaderInfo& info);

protected:
    void doInit(const ShaderInfo &info) override;
    void doDestroy() override;

    CCWGPUShaderObject *_gpuShaderObject = nullptr;
    static SPIRVUtils *spirv;
};

} // namespace gfx
} // namespace cc
