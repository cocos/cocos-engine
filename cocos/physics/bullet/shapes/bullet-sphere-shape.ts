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

import { BulletShape } from './bullet-shape';
import { PhysicsSystem, SphereCollider } from '../../../../exports/physics-framework';
import { cocos2BulletVec3 } from '../bullet-utils';
import { ISphereShape } from '../../spec/i-physics-shape';
import { BulletCache, CC_V3_0 } from '../bullet-cache';
import { bt } from '../instantiated';
import { absMaxComponent } from '../../../core';

export class BulletSphereShape extends BulletShape implements ISphereShape {
    updateRadius () {
        bt.SphereShape_setUnscaledRadius(this.impl, this.getMinUnscaledRadius());
        this.updateCompoundTransform();
    }

    get collider () {
        return this._collider as SphereCollider;
    }

    onComponentSet () {
        this._impl = bt.SphereShape_new(this.getMinUnscaledRadius());
        this.updateScale();
    }

    updateScale () {
        super.updateScale();
        const scale = this.getMinScale();
        CC_V3_0.set(scale, scale, scale);
        const bt_v3 = BulletCache.instance.BT_V3_0;
        bt.CollisionShape_setLocalScaling(this._impl, cocos2BulletVec3(bt_v3, CC_V3_0));
        this.updateCompoundTransform();
    }

    getMinUnscaledRadius () {
        const radius = this.collider.radius;
        const ws = Math.abs(absMaxComponent(this._collider.node.worldScale));
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        return ws * radius < minVolumeSize ? minVolumeSize / ws : radius;
    }

    getMinScale () {
        const radius = this.collider.radius;
        const ws = Math.abs(absMaxComponent(this._collider.node.worldScale));
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        return ws * radius < minVolumeSize ? minVolumeSize / radius : ws;
    }
}
