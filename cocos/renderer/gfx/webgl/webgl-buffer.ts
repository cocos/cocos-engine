import { GFXBufferInfo, GFXBuffer } from '../gfx-buffer';
import { GFXDevice } from '../gfx-device';

export class WebGLBuffer extends GFXBuffer {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(desc : GFXBufferInfo) : boolean{
        return true;
    }
};
