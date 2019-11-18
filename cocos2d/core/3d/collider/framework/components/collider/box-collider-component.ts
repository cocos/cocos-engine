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

import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../../../platform/CCClassDecorator';
import { Vec3 } from '../../../../../value-types';
import { createBoxShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { IBoxShape } from '../../../spec/i-collider-shape';

/**
 * !#en Box Collider
 * !#zh 盒子碰撞器
 */
@ccclass('cc.BoxColliderComponent')
@executionOrder(98)
@menu('i18n:MAIN_MENU.component.collider/Box Collider 3D')
@executeInEditMode
export class BoxColliderComponent extends ColliderComponent {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * !#en Get or set the size of the box, in local space.
     * !#zh 获取或设置盒的大小。
     */
    @property({
        type: Vec3,
        tooltip: 'i18n:COMPONENT.collider3D.size'
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

    public get boxShape (): IBoxShape {
        return this._shape as IBoxShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _size: Vec3 = new Vec3(1, 1, 1);

    constructor () {
        super();
        if (!CC_EDITOR) {
            this._shape = createBoxShape(this._size);
        }
    }

}

cc.BoxColliderComponent = BoxColliderComponent;