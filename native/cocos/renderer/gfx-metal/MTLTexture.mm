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

#import "MTLStd.h"

#import "MTLDevice.h"
#import "MTLGPUObjects.h"
#import "MTLTexture.h"
#import "MTLUtils.h"
#import "MTLSwapchain.h"
#import <CoreVideo/CVPixelBuffer.h>
#import <CoreVideo/CVMetalTexture.h>
#import <CoreVideo/CVMetalTextureCache.h>

// deferred testcase 'camera'
#define MEMLESS_ON 0

namespace cc {
namespace gfx {

namespace {
CCMTLTexture* defaultTexture = nullptr;
}

CCMTLTexture::CCMTLTexture() : Texture() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLTexture::~CCMTLTexture() {
    destroy();
}

void CCMTLTexture::doInit(const TextureInfo &info) {
    _isArray = _info.type == TextureType::TEX1D_ARRAY || info.type == TextureType::TEX2D_ARRAY;
    if (_info.format == Format::PVRTC_RGB2 ||
        _info.format == Format::PVRTC_RGBA2 ||
        _info.format == Format::PVRTC_RGB4 ||
        _info.format == Format::PVRTC_RGBA4 ||
        _info.format == Format::PVRTC2_2BPP ||
        _info.format == Format::PVRTC2_4BPP) {
        _isPVRTC = true;
    }

    if(_info.externalRes) {
        auto pixelBuffer = static_cast<CVPixelBufferRef>(_info.externalRes);
        size_t width = CVPixelBufferGetWidth(pixelBuffer);
        size_t height = CVPixelBufferGetHeight(pixelBuffer);

        CVReturn cvret;
        CVMetalTextureCacheRef CVMTLTextureCache;
        cvret = CVMetalTextureCacheCreate(
                        kCFAllocatorDefault,
                        nil,
                        (id<MTLDevice>)CCMTLDevice::getInstance()->getMTLDevice(),
                        nil,
                        &CVMTLTextureCache);

        CCASSERT(cvret == kCVReturnSuccess, @"Failed to create Metal texture cache");

        _convertedFormat = mu::convertGFXPixelFormat(_info.format);
        MTLPixelFormat mtlFormat = mu::toMTLPixelFormat(_convertedFormat);
        CVMetalTextureRef CVMTLTexture;
        cvret = CVMetalTextureCacheCreateTextureFromImage(
                        kCFAllocatorDefault,
                        CVMTLTextureCache,
                        pixelBuffer, nil,
                        mtlFormat,
                        width, height,
                        0,
                        &CVMTLTexture);

        CCASSERT(cvret == kCVReturnSuccess, @"Failed to create CoreVideo Metal texture from image");

        _mtlTexture = CVMetalTextureGetTexture(CVMTLTexture);
        CFRelease(CVMTLTexture);
        CFRelease(CVMTLTextureCache);

        CCASSERT(_mtlTexture, @"Failed to create Metal texture CoreVideo Metal Texture");
    }

    if (!createMTLTexture()) {
        CC_LOG_ERROR("CCMTLTexture: create MTLTexture failed.");
        return;
    }

    CCMTLDevice::getInstance()->getMemoryStatus().textureSize += _size;
}

void CCMTLTexture::doInit(const TextureViewInfo &info) {
    _isArray = info.type == TextureType::TEX1D_ARRAY || _viewInfo.type == TextureType::TEX2D_ARRAY;
    if (_viewInfo.format == Format::PVRTC_RGB2 ||
        _viewInfo.format == Format::PVRTC_RGBA2 ||
        _viewInfo.format == Format::PVRTC_RGB4 ||
        _viewInfo.format == Format::PVRTC_RGBA4 ||
        _viewInfo.format == Format::PVRTC2_2BPP ||
        _viewInfo.format == Format::PVRTC2_4BPP) {
        _isPVRTC = true;
    }
    _convertedFormat = mu::convertGFXPixelFormat(_viewInfo.format);
    auto mtlTextureType = mu::toMTLTextureType(_viewInfo.type);
    _mtlTextureView = [id<MTLTexture>(_viewInfo.texture) newTextureViewWithPixelFormat:mu::toMTLPixelFormat(_convertedFormat)
                                                                                         textureType:mtlTextureType
                                                                                              levels:NSMakeRange(_viewInfo.baseLevel, _viewInfo.levelCount)
                                                                                              slices:NSMakeRange(_viewInfo.baseLayer, _viewInfo.layerCount)];
}

void CCMTLTexture::doInit(const SwapchainTextureInfo &info) {
    _swapchain = info.swapchain;
    if (info.format == Format::DEPTH_STENCIL) {
        createMTLTexture();
    } else {
        _mtlTexture = [static_cast<CCMTLSwapchain*>(_swapchain)->currentDrawable() texture];
    }
}

void CCMTLTexture::update() {
    if(_swapchain) {
        id<CAMetalDrawable> drawable = static_cast<CCMTLSwapchain*>(_swapchain)->currentDrawable();
        _mtlTexture = drawable ? [drawable texture] : nil;
    }
}

bool CCMTLTexture::createMTLTexture() {
    if (_info.width == 0 || _info.height == 0) {
        CC_LOG_ERROR("CCMTLTexture: width or height should not be zero.");
        return false;
    }
    _convertedFormat = mu::convertGFXPixelFormat(_info.format);
    MTLPixelFormat mtlFormat = mu::toMTLPixelFormat(_convertedFormat);
    if (mtlFormat == MTLPixelFormatInvalid)
        return false;

    MTLTextureDescriptor *descriptor = nullptr;
    auto mtlTextureType = mu::toMTLTextureType(_info.type);
    switch (mtlTextureType) {
        case MTLTextureType2D:
        case MTLTextureType2DArray:
            // No need to set mipmapped flag since mipmapLevelCount was explicty set via `_levelCount`.
            descriptor = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:mtlFormat
                                                                            width:_info.width
                                                                           height:_info.height
                                                                        mipmapped:NO];
            break;
        case MTLTextureTypeCube:
            descriptor = [MTLTextureDescriptor textureCubeDescriptorWithPixelFormat:mtlFormat
                                                                               size:_info.width
                                                                          mipmapped:NO];
            break;
        default:
            CCASSERT(false, "Unsupported MTLTextureType, create MTLTextureDescriptor failed.");
            break;
    }

    if (descriptor == nullptr)
        return false;

    descriptor.usage = mu::toMTLTextureUsage(_info.usage);
    descriptor.sampleCount = mu::toMTLSampleCount(_info.samples);
    descriptor.textureType = descriptor.sampleCount > 1 ? MTLTextureType2DMultisample : mu::toMTLTextureType(_info.type);
    descriptor.mipmapLevelCount = _info.levelCount;
    descriptor.arrayLength = _info.type == TextureType::CUBE ? 1 : _info.layerCount;

    if(hasAllFlags(TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT, _info.usage) && mu::isImageBlockSupported()) {
#if MEMLESS_ON
        // mac SDK mem_less unavailable before 11.0
#if MAC_MEMORY_LESS_TEXTURE_SUPPORT || CC_PLATFORM == CC_PLATFORM_MAC_IOS
        //xcode OS version warning
        if (@available(macOS 11.0, *)) {
            descriptor.storageMode = MTLStorageModeMemoryless;
        } else {
            descriptor.storageMode = MTLStorageModePrivate;
        }
#else
        descriptor.storageMode = MTLStorageModePrivate;
#endif
#else
        descriptor.storageMode = MTLStorageModePrivate;
#endif
    } else if (hasFlag(_info.usage, TextureUsage::COLOR_ATTACHMENT) || hasFlag(_info.usage, TextureUsage::DEPTH_STENCIL_ATTACHMENT) || hasFlag(_info.usage, TextureUsage::INPUT_ATTACHMENT)) {
        descriptor.storageMode = MTLStorageModePrivate;
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    _mtlTexture = [mtlDevice newTextureWithDescriptor:descriptor];

    return _mtlTexture != nil;
}

CCMTLSwapchain* CCMTLTexture::swapChain() {
    return static_cast<CCMTLSwapchain*>(_swapchain);
}

const TextureInfo& CCMTLTexture::textureInfo() {
    return _isTextureView ?
     static_cast<CCMTLTexture*>(_viewInfo.texture)->_info :
        _info;
}

void CCMTLTexture::doDestroy() {
    if(_swapchain) {
        _swapchain = nullptr;
        _mtlTexture = nil;
        return;
    }

    id<MTLTexture> mtlTexure =  nil;
    if(_isTextureView) {
        mtlTexure = _mtlTextureView;
        _mtlTextureView = nil;
    } else {
        mtlTexure = _mtlTexture;
        _mtlTexture = nil;
    }

    CCMTLDevice::getInstance()->getMemoryStatus().textureSize -= _size;

    std::function<void(void)> destroyFunc = [mtlTexure]() {
        if (mtlTexure) {
            //TODO_Zeqiang: [mac12 | ios15, ...) validate here
//            [mtlTexure setPurgeableState:MTLPurgeableStateEmpty];
            [mtlTexure release];
        }
    };
    //gpu object only
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

void CCMTLTexture::doResize(uint width, uint height, uint size) {
    if(_isTextureView) {
        CC_LOG_ERROR("TextureView does not support resize! at %p", this);
        return;
    }
    auto oldSize = _size;
    auto oldWidth = _info.width;
    auto oldHeight = _info.height;

    id<MTLTexture> oldMTLTexture = _mtlTexture;

    _info.width = width;
    _info.height = height;
    _size = size;
    if (!createMTLTexture()) {
        _info.width = oldWidth;
        _info.height = oldHeight;
        _size = oldSize;
        _mtlTexture = oldMTLTexture;
        CC_LOG_ERROR("CCMTLTexture: create MTLTexture failed when try to resize the texture.");
        return;
    }
    
    // texture is a wrapper of drawable when _swapchain is active, drawable is not a resource alloc by gfx,
    // but the system so skip here.
    if(!_swapchain) {
        CCMTLDevice::getInstance()->getMemoryStatus().textureSize -= oldSize;
        CCMTLDevice::getInstance()->getMemoryStatus().textureSize += size;
    }
    
    if (oldMTLTexture) {
        std::function<void(void)> destroyFunc = [=]() {
            if (oldMTLTexture) {
                //TODO_Zeqiang: [mac12 | ios15, ...) validate here
//                [oldMTLTexture setPurgeableState:MTLPurgeableStateEmpty];
                [oldMTLTexture release];
            }
        };
        //gpu object only
        CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
    }
}

CCMTLTexture* CCMTLTexture::getDefaultTexture() {
    if(!defaultTexture) {
        TextureInfo info;
        info.type = TextureType::TEX2D;
        info.usage = TextureUsage::SAMPLED;
        info.format = Format::BGRA8;
        info.width = 2;
        info.height = 2;
        
        defaultTexture = new CCMTLTexture();
        defaultTexture->initialize(info);
    }
    return defaultTexture;
}

void CCMTLTexture::deleteDefaultTexture(){
    if (defaultTexture) {
        delete defaultTexture;
        defaultTexture = nullptr;
    }
}


} // namespace gfx
} // namespace cc