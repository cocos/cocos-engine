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

import { IContactEquation, ICollisionEvent } from '../framework';
import { IVec3Like, Vec3, Quat } from '../../core';
import { BulletShape } from './shapes/bullet-shape';
import { CC_QUAT_0, BulletConstant } from './bullet-const';

export class BulletContactData implements IContactEquation {
    get isBodyA (): boolean {
        // const sb = (this.event.selfCollider.shape as AmmoShape).sharedBody.body;
        // const b0 = (this.event.impl as Ammo.btPersistentManifold).getBody0();
        // return Ammo.compare(b0, sb);
        return false;
    }

    impl: any | null = null;
    event: ICollisionEvent;

    constructor (event: ICollisionEvent) {
        this.event = event;
    }

    getLocalPointOnA (out: IVec3Like): void {
        // if (this.impl) ammo2CocosVec3(out, this.impl.m_localPointA);
    }

    getLocalPointOnB (out: IVec3Like): void {
        // if (this.impl) ammo2CocosVec3(out, this.impl.m_localPointB);
    }

    getWorldPointOnA (out: IVec3Like): void {
        // if (this.impl) ammo2CocosVec3(out, this.impl.m_positionWorldOnA);
    }

    getWorldPointOnB (out: IVec3Like): void {
        // if (this.impl) ammo2CocosVec3(out, this.impl.m_positionWorldOnB);
    }

    getLocalNormalOnA (out: IVec3Like): void {
        // if (this.impl) {
        //     ammo2CocosVec3(out, this.impl.m_normalWorldOnB);
        //     if (!this.isBodyA) Vec3.negate(out, out);
        //     const inv_rot = CC_QUAT_0;
        //     const bt_rot = AmmoConstant.instance.QUAT_0;
        //     const body = (this.event.impl as Ammo.btPersistentManifold).getBody0();
        //     body.getWorldTransform().getBasis().getRotation(bt_rot);
        //     ammo2CocosQuat(inv_rot, bt_rot);
        //     Quat.conjugate(inv_rot, inv_rot);
        //     Vec3.transformQuat(out, out, inv_rot);
        // }
    }

    getLocalNormalOnB (out: IVec3Like): void {
        // if (this.impl) {
        //     const inv_rot = CC_QUAT_0;
        //     const bt_rot = AmmoConstant.instance.QUAT_0;
        //     const body = (this.event.impl as Ammo.btPersistentManifold).getBody1();
        //     body.getWorldTransform().getBasis().getRotation(bt_rot);
        //     ammo2CocosQuat(inv_rot, bt_rot);
        //     Quat.conjugate(inv_rot, inv_rot);
        //     ammo2CocosVec3(out, this.impl.m_normalWorldOnB);
        //     Vec3.transformQuat(out, out, inv_rot);
        // }
    }

    getWorldNormalOnA (out: IVec3Like): void {
        // if (this.impl) {
        //     ammo2CocosVec3(out, this.impl.m_normalWorldOnB);
        //     if (!this.isBodyA) Vec3.negate(out, out);
        // }
    }

    getWorldNormalOnB (out: IVec3Like): void {
        // if (this.impl) ammo2CocosVec3(out, this.impl.m_normalWorldOnB);
    }
}
