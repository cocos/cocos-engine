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

import { Vec2, _decorator } from '../../../../core';
import { Collider2D } from './collider-2d';
import { ECollider2DType } from '../../physics-types';
import { IPolygonShape } from '../../../spec/i-physics-shape';

const { ccclass, menu, property } = _decorator;

@ccclass('cc.PolygonCollider2D')
@menu('Physics2D/Colliders/PolygonCollider2D')
export class PolygonCollider2D extends Collider2D {
    @property({ serializable: false, displayOrder: 0 })
    threshold = 1;

    @property
    private _points = [new Vec2(-1, -1), new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1)];

    /**
     * @en Polygon points.
     * @zh 多边形顶点数组。
     */
    @property({ type: Vec2 })
    get points () {
        return this._points;
    }
    set points (v) {
        this._points = v;
    }

    /**
     * @en Get world points.
     * @zh 世界坐标下多边形碰撞体的点。
     */
    get worldPoints (): readonly Readonly<Vec2>[] {
        if (this._shape) {
            return (this._shape as IPolygonShape).worldPoints;
        }
        return [];
    }

    readonly TYPE = ECollider2DType.POLYGON;
}
