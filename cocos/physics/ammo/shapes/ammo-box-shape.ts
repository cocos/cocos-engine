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

import Ammo from '../ammo-instantiated';
import { AmmoShape } from './ammo-shape';
import { Vec3 } from '../../../core';
import { BoxCollider } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { IBoxShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { AmmoConstant, CC_V3_0 } from '../ammo-const';

export class AmmoBoxShape extends AmmoShape implements IBoxShape {
    setSize (size: IVec3Like) {
        const v3_0 = CC_V3_0;
        Vec3.multiplyScalar(v3_0, size, 0.5);
        const hf = AmmoConstant.instance.VECTOR3_0;
        cocos2AmmoVec3(hf, v3_0);
        this.impl.setUnscaledHalfExtents(hf);
        this.updateCompoundTransform();
    }

    get impl () {
        return this._btShape as Ammo.btBoxShape;
    }

    get collider () {
        return this._collider as BoxCollider;
    }

    constructor () {
        super(AmmoBroadphaseNativeTypes.BOX_SHAPE_PROXYTYPE);
    }

    onComponentSet () {
        const s = this.collider.size;
        const hf = AmmoConstant.instance.VECTOR3_0;
        hf.setValue(s.x / 2, s.y / 2, s.z / 2);
        this._btShape = new Ammo.btBoxShape(hf);
        this.setScale();
    }

    setScale () {
        super.setScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        this.updateCompoundTransform();
    }
}
