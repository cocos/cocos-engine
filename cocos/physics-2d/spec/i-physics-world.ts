/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { IVec2Like, Rect, Vec2 } from '../../core';
import { ERaycast2DType, RaycastResult2D, Collider2D } from '../framework';

export interface IPhysicsWorld {
    readonly impl: any;
    debugDrawFlags: number;
    setGravity: (v: IVec2Like) => void;
    setAllowSleep: (v: boolean) => void;
    // setDefaultMaterial: (v: PhysicMaterial) => void;
    step (deltaTime: number, velocityIterations?: number, positionIterations?: number): void;
    syncPhysicsToScene (): void;
    syncSceneToPhysics (): void;
    raycast (p1: IVec2Like, p2: IVec2Like, type: ERaycast2DType, mask: number): RaycastResult2D[];
    testPoint (p: Vec2): readonly Collider2D[];
    testAABB (rect: Rect): readonly Collider2D[];
    drawDebug (): void;
}
