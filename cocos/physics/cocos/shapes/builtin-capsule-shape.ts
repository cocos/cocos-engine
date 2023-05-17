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

import { BuiltinShape } from './builtin-shape';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { geometry } from '../../../core';
import { EAxisDirection, CapsuleCollider } from '../../framework';

export class BuiltinCapsuleShape extends BuiltinShape implements ICapsuleShape {
    get localCapsule () {
        return this._localShape as geometry.Capsule;
    }

    get worldCapsule () {
        return this._worldShape as geometry.Capsule;
    }

    get collider () {
        return this._collider as CapsuleCollider;
    }

    constructor (radius = 0.5, height = 2, direction = EAxisDirection.Y_AXIS) {
        super();
        const halfHeight = (height - radius * 2) / 2;
        const h = halfHeight < 0 ? 0 : halfHeight;
        this._localShape = new geometry.Capsule(radius, h, direction);
        this._worldShape = new geometry.Capsule(radius, h, direction);
    }

    setRadius (v: number) {
        this.localCapsule.radius = v;
        this.transform(
            this._sharedBody.node.worldMatrix,
            this._sharedBody.node.worldPosition,
            this._sharedBody.node.worldRotation,
            this._sharedBody.node.worldScale,
        );
    }

    setCylinderHeight (v: number) {
        this.localCapsule.halfHeight = v / 2;
        this.localCapsule.updateCache();

        this.transform(
            this._sharedBody.node.worldMatrix,
            this._sharedBody.node.worldPosition,
            this._sharedBody.node.worldRotation,
            this._sharedBody.node.worldScale,
        );
    }

    setDirection (v: EAxisDirection) {
        this.localCapsule.axis = v;
        this.localCapsule.updateCache();

        this.worldCapsule.axis = v;
        this.worldCapsule.updateCache();

        this.transform(
            this._sharedBody.node.worldMatrix,
            this._sharedBody.node.worldPosition,
            this._sharedBody.node.worldRotation,
            this._sharedBody.node.worldScale,
        );
    }

    onLoad () {
        super.onLoad();
        this.setRadius(this.collider.radius);
        this.setDirection(this.collider.direction);
    }
}
