import { Asset } from '../../assets/asset';
import { ccclass, property } from '../../core/data/class-decorator';
import { GFXDynamicState, GFXPrimitiveMode, GFXType } from '../../gfx/define';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { RenderPassStage } from '../../pipeline/define';
import { programLib } from '../../renderer/core/program-lib';

export interface IPropertyInfo {
    type: number; // auto-extracted
    value?: number[] | string;
    sampler?: number[];
}
export interface IPassStates {
    priority?: number;
    primitive?: GFXPrimitiveMode;
    stage?: RenderPassStage;
    rasterizerState?: GFXRasterizerState;
    depthStencilState?: GFXDepthStencilState;
    blendState?: GFXBlendState;
    dynamics?: GFXDynamicState[];
    customizations?: string[];
    phase?: string;
}
export interface IPassInfo extends IPassStates {
    program: string; // auto-generated
    switch?: string;
    properties?: Record<string, IPropertyInfo>;
}
export interface ITechniqueInfo {
    passes: IPassInfo[];
    name?: string;
}

export interface IBlockMember {
    size: number;
    // extends GFXUniform
    name: string;
    type: GFXType;
    count: number;
}
export interface IBlockInfo {
    size: number;
    // extends GFXUniformBlock
    binding: number;
    name: string;
    members: IBlockMember[];
}
export interface ISamplerInfo {
    // extends GFXUniformSampler
    binding: number;
    name: string;
    type: GFXType;
    count: number;
}
export interface IDefineInfo {
    name: string;
    type: string;
    range?: number[];
    options?: string[];
    default?: string;
}
export interface IBuiltinInfo {
    blocks: string[];
    samplers: string[];
}
export interface IShaderInfo {
    name: string;
    hash: number;
    glsl3: { vert: string, frag: string };
    glsl1: { vert: string, frag: string };
    builtins: { globals: IBuiltinInfo, locals: IBuiltinInfo };
    defines: IDefineInfo[];
    blocks: IBlockInfo[];
    samplers: ISamplerInfo[];
    dependencies: Record<string, string>;
}

const effects: Record<string, EffectAsset> = {};

/**
 * @zh
 * Effect 资源，作为材质实例初始化的模板，每个 effect 资源都应是全局唯一的。
 */
@ccclass('cc.EffectAsset')
export class EffectAsset extends Asset {
    /**
     * @zh
     * 将指定 effect 注册到全局管理器。
     */
    public static register (asset: EffectAsset) { effects[asset.name] = asset; }
    /**
     * @zh
     * 将指定 effect 从全局管理器移除。
     */
    public static remove (name: string) {
        if (effects[name]) { delete effects[name]; return; }
        for (const n in effects) {
            if (effects[n]._uuid === name) {
                delete effects[n];
                return;
            }
        }
    }
    /**
     * @zh
     * 获取指定名字的 effect 资源。
     */
    public static get (name: string) {
        if (effects[name]) { return effects[name]; }
        for (const n in effects) {
            if (effects[n]._uuid === name) {
                return effects[n];
            }
        }
        return null;
    }
    /**
     * @zh
     * 获取所有已注册的 effect 资源。
     */
    public static getAll () { return effects; }
    protected static _effects: Record<string, EffectAsset> = {};

    /**
     * @zh
     * 当前 effect 的所有可用 technique。
     */
    @property
    public techniques: ITechniqueInfo[] = [];

    /**
     * @zh
     * 当前 effect 使用的所有 shader。
     */
    @property
    public shaders: IShaderInfo[] = [];

    /**
     * @zh
     * 通过 Loader 加载完成时的回调，将自动注册 effect 资源。
     */
    public onLoaded () {
        this.shaders.forEach((s) => programLib.define(s));
        EffectAsset.register(this);
    }
}

cc.EffectAsset = EffectAsset;
