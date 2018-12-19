import { GFXBuffer } from './gfx-buffer';
import { GFXQueue } from './gfx-queue';

export class GFXDeviceInfo {
};

export abstract class GFXDevice {

    public abstract initialize(info : GFXDeviceInfo) : boolean;
    public abstract destroy() : void;
    public abstract createBuffer() : GFXBuffer;
    public abstract getDeviceName() : string;

    public get queue(): GFXQueue {
        return <GFXQueue>this._queue;
    }

    public get maxVertexAttributes(): number {
        return this._maxVertexAttributes;
    }

    protected _queue : GFXQueue | null = null;

    protected _maxVertexAttributes : number = 0;
};
