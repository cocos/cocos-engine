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
import { IBoxShape } from '../../spec/i-physics-shape';
import { BoxCollider } from '../../../../exports/physics-framework';

const tempMin = new Vec3();
const tempMax = new Vec3();

export class BuiltinBoxShape extends BuiltinShape implements IBoxShape {
    get localObb (): geometry.OBB {
        return this._localShape as geometry.OBB;
    }

    get worldObb (): geometry.OBB {
        return this._worldShape as geometry.OBB;
    }

    get collider (): BoxCollider {
        return this._collider as BoxCollider;
    }

    constructor () {
        super();
        this._localShape = new geometry.OBB();
        this._worldShape = new geometry.OBB();
    }

    updateSize (): void {
        Vec3.multiplyScalar(this.localObb.halfExtents, this.collider.size, 0.5);
        Vec3.multiply(this.worldObb.halfExtents, this.localObb.halfExtents, this.collider.node.worldScale);
    }

    onLoad (): void {
        super.onLoad();
        this.updateSize();
    }

    getAABB (v: geometry.AABB): void {
        this.worldObb.getBoundary(tempMin, tempMax);
        geometry.AABB.fromPoints(v, tempMin, tempMax);
    }
}
