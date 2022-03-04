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
import { CC_QUAT_0, BulletCache } from './bullet-cache';
import { bt } from './instantiated';
import { bullet2CocosQuat, bullet2CocosVec3 } from './bullet-utils';

export class BulletContactData implements IContactEquation {
    get isBodyA (): boolean {
        const sb = (this.event.selfCollider.shape as BulletShape).sharedBody.body;
        return sb === bt.PersistentManifold_getBody0(this.impl);
    }

    impl: Bullet.ptr = 0;

    constructor (public event: ICollisionEvent) { }

    getLocalPointOnA (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_localPointA(this.impl));
    }

    getLocalPointOnB (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_localPointB(this.impl));
    }

    getWorldPointOnA (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_positionWorldOnA(this.impl));
    }

    getWorldPointOnB (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_positionWorldOnB(this.impl));
    }

    getLocalNormalOnA (out: IVec3Like): void {
        if (this.impl) {
            const bt_rot = BulletCache.instance.BT_QUAT_0;
            const body = bt.PersistentManifold_getBody0(this.impl);
            const trans = bt.CollisionObject_getWorldTransform(body);
            bt.Transform_getRotation(trans, bt_rot);
            const inv_rot = CC_QUAT_0;
            bullet2CocosQuat(inv_rot, bt_rot);
            Quat.conjugate(inv_rot, inv_rot);
            bullet2CocosVec3(out, bt.ManifoldPoint_get_m_normalWorldOnB(this.impl));
            if (!this.isBodyA) Vec3.negate(out, out);
            Vec3.transformQuat(out, out, inv_rot);
        }
    }

    getLocalNormalOnB (out: IVec3Like): void {
        if (this.impl) {
            const bt_rot = BulletCache.instance.BT_QUAT_0;
            const body = bt.PersistentManifold_getBody1(this.impl);
            const trans = bt.CollisionObject_getWorldTransform(body);
            bt.Transform_getRotation(trans, bt_rot);
            const inv_rot = CC_QUAT_0;
            bullet2CocosQuat(inv_rot, bt_rot);
            Quat.conjugate(inv_rot, inv_rot);
            bullet2CocosVec3(out, bt.ManifoldPoint_get_m_normalWorldOnB(this.impl));
            Vec3.transformQuat(out, out, inv_rot);
        }
    }

    getWorldNormalOnA (out: IVec3Like): void {
        if (this.impl) {
            bullet2CocosVec3(out, bt.ManifoldPoint_get_m_normalWorldOnB(this.impl));
            if (!this.isBodyA) Vec3.negate(out, out);
        }
    }

    getWorldNormalOnB (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_normalWorldOnB(this.impl));
    }
}
