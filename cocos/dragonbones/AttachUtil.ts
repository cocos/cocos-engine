import { Node, Mat4 } from '../core';
import { ccclass } from '../core/data/class-decorator';
import { ArmatureDisplay } from './ArmatureDisplay';
import { dragonBones } from './lib/dragonBones.js';

const _tempMat4 = new Mat4();

/**
 * @module dragonBones
 */

/**
 * !#en Attach node tool
 * !#zh 挂点工具类
 * @class dragonBones.AttachUtil
 */

@ccclass('dragonBones.AttachUtil')
export class AttachUtil {
    _inited = false;
    _armature: dragonBones.Armature | null= null;
    _armatureNode:Node|null = null;
    _armatureDisplay:ArmatureDisplay|null = null;
    constructor () {

    }

    init (armatureDisplay: ArmatureDisplay) {
        this._inited = true;
        this._armature = armatureDisplay._armature;
        this._armatureNode = armatureDisplay.node;
        this._armatureDisplay = armatureDisplay;
    }

    reset () {
        this._inited = false;
        this._armature = null;
        this._armatureNode = null;
        this._armatureDisplay = null;
    }

    _syncAttachedNode () {
        // if (!this._inited) return;
        // const rootMatrix = this._armatureNode!.worldMatrix;
        // Mat4.copy(rootNode._worldMatrix, rootMatrix);
        // rootNode._renderFlag &= ~FLAG_TRANSFORM;

        // let boneInfos = null;
        // let isCached = this._armatureDisplay.isAnimationCached();
        // if (isCached) {
        //     boneInfos = this._armatureDisplay._curFrame && this._armatureDisplay._curFrame.boneInfos;
        //     if (!boneInfos) return;
        // }

        // let mulMat = this._armatureNode._mulMat;
        // let matrixHandle = function (nodeMat, parentMat, boneMat) {
        //     let tm = _tempMat4.m;
        //     tm[0] = boneMat.a;
        //     tm[1] = boneMat.b;
        //     tm[4] = -boneMat.c;
        //     tm[5] = -boneMat.d;
        //     tm[12] = boneMat.tx;
        //     tm[13] = boneMat.ty;
        //     mulMat(nodeMat, parentMat, _tempMat4);
        // };

        // let nodeArrayDirty = false;
        // for (let i = 0, n = nodeArray.length; i < n; i++) {
        //     let boneNode = nodeArray[i];
        //     // Node has been destroy
        //     if (!boneNode || !boneNode.isValid) {
        //         nodeArray[i] = null;
        //         nodeArrayDirty = true;
        //         continue;
        //     }
        //     let bone = isCached ? boneInfos[boneNode._boneIndex] : boneNode._bone;
        //     // Bone has been destroy
        //     if (!bone || bone._isInPool) {
        //         boneNode.removeFromParent(true);
        //         boneNode.destroy();
        //         nodeArray[i] = null;
        //         nodeArrayDirty = true;
        //         continue;
        //     }
        //     matrixHandle(boneNode._worldMatrix, boneNode._rootNode._worldMatrix, bone.globalTransformMatrix);
        //     boneNode._renderFlag &= ~FLAG_TRANSFORM;
        // }
    }
}
