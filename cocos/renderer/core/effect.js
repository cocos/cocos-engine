// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import config from '../config';
import enums from '../enums';
import { vec2, vec3, vec4, color3, color4 } from '../../core/vmath';
import Pass from './pass';
import Technique from './technique';
import { parseEffect } from '../utils';
import * as ValueType from '../../core/value-types';


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
        return this._properties[name];
    }

    setProperty(name, value) {
        // TODO: check if params is valid for current technique???
        this._properties[name] = value;
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

    static paramProcessing(json, processers) {
        let name = json.name;
        let type = json.type;
        let value = json.value;
        let processer = processers[type] || processers.default;
        return processer(name, type, value);
    }

    static getPropertyClassName(json) {
        return `cc.Effect.${json._uuid}.Props`;
    }

    static parseType(json) {
        let processers = {
            [enums.PARAM_COLOR3]: cc.Color,
            [enums.PARAM_COLOR4]: cc.Color,
            [enums.PARAM_FLOAT2]: cc.Vec2,
            [enums.PARAM_FLOAT3]: cc.Vec3,
            [enums.PARAM_TEXTURE_2D]: cc.Texture2D,
            default: cc.Object
        }
        let types = {};
        // process params in techniques
        // note: this should be moved to effect later
        json.techniques.forEach(tech => {
            tech.params.forEach(param => {
                types[param.name] = processers[param.type] || processers.default;
            });
        });

        // process defines
        // todo:
        // 1. only add artistic defines
        // 2. only bool supported, may contains other type
        json.defines.forEach((define) => {
            types[define.name] = Boolean;
        });
        return types;
    }

    static parseProperties(json) {
        function processColor(name, type, value) {
            return cc.color(value[0] * 255, value[1] * 255, value[2] * 255, (value[3] || 1) * 255);
        }
        function processVec2(name, type, value) {
            return cc.v2(value[0], value[1]);
        }
        function processVec3(name, type, value) {
            return cc.v3(value[0], value[1], value[2]);
        }
        function processTexture2d(name, type, value) {
            return null;
        }
        function processDefault(name, type, value) {
            return null;
        }
        let processers = {
            [enums.PARAM_COLOR3]: processColor,
            [enums.PARAM_COLOR4]: processColor,
            [enums.PARAM_FLOAT2]: processVec2,
            [enums.PARAM_FLOAT3]: processVec3,
            [enums.PARAM_TEXTURE_2D]: processTexture2d,
            default: processDefault
        }
        let properties = {};
        // process params in techniques
        // note: this should be moved to effect later
        json.techniques.forEach(tech => {
            tech.params.forEach(param => {
                properties[param.name] = Effect.paramProcessing(param, processers);
            });
        });

        // process defines
        // todo:
        // 1. only add artistic defines
        // 2. only bool supported, may contains other type
        json.defines.forEach((define) => {
            properties[define.name] = false;
        });
        return properties;
    }

    static registerEffect(json) {
        cc.Class({
            name: Effect.getPropertyClassName(json),
            properties: Effect.parseProperties(json),
        });
    }

    static parsePass(json) {
        // console.error('try to parse pass, should add render state here');
        let pass = new Pass(json.program);
        if (json.depthTest !== undefined && json.depthWrite !== undefined) {
            pass.setDepth(json.depthTest, json.depthWrite);
        }
        if (json.cullMode !== undefined) {
            pass.setCullMode(json.cullMode);
        }
        if (json.blend === true) {
            pass.setBlend(json.blendEq, json.blendSrc, json.blendDst, json.blendAlphaEq, json.blendSrcAlpha, json.blendDstAlpha);
        }

        return pass;
    }

    static parseTechnique(json) {
        function processColor(value) {
            return new ValueType.Color(value[0] * 255, value[1] * 255, value[2] * 255, (value[3] || 1.0) * 255);
        }
        function processVec2(value) {
            return new ValueType.Vec2(value[0], value[1]);
        }
        function processVec3(value) {
            return new ValueType.Vec3(value[0], value[1], value[2]);
        }
        let processers = {
            color3: processColor,
            color4: processColor,
            float2: processVec2,
            float3: processVec3
        }
        let stages = json.stages;
        let passes = [];
        json.passes.forEach(pass => {
            passes.push(Effect.parsePass(pass));
        });
        let params = [];
        for (let paramKey in json.params) {
            // let param = Effect.paramProcessing(, processers);
            params.push(json.params[paramKey]);
        }
        let layer = json.layer;
        return new Technique(stages, params, passes, layer);
    }

    static parseEffect(effectJson) {
        function _objArrayClone(val) {
            return val.map(obj => Object.assign({}, obj));
        }

        let techniques = [];
        effectJson.techniques.forEach(tech => {
            techniques.push(Effect.parseTechnique(tech));
        });
        // todo add props extraction
        let props = {};
        let defines = _objArrayClone(effectJson.defines);
        let deps = _objArrayClone(effectJson.dependencies);

        return new Effect(techniques, props, defines, deps);
    }
}

cc.Effect = Effect;
