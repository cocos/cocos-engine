/**
 * @packageDocumentation
 * @module gfx
 */

import { GFXAddress, GFXComparisonFunc, GFXFilter, GFXObject, GFXObjectType } from './define';
import { GFXColor } from './define-class';
import { GFXDevice } from './device';

export class GFXSamplerInfo {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public minFilter: GFXFilter = GFXFilter.LINEAR,
        public magFilter: GFXFilter = GFXFilter.LINEAR,
        public mipFilter: GFXFilter = GFXFilter.NONE,
        public addressU: GFXAddress = GFXAddress.WRAP,
        public addressV: GFXAddress = GFXAddress.WRAP,
        public addressW: GFXAddress = GFXAddress.WRAP,
        public maxAnisotropy: number = 16,
        public cmpFunc: GFXComparisonFunc = GFXComparisonFunc.NEVER,
        public borderColor: GFXColor = new GFXColor(),
        public minLOD: number = 0,
        public maxLOD: number = 0,
        public mipLODBias: number = 0.0,
    ) {}
}

/**
 * @en GFX sampler.
 * @zh GFX 采样器。
 */
export abstract class GFXSampler extends GFXObject {

    get minFilter () { return this._minFilter; }
    get magFilter () { return this._magFilter; }
    get mipFilter () { return this._mipFilter; }
    get addressU () { return this._addressU; }
    get addressV () { return this._addressV; }
    get addressW () { return this._addressW; }
    get maxAnisotropy () { return this._maxAnisotropy; }
    get cmpFunc () { return this._cmpFunc; }
    get borderColor () { return this._borderColor; }
    get minLOD () { return this._minLOD; }
    get maxLOD () { return this._maxLOD; }
    get mipLODBias () { return this._mipLODBias; }

    protected _device: GFXDevice;

    protected _minFilter: GFXFilter = GFXFilter.LINEAR;
    protected _magFilter: GFXFilter = GFXFilter.LINEAR;
    protected _mipFilter: GFXFilter = GFXFilter.NONE;
    protected _addressU: GFXAddress = GFXAddress.WRAP;
    protected _addressV: GFXAddress = GFXAddress.WRAP;
    protected _addressW: GFXAddress = GFXAddress.WRAP;
    protected _maxAnisotropy: number = 16;
    protected _cmpFunc: GFXComparisonFunc = GFXComparisonFunc.NEVER;
    protected _borderColor: GFXColor = new GFXColor();
    protected _minLOD: number = 0;
    protected _maxLOD: number = 0;
    protected _mipLODBias: number = 0.0;

    constructor (device: GFXDevice) {
        super(GFXObjectType.SAMPLER);
        this._device = device;
    }

    public abstract initialize (info: GFXSamplerInfo): boolean;

    public abstract destroy (): void;
}
