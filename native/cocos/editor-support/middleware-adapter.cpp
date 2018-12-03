/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
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
#include "middleware-adapter.h"
#include "base/ccMacros.h"

MIDDLEWARE_BEGIN

Texture2D::Texture2D()
{
    
}

Texture2D::~Texture2D()
{
    
}

int Texture2D::getPixelsWide() const
{
    return _pixelsWide;
}

int Texture2D::getPixelsHigh() const
{
    return _pixelsHigh;
}

void Texture2D::setPixelsWide(int wide)
{
    this->_pixelsWide = wide;
}

void Texture2D::setPixelsHigh(int high)
{
    this->_pixelsHigh = high;
}

int Texture2D::getRealTextureIndex() const
{
    return this->_realTextureIndex;
}

void Texture2D::setRealTextureIndex(int textureIndex)
{
    this->_realTextureIndex = textureIndex;
}

void Texture2D::setTexParamCallback(const texParamCallback& callback)
{
    this->_texParamCallback = callback;
}

void Texture2D::setTexParameters(const TexParams& texParams)
{
    if (_texParamCallback)
    {
        _texParamCallback(this->_realTextureIndex,texParams.minFilter,texParams.magFilter,texParams.wrapS,texParams.wrapT);
    }
}

SpriteFrame* SpriteFrame::createWithTexture(Texture2D *texture, const cocos2d::Rect& rect)
{
    SpriteFrame *spriteFrame = new (std::nothrow) SpriteFrame();
    spriteFrame->initWithTexture(texture, rect);
    spriteFrame->autorelease();
    
    return spriteFrame;
}

SpriteFrame* SpriteFrame::createWithTexture(Texture2D* texture, const cocos2d::Rect& rect, bool rotated, const cocos2d::Vec2& offset, const cocos2d::Size& originalSize)
{
    SpriteFrame *spriteFrame = new (std::nothrow) SpriteFrame();
    spriteFrame->initWithTexture(texture, rect, rotated, offset, originalSize);
    spriteFrame->autorelease();
    
    return spriteFrame;
}

bool SpriteFrame::initWithTexture(Texture2D* texture, const cocos2d::Rect& rect)
{
    return initWithTexture(texture, rect, false, cocos2d::Vec2::ZERO, rect.size);
}

bool SpriteFrame::initWithTexture(Texture2D* texture, const cocos2d::Rect& rect, bool rotated, const cocos2d::Vec2& offset, const cocos2d::Size& originalSize)
{
    _texture = texture;
    
    if (texture)
    {
        texture->retain();
    }
    
    _rectInPixels = rect;
    _offsetInPixels = offset;
    _originalSizeInPixels = originalSize;
    _rotated = rotated;
    _anchorPoint = cocos2d::Vec2(NAN, NAN);
    
    return true;
}

SpriteFrame::SpriteFrame()
{
    
}

SpriteFrame::~SpriteFrame()
{
    CC_SAFE_RELEASE(_texture);
}

void SpriteFrame::setTexture(Texture2D * texture)
{
    if( _texture != texture )
    {
        CC_SAFE_RELEASE(_texture);
        CC_SAFE_RETAIN(texture);
        _texture = texture;
    }
}

Texture2D* SpriteFrame::getTexture()
{
    return _texture;
}

MIDDLEWARE_END
