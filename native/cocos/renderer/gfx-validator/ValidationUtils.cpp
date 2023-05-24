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

#include "ValidationUtils.h"

#include "DeviceValidator.h"
#ifndef CC_WGPU_WASM
    #include "bindings/jswrapper/SeApi.h"
#endif

#include "gfx-base/GFXInputAssembler.h"
#include "gfx-base/GFXPipelineState.h"
#include "gfx-base/GFXRenderPass.h"

namespace cc {

namespace utils {

ccstd::string getStacktraceJS() {
#ifndef CC_WGPU_WASM
    if (!gfx::DeviceValidator::allowStacktraceJS) return "";
    return se::ScriptEngine::getInstance()->getCurrentStackTrace();
#else
    return "";
#endif
}

} // namespace utils

namespace gfx {

void CommandRecorder::recordBeginRenderPass(const RenderPassSnapshot &renderPass) {
    _renderPassCommands.emplace_back();
    RenderPassCommand &command = _renderPassCommands.back();
    command.renderArea = renderPass.renderArea;
    command.clearColors = renderPass.clearColors;
    command.clearDepth = renderPass.clearDepth;
    command.clearStencil = renderPass.clearStencil;

    command.colorAttachments = renderPass.renderPass->getColorAttachments();
    command.depthStencilAttachment = renderPass.renderPass->getDepthStencilAttachment();

    _commands.push_back(CommandType::BEGIN_RENDER_PASS);
}

void CommandRecorder::recordDrawcall(const DrawcallSnapshot &drawcall) {
    _drawcallCommands.emplace_back();
    DrawcallCommand &command = _drawcallCommands.back();
    command.inputState = drawcall.pipelineState->getInputState();
    command.rasterizerState = drawcall.pipelineState->getRasterizerState();
    command.depthStencilState = drawcall.pipelineState->getDepthStencilState();
    command.blendState = drawcall.pipelineState->getBlendState();
    command.primitive = drawcall.pipelineState->getPrimitive();
    command.dynamicStates = drawcall.pipelineState->getDynamicStates();
    command.bindPoint = drawcall.pipelineState->getBindPoint();
    command.drawInfo = drawcall.inputAssembler->getDrawInfo();

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

ccstd::vector<uint32_t> CommandRecorder::serialize(const CommandRecorder &recorder) {
    ccstd::vector<uint32_t> bytes;
    bytes.push_back(static_cast<uint32_t>(recorder._commands.size()));
    return bytes;
}

CommandRecorder CommandRecorder::deserialize(const ccstd::vector<uint32_t> &bytes) {
    CommandRecorder recorder;
    recorder._commands.resize(bytes[0]);
    return recorder;
}

bool CommandRecorder::compare(const CommandRecorder &test, const CommandRecorder &baseline) {
    return test._commands.empty() && baseline._commands.empty();
}

} // namespace gfx
} // namespace cc
