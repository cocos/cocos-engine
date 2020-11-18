#include "CoreStd.h"
#include "GFXTextureProxy.h"
#include "GFXDeviceProxy.h"

namespace cc {
namespace gfx {

bool TextureProxy::initialize(const TextureInfo &info) {
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

    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        TextureInit,
        remote, GetRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

bool TextureProxy::initialize(const TextureViewInfo &info) {
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

    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        TextureViewInit,
        remote, GetRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

void TextureProxy::destroy() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        TextureDestroy,
        remote, GetRemote(),
        {
            remote->destroy();
        });
}

void TextureProxy::resize(uint width, uint height) {
    ENCODE_COMMAND_3(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        TextureResize,
        remote, GetRemote(),
        width, width,
        height, height,
        {
            remote->resize(width, height);
        });
}

} // namespace gfx
} // namespace cc
