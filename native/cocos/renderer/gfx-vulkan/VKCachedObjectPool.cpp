//
// Created by Zach Lee on 2023/4/12.
//

#include "VKCachedObjectPool.h"

namespace cc::gfx {

std::pair<CCVKGPUDescriptorSetLayout *, bool> CCVKCachedObjectPool::getOrCreateDescriptorSetLayout(ccstd::hash_t hash) {
    std::lock_guard<std::mutex> lock(_layouts.mutex);
    auto iter = _layouts.objects.find(hash);
    if (iter != _layouts.objects.end()) {
        return {iter->second, false};
    }

    auto *layout = ccnew CCVKGPUDescriptorSetLayout();
    _layouts.objects[hash] = layout;
    return {layout, true};
}

} // namespace cc::gfx