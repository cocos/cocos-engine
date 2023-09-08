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

import { createBoxShape } from '../../instance';
import { Collider3D } from './collider-component';
import { IBoxShape } from '../../../spec/i-physics-shape';

const {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
    help,
} = cc._decorator;

const Vec3 = cc.Vec3;

/**
 * !#en
 * Physics box collider
 * !#zh
 * 物理盒子碰撞器
 * @class BoxCollider3D
 * @extends Collider3D
 */
@ccclass('cc.BoxCollider3D')
@executionOrder(98)
@menu('i18n:MAIN_MENU.component.physics/Collider/Box 3D')
@executeInEditMode
@help('i18n:COMPONENT.help_url.physics-collider')
export class BoxCollider3D extends Collider3D {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * !#en
     * Get or set the size of the box, in local space.
     * !#zh
     * 获取或设置盒的大小。
     * @property {Vec3} size
     */
    @property({
        type: cc.Vec3
    })
    public get size () {
        return this._size;
    }

    public set size (value) {
        Vec3.copy(this._size, value);
        if (!CC_EDITOR) {
            this.boxShape.size = this._size;
        }
    }

    /**
     * @property {IBoxShape} boxShape
     * @readonly
     */
    public get boxShape (): IBoxShape {
        return this._shape as IBoxShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _size: cc.Vec3 = new Vec3(1, 1, 1);

    constructor () {
        super();
        if (!CC_EDITOR) {
            this._shape = createBoxShape(this._size);
        }
    }

}
