import { GFXDevice } from './gfx-device';
import { GFXBuffer } from './gfx-buffer';
import { GFXTextureView } from './gfx-texture-view';
import { GFXSampler } from './gfx-sampler';

export const enum GFXBindingType {
    UNKNOWN,
    UNIFORM_BUFFER,
    SAMPLER,
    TEXTURE_VIEW,
    STORAGE_BUFFER,
};

export class GFXBinding {
    binding : number = 0;
    type : GFXBindingType = GFXBindingType.UNKNOWN;
    name : string = "";
};

export class GFXBindingSetLayoutInfo {
    bindings : GFXBinding[] = [];
};

export class GFXBindingUnit {
    binding : number = 0;
    type : GFXBindingType = GFXBindingType.UNKNOWN;
    name : string = "";
    buffer : GFXBuffer | null = null;
    texView : GFXTextureView | null = null;
    sampler : GFXSampler | null = null;
};

export abstract class GFXBindingSetLayout {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXBindingSetLayoutInfo) : boolean;
    public abstract destroy() : void;

    protected _device : GFXDevice;
    protected _bindingUnits : GFXBindingUnit[] = [];
};
