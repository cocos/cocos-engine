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

#include "GFXShader.h"
#include "GFXDevice.h"
#include "GFXObject.h"

namespace cc {
namespace gfx {

Shader::Shader()
: GFXObject(ObjectType::SHADER) {
}

Shader::~Shader() = default;

void Shader::initialize(const ShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _buffers = info.buffers;
    _samplerTextures = info.samplerTextures;
    _samplers = info.samplers;
    _textures = info.textures;
    _images = info.images;
    _subpassInputs = info.subpassInputs;
    _hash = info.hash;
    doInit(info);
}

void Shader::destroy() {
    doDestroy();

    _stages.clear();
    _attributes.clear();
    _blocks.clear();
    _buffers.clear();
    _samplerTextures.clear();
    _samplers.clear();
    _textures.clear();
    _images.clear();
    _subpassInputs.clear();
}

} // namespace gfx
} // namespace cc
