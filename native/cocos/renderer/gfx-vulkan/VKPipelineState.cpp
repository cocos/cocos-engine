/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKPipelineLayout.h"
#include "VKPipelineState.h"
#include "VKRenderPass.h"
#include "VKShader.h"

namespace cc {
namespace gfx {

CCVKPipelineState::CCVKPipelineState(Device *device)
: PipelineState(device) {
}

CCVKPipelineState::~CCVKPipelineState() {
}

bool CCVKPipelineState::initialize(const PipelineStateInfo &info) {
    _primitive = info.primitive;
    _shader = info.shader;
    _inputState = info.inputState;
    _rasterizerState = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _blendState = info.blendState;
    _dynamicStates = info.dynamicStates;
    _renderPass = info.renderPass;
    _pipelineLayout = info.pipelineLayout;

    _gpuPipelineState = CC_NEW(CCVKGPUPipelineState);
    _gpuPipelineState->primitive = _primitive;
    _gpuPipelineState->gpuShader = ((CCVKShader *)_shader)->gpuShader();
    _gpuPipelineState->inputState = _inputState;
    _gpuPipelineState->rs = _rasterizerState;
    _gpuPipelineState->dss = _depthStencilState;
    _gpuPipelineState->bs = _blendState;
    _gpuPipelineState->gpuRenderPass = ((CCVKRenderPass *)_renderPass)->gpuRenderPass();
    _gpuPipelineState->gpuPipelineLayout = ((CCVKPipelineLayout *)_pipelineLayout)->gpuPipelineLayout();

    for (uint i = 0; i < 31; i++) {
        if ((uint)_dynamicStates & (1 << i)) {
            _gpuPipelineState->dynamicStates.push_back((DynamicStateFlagBit)(1 << i));
        }
    }

    CCVKCmdFuncCreatePipelineState((CCVKDevice *)_device, _gpuPipelineState);

    return true;
}

void CCVKPipelineState::destroy() {
    if (_gpuPipelineState) {
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuPipelineState);
        _gpuPipelineState = nullptr;
    }
}

} // namespace gfx
} // namespace cc
