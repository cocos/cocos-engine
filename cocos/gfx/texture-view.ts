import { GFXFormat, GFXObject, GFXObjectType, GFXTextureViewType } from './define';
import { GFXDevice } from './device';
import { GFXTexture } from './texture';

/**
 * @zh
 * GFX纹理视图描述信息
 */
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
 * @zh
 * GFX纹理视图
 */
export abstract class GFXTextureView extends GFXObject {

    /**
     * @zh
     * GFX纹理
     */
    public get texture (): GFXTexture {
        return  this._texture as GFXTexture;
    }

    /**
     * @zh
     * 纹理视图类型
     */
    public get type (): GFXTextureViewType {
        return this._type;
    }

    /**
     * @zh
     * 纹理视图格式
     */
    public get format (): GFXFormat {
        return this._format;
    }

    /**
     * @zh
     * 纹理视图基础层级
     */
    public get baseLevel (): number {
        return this._baseLevel;
    }

    /**
     * @zh
     * 纹理视图层级数量
     */
    public get levelCount (): number {
        return this._levelCount;
    }

    /**
     * @zh
     * 纹理视图基础图层
     */
    public get baseLayer (): number {
        return this._baseLayer;
    }

    /**
     * @zh
     * 纹理视图图层数量
     */
    public get layerCount (): number {
        return this._layerCount;
    }

    /**
     * @zh
     * GFX设备
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * GFX纹理
     */
    protected _texture: GFXTexture | null = null;

    /**
     * @zh
     * 纹理视图类型
     */
    protected _type: GFXTextureViewType = GFXTextureViewType.TV2D;

    /**
     * @zh
     * 纹理视图格式
     */
    protected _format: GFXFormat = GFXFormat.UNKNOWN;

    /**
     * @zh
     * 纹理视图基础层级
     */
    protected _baseLevel: number = 0;

    /**
     * @zh
     * 纹理视图层级数量
     */
    protected _levelCount: number = 1;

    /**
     * @zh
     * 纹理视图基础图层
     */
    protected _baseLayer: number = 0;

    /**
     * @zh
     * 纹理视图图层数量
     */
    protected _layerCount: number = 1;

    /**
     * @zh
     * 构造函数
     * @param device GFX设备
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.TEXTURE_VIEW);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数
     * @param info GFX纹理视图描述信息
     */
    public abstract initialize (info: IGFXTextureViewInfo): boolean;

    /**
     * @zh
     * 销毁函数
     */
    public abstract destroy (): void;
}
