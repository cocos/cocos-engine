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

import { B2 } from '../instantiated';
import { B2Shape2D } from './shape-2d';
import { BoxCollider2D } from '../../framework';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';
import { IBoxShape } from '../../spec/i-physics-shape';
import { Vec2, Rect } from '../../../core';

const tempAabb = new Rect();
const tempB2Vec2_1 = { x: 0, y: 0 };

export class B2BoxShape extends B2Shape2D implements IBoxShape {
    _worldPoints: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
    get worldPoints (): Readonly<Vec2>[] {
        const aabb = tempAabb;

        const collider = this.collider as BoxCollider2D;
        const size = collider.size;
        const offset = collider.offset;

        aabb.x = offset.x - size.width / 2;
        aabb.y = offset.y - size.height / 2;
        aabb.width = size.width;
        aabb.height = size.height;

        const wps = this._worldPoints;
        const wp0 = wps[0]; const wp1 = wps[1];
        const wp2 = wps[2]; const wp3 = wps[3];

        aabb.transformMat4ToPoints(collider.node.worldMatrix, wp0, wp1, wp2, wp3);

        return wps;
    }

    _createShapes (scaleX: number, scaleY: number, relativePositionX: number, relativePositionY: number): number[] { //B2.PolygonShape[]
        scaleX = Math.abs(scaleX);
        scaleY = Math.abs(scaleY);

        const comp = this.collider as BoxCollider2D;

        const width = comp.size.width / 2 / PHYSICS_2D_PTM_RATIO * scaleX;
        const height = comp.size.height / 2 / PHYSICS_2D_PTM_RATIO * scaleY;
        const offsetX = (relativePositionX + comp.offset.x * scaleX) / PHYSICS_2D_PTM_RATIO;
        const offsetY = (relativePositionY + comp.offset.y * scaleY) / PHYSICS_2D_PTM_RATIO;

        const shape = B2.PolygonShapeNew() as number;
        B2.PolygonShapeSetAsBoxWithCenterAndAngle(shape, width, height, offsetX, offsetY, 0);
        return [shape];
    }
}
