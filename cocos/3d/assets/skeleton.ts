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

import { Asset } from '../../assets/asset';
import { ccclass, property } from '../../core/data/class-decorator';
import { CCString } from '../../core/data/utils/attribute';
import { Mat4, Quat, Vec3 } from '../../core/value-types';
import { mat4 } from '../../core/vmath';

export interface IBindTRS {
    position: Vec3;
    rotation: Quat;
    scale: Vec3;
}

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

    private _bindTRS: IBindTRS[] = [];

    /**
     * 所有关节的绑定姿势矩阵。该数组的长度始终与 `this.joints` 的长度相同。
     */
    get bindposes () {
        return this._bindposes;
    }

    set bindposes (value) {
        this._bindposes = value;
        this._bindTRS = value.map((m) => {
            const position = new Vec3();
            const rotation = new Quat();
            const scale = new Vec3();
            mat4.toRTS(m, rotation, position, scale);
            return { position, rotation, scale };
        });
    }

    get bindTRS () {
        return this._bindTRS;
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

    public onLoaded () {
        this.bindposes = this._bindposes;
    }
}

cc.Skeleton = Skeleton;
