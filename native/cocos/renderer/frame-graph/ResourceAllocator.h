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
#include "base/memory/Memory.h"

namespace cc {
namespace framegraph {

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
class ResourceAllocator final {
public:
    using DescriptorHash        = uint32_t;
    using DeviceResourceCreator = DeviceResourceCreatorType;

    ResourceAllocator(const ResourceAllocator &) = delete;
    ResourceAllocator(ResourceAllocator &&)      = delete;
    ResourceAllocator &operator=(const ResourceAllocator &) = delete;
    ResourceAllocator &operator=(ResourceAllocator &&) = delete;

    static ResourceAllocator &getInstance() noexcept;
    DeviceResourceType *      alloc(const DescriptorType &desc, DescriptorHash key) noexcept;
    void                      free(const DescriptorType &desc, DescriptorHash key, DeviceResourceType *resource) noexcept;
    inline void               tick() noexcept;
    void                      gc(uint32_t unusedFrameCount) noexcept;

private:
    using DeviceResourcePtr = DeviceResourceType *;

    struct Bucket {
        explicit Bucket(DescriptorHash const key) noexcept : key(key) {}

        using Pool = std::vector<DeviceResourcePtr>;
        DescriptorHash key{0};
        Pool           pool{};
    };

    struct BucketGC final : public Bucket {
        using Bucket::Bucket;
        std::vector<uint64_t> ages{};
    };

    ResourceAllocator() noexcept = default;
    ~ResourceAllocator()         = default;
    template <typename Cache>
    typename Bucket::Pool *getPool(DescriptorHash key, Cache &from) noexcept;
    BucketGC &             getBucketGC(DescriptorHash key) noexcept;

    std::vector<BucketGC> _free{};
    std::vector<Bucket>   _inUse{};
    uint64_t              _age{0};
};

//////////////////////////////////////////////////////////////////////////

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType> &ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::getInstance() noexcept {
    static ResourceAllocator instance;
    return instance;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
DeviceResourceType *ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::alloc(const DescriptorType &desc, DescriptorHash const key) noexcept {
    auto it = std::find_if(_free.begin(), _free.end(), [&key](const BucketGC &x) {
        return key == x.key;
    });

    if (it == _free.end()) {
        _free.emplace_back(key);
        _inUse.emplace_back(key);
        it = _free.end() - 1;
    }

    DeviceResourcePtr resource = nullptr;

    if (it->pool.empty()) {
        DeviceResourceCreator creator;
        resource = creator(desc);
    } else {
        resource = it->pool.back();
        it->pool.pop_back();
        it->ages.pop_back();
    }

    getPool(key, _inUse)->emplace_back(resource);
    return resource;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::free(const DescriptorType & /*desc*/, DescriptorHash const key, DeviceResourceType *const resource) noexcept {
    auto *pool = getPool(key, _inUse);
    CC_ASSERT(!pool->empty());

    auto it = std::find_if(pool->begin(), pool->end(), [&resource](DeviceResourcePtr x) {
        return resource == x;
    });
    CC_ASSERT(it != pool->end());
    pool->erase(it);

    auto &freeBucket = getBucketGC(key);
    freeBucket.pool.emplace_back(resource);
    freeBucket.ages.emplace_back(_age);
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::tick() noexcept {
    ++_age;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::gc(uint32_t const unusedFrameCount) noexcept {
    std::for_each(_free.begin(), _free.end(), [&](BucketGC &bucket) {
        const size_t count = bucket.ages.size();

        if (!count) {
            return;
        }

        size_t destroyBegin = count - 1;

        for (size_t i = 0; i < count; ++i) {
            if (_age - bucket.ages[i] < unusedFrameCount) {
                continue;
            }

            size_t j = destroyBegin;

            for (; j > i; --j) {
                if (_age - bucket.ages[j] < unusedFrameCount) {
                    std::swap(bucket.ages[i], bucket.ages[j]);
                    std::swap(bucket.pool[i], bucket.pool[j]);
                    destroyBegin = j;
                    break;
                }
            }

            if (i >= j) {
                destroyBegin = i;
            }

            if (i >= destroyBegin) {
                break;
            }
        }

        while (++destroyBegin <= count) {
            CC_SAFE_DESTROY(bucket.pool.back());
            bucket.pool.pop_back();
            bucket.ages.pop_back();
        }
    });
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
template <typename Cache>
typename ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::Bucket::Pool *
ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::getPool(
    DescriptorHash const key, Cache &from) noexcept {
    auto it = std::find_if(from.begin(), from.end(), [&key](const Bucket &x) {
        return key == x.key;
    });

    return it == from.end() ? nullptr : &it->pool;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
typename ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::BucketGC &
ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::getBucketGC(DescriptorHash const key) noexcept {
    auto it = std::find_if(_free.begin(), _free.end(), [&key](const BucketGC &x) {
        return key == x.key;
    });

    CC_ASSERT(it != _free.end());
    return *it;
}

} // namespace framegraph
} // namespace cc
