import { Asset } from '../../assets/asset';
import { ccclass, property } from '../../core/data/class-decorator';
import { GFXDynamicState, GFXPrimitiveMode, GFXType } from '../../gfx/define';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { IGFXSamplerInfo } from '../../gfx/sampler';
import { RenderPassStage } from '../../pipeline/define';
import { programLib } from '../../renderer/core/program-lib';

export interface IPropertyInfo {
    type: number; // auto-extracted if not specified
    value?: number[] | string;
    displayName?: string;
    sampler?: IGFXSamplerInfo;
}
export interface IPassInfo {
    program: string;
    // effect-writer part
    priority?: number;
    primitive?: GFXPrimitiveMode;
    stage?: RenderPassStage;
    rasterizerState?: GFXRasterizerState;
    depthStencilState?: GFXDepthStencilState;
    blendState?: GFXBlendState;
    dynamics?: GFXDynamicState[];
    properties?: Record<string, IPropertyInfo>;
}
export interface ITechniqueInfo {
    passes: IPassInfo[];
    name?: string;
}

export interface IBlockMember {
    name: string;
    type: GFXType;
    count: number;
    size: number;
}
export interface IBlockInfo {
    name: string;
    binding: number;
    defines: string[];
    members: IBlockMember[];
    size: number;
}
export interface ISamplerInfo {
    name: string;
    binding: number;
    defines: string[];
    type: GFXType;
    count: number;
}
export interface IDefineInfo {
    name: string;
    type: string;
    range?: number[];
    defines: string[];
}
export interface IShaderInfo {
    name: string;
    glsl3: { vert: string, frag: string };
    glsl1: { vert: string, frag: string };
    defines: IDefineInfo[];
    blocks: IBlockInfo[];
    samplers: ISamplerInfo[];
    dependencies: Record<string, string>;
}

const effects: Record<string, EffectAsset> = {};

@ccclass('cc.EffectAsset')
export class EffectAsset extends Asset {
    public static register (asset: EffectAsset) { effects[asset.name] = asset; }
    public static remove (name: string) {
        if (effects[name]) { delete effects[name]; return; }
        for (const n in effects) {
            if (effects[n]._uuid === name) {
                delete effects[n];
                return;
            }
        }
    }
    public static get (name: string) {
        if (effects[name]) { return effects[name]; }
        for (const n in effects) {
            if (effects[n]._uuid === name) {
                return effects[n];
            }
        }
        return null;
    }
    public static getAll () { return effects; }
    protected static _effects: Record<string, EffectAsset> = {};

    @property
    public techniques: ITechniqueInfo[] = [];

    @property
    public shaders: IShaderInfo[] = [];

    public onLoaded () {
        this.shaders.forEach((s) => programLib.define(s));
        EffectAsset.register(this);
    }
}

cc.EffectAsset = EffectAsset;
