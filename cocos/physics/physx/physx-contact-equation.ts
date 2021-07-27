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

import { IVec3Like, Vec3, Quat } from '../../core';
import { IContactEquation, ICollisionEvent, Collider } from '../framework';
import { getContactNormal, getContactPosition } from './physx-adapter';

const quat = new Quat();
export class PhysXContactEquation implements IContactEquation {
    get isBodyA (): boolean {
        return this.colliderA.uuid === this.event.selfCollider.uuid;
    }

    impl: any = null;
    event: ICollisionEvent;
    colliderA!: Collider;
    colliderB!: Collider;

    constructor (event: ICollisionEvent) {
        this.event = event;
    }

    getLocalPointOnA (out: IVec3Like): void {
        getContactPosition(this.impl, out, this.event.impl);
        Vec3.subtract(out, out, this.colliderA.node.worldPosition);
    }

    getLocalPointOnB (out: IVec3Like): void {
        getContactPosition(this.impl, out, this.event.impl);
        Vec3.subtract(out, out, this.colliderB.node.worldPosition);
    }

    getWorldPointOnA (out: IVec3Like): void {
        getContactPosition(this.impl, out, this.event.impl);
    }

    getWorldPointOnB (out: IVec3Like): void {
        getContactPosition(this.impl, out, this.event.impl);
    }

    getLocalNormalOnA (out: IVec3Like): void {
        this.getWorldNormalOnA(out);
        Quat.conjugate(quat, this.colliderA.node.worldRotation);
        Vec3.transformQuat(out, out, quat);
    }

    getLocalNormalOnB (out: IVec3Like): void {
        this.getWorldNormalOnB(out);
        Quat.conjugate(quat, this.colliderB.node.worldRotation);
        Vec3.transformQuat(out, out, quat);
    }

    getWorldNormalOnA (out: IVec3Like): void {
        getContactNormal(this.impl, out, this.event.impl);
        if (!this.isBodyA) Vec3.negate(out, out);
    }

    getWorldNormalOnB (out: IVec3Like): void {
        getContactNormal(this.impl, out, this.event.impl);
    }
}
