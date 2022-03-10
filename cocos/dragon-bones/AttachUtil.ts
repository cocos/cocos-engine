/**
 * @packageDocumentation
 * @module dragonBones
 */

import { Armature, Matrix } from '@cocos/dragonbones-js';
import { Node, Mat4, Vec3 } from '../core';
import { ccclass } from '../core/data/class-decorator';
import { ArmatureFrameBoneInfo } from './ArmatureCache';
import { ArmatureDisplay } from './ArmatureDisplay';

const _tempMat4 = new Mat4();

/**
 * @en Attach node tool
 * @zh 挂点工具类
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

        const sockets = this._armatureDisplay!.sockets;
        const socketNodes = this._armatureDisplay!.socketNodes;

        const matrixHandle = (node: NodeExt, boneMat: Matrix) => {
            const tm = _tempMat4;
            tm.m00 = boneMat.a;
            tm.m01 = boneMat.b;
            tm.m04 = -boneMat.c;
            tm.m05 = -boneMat.d;
            tm.m12 = boneMat.tx;
            tm.m13 = boneMat.ty;
            node.matrix = _tempMat4;
        };

        const bones = this._armature!.getBones();

        for (let l = sockets.length - 1; l >= 0; l--) {
            const sock = sockets[l];
            const boneNode = sock.target;

            if (!boneNode) continue;
            // Node has been destroy
            if (!boneNode.isValid) {
                socketNodes.delete(sock.path);
                sockets.splice(l, 1);
                continue;
            }
            // Bone has been destroy
            const bone = isCached ? boneInfos![sock.boneIndex!] : bones[sock.boneIndex as unknown as number];
            if (!bone) continue;

            // if (!bone) {
            //     boneNode.removeFromParent();
            //     boneNode.destroy();
            //     socketNodes.delete(sock.path);
            //     sockets.splice(l, 1);
            //     continue;
            // }
            matrixHandle(boneNode, bone.globalTransformMatrix);
        }
    }
}

interface NodeExt extends Node{
    _oldScale?:Vec3;
}
