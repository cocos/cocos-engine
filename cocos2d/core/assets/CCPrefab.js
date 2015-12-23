function visitWrapper (wrapper, visitor) {
    visitor(wrapper);

    var children = wrapper._children;
    for (var i = 0; i < children.length; i++) {
        visitor(children[i]);
    }
}

/**
 * Class for prefab handling.
 * @class Prefab
 * @extends Asset
 * @constructor
 */
var Prefab = cc.Class({
    name: 'cc.Prefab',
    extends: cc.Asset,

    properties: {
        data: null
    },

    createNode: function (cb) {
        if (CC_EDITOR) {
            var node = cc.instantiate(this);
            cb(null, node);
        }
    },

    _instantiate: function () {
        // instantiate
        var node = cc.instantiate(this.data);

        if (CC_DEV) {
            Editor.PrefabUtils.onPrefabInstantiated(this, node);
        }

        return node;
    }
});

cc.Prefab = module.exports = Prefab;
cc.js.obsolete(cc, 'cc._Prefab', 'Prefab');
