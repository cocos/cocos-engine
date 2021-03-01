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

#ifndef CC_CORE_GFX_PIPELINE_STATE_H_
#define CC_CORE_GFX_PIPELINE_STATE_H_

#include "GFXObject.h"

namespace cc {
namespace gfx {

class CC_DLL PipelineState : public GFXObject {
public:
    PipelineState(Device *device);
    virtual ~PipelineState();

public:
    virtual bool initialize(const PipelineStateInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE Shader *getShader() const { return _shader; }
    CC_INLINE PipelineBindPoint getBindPoint() const { return _bindPoint; }
    CC_INLINE PrimitiveMode getPrimitive() const { return _primitive; }
    CC_INLINE DynamicStateFlags getDynamicStates() const { return _dynamicStates; }
    CC_INLINE const InputState &getInputState() const { return _inputState; }
    CC_INLINE const RasterizerState &getRasterizerState() const { return _rasterizerState; }
    CC_INLINE const DepthStencilState &getDepthStencilState() const { return _depthStencilState; }
    CC_INLINE const BlendState &getBlendState() const { return _blendState; }
    CC_INLINE const RenderPass *getRenderPass() const { return _renderPass; }
    CC_INLINE const PipelineLayout *getPipelineLayout() const { return _pipelineLayout; }

protected:
    Device *_device = nullptr;
    Shader *_shader = nullptr;
    PipelineBindPoint _bindPoint = PipelineBindPoint::GRAPHICS;
    PrimitiveMode _primitive = PrimitiveMode::TRIANGLE_LIST;
    DynamicStateFlags _dynamicStates = DynamicStateFlags::NONE;
    InputState _inputState;
    RasterizerState _rasterizerState;
    DepthStencilState _depthStencilState;
    BlendState _blendState;
    RenderPass *_renderPass = nullptr;
    PipelineLayout *_pipelineLayout = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_PIPELINE_STATE_H_
