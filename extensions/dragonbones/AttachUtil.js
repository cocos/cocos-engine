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

let AttachUtil = cc.Class({
    name: 'dragonBones.AttachUtil',

    ctor () {
        this._inited = false;
        this._armature = null;
        this._armatureNode = null;
        this._armatureDisplay = null;
        this._attachedRootNode = null;
        this._attachedNodeArray = [];
    },

    init (armatureDisplay) {
        this._inited = true;
        this._armature = armatureDisplay._armature;
        this._armatureNode = armatureDisplay.node;
        this._armatureDisplay = armatureDisplay;
    },

    destroy () {
        this._inited = false;
        this._armature = null;
        this._armatureNode = null;
        this._armatureDisplay = null;
    },

    _prepareAttachNode () {
        let armature = this._armature;
        if (!armature) {
            return;
        }

        let rootNode = this._armatureNode.getChildByName(ATTACHED_ROOT_NAME);
        if (!rootNode || !rootNode.isValid) {
            rootNode = new cc.Node(ATTACHED_ROOT_NAME);
            limitNode(rootNode);
            this._armatureNode.addChild(rootNode);
        }

        let isCached = this._armatureDisplay.isAnimationCached();
        if (isCached && this._armatureDisplay._frameCache) {
            this._armatureDisplay._frameCache.enableCacheAttachedInfo();
        }

        this._attachedRootNode = rootNode;
        return rootNode;
    },

    _buildBoneAttachedNode (bone, nodeIndex) {
        let boneNodeName = ATTACHED_PRE_NAME + bone.name;
        let boneNode = new cc.Node(boneNodeName);
        this._attachedNodeArray[nodeIndex] = boneNode;
        return boneNode;
    },

    /**
     * !#en Gets attached root node.
     * !#zh 获取挂接节点树的根节点
     * @property {cc.Node} attachedRootNode
     */
    getAttachedRootNode () {
        return this._attachedRootNode;
    },

    /**
     * !#en Gets attached node which you want.
     * !#zh 获得对应的挂点
     * @param {String} boneName
     * @return {[cc.Node]}
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

    /**
     * !#en Destroy attached node which you want.
     * !#zh 销毁对应的挂点
     * @param {String} boneName
     */
    destroyAttachedNodes (boneName) {
        if (!this._inited) return;

        let nodeArray = this._attachedNodeArray;
        let clearTree = function (rootNode) {
            let children = rootNode.children;
            for (let i = 0, n = children.length; i < n; i++) {
                let c = children[i];
                if (c) clearTree(c);
            }
            let nodeIndex = rootNode._nodeIndex;
            if (nodeIndex != undefined) {
                nodeArray[nodeIndex] = null;
            }
        }

        for (let i = 0, n = nodeArray.length; i < n; i++) {
            let boneNode = nodeArray[i];
            if (!boneNode || !boneNode.isValid) continue;

            let delName = boneNode.name.split(ATTACHED_PRE_NAME)[1];
            if (delName === boneName) {
                clearTree(boneNode);
                boneNode.removeFromParent(true);
                boneNode.destroy();
            }
        }
    },

    /**
     * !#en Traverse all bones to generate the minimum node tree containing the given bone names
     * !#zh 遍历所有插槽，生成包含所有给定插槽名称的最小节点树
     * @param {String} boneName
     * @return {[cc.Node]} attached node array 
     */
    generateAttachedNodes (boneName) {
        let targetNodes = [];
        if (!this._inited) return targetNodes;

        let rootNode = this._prepareAttachNode();
        if (!rootNode) return targetNodes;

        let nodeIndex = 0;
        let res = [];
        let attachedTraverse = function (armature) {
            if (!armature) return;

            let bones = armature.getBones(), bone;
            for(let i = 0, l = bones.length; i < l; i++) {
                bone = bones[i];
                bone._nodeIndex = nodeIndex++;
                if (boneName === bone.name) {
                    res.push(bone);
                }
            }

            let slots = armature.getSlots(), slot;
            for (let i = 0, l = slots.length; i < l; i++) {
                slot = slots[i];
                if (slot.childArmature) {
                    attachedTraverse(slot.childArmature);
                }
            }
        }.bind(this);
        attachedTraverse(this._armature);

        let nodeArray = this._attachedNodeArray;
        let buildBoneTree = function (bone) {
            if (!bone) return;
            let boneNode = nodeArray[bone._nodeIndex];
            if (boneNode) return boneNode;

            boneNode = this._buildBoneAttachedNode(bone, bone._nodeIndex);
            limitNode(boneNode);
            boneNode._bone = bone;
            boneNode._nodeIndex = bone._nodeIndex;

            let subArmatureParentBone = null;
            if (bone.armature.parent) {
                let parentSlot = bone.armature.parent;
                subArmatureParentBone = parentSlot.parent;
            }

            let parentBoneNode = buildBoneTree(bone.parent || subArmatureParentBone) || rootNode;
            boneNode.parent = parentBoneNode;

            if (bone.parent) {
                boneNode._rootNode = parentBoneNode._rootNode;
            } else {
                boneNode._rootNode = parentBoneNode;
            }

            return boneNode;
        }.bind(this);

        for (let i = 0, n = res.length; i < n; i++) {
            let targetNode = buildBoneTree(res[i]);
            if (targetNode) {
                targetNodes.push(targetNode);
            }
        }

        return targetNodes;
    },

    /**
     * !#en Destroy all attached node.
     * !#zh 销毁所有挂点
     */
    destroyAllAttachedNodes () {
        this._attachedRootNode = null;
        this._attachedNodeArray.length = 0;
        if (!this._inited) return;

        let rootNode = this._armatureNode.getChildByName(ATTACHED_ROOT_NAME);
        if (rootNode) {
            rootNode.removeFromParent(true);
            rootNode.destroy();
            rootNode = null;
        }
    },

    /**
     * !#en Traverse all bones to generate a tree containing all bones nodes
     * !#zh 遍历所有插槽，生成包含所有插槽的节点树
     * @return {cc.Node} root node
     */
    generateAllAttachedNodes () {
        if (!this._inited) return;

        let rootNode = this._prepareAttachNode();
        if (!rootNode) return;

        let nodeIndex = 0;
        let attachedTraverse = function (armature) {
            if (!armature) return;

            let subArmatureParentNode = rootNode;
            if (armature.parent) {
                let parentSlot = armature.parent;
                let parentBone = parentSlot.parent;
                subArmatureParentNode = parentBone._attachedNode;
            }

            let bones = armature.getBones(), bone;
            for(let i = 0, l = bones.length; i < l; i++) {
                let curNodeIndex = nodeIndex++;
                bone = bones[i];
                bone._attachedNode = null;

                let parentNode = null;
                if (bone.parent) {
                    parentNode = bone.parent._attachedNode;
                } else {
                    parentNode = subArmatureParentNode;
                }

                if (parentNode) {
                    let boneNode = parentNode.getChildByName(ATTACHED_PRE_NAME + bone.name);
                    if (!boneNode || !boneNode.isValid) {
                        boneNode = this._buildBoneAttachedNode(bone, curNodeIndex);
                        parentNode.addChild(boneNode);
                    }
                    limitNode(boneNode);
                    boneNode._bone = bone;
                    boneNode._nodeIndex = curNodeIndex;
                    boneNode._rootNode = subArmatureParentNode;
                    bone._attachedNode = boneNode;

                }
            }

            let slots = armature.getSlots(), slot;
            for (let i = 0, l = slots.length; i < l; i++) {
                slot = slots[i];
                if (slot.childArmature) {
                    attachedTraverse(slot.childArmature);
                }
            }
        }.bind(this);
        attachedTraverse(this._armature);
        return rootNode;
    },

    _hasAttachedNode () {
        if (!this._inited) return false;

        let attachedRootNode = this._armatureNode.getChildByName(ATTACHED_ROOT_NAME);
        return !!attachedRootNode;
    },

    _associateAttachedNode () {
        if (!this._inited) return;

        let rootNode = this._armatureNode.getChildByName(ATTACHED_ROOT_NAME);
        if (!rootNode || !rootNode.isValid) return;
        this._attachedRootNode = rootNode;

        let nodeArray = this._attachedNodeArray;
        nodeArray.length = 0;

        let armature = this._armature;
        if (!armature) {
            return;
        }

        limitNode(rootNode);

        if (!CC_NATIVERENDERER) {
            let isCached = this._armatureDisplay.isAnimationCached();
            if (isCached && this._armatureDisplay._frameCache) {
                this._armatureDisplay._frameCache.enableCacheAttachedInfo();
            }
        }

        let nodeIndex = 0;
        let attachedTraverse = function (armature) {
            if (!armature) return;

            let subArmatureParentNode = rootNode;
            if (armature.parent) {
                let parentSlot = armature.parent;
                let parentBone = parentSlot.parent;
                subArmatureParentNode = parentBone._attachedNode;
            }

            let bones = armature.getBones(), bone;
            for(let i = 0, l = bones.length; i < l; i++) {
                let curNodeIndex = nodeIndex++;
                bone = bones[i];
                bone._attachedNode = null;

                let parentNode = null;
                if (bone.parent) {
                    parentNode = bone.parent._attachedNode;
                } else {
                    parentNode = subArmatureParentNode;
                }

                if (parentNode) {
                    let boneNode = parentNode.getChildByName(ATTACHED_PRE_NAME + bone.name);
                    if (boneNode && boneNode.isValid) {
                        limitNode(boneNode);
                        boneNode._bone = bone;
                        boneNode._nodeIndex = curNodeIndex;
                        boneNode._rootNode = subArmatureParentNode;
                        bone._attachedNode = boneNode;
                        nodeArray[curNodeIndex] = boneNode;
                    }
                }
            }

            let slots = armature.getSlots(), slot;
            for (let i = 0, l = slots.length; i < l; i++) {
                slot = slots[i];
                if (slot.childArmature) {
                    attachedTraverse(slot.childArmature);
                }
            }
        }
        attachedTraverse(armature);
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
        
        let rootMatrix = this._armatureNode._worldMatrix;
        Mat4.copy(rootNode._worldMatrix, rootMatrix);
        rootNode._renderFlag &= ~FLAG_TRANSFORM;

        let boneInfos = null;
        let isCached = this._armatureDisplay.isAnimationCached();
        if (isCached) {
            boneInfos = this._armatureDisplay._curFrame && this._armatureDisplay._curFrame.boneInfos;
            if (!boneInfos) return;
        }

        let mulMat = this._armatureNode._mulMat;
        let matrixHandle = function (nodeMat, parentMat, boneMat) {
            let tm = _tempMat4.m;
            tm[0] = boneMat.a;
            tm[1] = boneMat.b;
            tm[4] = -boneMat.c;
            tm[5] = -boneMat.d;
            tm[12] = boneMat.tx;
            tm[13] = boneMat.ty;
            mulMat(nodeMat, parentMat, _tempMat4);
        };

        let lastValidIdx = -1;
        for (let i = 0, n = nodeArray.length; i < n; i++) {
            let boneNode = nodeArray[i];
            // Node has been destroy
            if (!boneNode || !boneNode.isValid) { 
                nodeArray[i] = null;
                continue;
            }
            let bone = isCached ? boneInfos[i] : boneNode._bone;
            // Bone has been destroy
            if (!bone || bone._isInPool) {
                boneNode.removeFromParent(true);
                boneNode.destroy();
                nodeArray[i] = null;
                continue;
            }
            matrixHandle(boneNode._worldMatrix, boneNode._rootNode._worldMatrix, bone.globalTransformMatrix);
            boneNode._renderFlag &= ~FLAG_TRANSFORM;
            lastValidIdx = i;
        }
        // optimize loop times
        nodeArray.length = lastValidIdx + 1;
    },
});

module.exports = dragonBones.AttachUtil = AttachUtil;