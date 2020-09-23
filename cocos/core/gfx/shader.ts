/**
 * @category gfx
 */

import { GFXObject, GFXObjectType, GFXShaderStageFlagBit, GFXType } from './define';
import { GFXDevice } from './device';
import { GFXAttribute } from './input-assembler';

export interface IGFXShaderStage {
    stage: GFXShaderStageFlagBit;
    source: string;
}

export class GFXShaderStage implements IGFXShaderStage {
    declare private token: never; // make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public stage: GFXShaderStageFlagBit = GFXShaderStageFlagBit.NONE,
        public source: string = '',
    ) {}
}

export interface IGFXUniform {
    name: string;
    type: GFXType;
    count: number;
}

/**
 * @en GFX uniform.
 * @zh GFX uniform。
 */
export class GFXUniform implements IGFXUniform {
    declare private token: never; // make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public name: string = '',
        public type: GFXType = GFXType.UNKNOWN,
        public count: number = 1,
    ) {}
}

/**
 * @en GFX uniform block.
 * @zh GFX uniform 块。
 */
export class GFXUniformBlock {
    declare private token: never; // make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = -1,
        public binding: number = -1,
        public name: string = '',
        public members: GFXUniform[] = [],
        public count: number = 1,
    ) {}
}

/**
 * @en GFX uniform sampler.
 * @zh GFX Uniform 采样器。
 */
export class GFXUniformSampler {
    declare private token: never; // make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = -1,
        public binding: number = -1,
        public name: string = '',
        public type: GFXType = GFXType.UNKNOWN,
        public count: number = 1,
    ) {}
}

export class GFXShaderInfo {
    declare private token: never; // make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public name: string = '',
        public stages: GFXShaderStage[] = [],
        public attributes: GFXAttribute[] = [],
        public blocks: GFXUniformBlock[] = [],
        public samplers: GFXUniformSampler[] = [],
    ) {}
}

/**
 * @en GFX shader.
 * @zh GFX 着色器。
 */
export abstract class GFXShader extends GFXObject {
    private static _shaderIdGen: number = 0;

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

    protected _stages: GFXShaderStage[] = [];

    protected _attributes: GFXAttribute[] = [];

    protected _blocks: GFXUniformBlock[] = [];

    protected _samplers: GFXUniformSampler[] = [];

    constructor (device: GFXDevice) {
        super(GFXObjectType.SHADER);
        this._device = device;
        this._id = GFXShader._shaderIdGen++;
    }

    public abstract initialize (info: GFXShaderInfo): boolean;

    public abstract destroy (): void;
}
