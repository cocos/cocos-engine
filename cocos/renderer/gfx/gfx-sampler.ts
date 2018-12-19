import { GFXDevice } from './gfx-device';
import { GFXComparisonFunc } from './gfx-pipeline-state';

export const enum GFXFilterOp {
    NONE,
    POINT,
    LINEAR,
    ANISOTROPIC,
};

export const enum GFXAddressMode {
    WRAP,
    MIRROR,
    CLAMP,
    BORDER,
};

export class GFXSamplerInfo {
    name : string = "";
    minFilter : GFXFilterOp = GFXFilterOp.LINEAR;
    magFilter : GFXFilterOp = GFXFilterOp.LINEAR;
    mipFilter : GFXFilterOp = GFXFilterOp.LINEAR;
    addressU : GFXAddressMode = GFXAddressMode.WRAP;
    addressV : GFXAddressMode = GFXAddressMode.WRAP;
    addressW : GFXAddressMode = GFXAddressMode.WRAP;
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
    protected _name : string = "";
    protected _minFilter : GFXFilterOp = GFXFilterOp.LINEAR;
    protected _magFilter : GFXFilterOp = GFXFilterOp.LINEAR;
    protected _mipFilter : GFXFilterOp = GFXFilterOp.LINEAR;
    protected _addressU : GFXAddressMode = GFXAddressMode.WRAP;
    protected _addressV : GFXAddressMode = GFXAddressMode.WRAP;
    protected _addressW : GFXAddressMode = GFXAddressMode.WRAP;
    protected _maxAnisotropy : number = 16;
    protected _cmpFunc : GFXComparisonFunc = GFXComparisonFunc.NEVER;
    protected _borderColor : number[] = [0.0, 0.0, 0.0, 0.0];
    protected _minLOD : number = 0;
    protected _maxLOD : number = 1000;
    protected _mipLODBias : number = 0.0;
};
