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

#include <algorithm>
#include <unordered_map>
#include "base/memory/Memory.h"
#include "gfx-base/GFXDef.h"

namespace cc {
namespace framegraph {

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
class ResourceAllocator final {
public:
    using DeviceResourceCreator = DeviceResourceCreatorType;

    ResourceAllocator(const ResourceAllocator &)     = delete;
    ResourceAllocator(ResourceAllocator &&) noexcept = delete;
    ResourceAllocator &operator=(const ResourceAllocator &) = delete;
    ResourceAllocator &operator=(ResourceAllocator &&) noexcept = delete;

    static ResourceAllocator &getInstance() noexcept;
    DeviceResourceType *      alloc(const DescriptorType &desc) noexcept;
    void                      free(const DescriptorType &desc, DeviceResourceType *resource) noexcept;
    inline void               tick() noexcept;
    void                      gc(uint32_t unusedFrameCount) noexcept;

private:
    using DeviceResourcePtr = DeviceResourceType *;
    struct DeviceResourcePtrGC {
        DeviceResourcePtr resource{nullptr};
        uint64_t          age{0ULL};

        DeviceResourcePtrGC(DeviceResourcePtr resource, uint64_t age) : resource(resource), age(age) {}
    };
    using DeviceResourcePool   = std::vector<DeviceResourcePtr>;
    using DeviceResourcePoolGC = std::vector<DeviceResourcePtrGC>;

    ResourceAllocator() noexcept = default;
    ~ResourceAllocator()         = default;

    std::unordered_map<DescriptorType, DeviceResourcePool, gfx::Hasher<DescriptorType>>   _livepool{};
    std::unordered_map<DescriptorType, DeviceResourcePoolGC, gfx::Hasher<DescriptorType>> _deadpool{};
    uint64_t                                                                              _age{0};
};

//////////////////////////////////////////////////////////////////////////

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType> &
ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::getInstance() noexcept {
    static ResourceAllocator instance;
    return instance;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
DeviceResourceType *ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::alloc(const DescriptorType &desc) noexcept {
    auto &deadpool{_deadpool[desc]};

    DeviceResourcePtr resource{nullptr};

    if (deadpool.empty()) {
        DeviceResourceCreator creator;
        resource = creator(desc);
    } else {
        resource = deadpool.back().resource;
        deadpool.pop_back();
    }

    auto &livepool{_livepool[desc]};
    livepool.emplace_back(resource);
    return resource;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::free(const DescriptorType &desc, DeviceResourceType *const resource) noexcept {
    auto &livepool{_livepool[desc]};
    CC_ASSERT(!livepool.empty());

    auto it = std::find_if(livepool.begin(), livepool.end(), [&resource](DeviceResourcePtr x) {
        return resource == x;
    });
    CC_ASSERT(it != livepool.end());
    livepool.erase(it);

    DeviceResourcePoolGC &deadpool{_deadpool[desc]};
    deadpool.emplace_back(resource, _age);
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::tick() noexcept {
    ++_age;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::gc(uint32_t const unusedFrameCount) noexcept {
    for (auto &pair : _deadpool) {
        DeviceResourcePoolGC &deadpool = pair.second;

        auto count = static_cast<int>(deadpool.size());

        if (!count) {
            return;
        }

        int destroyBegin = count - 1;

        for (int i = 0; i < count; ++i) {
            if (_age - deadpool[i].age < unusedFrameCount) {
                continue;
            }

            int j = destroyBegin;

            for (; j > i; --j) {
                if (_age - deadpool[j].age < unusedFrameCount) {
                    std::swap(deadpool[i], deadpool[j]);
                    destroyBegin = j - 1;
                    break;
                }
            }

            if (i >= j) {
                destroyBegin = i - 1;
            }

            if (i >= destroyBegin) {
                break;
            }
        }

        while (++destroyBegin < count) {
            CC_SAFE_DESTROY(deadpool.back().resource);
            deadpool.pop_back();
        }
    }
}

} // namespace framegraph
} // namespace cc
