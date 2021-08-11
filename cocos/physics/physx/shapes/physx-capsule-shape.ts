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

/**
 * @packageDocumentation
 * @hidden
 */

import { absMax, Quat } from '../../../core';
import { CapsuleCollider, EAxisDirection } from '../../framework';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { PX } from '../physx-adapter';
import { PhysXWorld } from '../physx-world';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXCapsuleShape extends PhysXShape implements ICapsuleShape {
    static CAPSULE_GEOMETRY: any;

    constructor () {
        super(EPhysXShapeType.CAPSULE);
        if (!PhysXCapsuleShape.CAPSULE_GEOMETRY) {
            PhysXCapsuleShape.CAPSULE_GEOMETRY = new PX.CapsuleGeometry(0.5, 0.5);
        }
    }

    setCylinderHeight (v: number): void {
        this.updateScale();
    }

    setDirection (v: number): void {
        this.updateScale();
    }

    setRadius (v: number): void {
        this.updateScale();
    }

    get collider (): CapsuleCollider {
        return this._collider as CapsuleCollider;
    }

    onComponentSet (): void {
        this.updateGeometry();
        const pxmat = this.getSharedMaterial(this._collider.sharedMaterial!);
        this._impl = PhysXWorld.physics.createShape(PhysXCapsuleShape.CAPSULE_GEOMETRY, pxmat, true, this._flags);
    }

    updateScale (): void {
        this.updateGeometry();
        this._impl.setGeometry(PhysXCapsuleShape.CAPSULE_GEOMETRY);
        this.setCenter(this._collider.center);
    }

    updateGeometry (): void {
        const co = this.collider;
        const ws = co.node.worldScale;
        const upAxis = co.direction;
        let r = 0.5; let hf = 0.5;
        if (upAxis === EAxisDirection.Y_AXIS) {
            r = co.radius * Math.abs(absMax(ws.x, ws.z));
            hf = co.cylinderHeight / 2 * Math.abs(ws.y);
            Quat.fromEuler(this._rotation, 0, 0, 90);
        } else if (upAxis === EAxisDirection.X_AXIS) {
            r = co.radius * Math.abs(absMax(ws.y, ws.z));
            hf = co.cylinderHeight / 2 * Math.abs(ws.x);
            Quat.fromEuler(this._rotation, 0, 0, 0);
        } else {
            r = co.radius * Math.abs(absMax(ws.x, ws.y));
            hf = co.cylinderHeight / 2 * Math.abs(ws.z);
            Quat.fromEuler(this._rotation, 0, 90, 0);
        }
        PhysXCapsuleShape.CAPSULE_GEOMETRY.setRadius(Math.max(0.0001, r));
        PhysXCapsuleShape.CAPSULE_GEOMETRY.setHalfHeight(Math.max(0.0001, hf));
    }
}
