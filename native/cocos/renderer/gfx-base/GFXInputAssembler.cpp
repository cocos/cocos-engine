/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include <boost/functional/hash.hpp>

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

size_t InputAssembler::computeAttributesHash() const {
    size_t seed = _attributes.size() * 6;
    for (const auto &attribute : _attributes) {
        boost::hash_combine(seed, attribute.name);
        boost::hash_combine(seed, attribute.format);
        boost::hash_combine(seed, attribute.isNormalized);
        boost::hash_combine(seed, attribute.stream);
        boost::hash_combine(seed, attribute.isInstanced);
        boost::hash_combine(seed, attribute.location);
    }
    return seed;
}

void InputAssembler::initialize(const InputAssemblerInfo &info) {
    _attributes     = info.attributes;
    _vertexBuffers  = info.vertexBuffers;
    _indexBuffer    = info.indexBuffer;
    _indirectBuffer = info.indirectBuffer;
    _attributesHash = computeAttributesHash();

    if (_indexBuffer) {
        _drawInfo.indexCount = _indexBuffer->getCount();
        _drawInfo.firstIndex = 0;
    } else if (!_vertexBuffers.empty()) {
        _drawInfo.vertexCount  = _vertexBuffers[0]->getCount();
        _drawInfo.firstVertex  = 0;
        _drawInfo.vertexOffset = 0;
    }

    doInit(info);
}

void InputAssembler::destroy() {
    doDestroy();

    _attributes.clear();
    _attributesHash = 0U;

    _vertexBuffers.clear();
    _indexBuffer    = nullptr;
    _indirectBuffer = nullptr;

    _drawInfo = DrawInfo();
}

} // namespace gfx
} // namespace cc
