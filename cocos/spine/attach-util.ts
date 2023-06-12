/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Mat4 } from '../core';
import { Skeleton } from './skeleton';
import { Node } from '../scene-graph';
import spine from './lib/spine-core';

const tempMat4 = new Mat4();

/**
 * @en Attach node tool
 * @zh 挂点工具类
 * @class sp.AttachUtil
 */
export class AttachUtil {
    protected _inited = false;
    protected _skeleton: spine.Skeleton | null = null;
    protected _skeletonNode: Node|null = null;
    protected _skeletonComp: Skeleton|null = null;

    constructor () {
        this._inited = false;
        this._skeleton = null;
        this._skeletonNode = null;
        this._skeletonComp = null;
    }

    init (skeletonComp: Skeleton) {
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

        let boneInfos;
        const isCached = this._skeletonComp!.isAnimationCached();
        if (isCached && this._skeletonComp!._curFrame) {
            boneInfos = this._skeletonComp!._curFrame.boneInfos;
        } else {
            boneInfos = this._skeleton!.bones;
        }

        if (!boneInfos || boneInfos.length < 1) return;

        const matrixHandle = (node: Node, bone: any) => {
            const tm = tempMat4;
            tm.m00 = bone.a;
            tm.m01 = bone.c;
            tm.m04 = bone.b;
            tm.m05 = bone.d;
            tm.m12 = bone.worldX;
            tm.m13 = bone.worldY;
            node.matrix = tempMat4;
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
