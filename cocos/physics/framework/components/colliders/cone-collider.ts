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

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    tooltip,
    type,
    serializable,
} from 'cc.decorator';
import { Collider } from './collider';
import { IConeShape } from '../../../spec/i-physics-shape';
import { EAxisDirection, EColliderType } from '../../physics-enum';

/**
 * @en
 * Cone collider component.
 * @zh
 * 圆锥体碰撞器。
 */
@ccclass('cc.ConeCollider')
@help('i18n:cc.ConeCollider')
@menu('Physics/ConeCollider')
@executeInEditMode
export class ConeCollider extends Collider {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the radius of the circle on the cone body, in local space.
     * @zh
     * 获取或设置圆锥体上圆面半径。
     */
    @tooltip('i18n:physics3d.collider.cone_radius')
    public get radius (): number {
        return this._radius;
    }

    public set radius (value) {
        if (this._radius === value) return;
        this._radius = Math.abs(value);
        if (this._shape) {
            this.shape.setRadius(value);
        }
    }

    /**
     * @en
     * Gets or sets the cone body is at the corresponding axial height, in local space.
     * @zh
     * 获取或设置圆锥体在相应轴向的高度。
     */
    @tooltip('i18n:physics3d.collider.cone_height')
    public get height (): number {
        return this._height;
    }

    public set height (value) {
        if (this._height === value) return;
        if (value < 0) value = 0;
        this._height = value;
        if (this._shape) {
            this.shape.setHeight(value);
        }
    }

    /**
     * @en
     * Gets or sets the cone direction, in local space.
     * @zh
     * 获取或设置在圆锥体本地空间上的方向。
     */
    @type(EAxisDirection)
    @tooltip('i18n:physics3d.collider.cone_direction')
    public get direction (): EAxisDirection {
        return this._direction;
    }

    public set direction (value: EAxisDirection) {
        if (this._direction === value) return;
        if (value < EAxisDirection.X_AXIS || value > EAxisDirection.Z_AXIS) return;
        this._direction = value;
        if (this._shape) {
            this.shape.setDirection(value);
        }
    }

    public get shape (): IConeShape {
        return this._shape as IConeShape;
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _radius = 0.5;

    @serializable
    private _height = 1;

    @serializable
    private _direction = EAxisDirection.Y_AXIS;

    constructor () {
        super(EColliderType.CONE);
    }
}
