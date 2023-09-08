/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import { createSphereShape } from '../../instance';
import { Collider3D } from './collider-component';
import { ISphereShape } from '../../../spec/i-physics-shape';

const {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
    help,
} = cc._decorator;

/**
 * !#en
 * Physics sphere collider
 * !#zh
 * 物理球碰撞器
 * @class SphereCollider3D
 * @extends Collider3D
 */
@ccclass('cc.SphereCollider3D')
@executionOrder(98)
@menu('i18n:MAIN_MENU.component.physics/Collider/Sphere 3D')
@help('i18n:COMPONENT.help_url.physics-collider')
@executeInEditMode
export class SphereCollider3D extends Collider3D {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * !#en
     * Get or set the radius of the sphere.
     * !#zh
     * 获取或设置球的半径。
     * @property {number} radius
     */
    @property
    public get radius () {
        return this._radius;
    }

    public set radius (value) {
        this._radius = value;
        if (!CC_EDITOR) {
            this.sphereShape.radius = this._radius;
        }
    }

    /**
     * @property {ISphereShape} sphereShape
     */
    public get sphereShape (): ISphereShape {
        return this._shape as ISphereShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _radius: number = 0.5;

    constructor () {
        super();
        if (!CC_EDITOR) {
            this._shape = createSphereShape(this._radius);
        }
    }
}
