// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import config from '../config';
import enums from '../enums';
import Pass from './pass';
import Technique from './technique';
import { Vec2, Vec3, Vec4, Color, Mat4 } from '../../core/value-types';
import { CCObject } from '../../core/data';
import gfx from '../gfx';
const { Texture2D, TextureCube } = gfx;

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
let typeTest = function(value, type) {
    let instanceType = getInstanceType(type);
    switch (typeof value) {
    case 'object': return (value === null) || (value instanceof instanceType);
    case 'number': return instanceType === Number;
    default: return false;
    }
};

class Effect {
    /**
     * @param {Array} techniques
     */
    constructor(techniques, properties = {}, defines = [], dependencies = []) {
        this._techniques = techniques;
        this._properties = properties;
        this._defines = defines;
        this._dependencies = dependencies;

        // TODO: check if params is valid for current technique???
    }

    clear() {
        this._techniques.length = 0;
        this._properties = null;
        this._defines.length = 0;
    }

    getTechnique(stage) {
        let stageID = config.stageID(stage);
        if (stageID === -1) {
            return null;
        }

        for (let i = 0; i < this._techniques.length; ++i) {
            let tech = this._techniques[i];
            if (tech.stageIDs & stageID) {
                return tech;
            }
        }

        return null;
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
        } else if (!typeTest(value, prop.type)) {
            console.warn(`Failed to set property ${name}, property type mismatch.`);
            return;
        }
        this._properties[name].value = value;
    }

    getDefine(name) {
        for (let i = 0; i < this._defines.length; ++i) {
            let def = this._defines[i];
            if (def.name === name) {
                return def.value;
            }
        }

        console.warn(`Failed to get define ${name}, define not found.`);
        return null;
    }

    define(name, value) {
        for (let i = 0; i < this._defines.length; ++i) {
            let def = this._defines[i];
            if (def.name === name) {
                def.value = value;
                return;
            }
        }

        console.warn(`Failed to set define ${name}, define not found.`);
    }

    extractDefines(out = {}) {
        for (let i = 0; i < this._defines.length; ++i) {
            let def = this._defines[i];
            out[def.name] = def.value;
        }

        return out;
    }

    extractDependencies(out = {}) {
        for (let i = 0; i < this._dependencies.length; ++i) {
            let dep = this._dependencies[i];
            out[dep.define] = dep.extension;
        }

        return out;
    }
}

let cloneObjArray = function(val) { return val.map(obj => Object.assign({}, obj)); };

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

let getInvolvedPrograms = function(json) {
    let programs = [], lib = cc.game._renderer._programLib;
    json.techniques.forEach(tech => {
        tech.passes.forEach(pass => {
            programs.push(lib.getTemplate(pass.program));
        });
    });
    return programs;
};
let parseProperties = function(json, programs) {
    let props = {};
    for (let prop in json.properties) {
        let info = json.properties[prop], type;
        // always try getting the type from shaders first
        if (info.tech !== undefined && info.pass !== undefined) {
            let pname = json.techniques[info.tech].passes[info.pass].program;
            let program = programs.find(p => p.name === pname);
            type = program.uniforms.find(u => u.name === prop);
        } else {
            for (let i = 0; i < programs.length; i++) {
                type = programs[i].uniforms.find(u => u.name === prop);
                if (type) break;
            }
        }
        // the property is not defined in all the shaders used in techs
        if (!type) {
            console.warn(`illegal property: ${prop}`);
            continue;
        }
        // TODO: different param with same name for different passes
        // TODO: property alias (display name)
        props[prop] = getInstanceCtor(info.type || type)(info.value);
    }
    return props;
};

Effect.getPropertyClassName = function(json) {
    return `cc.Effect.${json._uuid}.Props`;
};

Effect.getDefineClassName = function(json) {
    return `cc.Effect.${json._uuid}.Defines`;
};

Effect.registerEffect = function(json) {
    let programs = getInvolvedPrograms(json);
    let properties = parseProperties(json, programs), defines = {};
    // add all the defines too, for now
    programs.forEach(program => {
        program.defines.forEach(define => {
            defines[define.name] = getInstanceCtor(define.type)();
        });
    });
    cc.Class({
        name: Effect.getPropertyClassName(json),
        properties,
    });
    cc.Class({
        name: Effect.getDefineClassName(json),
        properties: defines,
    });
};

Effect.parseEffect = function(json) {
    let programs = getInvolvedPrograms(json);
    // techniques
    let techNum = json.techniques.length;
    let techniques = new Array(techNum);
    for (let j = 0; j < techNum; ++j) {
        let tech = json.techniques[j];
        let passNum = tech.passes.length;
        let passes = new Array(passNum);
        for (let k = 0; k < passNum; ++k) {
            let pass = tech.passes[k];
            passes[k] = new Pass(pass.program);
            passes[k].setDepth(pass.depthTest, pass.depthWrite, pass.depthFunc);
            passes[k].setCullMode(pass.cullMode);
            if (pass.blend) passes[k].setBlend(pass.blendEq, pass.blendSrc,
                pass.blendDst, pass.blendAlphaEq, pass.blendSrcAlpha, pass.blendDstAlpha, pass.blendColor);
            if (pass.stencilTest) {
                passes[k].setStencilFront(pass.stencilFuncFront, pass.stencilRefFront, pass.stencilMaskFront,
                    pass.stencilFailOpFront, pass.stencilZFailOpFront, pass.stencilZPassOpFront, pass.stencilWriteMaskFront);
                passes[k].setStencilBack(pass.stencilFuncBack, pass.stencilRefBack, pass.stencilMaskBack,
                    pass.stencilFailOpBack, pass.stencilZFailOpBack, pass.stencilZPassOpBack, pass.stencilWriteMaskBack);
            }
        }
        techniques[j] = new Technique(tech.stages, passes, tech.layer);
    }
    // uniforms
    let props = parseProperties(json, programs), uniforms = {};
    programs.forEach(p => {
        p.uniforms.forEach(u => {
            let name = u.name, uniform = uniforms[name] = Object.assign({}, u);
            // user defined type override
            if (props[name]) uniform.type = json.properties[name].type;
            uniform.value = props[name] || getInstanceCtor(u.type)();
        });
    });
    // defines
    let defines = programs.reduce((acc, cur) => acc = acc.concat(cur.defines), []);
    defines = cloneObjArray(defines);
    defines.forEach(d => d.value = getInstanceCtor(d.type)());
    // extensions
    let extensions = programs.reduce((acc, cur) => acc = acc.concat(cur.extensions), []);
    extensions = cloneObjArray(extensions);

    return new Effect(techniques, uniforms, defines, extensions);
};

if (CC_EDITOR) {
    Effect.parseType = function(json) {
        let lib = cc.game._renderer._programLib, types = {};
        let props = json.properties;
        json.techniques.forEach(tech => {
            tech.passes.forEach(pass => {
                let program = lib.getTemplate(pass.program);
                program.defines.forEach(define => {
                    types[define.name] = getInstanceType(define.type);
                });
                program.uniforms.forEach(uniform => {
                    let name = uniform.name, prop = props[name];
                    if (!prop) return; // don't add if not in the property list
                    types[name] = getInstanceType(prop.type || uniform.type);
                });
            });
        });
        return types;
    };
}

export default Effect;
cc.Effect = Effect;
