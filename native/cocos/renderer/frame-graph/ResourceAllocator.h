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

#include <algorithm>
#include "base/RefVector.h"
#include "base/memory/Memory.h"
#include "base/std/container/unordered_map.h"
#include "gfx-base/GFXDef.h"

namespace cc {
namespace framegraph {

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
class ResourceAllocator final {
public:
    using DeviceResourceCreator = DeviceResourceCreatorType;

    ResourceAllocator(const ResourceAllocator &) = delete;
    ResourceAllocator(ResourceAllocator &&) noexcept = delete;
    ResourceAllocator &operator=(const ResourceAllocator &) = delete;
    ResourceAllocator &operator=(ResourceAllocator &&) noexcept = delete;

    static ResourceAllocator &getInstance() noexcept;
    DeviceResourceType *alloc(const DescriptorType &desc) noexcept;
    void free(DeviceResourceType *resource) noexcept;
    inline void tick() noexcept;
    void gc(uint32_t unusedFrameCount) noexcept;

private:
    using DeviceResourcePool = RefVector<DeviceResourceType *>;

    ResourceAllocator() noexcept = default;
    ~ResourceAllocator() = default;

    ccstd::unordered_map<DescriptorType, DeviceResourcePool, gfx::Hasher<DescriptorType>> _pool{};
    ccstd::unordered_map<DeviceResourceType *, int64_t> _ages{};
    uint64_t _age{0};
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
        pool.pushBack(resource);
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
            int64_t ageI = _ages[pool.at(i)];
            if (ageI < 0 || _age - ageI < unusedFrameCount) {
                continue;
            }

            int j = destroyBegin;

            for (; j > i; --j) {
                int64_t ageJ = _ages[pool.at(j)];
                if (ageJ < 0 || _age - ageJ < unusedFrameCount) {
                    std::swap(pool.at(i), pool.at(j));
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
            _ages.erase(resource);
            pool.popBack();
        }
    }
}

template <typename DeviceResourceType, typename DeviceResourceCreatorType>
class ResourceAllocator<DeviceResourceType, gfx::FramebufferInfo, DeviceResourceCreatorType> final {
public:
    using DeviceResourceCreator = DeviceResourceCreatorType;

    ResourceAllocator(const ResourceAllocator &) = delete;
    ResourceAllocator(ResourceAllocator &&) noexcept = delete;
    ResourceAllocator &operator=(const ResourceAllocator &) = delete;
    ResourceAllocator &operator=(ResourceAllocator &&) noexcept = delete;

    static ResourceAllocator &getInstance() noexcept;
    DeviceResourceType *alloc(const gfx::FramebufferInfo &desc) noexcept;
    void free(DeviceResourceType *resource) noexcept;
    inline void tick() noexcept;
    void gc(uint32_t unusedFrameCount) noexcept;

private:
    using DeviceResourcePool = RefVector<DeviceResourceType *>;

    ResourceAllocator() noexcept = default;
    ~ResourceAllocator() = default;

    std::unordered_map<ccstd::hash_t, DeviceResourcePool> _pool{};
    std::unordered_map<DeviceResourceType *, int64_t> _ages{};
    uint64_t _age{0};
};

//////////////////////////////////////////////////////////////////////////

template <typename DeviceResourceType, typename DeviceResourceCreatorType>
ResourceAllocator<DeviceResourceType, gfx::FramebufferInfo, DeviceResourceCreatorType> &
ResourceAllocator<DeviceResourceType, gfx::FramebufferInfo, DeviceResourceCreatorType>::getInstance() noexcept {
    static ResourceAllocator instance;
    return instance;
}

template <typename DeviceResourceType, typename DeviceResourceCreatorType>
DeviceResourceType *ResourceAllocator<DeviceResourceType, gfx::FramebufferInfo, DeviceResourceCreatorType>::alloc(const gfx::FramebufferInfo &desc) noexcept {
    ccstd::hash_t hash = gfx::Hasher<gfx::FramebufferInfo>()(desc);
    DeviceResourcePool &pool{_pool[hash]};

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
        pool.pushBack(resource);
    }

    _ages[resource] = -1;
    return resource;
}

template <typename DeviceResourceType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, gfx::FramebufferInfo, DeviceResourceCreatorType>::free(DeviceResourceType *const resource) noexcept {
    CC_ASSERT(_ages.count(resource) && _ages[resource] < 0);
    _ages[resource] = _age;
}

template <typename DeviceResourceType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, gfx::FramebufferInfo, DeviceResourceCreatorType>::tick() noexcept {
    ++_age;
}

template <typename DeviceResourceType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, gfx::FramebufferInfo, DeviceResourceCreatorType>::gc(uint32_t const unusedFrameCount) noexcept {
    for (auto &pair : _pool) {
        DeviceResourcePool &pool = pair.second;

        auto count = static_cast<int>(pool.size());

        if (!count) {
            continue;
        }

        int destroyBegin = count - 1;

        for (int i = 0; i < count; ++i) {
            int64_t ageI = _ages[pool.at(i)];
            if (ageI < 0 || _age - ageI < unusedFrameCount) {
                continue;
            }

            int j = destroyBegin;

            for (; j > i; --j) {
                int64_t ageJ = _ages[pool.at(j)];
                if (ageJ < 0 || _age - ageJ < unusedFrameCount) {
                    std::swap(pool.at(i), pool.at(j));
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
            //            delete resource;
            _ages.erase(resource);
            pool.popBack();
        }
    }
}

} // namespace framegraph
} // namespace cc
