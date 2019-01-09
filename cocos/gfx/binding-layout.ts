import { GFXBuffer } from './buffer';
import { GFXBindingType } from './define';
import { GFXDevice } from './device';
import { GFXSampler } from './sampler';
import { GFXTextureView } from './texture-view';

export interface IGFXBinding {
    binding: number;
    type: GFXBindingType;
    name: string;
}

export interface IGFXBindingLayoutInfo {
    bindings: IGFXBinding[];
}

export class GFXBindingUnit {
    public binding: number = 0;
    public type: GFXBindingType = GFXBindingType.UNKNOWN;
    public name: string = '';
    public buffer: GFXBuffer | null = null;
    public texView: GFXTextureView | null = null;
    public sampler: GFXSampler | null = null;
}

export abstract class GFXBindingLayout {

    protected _device: GFXDevice;
    protected _bindingUnits: GFXBindingUnit[] = [];
    protected _isDirty = false;

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize (info: IGFXBindingLayoutInfo): boolean;
    public abstract destroy ();
    public abstract update ();

    public bindBuffer (binding: number, buffer: GFXBuffer) {
        for (const bindingUnit of this._bindingUnits) {
            if (bindingUnit.binding === binding) {
                if (bindingUnit.type === GFXBindingType.UNIFORM_BUFFER) {
                    if (bindingUnit.buffer !== buffer) {
                        bindingUnit.buffer = buffer;
                        this._isDirty = true;
                    }
                } else {
                    console.error('Setting binding is not GFXBindingType.UNIFORM_BUFFER.');
                }
                return;
            }
        }
    }

    public bindSampler (binding: number, sampler: GFXSampler) {
        for (const bindingUnit of this._bindingUnits) {
            if (bindingUnit.binding === binding) {
                if (bindingUnit.type === GFXBindingType.SAMPLER) {
                    if (bindingUnit.sampler !== sampler) {
                        bindingUnit.sampler = sampler;
                        this._isDirty = true;
                    }
                } else {
                    console.error('Setting binding is not GFXBindingType.SAMPLER.');
                }
                return;
            }
        }
    }

    public bindTextureView (binding: number, texView: GFXTextureView) {
        for (const bindingUnit of this._bindingUnits) {
            if (bindingUnit.binding === binding) {
                if (bindingUnit.type === GFXBindingType.SAMPLER) {
                    if (bindingUnit.texView !== texView) {
                        bindingUnit.texView = texView;
                        this._isDirty = true;
                    }
                } else {
                    console.error('Setting binding is not GFXBindingType.SAMPLER.');
                }
                return;
            }
        }
    }

    public getBindingUnit (binding: number): GFXBindingUnit | null {
        for (const unit of this._bindingUnits) {
            if (unit.binding === binding) {
                return unit;
            }
        }
        return null;
    }
}
