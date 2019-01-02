// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import config from '../config';
import Pass from '../core/pass';
import Technique from '../core/technique';
import { ctor2default, enums2ctor } from '../types';

let getInstanceType = function(t) { return enums2ctor[t] || enums2ctor.default; };
let typeCheck = function(value, type) {
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
    constructor(techniques, properties = {}, defines = {}, dependencies = []) {
        this._techniques = techniques;
        this._properties = properties;
        this._defines = defines;
        this._dependencies = dependencies;

        // TODO: check if params is valid for current technique???
    }

    clear() {
        this._techniques.length = 0;
        this._properties = {};
        this._defines = {};
    }

    getDefaultTechnique() {
        return this._techniques[0];
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
        }
        // else if (!typeCheck(value, prop.type)) { // re-enable this after 3.x migration
        //     console.warn(`Failed to set property ${name}, property type mismatch.`);
        //     return;
        // }
        this._properties[name].value = value;
    }

    getDefine(name) {
        let def = this._defines[name];
        if (def === undefined) {
            console.warn(`Failed to get define ${name}, define not found.`);
        }

        return def;
    }

    define(name, value) {
        let def = this._defines[name];
        if (def === undefined) {
            console.warn(`Failed to set define ${name}, define not found.`);
            return;
        }

        this._defines[name] = value;
    }

    extractProperties(out = {}) {
        Object.assign(out, this._properties);
        if (this._dynamicConfig) {
            Object.assign(out, this._dynamicConfig._uniforms);
        }
        return out;
    }

    extractDefines(out = {}) {
        Object.assign(out, this._defines);
        if (this._dynamicConfig) {
            Object.assign(out, this._dynamicConfig._defines);
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

let getInstanceCtor = function(t) { return ctor2default[getInstanceType(t)]; };

let getInvolvedPrograms = function(json) {
    let programs = [], lib = cc.renderer._forward._programLib;
    json.techniques.forEach(tech => {
        tech.passes.forEach(pass => {
            programs.push(lib.getTemplate(pass.program));
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
    return function(json, programs) {
        let props = {};
        // properties may be specified in the shader too
        programs.forEach(pg => {
            pg.uniforms.forEach(prop => {
                if (!prop.property) return;
                props[prop.name] = genPropInfo(prop.displayName, prop.type, prop.value);
            });
        });
        for (let prop in json.properties) {
            let propInfo = json.properties[prop], uniformInfo;
            // always try getting the type from shaders first
            if (propInfo.tech !== undefined && propInfo.pass !== undefined) {
                let pname = json.techniques[propInfo.tech].passes[propInfo.pass].program;
                let program = programs.find(p => p.name === pname);
                uniformInfo = program.uniforms.find(u => u.name === prop);
            } else {
                for (let i = 0; i < programs.length; i++) {
                    uniformInfo = programs[i].uniforms.find(u => u.name === prop);
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
    let techNum = effect.techniques.length;
    let techniques = new Array(techNum);
    for (let j = 0; j < techNum; ++j) {
        let tech = effect.techniques[j];
        let passNum = tech.passes.length;
        let passes = new Array(passNum);
        for (let k = 0; k < passNum; ++k) {
            let pass = tech.passes[k];
            passes[k] = new Pass(pass.program);
            passes[k].setDepth(pass.depthTest, pass.depthWrite, pass.depthFunc);
            passes[k].setCullMode(pass.cullMode);
            passes[k].setBlend(pass.blend, pass.blendEq, pass.blendSrc,
                pass.blendDst, pass.blendAlphaEq, pass.blendSrcAlpha, pass.blendDstAlpha, pass.blendColor);
            passes[k].setStencilFront(pass.stencilTest, pass.stencilFuncFront, pass.stencilRefFront, pass.stencilMaskFront,
                pass.stencilFailOpFront, pass.stencilZFailOpFront, pass.stencilZPassOpFront, pass.stencilWriteMaskFront);
            passes[k].setStencilBack(pass.stencilTest, pass.stencilFuncBack, pass.stencilRefBack, pass.stencilMaskBack,
                pass.stencilFailOpBack, pass.stencilZFailOpBack, pass.stencilZPassOpBack, pass.stencilWriteMaskBack);
        }
        techniques[j] = new Technique(tech.stages, passes, tech.layer);
    }
    let programs = getInvolvedPrograms(effect);

    let props = parseProperties(effect, programs), uniforms = {}, defines = {};
    programs.forEach(p => {
        // uniforms
        p.uniforms.forEach(u => {
            let name = u.name, uniform = uniforms[name] = Object.assign({}, u);
            uniform.value = getInstanceCtor(u.type)(u.value);
            if (props[name]) { // effect info override
                uniform.type = props[name].type;
                uniform.value = props[name].value;
            }
        });

        p.defines.forEach(d => {
            defines[d.name] = getInstanceCtor(d.type)();
        })
    });
    // extensions
    let extensions = programs.reduce((acc, cur) => acc = acc.concat(cur.extensions), []);
    extensions = cloneObjArray(extensions);

    return new Effect(techniques, uniforms, defines, extensions);
};

if (CC_EDITOR) {
    Effect.parseForInspector = function(json) {
        let programs = getInvolvedPrograms(json);
        let props = parseProperties(json, programs), defines = {};
        for (let pn in programs) {
            programs[pn].uniforms.forEach(u => {
                let prop = props[u.name];
                if (!prop) return;
                prop.defines = u.defines;
            });
            programs[pn].defines.forEach(define => {
                defines[define.name] = {
                    instanceType: getInstanceType(define.type),
                    value: getInstanceCtor(define.type)(),
                    defines: define.defines
                };
            });
        }
        return { props, defines };
    };
}

export default Effect;
cc.Effect = Effect;
