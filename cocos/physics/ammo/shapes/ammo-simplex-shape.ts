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
import Ammo from '../instantiated';
import { AmmoShape } from './ammo-shape';
import { SimplexCollider } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ISimplexShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';

export class AmmoSimplexShape extends AmmoShape implements ISimplexShape {
    setShapeType (v: SimplexCollider.ESimplexType) {
        if (this._isBinding) {
            // TODO:
        }
    }

    setVertices (v: IVec3Like[]) {
        const length = this.VERTICES.length;
        for (let i = 0; i < length; i++) {
            cocos2AmmoVec3(this.VERTICES[i], v[i]);
        }
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }

    get impl () {
        return this._btShape as Ammo.btBU_Simplex1to4;
    }

    get collider () {
        return this._collider as SimplexCollider;
    }

    readonly VERTICES: Ammo.btVector3[] = [];

    constructor () {
        super(AmmoBroadphaseNativeTypes.TETRAHEDRAL_SHAPE_PROXYTYPE);
    }

    protected onComponentSet () {
        this._btShape = new Ammo.btBU_Simplex1to4();
        const length = this.collider.shapeType;
        const vertices = this.collider.vertices;
        for (let i = 0; i < length; i++) {
            this.VERTICES[i] = new Ammo.btVector3();
            cocos2AmmoVec3(this.VERTICES[i], vertices[i]);
            this.impl.addVertex(this.VERTICES[i]);
        }
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
    }

    onLoad () {
        super.onLoad();
        this.collider.updateVertices();
    }

    onDestroy () {
        const length = this.VERTICES.length;
        for (let i = 0; i < length; i++) {
            Ammo.destroy(this.VERTICES[i]);
        }
        (this.VERTICES as any) = null;
        super.onDestroy();
    }

    updateScale () {
        super.updateScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }
}
