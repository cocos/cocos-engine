/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { _decorator } from '../data/index';
const { ccclass, property } = _decorator;
import * as math from '../vmath';

@ccclass('cc.PrefabInfo')
export class PrefabInfo {
    // the most top node of this prefab in the scene
    @property
    public root = null;

    // 所属的 prefab 资源对象 (cc.Prefab)
    // In Editor, only asset._uuid is usable because asset will be changed.
    @property
    public asset = null;

    // 用来标识别该节点在 prefab 资源中的位置，因此这个 ID 只需要保证在 Assets 里不重复就行
    @property
    public fileId = '';

    // Indicates whether this node should always synchronize with the prefab asset, only available in the root node
    @property
    public sync = false;

    // Indicates whether this node is synchronized, only available in the root node
    @property
    public _synced = {
        default: false,
        serializable: false,
    };

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
}

cc._PrefabInfo = PrefabInfo;

// update node to make it sync with prefab
export default function syncWithPrefab (node) {
    const _prefab = node._prefab;
    // non-reentrant
    _prefab._synced = true;
    //
    if (!_prefab.asset) {
        if (CC_EDITOR) {
            // @ts-ignore
            const NodeUtils = Editor.require('scene://utils/node');
            // @ts-ignore
            const PrefabUtils = Editor.require('scene://utils/prefab');

            // @ts-ignore
            cc.warn(Editor.T('MESSAGE.prefab.missing_prefab', { node: NodeUtils.getNodePath(node) }));
            node.name += PrefabUtils.MISSING_PREFAB_SUFFIX;
        }
        else {
            cc.errorID(3701, node.name);
        }
        node._prefab = null;
        return;
    }

    // save root's preserved props to avoid overwritten by prefab
    const _objFlags = node._objFlags;
    const _parent = node._parent;
    const _id = node._id;
    const _name = node._name;
    const _active = node._active;
    const x = node._position.x;
    const y = node._position.y;
    const _quat = node._quat;
    const _localZOrder = node._localZOrder;
    const _globalZOrder = node._globalZOrder;

    // instantiate prefab
    cc.game._isCloning = true;
    if (CC_SUPPORT_JIT) {
        _prefab.asset._doInstantiate(node);
    }
    else {
        // root in prefab asset is always synced
        const prefabRoot = _prefab.asset.data;
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
    math.quat.copy(node._quat, _quat);
    node._localZOrder = _localZOrder;
    node._globalZOrder = _globalZOrder;
}
