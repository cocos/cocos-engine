/* eslint-disable no-lonely-if */
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

import { ccclass, tooltip, displayOrder, serializable } from 'cc.decorator';
import { Mat4, Quat, Vec3, randomRange } from '../../core';
import { VFXModule } from '../vfx-module';
import { INITIAL_DIR, ParticleDataSet, POSITION } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { Vec3ArrayParameter } from '../parameters';

const _intermediVec = new Vec3(0, 0, 0);

/**
 * 粒子在发射形状上的分布方式
 */
export enum DistributionMode {
    /**
     * 随机位置发射。
     */
    RANDOM,

    /**
     * 在该发射器形状上移动发射，每次移动的距离由移动速度决定。
     */
    MOVE,

    /**
     * 均匀分布在发射器形状上，只对 Burst 出来的粒子有效，因为此模式依赖当前发射总数进行均匀分布。
     */
    UNIFORM,
}

export enum MoveWarpMode {
    /**
     * 沿某一方向循环发射，每次循环方向相同。
     */
    LOOP,

    /**
      * 循环发射，每次循环方向相反。
      */
    PING_PONG,
}

@ccclass('cc.ShapeModule')
export abstract class ShapeModule extends VFXModule {
    /**
     * @zh 粒子发射器位置。
     */
    @displayOrder(13)
    @tooltip('i18n:shapeModule.position')
    get position () {
        return this._position;
    }
    set position (val) {
        this._position.set(val);
        this._isTransformDirty = true;
    }

    /**
     * @zh 粒子发射器旋转角度。
     */
    @displayOrder(14)
    @tooltip('i18n:shapeModule.rotation')
    get rotation () {
        return this._rotation;
    }
    set rotation (val) {
        this._rotation.set(val);
        this._isTransformDirty = true;
    }

    /**
     * @zh 粒子发射器缩放比例。
     */
    @displayOrder(15)
    @tooltip('i18n:shapeModule.scale')
    get scale (): Readonly<Vec3> {
        return this._scale;
    }
    set scale (val) {
        this._scale.set(val);
        this._isTransformDirty = true;
    }

    /**
     * @zh 粒子生成方向随机设定。
     */
    @serializable
    @displayOrder(17)
    @tooltip('i18n:shapeModule.randomDirectionAmount')
    public randomDirectionAmount = 0;

    /**
     * @zh 表示当前发射方向与当前位置到结点中心连线方向的插值。
     */
    @serializable
    @displayOrder(18)
    @tooltip('i18n:shapeModule.sphericalDirectionAmount')
    public sphericalDirectionAmount = 0;

    /**
     * @zh 粒子生成位置随机设定（设定此值为非 0 会使粒子生成位置超出生成器大小范围）。
     */
    @serializable
    @displayOrder(19)
    @tooltip('i18n:shapeModule.randomPositionAmount')
    public randomPositionAmount = 0;

    @serializable
    private _position = new Vec3(0, 0, 0);

    @serializable
    private _rotation = new Vec3(0, 0, 0);

    @serializable
    private _scale = new Vec3(1, 1, 1);
    private _mat = new Mat4();
    private _quat = new Quat();
    private _isTransformDirty = true;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (this._isTransformDirty) {
            Quat.fromEuler(this._quat, this._rotation.x, this._rotation.y, this._rotation.z);
            Mat4.fromRTS(this._mat, this._quat, this._position, this._scale);
            this._isTransformDirty = false;
        }
        particles.markRequiredParameter(POSITION);
        particles.markRequiredParameter(INITIAL_DIR);
    }

    public storePositionAndDirection (index: number, dir: Vec3, pos: Vec3, initialDir: Vec3ArrayParameter, position: Vec3ArrayParameter) {
        const randomPositionAmount = this.randomPositionAmount;
        if (randomPositionAmount > 0) {
            pos.add3f(randomRange(-randomPositionAmount, randomPositionAmount),
                randomRange(-randomPositionAmount, randomPositionAmount),
                randomRange(-randomPositionAmount, randomPositionAmount));
        }

        const sphericalDirectionAmount = this.sphericalDirectionAmount;
        if (sphericalDirectionAmount > 0) {
            const sphericalVel = Vec3.normalize(_intermediVec, pos);
            Vec3.lerp(dir, dir, sphericalVel, sphericalDirectionAmount);
        }

        position.addVec3At(Vec3.transformMat4(pos, pos, this._mat), index);
        initialDir.setVec3At(Vec3.transformQuat(dir, dir, this._quat), index);
    }
}
