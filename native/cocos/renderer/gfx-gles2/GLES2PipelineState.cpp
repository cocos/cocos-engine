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
    _gpuPipelineState = ccnew GLES2GPUPipelineState;
    _gpuPipelineState->glPrimitive = GLE_S2_PRIMITIVES[static_cast<int>(_primitive)];
    _gpuPipelineState->gpuShader = static_cast<GLES2Shader *>(_shader)->gpuShader();
    _gpuPipelineState->rs = _rasterizerState;
    _gpuPipelineState->dss = _depthStencilState;
    _gpuPipelineState->bs = _blendState;
    _gpuPipelineState->gpuPipelineLayout = static_cast<GLES2PipelineLayout *>(_pipelineLayout)->gpuPipelineLayout();
    if (_renderPass) _gpuPipelineState->gpuRenderPass = static_cast<GLES2RenderPass *>(_renderPass)->gpuRenderPass();

    for (uint32_t i = 0; i < 31; i++) {
        if (static_cast<uint32_t>(_dynamicStates) & (1 << i)) {
            _gpuPipelineState->dynamicStates.push_back(static_cast<DynamicStateFlagBit>(1 << i));
        }
    }
}

void GLES2PipelineState::doDestroy() {
    CC_SAFE_DELETE(_gpuPipelineState);
}

} // namespace gfx
} // namespace cc
