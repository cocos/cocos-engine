/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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
    auto num = _vbArr.size();
    for (auto i = 0; i < num; i++) {
        delete _ibArr[i];
        delete _vbArr[i];
    }
    _ibArr.clear();
    _vbArr.clear();
}

void MeshBuffer::afterCleanupHandle() {
    clear();
    se::ScriptEngine::getInstance()->addAfterInitHook(std::bind(&MeshBuffer::init, this));
}

void MeshBuffer::init() {
    auto rIB = new IOTypedArray(se::Object::TypedArrayType::UINT16, _ib.getCapacity());
    _ibArr.push_back(rIB);

    auto rVB = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, _vb.getCapacity());
    _vbArr.push_back(rVB);

    se::ScriptEngine::getInstance()->addAfterCleanupHook(std::bind(&MeshBuffer::afterCleanupHandle, this));
}

void MeshBuffer::uploadVB() {
    auto length = _vb.length();
    if (length == 0) return;

    auto rVB = _vbArr[_bufferPos];
    rVB->reset();
    rVB->writeBytes((const char *)_vb.getBuffer(), _vb.length());
}

void MeshBuffer::uploadIB() {
    auto length = _ib.length();
    if (length == 0) return;

    auto rIB = _ibArr[_bufferPos];
    rIB->reset();
    rIB->writeBytes((const char *)_ib.getBuffer(), _ib.length());
}

void MeshBuffer::next() {
    _bufferPos++;
    if (_ibArr.size() <= _bufferPos) {
        auto rIB = new IOTypedArray(se::Object::TypedArrayType::UINT16, _ib.getCapacity());
        _ibArr.push_back(rIB);
    }

    if (_vbArr.size() <= _bufferPos) {
        auto rVB = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, _vb.getCapacity());
        _vbArr.push_back(rVB);
    }
}

void MeshBuffer::reset() {
    _bufferPos = 0;
    _vb.reset();
    _ib.reset();
}

MIDDLEWARE_END
