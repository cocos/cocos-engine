const Asset = require('./CCAsset');

let EffectAsset = cc.Class({
    name: 'cc.EffectAsset',
    extends: Asset,

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
    }
});

module.exports = cc.EffectAsset = EffectAsset;
