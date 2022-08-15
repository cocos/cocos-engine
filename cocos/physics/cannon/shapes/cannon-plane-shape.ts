/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */

import CANNON from '@cocos/cannon';
import { Vec3, Quat } from '../../../core/math';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { IPlaneShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { PlaneCollider } from '../../../../exports/physics-framework';

export class CannonPlaneShape extends CannonShape implements IPlaneShape {
    public get collider () {
        return this._collider as PlaneCollider;
    }

    public get impl () {
        return this._shape as CANNON.Plane;
    }

    constructor () {
        super();
        this._shape = new CANNON.Plane();
    }

    setNormal (v: IVec3Like) {
        Quat.rotationTo(this._orient, Vec3.UNIT_Z, v);
        if (this._index !== -1) {
            commitShapeUpdates(this._body);
        }
    }

    setConstant (v: number) {
        Vec3.scaleAndAdd(this._offset, this._collider.center, this.collider.normal, v);
    }

    onLoad () {
        super.onLoad();
        this.setConstant(this.collider.constant);
        this.setNormal(this.collider.normal);
    }

    _setCenter (v: IVec3Like) {
        super._setCenter(v);
        this.setConstant(this.collider.constant);
    }
}
