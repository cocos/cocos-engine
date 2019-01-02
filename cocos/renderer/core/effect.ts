// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import EffectAsset from '../../3d/assets/effect-asset';
import { CCObject } from '../../core/data';
import { Color, Mat4, Vec2, Vec3, Vec4 } from '../../core/value-types';
import enums from '../enums';
import Texture2D from '../gfx/texture-2d';
import TextureCube from '../gfx/texture-cube';
import { Pass } from './pass';
import Technique from './technique';

const _typeMap = {
    [enums.PARAM_INT]: 'Number',
    [enums.PARAM_INT2]: Vec2,
    [enums.PARAM_INT3]: Vec3,
    [enums.PARAM_INT4]: Vec4,
    [enums.PARAM_FLOAT]: 'Number',
    [enums.PARAM_FLOAT2]: Vec2,
    [enums.PARAM_FLOAT3]: Vec3,
    [enums.PARAM_FLOAT4]: Vec4,
    [enums.PARAM_COLOR3]: Color,
    [enums.PARAM_COLOR4]: Color,
    [enums.PARAM_MAT4]: Mat4,
    [enums.PARAM_TEXTURE_2D]: Texture2D,
    [enums.PARAM_TEXTURE_CUBE]: TextureCube,
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
    default: return false;
    }
};

let _globalTechLod = 600;

const _ctorMap = {
    ['Number']: (v?: number) => v || 0,
    ['Boolean']: (v?: boolean) => v || false,
    [Vec2]: (v?: number[]) => v ? new Vec2(v[0], v[1]) : new Vec2(),
    [Vec3]: (v?: number[]) => v ? new Vec3(v[0], v[1], v[2]) : new Vec3(),
    [Vec4]: (v?: number[]) => v ? new Vec4(v[0], v[1], v[2], v[3]) : new Vec4(),
    [Color]: (v?: number[]) => v ? new Color(v[0] * 255, v[1] * 255, v[2] * 255,
        (v[3] || 1) * 255) : new Color(),
    [Mat4]: (v?: number[]) => v ? new Mat4(
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
    const programs: Programs = {};
    const lib = cc.game._renderer._programLib;
    effect.techniques.forEach((tech) => {
        tech.passes.forEach((pass) => {
            programs[pass.program] = lib.getTemplate(pass.program);
        });
    });
    return programs;
};

const parseProperties = (() => {
    function genPropInfo(displayName: string, type: number, value: any) {
        return {
            type,
            displayName,
            instanceType: getInstanceType(type),
            value: getInstanceCtor(type)(value),
        };
    }
    return (effect: EffectAsset, programs: Programs) => {
        const props = {};
        // properties may be specified in the shader too
        for (const p of Object.keys(programs)) {
            programs[p].uniforms.forEach((prop) => {
                if (!prop.property) { return; }
                props[prop.name] = genPropInfo(prop.displayName, prop.type, prop.value);
            });
        }
        for (const prop of Object.keys(effect.properties)) {
            const propInfo = effect.properties[prop];
            let uniformInfo;
            // always try getting the type from shaders first
            if (propInfo.tech !== undefined && propInfo.pass !== undefined) {
                const pname = effect.techniques[propInfo.tech].passes[propInfo.pass].program;
                uniformInfo = programs[pname].uniforms.find((u) => u.name === prop);
            } else {
                for (const p of Object.keys(programs)) {
                    uniformInfo = programs[p].uniforms.find((u) => u.name === prop);
                    if (uniformInfo) { break; }
                }
            }
            // the property is not defined in all the shaders used in techs
            if (!uniformInfo) {
                console.warn(`illegal property: ${prop}`);
                continue;
            }
            // TODO: different param with same name for different passes
            props[prop] = genPropInfo(
                propInfo.displayName || uniformInfo.displayName,
                propInfo.type || uniformInfo.type,
                propInfo.value || uniformInfo.value);
        }
        return props;
    };
})();

const parseEffect = (effect: EffectAsset) => {
    // techniques
    const techNum = effect.techniques.length;
    const programs = getInvolvedPrograms(effect);
    const techniques = new Array(techNum);
    let tech;
    for (let j = 0; j < techNum; ++j) {
        tech = effect.techniques[j];
        const passNum = tech.passes.length;
        const passes = new Array(passNum);
        for (let k = 0; k < passNum; ++k) {
            const passInfo = tech.passes[k];
            passInfo.device = cc.game._renderContext;
            passes[k] = Pass.create(passInfo);
        }
        techniques[j] = new Technique(tech.queue, tech.priority, tech.lod, passes);
    }
    // uniforms
    const props = parseProperties(effect, programs);
    const uniforms = {};
    for (const pn of Object.keys(programs)) {
        programs[pn].uniforms.forEach((u) => {
            const prop = props[u.name];
            uniforms[u.name] = {
                type: prop ? prop.type : u.type,
                value: prop ? prop.value : getInstanceCtor(u.type)(u.value),
            };
        });
    }

    return new Effect(effect.name, techniques, programs, uniforms);
};

let parseForInspector = (effect: EffectAsset) => {};

if (CC_EDITOR) {
    parseForInspector = (effect: EffectAsset) => {
        const programs = getInvolvedPrograms(effect);
        const props = parseProperties(effect, programs);
        const defines = {};
        for (const pn of Object.keys(programs)) {
            programs[pn].uniforms.forEach((u) => {
                const prop = props[u.name];
                if (!prop) { return; }
                prop.defines = u.defines;
            });
            programs[pn].defines.forEach((define) => {
                defines[define.name] = {
                    instanceType: getInstanceType(define.type),
                    value: getInstanceCtor(define.type)(),
                    defines: define.defines,
                };
            });
        }
        return { props, defines };
    };
}

interface PropertyMap {
    [name: string]: { type: number, value: any };
}
interface DefineMap {
    [name: string]: number | boolean;
}
interface DependencyMap {
    [define: string]: string;
}
interface ProgramInfo {
    uniforms: Array< { name: string, type: string } >;
    defines: Array< { name: string, type: string } >;
    extensions: Array< { name: string, define: string } >;
}
interface Programs {
    [name: string]: ProgramInfo;
}

class Effect {
    public static parseEffect = parseEffect;
    public static parseForInspector = parseForInspector;
    public static setGlobalLod(lod: number) { _globalTechLod = lod; }

    protected _name: string = '';
    protected _techniques: Technique[] = [];
    protected _properties: PropertyMap = {};
    protected _programs: Programs = {};
    protected _defines: DefineMap = {};
    protected _dependencies: DependencyMap = {};
    protected _maxLOD: number = 0;
    protected _activeTechIdx: number = 0;

    constructor(name: string, techniques: Technique[], programs: Programs, properties: PropertyMap = {}, lod = -1) {
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
            if (this._techniques[i]._lod <= lod) {
                this._activeTechIdx = i;
                break;
            }
        }

        // defines
        this._defines = {};
        this._techniques[this._activeTechIdx].passes.forEach((pass) =>
            this._programs[pass._programName].defines.forEach((def) =>
            this._defines[def.name] = getInstanceCtor(def.type)()));

        // extensions
        this._dependencies = {};
        this._techniques[this._activeTechIdx].passes.forEach((pass) => this._programs[pass._programName].extensions
            .filter((ext) => ext.define).forEach((ext) => this._dependencies[ext.define] = ext.name));
    }
}

export default Effect;
cc.Effect = Effect;
