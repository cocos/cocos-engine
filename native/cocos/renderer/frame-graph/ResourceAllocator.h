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
    void                      free(DeviceResourceType *resource) noexcept;
    inline void               tick() noexcept;
    void                      gc(uint32_t unusedFrameCount) noexcept;

private:
    using DeviceResourcePool = std::vector<DeviceResourceType *>;

    ResourceAllocator() noexcept = default;
    ~ResourceAllocator()         = default;

    std::unordered_map<DescriptorType, DeviceResourcePool, gfx::Hasher<DescriptorType>> _pool{};
    std::unordered_map<DeviceResourceType *, int64_t>                                   _ages{};
    uint64_t                                                                            _age{0};
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
    DeviceResourcePool &pool{_pool[desc]};

    DeviceResourceType *resource{nullptr};
    for (DeviceResourceType *res : pool) {
        if (_ages[res] >= 0) {
            resource = res;
            break;
        }
    }
    if (!resource) {
        DeviceResourceCreator creator;
        resource = creator(desc);
        pool.push_back(resource);
    }

    _ages[resource] = -1;
    return resource;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::free(DeviceResourceType *const resource) noexcept {
    CC_ASSERT(_ages.count(resource) && _ages[resource] < 0);
    _ages[resource] = _age;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::tick() noexcept {
    ++_age;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::gc(uint32_t const unusedFrameCount) noexcept {
    for (auto &pair : _pool) {
        DeviceResourcePool &pool = pair.second;

        auto count = static_cast<int>(pool.size());

        if (!count) {
            continue;
        }

        int destroyBegin = count - 1;

        for (int i = 0; i < count; ++i) {
            int64_t ageI = _ages[pool[i]];
            if (ageI < 0 || _age - ageI < unusedFrameCount) {
                continue;
            }

            int j = destroyBegin;

            for (; j > i; --j) {
                int64_t ageJ = _ages[pool[j]];
                if (ageJ < 0 || _age - ageJ < unusedFrameCount) {
                    std::swap(pool[i], pool[j]);
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
            auto *resource = pool.back();
            CC_DELETE(resource);
            _ages.erase(resource);
            pool.pop_back();
        }
    }
}

} // namespace framegraph
} // namespace cc
