/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include <cstdint>
#include <string>
#include <vector>
#include "Blackboard.h"
#include "CallbackPass.h"
#include "DevicePass.h"
#include "PassNode.h"
#include "PassNodeBuilder.h"
#include "ResourceEntry.h"
#include "ResourceNode.h"

namespace cc {
namespace framegraph {

class FrameGraph final {
public:
    using ResourceHandleBlackboard = Blackboard<StringHandle, Handle::IndexType, Handle::UNINITIALIZED>;

    FrameGraph() = default;
    ~FrameGraph();
    FrameGraph(const FrameGraph &) = delete;
    FrameGraph(FrameGraph &&)      = delete;
    FrameGraph &operator=(const FrameGraph &) = delete;
    FrameGraph &operator=(FrameGraph &&) = delete;

    static StringHandle stringToHandle(const char *name);
    static const char * handleToString(const StringHandle &handle) noexcept;

    void        present(const TextureHandle &input, gfx::Texture *target);
    void        presentLastVersion(const VirtualResource *virtualResource, gfx::Texture *target);
    void        presentFromBlackboard(const StringHandle &inputName, gfx::Texture *target);
    void        compile();
    void        execute() noexcept;
    void        reset() noexcept;
    static void gc(uint32_t unusedFrameCount = 30) noexcept;

    template <typename Data, typename SetupMethod, typename ExecuteMethod>
    const CallbackPass<Data, ExecuteMethod> &addPass(PassInsertPoint insertPoint, const StringHandle &name, SetupMethod setup, ExecuteMethod &&execute) noexcept;

    template <typename ResourceType>
    TypedHandle<ResourceType> create(const StringHandle &name, const typename ResourceType::Descriptor &desc) noexcept;
    template <typename ResourceType>
    TypedHandle<ResourceType> importExternal(const StringHandle &name, ResourceType &resource) noexcept;
    void                      move(TextureHandle from, TextureHandle to, uint8_t mipmapLevel, uint8_t faceId, uint8_t arrayPosition) noexcept;

    inline ResourceNode &            getResourceNode(const Handle handle) noexcept { return _resourceNodes[handle]; }
    inline const ResourceNode &      getResourceNode(const Handle handle) const noexcept { return _resourceNodes[handle]; }
    inline ResourceHandleBlackboard &getBlackboard() noexcept { return _blackboard; }

    void        exportGraphViz(const std::string &path);
    inline void enableMerge(bool enable) noexcept;
    bool        hasPass(StringHandle handle);

private:
    Handle        create(VirtualResource *virtualResource);
    PassNode &    createPassNode(PassInsertPoint insertPoint, const StringHandle &name, Executable *pass);
    Handle        createResourceNode(VirtualResource *virtualResource);
    void          sort() noexcept;
    void          cull();
    void          computeResourceLifetime();
    void          mergePassNodes() noexcept;
    void          computeStoreActionAndMemoryless();
    void          generateDevicePasses();
    ResourceNode *getResourceNode(const VirtualResource *virtualResource, uint8_t version) noexcept;

    std::vector<std::unique_ptr<PassNode>>        _passNodes{};
    std::vector<ResourceNode>                     _resourceNodes{};
    std::vector<std::unique_ptr<VirtualResource>> _virtualResources{};
    std::vector<std::unique_ptr<DevicePass>>      _devicePasses{};
    ResourceHandleBlackboard                      _blackboard;
    bool                                          _merge{true};

    friend class PassNode;
    friend class PassNodeBuilder;
};

//////////////////////////////////////////////////////////////////////////

template <typename Data, typename SetupMethod, typename ExecuteMethod>
const CallbackPass<Data, ExecuteMethod> &FrameGraph::addPass(const PassInsertPoint insertPoint, const StringHandle &name, SetupMethod setup, ExecuteMethod &&execute) noexcept {
    static_assert(sizeof(ExecuteMethod) < 1024, "Execute() lambda is capturing too much data.");
    auto *const     pass     = new CallbackPass<Data, ExecuteMethod>(std::forward<ExecuteMethod>(execute));
    PassNode &      passNode = createPassNode(insertPoint, name, pass);
    PassNodeBuilder builder(*this, passNode);
    setup(builder, pass->getData());
    return *pass;
}

template <typename ResourceType>
TypedHandle<ResourceType> FrameGraph::create(const StringHandle &name, const typename ResourceType::Descriptor &desc) noexcept {
    auto *const virtualResource = new ResourceEntry<ResourceType>(name, static_cast<ID>(_virtualResources.size()), desc);
    return TypedHandle<ResourceType>(create(virtualResource));
}

template <typename ResourceType>
TypedHandle<ResourceType> FrameGraph::importExternal(const StringHandle &name, ResourceType &resource) noexcept {
    CC_ASSERT(resource.get());
    auto *const virtualResource = new ResourceEntry<ResourceType>(name, static_cast<ID>(_virtualResources.size()), resource);
    return TypedHandle<ResourceType>(create(virtualResource));
}

void FrameGraph::enableMerge(bool const enable) noexcept {
    _merge = enable;
}

//////////////////////////////////////////////////////////////////////////

template <typename ResourceType>
TypedHandle<ResourceType> PassNodeBuilder::create(const StringHandle &name, const typename ResourceType::Descriptor &desc) const noexcept {
    return _graph.create<ResourceType>(name, desc);
}

template <typename ResourceType>
TypedHandle<ResourceType> PassNodeBuilder::importExternal(const StringHandle &name, ResourceType &resource) const noexcept {
    return _graph.importExternal(name, resource);
}

} // namespace framegraph
} // namespace cc
