const Asset = require('./CCAsset');
const Effect = require('../../renderer/core/effect');

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
        this._init();
    },

    _init () {
        if (this._effect) return;

        let lib = cc.renderer._forward._programLib;
        for (let i = 0; i < this.shaders.length; i++) {
            lib.define(this.shaders[i]);
        }

        this._effect = Effect.parseEffect(this);
    },

    getInstantiatedEffect () {
        this._init();
        return this._effect.clone();
    }
});

module.exports = cc.EffectAsset = EffectAsset;
