/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * @category asset
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { CCString } from '../../core/data/utils/attribute';
import { Mat4, Quat, Vec3 } from '../../core/math';
import { murmurhash2_32_gc } from '../../core/utils/murmurhash2_gc';
import { aabb } from '../geom-utils';
import { DataPoolManager } from '../renderer/data-pool-manager';
import { Asset } from './asset';

export interface IBindTRS {
    position: Vec3;
    rotation: Quat;
    scale: Vec3;
}

const m4_1 = new Mat4();
const v3_1 = new Vec3();
const v3_min = new Vec3();
const v3_max = new Vec3();

/**
 * 骨骼资源。
 * 骨骼资源记录了每个关节（相对于`SkinningModelComponent.skinningRoot`）的路径以及它的绑定姿势矩阵。
 */
@ccclass('cc.Skeleton')
export class Skeleton extends Asset {

    @property([CCString])
    private _joints: string[] = [];

    @property([Mat4])
    private _bindposes: Mat4[] = [];

    private _hash = 0;
    private _bounds = new aabb();

    /**
     * 所有关节的绑定姿势矩阵。该数组的长度始终与 `this.joints` 的长度相同。
     */
    get bindposes () {
        return this._bindposes;
    }

    set bindposes (value) {
        this._bindposes = value;
        let str = '';
        Vec3.set(v3_min, Infinity, Infinity, Infinity);
        Vec3.set(v3_max, -Infinity, -Infinity, -Infinity);
        for (let i = 0; i < value.length; i++) {
            const ibm = value[i];
            str +=
                ibm.m00.toPrecision(2) + ' ' + ibm.m01.toPrecision(2) + ' ' + ibm.m02.toPrecision(2) + ' ' + ibm.m03.toPrecision(2) + ' ' +
                ibm.m04.toPrecision(2) + ' ' + ibm.m05.toPrecision(2) + ' ' + ibm.m06.toPrecision(2) + ' ' + ibm.m07.toPrecision(2) + ' ' +
                ibm.m08.toPrecision(2) + ' ' + ibm.m09.toPrecision(2) + ' ' + ibm.m10.toPrecision(2) + ' ' + ibm.m11.toPrecision(2) + ' ' +
                ibm.m12.toPrecision(2) + ' ' + ibm.m13.toPrecision(2) + ' ' + ibm.m14.toPrecision(2) + ' ' + ibm.m15.toPrecision(2) + '\n';
            Mat4.invert(m4_1, ibm);
            Vec3.set(v3_1, m4_1.m12, m4_1.m13, m4_1.m14);
            Vec3.min(v3_min, v3_min, v3_1);
            Vec3.max(v3_max, v3_max, v3_1);
        }
        this._hash = murmurhash2_32_gc(str, 666);
        aabb.fromPoints(this._bounds, v3_min, v3_max);
    }

    /**
     * 所有关节的路径。该数组的长度始终与 `this.bindposes` 的长度相同。
     */
    get joints () {
        return this._joints;
    }

    set joints (value) {
        this._joints = value;
    }

    get hash () {
        return this._hash;
    }

    get bounds () {
        return this._bounds;
    }

    public onLoaded () {
        this.bindposes = this._bindposes;
    }

    public destroy () {
        (cc.director.root.dataPoolManager as DataPoolManager).releaseSkeleton(this);
        return super.destroy();
    }
}

cc.Skeleton = Skeleton;
