/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

#include "gfx-base/GFXShader.h"

#import <Metal/MTLLibrary.h>

namespace cc {
namespace gfx {
class CCMTLRenderPass;
class CCMTLGPUShader;
class SPIRVUtils;
class CCMTLShader final : public Shader {
public:
    explicit CCMTLShader();
    ~CCMTLShader();
    CCMTLShader(const CCMTLShader &) = delete;
    CCMTLShader(CCMTLShader &&) = delete;
    CCMTLShader &operator=(const CCMTLShader &) = delete;
    CCMTLShader &operator=(CCMTLShader &&) = delete;

    inline id<MTLFunction> getVertMTLFunction() const { return _vertFunction; }
    inline id<MTLFunction> getFragmentMTLFunction() const { return _fragFunction; }
    inline id<MTLFunction> getComputeMTLFunction() const { return _cmptFunction; }
    inline const ccstd::unordered_map<uint32_t, uint32_t> &getFragmentSamplerBindings() const { return _mtlFragmentSamplerBindings; }
    const CCMTLGPUShader *gpuShader(CCMTLRenderPass *renderPass, uint32_t subPass);

    uint32_t getAvailableBufferBindingIndex(ShaderStageFlagBit stage, uint32_t stream);

    id<MTLFunction> getSpecializedFragFunction(uint32_t *index, int *val, uint32_t count);

#ifdef DEBUG_SHADER
    inline const ccstd::string &getVertGlslShader() const { return _vertGlslShader; }
    inline const ccstd::string &getVertMtlSahder() const { return _vertMtlShader; }
    inline const ccstd::string &getFragGlslShader() const { return _fragGlslShader; }
    inline const ccstd::string &getFragMtlSahder() const { return _fragMtlShader; }
    inline const ccstd::string &getcompGlslShader() const { return _cmptGlslShader; }
    inline const ccstd::string &getcompMtlSahder() const { return _cmptMtlShader; }
#endif

protected:
    void doInit(const ShaderInfo &info) override;
    void doDestroy() override;

    bool checkInputAttachment(const ShaderInfo& info) const;
    bool createMTLFunction(const ShaderStage &, CCMTLRenderPass *renderPass, uint32_t subPass);
    void setAvailableBufferBindingIndex();

    id<MTLFunction> _vertFunction = nil;
    id<MTLFunction> _fragFunction = nil;
    id<MTLFunction> _cmptFunction = nil;

    id<MTLLibrary> _vertLibrary = nil;
    id<MTLLibrary> _fragLibrary = nil;
    id<MTLLibrary> _cmptLibrary = nil;

    // function constant hash , specialized MTLFunction
    NSMutableDictionary<NSString *, id<MTLFunction>> *_specializedFragFuncs = nil;

    ccstd::unordered_map<uint32_t, uint32_t> _mtlFragmentSamplerBindings;
    ccstd::vector<uint32_t> _availableVertexBufferBindingIndex;
    ccstd::vector<uint32_t> _availableFragmentBufferBindingIndex;

    CCMTLGPUShader *_gpuShader = nullptr;

    static SPIRVUtils *spirv;

    // For debug
#ifdef DEBUG_SHADER
    ccstd::string _vertGlslShader;
    ccstd::string _vertMtlShader;
    ccstd::string _fragGlslShader;
    ccstd::string _fragMtlShader;
    ccstd::string _cmptGlslShader;
    ccstd::string _cmptMtlShader;
#endif
};

} // namespace gfx
} // namespace cc
