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
// import Ammo from '../instantiated';
import { BulletShape } from './bullet-shape';
import { PlaneCollider } from '../../../../exports/physics-framework';
import { cocos2BulletVec3 } from '../bullet-utils';
import { IPlaneShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { BulletConstant } from '../bullet-const';
import { bt } from '../bullet.asmjs';

export class BulletPlaneShape extends BulletShape implements IPlaneShape {
    setNormal (v: IVec3Like) {
        cocos2BulletVec3(bt.StaticPlaneShape_getPlaneNormal(this.impl), v);
        this.updateCompoundTransform();
    }

    setConstant (v: number) {
        bt.StaticPlaneShape_setPlaneConstant(this.impl, v);
        this.updateCompoundTransform();
    }

    updateScale () {
        super.updateScale();
        const bt_v3 = BulletConstant.instance.BT_V3_0;
        cocos2BulletVec3(bt_v3, this._collider.node.worldScale);
        bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
        this.updateCompoundTransform();
    }

    get collider () {
        return this._collider as PlaneCollider;
    }

    onComponentSet () {
        const normal = BulletConstant.instance.BT_V3_0;
        cocos2BulletVec3(normal, this.collider.normal);
        this._impl = bt.StaticPlaneShape_new(normal, this.collider.constant);
        this.updateScale();
    }
}
