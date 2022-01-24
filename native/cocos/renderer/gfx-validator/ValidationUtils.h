/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <array>
#include <algorithm>
#include "base/Utils.h"
#include "gfx-base/GFXDef.h"

namespace cc {

namespace utils {

String getStacktraceJS();

} // namespace utils

namespace gfx {

struct RenderPassSnapshot {
    RenderPass *  renderPass  = nullptr;
    Framebuffer * framebuffer = nullptr;
    Rect          renderArea;
    vector<Color> clearColors;
    float         clearDepth   = 1.F;
    uint32_t      clearStencil = 0U;
};

struct DrawcallSnapshot {
    PipelineState *          pipelineState;
    InputAssembler *         inputAssembler;
    vector<DescriptorSet *>  descriptorSets;
    vector<vector<uint32_t>> dynamicOffsets;
};

struct CommandBufferStorage : public DynamicStates, RenderPassSnapshot, DrawcallSnapshot {};

class CommandRecorder {
public:
    void recordBeginRenderPass(const RenderPassSnapshot &renderPass);
    void recordDrawcall(const DrawcallSnapshot &drawcall);
    void recordEndRenderPass();
    void clear();

    static vector<uint32_t> serialize(const CommandRecorder &recorder);
    static CommandRecorder  deserialize(const vector<uint32_t> &bytes);
    static bool             compare(const CommandRecorder &test, const CommandRecorder &baseline);

private:
    enum class CommandType {
        BEGIN_RENDER_PASS,
        END_RENDER_PASS,
        DRAW
    };

    struct RenderPassCommand {
        ColorAttachmentList    colorAttachments;
        DepthStencilAttachment depthStencilAttachment;

        Rect          renderArea;
        vector<Color> clearColors;
        float         clearDepth   = 1.F;
        uint32_t      clearStencil = 0U;
    };

    struct DrawcallCommand {
        InputState        inputState;
        RasterizerState   rasterizerState;
        DepthStencilState depthStencilState;
        BlendState        blendState;
        PrimitiveMode     primitive     = PrimitiveMode::TRIANGLE_LIST;
        DynamicStateFlags dynamicStates = DynamicStateFlagBit::NONE;
        PipelineBindPoint bindPoint     = PipelineBindPoint::GRAPHICS;

        DrawInfo drawInfo;

        vector<DescriptorSet *> descriptorSets;
        vector<uint32_t>        dynamicOffsets;
    };

    vector<CommandType>       _commands;
    vector<RenderPassCommand> _renderPassCommands;
    vector<DrawcallCommand>   _drawcallCommands;

    struct BufferData {
        BufferInfo      info;
        vector<uint8_t> data;
    };
    unordered_map<uint32_t, BufferData> _bufferMap;
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
        String    initStack;
    };

    static vector<ResourceRecord> resources;
};

template <typename Resource, typename Enable>
vector<typename DeviceResourceTracker<Resource, Enable>::ResourceRecord> DeviceResourceTracker<Resource, Enable>::resources;

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
    CCASSERT(!resources.empty(), "Deleted twice?");

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
    CCASSERT(resources.empty(), "Resource leaked");
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
