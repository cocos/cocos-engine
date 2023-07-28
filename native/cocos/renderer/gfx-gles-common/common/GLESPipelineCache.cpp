
#include "GLESPipelineCache.h"

#include <fstream>
#include <algorithm>

#include "base/Log.h"
#include "base/BinaryArchive.h"
#include "gfx-base/GFXUtil.h"
#include "GLESGPUObjects.h"
#include "GLESDevice.h"
#include "GLESCommands.h"

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

void saveItem(BinaryOutputArchive &archive, GLESGPUProgramBinary *binary) {
    archive.save(binary->format);
    archive.save(static_cast<uint32_t>(binary->name.size()));
    archive.save(static_cast<uint32_t>(binary->data.size()));
    archive.save(binary->hash);
    archive.save(binary->name.data(), static_cast<uint32_t>(binary->name.size()));
    archive.save(binary->data.data(), static_cast<uint32_t>(binary->data.size()));
    CC_LOG_INFO("Save program cache success, name %s.", binary->name.c_str());
}

} // namespace

GLESPipelineCache::GLESPipelineCache() {
    _savePath = getPipelineCacheFolder() + fileName;
}

GLESPipelineCache::~GLESPipelineCache() { // NOLINT
#ifdef PIPELINE_CACHE_FULL
    saveCacheFull();
#endif
}

bool GLESPipelineCache::loadCache() {
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
            archive.move(dataLength + nameLength + sizeof(GLESGPUProgramBinary::hash));
            continue;
        }

        auto *binary = ccnew GLESGPUProgramBinary();
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

void GLESPipelineCache::saveCacheIncremental(GLESGPUProgramBinary *binary) {
    std::ofstream stream(_savePath, std::ios::binary | std::ios::app);
    if (!stream.is_open()) {
        CC_LOG_INFO("Save program cache failed.");
        return;
    }
    BinaryOutputArchive archive(stream);
    saveItem(archive, binary);
}

void GLESPipelineCache::saveCacheFull() {
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

void GLESPipelineCache::init() {
    glesUpdateProgramBinaryFormats(GLESDevice::getInstance(), _programBinaryFormats);

    auto success = loadCache();
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

void GLESPipelineCache::addBinary(GLESGPUProgramBinary *binary) {
    _programCaches[binary->name] = binary;
#ifdef PIPELINE_CACHE_INCREMENTAL
    saveCacheIncremental(binary);
#endif
    _dirty = true;
}

GLESGPUProgramBinary *GLESPipelineCache::fetchBinary(const ccstd::string &key, ccstd::hash_t hash) {
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

bool GLESPipelineCache::checkProgramFormat(GLuint format) const {
    return std::any_of(_programBinaryFormats.begin(), _programBinaryFormats.end(), [format](const auto &fmt) {
        return format == fmt;
    });
}

} // namespace cc::gfx
