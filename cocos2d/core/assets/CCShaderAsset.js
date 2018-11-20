const Asset = require('./CCAsset');

let ShaderAsset = cc.Class({
    name: 'cc.ShaderAsset',
    extends: Asset,

    properties: {
        shader: Object,
        effect: Object
    },

    onLoad () {
        cc.renderer._forward._programLib.define(this.shader);
    }
});

module.exports = cc.ShaderAsset = ShaderAsset;
