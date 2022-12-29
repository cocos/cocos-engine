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

#include "GFXObject.h"
#include "base/RefCounted.h"

namespace cc {
namespace gfx {

class CC_DLL PipelineState : public GFXObject, public RefCounted {
public:
    PipelineState();
    ~PipelineState() override;

    void initialize(const PipelineStateInfo &info);
    void destroy();

    inline Shader *getShader() const { return _shader; }
    inline PipelineBindPoint getBindPoint() const { return _bindPoint; }
    inline PrimitiveMode getPrimitive() const { return _primitive; }
    inline DynamicStateFlags getDynamicStates() const { return _dynamicStates; }
    inline const InputState &getInputState() const { return _inputState; }
    inline const RasterizerState &getRasterizerState() const { return _rasterizerState; }
    inline const DepthStencilState &getDepthStencilState() const { return _depthStencilState; }
    inline const BlendState &getBlendState() const { return _blendState; }
    inline const RenderPass *getRenderPass() const { return _renderPass; }
    inline const PipelineLayout *getPipelineLayout() const { return _pipelineLayout; }

protected:
    virtual void doInit(const PipelineStateInfo &info) = 0;
    virtual void doDestroy() = 0;

    Shader *_shader = nullptr;
    PipelineBindPoint _bindPoint = PipelineBindPoint::GRAPHICS;
    PrimitiveMode _primitive = PrimitiveMode::TRIANGLE_LIST;
    DynamicStateFlags _dynamicStates = DynamicStateFlags::NONE;
    InputState _inputState;
    RasterizerState _rasterizerState;
    DepthStencilState _depthStencilState;
    BlendState _blendState;
    RenderPass *_renderPass = nullptr;
    uint32_t _subpass = 0U;
    PipelineLayout *_pipelineLayout = nullptr;
};

} // namespace gfx
} // namespace cc
