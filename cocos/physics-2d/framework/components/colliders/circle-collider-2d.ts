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

import { CCFloat, Vec2, _decorator } from '../../../../core';
import { Collider2D } from './collider-2d';
import { ECollider2DType } from '../../physics-types';
import { ICircleShape } from '../../../spec/i-physics-shape';
import { help, serializable, tooltip, type } from '../../../../core/data/decorators';

const { ccclass, menu, property } = _decorator;

@ccclass('cc.CircleCollider2D')
@help('i18n:cc.CircleCollider2D')
@menu('Physics2D/Colliders/CircleCollider2D')
export class CircleCollider2D extends Collider2D {
    @serializable
    private _radius = 1;

    /**
     * @en Circle radius.
     * @zh 圆形半径。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.collider.radius')
    get radius (): number {
        return this._radius;
    }
    set radius (v) {
        this._radius = v < 0 ? 0 : v;
    }

    /**
     * @en Get world center of the circle collider.
     * @zh 世界坐标下圆形碰撞体的中心。
     */
    get worldPosition (): Readonly<Vec2> {
        if (this._shape) {
            return (this._shape as ICircleShape).worldPosition;
        }
        return new Vec2();
    }
    /**
     * @en Get world radius of the circle collider.
     * @zh 世界坐标下圆形碰撞体的半径。
     */
    get worldRadius (): number {
        if (this._shape) {
            return (this._shape as ICircleShape).worldRadius;
        }
        return 0;
    }

    readonly TYPE = ECollider2DType.CIRCLE;
}
