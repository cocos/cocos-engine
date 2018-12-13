import { GFXBuffer } from './gfx-buffer';

export class GFXDeviceInfo {
};

export abstract class GFXDevice {

    public abstract initialize(info : GFXDeviceInfo) : boolean;
    public abstract destroy() : void;
    public abstract createBuffer() : GFXBuffer;
    public abstract getDeviceName() : string;
};
