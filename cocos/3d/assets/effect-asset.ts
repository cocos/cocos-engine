import Asset from '../../assets/CCAsset';
import { ccclass, property } from '../../core/data/class-decorator';
import { PassInfo } from '../../renderer/core/pass';

const effects: { [name: string]: EffectAsset } = {};

interface TechniqueInfo {
    passes: PassInfo[];
    queue?: number;
    priority?: number;
    lod?: number;
}

interface PropertyMap {
    [name: string]: {
        type: number,
        value: number | number[] | null,
    };
}

interface ShaderInfo {
    name: string;
    vert: string; frag: string;
    vert1: string; frag1: string;
    defines: Array<{
        name: string;
        type: string;
        defines: string[];
    }>;
    uniforms: Array<{
        name: string;
        type: string;
        binding: number;
        defines: string[];
    } | {
        blockName: string;
        binding: number;
        defines: string[];
        members: Array< { name: string, type: number } >
    }>;
    attributes: Array<{
        name: string;
        type: string;
        defines: string[];
    }>;
    extensions: Array<{
        name: string;
        define: string;
    }>;
}

@ccclass('cc.EffectAsset')
class EffectAsset extends Asset {
    public static register(asset: EffectAsset) {effects[asset.name] = asset; }
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
    public properties: PropertyMap = {};

    @property
    public shaders: ShaderInfo[] = [];

    public onLoaded() {
        const lib = cc.game._renderer._programLib;
        this.shaders.forEach((s) => lib.define(s));
        EffectAsset.register(this);
    }
}

export default EffectAsset;
cc.EffectAsset = EffectAsset;
