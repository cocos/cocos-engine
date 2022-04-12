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

#include "base/CoreStd.h"

#include "GFXDevice.h"
#include "GFXObject.h"
#include "GFXShader.h"

namespace cc {
namespace gfx {

Shader::Shader()
: GFXObject(ObjectType::SHADER) {
}

Shader::~Shader() = default;

void Shader::initialize(const ShaderInfo &info) {
    _name            = info.name;
    _stages          = info.stages;
    _attributes      = info.attributes;
    _blocks          = info.blocks;
    _buffers         = info.buffers;
    _samplerTextures = info.samplerTextures;
    _samplers        = info.samplers;
    _textures        = info.textures;
    _images          = info.images;
    _subpassInputs   = info.subpassInputs;

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
