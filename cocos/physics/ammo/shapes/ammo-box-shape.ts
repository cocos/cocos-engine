/* eslint-disable new-cap */
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

// import Ammo from '../instantiated';
import { BulletShape } from './ammo-shape';
import { Vec3 } from '../../../core';
import { BoxCollider, PhysicsSystem } from '../../../../exports/physics-framework';
import { btBroadphaseNativeTypes } from '../ammo-enum';
import { IBoxShape } from '../../spec/i-physics-shape';
import { absolute, VEC3_0 } from '../../utils/util';
import { cocos2BulletVec3 } from '../ammo-util';
import { AmmoConstant, CC_V3_0 } from '../ammo-const';
import { bt } from '../bullet.asmjs';

export class BulletBoxShape extends BulletShape implements IBoxShape {
    updateSize () {
        const hf = AmmoConstant.instance.VECTOR3_0;
        cocos2BulletVec3(hf, this.getMinUnscaledHalfExtents(VEC3_0));
        bt.BoxShape_setUnscaledHalfExtents(this.impl, hf);
        this.updateCompoundTransform();
    }

    get collider () {
        return this._collider as BoxCollider;
    }

    constructor () {
        super(btBroadphaseNativeTypes.BOX_SHAPE_PROXYTYPE);
    }

    onComponentSet () {
        const hf = AmmoConstant.instance.VECTOR3_0;
        cocos2BulletVec3(hf, this.getMinUnscaledHalfExtents(VEC3_0));
        this._btShape = bt.BoxShape_new(hf);
        this.updateScale();
    }

    updateScale () {
        super.updateScale();
        cocos2BulletVec3(this.scale, this.getMinScale(VEC3_0));
        bt.CollisionShape_setLocalScaling(this._btShape, this.scale);
        this.updateCompoundTransform();
    }

    getMinUnscaledHalfExtents (out: Vec3) {
        const size = this.collider.size;
        const ws = absolute(VEC3_0.set(this._collider.node.worldScale));
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        const halfSizeX = size.x / 2; const halfSizeY = size.y / 2; const halfSizeZ = size.z / 2;
        const halfX = halfSizeX * ws.x < minVolumeSize ? minVolumeSize / ws.x : halfSizeX;
        const halfY = halfSizeY * ws.y < minVolumeSize ? minVolumeSize / ws.y : halfSizeY;
        const halfZ = halfSizeZ * ws.z < minVolumeSize ? minVolumeSize / ws.z : halfSizeZ;
        out.set(halfX, halfY, halfZ);
        return out;
    }

    getMinScale (out: Vec3) {
        const size = this.collider.size;
        const ws = absolute(VEC3_0.set(this._collider.node.worldScale));
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        const halfSizeX = size.x / 2; const halfSizeY = size.y / 2; const halfSizeZ = size.z / 2;
        const scaleX = halfSizeX * ws.x < minVolumeSize ? minVolumeSize / halfSizeX : ws.x;
        const scaleY = halfSizeY * ws.y < minVolumeSize ? minVolumeSize / halfSizeY : ws.y;
        const scaleZ = halfSizeZ * ws.z < minVolumeSize ? minVolumeSize / halfSizeZ : ws.z;
        out.set(scaleX, scaleY, scaleZ);
        return out;
    }
}
