/**
 * @category gfx
 */

import { GFXAddress, GFXComparisonFunc, GFXFilter, GFXObject, GFXObjectType, IGFXColor, GFXStatus } from './define';
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
    borderColor?: IGFXColor;
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
    public borderColor: IGFXColor = { r: 0, g: 0, b: 0, a: 0 };
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

    public initialize (info: IGFXSamplerInfo) {
        if (info.name !== undefined) {
            this._state.name = info.name;
        }

        if (info.minFilter !== undefined) {
            this._state.minFilter = info.minFilter;
        }

        if (info.magFilter !== undefined) {
            this._state.magFilter = info.magFilter;
        }

        if (info.mipFilter !== undefined) {
            this._state.mipFilter = info.mipFilter;
        }

        if (info.addressU !== undefined) {
            this._state.addressU = info.addressU;
        }

        if (info.addressV !== undefined) {
            this._state.addressV = info.addressV;
        }

        if (info.addressW !== undefined) {
            this._state.addressW = info.addressW;
        }

        if (info.maxAnisotropy !== undefined) {
            this._state.maxAnisotropy = info.maxAnisotropy;
        }

        if (info.cmpFunc !== undefined) {
            this._state.cmpFunc = info.cmpFunc;
        }

        if (info.borderColor !== undefined) {
            this._state.borderColor = info.borderColor;
        }

        if (info.minLOD !== undefined) {
            this._state.minLOD = info.minLOD;
        }

        if (info.maxLOD !== undefined) {
            this._state.maxLOD = info.maxLOD;
        }

        if (info.mipLODBias !== undefined) {
            this._state.mipLODBias = info.mipLODBias;
        }

        if (this._initialize(info)) { this._status = GFXStatus.SUCCESS; return true; }
        else { this._status = GFXStatus.FAILED; return false; }
    }

    public destroy () {
        if (this._status !== GFXStatus.SUCCESS) { return; }
        this._destroy();
        this._status = GFXStatus.UNREADY;
    }

    protected abstract _initialize (info: IGFXSamplerInfo): boolean;

    protected abstract _destroy (): void;
}
