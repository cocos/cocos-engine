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

import { IVec3Like, Quat, Vec3 } from '../../../core';
import { PlaneCollider } from '../../framework';
import { IPlaneShape } from '../../spec/i-physics-shape';
import { getTempTransform, PX, _pxtrans, _trans } from '../physx-adapter';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXPlaneShape extends PhysXShape implements IPlaneShape {
    static PLANE_GEOMETRY: any;

    constructor () {
        super(EPhysXShapeType.PLANE);
        if (!PhysXPlaneShape.PLANE_GEOMETRY) {
            PhysXPlaneShape.PLANE_GEOMETRY = new PX.PlaneGeometry();
        }
    }

    setNormal (v: IVec3Like): void {
        this.setCenter();
    }

    setConstant (v: number): void {
        this.setCenter();
    }

    setCenter (): void {
        const co = this.collider;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.scaleAndAdd(pos, co.center, co.normal, co.constant);
        Quat.rotationTo(rot, Vec3.UNIT_X, co.normal);
        const trans = getTempTransform(pos, rot);
        this._impl.setLocalPose(trans);
    }

    get collider (): PlaneCollider {
        return this._collider as PlaneCollider;
    }

    onComponentSet (): void {
        const co = this.collider;
        const physics = this._sharedBody.wrappedWorld.physics;
        const pxmat = this.getSharedMaterial(co.sharedMaterial!);
        this._impl = physics.createShape(PhysXPlaneShape.PLANE_GEOMETRY, pxmat, true, this._flags);
        this.setCenter();
    }

    updateScale (): void {
        this.setCenter();
    }
}
