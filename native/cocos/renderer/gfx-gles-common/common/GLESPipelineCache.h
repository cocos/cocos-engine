//
// Created by Zach Lee on 2023/7/29.
//

#pragma once
#pragma once

#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc {
class BinaryOutputArchive;
}

namespace cc::gfx {
class GLESPipelineCache : public RefCounted {
public:
    GLESPipelineCache();
    ~GLESPipelineCache() override;

    void init();

    void addBinary(GLESGPUProgramBinary *binary);
    GLESGPUProgramBinary *fetchBinary(const ccstd::string &key, ccstd::hash_t hash);
    bool checkProgramFormat(GLuint format) const;

private:
    bool loadCache();
    void saveCacheFull();
    void saveCacheIncremental(GLESGPUProgramBinary *binary);

    ccstd::vector<GLint> _programBinaryFormats;
    ccstd::unordered_map<ccstd::string, IntrusivePtr<GLESGPUProgramBinary>> _programCaches;
    ccstd::string _savePath;
    bool _dirty = false;
};

} // namespace cc::gfx