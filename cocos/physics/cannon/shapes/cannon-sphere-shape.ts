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
import { absMaxComponent, clamp, Vec3 } from '../../../core';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { ISphereShape } from '../../spec/i-physics-shape';
import { PhysicsSystem, SphereCollider } from '../../../../exports/physics-framework';

export class CannonSphereShape extends CannonShape implements ISphereShape {
    get collider (): SphereCollider {
        return this._collider as SphereCollider;
    }

    get impl (): CANNON.Sphere {
        return this._shape as CANNON.Sphere;
    }

    updateRadius (): void {
        const max = Math.abs(absMaxComponent(this.collider.node.worldScale));
        this.impl.radius = clamp(this.collider.radius * Math.abs(max), PhysicsSystem.instance.minVolumeSize, Number.MAX_VALUE);
        this.impl.updateBoundingSphereRadius();
        if (this._index !== -1) {
            commitShapeUpdates(this._body);
        }
    }

    constructor (radius = 0.5) {
        super();
        this._shape = new CANNON.Sphere(radius);
    }

    onLoad (): void {
        super.onLoad();
        this.updateRadius();
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.updateRadius();
    }
}
