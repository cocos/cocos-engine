import { GFXDevice } from './gfx-device';
import { GFX_MAX_VERTEX_ATTRIBUTES, GFXFormat } from './gfx-define';

export class GFXInputAttribute {
    name : string = "";
    format : GFXFormat = GFXFormat.UNKNOWN;
    //offset : number = 0;
    isInstanced : boolean = false;
};

export class GFXInputStateInfo {
    attributes: GFXInputAttribute[] = [];
};

export abstract class GFXInputState {  

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXInputStateInfo) : boolean;
    public abstract destroy() : void;

    protected _device : GFXDevice;
    protected _attributes: GFXInputAttribute[] = [];
};
