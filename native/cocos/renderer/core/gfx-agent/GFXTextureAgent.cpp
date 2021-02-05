/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "CoreStd.h"

#include "base/threading/MessageQueue.h"
#include "GFXTextureAgent.h"
#include "GFXDeviceAgent.h"

namespace cc {
namespace gfx {

TextureAgent::~TextureAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        TextureDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool TextureAgent::initialize(const TextureInfo &info) {
    _type = info.type;
    _usage = info.usage;
    _format = info.format;
    _width = info.width;
    _height = info.height;
    _depth = info.depth;
    _layerCount = info.layerCount;
    _levelCount = info.levelCount;
    _samples = info.samples;
    _flags = info.flags;
    _size = FormatSize(_format, _width, _height, _depth);

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent*)_device)->getMessageQueue(),
        TextureInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

bool TextureAgent::initialize(const TextureViewInfo &info) {
    _isTextureView = true;

    if (!info.texture) {
        return false;
    }

    _type = info.texture->getType();
    _format = info.format;
    _baseLayer = info.baseLayer;
    _layerCount = info.layerCount;
    _baseLevel = info.baseLevel;
    _levelCount = info.levelCount;
    _usage = info.texture->getUsage();
    _width = info.texture->getWidth();
    _height = info.texture->getHeight();
    _depth = info.texture->getDepth();
    _samples = info.texture->getSamples();
    _flags = info.texture->getFlags();
    _size = FormatSize(_format, _width, _height, _depth);

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent*)_device)->getMessageQueue(),
        TextureViewInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

void TextureAgent::destroy() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        TextureDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

void TextureAgent::resize(uint width, uint height) {
    ENQUEUE_MESSAGE_3(
        ((DeviceAgent*)_device)->getMessageQueue(),
        TextureResize,
        actor, getActor(),
        width, width,
        height, height,
        {
            actor->resize(width, height);
        });
}

} // namespace gfx
} // namespace cc
