import { Node, Mat4 } from '../core';
import { ccclass } from '../core/data/class-decorator';
import { ArmatureFrameBoneInfo } from './ArmatureCache';
import { ArmatureDisplay } from './ArmatureDisplay';
import { Armature, Matrix } from './lib/dragonBones.js';

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
    _armature: Armature | null = null;
    _armatureNode: Node | null = null;
    _armatureDisplay: ArmatureDisplay | null = null;
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
        if (!this._inited) return;
        const rootMatrix = this._armatureNode!.worldMatrix;

        let boneInfos: ArmatureFrameBoneInfo[] | null = null;
        const isCached = this._armatureDisplay!.isAnimationCached();
        if (isCached && this._armatureDisplay) {
            boneInfos = this._armatureDisplay._curFrame && this._armatureDisplay._curFrame.boneInfos;
            if (!boneInfos) return;
        }

        const socketNodes = this._armatureDisplay!.socketNodes;

        const matrixHandle = (node: Node, boneMat: Matrix) => {
            const tm = _tempMat4;
            tm.m00 = boneMat.a;
            tm.m01 = boneMat.b;
            tm.m04 = -boneMat.c;
            tm.m05 = -boneMat.d;
            tm.m12 = boneMat.tx;
            tm.m13 = boneMat.ty;
            node.matrix = _tempMat4;
            node.scale = this._armatureNode!.scale;
        };

        for (const bone of socketNodes.keys()) {
            const boneNode = socketNodes.get(bone);

            // Node has been destroy
            if (!boneNode || !boneNode.isValid) {
                socketNodes.delete(bone);
                continue;
            }
            // Bone has been destroy
            if (!bone) {
                boneNode.removeFromParent();
                boneNode.destroy();
                socketNodes.delete(bone);
                continue;
            }
            matrixHandle(boneNode, bone.globalTransformMatrix);
        }
    }
}
