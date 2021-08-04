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

#include "MTLContext.h"
#include "MTLDevice.h"

#import <MetalKit/MTKView.h>

namespace cc {
namespace gfx {

namespace {
Format toFormat(MTLPixelFormat format) {
    switch (format) {
        case MTLPixelFormatRGBA8Unorm: return Format::RGBA8;
        case MTLPixelFormatBGRA8Unorm: return Format::BGRA8;
#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
        case MTLPixelFormatDepth24Unorm_Stencil8: return Format::D24S8;
#endif
        case MTLPixelFormatDepth32Float_Stencil8: return Format::D32F_S8;
        default:
            CC_LOG_ERROR("invalid MTLPixelFormat.");
            return Format::UNKNOWN;
    }
}
}

CCMTLContext::CCMTLContext()
: Context() {
}

bool CCMTLContext::doInit(const ContextInfo &info) {
    _vsyncMode = info.vsyncMode;
    _windowHandle = info.windowHandle;

    CCMTLDevice *device = CCMTLDevice::getInstance();
    CAMetalLayer *layer = (CAMetalLayer *)device->getMTLLayer();
    _colorFmt = toFormat(layer.pixelFormat);
    id<MTLTexture> dsTex = (id<MTLTexture>)device->getDSTexture();
    _depthStencilFmt = toFormat(dsTex.pixelFormat);

    return true;
}

} // namespace gfx
} // namespace cc
