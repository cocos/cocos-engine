/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include "VKPipelineCache.h"

#include <fstream>

#include "base/BinaryArchive.h"

#include "gfx-base/GFXUtil.h"

namespace {
const char *fileName = "/pipeline_cache_vk.bin";
const uint32_t MAGIC = 0x4343564B; // "CCVK"
const uint32_t VERSION = 1;

void loadData(const ccstd::string &path, ccstd::vector<char> &data) {
    std::ifstream stream(path, std::ios::binary);
    if (!stream.is_open()) {
        CC_LOG_INFO("Load program cache, no cached files.");
        return;
    }

    uint32_t magic = 0;
    uint32_t version = 0;

    cc::BinaryInputArchive archive(stream);
    auto loadResult = archive.load(magic);
    loadResult &= archive.load(version);

    uint32_t size = 0;
    if (loadResult && magic == MAGIC && version >= VERSION) {
        loadResult &= archive.load(size);
        data.resize(size);
        loadResult &= archive.load(data.data(), size);
    }
    if (loadResult) {
        CC_LOG_INFO("Load pipeline cache success.");
    }
}
} // namespace

namespace cc::gfx {

CCVKPipelineCache::CCVKPipelineCache() {
    _savePath = getPipelineCacheFolder() + fileName;
}

CCVKPipelineCache::~CCVKPipelineCache() {
    if (_pipelineCache != VK_NULL_HANDLE) {
#if CC_USE_PIPELINE_CACHE
        saveCache();
#endif
        vkDestroyPipelineCache(_device, _pipelineCache, nullptr);
    }
}

void CCVKPipelineCache::init(VkDevice dev) {
    _device = dev;
    loadCache();
}

void CCVKPipelineCache::loadCache() {
    ccstd::vector<char> data;
#if CC_USE_PIPELINE_CACHE
    loadData(_savePath, data);
#endif

    VkPipelineCacheCreateInfo cacheInfo = {};
    cacheInfo.sType = VK_STRUCTURE_TYPE_PIPELINE_CACHE_CREATE_INFO;
    cacheInfo.pNext = nullptr;
    cacheInfo.initialDataSize = static_cast<uint32_t>(data.size());
    cacheInfo.pInitialData = data.data();
    VK_CHECK(vkCreatePipelineCache(_device, &cacheInfo, nullptr, &_pipelineCache));
}

void CCVKPipelineCache::saveCache() {
    if (!_dirty) {
        return;
    }
    std::ofstream stream(_savePath, std::ios::binary);
    if (!stream.is_open()) {
        CC_LOG_INFO("Save program cache failed.");
        return;
    }
    BinaryOutputArchive archive(stream);
    archive.save(MAGIC);
    archive.save(VERSION);

    size_t size = 0;
    vkGetPipelineCacheData(_device, _pipelineCache, &size, nullptr);
    ccstd::vector<char> data(size);
    vkGetPipelineCacheData(_device, _pipelineCache, &size, data.data());

    archive.save(static_cast<uint32_t>(size));
    archive.save(data.data(), static_cast<uint32_t>(size));
    _dirty = false;
}

void CCVKPipelineCache::setDirty() {
    _dirty = true;
}

VkPipelineCache CCVKPipelineCache::getHandle() const {
    return _pipelineCache;
}

} // namespace cc::gfx
