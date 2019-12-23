import Asset from '../CCAsset';
import { parseEffect } from './effect-parser';

/**
 * !#en Effect Asset.
 * !#zh Effect 资源类型。
 * @class EffectAsset
 * @extends Asset
 */
let EffectAsset = cc.Class({
    name: 'cc.EffectAsset',
    extends: Asset,

    ctor () {
        this._effect = null;
    },

    properties: {
        properties: Object,
        techniques: [],
        shaders: []
    },

    onLoad () {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            return;
        }
        
        let lib = cc.renderer._forward._programLib;
        for (let i = 0; i < this.shaders.length; i++) {
            lib.define(this.shaders[i]);
        }

        this._initEffect();
    },

    _initEffect () {
        if (this._effect) return;
        this._effect = parseEffect(this);
        Object.freeze(this._effect);
    },

    getInstantiatedEffect () {
        this._initEffect();
        return this._effect.clone();
    },

    getEffect () {
        this._initEffect();
        return this._effect;
    }
});

module.exports = cc.EffectAsset = EffectAsset;
