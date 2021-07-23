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

import { Vec3 } from '../../../core/math';
import { OBB } from '../../../core/geometry';
import { BuiltinShape } from './builtin-shape';
import { IBoxShape } from '../../spec/i-physics-shape';
import { BoxCollider } from '../../../../exports/physics-framework';
import { IVec3Like } from '../../../core/math/type-define';

export class BuiltinBoxShape extends BuiltinShape implements IBoxShape {
    get localObb () {
        return this._localShape as OBB;
    }

    get worldObb () {
        return this._worldShape as OBB;
    }

    get collider () {
        return this._collider as BoxCollider;
    }

    constructor () {
        super();
        this._localShape = new OBB();
        this._worldShape = new OBB();
    }

    updateSize () {
        Vec3.multiplyScalar(this.localObb.halfExtents, this.collider.size, 0.5);
        Vec3.multiply(this.worldObb.halfExtents, this.localObb.halfExtents, this.collider.node.worldScale);
    }

    onLoad () {
        super.onLoad();
        this.updateSize();
    }
}
