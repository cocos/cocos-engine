import { GFXDevice } from '../gfx-device';
import { GFXQueueInfo, GFXQueue } from '../gfx-queue';
import { GFXCommandBuffer } from '../gfx-command-buffer';

export class WebGLGFXQueue extends GFXQueue {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXQueueInfo) : boolean {

        this._type = info.type;

        return true;
    }

    public destroy() {

    }

    public submit(cmdBuffs: GFXCommandBuffer[], fence) {
        
        for(let cb in cmdBuffs) {
            
        }
    }

    private _isAsync : boolean = false;
};
