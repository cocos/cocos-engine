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
#include "2d/renderer/UIMeshBuffer.h"

MIDDLEWARE_BEGIN

static const ccstd::vector<gfx::Attribute> ATTRIBUTES_V3F_T2F_C4B{
    gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
    gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
    gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA8, true},
};

static const ccstd::vector<gfx::Attribute> ATTRIBUTES_V3F_T2F_C4B_C4B{
    gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
    gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
    gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA8, true},
    gfx::Attribute{gfx::ATTR_NAME_COLOR2, gfx::Format::RGBA8, true},
};

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
    cleanUIMeshBuffer();
}


void MeshBuffer::init() {
    auto *rIB = new IOTypedArray(se::Object::TypedArrayType::UINT16, _ib.getCapacity());
    _ibArr.push_back(rIB);

    auto *rVB = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, _vb.getCapacity());
    _vbArr.push_back(rVB);
    cleanUIMeshBuffer();
    addUIMeshBuffer();
}

void MeshBuffer::uploadVB() {
    auto length = _vb.length();
    if (length == 0) return;

    auto *rVB = _vbArr[_bufferPos];
    rVB->reset();
    rVB->writeBytes(reinterpret_cast<const char *>(_vb.getBuffer()), _vb.length());
    auto *uiMeshBuffer = _uiMeshBufferArr[_bufferPos];
    uiMeshBuffer->setVData(reinterpret_cast<float *>(rVB->getBuffer()));
    uiMeshBuffer->setByteOffset(static_cast<uint32_t>(_vb.length()));
}

void MeshBuffer::uploadIB() {
    auto length = _ib.length();
    if (length == 0) return;

    auto *rIB = _ibArr[_bufferPos];
    rIB->reset();
    rIB->writeBytes(reinterpret_cast<const char *>(_ib.getBuffer()), _ib.length());
    auto *uiMeshBuffer = _uiMeshBufferArr[_bufferPos];
    uiMeshBuffer->setIData(reinterpret_cast<uint16_t *>(rIB->getBuffer()));
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

    if (_uiMeshBufferArr.size() <= _bufferPos) {
        addUIMeshBuffer();
    }
}

void MeshBuffer::reset() {
    _bufferPos = 0;
    _vb.reset();
    _ib.reset();
}

void MeshBuffer::addUIMeshBuffer() {
    UIMeshBuffer* uiMeshBuffer = new UIMeshBuffer();
    ccstd::vector<gfx::Attribute> attrs;
    if (_vertexFormat == VF_XYZUVC) {
        attrs = ATTRIBUTES_V3F_T2F_C4B;
    } else {
        attrs = ATTRIBUTES_V3F_T2F_C4B_C4B;
    }
    uiMeshBuffer->initialize(std::move(attrs), true);
    _uiMeshBufferArr.push_back(uiMeshBuffer);
}

void MeshBuffer::cleanUIMeshBuffer() {
    for(auto *buf : _uiMeshBufferArr) {
        buf->freeLayout();
        delete buf;
    }
    _uiMeshBufferArr.clear();
}

cc::UIMeshBuffer *MeshBuffer::getUIMeshBuffer() const {
    return _uiMeshBufferArr[_bufferPos];
}

const ccstd::vector<cc::UIMeshBuffer *>& MeshBuffer::uiMeshBuffers() const {
    return _uiMeshBufferArr;
}

MIDDLEWARE_END
