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

#include "GLES3PipelineCache.h"

#include <fstream>

#include "base/BinaryArchive.h"

#include "GLES3GPUObjects.h"
#include "gfx-base/GFXUtil.h"

namespace cc::gfx {

//#define PIPELINE_CACHE_FORCE_INCREMENTAL

#if defined(_WIN32) && !defined(PIPELINE_CACHE_FORCE_INCREMENTAL)
    #define PIPELINE_CACHE_FULL
#else
    #define PIPELINE_CACHE_INCREMENTAL
#endif

namespace {
const char *fileName = "/pipeline_cache_gles3.bin";
const uint32_t MAGIC = 0x4343474C; // "CCGL"
const uint32_t VERSION = 1;

void saveHeader(BinaryOutputArchive &archive) {
    archive.save(MAGIC);
    archive.save(VERSION);
}

void saveItem(BinaryOutputArchive &archive, GLES3GPUProgramBinary *binary) {
    archive.save(binary->format);
    archive.save(static_cast<uint32_t>(binary->name.size()));
    archive.save(static_cast<uint32_t>(binary->data.size()));
    archive.save(binary->hash);
    archive.save(binary->name.data(), static_cast<uint32_t>(binary->name.size()));
    archive.save(binary->data.data(), static_cast<uint32_t>(binary->data.size()));
    CC_LOG_INFO("Save program cache success, name %s.", binary->name.c_str());
}

} // namespace

GLES3PipelineCache::GLES3PipelineCache() {
    _savePath = getPipelineCacheFolder() + fileName;
}

GLES3PipelineCache::~GLES3PipelineCache() { // NOLINT
#ifdef PIPELINE_CACHE_FULL
    saveCacheFull();
#endif
}

bool GLES3PipelineCache::loadCache() {
    std::ifstream stream(_savePath, std::ios::binary);
    if (!stream.is_open()) {
        CC_LOG_INFO("Load program cache, no cached files.");
        return false;
    }

    uint32_t magic = 0;
    uint32_t version = 0;

    BinaryInputArchive archive(stream);
    auto loadResult = archive.load(magic);
    loadResult &= archive.load(version);

    if (magic != MAGIC || version < VERSION) {
        // false means invalid cache, need to discard the file content.
        return false;
    }

    uint32_t cachedItemNum = 0;
    GLenum format = GL_NONE;
    while (loadResult && archive.load(format)) {
        ++cachedItemNum;

        // name length
        uint32_t nameLength = 0;
        loadResult &= archive.load(nameLength);

        // data length
        uint32_t dataLength = 0;
        loadResult &= archive.load(dataLength);

        // skip length if not valid.
        if (!checkProgramFormat(format)) {
            archive.move(dataLength + nameLength + sizeof(GLES3GPUProgramBinary::hash));
            continue;
        }

        auto *binary = ccnew GLES3GPUProgramBinary();
        binary->format = format;
        binary->name.resize(nameLength, 0);
        binary->data.resize(dataLength, 0);

        // hash
        loadResult &= archive.load(binary->hash);

        // name
        loadResult &= archive.load(binary->name.data(), nameLength);

        // data
        loadResult &= archive.load(binary->data.data(), dataLength);

        _programCaches.emplace(binary->name, binary);
    }

    // If the number of cached items does not equal the number of loaded items, it may be necessary to update the cache.
    _dirty = cachedItemNum != _programCaches.size();
    CC_LOG_INFO("Load program cache success. records %u, loaded %u", cachedItemNum, _programCaches.size());
    return true;
}

void GLES3PipelineCache::saveCacheIncremental(GLES3GPUProgramBinary *binary) {
    std::ofstream stream(_savePath, std::ios::binary | std::ios::app);
    if (!stream.is_open()) {
        CC_LOG_INFO("Save program cache failed.");
        return;
    }
    BinaryOutputArchive archive(stream);
    saveItem(archive, binary);
}

void GLES3PipelineCache::saveCacheFull() {
    if (!_dirty) {
        return;
    }
    std::ofstream stream(_savePath, std::ios::binary);
    if (!stream.is_open()) {
        CC_LOG_INFO("Save program cache failed.");
        return;
    }
    BinaryOutputArchive archive(stream);
    saveHeader(archive);

    for (auto &pair : _programCaches) {
        auto &binary = pair.second;
        saveItem(archive, binary);
    }
    _dirty = false;
}

void GLES3PipelineCache::init() {
    GLint shaderBinaryFormats = 0;
    GL_CHECK(glGetIntegerv(GL_NUM_PROGRAM_BINARY_FORMATS, &shaderBinaryFormats));

    _programBinaryFormats.resize(shaderBinaryFormats);
    GL_CHECK(glGetIntegerv(GL_PROGRAM_BINARY_FORMATS, _programBinaryFormats.data()));

    bool success = loadCache();
    if (!success) {
        // discard cache content.
        std::ofstream stream(_savePath, std::ios::binary | std::ios::trunc);
#ifdef PIPELINE_CACHE_INCREMENTAL
        if (stream.is_open()) {
            BinaryOutputArchive archive(stream);
            saveHeader(archive);
        }
#endif
    }
}

void GLES3PipelineCache::addBinary(GLES3GPUProgramBinary *binary) {
    _programCaches[binary->name] = binary;
#ifdef PIPELINE_CACHE_INCREMENTAL
    saveCacheIncremental(binary);
#endif
    _dirty = true;
}

GLES3GPUProgramBinary *GLES3PipelineCache::fetchBinary(const ccstd::string &key, ccstd::hash_t hash) {
    auto iter = _programCaches.find(key);
    if (iter == _programCaches.end()) {
        return nullptr;
    }

    // if hash not match, re-generate program binary.
    if (iter->second->hash != hash) {
        _programCaches.erase(iter);
        return nullptr;
    }

    return iter->second;
}

bool GLES3PipelineCache::checkProgramFormat(GLuint format) const {
    return std::any_of(_programBinaryFormats.begin(), _programBinaryFormats.end(), [format](const auto &fmt) {
        return format == fmt;
    });
}

} // namespace cc::gfx
