import { GFXDevice } from './device';
import { GFXType, GFXShaderType } from './gfx-define';

export interface GFXShaderMacro {
    macro: string;
    value: string;
};

export interface GFXShaderStage {
    type: GFXShaderType;
    source: string;
    macros?: GFXShaderMacro[];
};

export interface GFXUniform {
    name: string;
    type: GFXType;
    count: number;
};

export interface GFXUniformBlock {
    binding: number;
    name: string;
    //instance : string;
    uniforms: GFXUniform[];
};

export interface GFXUniformSampler {
    binding: number;
    name: string;
    type: GFXType;
    count: number;
};

export interface GFXShaderInfo {
    name: string;
    stages: GFXShaderStage[];
    //bindings: GFXBinding[];

    // blocks are used for being compatible with single uniforms
    blocks?: GFXUniformBlock[];
    samplers?: GFXUniformSampler[];
};

export abstract class GFXShader {

    constructor(device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info: GFXShaderInfo): boolean;
    public abstract destroy();

    protected _device: GFXDevice;
    protected _name: string = "";
    protected _stages: GFXShaderStage[] = [];
    //protected _bindings: GFXBinding[] = [];
    protected _blocks?: GFXUniformBlock[];
    protected _samplers?: GFXUniformSampler[];
};
