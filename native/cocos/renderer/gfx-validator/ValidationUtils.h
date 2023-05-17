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

#pragma once

#include <algorithm>
#include "base/Utils.h"
#include "base/std/container/array.h"
#include "gfx-base/GFXDef.h"

namespace cc {

namespace utils {

ccstd::string getStacktraceJS();

} // namespace utils

namespace gfx {

struct RenderPassSnapshot {
    RenderPass *renderPass = nullptr;
    Framebuffer *framebuffer = nullptr;
    Rect renderArea;
    ccstd::vector<Color> clearColors;
    float clearDepth = 1.F;
    uint32_t clearStencil = 0U;
};

struct DrawcallSnapshot {
    PipelineState *pipelineState;
    InputAssembler *inputAssembler;
    ccstd::vector<DescriptorSet *> descriptorSets;
    ccstd::vector<ccstd::vector<uint32_t>> dynamicOffsets;
};

struct CommandBufferStorage : public DynamicStates, RenderPassSnapshot, DrawcallSnapshot {};

class CommandRecorder {
public:
    void recordBeginRenderPass(const RenderPassSnapshot &renderPass);
    void recordDrawcall(const DrawcallSnapshot &drawcall);
    void recordEndRenderPass();
    void clear();

    static ccstd::vector<uint32_t> serialize(const CommandRecorder &recorder);
    static CommandRecorder deserialize(const ccstd::vector<uint32_t> &bytes);
    static bool compare(const CommandRecorder &test, const CommandRecorder &baseline);

private:
    enum class CommandType {
        BEGIN_RENDER_PASS,
        END_RENDER_PASS,
        DRAW
    };

    struct RenderPassCommand {
        ColorAttachmentList colorAttachments;
        DepthStencilAttachment depthStencilAttachment;

        Rect renderArea;
        ccstd::vector<Color> clearColors;
        float clearDepth = 1.F;
        uint32_t clearStencil = 0U;
    };

    struct DrawcallCommand {
        InputState inputState;
        RasterizerState rasterizerState;
        DepthStencilState depthStencilState;
        BlendState blendState;
        PrimitiveMode primitive = PrimitiveMode::TRIANGLE_LIST;
        DynamicStateFlags dynamicStates = DynamicStateFlagBit::NONE;
        PipelineBindPoint bindPoint = PipelineBindPoint::GRAPHICS;

        DrawInfo drawInfo;

        ccstd::vector<DescriptorSet *> descriptorSets;
        ccstd::vector<uint32_t> dynamicOffsets;
    };

    ccstd::vector<CommandType> _commands;
    ccstd::vector<RenderPassCommand> _renderPassCommands;
    ccstd::vector<DrawcallCommand> _drawcallCommands;

    struct BufferData {
        BufferInfo info;
        ccstd::vector<uint8_t> data;
    };
    ccstd::unordered_map<uint32_t, BufferData> _bufferMap;
};

//////////////////////////////////////////////////////////////////////////

template <typename T>
struct RecordStacktrace : std::false_type {};

template <typename Resource, typename Enable = std::enable_if_t<std::is_base_of<GFXObject, Resource>::value>>
class DeviceResourceTracker {
public:
    template <typename T, typename = std::enable_if_t<std::is_same<Resource, T>::value>>
    static std::enable_if_t<RecordStacktrace<T>::value, void> push(T *resource);

    template <typename T, typename = std::enable_if_t<std::is_same<Resource, T>::value>>
    static std::enable_if_t<!RecordStacktrace<T>::value, void> push(T *resource);

    static void erase(Resource *resource);
    static void checkEmpty();

private:
    struct ResourceRecord {
        Resource *resource = nullptr;
        ccstd::string initStack;
    };

    static ccstd::vector<ResourceRecord> resources;
};

template <typename Resource, typename Enable>
ccstd::vector<typename DeviceResourceTracker<Resource, Enable>::ResourceRecord> DeviceResourceTracker<Resource, Enable>::resources;

template <typename Resource, typename Enable>
template <typename T, typename EnableFn>
std::enable_if_t<RecordStacktrace<T>::value, void>
DeviceResourceTracker<Resource, Enable>::push(T *resource) {
    resources.emplace_back(ResourceRecord{resource, utils::getStacktrace(6, 10)});
}

template <typename Resource, typename Enable>
template <typename T, typename EnableFn>
std::enable_if_t<!RecordStacktrace<T>::value, void>
DeviceResourceTracker<Resource, Enable>::push(T *resource) {
    resources.emplace_back(ResourceRecord{resource, {}});
}

template <typename Resource, typename Enable>
void DeviceResourceTracker<Resource, Enable>::erase(Resource *resource) {
    CC_ASSERT(!resources.empty());

    resources.erase(std::remove_if(resources.begin(), resources.end(),
                                   [resource](const auto &record) { return record.resource == resource; }));
}

template <typename Resource, typename Enable>
void DeviceResourceTracker<Resource, Enable>::checkEmpty() {
    // If this assertion is hit, it means you have leaked gfx resources.
    // You can debug this by uncomment the `record_stacktrace` template specialization for the relevant type
    // and look up the resource initialization stacktrace in `resources[i].initStack`.
    // Note: capturing stacktrace is a painfully time-consuming process,
    // so better to uncomment the exact type of resource that is leaking rather than toggle them all at once.
    CC_ASSERT(resources.empty()); // Resource leaked.
}

//template <> struct RecordStacktrace<CommandBuffer> : std::true_type {};
//template <> struct RecordStacktrace<Queue> : std::true_type {};
//template <> struct RecordStacktrace<Buffer> : std::true_type {};
//template <> struct RecordStacktrace<Texture> : std::true_type {};
//template <> struct RecordStacktrace<Sampler> : std::true_type {};
//template <> struct RecordStacktrace<Shader> : std::true_type {};
//template <> struct RecordStacktrace<InputAssembler> : std::true_type {};
//template <> struct RecordStacktrace<RenderPass> : std::true_type {};
//template <> struct RecordStacktrace<Framebuffer> : std::true_type {};
//template <> struct RecordStacktrace<DescriptorSet> : std::true_type {};
//template <> struct RecordStacktrace<DescriptorSetLayout> : std::true_type {};
//template <> struct RecordStacktrace<PipelineLayout> : std::true_type {};
//template <> struct RecordStacktrace<PipelineState> : std::true_type {};

} // namespace gfx
} // namespace cc
