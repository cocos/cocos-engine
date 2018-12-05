/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
#ifndef DRAGONBONES_CC_TEXTUREATLAS_DATA_H
#define DRAGONBONES_CC_TEXTUREATLAS_DATA_H

#include "dragonbones/DragonBonesHeaders.h"
#include "cocos2d.h"
#include "middleware-adapter.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * The Cocos2d texture atlas data.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * Cocos2d 贴图集数据。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class CCTextureAtlasData : public TextureAtlasData
{
    BIND_CLASS_TYPE_B(CCTextureAtlasData);

private:
    cocos2d::middleware::Texture2D* _renderTexture;

public:
    CCTextureAtlasData() :
        _renderTexture(nullptr)
    {
        _onClear();
    }
    virtual ~CCTextureAtlasData()
    {
        _onClear();
    }

protected:
    virtual void _onClear() override;

public:
    /**
     * @inheritDoc
     */
    virtual TextureData* createTexture() const override;
    /**
     * The Cocos2d texture.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * Cocos2d 贴图。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline cocos2d::middleware::Texture2D* getRenderTexture() const
    {
        return _renderTexture;
    }
    void setRenderTexture(cocos2d::middleware::Texture2D* value);
};
/**
 * @internal
 */
class CCTextureData : public TextureData
{
    BIND_CLASS_TYPE_B(CCTextureData);

public:
    cocos2d::middleware::SpriteFrame* spriteFrame;

    CCTextureData() :
        spriteFrame(nullptr)
    {
        _onClear();
    }
    virtual ~CCTextureData()
    {
        _onClear();
    }

protected:
    virtual void _onClear() override;
};
DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_CC_TEXTUREATLAS_DATA_H
