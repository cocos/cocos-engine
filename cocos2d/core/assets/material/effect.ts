// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import Pass from '../../../renderer/core/pass';
import Technique from '../../../renderer/core/technique';
import { getInspectorProps, enums2default } from '../../../renderer/types';
import enums from '../../../renderer/enums';
import EffectBase from './effect-base';

export default class Effect extends EffectBase {

    _techniques: Technique[] = [];
    _asset = null;
    
    get technique () {
        return this._technique;
    }

    get passes () {
        return this._technique.passes;
    }

    /**
     * @param {Array} techniques
     */
    constructor (name, techniques, asset) {
        super();
        this.init(name, techniques, asset, true);
    }

    init (name, techniques, asset) {
        this._name = name;
        this._techniques = techniques;
        this._technique = techniques[0];
        this._asset = asset;
    }

    switchTechnique (index) {
        if (index >= this._techniques.length) {
            cc.warn(`Can not switch to technique with index [${index}]`);
            return;
        }

        this._technique = this._techniques[index];
    }


    clear () {
        this._techniques = [];
    }

    clone () {
        let techniques = [];
        for (let i = 0; i < this._techniques.length; i++) {
            techniques.push(this._techniques[i].clone());
        }

        return new Effect(this._name, techniques, this._asset);
    }
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
            prop.value = propInfo.type === enums.PARAM_TEXTURE_2D ? null : new Float32Array(propInfo.value);
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
        let techName = tech.name || j;

        let passNum = tech.passes.length;
        let passes = new Array(passNum);
        for (let k = 0; k < passNum; ++k) {
            let pass = tech.passes[k];

            let passName = pass.name || k;
            let detailName = `${effectAsset.name}-${techName}-${passName}`;
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
        techniques[j] = new Technique(techName, passes);
    }

    return techniques;
};

Effect.parseEffect = function (effect) {
    let techniques = Effect.parseTechniques(effect);
    return new Effect(effect.name, techniques, effect);
};

if (CC_EDITOR) {
    // inspector only need properties defined in CCEffect
    Effect.parseForInspector = function (effectAsset) {
        return effectAsset.techniques.map((tech, techIdx) => {
            let passes = tech.passes.map((pass, passIdx) => {
                let program = getInvolvedProgram(pass.program);

                let newProps = {};
                let props = pass.properties;
                for (let name in props) {
                    newProps[name] = getInspectorProps(props[name]);
                    
                    let u = program.uniforms.find(u => u.name === name);
                    newProps[name].defines = u.defines || [];
                }

                let newDefines = {};
                program.defines.map(def => {
                    newDefines[def.name] = getInspectorProps(def);
                })

                return {
                    name: pass.name || passIdx,
                    props: newProps,
                    defines: newDefines,
                };
            })

            return {
                name: tech.name || techIdx,
                passes: passes,
            };
        })
    };
}

cc.Effect = Effect;
