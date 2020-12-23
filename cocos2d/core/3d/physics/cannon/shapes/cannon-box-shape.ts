/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import CANNON from '../../../../../../external/cannon/cannon';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { IBoxShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../spec/i-common';
import { BoxCollider3D } from '../../exports/physics-framework';

const Vec3 = cc.Vec3;
const v3_0 = new Vec3();

export class CannonBoxShape extends CannonShape implements IBoxShape {

    public get boxCollider () {
        return this.collider as BoxCollider3D;
    }

    public get box () {
        return this._shape as CANNON.Box;
    }

    readonly halfExtent: CANNON.Vec3 = new CANNON.Vec3();
    constructor (size: cc.Vec3) {
        super();
        Vec3.multiplyScalar(this.halfExtent, size, 0.5);
        this._shape = new CANNON.Box(this.halfExtent.clone());
    }

    set size (v: IVec3Like) {
        this.collider.node.getWorldScale(v3_0);
        v3_0.x = Math.abs(v3_0.x);
        v3_0.y = Math.abs(v3_0.y);
        v3_0.z = Math.abs(v3_0.z);
        Vec3.multiplyScalar(this.halfExtent, v, 0.5);
        Vec3.multiply(this.box.halfExtents, this.halfExtent, v3_0);
        this.box.updateConvexPolyhedronRepresentation();
        if (this._index != -1) {
            commitShapeUpdates(this._body);
        }
    }

    onLoad () {
        super.onLoad();
        this.size = this.boxCollider.size;
    }

    setScale (scale: cc.Vec3): void {
        super.setScale(scale);
        this.size = this.boxCollider.size;
    }
}
