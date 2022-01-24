/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "MeshBuffer.h"

MIDDLEWARE_BEGIN

MeshBuffer::MeshBuffer(int vertexFormat)
: MeshBuffer(vertexFormat, INIT_INDEX_BUFFER_SIZE, MAX_VERTEX_BUFFER_SIZE) {
}

MeshBuffer::MeshBuffer(int vertexFormat, size_t indexSize, size_t vertexSize)
: _vertexFormat(vertexFormat), _ib(indexSize), _vb(vertexSize * vertexFormat * sizeof(float)) {
    _vb.setMaxSize(MAX_VERTEX_BUFFER_SIZE * _vertexFormat * sizeof(float));
    _ib.setMaxSize(INIT_INDEX_BUFFER_SIZE);
    _vb.setFullCallback([this] {
        uploadVB();
        uploadIB();
        _vb.reset();
        _ib.reset();
        next();
    });

    init();
}

MeshBuffer::~MeshBuffer() {
    clear();
}

void MeshBuffer::clear() {
    size_t num = _vbArr.size();
    for (size_t i = 0; i < num; i++) {
        delete _ibArr[i];
        delete _vbArr[i];
    }
    _ibArr.clear();
    _vbArr.clear();
}

void MeshBuffer::afterCleanupHandle() {
    clear();
    se::ScriptEngine::getInstance()->addAfterInitHook([this] { init(); });
}

void MeshBuffer::init() {
    auto *rIB = new IOTypedArray(se::Object::TypedArrayType::UINT16, _ib.getCapacity());
    _ibArr.push_back(rIB);

    auto *rVB = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, _vb.getCapacity());
    _vbArr.push_back(rVB);

    se::ScriptEngine::getInstance()->addAfterCleanupHook([this] { afterCleanupHandle(); });
}

void MeshBuffer::uploadVB() {
    auto length = _vb.length();
    if (length == 0) return;

    auto *rVB = _vbArr[_bufferPos];
    rVB->reset();
    rVB->writeBytes(reinterpret_cast<const char *>(_vb.getBuffer()), _vb.length());
}

void MeshBuffer::uploadIB() {
    auto length = _ib.length();
    if (length == 0) return;

    auto *rIB = _ibArr[_bufferPos];
    rIB->reset();
    rIB->writeBytes(reinterpret_cast<const char *>(_ib.getBuffer()), _ib.length());
}

void MeshBuffer::next() {
    _bufferPos++;
    if (_ibArr.size() <= _bufferPos) {
        auto *rIB = new IOTypedArray(se::Object::TypedArrayType::UINT16, _ib.getCapacity());
        _ibArr.push_back(rIB);
    }

    if (_vbArr.size() <= _bufferPos) {
        auto *rVB = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, _vb.getCapacity());
        _vbArr.push_back(rVB);
    }
}

void MeshBuffer::reset() {
    _bufferPos = 0;
    _vb.reset();
    _ib.reset();
}

MIDDLEWARE_END
