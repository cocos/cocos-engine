/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module asset
 */

import { ccclass, type, serializable } from 'cc.decorator';
import { CCString } from '../../core/data/utils/attribute';
import { Mat4 } from '../../core/math';
import { murmurhash2_32_gc } from '../../core/utils/murmurhash2_gc';
import { DataPoolManager } from '../skeletal-animation/data-pool-manager';
import { Asset } from '../../core/assets/asset';
import { legacyCC } from '../../core/global-exports';

/**
 * @en The skeleton asset. It stores the path related to [[SkinnedMeshRenderer.skinningRoot]] of all bones and its bind pose matrix.
 * @zh 骨骼资源。骨骼资源记录了每个关节（相对于 [[SkinnedMeshRenderer.skinningRoot]]）的路径以及它的绑定姿势矩阵。
 */
@ccclass('cc.Skeleton')
export class Skeleton extends Asset {
    @type([CCString])
    private _joints: string[] = [];

    @type([Mat4])
    private _bindposes: Mat4[] = [];

    @serializable
    private _hash = 0;

    private _invBindposes: Mat4[] | null = null;

    /**
     * @en The path of all bones, the length always equals the length of [[bindposes]]
     * @zh 所有关节的路径。该数组的长度始终与 [[bindposes]] 的长度相同。
     */
    get joints () {
        return this._joints;
    }

    set joints (value) {
        this._joints = value;
    }

    /**
     * @en The bind poses matrix of all bones, the length always equals the length of [[joints]]
     * @zh 所有关节的绑定姿势矩阵。该数组的长度始终与 [[joints]] 的长度相同。
     */
    get bindposes () {
        return this._bindposes;
    }

    set bindposes (value) {
        this._bindposes = value;
    }

    /**
     * @en Gets the inverse bind poses matrix
     * @zh 获取反向绑定姿势矩阵
     */
    get inverseBindposes () {
        if (!this._invBindposes) {
            this._invBindposes = [];
            for (let i = 0; i < this._bindposes.length; i++) {
                const inv = new Mat4();
                Mat4.invert(inv, this._bindposes[i]);
                this._invBindposes.push(inv);
            }
        }
        return this._invBindposes;
    }

    /**
     * @en Gets the hash of the skeleton asset
     * @zh 获取骨骼资源的哈希值
     */
    get hash () {
        // hashes should already be computed offline, but if not, make one
        if (!this._hash) {
            let str = '';
            for (let i = 0; i < this._bindposes.length; i++) {
                const ibm = this._bindposes[i];
                str
                    += `${ibm.m00.toPrecision(2)} ${ibm.m01.toPrecision(2)} ${ibm.m02.toPrecision(2)} ${ibm.m03.toPrecision(2)} ${
                        ibm.m04.toPrecision(2)} ${ibm.m05.toPrecision(2)} ${ibm.m06.toPrecision(2)} ${ibm.m07.toPrecision(2)} ${
                        ibm.m08.toPrecision(2)} ${ibm.m09.toPrecision(2)} ${ibm.m10.toPrecision(2)} ${ibm.m11.toPrecision(2)} ${
                        ibm.m12.toPrecision(2)} ${ibm.m13.toPrecision(2)} ${ibm.m14.toPrecision(2)} ${ibm.m15.toPrecision(2)}\n`;
            }
            this._hash = murmurhash2_32_gc(str, 666);
        }
        return this._hash;
    }

    public destroy () {
        (legacyCC.director.root.dataPoolManager as DataPoolManager).releaseSkeleton(this.hash);
        return super.destroy();
    }

    public validate () {
        return this.joints.length > 0 && this.bindposes.length > 0;
    }
}

legacyCC.Skeleton = Skeleton;
