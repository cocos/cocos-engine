// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { EffectAsset } from '../../3d/assets/effect-asset';
import { RenderPassStage } from '../../pipeline/define';
import { IPassInfoFull, Pass } from './pass';

export interface IDefineMap { [name: string]: number | boolean; }
export interface IEffectInfo {
    techIdx?: number;
    defines?: IDefineMap[];
}

export class Effect {
    public static getPassInfos (effect: EffectAsset, techIdx: number) {
        return effect.techniques[techIdx].passes;
    }

    public static parseEffect (effect: EffectAsset, info?: IEffectInfo) {
        // techniques
        const { techIdx, defines } = info || {} as IEffectInfo;
        const tech = effect.techniques[techIdx || 0];
        const passNum = tech.passes.length;
        const passes: Pass[] = new Array(passNum);
        for (let k = 0; k < passNum; ++k) {
            const passInfo = tech.passes[k] as IPassInfoFull;
            const prog = cc.game._programLib.getTemplate(passInfo.program);
            passInfo.shader = cc.game._programLib.getGFXShader(passInfo.program, defines && defines[k] || {});
            passInfo.renderPass = cc.director.root.pipeline.getRenderPass(passInfo.stage || RenderPassStage.DEFAULT);
            passInfo.globals = cc.director.root.pipeline.globalUBO;
            passInfo.blocks = prog!.blocks;
            passInfo.samplers = prog!.samplers;
            const pass = new Pass(cc.game._gfxDevice);
            pass.initialize(passInfo);
            passes[k] = pass;
        }
        return passes;
    }
}

cc.Effect = Effect;
