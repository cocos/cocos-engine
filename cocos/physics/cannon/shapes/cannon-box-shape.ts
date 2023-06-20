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
import { clamp, Vec3 } from '../../../core';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { IBoxShape } from '../../spec/i-physics-shape';
import { BoxCollider, PhysicsSystem } from '../../../../exports/physics-framework';
import { absolute, VEC3_0 } from '../../utils/util';

export class CannonBoxShape extends CannonShape implements IBoxShape {
    public get collider (): BoxCollider {
        return this._collider as BoxCollider;
    }

    public get impl (): CANNON.Box {
        return this._shape as CANNON.Box;
    }

    readonly halfExtent: CANNON.Vec3;
    constructor () {
        super();
        this.halfExtent = new CANNON.Vec3(0.5, 0.5, 0.5);
        this._shape = new CANNON.Box(this.halfExtent.clone());
    }

    updateSize (): void {
        Vec3.multiplyScalar(this.halfExtent, this.collider.size, 0.5);
        const ws = absolute(VEC3_0.set(this.collider.node.worldScale));
        const x = this.halfExtent.x * ws.x;
        const y = this.halfExtent.y * ws.y;
        const z = this.halfExtent.z * ws.z;
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        this.impl.halfExtents.x = clamp(x, minVolumeSize, Number.MAX_VALUE);
        this.impl.halfExtents.y = clamp(y, minVolumeSize, Number.MAX_VALUE);
        this.impl.halfExtents.z = clamp(z, minVolumeSize, Number.MAX_VALUE);
        this.impl.updateConvexPolyhedronRepresentation();
        if (this._index !== -1) {
            commitShapeUpdates(this._body);
        }
    }

    onLoad (): void {
        super.onLoad();
        this.updateSize();
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.updateSize();
    }
}
