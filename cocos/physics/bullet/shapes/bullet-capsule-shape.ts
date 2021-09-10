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
import { absMax } from '../../../core';
import { BulletShape } from './bullet-shape';
import { CapsuleCollider } from '../../../../exports/physics-framework';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { bt } from '../bullet.asmjs';

export class BulletCapsuleShape extends BulletShape implements ICapsuleShape {
    setCylinderHeight (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.cylinderHeight,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    setDirection (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.cylinderHeight,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    setRadius (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.cylinderHeight,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    get collider () {
        return this._collider as CapsuleCollider;
    }

    onComponentSet () {
        this._impl = bt.CapsuleShape_new(0.5, 1);
        this.setRadius(this.collider.radius);
    }

    updateScale () {
        super.updateScale();
        this.setRadius(this.collider.radius);
    }

    updateProperties (radius: number, height: number, direction: number, scale: IVec3Like) {
        const ws = scale;
        const upAxis = direction;
        let wr: number; let halfH: number;
        if (upAxis === 1) {
            wr = radius * Math.abs(absMax(ws.x, ws.z));
            halfH = height / 2 * Math.abs(ws.y);
        } else if (upAxis === 0) {
            wr = radius * Math.abs(absMax(ws.y, ws.z));
            halfH = height / 2 * Math.abs(ws.x);
        } else {
            wr = radius * Math.abs(absMax(ws.x, ws.y));
            halfH = height / 2 * Math.abs(ws.z);
        }
        bt.CapsuleShape_updateProp(this._impl, wr, halfH, upAxis);
        this.updateCompoundTransform();
    }
}
