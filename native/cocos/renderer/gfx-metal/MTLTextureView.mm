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
    _baseLevel = info.baseLevel;
    _levelCount = info.levelCount;
    _baseLayer = info.baseLayer;
    _layerCount = info.layerCount;
    
    if(!_texture)
    {
        CC_LOG_ERROR("CCMTLTextureView: GFXTexture should not be nullptr");
        _status = GFXStatus::FAILED;
        return false;
    }
    
    NSRange levels = NSMakeRange(_baseLevel, _levelCount);
    NSRange slics = NSMakeRange(_baseLayer, _layerCount);
    auto ccmtlTexture = static_cast<CCMTLTexture*>(_texture);
    id<MTLTexture> mtlTexture = ccmtlTexture->getMTLTexture();
    _convertedFormat = ccmtlTexture->getConvertedFormat();
    _mtlTexture = [mtlTexture newTextureViewWithPixelFormat:mu::toMTLPixelFormat(_convertedFormat)
                                                textureType:mu::toMTLTextureType(_type)
                                                     levels:levels
                                                     slices:slics];
    
    _status = GFXStatus::SUCCESS;
    
    return _mtlTexture != nil;
}

void CCMTLTextureView::destroy()
{
    if (_mtlTexture)
    {
        [_mtlTexture release];
        _mtlTexture = nil;
    }
    _status = GFXStatus::UNREADY;
}

NS_CC_END
