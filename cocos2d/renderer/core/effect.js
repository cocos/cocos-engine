// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import Pass from '../core/pass';
import Technique from '../core/technique';
import { getInspectorProps, enums2default, getInstanceType, getInstanceCtor } from '../types';
import enums from '../enums';

class Effect {
        
    get technique () {
        return this._technique;
    }

    get name () {
        return this._name;
    }

    /**
     * @param {Array} techniques
     */
    constructor (name, techniques, defines = {}, asset) {
        this.init(name, techniques, defines, asset);
    }

    init (name, techniques, defines) {
        this._name = name;
        this._techniques = techniques;
        this._defines = defines;
        this._technique = techniques[0];
        this._properties = {};
    }


    switchTechnique (name) {
        let techniques = this._techniques;
        for (let i = 0; i < techniques.length; i++) {
            if (techniques[i].name === name) {
                this._technique = techniques[i];
                return;
            }
        }

        cc.warn(`Can not find technique with name [${name}]`);
    }


    clear () {
        this._techniques = {};
        this._defines = {};
    }

    setCullMode (cullMode) {
        let passes = this._technique.passes;
        for (let i = 0; i < passes.length; i++) {
            passes[i].setCullMode(cullMode);
        }
    }

    setDepth (depthTest, depthWrite, depthFunc) {
        let passes = this._technique.passes;
        for (let i = 0; i < passes.length; i++) {
            passes[i].setDepth(depthTest, depthWrite, depthFunc);
        }
    }

    setBlend (enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor) {
        let passes = this._technique.passes;
        for (let j = 0; j < passes.length; j++) {
            let pass = passes[j];
            pass.setBlend(
                enabled,
                blendEq,
                blendSrc, blendDst,
                blendAlphaEq,
                blendSrcAlpha, blendDstAlpha, blendColor
            );
        }
    }

    setStencilEnabled (enabled) {
        let passes = this._technique.passes;
        for (let i = 0; i < passes.length; i++) {
            passes[i].setStencilEnabled(enabled);
        }
    }

    setStencil (enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask) {
        let passes = this._technique.passes;
        for (let i = 0; i < passes.length; ++i) {
            let pass = passes[i];
            pass.setStencilFront(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
            pass.setStencilBack(enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
        }
    }

    getProperty (name) {
        if (!this._properties[name]) {
            cc.warn(`${this._name} : Failed to get property ${name}, property not found.`);
            return null;
        }
        return this._properties[name].value;
    }

    setProperty (name, value, passIdx) {
        let passes = this._technique.passes;
        let success = false;
        if (passIdx === undefined) {
            for (let i = 0; i < passes.length; i++) {
                if (passes[i].setProperty(name, value)) {
                    success = true;
                }
            }
        }
        else {
            let pass = passes[passIdx];
            if (pass) {
                success = pass.setProperty(name, value);
            }
        }
        if (!success) {
            cc.warn(`${this.name} : Failed to set property ${name}, property not found.`);
        }
    }

    updateHash (hash) {
    }

    getDefine (name) {
        let def = this._defines[name];
        if (def === undefined) {
            cc.warn(`${this.name} : Failed to get define ${name}, define not found.`);
        }

        return def;
    }

    define (name, value, passIdx) {
        let passes = this._technique.passes;
        let success = false;
        if (passIdx === undefined) {
            for (let i = 0; i < passes.length; i++) {
                if (passes[i].define(name, value)) {
                    success = true;
                }
            }
        }
        else {
            let pass = passes[passIdx];
            if (pass) {
                success = pass.define(name, value);
            }
        }
        if (!success) {
            cc.warn(`${this.name} : Failed to define ${name}, define not found.`);
        }
    }

    extractDefines (out = {}) {
        Object.assign(out, this._defines);
        return out;
    }

    clone () {
        let defines = this.extractDefines({});

        let techniques = [];
        for (let i = 0; i < this._techniques.length; i++) {
            techniques.push(this._techniques[i].clone());
        }

        return new Effect(this._name, techniques, defines);
    }
}


function getInvolvedPrograms (json) {
    let programs = [], lib = cc.renderer._forward._programLib;
    json.techniques.forEach(tech => {
        tech.passes.forEach(pass => {
            programs.push(lib.getTemplate(pass.program));
        });
    });
    return programs;
}

function getInvolvedProgram (programName) {
    let lib = cc.renderer._forward._programLib;
    return lib.getTemplate(programName);
}

// extract properties from each passes and check whether properties is defined but not used.
function parseProperties (effectAsset, passJson) {
    let propertiesJson = passJson.properties || {};
    let program = getInvolvedProgram(passJson.program);

    // check whether properties are defined in the shaders 
    for (let prop in propertiesJson) {
        let uniformInfo = program.uniforms.find(u => u.name === prop);
        // the property is not defined in all the shaders used in techs
        if (!uniformInfo) {
            cc.warn(`${effectAsset.name} : illegal property: ${prop}, myabe defined a not used property`);
            continue;
        }
    }

    // create properties
    let properties = {};
    program.uniforms.forEach(u => {
        let name = u.name,
            prop = properties[name] = Object.assign({}, u),
            propInfo = propertiesJson[name];
        if (propInfo) {
            prop.value = propInfo.type === enums.PARAM_TEXTURE_2D ? null : new Float32Array(propInfo.value);;
        }
        else {
            prop.value = enums2default[u.type];
        }
    });

    return properties;
};

function passDefines (pass) {
    let defines = {};
    let program = getInvolvedProgram(pass.program);
    program.defines.forEach(d => {
        defines[d.name] = enums2default[d.type];
    })
    return defines;
}

Effect.parseTechniques = function (effectAsset) {
    let techNum = effectAsset.techniques.length;
    let techniques = new Array(techNum);
    for (let j = 0; j < techNum; ++j) {
        let tech = effectAsset.techniques[j];
        let passNum = tech.passes.length;
        let passes = new Array(passNum);
        for (let k = 0; k < passNum; ++k) {
            let pass = tech.passes[k];

            let passName = pass.name || k;
            let detailName = `${effectAsset.name}-${tech.name}-${passName}`;
            let stage = pass.stage || 'opaque';
            let properties = parseProperties(effectAsset, pass);
            let defines = passDefines(pass);

            passes[k] = new Pass(passName, detailName, pass.program, stage, properties, defines);

            // rasterizer state
            if (pass.rasterizerState) {
                passes[k].setCullMode(pass.rasterizerState.cullMode);
            }

            // blend state
            let blendState = pass.blendState && pass.blendState.targets[0];
            if (blendState) {
                passes[k].setBlend(blendState.blend, blendState.blendEq, blendState.blendSrc,
                    blendState.blendDst, blendState.blendAlphaEq, blendState.blendSrcAlpha, blendState.blendDstAlpha, blendState.blendColor);
            }

            // depth stencil state
            let depthStencilState = pass.depthStencilState;
            if (depthStencilState) {
                passes[k].setDepth(depthStencilState.depthTest, depthStencilState.depthWrite, depthStencilState.depthFunc);
                passes[k].setStencilFront(depthStencilState.stencilTest, depthStencilState.stencilFuncFront, depthStencilState.stencilRefFront, depthStencilState.stencilMaskFront,
                    depthStencilState.stencilFailOpFront, depthStencilState.stencilZFailOpFront, depthStencilState.stencilZPassOpFront, depthStencilState.stencilWriteMaskFront);
                passes[k].setStencilBack(depthStencilState.stencilTest, depthStencilState.stencilFuncBack, depthStencilState.stencilRefBack, depthStencilState.stencilMaskBack,
                    depthStencilState.stencilFailOpBack, depthStencilState.stencilZFailOpBack, depthStencilState.stencilZPassOpBack, depthStencilState.stencilWriteMaskBack);
            }
        }
        let techName = tech.name || 'default';
        techniques[j] = new Technique(techName, passes);
    }

    return techniques;
};

Effect.parseEffect = function (effect) {
    let techniques = Effect.parseTechniques(effect);

    let defines = {};
    let programs = getInvolvedPrograms(effect);
    programs.forEach(p => {
        p.defines.forEach(d => {
            defines[d.name] = enums2default[d.type];
        })
    });

    return new cc.Effect(effect.name, techniques, defines, effect);
};

if (CC_EDITOR) {
    // inspector only need properties defined in CCEffect
    Effect.parseForInspector = function (json) {
        let techniques = Effect.parseTechniques(json);
        techniques = techniques.map((tech, techIdx) => {
            let passes = tech.passes.map((pass, passIdx) => {
                let properties = {}
                let props = pass._properties;
                let jsonProps = {};
                try {
                    jsonProps = json.techniques[techIdx].passes[passIdx].properties;
                }
                catch (err) {}
                for (let name in props) {
                    // only export user defined properties
                    if (jsonProps[name]) {
                        properties[name] = getInspectorProps(props[name]);
                    }
                }

                // create defines for inspector
                let program = getInvolvedProgram(pass._programName);
                let defines = {};
                program.defines.map(def => {
                    defines[def.name] = getInspectorProps(def);
                })

                return {
                    name: pass._name,
                    props: properties,
                    defines,
                };
            });

            return {
                name: tech.name,
                passes: passes,
            };
        });

        return techniques;
    };
}

cc.Effect = Effect;
export default Effect;
