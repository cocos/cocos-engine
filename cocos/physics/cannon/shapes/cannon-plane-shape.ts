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

import CANNON from '@cocos/cannon';
import { Vec3, Quat, IVec3Like } from '../../../core';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { IPlaneShape } from '../../spec/i-physics-shape';
import { PlaneCollider } from '../../../../exports/physics-framework';

export class CannonPlaneShape extends CannonShape implements IPlaneShape {
    public get collider (): PlaneCollider {
        return this._collider as PlaneCollider;
    }

    public get impl (): CANNON.Plane {
        return this._shape as CANNON.Plane;
    }

    constructor () {
        super();
        this._shape = new CANNON.Plane();
    }

    setNormal (v: IVec3Like): void {
        Quat.rotationTo(this._orient, Vec3.UNIT_Z, v);
        if (this._index !== -1) {
            commitShapeUpdates(this._body);
        }
    }

    setConstant (v: number): void {
        Vec3.scaleAndAdd(this._offset, this._collider.center, this.collider.normal, v);
    }

    onLoad (): void {
        super.onLoad();
        this.setConstant(this.collider.constant);
        this.setNormal(this.collider.normal);
    }

    _setCenter (v: IVec3Like): void {
        super._setCenter(v);
        this.setConstant(this.collider.constant);
    }
}
