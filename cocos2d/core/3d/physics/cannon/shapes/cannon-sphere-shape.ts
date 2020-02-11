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

import CANNON from '../../../../../../external/cannon/cannon';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { ISphereShape } from '../../spec/i-physics-shape';
import { SphereCollider3D } from '../../exports/physics-framework';

const v3_0 = new cc.Vec3();
export class CannonSphereShape extends CannonShape implements ISphereShape {

    get sphereCollider () {
        return this.collider as SphereCollider3D;
    }

    get sphere () {
        return this._shape as CANNON.Sphere;
    }

    get radius () {
        return this._radius;
    }

    set radius (v: number) {
        this.collider.node.getWorldScale(v3_0);
        const max = v3_0.maxAxis();
        this.sphere.radius = v * Math.abs(max);
        this.sphere.updateBoundingSphereRadius();
        if (this._index != -1) {
            commitShapeUpdates(this._body);
        }
    }

    private _radius: number;

    constructor (radius: number) {
        super();
        this._radius = radius;
        this._shape = new CANNON.Sphere(this._radius);
    }

    onLoad () {
        super.onLoad();
        this.radius = this.sphereCollider.radius;
    }

    setScale (scale: cc.Vec3): void {
        super.setScale(scale);
        this.radius = this.sphereCollider.radius;
    }

}
