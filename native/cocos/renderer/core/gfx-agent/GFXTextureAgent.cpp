#include "CoreStd.h"

#include "threading/MessageQueue.h"
#include "GFXTextureAgent.h"
#include "GFXDeviceAgent.h"

namespace cc {
namespace gfx {

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
    if (_actor) {
        ENQUEUE_MESSAGE_1(
            ((DeviceAgent *)_device)->getMessageQueue(),
            TextureDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
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
