/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */

import { Vec3 } from '../../math/vec3';
import { OctreeInfo } from '../../scene-graph/scene-globals';

export class Octree {
    /**
     * @en enable octree
     * @zh 是否开启八叉树加速剔除
     */
    set enabled (val: boolean) {
        this._enabled = val;
    }
    get enabled (): boolean {
        return this._enabled;
    }

    /**
     * @en min pos of scene bounding box
     * @zh 场景包围盒最小值
     */
    get minPos (): Vec3 {
        return this._minPos;
    }
    set minPos (val: Vec3) {
        this._minPos = val;
    }

    /**
     * @en max pos of scene bounding box
     * @zh 场景包围盒最大值
     */
    get maxPos (): Vec3 {
        return this._maxPos;
    }
    set maxPos (val: Vec3) {
        this._maxPos = val;
    }

    /**
     * @en depth of octree
     * @zh 八叉树深度
     */
    get depth (): number {
        return this._depth;
    }

    set depth (val: number) {
        this._depth = val;
    }

    protected _enabled = false;
    protected _minPos = new Vec3(0, 0, 0);
    protected _maxPos = new Vec3(0, 0, 0);
    protected _depth = 0;

    public initialize (octreeInfo: OctreeInfo) {
        this._enabled = octreeInfo.enabled;
        this._minPos = octreeInfo.minPos;
        this._maxPos = octreeInfo.maxPos;
        this._depth = octreeInfo.depth;
    }
}
