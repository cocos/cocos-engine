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

#include "gfx-base/GFXTransientPool.h"
#include "gfx-base/GFXDevice.h"

namespace cc {
namespace gfx {

TransientPool::TransientPool() : GFXObject(ObjectType::TRANSIENT_POOL) {
}

void TransientPool::beginFrame() {
    _context->reset();

    _buffers.clear();
    _textures.clear();
}

void TransientPool::endFrame() {
    _resources.clear();
}

void TransientPool::initialize(const TransientPoolInfo &info) {
    _info = info;
    _context = std::make_unique<AliasingContext>();
    doInit(info);
}

Buffer *TransientPool::requestBuffer(const BufferInfo &info, IAliasingScope *scope) {
    auto *buffer = Device::getInstance()->createBuffer(info);

    auto &res = _resources[buffer->getObjectID()];
    res.resource.object = buffer;
    res.first = scope;

    doInitBuffer(buffer);
    _buffers.emplace_back(buffer);
    return buffer;
}

Texture *TransientPool::requestTexture(const TextureInfo &info, IAliasingScope *scope) {
    auto *texture = Device::getInstance()->createTexture(info);

    auto &res = _resources[texture->getObjectID()];
    res.resource.object = texture;
    res.first = scope;

    doInitTexture(texture);
    _textures.emplace_back(texture);
    return texture;
}

void TransientPool::resetBuffer(Buffer *buffer, IAliasingScope *scope) {
    recordResource(buffer->getObjectID(), scope);
    doResetBuffer(buffer);
}

void TransientPool::resetTexture(Texture *texture, IAliasingScope *scope) {
    recordResource(texture->getObjectID(), scope);
    doResetTexture(texture);
}

void TransientPool::recordResource(uint32_t id, IAliasingScope *scope) {
    auto iter = _resources.find(id);
    if (iter == _resources.end()) {
        return;
    }
    iter->second.last = scope;
    _context->record({iter->second, 0, 0, 0});
}

} // namespace gfx
} // namespace cc
