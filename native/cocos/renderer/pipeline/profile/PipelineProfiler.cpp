/****************************************************************************
 Copyright (c) 2023-2023 Xiamen Yaji Software Co., Ltd.

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

#include "PipelineProfiler.h"
#include "base/StringUtil.h"
#include "math/MathUtil.h"
#include "application/ApplicationManager.h"
#include "platform/interfaces/modules/Device.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"

#include "gfx-base/GFXDevice.h"
#include "profiler/DebugRenderer.h"

#include "cocos/renderer/pipeline/custom/NativePipelineTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphGraphs.h"



namespace cc::render {

PipelineProfiler::PipelineProfiler() {
#if CC_USE_DEBUG_RENDERER
    auto debugInfo = DebugRendererInfo();
    debugInfo.fontSize = 15U;

    auto *device = gfx::Device::getInstance();
    const auto *window = CC_GET_MAIN_SYSTEM_WINDOW();
    const auto &ext = window->getViewSize();
    const auto width = ext.width * Device::getDevicePixelRatio();
    const auto height = ext.height * Device::getDevicePixelRatio();
    auto fontSize = static_cast<uint32_t>(width / 800.0F * static_cast<float>(debugInfo.fontSize));
    fontSize = fontSize < 10U ? 10U : (fontSize > 20U ? 20U : fontSize);

    _textRenderer = std::make_unique<TextRenderer>();
    _textRenderer->initialize(device, debugInfo, fontSize, "internal/builtin-debug-renderer");
    _textRenderer->updateWindowSize(static_cast<uint32_t>(width), static_cast<uint32_t>(height), 0, device->getCombineSignY());
#endif
}

void PipelineProfiler::beginFrame(uint32_t passCount, gfx::CommandBuffer *cmdBuffer) {
    _timeQuery.resize(passCount * 2);
    _timeQuery.reset(cmdBuffer);
    _passTimes.clear();
    _passStats.clear();

    _statsQuery.resize(passCount);
    _statsQuery.reset(cmdBuffer);
}

void PipelineProfiler::endFrame(gfx::CommandBuffer *cmdBuffer) {
    _timeQuery.copyResult(cmdBuffer);
    _statsQuery.copyResult(cmdBuffer);

    currentPassId = CC_INVALID_INDEX;
}

void PipelineProfiler::beginScope(gfx::CommandBuffer *cmdBuffer, uint32_t passID) {
    if (currentPassId == CC_INVALID_INDEX) {
        _statsQuery.begin(cmdBuffer, passID);
        currentPassId = passID;
    }
    _timeQuery.writeTimestampWithKey(cmdBuffer, passID);
}

void PipelineProfiler::endScope(gfx::CommandBuffer *cmdBuffer, uint32_t passID) {
    _timeQuery.writeTimestampWithKey(cmdBuffer, passID);

    if (currentPassId == passID) {
        _statsQuery.end(cmdBuffer, passID);
        currentPassId = CC_INVALID_INDEX;
    }
}

void PipelineProfiler::render(gfx::RenderPass *renderPass, uint32_t subPassId, gfx::CommandBuffer *cmdBuff) {
#if CC_USE_DEBUG_RENDERER
    _textRenderer->updateTextData();
    _textRenderer->render(renderPass, subPassId, cmdBuff);
#endif
}

void PipelineProfiler::resolveData(NativePipeline &pipeline) {
    const auto &timestampPeriod = pipeline.device->getCapabilities().timestampPeriod;
    std::vector<std::pair<RenderGraph::vertex_descriptor, uint64_t>> stack;
    _timeQuery.foreachData([&](const auto &key, uint64_t v) {
        auto passID = ccstd::get<RenderGraph::vertex_descriptor>(key);
        if (stack.empty() || stack.back().first != passID) {
            stack.emplace_back(passID, v);
        } else {
            _passTimes.emplace(passID, (v - stack.back().second) * timestampPeriod);
            stack.pop_back();
        }
    });

    _statsQuery.foreachData([&](const auto &key, const GPUPipelineStats &v) {
        _passStats[key] = v;
    });

#if CC_USE_DEBUG_RENDERER
    const uint32_t lineHeight = _textRenderer->getLineHeight();
    const DebugTextInfo coreInfo = {{1.0F, 0.0F, 0.0F, 1.0F}, true, false, false, 1U, {0.0F, 0.0F, 0.0F, 1.0F}, 1.0F};
    const DebugTextInfo passInfo = {{1.0F, 1.0F, 1.0F, 1.0F}, true, false, false, 1U, {0.0F, 0.0F, 0.0F, 1.0F}, 1.0F};

    float baseOffset = 5;
    uint32_t baseLine = 1;

    size_t columnOffset = 0;
    for (auto &[passID, time] : _passTimes) {
        auto name = get(RenderGraph::NameTag{}, pipeline.renderGraph, passID);
        columnOffset = std::max(columnOffset, name.length());
    }
    float stampOffset = baseOffset + static_cast<float>(columnOffset * 10);
    float statsOffset = baseOffset + stampOffset + 100.f;
    float statsWidth = 60;

    float yOffset = static_cast<float>(lineHeight * baseLine++);
    _textRenderer->addText(StringUtil::format("%s", "Name"), {baseOffset, yOffset}, coreInfo);
    _textRenderer->addText(StringUtil::format("%s", "Time(ns)"), {stampOffset, yOffset}, coreInfo);
    _textRenderer->addText(StringUtil::format("%s", "IAV"), {statsOffset + statsWidth * 0, yOffset}, coreInfo);
    _textRenderer->addText(StringUtil::format("%s", "IAP"), {statsOffset + statsWidth * 1, yOffset}, coreInfo);
    _textRenderer->addText(StringUtil::format("%s", "VSI"), {statsOffset + statsWidth * 2, yOffset}, coreInfo);
    _textRenderer->addText(StringUtil::format("%s", "CI"),  {statsOffset + statsWidth * 3, yOffset}, coreInfo);
    _textRenderer->addText(StringUtil::format("%s", "CP"),  {statsOffset + statsWidth * 4, yOffset}, coreInfo);
    _textRenderer->addText(StringUtil::format("%s", "FSI"), {statsOffset + statsWidth * 5, yOffset}, coreInfo);
    _textRenderer->addText(StringUtil::format("%s", "CSI"), {statsOffset + statsWidth * 6, yOffset}, coreInfo);

    for (auto &[passID, time] : _passTimes) {
        auto name = get(RenderGraph::NameTag{}, pipeline.renderGraph, passID);

        float levelOffset = 0;
        visitObject(
            passID, pipeline.renderGraph,
            [&](const RenderQueue &queue) {
                std::ignore = queue;
                levelOffset = 8;
            },
            [&](const auto&v) {
                std::ignore = v;
            });

        _textRenderer->addText(StringUtil::format("%s", name.c_str()), {baseOffset + levelOffset, static_cast<float>(lineHeight * baseLine)}, passInfo);

        yOffset = static_cast<float>(lineHeight * baseLine++);

        _textRenderer->addText(StringUtil::format("[%llu]", time), {stampOffset, yOffset}, passInfo);

        auto iter = _passStats.find(passID);
        if (iter != _passStats.end()) {
            const auto &stats = iter->second;
            _textRenderer->addText(StringUtil::format("%llu", stats.iaVertices), {statsOffset + statsWidth * 0, yOffset}, passInfo);
            _textRenderer->addText(StringUtil::format("%llu", stats.iaPrimitives), {statsOffset + statsWidth * 1, yOffset}, passInfo);
            _textRenderer->addText(StringUtil::format("%llu", stats.vsInvocations), {statsOffset + statsWidth * 2, yOffset}, passInfo);
            _textRenderer->addText(StringUtil::format("%llu", stats.clipInvocations), {statsOffset + statsWidth * 3, yOffset}, passInfo);
            _textRenderer->addText(StringUtil::format("%llu", stats.clipPrimitives), {statsOffset + statsWidth * 4, yOffset}, passInfo);
            _textRenderer->addText(StringUtil::format("%llu", stats.fsInvocations), {statsOffset + statsWidth * 5, yOffset}, passInfo);
            _textRenderer->addText(StringUtil::format("%llu", stats.csInvocations), {statsOffset + statsWidth * 6, yOffset}, passInfo);
        }
    }
#endif
}


} // namespace cc::render
