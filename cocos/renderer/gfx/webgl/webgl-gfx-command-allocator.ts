import { GFXDevice } from '../gfx-device';
import { GFXCommandAllocator } from '../gfx-command-allocator';

export class WebGLGFXCommandPool<T> {
    
    constructor(size: number) {
        this._commands = new Array(size);
    }

    private _commands : T[];
};

export class GFXWebGLCommandAllocator extends GFXCommandAllocator {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize() : boolean {

        return true;
    }

    public destroy() : void {

    }
};
