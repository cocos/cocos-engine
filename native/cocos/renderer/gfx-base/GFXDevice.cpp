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

#include "GFXDevice.h"
#include "GFXObject.h"
#include "base/memory/Memory.h"
#include "platform/BasePlatform.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"

namespace cc {
namespace gfx {

Device *Device::instance = nullptr;
bool Device::isSupportDetachDeviceThread = true;

Device *Device::getInstance() {
    return Device::instance;
}

Device::Device() {
    Device::instance = this;
    // Device instance is created and hold by TS. Native should hold it too
    // to make sure it exists after JavaScript virtual machine is destroyed.
    // Then will destroy the Device instance in native.
    addRef();
    _features.fill(false);
    _formatFeatures.fill(FormatFeature::NONE);
}

Device::~Device() {
    Device::instance = nullptr;
    CC_SAFE_RELEASE(_cmdBuff);
    CC_SAFE_RELEASE(_queue);
}

bool Device::initialize(const DeviceInfo &info) {
    _bindingMappingInfo = info.bindingMappingInfo;

#if CC_CPU_ARCH == CC_CPU_ARCH_32
    static_assert(sizeof(void *) == 4, "pointer size assumption broken");
#else
    static_assert(sizeof(void *) == 8, "pointer size assumption broken");
#endif

    bool result = doInit(info);

    CC_SAFE_ADD_REF(_cmdBuff);
    CC_SAFE_ADD_REF(_queue);
    return result;
}

void Device::destroy() {
    for (auto pair : _samplers) {
        CC_SAFE_DELETE(pair.second);
    }
    _samplers.clear();

    for (auto pair : _generalBarriers) {
        CC_SAFE_DELETE(pair.second);
    }
    _generalBarriers.clear();

    for (auto pair : _textureBarriers) {
        CC_SAFE_DELETE(pair.second);
    }
    _textureBarriers.clear();

    for (auto pair : _bufferBarriers) {
        CC_SAFE_DELETE(pair.second);
    }
    _bufferBarriers.clear();

    doDestroy();

    CC_SAFE_DELETE(_onAcquire);
}

Sampler *Device::getSampler(const SamplerInfo &info) {
    if (!_samplers.count(info)) {
        _samplers[info] = createSampler(info);
    }
    return _samplers[info];
}

GeneralBarrier *Device::getGeneralBarrier(const GeneralBarrierInfo &info) {
    if (!_generalBarriers.count(info)) {
        _generalBarriers[info] = createGeneralBarrier(info);
    }
    return _generalBarriers[info];
}

TextureBarrier *Device::getTextureBarrier(const TextureBarrierInfo &info) {
    if (!_textureBarriers.count(info)) {
        _textureBarriers[info] = createTextureBarrier(info);
    }
    return _textureBarriers[info];
}

BufferBarrier *Device::getBufferBarrier(const BufferBarrierInfo &info) {
    if (!_bufferBarriers.count(info)) {
        _bufferBarriers[info] = createBufferBarrier(info);
    }
    return _bufferBarriers[info];
}

DefaultResource::DefaultResource(Device *device) {
    uint32_t bufferSize = 64;
    ccstd::vector<uint8_t> buffer(bufferSize, 255);
    const uint8_t *bufferData = buffer.data();
    if (device->getCapabilities().maxTextureSize >= 2) {
        _texture2D = device->createTexture({TextureType::TEX2D, TextureUsageBit::STORAGE | TextureUsageBit::SAMPLED | TextureUsageBit::TRANSFER_DST,
                                            Format::RGBA8, 2, 2, TextureFlagBit::NONE});
        BufferTextureCopy region = {0, 0, 0, {0, 0, 0}, {2, 2, 1}, {0, 0, 1}};
        device->copyBuffersToTexture(&bufferData, _texture2D, &region, 1);
    }
    if (device->getCapabilities().maxTextureSize >= 2) {
        _textureCube = device->createTexture({TextureType::CUBE, TextureUsageBit::STORAGE | TextureUsageBit::SAMPLED | TextureUsageBit::TRANSFER_DST,
                                              Format::RGBA8, 2, 2, TextureFlagBit::NONE, 6});
        BufferTextureCopy region = {0, 0, 0, {0, 0, 0}, {2, 2, 1}, {0, 0, 1}};
        device->copyBuffersToTexture(&bufferData, _textureCube, &region, 1);
        region.texSubres.baseArrayLayer = 1;
        device->copyBuffersToTexture(&bufferData, _textureCube, &region, 1);
        region.texSubres.baseArrayLayer = 2;
        device->copyBuffersToTexture(&bufferData, _textureCube, &region, 1);
        region.texSubres.baseArrayLayer = 3;
        device->copyBuffersToTexture(&bufferData, _textureCube, &region, 1);
        region.texSubres.baseArrayLayer = 4;
        device->copyBuffersToTexture(&bufferData, _textureCube, &region, 1);
        region.texSubres.baseArrayLayer = 5;
        device->copyBuffersToTexture(&bufferData, _textureCube, &region, 1);
    }

    if (device->getCapabilities().max3DTextureSize >= 2) {
        _texture3D = device->createTexture({TextureType::TEX3D, TextureUsageBit::STORAGE | TextureUsageBit::SAMPLED | TextureUsageBit::TRANSFER_DST,
                                            Format::RGBA8, 2, 2, TextureFlagBit::NONE, 1, 1, SampleCount::X1, 2});
        BufferTextureCopy region = {0, 0, 0, {0, 0, 0}, {2, 2, 2}, {0, 0, 1}};
        device->copyBuffersToTexture(&bufferData, _texture3D, &region, 1);
    }
    if (device->getCapabilities().maxArrayTextureLayers >= 2) {
        _texture2DArray = device->createTexture({TextureType::TEX2D_ARRAY, TextureUsageBit::STORAGE | TextureUsageBit::SAMPLED | TextureUsageBit::TRANSFER_DST,
                                                 Format::RGBA8, 2, 2, TextureFlagBit::NONE, 2});
        BufferTextureCopy region = {0, 0, 0, {0, 0, 0}, {2, 2, 1}, {0, 0, 1}};
        device->copyBuffersToTexture(&bufferData, _texture2DArray, &region, 1);
        region.texSubres.baseArrayLayer = 1;
        device->copyBuffersToTexture(&bufferData, _texture2DArray, &region, 1);
    }
    {
        BufferInfo bufferInfo = {};
        bufferInfo.usage = BufferUsageBit::STORAGE | BufferUsageBit::TRANSFER_DST | BufferUsageBit::TRANSFER_SRC | BufferUsageBit::VERTEX | BufferUsageBit::INDEX | BufferUsageBit::INDIRECT;
        bufferInfo.memUsage = MemoryUsageBit::DEVICE | MemoryUsageBit::HOST;
        bufferInfo.size = 5 * sizeof(uint32_t); // for indirect command buffer
        bufferInfo.stride = bufferInfo.size;
        _buffer = device->createBuffer(bufferInfo);
    }
}

Texture *DefaultResource::getTexture(TextureType type) const {
    switch (type) {
        case TextureType::TEX2D:
            return _texture2D;
        case TextureType::CUBE:
            return _textureCube;
        case TextureType::TEX3D:
            return _texture3D;
        case TextureType::TEX2D_ARRAY:
            return _texture2DArray;
        default:
            CC_ABORT();
            return nullptr;
    }
}

Buffer *DefaultResource::getBuffer() const {
    return _buffer;
}

} // namespace gfx
} // namespace cc
