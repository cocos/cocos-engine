//
// Created by Zach Lee on 2023/4/12.
//

#pragma once

#include <mutex>
#include "base/std/container/unordered_map.h"
#include "VKGPUObjects.h"

namespace cc::gfx {

class CCVKCachedObjectPool {
public:
    CCVKCachedObjectPool() = default;
    ~CCVKCachedObjectPool() = default;

    template <typename T>
    struct Pool {
        using ObjectPtr = IntrusivePtr<T>;
        ccstd::unordered_map<ccstd::hash_t, ObjectPtr> objects;
        mutable std::mutex mutex;
    };

    std::pair<CCVKGPUDescriptorSetLayout *, bool> getOrCreateDescriptorSetLayout(ccstd::hash_t hash);

private:
    // descriptor set layout
    Pool<CCVKGPUDescriptorSetLayout> _layouts;

    // pipeline layout
    // pipeline
    // render pass
};

} // namespace cc::gfx