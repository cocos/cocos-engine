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
import { BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext, VFXEmitterParams, VFXEmitterState } from '../base';
import { RandomStream } from '../random-stream';

const _intermediVec = new Vec3(0, 0, 0);
const tmpPosition = new Vec3();
const tmpDir = new Vec3();

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
export class ShapeModule extends VFXModule {
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
    protected _rand = new RandomStream();

    public onPlay (params: VFXEmitterParams, state: VFXEmitterState) {
        this._rand.seed = Math.imul(state.randomStream.getUInt32(), state.randomStream.getUInt32());
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (this._isTransformDirty) {
            Quat.fromEuler(this._quat, this._rotation.x, this._rotation.y, this._rotation.z);
            Mat4.fromRTS(this._mat, this._quat, this._position, this._scale);
            this._isTransformDirty = false;
        }
        particles.markRequiredParameters(BuiltinParticleParameterFlags.POSITION);
        particles.markRequiredParameters(BuiltinParticleParameterFlags.INITIAL_DIR);
        particles.markRequiredParameters(BuiltinParticleParameterFlags.VEC3_REGISTER);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const { position, initialDir, vec3Register } = particles;
        const randomPositionAmount = this.randomPositionAmount;
        if (randomPositionAmount > 0) {
            for (let i = fromIndex; i < toIndex; ++i) {
                vec3Register.getVec3At(tmpPosition, i);
                tmpPosition.add3f(randomRange(-randomPositionAmount, randomPositionAmount),
                    randomRange(-randomPositionAmount, randomPositionAmount),
                    randomRange(-randomPositionAmount, randomPositionAmount));
                vec3Register.setVec3At(tmpPosition, i);
            }
        }

        if (this.sphericalDirectionAmount > 0) {
            for (let i = fromIndex; i < toIndex; ++i) {
                vec3Register.getVec3At(tmpPosition, i);
                initialDir.getVec3At(tmpDir, i);
                const sphericalVel = Vec3.normalize(_intermediVec, tmpPosition);
                Vec3.lerp(tmpDir, tmpDir, sphericalVel, this.sphericalDirectionAmount);
                initialDir.setVec3At(tmpDir, i);
            }
        }

        for (let i = fromIndex; i < toIndex; ++i) {
            vec3Register.getVec3At(tmpPosition, i);
            position.addVec3At(Vec3.transformMat4(tmpPosition, tmpPosition, this._mat), i);
        }

        for (let i = fromIndex; i < toIndex; ++i) {
            initialDir.getVec3At(tmpDir, i);
            initialDir.setVec3At(Vec3.transformQuat(tmpDir, tmpDir, this._quat), i);
        }
    }
}
