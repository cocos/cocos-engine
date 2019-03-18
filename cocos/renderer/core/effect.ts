// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { EffectAsset } from '../../3d/assets/effect-asset';
import { IDefineMap, IPassInfoFull, Pass, PassOverrides } from './pass';

export interface IEffectInfo {
    techIdx: number;
    defines: IDefineMap[];
    states: PassOverrides[];
}

export class Effect {
    public static getPassesInfo (effect: EffectAsset, techIdx: number) {
        return effect.techniques[techIdx].passes;
    }

    public static parseEffect (effect: EffectAsset, info: IEffectInfo) {
        // techniques
        const { techIdx, defines, states } = info;
        const tech = effect.techniques[techIdx || 0];
        const passNum = tech.passes.length;
        const passes: Pass[] = [];
        for (let k = 0; k < passNum; ++k) {
            const passInfo = tech.passes[k] as IPassInfoFull;
            const defs = passInfo.curDefs = defines.length > k ? defines[k] : {};
            if (passInfo.switch && !defs[passInfo.switch]) { continue; }
            passInfo.states = states.length > k ? states[k] : {};
            passInfo.idxInTech = k;
            const pass = new Pass(cc.game._gfxDevice);
            pass.initialize(passInfo);
            passes.push(pass);
        }
        return passes;
    }
}
