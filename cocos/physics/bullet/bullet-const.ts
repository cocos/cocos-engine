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

import { IBulletBodyStruct, IBulletGhostStruct } from './bullet-interface';
import { Collider, TriggerEventType, CollisionEventType, IContactEquation } from '../../../exports/physics-framework';
import { Vec3, Quat } from '../../core';
import { bt } from './bullet.asmjs';

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

export class BulletConst {
    private static _instance: BulletConst;
    static get instance () {
        if (BulletConst._instance == null) BulletConst._instance = new BulletConst();
        return BulletConst._instance;
    }

    static isNotEmptyShape (ptr: Bullet.ptr) { return ptr !== bt.EmptyShape_static(); }

    //////////
    static readonly bodyAndGhosts: {
        [x: string]: IBulletBodyStruct | IBulletGhostStruct
    } = {};

    static get bodyStructs () {
        return this.bodyAndGhosts as { [x: string]: IBulletBodyStruct };
    }

    static get ghostStructs () {
        return this.bodyAndGhosts as { [x: string]: IBulletGhostStruct };
    }
    //////////

    //////////
    static readonly ptr2WrapObj: { [x: number]: Record<string, unknown> } = {};

    static setWrapper (impl: Bullet.ptr, wrap: {}) {
        this.ptr2WrapObj[impl] = wrap;
    }

    static delWrapper (impl: Bullet.ptr) {
        delete this.ptr2WrapObj[impl];
    }

    static getWrapper<T> (ptr: Bullet.ptr): T {
        return this.ptr2WrapObj[ptr] as T;
    }
    //////////

    readonly BT_TRANSFORM_0 = bt.Transform_new();
    readonly BT_TRANSFORM_1 = bt.Transform_new();
    readonly BT_V3_0 = bt.Vec3_new(0, 0, 0);
    readonly BT_V3_1 = bt.Vec3_new(0, 0, 0);
    readonly BT_V3_2 = bt.Vec3_new(0, 0, 0);
    readonly BT_QUAT_0 = bt.Quat_new(0, 0, 0, 1);
}

export const CC_V3_0 = new Vec3();
export const CC_V3_1 = new Vec3();
export const CC_QUAT_0 = new Quat();
