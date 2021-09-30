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

#include "VirtualResource.h"

namespace cc {
namespace framegraph {

template <typename ResourceType, typename Enable = std::enable_if_t<std::is_base_of<gfx::GFXObject, typename ResourceType::DeviceResource>::value>>
class ResourceEntry final : public VirtualResource {
public:
    explicit ResourceEntry(StringHandle name, ID id, const typename ResourceType::Descriptor &desc) noexcept;
    ResourceEntry(StringHandle name, ID id, const ResourceType &resource) noexcept;
    ResourceEntry()                          = delete;
    ~ResourceEntry() override                = default;
    ResourceEntry(const ResourceEntry &)     = delete;
    ResourceEntry(ResourceEntry &&) noexcept = delete;
    ResourceEntry &operator=(const ResourceEntry &) = delete;
    ResourceEntry &operator=(ResourceEntry &&) noexcept = delete;

    void                                   request() noexcept override;
    void                                   release() noexcept override;
    typename ResourceType::DeviceResource *getDeviceResource() const noexcept override;

    inline const ResourceType &get() const noexcept { return _resource; }

private:
    ResourceType _resource;
};

//////////////////////////////////////////////////////////////////////////

template <typename ResourceType, typename Enable>
ResourceEntry<ResourceType, Enable>::ResourceEntry(const StringHandle name, ID const id, const typename ResourceType::Descriptor &desc) noexcept
: VirtualResource(name, id, false),
  _resource(desc) {
}

template <typename ResourceType, typename Enable>
ResourceEntry<ResourceType, Enable>::ResourceEntry(const StringHandle name, ID const id, const ResourceType &resource) noexcept
: VirtualResource(name, id, true),
  _resource(resource) {
}

template <typename ResourceType, typename Enable>
void ResourceEntry<ResourceType, Enable>::request() noexcept {
    _resource.createTransient();
}

template <typename ResourceType, typename Enable>
void ResourceEntry<ResourceType, Enable>::release() noexcept {
    _resource.destroyTransient();
}

template <typename ResourceType, typename Enable>
typename ResourceType::DeviceResource *ResourceEntry<ResourceType, Enable>::getDeviceResource() const noexcept {
    return _resource.get();
}

} // namespace framegraph
} // namespace cc
