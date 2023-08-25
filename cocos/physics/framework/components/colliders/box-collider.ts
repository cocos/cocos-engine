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
import { Vec3 } from '../../../../core';
import { Collider } from './collider';
import { IBoxShape } from '../../../spec/i-physics-shape';
import { EColliderType } from '../../physics-enum';
import { absolute } from '../../../utils/util';

/**
 * @en
 * Box collider component.
 * @zh
 * 盒子碰撞器。
 */
@ccclass('cc.BoxCollider')
@help('i18n:cc.BoxCollider')
@menu('Physics/BoxCollider')
@executeInEditMode
export class BoxCollider extends Collider {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the size of the box, in local space.
     * @zh
     * 获取或设置盒的大小。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.collider.box_size')
    public get size (): Vec3 {
        return this._size;
    }

    public set size (value) {
        if (Vec3.strictEquals(this._size, value)) return;
        Vec3.copy(this._size, value);
        absolute(this._size);
        if (this._shape) {
            this.shape.updateSize();
        }
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape (): IBoxShape {
        return this._shape as IBoxShape;
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _size: Vec3 = new Vec3(1, 1, 1);

    constructor () {
        super(EColliderType.BOX);
    }
}
