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

#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLGPUObjects.h"
#include "MTLTexture.h"
#include "MTLUtils.h"

namespace cc {
namespace gfx {

CCMTLTexture::CCMTLTexture() : Texture() {
    _typedID = generateObjectID<decltype(this)>();
}

void CCMTLTexture::doInit(const TextureInfo &info) {
    _isArray = _type == TextureType::TEX1D_ARRAY || _type == TextureType::TEX2D_ARRAY;
    if (_format == Format::PVRTC_RGB2 ||
        _format == Format::PVRTC_RGBA2 ||
        _format == Format::PVRTC_RGB4 ||
        _format == Format::PVRTC_RGBA4 ||
        _format == Format::PVRTC2_2BPP ||
        _format == Format::PVRTC2_4BPP) {
        _isPVRTC = true;
    }

    if (!createMTLTexture()) {
        CC_LOG_ERROR("CCMTLTexture: create MTLTexture failed.");
        return;
    }

    CCMTLDevice::getInstance()->getMemoryStatus().textureSize += _size;
}

void CCMTLTexture::doInit(const TextureViewInfo &info) {
    _isArray = _type == TextureType::TEX1D_ARRAY || _type == TextureType::TEX2D_ARRAY;
    if (_format == Format::PVRTC_RGB2 ||
        _format == Format::PVRTC_RGBA2 ||
        _format == Format::PVRTC_RGB4 ||
        _format == Format::PVRTC_RGBA4 ||
        _format == Format::PVRTC2_2BPP ||
        _format == Format::PVRTC2_4BPP) {
        _isPVRTC = true;
    }
    _convertedFormat = mu::convertGFXPixelFormat(_format);
    auto mtlTextureType = mu::toMTLTextureType(_type);
    _mtlTexture = [id<MTLTexture>(info.texture) newTextureViewWithPixelFormat:mu::toMTLPixelFormat(_convertedFormat)
                                                                  textureType:mtlTextureType
                                                                       levels:NSMakeRange(info.baseLevel, info.levelCount)
                                                                       slices:NSMakeRange(info.baseLayer, info.layerCount)];
}

bool CCMTLTexture::createMTLTexture() {
    if (_width == 0 || _height == 0) {
        CC_LOG_ERROR("CCMTLTexture: width or height should not be zero.");
        return false;
    }
    _convertedFormat = mu::convertGFXPixelFormat(_format);
    MTLPixelFormat mtlFormat = mu::toMTLPixelFormat(_convertedFormat);
    if (mtlFormat == MTLPixelFormatInvalid)
        return false;

    MTLTextureDescriptor *descriptor = nullptr;
    auto mtlTextureType = mu::toMTLTextureType(_type);
    switch (mtlTextureType) {
        case MTLTextureType2D:
        case MTLTextureType2DArray:
            // No need to set mipmapped flag since mipmapLevelCount was explicty set via `_levelCount`.
            descriptor = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:mtlFormat
                                                                            width:_width
                                                                           height:_height
                                                                        mipmapped:NO];
            break;
        case MTLTextureTypeCube:
            descriptor = [MTLTextureDescriptor textureCubeDescriptorWithPixelFormat:mtlFormat
                                                                               size:_width
                                                                          mipmapped:NO];
            break;
        default:
            CCASSERT(false, "Unsupported MTLTextureType, create MTLTextureDescriptor failed.");
            break;
    }

    if (descriptor == nullptr)
        return false;

    descriptor.usage = mu::toMTLTextureUsage(_usage);
    descriptor.textureType = mu::toMTLTextureType(_type);
    // ongoing: MSAA for metal
    descriptor.sampleCount = mu::toMTLSampleCount(SampleCount::X1);
    descriptor.mipmapLevelCount = _levelCount;
    descriptor.arrayLength = _type == TextureType::CUBE ? 1 : _layerCount;
    if (hasFlag(_usage, TextureUsage::COLOR_ATTACHMENT) ||
        hasFlag(_usage, TextureUsage::DEPTH_STENCIL_ATTACHMENT) ||
        hasFlag(_usage, TextureUsage::INPUT_ATTACHMENT)) {
        descriptor.resourceOptions = MTLResourceStorageModePrivate;
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    _mtlTexture = [mtlDevice newTextureWithDescriptor:descriptor];

    return _mtlTexture != nil;
}

void CCMTLTexture::doDestroy() {
    if (_isTextureView) {
        return;
    }

    CCMTLDevice::getInstance()->getMemoryStatus().textureSize -= _size;

    id<MTLTexture> mtlTexure = _mtlTexture;
    _mtlTexture = nil;

    std::function<void(void)> destroyFunc = [=]() {
        if (mtlTexure) {
            [mtlTexure setPurgeableState:MTLPurgeableStateEmpty];
            [mtlTexure release];
        }
    };
    //gpu object only
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

void CCMTLTexture::doResize(uint width, uint height, uint size) {
    auto oldSize = _size;
    auto oldWidth = _width;
    auto oldHeight = _height;
    id<MTLTexture> oldMTLTexture = _mtlTexture;

    _width = width;
    _height = height;
    _size = size;
    if (!createMTLTexture()) {
        _width = oldWidth;
        _height = oldHeight;
        _size = oldSize;
        _mtlTexture = oldMTLTexture;
        CC_LOG_ERROR("CCMTLTexture: create MTLTexture failed when try to resize the texture.");
        return;
    }

    CCMTLDevice::getInstance()->getMemoryStatus().textureSize += size;

    if (oldMTLTexture) {
        std::function<void(void)> destroyFunc = [=]() {
            if (oldMTLTexture) {
                [oldMTLTexture setPurgeableState:MTLPurgeableStateEmpty];
                [oldMTLTexture release];
            }
        };
        //gpu object only
        CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
        CCMTLDevice::getInstance()->getMemoryStatus().textureSize -= oldSize;
    }
}

} // namespace gfx
} // namespace cc
