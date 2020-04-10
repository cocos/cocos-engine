/**
 * @category gfx
 */

import { GFXFormat, GFXObject, GFXObjectType, GFXTextureViewType, GFXStatus } from './define';
import { GFXDevice } from './device';
import { GFXTexture } from './texture';

export interface IGFXTextureViewInfo {
    texture: GFXTexture;
    type: GFXTextureViewType;
    format: GFXFormat;
    baseLevel?: number;
    levelCount?: number;
    baseLayer?: number;
    layerCount?: number;
}

/**
 * @en GFX texture view.
 * @zh GFX 纹理视图。
 */
export abstract class GFXTextureView extends GFXObject {

    /**
     * @en Get current texture.
     * @zh GFX 纹理。
     */
    public get texture (): GFXTexture {
        return  this._texture as GFXTexture;
    }

    /**
     * @en Get current viewing type.
     * @zh 纹理视图类型。
     */
    public get type (): GFXTextureViewType {
        return this._type;
    }

    /**
     * @en Get current format.
     * @zh 纹理视图格式。
     */
    public get format (): GFXFormat {
        return this._format;
    }

    /**
     * @en Get base level.
     * @zh 纹理视图基础层级。
     */
    public get baseLevel (): number {
        return this._baseLevel;
    }

    /**
     * @en Get level count.
     * @zh 纹理视图层级数量。
     */
    public get levelCount (): number {
        return this._levelCount;
    }

    /**
     * @en Get base layer.
     * @zh 纹理视图基础图层。
     */
    public get baseLayer (): number {
        return this._baseLayer;
    }

    /**
     * @en Get layer count.
     * @zh 纹理视图图层数量。
     */
    public get layerCount (): number {
        return this._layerCount;
    }

    protected _device: GFXDevice;

    protected _texture: GFXTexture | null = null;

    protected _type: GFXTextureViewType = GFXTextureViewType.TV2D;

    protected _format: GFXFormat = GFXFormat.UNKNOWN;

    protected _baseLevel: number = 0;

    protected _levelCount: number = 1;

    protected _baseLayer: number = 0;

    protected _layerCount: number = 1;

    constructor (device: GFXDevice) {
        super(GFXObjectType.TEXTURE_VIEW);
        this._device = device;
    }

    public initialize (info: IGFXTextureViewInfo) {
        this._texture = info.texture;
        this._type = info.type;
        this._format = info.format;
        this._format = info.format;

        if (info.baseLevel !== undefined) {
            this._baseLevel = info.baseLevel;
        }

        if (info.levelCount !== undefined) {
            this._levelCount = info.levelCount;
        }

        if (info.baseLayer !== undefined) {
            this._baseLayer = info.baseLayer;
        }

        if (info.layerCount !== undefined) {
            this._layerCount = info.layerCount;
        }

        if (this._initialize(info)) { this._status = GFXStatus.SUCCESS; return true; }
        else { this._status = GFXStatus.FAILED; return false; }
    }

    public destroy () {
        if (this._status !== GFXStatus.SUCCESS) { return; }
        this._texture = null;
        this._destroy();
        this._status = GFXStatus.UNREADY;
    }

    protected abstract _initialize (info: IGFXTextureViewInfo): boolean;

    protected abstract _destroy (): void;
}
