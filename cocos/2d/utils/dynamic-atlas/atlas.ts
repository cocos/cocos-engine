/**
 * @packageDocumentation
 */

import { PixelFormat } from '../../../core/assets/asset-enum';
import { ImageAsset } from '../../../core/assets/image-asset';
import { Texture2D } from '../../../core/assets/texture-2d';
import { BufferTextureCopy } from '../../../core/gfx';
import { legacyCC } from '../../../core/global-exports';
import { SpriteFrame } from '../../assets/sprite-frame';

const space = 2;

export class Atlas {
    private _texture: DynamicAtlasTexture;
    private _width: any;
    private _height: any;
    private _x: number;
    private _y: number;
    private _nexty: number;
    private _innerTextureInfos = {};
    private _innerSpriteFrames: SpriteFrame[];
    private _count: number;

    constructor (width, height) {
        const texture = new DynamicAtlasTexture();
        texture.initWithSize(width, height);
        this._texture = texture;

        this._width = width;
        this._height = height;

        this._x = space;
        this._y = space;
        this._nexty = space;

        this._innerTextureInfos = {};
        this._innerSpriteFrames = [];

        this._count = 0;
    }

    /**
     * @en
     * Append a sprite frame into the dynamic atlas.
     *
     * @zh
     * 添加碎图进入动态图集。
     *
     * @method insertSpriteFrame
     * @param spriteFrame  the sprite frame that will be inserted in the atlas.
     */
    public insertSpriteFrame (spriteFrame: SpriteFrame) {
        const rect = spriteFrame.rect;
        // Todo:No renderTexture
        const texture = spriteFrame.texture as Texture2D;
        const info = this._innerTextureInfos[texture.getId()];

        let sx = rect.x;
        let sy = rect.y;

        if (info) {
            sx += info.x;
            sy += info.y;
        } else {
            const width = texture.width;
            const height = texture.height;

            if ((this._x + width + space) > this._width) {
                this._x = space;
                this._y = this._nexty;
            }

            if ((this._y + height + space) > this._nexty) {
                this._nexty = this._y + height + space;
            }

            if (this._nexty > this._height) {
                return null;
            }

            if (legacyCC.internal.dynamicAtlasManager.textureBleeding) {
                // Smaller frame is more likely to be affected by linear filter
                if (width <= 8 || height <= 8) {
                    this._texture.drawTextureAt(texture.image!, this._x - 1, this._y - 1);
                    this._texture.drawTextureAt(texture.image!, this._x - 1, this._y + 1);
                    this._texture.drawTextureAt(texture.image!, this._x + 1, this._y - 1);
                    this._texture.drawTextureAt(texture.image!, this._x + 1, this._y + 1);
                }

                this._texture.drawTextureAt(texture.image!, this._x - 1, this._y);
                this._texture.drawTextureAt(texture.image!, this._x + 1, this._y);
                this._texture.drawTextureAt(texture.image!, this._x, this._y - 1);
                this._texture.drawTextureAt(texture.image!, this._x, this._y + 1);
            }

            this._texture.drawTextureAt(texture.image!, this._x, this._y);

            this._innerTextureInfos[texture.getId()] = {
                x: this._x,
                y: this._y,
                texture,
            };

            this._count++;

            sx += this._x;
            sy += this._y;

            this._x += width + space;
        }

        const frame = {
            x: sx,
            y: sy,
            texture: this._texture,
        };

        this._innerSpriteFrames.push(spriteFrame);

        return frame;
    }

    /**
     * @en
     * Delete a texture from the atlas.
     *
     * @zh
     * 从动态图集中删除某张纹理。
     *
     * @method deleteAtlasTexture
     * @param texture  the texture that will be removed from the atlas.
     */
    public deleteInnerTexture (texture: Texture2D) {
        if (texture && this._innerTextureInfos[texture.getId()]) {
            delete this._innerTextureInfos[texture.getId()];
            this._count--;
        }
    }

    /**
     * @en
     * Whether the atlas is empty.
     *
     * @zh
     * 图集是否为空图集。
     *
     * @method isEmpty
     */
    public isEmpty () {
        return this._count <= 0;
    }

    /**
     * @en
     * Reset the dynamic atlas.
     *
     * @zh
     * 重置该动态图集。
     *
     * @method reset
    */
    public reset () {
        this._x = space;
        this._y = space;
        this._nexty = space;

        const frames = this._innerSpriteFrames;
        for (let i = 0, l = frames.length; i < l; i++) {
            const frame = frames[i];
            if (!frame.isValid) {
                continue;
            }
            frame._resetDynamicAtlasFrame();
        }
        this._innerSpriteFrames.length = 0;
        this._innerTextureInfos = {};
    }

    /**
     * @en
     * Reset the dynamic atlas, and destroy the texture of the atlas.
     *
     * @zh
     * 重置该动态图集，并销毁该图集的纹理。
     *
     * @method destroy
    */
    public destroy () {
        this.reset();
        this._texture.destroy();
    }
}

export class DynamicAtlasTexture extends Texture2D {
    /**
     * @en
     * Initialize the render texture.
     *
     * @zh
     * 初始化 render texture。
     *
     * @method initWithSize
     */
    public initWithSize (width: number, height: number, format: number = PixelFormat.RGBA8888) {
        this.reset({
            width,
            height,
            format,
        });
    }

    /**
     * @en
     * Draw a texture to the specified position.
     *
     * @zh
     * 将指定的图片渲染到指定的位置上。
     *
     * @method drawTextureAt
     * @param {Texture2D} image
     * @param {Number} x
     * @param {Number} y
     */
    public drawTextureAt (image: ImageAsset, x: number, y: number) {
        const gfxTexture = this.getGFXTexture();
        if (!image || !gfxTexture) {
            return;
        }

        const gfxDevice = this._getGFXDevice();
        if (!gfxDevice) {
            console.warn('Unable to get device');
            return;
        }

        const region = new BufferTextureCopy();
        region.texOffset.x = x;
        region.texOffset.y = y;
        region.texExtent.width = image.width;
        region.texExtent.height = image.height;
        gfxDevice.copyTexImagesToTexture([image.data as HTMLCanvasElement], gfxTexture, [region]);
    }
}
