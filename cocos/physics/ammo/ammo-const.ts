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

/* eslint-disable new-cap */
// import Ammo from './instantiated';
import { Collider, TriggerEventType, CollisionEventType, IContactEquation } from '../../../exports/physics-framework';
import { Vec3, Quat } from '../../core';
import { bt } from './export-bullet';

export const TriggerEventObject = {
    type: 'onTriggerEnter' as unknown as TriggerEventType,
    selfCollider: null as unknown as Collider,
    otherCollider: null as unknown as Collider,
    impl: null,
};

export const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as unknown as Collider,
    otherCollider: null as unknown as Collider,
    contacts: [] as IContactEquation[],
    impl: null,
};

export class AmmoConstant {
    private static _instance: AmmoConstant;
    static get instance () {
        if (AmmoConstant._instance == null) AmmoConstant._instance = new AmmoConstant();
        return AmmoConstant._instance;
    }
    readonly EMPTY_SHAPE = bt.EmptyShape_create();
    readonly TRANSFORM = bt.Transform_create();
    readonly TRANSFORM_1 = bt.Transform_create();
    readonly VECTOR3_0 = bt.Vector3_create(0, 0, 0);
    readonly VECTOR3_1 = bt.Vector3_create(0, 0, 0);
    readonly QUAT_0 = bt.Quaternion_create(0, 0, 0, 1);

    static isNotEmptyShape (btShape: Ammo.btCollisionShape) {
        return btShape !== this.instance.EMPTY_SHAPE;
    }
}

export const CC_V3_0 = new Vec3();
export const CC_V3_1 = new Vec3();
export const CC_QUAT_0 = new Quat();
