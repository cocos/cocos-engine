/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import Mat4 from '../../cocos2d/core/value-types/mat4';
const RenderFlow = require('../../cocos2d/core/renderer/render-flow');
const FLAG_TRANSFORM = RenderFlow.FLAG_TRANSFORM;
const EmptyHandle = function () {}
const ATTACHED_ROOT_NAME = 'ATTACHED_NODE_TREE';
const ATTACHED_PRE_NAME = 'ATTACHED_NODE:';
const limitNode = function (node) {
    // attached node's world matrix update per frame
    Object.defineProperty(node, '_worldMatDirty', {
        get () { return true; },
        set (value) {/* do nothing */}
    });
    // shield world matrix calculate interface
    node._calculWorldMatrix = EmptyHandle;
    node._mulMat = EmptyHandle;
};
let _tempMat4 = new Mat4();

/**
 * @module sp
 */

/**
 * !#en Attach node tool
 * !#zh 挂点工具类
 * @class sp.AttachUtil
 */
let AttachUtil = cc.Class({
    name: 'sp.AttachUtil',

    ctor () {
        this._inited = false;
        this._skeleton = null;
        this._skeletonNode = null;
        this._skeletonComp = null;

        this._attachedRootNode = null;
        this._attachedNodeArray = [];
        this._boneIndexToNode = {};
    },

    init (skeletonComp) {
        this._inited = true;
        this._skeleton = skeletonComp._skeleton;
        this._skeletonNode = skeletonComp.node;
        this._skeletonComp = skeletonComp;
    },

    reset () {
        this._inited = false;
        this._skeleton = null;
        this._skeletonNode = null;
        this._skeletonComp = null;
    },

    _prepareAttachNode () {
        let armature = this._skeleton;
        if (!armature) {
            return;
        }

        let rootNode = this._skeletonNode.getChildByName(ATTACHED_ROOT_NAME);
        if (!rootNode || !rootNode.isValid) {
            rootNode = new cc.Node(ATTACHED_ROOT_NAME);
            limitNode(rootNode);
            this._skeletonNode.addChild(rootNode);
        }

        let isCached = this._skeletonComp.isAnimationCached();
        if (isCached && this._skeletonComp._frameCache) {
            this._skeletonComp._frameCache.enableCacheAttachedInfo();
        }

        this._attachedRootNode = rootNode;
        return rootNode;
    },

    _buildBoneAttachedNode (bone, boneIndex) {
        let boneNodeName = ATTACHED_PRE_NAME + bone.data.name;
        let boneNode = new cc.Node(boneNodeName);
        this._buildBoneRelation(boneNode, bone, boneIndex);
        return boneNode;
    },

    _buildBoneRelation (boneNode, bone, boneIndex) {
        limitNode(boneNode);
        boneNode._bone = bone;
        boneNode._boneIndex = boneIndex;
        this._attachedNodeArray.push(boneNode);
        this._boneIndexToNode[boneIndex] = boneNode;
    },

    /**
     * !#en Gets attached root node.
     * !#zh 获取挂接节点树的根节点
     * @method getAttachedRootNode
     * @return {cc.Node}
     */
    getAttachedRootNode () {
        return this._attachedRootNode;
    },

    /**
     * !#en Gets attached node which you want.
     * !#zh 获得对应的挂点
     * @method getAttachedNodes
     * @param {String} boneName
     * @return {Node[]}
     */
    getAttachedNodes (boneName) {
        let nodeArray = this._attachedNodeArray;
        let res = [];
        if (!this._inited) return res;
        for (let i = 0, n = nodeArray.length; i < n; i++) {
            let boneNode = nodeArray[i];
            if (!boneNode || !boneNode.isValid) continue;
            if (boneNode.name === ATTACHED_PRE_NAME + boneName) {
                res.push(boneNode);
            }
        }
        return res;
    },

    _rebuildNodeArray () {
        let findMap = this._boneIndexToNode = {};
        let oldNodeArray = this._attachedNodeArray;
        let nodeArray = this._attachedNodeArray = [];
        for (let i = 0, n = oldNodeArray.length; i < n; i++) {
            let boneNode = oldNodeArray[i];
            if (!boneNode || !boneNode.isValid || boneNode._toRemove) continue;
            nodeArray.push(boneNode);
            findMap[boneNode._boneIndex] = boneNode;
        }
    },

    _sortNodeArray () {
        let nodeArray = this._attachedNodeArray;
        nodeArray.sort(function (a, b) {
            return a._boneIndex < b._boneIndex? -1 : 1;
        });
    },

    _getNodeByBoneIndex (boneIndex) {
        let findMap = this._boneIndexToNode;
        let boneNode = findMap[boneIndex];
        if (!boneNode || !boneNode.isValid) return null;
        return boneNode;
    },

    /**
     * !#en Destroy attached node which you want.
     * !#zh 销毁对应的挂点
     * @method destroyAttachedNodes
     * @param {String} boneName
     */
    destroyAttachedNodes (boneName) {
        if (!this._inited) return;

        let nodeArray = this._attachedNodeArray;
        let markTree = function (rootNode) {
            let children = rootNode.children;
            for (let i = 0, n = children.length; i < n; i++) {
                let c = children[i];
                if (c) markTree(c);
            }
            rootNode._toRemove = true;
        }

        for (let i = 0, n = nodeArray.length; i < n; i++) {
            let boneNode = nodeArray[i];
            if (!boneNode || !boneNode.isValid) continue;

            let delName = boneNode.name.split(ATTACHED_PRE_NAME)[1];
            if (delName === boneName) {
                markTree(boneNode);
                boneNode.removeFromParent(true);
                boneNode.destroy();
                nodeArray[i] = null;
            }
        }

        this._rebuildNodeArray();
    },

    /**
     * !#en Traverse all bones to generate the minimum node tree containing the given bone names, NOTE that make sure the skeleton has initialized before calling this interface.
     * !#zh 遍历所有插槽，生成包含所有给定插槽名称的最小节点树，注意，调用该接口前请确保骨骼动画已经初始化好。
     * @method generateAttachedNodes
     * @param {String} boneName
     * @return {Node[]} attached node array
     */
    generateAttachedNodes (boneName) {
        let targetNodes = [];
        if (!this._inited) return targetNodes;

        let rootNode = this._prepareAttachNode();
        if (!rootNode) return targetNodes;

        let res = [];
        let bones = this._skeleton.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            let boneData = bone.data;
            if (boneData.name == boneName) {
                res.push(bone);
            }
        }

        let buildBoneTree = function (bone) {
            if (!bone) return;
            let boneData = bone.data;
            let boneNode = this._getNodeByBoneIndex(boneData.index);
            if (boneNode) return boneNode;

            boneNode = this._buildBoneAttachedNode(bone, boneData.index);

            let parentBoneNode = buildBoneTree(bone.parent) || rootNode;
            boneNode.parent = parentBoneNode;

            return boneNode;
        }.bind(this);

        for (let i = 0, n = res.length; i < n; i++) {
            let targetNode = buildBoneTree(res[i]);
            targetNodes.push(targetNode);
        }

        this._sortNodeArray();
        return targetNodes;
    },

    /**
     * !#en Destroy all attached node.
     * !#zh 销毁所有挂点
     * @method destroyAllAttachedNodes
     */
    destroyAllAttachedNodes () {
        this._attachedRootNode = null;
        this._attachedNodeArray.length = 0;
        this._boneIndexToNode = {};
        if (!this._inited) return;

        let rootNode = this._skeletonNode.getChildByName(ATTACHED_ROOT_NAME);
        if (rootNode) {
            rootNode.removeFromParent(true);
            rootNode.destroy();
            rootNode = null;
        }
    },

    /**
     * !#en Traverse all bones to generate a tree containing all bones nodes, NOTE that make sure the skeleton has initialized before calling this interface.
     * !#zh 遍历所有插槽，生成包含所有插槽的节点树，注意，调用该接口前请确保骨骼动画已经初始化好。
     * @method generateAllAttachedNodes
     * @return {cc.Node} root node
     */
    generateAllAttachedNodes () {
        if (!this._inited) return;

        // clear all records
        this._boneIndexToNode = {};
        this._attachedNodeArray.length = 0;
        
        let rootNode = this._prepareAttachNode();
        if (!rootNode) return;

        let bones = this._skeleton.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            let boneData = bone.data;
            let parentNode = null;
            if (bone.parent) {
                let parentIndex = bone.parent.data.index;
                parentNode = this._boneIndexToNode[parentIndex];
            } else {
                parentNode = rootNode;
            }

            if (parentNode) {
                let boneNode = parentNode.getChildByName(ATTACHED_PRE_NAME + boneData.name);
                if (!boneNode || !boneNode.isValid) {
                    boneNode = this._buildBoneAttachedNode(bone, boneData.index);
                    parentNode.addChild(boneNode);
                } else {
                    this._buildBoneRelation(boneNode, bone, boneData.index);
                }
            }
        }
        return rootNode;
    },

    _hasAttachedNode () {
        if (!this._inited) return false;

        let attachedRootNode = this._skeletonNode.getChildByName(ATTACHED_ROOT_NAME);
        return !!attachedRootNode;
    },

    _associateAttachedNode () {
        if (!this._inited) return;

        let rootNode = this._skeletonNode.getChildByName(ATTACHED_ROOT_NAME);
        if (!rootNode || !rootNode.isValid) return;
        this._attachedRootNode = rootNode;

        // clear all records
        this._boneIndexToNode = {};
        let nodeArray = this._attachedNodeArray;
        nodeArray.length = 0;
        limitNode(rootNode);

        if (!CC_NATIVERENDERER) {
            let isCached = this._skeletonComp.isAnimationCached();
            if (isCached && this._skeletonComp._frameCache) {
                this._skeletonComp._frameCache.enableCacheAttachedInfo();
            }
        }

        let bones = this._skeleton.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            let boneData = bone.data;
            let parentNode = null;
            if (bone.parent) {
                let parentIndex = bone.parent.data.index;
                parentNode = this._boneIndexToNode[parentIndex];
            } else {
                parentNode = rootNode;
            }

            if (parentNode) {
                let boneNode = parentNode.getChildByName(ATTACHED_PRE_NAME + boneData.name);
                if (boneNode && boneNode.isValid) {
                    this._buildBoneRelation(boneNode, bone, boneData.index);
                }
            }
        }
    },

    _syncAttachedNode () {
        if (!this._inited) return;

        let rootNode = this._attachedRootNode;
        let nodeArray = this._attachedNodeArray;
        if (!rootNode || !rootNode.isValid) {
            this._attachedRootNode = null;
            nodeArray.length = 0;
            return;
        }
        
        let rootMatrix = this._skeletonNode._worldMatrix;
        Mat4.copy(rootNode._worldMatrix, rootMatrix);
        rootNode._renderFlag &= ~FLAG_TRANSFORM;

        let boneInfos = null;
        let isCached = this._skeletonComp.isAnimationCached();
        if (isCached) {
            boneInfos = this._skeletonComp._curFrame && this._skeletonComp._curFrame.boneInfos;
        } else {
            boneInfos = this._skeleton.bones;
        }

        if (!boneInfos) return;

        let mulMat = this._skeletonNode._mulMat;
        let matrixHandle = function (nodeMat, parentMat, bone) {
            let tm = _tempMat4.m;
            tm[0] = bone.a;
            tm[1] = bone.c;
            tm[4] = bone.b;
            tm[5] = bone.d;
            tm[12] = bone.worldX;
            tm[13] = bone.worldY;
            mulMat(nodeMat, parentMat, _tempMat4);
        };

        let nodeArrayDirty = false;
        for (let i = 0, n = nodeArray.length; i < n; i++) {
            let boneNode = nodeArray[i];
            // Node has been destroy
            if (!boneNode || !boneNode.isValid) { 
                nodeArray[i] = null;
                nodeArrayDirty = true;
                continue;
            }
            let bone = boneInfos[boneNode._boneIndex];
            // Bone has been destroy
            if (!bone) {
                boneNode.removeFromParent(true);
                boneNode.destroy();
                nodeArray[i] = null;
                nodeArrayDirty = true;
                continue;
            }
            matrixHandle(boneNode._worldMatrix, rootNode._worldMatrix, bone);
            boneNode._renderFlag &= ~FLAG_TRANSFORM;
        }
        if (nodeArrayDirty) {
            this._rebuildNodeArray();
        }
    },
});

module.exports = sp.AttachUtil = AttachUtil;