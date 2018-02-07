/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

cc._PrefabInfo = cc.Class({
    name: 'cc.PrefabInfo',
    // extends: require('../platform/CCObject'),
    properties: {
        // the most top node of this prefab in the scene
        root: null,

        // 所属的 prefab 资源对象 (cc.Prefab)
        // In Editor, only asset._uuid is usable because asset will be changed.
        asset: null,

        // 用来标识别该节点在 prefab 资源中的位置，因此这个 ID 只需要保证在 Assets 里不重复就行
        fileId: '',

        // Indicates whether this node should always synchronize with the prefab asset, only available in the root node
        sync: false,

        // Indicates whether this node is synchronized, only available in the root node
        _synced: {
            default: false,
            serializable: false
        },
    },
    // _instantiate (cloned) {
    //     if (!cloned) {
    //         cloned = new cc._PrefabInfo();
    //     }
    //     cloned.root = this.root;
    //     cloned.asset = this.asset;
    //     cloned.fileId = this.fileId;
    //     cloned.sync = this.sync;
    //     cloned._synced = this._synced;
    //     return cloned;
    // }
});

// prefab helper function
module.exports = {
    // update node to make it sync with prefab
    syncWithPrefab: function (node) {
        var _prefab = node._prefab;
        // non-reentrant
        _prefab._synced = true;
        //
        if (!_prefab.asset) {
            if (CC_EDITOR) {
                cc.warn(Editor.T('MESSAGE.prefab.missing_prefab', { node: _Scene.NodeUtils.getNodePath(node) }));
                node.name += _Scene.PrefabUtils.MISSING_PREFAB_SUFFIX;
            }
            else {
                cc.errorID(3701, node.name);
            }
            node._prefab = null;
            return;
        }

        // save root's preserved props to avoid overwritten by prefab
        var _objFlags = node._objFlags;
        var _parent = node._parent;
        var _id = node._id;
        var _name = node._name;
        var _active = node._active;
        var x = node._position.x;
        var y = node._position.y;
        var _rotX = node._rot.x;
        var _rotY = node._rot.y;
        var _rotZ = node._rot.z;
        var _localZOrder = node._localZOrder;
        var _globalZOrder = node._globalZOrder;

        // instantiate prefab
        cc.game._isCloning = true;
        if (CC_SUPPORT_JIT) {
            _prefab.asset._doInstantiate(node);
        }
        else {
            // root in prefab asset is always synced
            var prefabRoot = _prefab.asset.data;
            prefabRoot._prefab._synced = true;

            // use node as the instantiated prefabRoot to make references to prefabRoot in prefab redirect to node
            prefabRoot._iN$t = node;

            // instantiate prefab and apply to node
            cc.instantiate._clone(prefabRoot, prefabRoot);
        }
        cc.game._isCloning = false;

        // restore preserved props
        node._objFlags = _objFlags;
        node._parent = _parent;
        node._id = _id;
        node._prefab = _prefab;
        node._name = _name;
        node._active = _active;
        node._position.x = x;
        node._position.y = y;
        node._rot.x = _rotX;
        node._rot.y = _rotY;
        node._rot.z = _rotZ;
        node._localZOrder = _localZOrder;
        node._globalZOrder = _globalZOrder;
    }
};
