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
    serializable,
} from 'cc.decorator';
import { Collider } from './collider';
import { ISphereShape } from '../../../spec/i-physics-shape';
import { EColliderType } from '../../physics-enum';

/**
 * @en
 * Sphere collider component.
 * @zh
 * 球碰撞器。
 */
@ccclass('cc.SphereCollider')
@help('i18n:cc.SphereCollider')
@menu('Physics/SphereCollider')
@executeInEditMode
export class SphereCollider extends Collider {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the radius of the sphere.
     * @zh
     * 获取或设置球的半径。
     */
    @tooltip('i18n:physics3d.collider.sphere_radius')
    public get radius (): number {
        return this._radius;
    }

    public set radius (value) {
        if (this._radius === value) return;
        this._radius = Math.abs(value);
        if (this._shape) {
            this.shape.updateRadius();
        }
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape (): ISphereShape {
        return this._shape as ISphereShape;
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _radius = 0.5;

    constructor () {
        super(EColliderType.SPHERE);
    }
}
