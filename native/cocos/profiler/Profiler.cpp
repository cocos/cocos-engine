/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.
 
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

#include "Profiler.h"
#if CC_USE_DEBUG_RENDERER
    #include "DebugRenderer.h"
#endif
#include "application/ApplicationManager.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "base/memory/MemoryHook.h"
#include "core/Root.h"
#include "core/assets/Font.h"
#include "gfx-base/GFXDevice.h"
#include "platform/FileUtils.h"
#include "platform/interfaces/modules/Device.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"
#include "renderer/GFXDeviceManager.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "scene/Shadow.h"

namespace cc {

/**
 * ProfilerBlock
 */
class ProfilerBlock {
public:
    ProfilerBlock(ProfilerBlock *parent, const std::string_view &name)
    : _parent(parent), _name(name) {}
    ~ProfilerBlock();

    inline void begin() { _timer.reset(); }
    inline void end() { _item += _timer.getMicroseconds(); }
    ProfilerBlock *getOrCreateChild(const std::string_view &name);
    void onFrameBegin();
    void onFrameEnd();
    void doIntervalUpdate();

private:
    ProfilerBlock *_parent{nullptr};
    std::vector<ProfilerBlock *> _children;
    utils::Timer _timer;
    ccstd::string _name;
    TimeCounter _item;

    friend class Profiler;
};

ProfilerBlock::~ProfilerBlock() {
    for (auto *child : _children) {
        CC_SAFE_DELETE(child);
    }
    _children.clear();
}

ProfilerBlock *ProfilerBlock::getOrCreateChild(const std::string_view &name) {
    for (auto *child : _children) {
        if (child->_name == name) {
            return child;
        }
    }

    auto *child = ccnew ProfilerBlock(this, name);
    _children.push_back(child);

    return child;
}

void ProfilerBlock::onFrameBegin() { //NOLINT(misc-no-recursion)
    _item.onFrameBegin();

    for (auto *child : _children) {
        child->onFrameBegin();
    }
}

void ProfilerBlock::onFrameEnd() { //NOLINT(misc-no-recursion)
    for (auto *child : _children) {
        child->onFrameEnd();
    }

    _item.onFrameEnd();
}

void ProfilerBlock::doIntervalUpdate() { //NOLINT(misc-no-recursion)
    _item.onIntervalUpdate();

    for (auto *child : _children) {
        child->doIntervalUpdate();
    }
}

struct ProfilerBlockDepth {
    ProfilerBlock *block{nullptr};
    uint32_t depth{0U};
};

/**
 * Profiler
 */
Profiler *Profiler::instance = nullptr;
Profiler *Profiler::getInstance() {
    return instance;
}

Profiler::Profiler() {
    _mainThreadId = std::this_thread::get_id();
    _root = ccnew ProfilerBlock(nullptr, "MainThread");
    _current = _root;

    Profiler::instance = this;
}

Profiler::~Profiler() {
    CC_SAFE_DELETE(_root);
    _current = nullptr;
    Profiler::instance = nullptr;
}

void Profiler::setEnable(ShowOption option, bool b) {
    auto flag = static_cast<uint32_t>(option);
    if (b) {
        _options |= flag;
    } else {
        _options &= ~flag;
    }
}

bool Profiler::isEnabled(ShowOption option) const {
    auto flag = static_cast<uint32_t>(option);
    return (_options & flag) == flag;
}

void Profiler::beginFrame() {
    _objectStats.onFrameBegin();

    _current = _root;
    _root->onFrameBegin();
    _root->begin();
}

void Profiler::endFrame() {
    CC_ASSERT_EQ(_current, _root); // Call stack data is not matched.

    _root->end();
    _root->onFrameEnd();

    _objectStats.onFrameEnd();
}

void Profiler::update() {
    CC_PROFILE(ProfilerUpdate);

    // update interval every 0.5 seconds.
    const auto intervalUpdate = _timer.getSeconds() >= 0.5F;
    if (intervalUpdate) {
        _timer.reset();

        doIntervalUpdate();
        _root->doIntervalUpdate();
    }

    doFrameUpdate();

    printStats();
}

void Profiler::doIntervalUpdate() {
    const auto *pipeline = Root::getInstance()->getPipeline();
    const auto *root = Root::getInstance();
    const auto *sceneData = pipeline->getPipelineSceneData();
    const auto *shadows = sceneData->getShadows();
    const auto *window = CC_GET_MAIN_SYSTEM_WINDOW();
    const auto viewSize = window->getViewSize() * Device::getDevicePixelRatio();

    _coreStats.fps = root->getFps();
    _coreStats.frameTime = root->getFrameTime() * 1000.0F;
    _coreStats.gfx = gfx::DeviceManager::getGFXName();
    _coreStats.multiThread = gfx::DeviceManager::isDetachDeviceThread();
    _coreStats.occlusionQuery = pipeline->isOcclusionQueryEnabled();
    _coreStats.shadowMap = shadows != nullptr && shadows->isEnabled() && shadows->getType() == scene::ShadowType::SHADOW_MAP;
    _coreStats.screenWidth = static_cast<uint32_t>(viewSize.width);
    _coreStats.screenHeight = static_cast<uint32_t>(viewSize.height);
}

void Profiler::doFrameUpdate() {
    auto *device = gfx::Device::getInstance();

    CC_PROFILE_RENDER_UPDATE(DrawCalls, device->getNumDrawCalls());
    CC_PROFILE_RENDER_UPDATE(Instances, device->getNumInstances());
    CC_PROFILE_RENDER_UPDATE(Triangles, device->getNumTris());

#if USE_MEMORY_LEAK_DETECTOR
    CC_PROFILE_MEMORY_UPDATE(HeapMemory, GMemoryHook.getTotalSize());
#endif
}

void Profiler::printStats() {
#if CC_USE_DEBUG_RENDERER
    auto *renderer = CC_DEBUG_RENDERER;
    const auto *window = CC_GET_MAIN_SYSTEM_WINDOW();
    const auto viewSize = window->getViewSize() * Device::getDevicePixelRatio();
    const auto width = viewSize.width;
    const auto lineHeight = renderer->getLineHeight();
    const auto columnWidth = width / 12.0F; // divide column numbers
    const auto leftOffset = width * 0.01F;
    float lines = 1.0F;
    float leftLines = 1.0F;
    float rightLines = 1.0F;

    const DebugTextInfo coreInfo = {{1.0F, 0.0F, 0.0F, 1.0F}, true, false, true, 1U, {0.0F, 0.0F, 0.0F, 1.0F}, 1.0F};
    const DebugTextInfo titleInfo = {{1.0F, 1.0F, 0.0F, 1.0F}, true, false, true, 1U, {0.0F, 0.0F, 0.0F, 1.0F}, 1.0F};
    const DebugTextInfo textInfos[2] = {
        {{1.0F, 1.0F, 1.0F, 1.0F}, false, false, true, 1U, {0.0F, 0.0F, 0.0F, 1.0F}, 1.0F},
        {{0.8F, 0.8F, 0.8F, 1.0F}, false, false, true, 1U, {0.0F, 0.0F, 0.0F, 1.0F}, 1.0F},
    };

    if (isEnabled(ShowOption::CORE_STATS)) {
        float coreOffset = columnWidth * 2.0F;
        auto coreStats = StringUtil::format(
            "FPS: %u    "
            "Frame: %.1fms    "
            "GFX: %s    "
            "MultiThread: %s    "
            "Occlusion: %s    "
            "ShadowMap: %s    "
            "ScreenSize: [%u * %u]    ",
            _coreStats.fps,
            _coreStats.frameTime,
            _coreStats.gfx.c_str(),
            _coreStats.multiThread ? "On" : "Off",
            _coreStats.occlusionQuery ? "On" : "Off",
            _coreStats.shadowMap ? "On" : "Off",
            _coreStats.screenWidth,
            _coreStats.screenHeight);

        renderer->addText(StringUtil::format("CoreStats"), {leftOffset, lineHeight * lines}, coreInfo);
        renderer->addText(coreStats, {coreOffset, lineHeight * lines}, coreInfo);
        lines++;

        lines += 0.5F;
    }

    if (isEnabled(ShowOption::OBJECT_STATS)) {
        leftLines = lines;
        float yOffset = lineHeight * leftLines;
        float countOffset = columnWidth * 2;
        float totalMaxOffset = columnWidth * 3;

        renderer->addText("ObjectStats", {leftOffset, yOffset}, titleInfo);
        renderer->addText("Count", {countOffset, yOffset}, titleInfo);
        renderer->addText("TotalMax", {totalMaxOffset, yOffset}, titleInfo);
        leftLines++;

        for (auto &iter : _objectStats.renders) {
            auto &item = iter.second;
            yOffset = lineHeight * leftLines;

            renderer->addText(iter.first, {leftOffset, yOffset}, textInfos[0]);
            renderer->addText(StringUtil::format("%u", item.lastTotal), {countOffset, yOffset}, textInfos[0]);
            renderer->addText(StringUtil::format("%u", item.totalMax), {totalMaxOffset, yOffset}, textInfos[0]);
            leftLines++;
        }

        for (auto &iter : _objectStats.objects) {
            auto &item = iter.second;
            yOffset = lineHeight * leftLines;

            renderer->addText(iter.first, {leftOffset, yOffset}, textInfos[0]);
            renderer->addText(StringUtil::format("%u", item.lastTotal), {countOffset, yOffset}, textInfos[0]);
            renderer->addText(StringUtil::format("%u", item.totalMax), {totalMaxOffset, yOffset}, textInfos[0]);
            leftLines++;
        }

        leftLines += 0.5F;
    }

    if (isEnabled(ShowOption::MEMORY_STATS)) {
        rightLines = lines;
        float yOffset = lineHeight * rightLines;
        float memoryOffset = width * 0.5F;
        float totalOffset = memoryOffset + columnWidth * 2;
        float countOffset = memoryOffset + columnWidth * 3;
        float totalMaxOffset = memoryOffset + columnWidth * 4;

        renderer->addText("MemoryStats", {memoryOffset, yOffset}, titleInfo);
        renderer->addText("Total", {totalOffset, yOffset}, titleInfo);
        renderer->addText("Count", {countOffset, yOffset}, titleInfo);
        renderer->addText("TotalMax", {totalMaxOffset, yOffset}, titleInfo);
        rightLines++;

        ccstd::unordered_map<ccstd::string, MemoryCounter> memories;
        {
            std::lock_guard<std::mutex> lock(_memoryStats.mutex);
            memories = _memoryStats.memories;
        }

        for (auto &iter : memories) {
            auto &item = iter.second;
            yOffset = lineHeight * rightLines;

            renderer->addText(iter.first, {memoryOffset, yOffset}, textInfos[0]);
            renderer->addText(StatsUtil::formatBytes(item.total), {totalOffset, yOffset}, textInfos[0]);
            renderer->addText(StringUtil::format("%u", item.count), {countOffset, yOffset}, textInfos[0]);
            renderer->addText(StatsUtil::formatBytes(item.totalMax), {totalMaxOffset, yOffset}, textInfos[0]);
            rightLines++;
        }

        rightLines += 0.5F;
    }

    if (isEnabled(ShowOption::PERFORMANCE_STATS)) {
        lines = std::max(leftLines, rightLines);
        float yOffset = lineHeight * lines;
        float frameTimeOffset = columnWidth * 4;
        float frameMaxOffset = columnWidth * 5;
        float frameCountOffset = columnWidth * 6;
        float frameAgerageOffset = columnWidth * 7;
        float totalTimeOffset = columnWidth * 8;
        float totalMaxOffset = columnWidth * 9;
        float totalCountOffset = columnWidth * 10;
        float totalAgerageOffset = columnWidth * 11;

        renderer->addText("PerformanceStats", {leftOffset, yOffset}, titleInfo);
        renderer->addText("FrameTime", {frameTimeOffset, yOffset}, titleInfo);
        renderer->addText("Max", {frameMaxOffset, yOffset}, titleInfo);
        renderer->addText("Count", {frameCountOffset, yOffset}, titleInfo);
        renderer->addText("Average", {frameAgerageOffset, yOffset}, titleInfo);
        renderer->addText("WholeTime", {totalTimeOffset, yOffset}, titleInfo);
        renderer->addText("Max", {totalMaxOffset, yOffset}, titleInfo);
        renderer->addText("Count", {totalCountOffset, yOffset}, titleInfo);
        renderer->addText("Average", {totalAgerageOffset, yOffset}, titleInfo);
        lines++;

        std::vector<ProfilerBlockDepth> blocks;
        for (auto *child : _root->_children) {
            gatherBlocks(child, 0U, blocks);
        }

        uint32_t colorIndex = 0;
        for (auto &iter : blocks) {
            yOffset = lineHeight * lines;
            const auto *block = iter.block;
            const auto &item = block->_item;

            uint64_t frameAverageDisplay = item.frameCountDisplay ? item.frameTimeDisplay / item.frameCountDisplay : 0U;
            uint64_t totalAverageDisplay = item.totalCountDisplay ? item.totalTimeDisplay / item.totalCountDisplay : 0U;

            renderer->addText(StatsUtil::formatName(iter.depth, block->_name), {leftOffset, yOffset}, textInfos[colorIndex]);
            renderer->addText(StatsUtil::formatTime(item.frameTimeDisplay), {frameTimeOffset, yOffset}, textInfos[colorIndex]);
            renderer->addText(StatsUtil::formatTime(item.frameMaxDisplay), {frameMaxOffset, yOffset}, textInfos[colorIndex]);
            renderer->addText(StringUtil::format("%u", item.frameCountDisplay), {frameCountOffset, yOffset}, textInfos[colorIndex]);
            renderer->addText(StatsUtil::formatTime(frameAverageDisplay), {frameAgerageOffset, yOffset}, textInfos[colorIndex]);
            renderer->addText(StatsUtil::formatTime(item.totalTimeDisplay), {totalTimeOffset, yOffset}, textInfos[colorIndex]);
            renderer->addText(StatsUtil::formatTime(item.totalMaxDisplay), {totalMaxOffset, yOffset}, textInfos[colorIndex]);
            renderer->addText(StringUtil::format("%u", item.totalCountDisplay), {totalCountOffset, yOffset}, textInfos[colorIndex]);
            renderer->addText(StatsUtil::formatTime(totalAverageDisplay), {totalAgerageOffset, yOffset}, textInfos[colorIndex]);
            colorIndex = (colorIndex + 1) & 0x01;
            lines++;
        }

        lines += 0.5F;
    }
#endif
}

void Profiler::beginBlock(const std::string_view &name) {
    if (isMainThread()) {
        _current = _current->getOrCreateChild(name);
        _current->begin();
    }
}

void Profiler::endBlock() {
    if (isMainThread()) {
        _current->end();
        _current = _current->_parent;
    }
}

void Profiler::gatherBlocks(ProfilerBlock *parent, uint32_t depth, std::vector<ProfilerBlockDepth> &outBlocks) { //NOLINT(misc-no-recursion)
    outBlocks.push_back({parent, depth});

    for (auto *child : parent->_children) {
        gatherBlocks(child, depth + 1U, outBlocks);
    }
}

} // namespace cc
