// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import Technique from '../../../renderer/core/technique';
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
    constructor (name, techniques, techniqueIndex, asset) {
        super();
        this.init(name, techniques, techniqueIndex, asset, true);
    }

    init (name, techniques, techniqueIndex, asset, createNative) {
        this._name = name;
        this._techniques = techniques;
        this._technique = techniques[techniqueIndex];
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

        let techniqueIndex = this._techniques.indexOf(this._technique);
        return new Effect(this._name, techniques, techniqueIndex, this._asset);
    }
}

cc.Effect = Effect;
