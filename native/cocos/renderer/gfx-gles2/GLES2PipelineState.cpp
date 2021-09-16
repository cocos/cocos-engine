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

#include "GLES2Std.h"

#include "GLES2Commands.h"
#include "GLES2PipelineLayout.h"
#include "GLES2PipelineState.h"
#include "GLES2RenderPass.h"
#include "GLES2Shader.h"

namespace cc {
namespace gfx {

const GLenum GLE_S2_PRIMITIVES[] = {
    GL_POINTS,
    GL_LINES,
    GL_LINE_STRIP,
    GL_LINE_LOOP,
    GL_NONE,
    GL_NONE,
    GL_NONE,
    GL_TRIANGLES,
    GL_TRIANGLE_STRIP,
    GL_TRIANGLE_FAN,
    GL_NONE,
    GL_NONE,
    GL_NONE,
    GL_NONE,
};

GLES2PipelineState::GLES2PipelineState() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES2PipelineState::~GLES2PipelineState() {
    destroy();
}

void GLES2PipelineState::doInit(const PipelineStateInfo & /*info*/) {
    _gpuPipelineState                    = CC_NEW(GLES2GPUPipelineState);
    _gpuPipelineState->glPrimitive       = GLE_S2_PRIMITIVES[static_cast<int>(_primitive)];
    _gpuPipelineState->gpuShader         = static_cast<GLES2Shader *>(_shader)->gpuShader();
    _gpuPipelineState->rs                = _rasterizerState;
    _gpuPipelineState->dss               = _depthStencilState;
    _gpuPipelineState->bs                = _blendState;
    _gpuPipelineState->gpuPipelineLayout = static_cast<GLES2PipelineLayout *>(_pipelineLayout)->gpuPipelineLayout();
    if (_renderPass) _gpuPipelineState->gpuRenderPass = static_cast<GLES2RenderPass *>(_renderPass)->gpuRenderPass();

    for (uint32_t i = 0; i < 31; i++) {
        if (static_cast<uint32_t>(_dynamicStates) & (1 << i)) {
            _gpuPipelineState->dynamicStates.push_back(static_cast<DynamicStateFlagBit>(1 << i));
        }
    }
}

void GLES2PipelineState::doDestroy() {
    if (_gpuPipelineState) {
        CC_DELETE(_gpuPipelineState);
        _gpuPipelineState = nullptr;
    }
}

} // namespace gfx
} // namespace cc
