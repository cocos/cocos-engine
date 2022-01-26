/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2020 DragonBones team and other contributors
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

#include "dragonbones-creator-support/CCTextureAtlasData.h"

using namespace cc;

DRAGONBONES_NAMESPACE_BEGIN

void CCTextureAtlasData::_onClear() {
    TextureAtlasData::_onClear();

    if (_renderTexture != nullptr) {
        _renderTexture->release();
        _renderTexture = nullptr;
    }
}

TextureData *CCTextureAtlasData::createTexture() const {
    return (TextureData *)BaseObject::borrowObject<CCTextureData>();
}

void CCTextureAtlasData::setRenderTexture(middleware::Texture2D *value) {
    if (_renderTexture == value) {
        return;
    }

    _renderTexture = value;

    if (_renderTexture != nullptr) {
        _renderTexture->addRef();

        for (const auto &pair : textures) {
            const auto textureData = static_cast<CCTextureData *>(pair.second);

            if (textureData->spriteFrame == nullptr) {
                cc::Rect rect(
                    textureData->region.x, textureData->region.y,
                    textureData->rotated ? textureData->region.height : textureData->region.width,
                    textureData->rotated ? textureData->region.width : textureData->region.height);
                cc::Vec2 offset(0.0f, 0.0f);
                cc::Size originSize(rect.size.width, rect.size.height);
                textureData->spriteFrame = middleware::SpriteFrame::createWithTexture(_renderTexture, rect, textureData->rotated, offset, originSize); // TODO multiply textureAtlas
                textureData->spriteFrame->addRef();
            }
        }
    } else {
        for (const auto &pair : textures) {
            const auto textureData = static_cast<CCTextureData *>(pair.second);

            if (textureData->spriteFrame != nullptr) {
                textureData->spriteFrame->release();
                textureData->spriteFrame = nullptr;
            }
        }
    }
}

void CCTextureData::_onClear() {
    TextureData::_onClear();

    if (spriteFrame != nullptr) {
        spriteFrame->release();
        spriteFrame = nullptr;
    }
}

DRAGONBONES_NAMESPACE_END
