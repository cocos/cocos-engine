import { GFXDevice } from './device';
import { GFXBuffer } from './buffer';
import { GFXTextureView } from './texture-view';
import { GFXSampler } from './sampler';
import { GFXBindingType } from './define';

export interface GFXBinding {
    binding: number;
    type: GFXBindingType;
    name: string;
};

export interface GFXBindingLayoutInfo {
    bindings: GFXBinding[];
};

export class GFXBindingUnit {
    binding: number = 0;
    type: GFXBindingType = GFXBindingType.UNKNOWN;
    name: string = "";
    buffer: GFXBuffer | null = null;
    texView: GFXTextureView | null = null;
    sampler: GFXSampler | null = null;
};

export abstract class GFXBindingLayout {

    constructor(device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info: GFXBindingLayoutInfo): boolean;
    public abstract destroy();
    public abstract update();

    public bindBuffer(binding: number, buffer: GFXBuffer) {
        for (let i = 0; i < this._bindingUnits.length; ++i) {
            let bindingUnit = this._bindingUnits[i];
            if (bindingUnit.binding === binding) {
                if (bindingUnit.type === GFXBindingType.UNIFORM_BUFFER) {
                    bindingUnit.buffer = buffer;
                } else {
                    console.error("Setting binding is not GFXBindingType.UNIFORM_BUFFER.");
                }
                return;
            }
        }
    }

    public bindSampler(binding: number, sampler: GFXSampler) {
        for (let i = 0; i < this._bindingUnits.length; ++i) {
            let bindingUnit = this._bindingUnits[i];
            if (bindingUnit.binding === binding) {
                if (bindingUnit.type === GFXBindingType.SAMPLER) {
                    bindingUnit.sampler = sampler;
                } else {
                    console.error("Setting binding is not GFXBindingType.SAMPLER.");
                }
                return;
            }
        }
    }

    public bindTextureView(binding: number, texView: GFXTextureView) {
        for (let i = 0; i < this._bindingUnits.length; ++i) {
            let bindingUnit = this._bindingUnits[i];
            if (bindingUnit.binding === binding) {
                if (bindingUnit.type === GFXBindingType.SAMPLER) {
                    bindingUnit.texView = texView;
                } else {
                    console.error("Setting binding is not GFXBindingType.SAMPLER.");
                }
                return;
            }
        }
    }

    public getBindingUnit(binding: number): GFXBindingUnit {
        return this._bindingUnits[binding];
    }

    protected _device: GFXDevice;
    protected _bindingUnits: GFXBindingUnit[] = [];
};
