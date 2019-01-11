// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { EffectAsset, IShaderInfo } from '../../3d/assets/effect-asset';
import { CCObject } from '../../core/data';
import { Color, Mat4, Vec2, Vec3, Vec4 } from '../../core/value-types';
import { GFXType } from '../../gfx/define';
import { RenderPassStage } from '../../pipeline/render-pipeline';
import Texture2D from '../gfx/texture-2d';
import TextureCube from '../gfx/texture-cube';
import { IPassInfoFull, Pass } from './pass';

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
    boolean: 'Boolean',
    default: CCObject,
    number: 'Number',
};
const getInstanceType = (t: number | string) => _typeMap[t] || _typeMap.default;

export interface IPropertyMap { [name: string]: { type: number, value: any }; }
export interface IDefineMap { [name: string]: number | boolean; }
export interface IEffectInfo {
    techIdx?: number;
    defines?: IDefineMap;
}

type DefaultValue = number | boolean | number[] | string;
const _ctorMap = {
    Boolean: (v?: DefaultValue) => v || false,
    Number: (v?: DefaultValue) => v || 0,
    [Vec2]: (v?: DefaultValue) => Array.isArray(v) ? new Vec2(v[0], v[1]) : new Vec2(),
    [Vec3]: (v?: DefaultValue) => Array.isArray(v) ? new Vec3(v[0], v[1], v[2]) : new Vec3(),
    [Vec4]: (v?: DefaultValue) => Array.isArray(v) ? new Vec4(v[0], v[1], v[2], v[3]) : new Vec4(),
    [Color]: (v?: DefaultValue) => Array.isArray(v) ? new Color(v[0] * 255, v[1] * 255, v[2] * 255,
        (v[3] || 1) * 255) : new Color(),
    [Mat4]: (v?: DefaultValue) => Array.isArray(v) ? new Mat4(
            v[0],  v[1],  v[2],  v[3],
            v[4],  v[5],  v[6],  v[7],
            v[8],  v[9],  v[10], v[11],
            v[12], v[13], v[14], v[15],
        ) : new Mat4(),
    [Texture2D]: () => null,
    [TextureCube]: () => null,
    [CCObject]: () => null,
};
const getInstanceCtor = (t: number | string) => _ctorMap[getInstanceType(t)];
const getProgram = (name: string): IShaderInfo => cc.game._programLib.getTemplate(name);
const getDefines = (name: string, prog: IShaderInfo) => {
    const block = prog.blocks.find((b) => b.members.find((u) => u.name === name) !== undefined);
    if (block) { return block.defines; }
    const s = prog.samplers.find((u) => u.name === name);
    if (s) { return s.defines; }
};

export class Effect {
    public static parseEffect (effect: EffectAsset, info?: IEffectInfo) {
        // techniques
        const { techIdx, defines } = info ||  {} as IEffectInfo;
        const tech = effect.techniques[techIdx || 0];
        const passNum = tech.passes.length;
        const passes: Pass[] = new Array(passNum);
        for (let k = 0; k < passNum; ++k) {
            const passInfo = tech.passes[k] as IPassInfoFull;
            const prog = getProgram(passInfo.program);
            passInfo.shader = cc.game._programLib.getGFXShader(passInfo.program, defines || {});
            passInfo.renderPass = cc.director.root.pipeline.getRenderPass(passInfo.stage || RenderPassStage.DEFAULT);
            passInfo.globals = cc.director.root.pipeline.globalUBO;
            passInfo.blocks = prog.blocks;
            passInfo.samplers = prog.samplers;
            const pass = new Pass(cc.game._gfxDevice);
            pass.initialize(passInfo);
            passes[k] = pass;
        }
        return passes;
    }

    public static parseForInspector (effect: EffectAsset) {
        const res: object[] = [];
        for (const tech of effect.techniques) {
            const props: Array<Record<string, object>> = [];
            const defines: Record<string, object> = {};
            for (const pass of tech.passes) {
                const prog = getProgram(pass.program);
                prog.defines.forEach((define) => {
                    defines[define.name] = {
                        defines: define.defines,
                        instanceType: getInstanceType(define.type),
                        value: getInstanceCtor(define.type)(),
                    };
                });
                const list: Record<string, object> = {};
                props.push(list);
                if (!pass.properties) { continue; }
                for (const p of Object.keys(pass.properties)) {
                    const prop = pass.properties[p];
                    const defs = getDefines(p, prog);
                    if (!defs) { continue; }
                    list[p] = {
                        defines: defs,
                        instanceType: getInstanceType(prop.type),
                        value: getInstanceCtor(prop.type)(),
                    };
                }
            }
            res.push({ props, defines });
        }
        return res;
    }
}

cc.Effect = Effect;
