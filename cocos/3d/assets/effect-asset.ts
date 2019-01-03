import Asset from '../../assets/CCAsset';
import { ccclass, property } from '../../core/data/class-decorator';
import { PassInfo } from '../../renderer/core/pass';

export interface TechniqueInfo {
    passes: PassInfo[];
    queue?: number;
    priority?: number;
    lod?: number;
}
export interface PropertyInfo {
    type?: number;
    value?: number | number[] | null;
    displayName?: string;
    tech?: number;
    pass?: number;
}

export interface UniformInfo {
    name: string;
    type: number;
    bindingType: number;
    binding: number;
    defines: string[];
    members?: Array< { name: string, type: number } >;
}
export interface DefineInfo {
    name: string;
    type: string;
    defines: string[];
}
export interface ExtensionInfo {
    name: string;
    define: string;
}
export interface ShaderInfo {
    name: string;
    vert: string;
    frag: string;
    defines: DefineInfo[];
    uniforms: UniformInfo[];
    extensions: ExtensionInfo[];
}

const effects: { [name: string]: EffectAsset } = {};

@ccclass('cc.EffectAsset')
export class EffectAsset extends Asset {
    public static register(asset: EffectAsset) { effects[asset.name] = asset; }
    public static remove(name: string) {
        if (effects[name]) { delete effects[name]; return; }
        for (const n in effects) {
            if (effects[n]._uuid === name) {
                delete effects[n];
                return;
            }
        }
    }
    public static get(name: string) {
        if (effects[name]) { return effects[name]; }
        for (const n in effects) {
            if (effects[n]._uuid === name) {
                return effects[n];
            }
        }
    }
    public static getAll() { return effects; }
    protected static _effects: { [name: string]: EffectAsset } = {};

    @property
    public techniques: TechniqueInfo[] = [];

    @property
    public properties: { [name: string]: PropertyInfo } = {};

    @property
    public shaders: ShaderInfo[] = [];

    public onLoaded() {
        const lib = cc.game._programLib;
        this.shaders.forEach((s) => lib.define(s));
        EffectAsset.register(this);
    }
}

cc.EffectAsset = EffectAsset;
