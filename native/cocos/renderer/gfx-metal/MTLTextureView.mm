#include "MTLStd.h"
#include "MTLTextureView.h"
#include "MTLTexture.h"
#include "MTLUtils.h"

NS_CC_BEGIN

CCMTLTextureView::CCMTLTextureView(GFXDevice* device) : GFXTextureView(device) {}
CCMTLTextureView::~CCMTLTextureView() { destroy(); }

bool CCMTLTextureView::Initialize(const GFXTextureViewInfo& info)
{
    texture_ = info.texture;
    type_ = info.type;
    format_ = info.format;
    base_level_ = info.base_level;
    level_count_ = info.level_count;
    base_layer_ = info.base_layer;
    layer_count_ = info.layer_count;
    
    NSRange levels = NSMakeRange(base_level_, level_count_);
    NSRange slics = NSMakeRange(base_layer_, layer_count_);
    auto ccmtlTexture = static_cast<CCMTLTexture*>(texture_);
    id<MTLTexture> mtlTexture = ccmtlTexture->getMTLTexture();
    _convertedFormat = ccmtlTexture->getConvertedFormat();
    _mtlTexture = [mtlTexture newTextureViewWithPixelFormat:mu::toMTLPixelFormat(_convertedFormat)
                                                textureType:mu::toMTLTextureType(type_)
                                                     levels:levels
                                                     slices:slics];
    
    return _mtlTexture != nil;
}

void CCMTLTextureView::destroy()
{
    if (_mtlTexture)
    {
        [_mtlTexture release];
        _mtlTexture = nil;
    }
}

NS_CC_END
