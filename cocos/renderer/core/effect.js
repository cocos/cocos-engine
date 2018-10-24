// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import config from '../config';
import enums from '../enums';
import Pass from './pass';
import Technique from './technique';

let cloneObjArray = function(val) { return val.map(obj => Object.assign({}, obj)); };

let _ctorMap = {
    Number: { type: Number, ctor: v => v || 0 },
    Vec2: { type: cc.Vec2, ctor: v => v ? cc.v2(v[0], v[1]) : cc.v2() },
    Vec3: { type: cc.Vec3, ctor: v => v ? cc.v3(v[0], v[1], v[2]) : cc.v3() },
    Vec4: { type: cc.Vec4, ctor: v => v ? cc.v4(v[0], v[1], v[2], v[3]) : cc.v4() },
    Color: { type: cc.Color, ctor: v => v ? cc.color(v[0] * 255, v[1] * 255, v[2] * 255,
        (v[3] || 1) * 255) : cc.color() },
    Mat4: { type: cc.Mat4, ctor: v => v ? cc.mat4(
            v[0],  v[1],  v[2],  v[3],
            v[4],  v[5],  v[6],  v[7],
            v[8],  v[9],  v[10], v[11],
            v[12], v[13], v[14], v[15],
        ) : cc.mat4() },
    Texture2D: { type: cc.Texture2D, ctor: () => null },
    TextureCube: { type: cc.TextureCube, ctor: () => null },
};
let _typeMap = {
    [enums.PARAM_INT]: _ctorMap.Number,
    [enums.PARAM_INT2]: _ctorMap.Vec2,
    [enums.PARAM_INT3]: _ctorMap.Vec3,
    [enums.PARAM_INT4]: _ctorMap.Vec4,
    [enums.PARAM_FLOAT]: _ctorMap.Number,
    [enums.PARAM_FLOAT2]: _ctorMap.Vec2,
    [enums.PARAM_FLOAT3]: _ctorMap.Vec3,
    [enums.PARAM_FLOAT4]: _ctorMap.Vec4,
    [enums.PARAM_COLOR3]: _ctorMap.Color,
    [enums.PARAM_COLOR4]: _ctorMap.Color,
    [enums.PARAM_MAT4]: _ctorMap.Mat4,
    [enums.PARAM_TEXTURE_2D]: _ctorMap.Texture2D,
    [enums.PARAM_TEXTURE_CUBE]: _ctorMap.TextureCube,
    default: { type: cc.Object, ctor: v => v }
};
let getInstanceInfo = function(t) { return _typeMap[t] || _typeMap.default; };

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
        props[prop] = getInstanceInfo(info.type || type).ctor(info.value);
    }
    return props;
};

export default class Effect {
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
        return this._properties[name].value;
    }

    setProperty(name, value) {
        // TODO: check if params is valid for current technique???
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

    static getPropertyClassName(json) {
        return `cc.Effect.${json._uuid}.Props`;
    }

    static parseType(json) {
        let lib = cc.game._renderer._programLib, types = {};
        // load default type from involved shaders
        json.techniques.forEach(tech => {
            tech.passes.forEach(pass => {
                let program = lib.getTemplate(pass.program);
                program.defines.forEach(define => {
                    types[define.name] = (define.type === 'boolean' ? Boolean : Number);
                });
                program.uniforms.forEach(uniform => {
                    types[uniform.name] = getInstanceInfo(uniform.type).type;
                });
            });
        });
        // override types from properties
        for (let prop in json.properties)
            types[prop] = getInstanceInfo(json.properties[prop].type).type;
        return types;
    }

    static registerEffect(json) {
        let programs = getInvolvedPrograms(json);
        let properties = parseProperties(json, programs);
        // add all the defines too, for now
        programs.forEach(program => {
            program.defines.forEach(define => {
                properties[define.name] = define.type === 'boolean' ? false : 0;
            });
        });
        cc.Class({
            name: Effect.getPropertyClassName(json),
            properties,
        });
    }

    static parseEffect(json) {
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
                passes[k].setDepth(pass.depthTest, pass.depthWrite);
                passes[k].setCullMode(pass.cullMode);
                if (pass.blend) passes[k].setBlend(pass.blendEq, pass.blendSrc,
                    pass.blendDst, pass.blendAlphaEq, pass.blendSrcAlpha, pass.blendDstAlpha);
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
                uniform.value = props[name] || getInstanceInfo(u.type).ctor();
            });
        });
        // defines
        let defines = programs.reduce((acc, cur) => acc = acc.concat(cur.defines), []);
        defines = cloneObjArray(defines);
        defines.forEach(d => d.value = (d.type === 'boolean' ? false : 0));
        // extensions
        let extensions = programs.reduce((acc, cur) => acc = acc.concat(cur.extensions), []);
        extensions = cloneObjArray(extensions);

        return new Effect(techniques, uniforms, defines, extensions);
    }
}

cc.Effect = Effect;
