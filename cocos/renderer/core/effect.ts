// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { EffectAsset } from '../../3d/assets/effect-asset';
import { IDefineMap, IPassInfoFull, Pass } from './pass';

export interface IEffectInfo {
    techIdx?: number;
    defines?: IDefineMap[];
}

export class Effect {
    public static getPassesInfo (effect: EffectAsset, techIdx: number) {
        return effect.techniques[techIdx].passes;
    }

    public static parseEffect (effect: EffectAsset, info?: IEffectInfo) {
        // techniques
        const { techIdx, defines } = info || {} as IEffectInfo;
        const tech = effect.techniques[techIdx || 0];
        const passNum = tech.passes.length;
        const passes: Pass[] = [];
        for (let k = 0; k < passNum; ++k) {
            const passInfo = tech.passes[k] as IPassInfoFull;
            const defs = passInfo.curDefs = defines && defines[k] || {};
            if (passInfo.switch && !defs[passInfo.switch]) { continue; }
            passInfo.idxInTech = k;
            const pass = new Pass(cc.game._gfxDevice);
            pass.initialize(passInfo);
            passes.push(pass);
        }
        return passes;
    }
}
