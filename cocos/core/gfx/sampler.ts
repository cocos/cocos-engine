/**
 * @packageDocumentation
 * @module gfx
 */

import { Address, ComparisonFunc, Filter, Obj, ObjectType } from './define';
import { Color } from './define-class';
import { Device } from './device';

export class SamplerInfo {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public minFilter: Filter = Filter.LINEAR,
        public magFilter: Filter = Filter.LINEAR,
        public mipFilter: Filter = Filter.NONE,
        public addressU: Address = Address.WRAP,
        public addressV: Address = Address.WRAP,
        public addressW: Address = Address.WRAP,
        public maxAnisotropy: number = 16,
        public cmpFunc: ComparisonFunc = ComparisonFunc.NEVER,
        public borderColor: Color = new Color(),
        public minLOD: number = 0,
        public maxLOD: number = 0,
        public mipLODBias: number = 0.0,
    ) {}
}

/**
 * @en GFX sampler.
 * @zh GFX 采样器。
 */
export abstract class Sampler extends Obj {

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

    protected _device: Device;

    protected _minFilter: Filter = Filter.LINEAR;
    protected _magFilter: Filter = Filter.LINEAR;
    protected _mipFilter: Filter = Filter.NONE;
    protected _addressU: Address = Address.WRAP;
    protected _addressV: Address = Address.WRAP;
    protected _addressW: Address = Address.WRAP;
    protected _maxAnisotropy: number = 16;
    protected _cmpFunc: ComparisonFunc = ComparisonFunc.NEVER;
    protected _borderColor: Color = new Color();
    protected _minLOD: number = 0;
    protected _maxLOD: number = 0;
    protected _mipLODBias: number = 0.0;

    constructor (device: Device) {
        super(ObjectType.SAMPLER);
        this._device = device;
    }

    public abstract initialize (info: SamplerInfo): boolean;

    public abstract destroy (): void;
}
