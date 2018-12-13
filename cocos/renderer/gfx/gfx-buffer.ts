import { GFXDevice } from './gfx-device';

export const enum BufferUsageBit {
    NONE = 0,
    MAP_READ = 0x1,
    MAP_WRITE = 0x2,
    TRANSFER_SRC = 0x4,
    TRANSFER_DST = 0x8,
    INDEX = 0x10,
    VERTEX = 0x20,
    UNIFORM = 0x40,
    STORAGE = 0x80,
};

export class GFXBufferInfo {
    usage : BufferUsageBit = BufferUsageBit.NONE;
    size : number = 0;
};

export abstract class GFXBuffer {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(desc : GFXBufferInfo) : boolean;

    protected _device : GFXDevice;
};
