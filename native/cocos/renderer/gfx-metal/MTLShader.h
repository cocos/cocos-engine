/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "gfx-base/GFXShader.h"

#import <Metal/MTLLibrary.h>

namespace cc {
namespace gfx {
class CCMTLGPUShader;
class CCMTLShader final : public Shader {
public:
    explicit CCMTLShader(Device *device);
    ~CCMTLShader() override = default;
    CCMTLShader(const CCMTLShader &)=delete;
    CCMTLShader(CCMTLShader &&)=delete;
    CCMTLShader &operator=(const CCMTLShader &)=delete;
    CCMTLShader &operator=(CCMTLShader &&)=delete;

    bool initialize(const ShaderInfo &info) override;
    void destroy() override;

    CC_INLINE id<MTLFunction> getVertMTLFunction() const { return _vertexMTLFunction; }
    CC_INLINE id<MTLFunction> getFragmentMTLFunction() const { return _fragmentMTLFunction; }
    CC_INLINE const unordered_map<uint, uint> &getFragmentSamplerBindings() const { return _mtlFragmentSamplerBindings; }
    CC_INLINE const CCMTLGPUShader *gpuShader() const { return _gpuShader; }

    uint getAvailableBufferBindingIndex(ShaderStageFlagBit stage, uint stream);

#ifdef DEBUG_SHADER
    CC_INLINE const String &getVertGlslShader() const { return _vertGlslShader; }
    CC_INLINE const String &getVertMtlSahder() const { return _vertMtlShader; }
    CC_INLINE const String &getFragGlslShader() const { return _fragGlslShader; }
    CC_INLINE const String &getFragMtlSahder() const { return _fragMtlShader; }
#endif

private:
    bool createMTLFunction(const ShaderStage &);
    void setAvailableBufferBindingIndex();

private:
    id<MTLFunction> _vertexMTLFunction = nil;
    id<MTLFunction> _fragmentMTLFunction = nil;
    unordered_map<uint, uint> _mtlFragmentSamplerBindings;
    vector<uint> _availableVertexBufferBindingIndex;
    vector<uint> _availableFragmentBufferBindingIndex;

    CCMTLGPUShader *_gpuShader = nullptr;

    // For debug
#ifdef DEBUG_SHADER
    String _vertGlslShader;
    String _vertMtlShader;
    String _fragGlslShader;
    String _fragMtlShader;
#endif
};

} // namespace gfx
} // namespace cc
