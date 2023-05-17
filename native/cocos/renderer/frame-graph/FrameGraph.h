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

#pragma once

#include <cstdint>
#include "Blackboard.h"
#include "CallbackPass.h"
#include "DevicePass.h"
#include "PassNode.h"
#include "PassNodeBuilder.h"
#include "ResourceEntry.h"
#include "ResourceNode.h"
#include "base/std/container/string.h"

namespace cc {
namespace framegraph {

class FrameGraph final {
public:
    using ResourceHandleBlackboard = Blackboard<StringHandle, Handle::IndexType, Handle::UNINITIALIZED>;

    FrameGraph() = default;
    ~FrameGraph() = default;
    FrameGraph(const FrameGraph &) = delete;
    FrameGraph(FrameGraph &&) noexcept = delete;
    FrameGraph &operator=(const FrameGraph &) = delete;
    FrameGraph &operator=(FrameGraph &&) noexcept = delete;

    static StringHandle stringToHandle(const char *name);
    static const char *handleToString(const StringHandle &handle) noexcept;

    void present(const TextureHandle &input, gfx::Texture *target, bool useMoveSemantic = true);
    void presentLastVersion(const VirtualResource *virtualResource, gfx::Texture *target, bool useMoveSemantic = true);
    void presentFromBlackboard(const StringHandle &inputName, gfx::Texture *target, bool useMoveSemantic = true);
    void compile();
    void execute() noexcept;
    void reset() noexcept;
    static void gc(uint32_t unusedFrameCount = 30) noexcept;

    template <typename Data, typename SetupMethod, typename ExecuteMethod>
    const CallbackPass<Data, ExecuteMethod> &addPass(PassInsertPoint insertPoint, const StringHandle &name, SetupMethod setup, ExecuteMethod &&execute) noexcept;

    template <typename DescriptorType, typename ResourceType = typename ResourceTypeLookupTable<DescriptorType>::Resource>
    TypedHandle<ResourceType> create(const StringHandle &name, const DescriptorType &desc) noexcept;
    template <typename ResourceType>
    TypedHandle<ResourceType> importExternal(const StringHandle &name, ResourceType &resource) noexcept;
    void move(TextureHandle from, TextureHandle to, uint8_t mipmapLevel, uint8_t faceId, uint8_t arrayPosition) noexcept;

    inline ResourceNode &getResourceNode(const Handle handle) noexcept { return _resourceNodes[handle]; }
    inline const ResourceNode &getResourceNode(const Handle handle) const noexcept { return _resourceNodes[handle]; }
    inline ResourceHandleBlackboard &getBlackboard() noexcept { return _blackboard; }

    void exportGraphViz(const ccstd::string &path);
    inline void enableMerge(bool enable) noexcept;
    bool hasPass(StringHandle handle);

private:
    Handle create(VirtualResource *virtualResource);
    PassNode &createPassNode(PassInsertPoint insertPoint, const StringHandle &name, Executable *pass);
    Handle createResourceNode(VirtualResource *virtualResource);
    void sort() noexcept;
    void cull();
    void computeResourceLifetime();
    void mergePassNodes() noexcept;
    void computeStoreActionAndMemoryless();
    void generateDevicePasses();
    ResourceNode *getResourceNode(const VirtualResource *virtualResource, uint8_t version) noexcept;

    ccstd::vector<std::unique_ptr<PassNode>> _passNodes{};
    ccstd::vector<ResourceNode> _resourceNodes{};
    ccstd::vector<std::unique_ptr<VirtualResource>> _virtualResources{};
    ccstd::vector<std::unique_ptr<DevicePass>> _devicePasses{};
    ResourceHandleBlackboard _blackboard;
    bool _merge{true};

    friend class PassNode;
    friend class PassNodeBuilder;
};

//////////////////////////////////////////////////////////////////////////

template <typename Data, typename SetupMethod, typename ExecuteMethod>
const CallbackPass<Data, ExecuteMethod> &FrameGraph::addPass(const PassInsertPoint insertPoint, const StringHandle &name, SetupMethod setup, ExecuteMethod &&execute) noexcept {
    static_assert(sizeof(ExecuteMethod) < 1024, "Execute() lambda is capturing too much data.");
    auto *const pass = ccnew CallbackPass<Data, ExecuteMethod>(std::forward<ExecuteMethod>(execute));
    PassNode &passNode = createPassNode(insertPoint, name, pass);
    PassNodeBuilder builder(*this, passNode);
    setup(builder, pass->getData());
    return *pass;
}

template <typename DescriptorType, typename ResourceType>
TypedHandle<ResourceType> FrameGraph::create(const StringHandle &name, const DescriptorType &desc) noexcept {
    auto *const virtualResource = ccnew ResourceEntry<ResourceType>(name, static_cast<ID>(_virtualResources.size()), desc);
    return TypedHandle<ResourceType>(create(virtualResource));
}

template <typename ResourceType>
TypedHandle<ResourceType> FrameGraph::importExternal(const StringHandle &name, ResourceType &resource) noexcept {
    CC_ASSERT(resource.get());
    auto *const virtualResource = ccnew ResourceEntry<ResourceType>(name, static_cast<ID>(_virtualResources.size()), resource);
    return TypedHandle<ResourceType>(create(virtualResource));
}

void FrameGraph::enableMerge(bool const enable) noexcept {
    _merge = enable;
}

//////////////////////////////////////////////////////////////////////////

template <typename DescriptorType, typename ResourceType>
TypedHandle<ResourceType> PassNodeBuilder::create(const StringHandle &name, const DescriptorType &desc) const noexcept {
    return _graph.create(name, desc);
}

template <typename ResourceType>
TypedHandle<ResourceType> PassNodeBuilder::importExternal(const StringHandle &name, ResourceType &resource) const noexcept {
    return _graph.importExternal(name, resource);
}

} // namespace framegraph
} // namespace cc
