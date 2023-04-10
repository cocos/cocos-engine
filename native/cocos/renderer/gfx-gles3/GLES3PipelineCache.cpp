/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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
#include "GLES3GPUObjects.h"
#include "gfx-base/GFXUtil.h"
#include "base/BinaryArchive.h"
#include <fstream>

namespace cc::gfx {

static const char* fileName = "/pipeline_cache_gles3.bin";

static const uint32_t MAGIC   = 0x4343474C; // "CCGL"
static const uint32_t VERSION = 1;

GLES3PipelineCache::~GLES3PipelineCache() {
    saveCache();
}

void GLES3PipelineCache::loadCache() {
    auto path = getPipelineCacheFolder() + fileName;
    std::ifstream stream(path, std::ios::binary);
    if (!stream.is_open()) {
        CC_LOG_INFO("Load program cache, no cached files.");
        return;
    }

    uint32_t magic = 0;
    uint32_t version = 0;

    BinaryInputArchive archive(stream);
    auto loadResult = archive.load(magic);
    loadResult &= archive.load(version);

    uint32_t cachedItemNum = 0;
    while (loadResult && magic == MAGIC && version >= VERSION) {
        ++cachedItemNum;
        IntrusivePtr<GLES3GPUProgramBinary> binary = ccnew GLES3GPUProgramBinary();

        // name
        uint32_t length = 0;
        loadResult &= archive.load(length);
        binary->name.resize(length, 0);
        loadResult &= archive.load(binary->name.data(), length);

        // hash
        loadResult &= archive.load(binary->hash);

        // format
        loadResult &= archive.load(binary->format);

        // binary data
        length = 0;
        loadResult &= archive.load(length);
        binary->data.resize(length, 0);
        loadResult &= archive.load(binary->data.data(), length);

        if (checkProgramFormat(binary->format)) {
            _programCaches.emplace(binary->name, binary);
        }
    }
    _dirty = cachedItemNum != _programCaches.size();
    CC_LOG_INFO("Load program cache success. records %u, loaded %u", cachedItemNum, _programCaches.size());
}

void GLES3PipelineCache::saveCache() {
    if (!_dirty) {
        return;
    }
    auto path = getPipelineCacheFolder() + fileName;
    std::ofstream stream(path, std::ios::binary);
    if (!stream.is_open()) {
        CC_LOG_INFO("Save program cache failed.");
        return;
    }
    BinaryOutputArchive archive(stream);
    archive.save(MAGIC);
    archive.save(VERSION);

    for (auto &[name, binary] : _programCaches) {
        archive.save(static_cast<uint32_t>(name.size()));
        archive.save(name.data(), static_cast<uint32_t>(name.size()));
        archive.save(binary->hash);
        archive.save(binary->format);
        archive.save(static_cast<uint32_t>(binary->data.size()));
        archive.save(binary->data.data(), static_cast<uint32_t>(binary->data.size()));
        CC_LOG_INFO("Save program cache success, name %s.", name.c_str());
    }
    _dirty = false;
}

void GLES3PipelineCache::init() {
    GLint shaderBinaryFormats = 0;
    GL_CHECK(glGetIntegerv(GL_NUM_PROGRAM_BINARY_FORMATS, &shaderBinaryFormats));

    _programBinaryFormats.resize(shaderBinaryFormats);
    GL_CHECK(glGetIntegerv(GL_PROGRAM_BINARY_FORMATS, _programBinaryFormats.data()));

    loadCache();
}

void GLES3PipelineCache::addBinary(GLES3GPUProgramBinary *binary) {
    _programCaches[binary->name] = binary;
    _dirty = true;
}

GLES3GPUProgramBinary *GLES3PipelineCache::fetchBinary(GLES3GPUShader *shader) {
    auto iter = _programCaches.find(shader->name);
    if (iter == _programCaches.end()) {
        return nullptr;
    }

    // if hash not match, re-generate program binary.
    if (iter->second->hash != shader->hash) {
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
