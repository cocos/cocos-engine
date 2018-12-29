import { GFXDevice } from './device';
import { GFXComparisonFunc } from './pipeline-state';

export enum GFXFilter {
    NONE,
    POINT,
    LINEAR,
    ANISOTROPIC,
};

export enum GFXAddress {
    WRAP,
    MIRROR,
    CLAMP,
    BORDER,
};

export class GFXSamplerInfo {
    name : string = "";
    minFilter : GFXFilter = GFXFilter.LINEAR;
    magFilter : GFXFilter = GFXFilter.LINEAR;
    mipFilter : GFXFilter = GFXFilter.LINEAR;
    addressU : GFXAddress = GFXAddress.WRAP;
    addressV : GFXAddress = GFXAddress.WRAP;
    addressW : GFXAddress = GFXAddress.WRAP;
    maxAnisotropy : number = 16;
    cmpFunc : GFXComparisonFunc = GFXComparisonFunc.NEVER;
    borderColor : number[] = [0.0, 0.0, 0.0, 0.0];
    minLOD : number = 0;
    maxLOD : number = 1000;
    mipLODBias : number = 0.0;

    public compare(state : GFXSamplerInfo) : boolean {
        return (this.minFilter === state.minFilter) &&
        (this.magFilter === state.magFilter) &&
        (this.mipFilter === state.mipFilter) &&
        (this.addressU === state.addressU) &&
        (this.addressV === state.addressV) &&
        (this.addressW === state.addressW) &&
        (this.maxAnisotropy === state.maxAnisotropy) &&
        (this.cmpFunc === state.cmpFunc) &&
        (this.borderColor === state.borderColor) &&
        (this.minLOD === state.minLOD) &&
        (this.maxLOD === state.maxLOD) &&
        (this.mipLODBias === state.mipLODBias);
    }
};

export abstract class GFXSampler {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXSamplerInfo) : boolean;
    public abstract destroy() : void;

    protected _device : GFXDevice;
    protected _state : GFXSamplerInfo | null = null;
};
