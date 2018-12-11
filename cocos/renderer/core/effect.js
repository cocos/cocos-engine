// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import enums from '../enums';
import Pass from './pass';
import Technique from './technique';
import { Vec2, Vec3, Vec4, Color, Mat4 } from '../../core/value-types';
import { CCObject } from '../../core/data';
import Texture2D from '../../assets/CCTexture2D';
import TextureCube from '../../3d/assets/texture-cube';

let _typeMap = {
    [enums.PARAM_INT]: Number,
    [enums.PARAM_INT2]: Vec2,
    [enums.PARAM_INT3]: Vec3,
    [enums.PARAM_INT4]: Vec4,
    [enums.PARAM_FLOAT]: Number,
    [enums.PARAM_FLOAT2]: Vec2,
    [enums.PARAM_FLOAT3]: Vec3,
    [enums.PARAM_FLOAT4]: Vec4,
    [enums.PARAM_COLOR3]: Color,
    [enums.PARAM_COLOR4]: Color,
    [enums.PARAM_MAT4]: Mat4,
    [enums.PARAM_TEXTURE_2D]: Texture2D,
    [enums.PARAM_TEXTURE_CUBE]: TextureCube,
    number: Number,
    boolean: Boolean,
    default: CCObject
};
let getInstanceType = function(t) { return _typeMap[t] || _typeMap.default; };
let typeCheck = function(value, type) {
    let instanceType = getInstanceType(type);
    switch (typeof value) {
    case 'object': return (value === null) || (value instanceof instanceType);
    case 'number': return instanceType === Number;
    default: return false;
    }
};

let _globalTechLod = 600;

class Effect {
    /**
     * @param {Array} techniques
     */
    constructor(techniques, programs, properties = {}, lod = -1) {
        this._techniques = techniques;
        this._properties = properties;
        this._programs = programs;
        this._defines = {};
        this._dependencies = {};
        this._maxLOD = lod;
        this.selectTechnique();
    }

    set LOD(lod) {
        if (lod === this._maxLOD) {
            return;
        }
        this._maxLOD = lod;
        this.selectTechnique();
    }

    clear() {
        this._techniques.length = 0;
        this._properties = {};
        this._defines = {};
        this._dependencies.length = 0;
    }

    getTechnique(index) {
        if (index < 0 || index >= this._techniques.length)
            return null;
        return this._techniques[index];
    }

    getProperty(name) {
        if (!this._properties[name]) {
            console.warn(`Failed to get property ${name}, property not found.`);
            return null;
        }
        return this._properties[name].value;
    }

    setProperty(name, value) {
        let prop = this._properties[name];
        if (!prop) {
            console.warn(`Failed to set property ${name}, property not found.`);
            return;
        }
        // else if (!typeCheck(value, prop.type)) { // re-enable this after 3.x migration
        //     console.warn(`Failed to set property ${name}, property type mismatch.`);
        //     return;
        // }
        this._properties[name].value = value;
    }

    getDefine(name) {
        let def = this._defines[name];
        if (def !== undefined) return def;
        console.warn(`Failed to get define ${name}, define not found.`);
        return null;
    }

    define(name, value) {
        if (this._defines[name] !== undefined) this._defines[name] = value;
        else console.warn(`Failed to set define ${name}, define not found.`);
    }

    extractDefines(out = {}) {
        return Object.assign(out, this._defines);
    }

    extractDependencies(out = {}) {
        return Object.assign(out, this._dependencies);
    }

    getActiveTechnique() {
        return this._techniques[this._activeTechIdx];
    }

    selectTechnique() {
        let lod = this._maxLOD === -1 ? _globalTechLod : this._maxLOD;
        this._activeTechIdx = 0;
        for (let i = 0; i < this._techniques.length; i++) {
            if (this._techniques[i]._lod <= lod) {
                this._activeTechIdx = i;
                break;
            }
        }

        // defines
        this._defines = {};
        this._techniques[this._activeTechIdx].passes.forEach(pass => this._programs[pass._programName].defines.forEach(def =>
            this._defines[def.name] = getInstanceCtor(def.type)()));

        // extensions
        this._dependencies = {};
        this._techniques[this._activeTechIdx].passes.forEach(pass => this._programs[pass._programName].extensions
            .filter(ext => ext.define).forEach(ext => this._dependencies[ext.define] = ext.name));
    }

    static setGlobalLod(lod) {
        _globalTechLod = lod;
    }
}

let _ctorMap = {
    [Number]: v => v || 0,
    [Boolean]: v => v || false,
    [Vec2]: v => v ? cc.v2(v[0], v[1]) : cc.v2(),
    [Vec3]: v => v ? cc.v3(v[0], v[1], v[2]) : cc.v3(),
    [Vec4]: v => v ? cc.v4(v[0], v[1], v[2], v[3]) : cc.v4(),
    [Color]: v => v ? cc.color(v[0] * 255, v[1] * 255, v[2] * 255,
        (v[3] || 1) * 255) : cc.color(),
    [Mat4]: v => v ? cc.mat4(
            v[0],  v[1],  v[2],  v[3],
            v[4],  v[5],  v[6],  v[7],
            v[8],  v[9],  v[10], v[11],
            v[12], v[13], v[14], v[15],
        ) : cc.mat4(),
    [Texture2D]: () => null,
    [TextureCube]: () => null,
    [CCObject]: () => null
};
let getInstanceCtor = function(t) { return _ctorMap[getInstanceType(t)]; };

let getInvolvedPrograms = function(effect) {
    let programs = {}, lib = cc.game._renderer._programLib;
    effect.techniques.forEach(tech => {
        tech.passes.forEach(pass => {
            programs[pass.program] = lib.getTemplate(pass.program);
        });
    });
    return programs;
};

let parseProperties = (function() {
    function genPropInfo(displayName, type, value) {
        return {
            type: type,
            displayName: displayName,
            instanceType: getInstanceType(type),
            value: getInstanceCtor(type)(value)
        };
    }
    return function(effect, programs) {
        let props = {};
        // properties may be specified in the shader too
        for (let p in programs) {
            programs[p].uniforms.forEach(prop => {
                if (!prop.property) return;
                props[prop.name] = genPropInfo(prop.displayName, prop.type, prop.value);
            });
        }
        for (let prop in effect.properties) {
            let propInfo = effect.properties[prop], uniformInfo;
            // always try getting the type from shaders first
            if (propInfo.tech !== undefined && propInfo.pass !== undefined) {
                let pname = effect.techniques[propInfo.tech].passes[propInfo.pass].program;
                uniformInfo = programs[pname].uniforms.find(u => u.name === prop);
            } else {
                for (let p in programs) {
                    uniformInfo = programs[p].uniforms.find(u => u.name === prop);
                    if (uniformInfo) break;
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

Effect.parseEffect = function(effect) {
    // techniques
    let techNum = effect.techniques.length, tech;
    let programs = getInvolvedPrograms(effect);
    let techniques = new Array(techNum);
    for (let j = 0; j < techNum; ++j) {
        tech = effect.techniques[j];
        let passNum = tech.passes.length;
        let passes = new Array(passNum);
        for (let k = 0; k < passNum; ++k) {
            let pass = tech.passes[k];
            passes[k] = new Pass(pass.program);
            passes[k].setStage(pass.stage);
            passes[k].setDepth(pass.depthTest, pass.depthWrite, pass.depthFunc);
            passes[k].setCullMode(pass.cullMode);
            passes[k].setBlend(pass.blend, pass.blendEq, pass.blendSrc,
                pass.blendDst, pass.blendAlphaEq, pass.blendSrcAlpha, pass.blendDstAlpha, pass.blendColor);
            passes[k].setStencilFront(pass.stencilTest, pass.stencilFuncFront, pass.stencilRefFront, pass.stencilMaskFront,
                pass.stencilFailOpFront, pass.stencilZFailOpFront, pass.stencilZPassOpFront, pass.stencilWriteMaskFront);
            passes[k].setStencilBack(pass.stencilTest, pass.stencilFuncBack, pass.stencilRefBack, pass.stencilMaskBack,
                pass.stencilFailOpBack, pass.stencilZFailOpBack, pass.stencilZPassOpBack, pass.stencilWriteMaskBack);
        }
        techniques[j] = new Technique(tech.queue, tech.priority, tech.lod, passes);
    }
    // uniforms
    let props = parseProperties(effect, programs), uniforms = {};
    for (let pn in programs) {
        programs[pn].uniforms.forEach(u => {
            let name = u.name, uniform = uniforms[name] = Object.assign({}, u);
            uniform.value = getInstanceCtor(u.type)(u.value);
            if (props[name]) { // effect info override
                uniform.type = props[name].type;
                uniform.value = props[name].value;
            }
        });
    }

    let parsedEffect = new Effect(techniques, programs, uniforms);
    return parsedEffect;
};

if (CC_EDITOR) {
    Effect.parseForInspector = function(effect) {
        let programs = getInvolvedPrograms(effect);
        let props = parseProperties(effect, programs), defines = {};
        for (let pn in programs) {
            programs[pn].defines.forEach(define => {
                defines[define.name] = {
                    instanceType: getInstanceType(define.type),
                    value: getInstanceCtor(define.type)()
                };
            });
        }
        return { props, defines };
    };
}

export default Effect;
cc.Effect = Effect;
