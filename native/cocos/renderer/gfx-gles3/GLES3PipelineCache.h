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

#pragma once

#include "GLES3GPUObjects.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"

namespace cc {
class BinaryOutputArchive;
}

namespace cc::gfx {
class GLES3GPUShader;

class GLES3PipelineCache : public RefCounted {
public:
    GLES3PipelineCache();
    ~GLES3PipelineCache() override;

    void init();

    void addBinary(GLES3GPUProgramBinary *binary);
    GLES3GPUProgramBinary *fetchBinary(const ccstd::string &key, ccstd::hash_t hash);
    bool checkProgramFormat(GLuint format) const;

private:
    bool loadCache();
    void saveCacheFull();
    void saveCacheIncremental(GLES3GPUProgramBinary *binary);

    ccstd::vector<GLint> _programBinaryFormats;
    ccstd::unordered_map<ccstd::string, IntrusivePtr<GLES3GPUProgramBinary>> _programCaches;
    ccstd::string _savePath;
    bool _dirty = false;
};

} // namespace cc::gfx
