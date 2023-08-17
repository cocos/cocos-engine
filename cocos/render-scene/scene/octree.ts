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

import { Vec3 } from '../../core';
import { OctreeInfo } from '../../scene-graph/scene-globals';

/**
 * @en The octree culling configuration of the render scene
 * @zh 渲染场景的八叉树剔除配置
 */
export class Octree {
    /**
     * @en Whether octree culling is enabled in the render scene
     * @zh 是否开启八叉树加速剔除
     */
    set enabled (val: boolean) {
        this._enabled = val;
    }
    get enabled (): boolean {
        return this._enabled;
    }

    /**
     * @en Minimum position of the scene's bounding box
     * @zh 场景包围盒最小值
     */
    get minPos (): Vec3 {
        return this._minPos;
    }
    set minPos (val: Vec3) {
        this._minPos = val;
    }

    /**
     * @en Maximum position of the scene's bounding box
     * @zh 场景包围盒最大值
     */
    get maxPos (): Vec3 {
        return this._maxPos;
    }
    set maxPos (val: Vec3) {
        this._maxPos = val;
    }

    /**
     * @en The depth of the octree
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

    public initialize (octreeInfo: OctreeInfo): void {
        this._enabled = octreeInfo.enabled;
        this._minPos = octreeInfo.minPos;
        this._maxPos = octreeInfo.maxPos;
        this._depth = octreeInfo.depth;
    }
}
