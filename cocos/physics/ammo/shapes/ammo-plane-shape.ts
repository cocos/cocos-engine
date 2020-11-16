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

import Ammo from '../ammo-instantiated';
import { AmmoShape } from "./ammo-shape";
import { PlaneCollider } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3, ammoDeletePtr } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { IPlaneShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';

export class AmmoPlaneShape extends AmmoShape implements IPlaneShape {

    setNormal (v: IVec3Like) {
        cocos2AmmoVec3(this.impl.getPlaneNormal(), v);
        this.updateCompoundTransform();
    }

    setConstant (v: number) {
        this.impl.setPlaneConstant(v);
        this.updateCompoundTransform();
    }

    setScale () {
        super.setScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        this.updateCompoundTransform();
    }

    get impl () {
        return this._btShape as Ammo.btStaticPlaneShape;
    }

    get collider () {
        return this._collider as PlaneCollider;
    }

    readonly NORMAL: Ammo.btVector3;

    constructor () {
        super(AmmoBroadphaseNativeTypes.STATIC_PLANE_PROXYTYPE);
        this.NORMAL = new Ammo.btVector3(0, 1, 0);
    }

    onComponentSet () {
        cocos2AmmoVec3(this.NORMAL, this.collider.normal);
        this._btShape = new Ammo.btStaticPlaneShape(this.NORMAL, this.collider.constant);
        this.setScale();
    }

    onDestroy () {
        super.onDestroy();
        Ammo.destroy(this.NORMAL);
        ammoDeletePtr(this.NORMAL, Ammo.btVector3);
        (this.NORMAL as any) = null;
    }

}
