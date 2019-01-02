import { GFXFormat, GFXTextureViewType } from './define';
import { GFXDevice } from './device';
import { GFXTexture } from './texture';

export interface GFXTextureViewInfo {
    texture: GFXTexture;
    type: GFXTextureViewType;
    format: GFXFormat;
    baseLevel?: number;
    levelCount?: number;
    baseLayer?: number;
    layerCount?: number;
};

export abstract class GFXTextureView {

    constructor(device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info: GFXTextureViewInfo): boolean;
    public abstract destroy(): void;

    public get texture(): GFXTexture {
        return <GFXTexture>this._texture;
    }

    public get type(): GFXTextureViewType {
        return this._type;
    }

    public get format(): GFXFormat {
        return this._format;
    }

    public get baseLevel(): number {
        return this._baseLevel;
    }

    public get levelCount(): number {
        return this._levelCount;
    }

    public get baseLayer(): number {
        return this._baseLayer;
    }

    public get layerCount(): number {
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
};
