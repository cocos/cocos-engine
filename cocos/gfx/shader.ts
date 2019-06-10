import { GFXObject, GFXObjectType, GFXShaderType, GFXType } from './define';
import { GFXDevice } from './device';

/**
 * @zh
 * GFX着色器宏
 */
export interface IGFXShaderMacro {
    macro: string;
    value: string;
}

/**
 * @zh
 * GFX着色器阶段
 */
export interface IGFXShaderStage {
    type: GFXShaderType;
    source: string;
    macros?: IGFXShaderMacro[];
}

/**
 * @zh
 * GFX Uniform
 */
export class GFXUniform {
    public name: string = '';
    public type: GFXType = GFXType.UNKNOWN;
    public count: number = 1;
}

/**
 * @zh
 * GFX Uniform块
 */
export class GFXUniformBlock {
    public binding: number = -1;
    public name: string = '';
    // instance : string;
    public members: GFXUniform[] = [];
}

/**
 * @zh
 * GFX Uniform采样器
 */
export class GFXUniformSampler {
    public binding: number = -1;
    public name: string = '';
    public type: GFXType = GFXType.UNKNOWN;
    public count: number = 1;
}

/**
 * @zh
 * GFX着色器描述信息
 */
export interface IGFXShaderInfo {
    name: string;
    stages: IGFXShaderStage[];
    // bindings: GFXBinding[];

    blocks?: GFXUniformBlock[];
    samplers?: GFXUniformSampler[];
}

/**
 * @zh
 * GFX着色器
 */
export abstract class GFXShader extends GFXObject {

    /**
     * @zh
     * 着色器id
     */
    public get id (): number {
        return this._id;
    }

    /**
     * @zh
     * 着色器名称
     */
    public get name (): string {
        return this._name;
    }

    /**
     * @zh
     * GFX设备
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * 着色器id
     */
    protected _id: number;

    /**
     * @zh
     * 着色器名称
     */
    protected _name: string = '';

    /**
     * @zh
     * 着色器阶段数组
     */
    protected _stages: IGFXShaderStage[] = [];
    // protected _bindings: GFXBinding[] = [];

    /**
     * @zh
     * 着色器Uniform块数组
     */
    protected _blocks: GFXUniformBlock[] = [];  // blocks are used for being compatible with single uniforms

    /**
     * @zh
     * 着色器Uniform采样器数组
     */
    protected _samplers: GFXUniformSampler[] = [];

    /**
     * @zh
     * 构造函数
     * @param device GFX设备
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.SHADER);
        this._device = device;
        this._id = device.genShaderId();
    }

    /**
     * @zh
     * 初始化函数
     * @param info GFX着色器描述信息
     */
    public abstract initialize (info: IGFXShaderInfo): boolean;

    /**
     * @zh
     * 销毁函数
     */
    public abstract destroy ();
}
