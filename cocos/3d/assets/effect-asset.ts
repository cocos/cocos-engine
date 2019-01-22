import { Asset } from '../../assets/asset';
import { ccclass, property } from '../../core/data/class-decorator';
import { GFXDynamicState, GFXPrimitiveMode } from '../../gfx/define';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { RenderPassStage } from '../../pipeline/define';

export interface IPropertyInfo {
    type: number; // auto-extracted if not specified
    value?: number[] | string;
    displayName?: string;
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
    queue?: number;
    priority?: number;
    lod?: number;
}

export interface IBlockMember {
    name: string;
    type: number;
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
    type: number;
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
    vert: string;
    frag: string;
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
        const lib = cc.game._programLib;
        this.shaders.forEach((s) => lib.define(s));
        EffectAsset.register(this);
    }
}

cc.EffectAsset = EffectAsset;
