/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"

#include "GFXObject.h"
#include "GFXPipelineState.h"

namespace cc {
namespace gfx {

PipelineState::PipelineState()
: GFXObject(ObjectType::PIPELINE_STATE) {
}

PipelineState::~PipelineState() = default;

void PipelineState::initialize(const PipelineStateInfo &info) {
    _primitive         = info.primitive;
    _shader            = info.shader;
    _inputState        = info.inputState;
    _rasterizerState   = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _bindPoint         = info.bindPoint;
    _blendState        = info.blendState;
    _dynamicStates     = info.dynamicStates;
    _renderPass        = info.renderPass;
    _subpass           = info.subpass;
    _pipelineLayout    = info.pipelineLayout;

    doInit(info);
}

void PipelineState::destroy() {
    doDestroy();

    _shader         = nullptr;
    _renderPass     = nullptr;
    _pipelineLayout = nullptr;
}

} // namespace gfx
} // namespace cc
