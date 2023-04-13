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

import { Rect, Vec2 } from '../../core';
import { ILifecycle } from '../../physics/spec/i-lifecycle';
import { Collider2D, RigidBody2D } from '../../../exports/physics-2d-framework';

export interface IBaseShape extends ILifecycle {
    readonly impl: any;
    readonly collider: Collider2D;
    readonly worldAABB: Readonly<Rect>;

    // readonly attachedRigidBody: RigidBody2D | null;
    initialize (v: Collider2D): void;
    apply (): void;
    onGroupChanged (): void;
}

export interface IBoxShape extends IBaseShape {
    worldPoints: readonly Readonly<Vec2>[];
}

export interface ICircleShape extends IBaseShape {
    worldPosition: Readonly<Vec2>;
    worldRadius: number;
}

export interface IPolygonShape extends IBaseShape {
    worldPoints: readonly Readonly<Vec2>[];
}
