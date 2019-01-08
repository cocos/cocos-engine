// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { BlockMember, EffectAsset, PropertyInfo, SamplerInfo, ShaderInfo } from '../../3d/assets/effect-asset';
import { CCObject } from '../../core/data';
import { Color, Mat4, Vec2, Vec3, Vec4 } from '../../core/value-types';
import { GFXType } from '../../gfx/define';
import { RenderPassStage } from '../../pipeline/render-pipeline';
import Texture2D from '../gfx/texture-2d';
import TextureCube from '../gfx/texture-cube';
import { Pass, PassInfo } from './pass';

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

export interface PropertyMap { [name: string]: { type: number, value: any }; }
export interface DefineMap { [name: string]: number | boolean; }
export interface EffectInfo {
    techIdx?: number;
    defines?: DefineMap;
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

const getInvolvedPrograms = (effect: EffectAsset, techIdx?: number) => {
    const programs: Record<string, ShaderInfo> = {};
    const lib = cc.game._programLib;
    if (techIdx) {
        effect.techniques[techIdx].passes.forEach((pass) => {
            programs[pass.program] = lib.getTemplate(pass.program);
        });
    } else  {
        effect.techniques.forEach((tech) => {
            tech.passes.forEach((pass) => {
                programs[pass.program] = lib.getTemplate(pass.program);
            });
        });
    }
    return programs;
};

interface ExtractedPropInfo {
    type: number;
    instanceType: object | string;
    value: number | boolean | object;
    defines: string[];
    displayName?: string;
    tech: number;
    pass: number;
}
const parseProperties = (() => {
    interface UniformInfo { type: number; defines: string[]; }
    function genPropInfo(propInfo: PropertyInfo, uniformInfo: UniformInfo, tech: number, pass: number)
        : ExtractedPropInfo {
        const type = propInfo.type || uniformInfo.type;
        return {
            type, tech, pass,
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
    function findPassIdx(effect: EffectAsset, programName: string) { // just a heuristic
        effect.techniques.forEach((tech, i) => {
            tech.passes.forEach((pass, j) => {
                if (pass.program === programName) {
                    return [ i, j ];
                }
            });
        });
        return [ 0, 0 ];
    }
    return (effect: EffectAsset, programs: Record<string, ShaderInfo>) => {
        const props: Record<string, ExtractedPropInfo> = {};
        for (const prop of Object.keys(effect.properties)) {
            const propInfo = effect.properties[prop];
            let uniformInfo: UniformInfo | undefined;
            let techIdx = 0;
            let passIdx = 0;
            // always try getting the type from shaders first
            if (propInfo.tech !== undefined && propInfo.pass !== undefined) {
                const p = effect.techniques[propInfo.tech].passes[propInfo.pass].program;
                uniformInfo = findUniformInfo(programs[p], prop);
                techIdx = propInfo.tech; passIdx = propInfo.pass;
            } else {
                for (const p of Object.keys(programs)) {
                    uniformInfo = findUniformInfo(programs[p], prop);
                    if (uniformInfo) { [techIdx, passIdx] = findPassIdx(effect, p); break; }
                }
            }
            // the property is not defined in all the shaders used in techs
            if (!uniformInfo) {
                console.warn(`illegal property: ${prop}`);
                continue;
            }
            props[prop] = genPropInfo(propInfo, uniformInfo, techIdx, passIdx);
        }
        return props;
    };
})();

const traverseUniforms = (shaderInfo: ShaderInfo, fn: (u: BlockMember | SamplerInfo) => any) => {
    shaderInfo.blocks.forEach((b) => b.members.forEach(fn));
    shaderInfo.samplers.forEach(fn);
};

export class Effect {
    public static parseEffect(effect: EffectAsset, info?: EffectInfo) {
        // techniques
        const { techIdx, defines } = info || <EffectInfo>{};
        const programs = getInvolvedPrograms(effect, techIdx || 0);
        const tech = effect.techniques[techIdx || 0];
        const passNum = tech.passes.length;
        const passes: Pass[] = new Array(passNum);
        const props = parseProperties(effect, programs);
        for (let k = 0; k < passNum; ++k) {
            const passInfo = <PassInfo>tech.passes[k];
            const uniforms: PropertyMap = passInfo.uniforms = {};
            traverseUniforms(programs[passInfo.program], (u) => {
                const prop = props[u.name];
                uniforms[u.name] = {
                    type: prop ? prop.type : u.type,
                    value: prop ? prop.value : getInstanceCtor(u.type)(),
                };
            });
            passInfo.shader = cc.game._programLib.getGFXShader(passInfo.program, defines || {});
            passInfo.renderPass = cc.director.root.pipeline.getRenderPass(passInfo.stage || RenderPassStage.WINDOW);
            passInfo.blocks = programs[passInfo.program].blocks;
            passInfo.samplers = programs[passInfo.program].samplers;
            const pass = new Pass(cc.game._gfxDevice);
            pass.initialize(passInfo);
            passes[k] = pass;
        }
        return passes;
    }
    public static parseForInspector(effect: EffectAsset) {
        const programs = getInvolvedPrograms(effect);
        const props = parseProperties(effect, programs);
        const defines: Record<string, object> = {};
        for (const pn of Object.keys(programs)) {
            programs[pn].defines.forEach((define) => {
                defines[define.name] = {
                    instanceType: getInstanceType(define.type),
                    value: getInstanceCtor(define.type)(),
                    defines: define.defines,
                };
            });
        }
        return { props, defines };
    }
}

cc.Effect = Effect;
