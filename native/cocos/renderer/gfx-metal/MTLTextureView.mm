#include "MTLStd.h"
#include "MTLTextureView.h"
#include "MTLTexture.h"
#include "MTLUtils.h"

NS_CC_BEGIN

CCMTLTextureView::CCMTLTextureView(GFXDevice* device) : GFXTextureView(device) {}
CCMTLTextureView::~CCMTLTextureView() { destroy(); }

bool CCMTLTextureView::initialize(const GFXTextureViewInfo& info)
{
    _texture = info.texture;
    _type = info.type;
    _format = info.format;
    _baseLevel = info.base_level;
    _levelCount = info.level_count;
    _baseLayer = info.base_layer;
    _layerCount = info.layer_count;
    
    NSRange levels = NSMakeRange(_baseLevel, _levelCount);
    NSRange slics = NSMakeRange(_baseLayer, _layerCount);
    auto ccmtlTexture = static_cast<CCMTLTexture*>(_texture);
    id<MTLTexture> mtlTexture = ccmtlTexture->getMTLTexture();
    _convertedFormat = ccmtlTexture->getConvertedFormat();
    _mtlTexture = [mtlTexture newTextureViewWithPixelFormat:mu::toMTLPixelFormat(_convertedFormat)
                                                textureType:mu::toMTLTextureType(_type)
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
