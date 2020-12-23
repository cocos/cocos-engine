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

import { BuiltinShape } from './builtin-shape';
import { IBoxShape } from '../../spec/i-physics-shape';
import { BoxCollider3D } from '../../exports/physics-framework';

const Obb = cc.geomUtils.Obb;
const Vec3 = cc.Vec3;
let _worldScale = new Vec3();

export class BuiltinBoxShape extends BuiltinShape implements IBoxShape {

    get localObb () {
        return this._localShape as cc.geomUtils.Obb;
    }

    get worldObb () {
        return this._worldShape as cc.geomUtils.Obb;
    }

    public get boxCollider () {
        return this.collider as BoxCollider3D;
    }

    constructor (size: cc.Vec3) {
        super();
        this._localShape = new Obb();
        this._worldShape = new Obb();
        Vec3.multiplyScalar(this.localObb.halfExtents, size, 0.5);
        Vec3.copy(this.worldObb.halfExtents, this.localObb.halfExtents);
    }

    set size (size: cc.Vec3) {
        Vec3.multiplyScalar(this.localObb.halfExtents, size, 0.5);
        this.collider.node.getWorldScale(_worldScale);
        _worldScale.x = Math.abs(_worldScale.x);
        _worldScale.y = Math.abs(_worldScale.y);
        _worldScale.z = Math.abs(_worldScale.z);
        Vec3.multiply(this.worldObb.halfExtents, this.localObb.halfExtents, _worldScale);
    }

    onLoad () {
        super.onLoad();
        this.size = this.boxCollider.size;
    }

}
