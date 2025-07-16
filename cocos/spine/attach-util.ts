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
import { FrameBoneInfo } from './skeleton-cache';

const tempMat4 = new Mat4();

/**
 * @en Attach node tool
 * @zh 挂点工具类
 * @class sp.AttachUtil
 */
export class AttachUtil {
    protected _isInitialized = false;
    protected _skeletonBones: spine.Bone[] | FrameBoneInfo[] | null = null;
    protected _socketNodes: Map<number, Node> | null = null;
    private _keysToDelete: number[] = [];

    constructor () {
        this._isInitialized = false;
    }

    init (skeletonComp: Skeleton): void {
        this._isInitialized = false;
        if (!skeletonComp || skeletonComp.socketNodes?.size === 0) return;
        this._skeletonBones = skeletonComp._skeleton.bones;
        if (!this._skeletonBones || this._skeletonBones.length < 1) return;
        this._socketNodes = skeletonComp.socketNodes;
        if (!this._socketNodes || this._socketNodes.size <= 0) return;
        this._isInitialized = true;
        this._syncAttachedNode();
    }

    updateSkeletonBones (bones: FrameBoneInfo[]): void {
        this._skeletonBones = bones;
    }

    reset (): void {
        this._isInitialized = false;
        this._skeletonBones = null;
        this._socketNodes = null;
        this._keysToDelete.length = 0;
    }

    _syncAttachedNode (): void {
        if (!this._isInitialized) return;
        const socketNodes = this._socketNodes!;
        for (const [boneIdx, boneNode] of socketNodes) {
            if (!boneNode || !boneNode.isValid) {
                this._keysToDelete.push(boneIdx);
                continue;
            }
            const bone =  this._skeletonBones![boneIdx];
            if (bone) this.matrixHandle(boneNode, bone);
        }
        if (this._keysToDelete.length <= 0) return;
        for (const boneIdx of this._keysToDelete) {
            socketNodes.delete(boneIdx);
        }
        this._keysToDelete.length = 0;
    }

    matrixHandle (node: Node, bone: any): void {
        const tm = tempMat4;
        tm.m00 = bone.a;
        tm.m01 = bone.c;
        tm.m04 = bone.b;
        tm.m05 = bone.d;
        tm.m12 = bone.worldX;
        tm.m13 = bone.worldY;
        node.matrix = tempMat4;
    }
}
