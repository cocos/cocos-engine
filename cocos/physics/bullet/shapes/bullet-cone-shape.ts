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

import { BulletShape } from './bullet-shape';
import { ConeCollider } from '../../../../exports/physics-framework';
import { ICylinderShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { absMax } from '../../../core';
import { bt } from '../bullet.asmjs';
import { BulletConst } from '../bullet-const';

export class BulletConeShape extends BulletShape implements ICylinderShape {
    setHeight (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    setDirection (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    setRadius (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    get impl () {
        return this._impl;
    }

    get collider () {
        return this._collider as ConeCollider;
    }

    onComponentSet () {
        this._impl = bt.ConeShape_new(0.5, 1);
        this.setRadius(this.collider.radius);
    }

    updateScale () {
        super.updateScale();
        this.setRadius(this.collider.radius);
    }

    updateProperties (radius: number, height: number, direction: number, scale: IVec3Like) {
        const ws = scale;
        const upAxis = direction;
        let wr: number; let wh: number;
        if (upAxis === 1) {
            wh = height * Math.abs(ws.y);
            wr = radius * Math.abs(absMax(ws.x, ws.z));
        } else if (upAxis === 0) {
            wh = height * Math.abs(ws.x);
            wr = radius * Math.abs(absMax(ws.y, ws.z));
        } else {
            wh = height * Math.abs(ws.z);
            wr = radius * Math.abs(absMax(ws.x, ws.y));
        }
        bt.ConeShape_setRadius(this._impl, wr);
        bt.ConeShape_setHeight(this._impl, wh);
        bt.ConeShape_setConeUpIndex(this._impl, upAxis);

        const bt_v3 = BulletConst.instance.BT_V3_0;
        bt.Vec3_set(bt_v3, 1, 1, 1);
        bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
        this.updateCompoundTransform();
    }
}
