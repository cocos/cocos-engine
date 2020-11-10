/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module gfx
 */

import { Attribute } from './input-assembler';
import { Device } from './device';
import { Obj, ObjectType, ShaderStageFlagBit, Type } from './define';

export interface IShaderStage {
    stage: ShaderStageFlagBit;
    source: string;
}

export class ShaderStage implements IShaderStage {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public stage: ShaderStageFlagBit = ShaderStageFlagBit.NONE,
        public source: string = '',
    ) {}
}

export interface IUniform {
    name: string;
    type: Type;
    count: number;
}

/**
 * @en GFX uniform.
 * @zh GFX uniform。
 */
export class Uniform implements IUniform {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public name: string = '',
        public type: Type = Type.UNKNOWN,
        public count: number = 1,
    ) {}
}

/**
 * @en GFX uniform block.
 * @zh GFX uniform 块。
 */
export class UniformBlock {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = -1,
        public binding: number = -1,
        public name: string = '',
        public members: Uniform[] = [],
        public count: number = 1,
    ) {}
}

/**
 * @en GFX uniform sampler.
 * @zh GFX Uniform 采样器。
 */
export class UniformSampler {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public set: number = -1,
        public binding: number = -1,
        public name: string = '',
        public type: Type = Type.UNKNOWN,
        public count: number = 1,
    ) {}
}

export class ShaderInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public name: string = '',
        public stages: ShaderStage[] = [],
        public attributes: Attribute[] = [],
        public blocks: UniformBlock[] = [],
        public samplers: UniformSampler[] = [],
    ) {}
}

/**
 * @en GFX shader.
 * @zh GFX 着色器。
 */
export abstract class Shader extends Obj {
    private static _shaderIdGen = 0;

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

    protected _device: Device;

    protected _id: number;

    protected _name = '';

    protected _stages: ShaderStage[] = [];

    protected _attributes: Attribute[] = [];

    protected _blocks: UniformBlock[] = [];

    protected _samplers: UniformSampler[] = [];

    constructor (device: Device) {
        super(ObjectType.SHADER);
        this._device = device;
        this._id = Shader._shaderIdGen++;
    }

    public abstract initialize (info: ShaderInfo): boolean;

    public abstract destroy (): void;
}
