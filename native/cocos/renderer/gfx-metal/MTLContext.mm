#include "MTLStd.h"

#include "MTLContext.h"
#include "MTLDevice.h"


#import <MetalKit/MTKView.h>

NS_CC_BEGIN
namespace {
GFXFormat toGFXFormat(MTLPixelFormat format) {
    switch (format) {
        case MTLPixelFormatRGBA8Unorm: return GFXFormat::RGBA8;
        case MTLPixelFormatBGRA8Unorm: return GFXFormat::BGRA8;
        case MTLPixelFormatDepth24Unorm_Stencil8: return GFXFormat::D24S8;
        case MTLPixelFormatDepth32Float_Stencil8: return GFXFormat::D32F_S8;
        default:
            CC_LOG_ERROR("invalid MTLPixelFormat.");
            return GFXFormat::UNKNOWN;
    }
}
}

CCMTLContext::CCMTLContext(GFXDevice *device)
: GFXContext(device) {
}

CCMTLContext::~CCMTLContext() {
}

bool CCMTLContext::initialize(const GFXContextInfo &info) {
    _vsyncMode = info.vsyncMode;
    _windowHandle = info.windowHandle;
    MTKView *view = (MTKView *)((CCMTLDevice *)_device)->getMTKView();
    _colorFmt = toGFXFormat(view.colorPixelFormat);
    _depthStencilFmt = toGFXFormat(view.depthStencilPixelFormat);

    return true;
}

NS_CC_END
