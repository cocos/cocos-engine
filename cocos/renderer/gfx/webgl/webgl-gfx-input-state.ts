import { GFXDevice } from '../gfx-device';
import { WebGLGPUTexture } from './webgl-gpu-objects';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { GFXFormatSurfaceSize } from '../gfx-define';
import { GFXInputState, GFXInputStateInfo } from '../gfx-input-state';

export class WebGLGFXInputState extends GFXInputState {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXInputStateInfo) : boolean {

        this._attributes = info.attributes;

        return true;
    }

    public destroy() {
    }
};
