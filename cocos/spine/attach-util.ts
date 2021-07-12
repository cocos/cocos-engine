/**
 * @packageDocumentation
 * @module spine
 */

import { Mat4, Vec3, Node } from '../core';
import { Skeleton } from './skeleton';
import spine from './lib/spine-core.js';
import { FrameBoneInfo } from './skeleton-cache';

const tempMat4 = new Mat4();
const nodeScale = new Vec3();

/**
 * @en Attach node tool
 * @zh 挂点工具类
 * @class sp.AttachUtil
 */
export class AttachUtil {
    protected _inited = false;
    protected _skeleton:spine.Skeleton|null = null;
    protected _skeletonNode:Node|null = null;
    protected _skeletonComp:Skeleton|null = null;

    constructor () {
        this._inited = false;
        this._skeleton = null;
        this._skeletonNode = null;
        this._skeletonComp = null;
    }

    init (skeletonComp:Skeleton) {
        this._inited = true;
        this._skeleton = skeletonComp._skeleton;
        this._skeletonNode = skeletonComp.node;
        this._skeletonComp = skeletonComp;
    }

    reset () {
        this._inited = false;
        this._skeleton = null;
        this._skeletonNode = null;
        this._skeletonComp = null;
    }

    _syncAttachedNode () {
        if (!this._inited) return;

        const socketNodes = this._skeletonComp!.socketNodes;
        if (socketNodes.size === 0) return;

        let boneInfos:FrameBoneInfo[]|null = null;
        const isCached = this._skeletonComp!.isAnimationCached();
        if (isCached) {
            boneInfos = this._skeletonComp!._curFrame && this._skeletonComp!._curFrame.boneInfos;
        } else {
            boneInfos = this._skeleton!.bones;
        }

        if (!boneInfos) return;

        const matrixHandle = (node:Node, bone:FrameBoneInfo) => {
            nodeScale.set(node.scale);
            const tm = tempMat4;
            tm.m00 = bone.a;
            tm.m01 = bone.c;
            tm.m04 = bone.b;
            tm.m05 = bone.d;
            tm.m12 = bone.worldX;
            tm.m13 = bone.worldY;
            node.matrix = tempMat4;
            node.scale = nodeScale;
        };

        for (const boneIdx of socketNodes.keys()) {
            const boneNode = socketNodes.get(boneIdx);
            // Node has been destroy
            if (!boneNode || !boneNode.isValid) {
                socketNodes.delete(boneIdx);
                continue;
            }
            const bone = boneInfos[boneIdx];
            // Bone has been destroy
            if (!bone) {
                boneNode.removeFromParent();
                boneNode.destroy();
                socketNodes.delete(boneIdx);
                continue;
            }
            matrixHandle(boneNode, bone);
        }
    }
}
