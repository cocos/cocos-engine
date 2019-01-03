// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { EffectAsset, PropertyInfo, ShaderInfo } from '../../3d/assets/effect-asset';
import { CCObject } from '../../core/data';
import { Color, Mat4, Vec2, Vec3, Vec4 } from '../../core/value-types';
import { GFXType } from '../../gfx/define';
import Texture2D from '../gfx/texture-2d';
import TextureCube from '../gfx/texture-cube';
import { PassStage } from './constants';
import { Pass, PassInfo } from './pass';
import Technique from './technique';

const _typeMap = {
    [GFXType.INT]: 'Number',
    [GFXType.INT2]: Vec2,
    [GFXType.INT3]: Vec3,
    [GFXType.INT4]: Vec4,
    [GFXType.FLOAT]: 'Number',
    [GFXType.FLOAT2]: Vec2,
    [GFXType.FLOAT3]: Vec3,
    [GFXType.FLOAT4]: Vec4,
    [GFXType.COLOR4]: Color,
    [GFXType.MAT4]: Mat4,
    [GFXType.SAMPLER2D]: Texture2D,
    [GFXType.SAMPLER_CUBE]: TextureCube,
    number: 'Number',
    boolean: 'Boolean',
    default: CCObject,
};
const getInstanceType = (t: number | string) => _typeMap[t] || _typeMap.default;
const typeCheck = (value: any, type: number) => {
    const instanceType = getInstanceType(type);
    switch (typeof value) {
    case 'object': return (value === null) || (value instanceof instanceType);
    case 'number': return instanceType === 'Number';
    case 'boolean': return instanceType === 'Boolean';
    default: return false;
    }
};

const createPass = () => {

};

let _globalTechLod = 600;

type PropValue = number | boolean | Vec2 | Vec3 | Vec4 | Color | Mat4 | Texture2D | TextureCube | null;
interface PropertyMap { [name: string]: { type: number, value: PropValue }; }
interface DefineMap { [name: string]: number | boolean; }
interface DependencyMap { [name: string]: string; }

interface ProgramMap { [name: string]: ShaderInfo; }

class Effect {
    public static parseEffect(effect: EffectAsset, defines: DefineMap) { return new Effect(); }
    public static parseForInspector(effect: EffectAsset) { return { props: {}, defines: {} }; }
    public static setGlobalLod(lod: number) { _globalTechLod = lod; }

    protected _name: string = '';
    protected _techniques: Technique[] = [];
    protected _properties: PropertyMap = {};
    protected _defines: DefineMap = {};
    protected _dependencies: DependencyMap = {};

    protected _maxLOD: number = 0;
    protected _activeTechIdx: number = 0;
    protected _programs: ProgramMap = {};

    constructor(
        name: string = '',
        techniques: Technique[] = [new Technique()],
        programs: ProgramMap = {},
        properties: PropertyMap = {},
        lod = -1
    ) {
        this._name = name;
        this._techniques = techniques;
        this._properties = properties;
        this._programs = programs;
        this._defines = {};
        this._dependencies = {};
        this._maxLOD = lod;
        this.selectTechnique();
    }

    set LOD(lod: number) {
        if (lod === this._maxLOD) {
            return;
        }
        this._maxLOD = lod;
        this.selectTechnique();
    }

    public clear() {
        this._techniques.length = 0;
        this._properties = {};
        this._defines = {};
        this._dependencies = {};
    }

    public getTechnique(index: number) {
        if (index < 0 || index >= this._techniques.length) { return null; }
        return this._techniques[index];
    }

    public getProperty(name: string) {
        if (!this._properties[name]) {
            console.warn(`Failed to get property ${name}, property not found.`);
            return null;
        }
        return this._properties[name].value;
    }

    public setProperty(name: string, value: any) {
        const prop = this._properties[name];
        if (!prop) {
            console.warn(`Failed to set property ${name}, property not found.`);
            return;
        } else if (!typeCheck(value, prop.type)) {
            console.warn(`Failed to set property ${name}, property type mismatch.`);
            return;
        }
        this._properties[name].value = value;
    }

    public getDefine(name: string) {
        const def = this._defines[name];
        if (def !== undefined) { return def; }
        console.warn(`Failed to get define ${name}, define not found.`);
        return null;
    }

    public define(name: string, value: number | boolean) {
        if (this._defines[name] !== undefined) {
            this._defines[name] = value;
        } else {
            console.warn(`Failed to set define ${name}, define not found.`);
        }
    }

    public extractDefines(out = {}) {
        return Object.assign(out, this._defines);
    }

    public extractDependencies(out = {}) {
        return Object.assign(out, this._dependencies);
    }

    public getActiveTechnique() {
        return this._techniques[this._activeTechIdx];
    }

    public selectTechnique() {
        const lod = this._maxLOD === -1 ? _globalTechLod : this._maxLOD;
        this._activeTechIdx = 0;
        for (let i = 0; i < this._techniques.length; i++) {
            if (this._techniques[i].LOD <= lod) {
                this._activeTechIdx = i;
                break;
            }
        }
        // defines
        this._defines = {};
        this._techniques[this._activeTechIdx].passes.forEach((pass) =>
            this._programs[pass.programName].defines.forEach((def) =>
            this._defines[def.name] = def.type === 'number' ? 0 : false));
        // extensions
        this._dependencies = {};
        this._techniques[this._activeTechIdx].passes.forEach((pass) =>
            Object.assign(this._dependencies, this._programs[pass.programName].dependencies));
    }
}

type DefaultValue = number | boolean | number[] | null;
const _ctorMap = {
    Number: (v?: DefaultValue) => v || 0,
    Boolean: (v?: DefaultValue) => v || false,
    [Vec2]: (v?: DefaultValue) => Array.isArray(v) ? new Vec2(v[0], v[1]) : new Vec2(),
    [Vec3]: (v?: DefaultValue) => Array.isArray(v) ? new Vec3(v[0], v[1], v[2]) : new Vec3(),
    [Vec4]: (v?: DefaultValue) => Array.isArray(v) ? new Vec4(v[0], v[1], v[2], v[3]) : new Vec4(),
    [Color]: (v?: DefaultValue) => Array.isArray(v) ? new Color(v[0] * 255, v[1] * 255, v[2] * 255,
        (v[3] || 1) * 255) : new Color(),
    [Mat4]: (v?: DefaultValue) => Array.isArray(v) ? new Mat4(
            v[0],  v[1],  v[2],  v[3],
            v[4],  v[5],  v[6],  v[7],
            v[8],  v[9],  v[10], v[11],
            v[12], v[13], v[14], v[15]
        ) : new Mat4(),
    [Texture2D]: () => null,
    [TextureCube]: () => null,
    [CCObject]: () => null,
};
const getInstanceCtor = (t: number | string) => _ctorMap[getInstanceType(t)];

const getInvolvedPrograms = (effect: EffectAsset) => {
    const programs: ProgramMap = {};
    const lib = cc.game._programLib;
    effect.techniques.forEach((tech) => {
        tech.passes.forEach((pass) => {
            programs[pass.program] = lib.getTemplate(pass.program);
        });
    });
    return programs;
};

interface ExtractedPropInfo {
    type: number;
    instanceType: object | string;
    value: number | boolean | object;
    defines: string[];
    displayName?: string;
}
const parseProperties = (() => {
    interface UniformInfo { type: number; defines: string[]; }
    function genPropInfo(propInfo: PropertyInfo, uniformInfo: UniformInfo): ExtractedPropInfo {
        const type = propInfo.type || uniformInfo.type;
        return {
            type,
            instanceType: getInstanceType(type),
            value: getInstanceCtor(type)(propInfo.value),
            displayName: propInfo.displayName,
            defines: uniformInfo.defines,
        };
    }
    function findUniformInfo(program: ShaderInfo, name: string) {
        for (const b of program.blocks) {
            const i = b.members.find((u) => u.name === name);
            if (i) { return Object.assign({ defines: b.defines }, i); }
        }
        return program.samplers.find((u) => u.name === name);
    }
    return (effect: EffectAsset, programs: ProgramMap) => {
        const props: { [name: string]: ExtractedPropInfo } = {};
        for (const prop of Object.keys(effect.properties)) {
            const propInfo = effect.properties[prop];
            let uniformInfo: UniformInfo | undefined;
            // always try getting the type from shaders first
            if (propInfo.tech !== undefined && propInfo.pass !== undefined) {
                const p = effect.techniques[propInfo.tech].passes[propInfo.pass].program;
                uniformInfo = findUniformInfo(programs[p], prop);
            } else {
                for (const p of Object.keys(programs)) {
                    uniformInfo = findUniformInfo(programs[p], prop);
                    if (uniformInfo) { break; }
                }
            }
            // the property is not defined in all the shaders used in techs
            if (!uniformInfo) {
                console.warn(`illegal property: ${prop}`);
                continue;
            }
            // TODO: different param with same name for different passes
            props[prop] = genPropInfo(propInfo, uniformInfo);
        }
        return props;
    };
})();

Effect.parseEffect = (effect: EffectAsset, defines: DefineMap) => {
    // techniques
    const techNum = effect.techniques.length;
    const techniques = new Array<Technique>(techNum);
    const programs = getInvolvedPrograms(effect);
    for (let j = 0; j < techNum; ++j) {
        const tech = effect.techniques[j];
        const passNum = tech.passes.length;
        const passes: Pass[] = new Array(passNum);
        for (let k = 0; k < passNum; ++k) {
            const passInfo = <PassInfo>tech.passes[k];
            passInfo.shader = cc.game._programLib.getGFXShader(passInfo.program, defines);
            passInfo.renderPass = cc.director.root.pipeline.getRenderPass(passInfo.stage || PassStage.DEFAULT);
            passInfo.blocks = programs[passInfo.program].blocks;
            passInfo.samplers = programs[passInfo.program].samplers;
            const pass = new Pass(cc.game._gfxDevice);
            pass.initialize(passInfo);
            passes[k] = pass;
        }
        techniques[j] = new Technique(tech.queue, tech.priority, tech.lod, passes);
    }
    // uniforms
    const props = parseProperties(effect, programs);
    const uniforms = {};
    for (const pn of Object.keys(programs)) {
        programs[pn].blocks.forEach((b) => b.members.forEach((u) => {
            const prop = props[u.name];
            uniforms[u.name] = {
                type: prop ? prop.type : u.type,
                value: prop ? prop.value : getInstanceCtor(u.type)(),
            };
        }));
    }

    return new Effect(effect.name, techniques, programs, uniforms);
};

if (CC_EDITOR) {
    Effect.parseForInspector = (effect: EffectAsset) => {
        const programs = getInvolvedPrograms(effect);
        const props = parseProperties(effect, programs);
        const defines: { [name: string]: ExtractedPropInfo } = {};
        for (const pn of Object.keys(programs)) {
            programs[pn].defines.forEach((define) => {
                defines[define.name] = {
                    type: (define.type === 'number' ? GFXType.INT : GFXType.BOOL),
                    instanceType: getInstanceType(define.type),
                    value: getInstanceCtor(define.type)(),
                    defines: define.defines,
                };
            });
        }
        return { props, defines };
    };
}

export default Effect;
cc.Effect = Effect;
