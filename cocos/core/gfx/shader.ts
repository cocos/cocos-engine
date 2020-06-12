/**
 * @category gfx
 */

import { GFXObject, GFXObjectType, GFXShaderType, GFXType } from './define';
import { GFXDevice } from './device';
import { IGFXAttribute } from './input-assembler';

export interface IGFXShaderMacro {
    macro: string;
    value: string;
}

export interface IGFXShaderStage {
    type: GFXShaderType;
    source: string;
    macros?: IGFXShaderMacro[];
}

/**
 * @en GFX uniform.
 * @zh GFX uniform。
 */
export class GFXUniform {
    public name: string = '';
    public type: GFXType = GFXType.UNKNOWN;
    public count: number = 1;
}

/**
 * @en GFX uniform block.
 * @zh GFX uniform 块。
 */
export class GFXUniformBlock {
    public shaderStages: GFXShaderType = GFXShaderType.NONE;
    public binding: number = -1;
    public name: string = '';
    public members: GFXUniform[] = [];
}

/**
 * @en GFX uniform sampler.
 * @zh GFX Uniform 采样器。
 */
export class GFXUniformSampler {
    public shaderStages: GFXShaderType = GFXShaderType.NONE;
    public binding: number = -1;
    public name: string = '';
    public type: GFXType = GFXType.UNKNOWN;
    public count: number = 1;
}

export interface IGFXShaderInfo {
    name: string;
    stages: IGFXShaderStage[];

    attributes: IGFXAttribute[];
    blocks: GFXUniformBlock[];
    samplers: GFXUniformSampler[];
}

/**
 * @en GFX shader.
 * @zh GFX 着色器。
 */
export abstract class GFXShader extends GFXObject {

    /**
     * @en Get current shader id.
     * @zh 着色器 id。
     */
    public get id (): number {
        return this._id;
    }

    /**
     * @en Get current shader name.
     * @zh 着色器名称。
     */
    public get name (): string {
        return this._name;
    }

    public get attributes () {
        return this._attributes;
    }

    public get blocks () {
        return this._blocks;
    }

    public get samplers () {
        return this._samplers;
    }

    protected _device: GFXDevice;

    protected _id: number;

    protected _name: string = '';

    protected _stages: IGFXShaderStage[] = [];

    protected _attributes: IGFXAttribute[] = [];

    protected _blocks: GFXUniformBlock[] = [];

    protected _samplers: GFXUniformSampler[] = [];

    constructor (device: GFXDevice) {
        super(GFXObjectType.SHADER);
        this._device = device;
        this._id = device.genShaderId();
    }

    public abstract initialize (info: IGFXShaderInfo): boolean;

    public abstract destroy (): void;
}
