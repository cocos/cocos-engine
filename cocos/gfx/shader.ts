import { GFXShaderType, GFXType } from './define';
import { GFXDevice } from './device';

export interface IGFXShaderMacro {
    macro: string;
    value: string;
}

export interface IGFXShaderStage {
    type: GFXShaderType;
    source: string;
    macros?: IGFXShaderMacro[];
}

export class GFXUniform {
    public name: string = '';
    public type: GFXType = GFXType.UNKNOWN;
    public count: number = 1;
}

export class GFXUniformBlock {
    public binding: number = -1;
    public name: string = '';
    // instance : string;
    public members: GFXUniform[] = [];
}

export class GFXUniformSampler {
    public binding: number = -1;
    public name: string = '';
    public type: GFXType = GFXType.UNKNOWN;
    public count: number = 1;
}

export interface IGFXShaderInfo {
    name: string;
    stages: IGFXShaderStage[];
    // bindings: GFXBinding[];

    blocks?: GFXUniformBlock[];
    samplers?: GFXUniformSampler[];
}

export abstract class GFXShader {

    public get id (): number {
        return this._id;
    }

    protected _device: GFXDevice;
    protected _id: number;
    protected _name: string = '';
    protected _stages: IGFXShaderStage[] = [];
    // protected _bindings: GFXBinding[] = [];
    protected _blocks: GFXUniformBlock[] = [];  // blocks are used for being compatible with single uniforms
    protected _samplers: GFXUniformSampler[] = [];

    constructor (device: GFXDevice) {
        this._device = device;
        this._id = device.genShaderId();
    }

    public abstract initialize (info: IGFXShaderInfo): boolean;
    public abstract destroy ();
}
