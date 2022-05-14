import { BaseObject, TextureAtlasData, TextureData } from '@cocos/dragonbones-js';
import { SpriteFrame } from '../2d';
import { TextureBase } from '../core/assets/texture-base';
import { ccclass } from '../core/data/decorators';
import { Rect } from '../core/math/rect';

/**
* @deprecated since v3.5.1, this is an engine private interface that will be removed in the future.
*/
@ccclass('dragonBones.CCTextureAtlasData')
export class CCTextureAtlasData extends TextureAtlasData {
    get renderTexture () {
        return this._renderTexture;
    }

    set renderTexture (value) {
        this._renderTexture = value;
        if (value) {
            for (const k in this.textures) {
                const textureData = this.textures[k] as CCTextureData;
                if (!textureData.spriteFrame) {
                    let rect: Rect | null = null;
                    if (textureData.rotated) {
                        rect = new Rect(textureData.region.x, textureData.region.y,
                            textureData.region.height, textureData.region.width);
                    } else {
                        rect = new Rect(textureData.region.x, textureData.region.y,
                            textureData.region.width, textureData.region.height);
                        // }
                        // const offset = new Vec2(0, 0);
                        // const size = new Size(rect.width, rect.height);
                        // setTexture(value, rect, false, offset, size);
                        textureData.spriteFrame = new SpriteFrame();
                        textureData.spriteFrame.texture = value;
                        textureData.spriteFrame.rect = rect;
                    }
                }
            }
        } else {
            for (const k in this.textures) {
                const textureData = this.textures[k] as CCTextureData;
                textureData.spriteFrame = null;
            }
        }
    }

    protected _renderTexture: TextureBase | null = null;

    static toString () {
        return '[class dragonBones.CCTextureAtlasData]';
    }

    createTexture () {
        return BaseObject.borrowObject(CCTextureData);
    }

    _onClear () {
        super._onClear();
        this.renderTexture = null;
    }
}

/**
* @deprecated since v3.5.1, this is an engine private interface that will be removed in the future.
*/
@ccclass('dragonBones.CCTextureData')
export class CCTextureData extends TextureData {
    spriteFrame: SpriteFrame | null = null

    static toString () {
        return '[class dragonBones.CCTextureData]';
    }

    _onClear () {
        super._onClear();
        this.spriteFrame = null;
    }
}
