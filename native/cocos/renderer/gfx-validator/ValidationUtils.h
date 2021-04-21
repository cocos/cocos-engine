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

#pragma once

#include "base/CoreStd.h"
#include "base/Utils.h"

namespace cc {

namespace utils {
String getStacktraceJS();
} // namespace utils

namespace gfx {

class GFXObject;
class CommandBuffer;
class Queue;
class Buffer;
class Texture;
class Sampler;
class Shader;
class InputAssembler;
class RenderPass;
class Framebuffer;
class DescriptorSet;
class DescriptorSetLayout;
class PipelineLayout;
class PipelineState;

//////////////////////////////////////////////////////////////////////////

template <typename T>
struct record_stacktrace : std::false_type {};

template <typename Resource, typename Enable = std::enable_if_t<std::is_base_of<GFXObject, Resource>::value>>
class DeviceResourceTracker {
public:
    template <typename T, typename = std::enable_if_t<std::is_same<Resource, T>::value>>
    static std::enable_if_t<record_stacktrace<T>::value, void> push(T *resource);

    template <typename T, typename = std::enable_if_t<std::is_same<Resource, T>::value>>
    static std::enable_if_t<!record_stacktrace<T>::value, void> push(T *resource);

    static void erase(Resource *resource);
    static void checkEmpty();

private:
    struct ResourceRecord {
        Resource *resource = nullptr;
        String    initStack;
    };

    static vector<ResourceRecord> _resources;
};

template <typename Resource, typename Enable>
vector<typename DeviceResourceTracker<Resource, Enable>::ResourceRecord> DeviceResourceTracker<Resource, Enable>::_resources;

template <typename Resource, typename Enable>
template <typename T, typename EnableFn>
std::enable_if_t<record_stacktrace<T>::value, void>
DeviceResourceTracker<Resource, Enable>::push(T *resource) {
    _resources.emplace_back(ResourceRecord{resource, utils::getStacktrace(6, 10)});
}

template <typename Resource, typename Enable>
template <typename T, typename EnableFn>
std::enable_if_t<!record_stacktrace<T>::value, void>
DeviceResourceTracker<Resource, Enable>::push(T *resource) {
    _resources.emplace_back(ResourceRecord{resource, {}});
}

template <typename Resource, typename Enable>
void DeviceResourceTracker<Resource, Enable>::erase(Resource *resource) {
    CCASSERT(!_resources.empty(), "Deleted twice?");

    _resources.erase(std::remove_if(_resources.begin(), _resources.end(),
                                    [resource](const auto &record) { return record.resource == resource; }));
}

template <typename Resource, typename Enable>
void DeviceResourceTracker<Resource, Enable>::checkEmpty() {
    // If this assertion is hit, it means you have leaked gfx resources.
    // You can debug this by uncomment the `record_stacktrace` template specialization for the relevant type
    // and look up the resource initialization stacktrace in `_resources[i].initStack`.
    // Note: capturing stacktrace is a painfully time-consuming process,
    // so better to uncomment the exact type of resource that is leaking rather than toggle them all at once.
    CCASSERT(_resources.empty(), "Resource leaked");
}

//template <> struct record_stacktrace<CommandBuffer> : std::true_type {};
//template <> struct record_stacktrace<Queue> : std::true_type {};
//template <> struct record_stacktrace<Buffer> : std::true_type {};
//template <> struct record_stacktrace<Texture> : std::true_type {};
//template <> struct record_stacktrace<Sampler> : std::true_type {};
//template <> struct record_stacktrace<Shader> : std::true_type {};
//template <> struct record_stacktrace<InputAssembler> : std::true_type {};
//template <> struct record_stacktrace<RenderPass> : std::true_type {};
//template <> struct record_stacktrace<Framebuffer> : std::true_type {};
//template <> struct record_stacktrace<DescriptorSet> : std::true_type {};
//template <> struct record_stacktrace<DescriptorSetLayout> : std::true_type {};
//template <> struct record_stacktrace<PipelineLayout> : std::true_type {};
//template <> struct record_stacktrace<PipelineState> : std::true_type {};

} // namespace gfx
} // namespace cc
