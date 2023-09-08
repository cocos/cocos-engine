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

import { Vec3, geometry } from '../../../core';
import { BuiltinShape } from './builtin-shape';
import { ISphereShape } from '../../spec/i-physics-shape';
import { maxComponent } from '../../utils/util';
import { SphereCollider } from '../../../../exports/physics-framework';

const tempMin = new Vec3();
const tempMax = new Vec3();
export class BuiltinSphereShape extends BuiltinShape implements ISphereShape {
    updateRadius (): void {
        this.localSphere.radius = this.collider.radius;
        const s = maxComponent(this.collider.node.worldScale);
        this.worldSphere.radius = this.localSphere.radius * s;
    }

    get localSphere (): geometry.Sphere {
        return this._localShape as geometry.Sphere;
    }

    get worldSphere (): geometry.Sphere {
        return this._worldShape as geometry.Sphere;
    }

    get collider (): SphereCollider {
        return this._collider as SphereCollider;
    }

    constructor (radius = 0.5) {
        super();
        this._localShape = new geometry.Sphere(0, 0, 0, radius);
        this._worldShape = new geometry.Sphere(0, 0, 0, radius);
    }

    onLoad (): void {
        super.onLoad();
        this.updateRadius();
    }

    getAABB (v: geometry.AABB): void {
        this.worldSphere.getBoundary(tempMin, tempMax);
        geometry.AABB.fromPoints(v, tempMin, tempMax);
    }
}
