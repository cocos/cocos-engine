/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "IOBuffer.h"
#include "IOTypedArray.h"
#include "base/std/container/vector.h"

namespace cc {
class UIMeshBuffer;
};

MIDDLEWARE_BEGIN

class MeshBuffer {
public:
    explicit MeshBuffer(int vertexFormat);
    MeshBuffer(int vertexFormat, size_t indexSize, size_t vertexSize);

    virtual ~MeshBuffer();

    se_object_ptr getVBTypedArray(std::size_t bufferPos) {
        if (_vbArr.size() <= bufferPos) return nullptr;
        return _vbArr[bufferPos]->getTypeArray();
    }

    se_object_ptr getIBTypedArray(std::size_t bufferPos) {
        if (_ibArr.size() <= bufferPos) return nullptr;
        return _ibArr[bufferPos]->getTypeArray();
    }

    uint8_t *getVBFromBufferArray(std::size_t index) {
        if (_vbArr.size() <= index) return nullptr;
        return _vbArr[index]->getBuffer();
    }

    uint8_t *getIBFromBufferArray(std::size_t index) {
        if (_ibArr.size() <= index) return nullptr;
        return _ibArr[index]->getBuffer();
    }

    std::size_t getVBTypedArrayLength(std::size_t bufferPos) {
        if (_vbArr.size() <= bufferPos) return 0;
        return _vbArr[bufferPos]->length();
    }

    std::size_t getIBTypedArrayLength(std::size_t bufferPos) {
        if (_ibArr.size() <= bufferPos) return 0;
        return _ibArr[bufferPos]->length();
    }

    std::size_t getBufferCount() const {
        return _bufferPos + 1;
    }

    uint16_t getBufferPos() const {
        return _bufferPos;
    }

    IOBuffer &getVB() {
        return _vb;
    }

    IOBuffer &getIB() {
        return _ib;
    }

    cc::UIMeshBuffer *getUIMeshBuffer() const;

    const ccstd::vector<cc::UIMeshBuffer *> &uiMeshBuffers() const;

    void uploadVB();
    void uploadIB();
    void reset();

private:
    void next();
    void clear();
    void init();
    void afterCleanupHandle();
    void addUIMeshBuffer();
    void cleanUIMeshBuffer();

    ccstd::vector<IOTypedArray *> _ibArr;
    ccstd::vector<IOTypedArray *> _vbArr;
    ccstd::vector<cc::UIMeshBuffer *> _uiMeshBufferArr;
    uint16_t _bufferPos = 0;
    IOBuffer _vb;
    IOBuffer _ib;
    int _vertexFormat = 0;
};

MIDDLEWARE_END
