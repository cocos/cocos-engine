/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "ValidationUtils.h"

#include "bindings/jswrapper/SeApi.h"
#include "gfx-base/GFXInputAssembler.h"
#include "gfx-base/GFXPipelineState.h"
#include "gfx-base/GFXRenderPass.h"

namespace cc {

namespace utils {

String getStacktraceJS() {
    return se::ScriptEngine::getInstance()->getCurrentStackTrace();
}

} // namespace utils

namespace gfx {

void CommandRecorder::recordBeginRenderPass(const RenderPassSnapshot &renderPass) {
    RenderPassCommand &command = _renderPassCommands.emplace_back();
    command.renderArea         = renderPass.renderArea;
    command.clearColors        = renderPass.clearColors;
    command.clearDepth         = renderPass.clearDepth;
    command.clearStencil       = renderPass.clearStencil;

    command.colorAttachments       = renderPass.renderPass->getColorAttachments();
    command.depthStencilAttachment = renderPass.renderPass->getDepthStencilAttachment();

    _commands.push_back(CommandType::BEGIN_RENDER_PASS);
}

void CommandRecorder::recordDrawcall(const DrawcallSnapshot &drawcall) {
    DrawcallCommand &command  = _drawcallCommands.emplace_back();
    command.inputState        = drawcall.pipelineState->getInputState();
    command.rasterizerState   = drawcall.pipelineState->getRasterizerState();
    command.depthStencilState = drawcall.pipelineState->getDepthStencilState();
    command.blendState        = drawcall.pipelineState->getBlendState();
    command.primitive         = drawcall.pipelineState->getPrimitive();
    command.dynamicStates     = drawcall.pipelineState->getDynamicStates();
    command.bindPoint         = drawcall.pipelineState->getBindPoint();
    command.drawInfo          = drawcall.inputAssembler->getDrawInfo();

    command.descriptorSets = drawcall.descriptorSets;
    for (const auto &offsets : drawcall.dynamicOffsets) command.dynamicOffsets.insert(command.dynamicOffsets.end(), offsets.begin(), offsets.end());

    _commands.push_back(CommandType::DRAW);
}

void CommandRecorder::recordEndRenderPass() {
    _commands.push_back(CommandType::END_RENDER_PASS);
}

void CommandRecorder::clear() {
    _commands.clear();
    _renderPassCommands.clear();
    _drawcallCommands.clear();
}

vector<uint32_t> CommandRecorder::serialize(const CommandRecorder &recorder) {
    vector<uint32_t> bytes;
    bytes.push_back(static_cast<uint32_t>(recorder._commands.size()));
    return bytes;
}

CommandRecorder CommandRecorder::deserialize(const vector<uint32_t> &bytes) {
    CommandRecorder recorder;
    recorder._commands.resize(bytes[0]);
    return recorder;
}

bool CommandRecorder::compare(const CommandRecorder &test, const CommandRecorder &baseline) {
    return test._commands.empty() && baseline._commands.empty();
}

} // namespace gfx
} // namespace cc
