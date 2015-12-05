/**
 * Class for scene handling.
 * @class Scene
 * @extends Asset
 * @constructor
 */
var Scene = cc.Class({
    name: 'cc.SceneAsset',
    extends: cc.Asset,

    properties: {
        scene: null
    },
});

cc.SceneAsset = Scene;
module.exports = Scene;
