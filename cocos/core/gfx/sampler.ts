/**
 * @category gfx
 */

import { GFXAddress, GFXComparisonFunc, GFXFilter, GFXObject, GFXObjectType, GFXColor } from './define';
import { GFXDevice } from './device';

export interface IGFXSamplerInfo {
    name?: string;
    minFilter?: GFXFilter;
    magFilter?: GFXFilter;
    mipFilter?: GFXFilter;
    addressU?: GFXAddress;
    addressV?: GFXAddress;
    addressW?: GFXAddress;
    maxAnisotropy?: number;
    cmpFunc?: GFXComparisonFunc;
    borderColor?: GFXColor;
    minLOD?: number;
    maxLOD?: number;
    mipLODBias?: number;
}

/**
 * @en GFX sampler state.
 * @zh GFX 采样器状态。
 */
export class GFXSamplerState {

    public name: string = '';
    public minFilter: GFXFilter = GFXFilter.LINEAR;
    public magFilter: GFXFilter = GFXFilter.LINEAR;
    public mipFilter: GFXFilter = GFXFilter.NONE;
    public addressU: GFXAddress = GFXAddress.WRAP;
    public addressV: GFXAddress = GFXAddress.WRAP;
    public addressW: GFXAddress = GFXAddress.WRAP;
    public maxAnisotropy: number = 16;
    public cmpFunc: GFXComparisonFunc = GFXComparisonFunc.NEVER;
    public borderColor: GFXColor = { r: 0, g: 0, b: 0, a: 0 };
    public minLOD: number = 0;
    public maxLOD: number = 0;
    public mipLODBias: number = 0.0;

    public compare (state: GFXSamplerState): boolean {
        return (this.minFilter === state.minFilter) &&
        (this.magFilter === state.magFilter) &&
        (this.mipFilter === state.mipFilter) &&
        (this.addressU === state.addressU) &&
        (this.addressV === state.addressV) &&
        (this.addressW === state.addressW) &&
        (this.maxAnisotropy === state.maxAnisotropy) &&
        (this.cmpFunc === state.cmpFunc) &&
        (this.borderColor.r === state.borderColor.r) &&
        (this.borderColor.g === state.borderColor.g) &&
        (this.borderColor.b === state.borderColor.b) &&
        (this.borderColor.a === state.borderColor.a) &&
        (this.minLOD === state.minLOD) &&
        (this.maxLOD === state.maxLOD) &&
        (this.mipLODBias === state.mipLODBias);
    }
}

/**
 * @en GFX sampler.
 * @zh GFX 采样器。
 */
export abstract class GFXSampler extends GFXObject {

    /**
     * @en Get current sampler state.
     * @zh GFX 采样器状态。
     */
    public get state (): GFXSamplerState {
        return this._state;
    }

    protected _device: GFXDevice;

    protected _state: GFXSamplerState = new GFXSamplerState();

    constructor (device: GFXDevice) {
        super(GFXObjectType.SAMPLER);
        this._device = device;
        this._state = new GFXSamplerState();
    }

    public abstract initialize (info: IGFXSamplerInfo): boolean;

    public abstract destroy (): void;
}
