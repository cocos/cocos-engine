/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

CCMTLContext::CCMTLContext(Device *device)
: Context(device) {
}

bool CCMTLContext::initialize(const ContextInfo &info) {
    _vsyncMode = info.vsyncMode;
    _windowHandle = info.windowHandle;
    auto *view = (MTKView *)static_cast<CCMTLDevice *>(_device)->getMTKView();
    _colorFmt = toFormat(view.colorPixelFormat);
    _depthStencilFmt = toFormat(view.depthStencilPixelFormat);

    return true;
}

} // namespace gfx
} // namespace cc
