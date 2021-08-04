/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"

#include "GFXBuffer.h"
#include "GFXInputAssembler.h"
#include "GFXObject.h"

namespace cc {
namespace gfx {

InputAssembler::InputAssembler()
: GFXObject(ObjectType::INPUT_ASSEMBLER) {
}

InputAssembler::~InputAssembler() = default;

void InputAssembler::extractDrawInfo(DrawInfo &drawInfo) const {
    drawInfo.vertexCount   = _vertexCount;
    drawInfo.firstVertex   = _firstVertex;
    drawInfo.indexCount    = _indexCount;
    drawInfo.firstIndex    = _firstIndex;
    drawInfo.vertexOffset  = _vertexOffset;
    drawInfo.instanceCount = _instanceCount;
    drawInfo.firstInstance = _firstInstance;
}

uint InputAssembler::computeAttributesHash() const {
    // https://stackoverflow.com/questions/20511347/a-good-hash-function-for-a-vector
    // 6: Attribute has 6 elements.
    std::size_t seed = _attributes.size() * 6;
    for (const auto &attribute : _attributes) {
        seed ^= std::hash<std::string>{}(attribute.name) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(attribute.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= attribute.isNormalized + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= attribute.stream + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= attribute.isInstanced + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= attribute.location + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }
    return static_cast<uint>(seed);
}

void InputAssembler::initialize(const InputAssemblerInfo &info) {
    _attributes     = info.attributes;
    _vertexBuffers  = info.vertexBuffers;
    _indexBuffer    = info.indexBuffer;
    _indirectBuffer = info.indirectBuffer;

    if (_indexBuffer) {
        _indexCount = _indexBuffer->getCount();
        _firstIndex = 0;
    } else if (!_vertexBuffers.empty()) {
        _vertexCount  = _vertexBuffers[0]->getCount();
        _firstVertex  = 0;
        _vertexOffset = 0;
    }
    _attributesHash = computeAttributesHash();

    doInit(info);
}

void InputAssembler::destroy() {
    doDestroy();

    _attributes.clear();
    _vertexBuffers.clear();
    _indexBuffer    = nullptr;
    _indirectBuffer = nullptr;
    _indexCount = _firstIndex = _vertexCount = _firstVertex = _vertexOffset = _attributesHash = 0U;

    doDestroy();
}

} // namespace gfx
} // namespace cc
