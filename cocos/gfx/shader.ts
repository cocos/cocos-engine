import { GFXDevice } from './device';
import { GFXType, GFXShaderType } from './define';

export interface GFXShaderMacro {
    macro: string;
    value: string;
};

export interface GFXShaderStage {
    type: GFXShaderType;
    source: string;
    macros?: GFXShaderMacro[];
};

export class GFXUniform {
    name: string = "";
    type: GFXType = GFXType.UNKNOWN;
    count: number = 1;
};

export class GFXUniformBlock {
    binding: number = -1;
    name: string = "";
    //instance : string;
    uniforms: GFXUniform[] = [];
};

export class GFXUniformSampler {
    binding: number = -1;
    name: string = "";
    type: GFXType = GFXType.UNKNOWN;
    count: number = 1;
};

export interface GFXShaderInfo {
    name: string;
    stages: GFXShaderStage[];
    //bindings: GFXBinding[];

    blocks?: GFXUniformBlock[];
    samplers?: GFXUniformSampler[];
};

export abstract class GFXShader {

    constructor(device: GFXDevice) {
        this._device = device;
        this._id = device.genShaderId();
    }

    public abstract initialize(info: GFXShaderInfo): boolean;
    public abstract destroy();

    public get id(): number {
        return this._id;
    }

    protected _device: GFXDevice;
    protected _id: number;
    protected _name: string = "";
    protected _stages: GFXShaderStage[] = [];
    //protected _bindings: GFXBinding[] = [];
    protected _blocks: GFXUniformBlock[] = [];  // blocks are used for being compatible with single uniforms
    protected _samplers: GFXUniformSampler[] = [];
};
