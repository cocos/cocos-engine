import { GFXAddress, GFXComparisonFunc, GFXFilter, GFXObject, GFXObjectType, IGFXColor } from './define';
import { GFXDevice } from './device';

/**
 * @zh
 * GFX采样器描述信息。
 */
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
 * @zh
 * GFX采样器状态。
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

    /**
     * @zh
     * 比较函数。
     * @param state GFX采样器状态。
     */
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
 * @zh
 * GFX采样器。
 */
export abstract class GFXSampler extends GFXObject {

    /**
     * @zh
     * GFX采样器状态。
     */
    public get state (): GFXSamplerState {
        return this._state;
    }

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * GFX采样器状态。
     */
    protected _state: GFXSamplerState = new GFXSamplerState();

    /**
     * @zh
     * 构造函数。
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.SAMPLER);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info GFX采样器描述信息。
     */
    public abstract initialize (info: IGFXSamplerInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy (): void;
}
