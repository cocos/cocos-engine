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

import { DEBUG } from 'internal:constants';
import { ccclass, range, serializable, tooltip, type, visible } from 'cc.decorator';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext, VFXEmitterParams, VFXEmitterState } from '../base';
import { FloatExpression } from '../expressions/float';
import { lerp, Vec3, assertIsTrue } from '../../core';
import { RandomStream } from '../random-stream';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const seed = new Vec3();

@ccclass('cc.SetMeshScaleModule')
@VFXModule.register('SetMeshScale', ModuleExecStageFlags.SPAWN | ModuleExecStageFlags.UPDATE, [ParameterName.SCALE], [ParameterName.NORMALIZED_AGE])
export class SetMeshScaleModule extends VFXModule {
    @serializable
    @tooltip('i18n:particle_system.startSize3D')
    public separateAxes = false;

    @range([0, 1])
    @type(FloatExpression)
    @visible(function (this: SetMeshScaleModule): boolean { return !this.separateAxes; })
    public get scale () {
        return this.x;
    }

    public set scale (val) {
        this.x = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @range([0, 1])
    @type(FloatExpression)
    @visible(function (this: SetMeshScaleModule): boolean { return this.separateAxes; })
    public x = new FloatExpression(1);

    /**
      * @zh 粒子初始大小。
      */
    @type(FloatExpression)
    @range([0, 1])
    @visible(function (this: SetMeshScaleModule): boolean { return this.separateAxes; })
    public get y () {
        if (!this._y) {
            this._y = new FloatExpression(1);
        }
        return this._y;
    }

    public set y (val) {
        this._y = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @type(FloatExpression)
    @range([0, 1])
    @visible(function (this: SetMeshScaleModule): boolean { return this.separateAxes; })
    public get z () {
        if (!this._z) {
            this._z = new FloatExpression(1);
        }
        return this._z;
    }

    public set z (val) {
        this._z = val;
    }

    @serializable
    private _y: FloatExpression | null = null;
    @serializable
    private _z: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.BASE_SCALE);
        }

        particles.markRequiredParameters(BuiltinParticleParameterFlags.SCALE);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const scale = context.executionStage === ModuleExecStage.SPAWN ? particles.baseScale : particles.scale;
        const { fromIndex, toIndex } = context;
        const randomOffset = this._randomOffset;
        if (this.separateAxes) {
            if (this.x.mode === FloatExpression.Mode.CONSTANT) {
                const constantX = this.x.constant;
                const constantY = this.y.constant;
                const constantZ = this.z.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    scale.set3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                    const x = lerp(xMin, xMax, ratio.x);
                    const y = lerp(yMin, yMax, ratio.y);
                    const z = lerp(zMin, zMax, ratio.z);
                    scale.set3fAt(x, y, z, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.CURVE) {
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const { spline: yCurve, multiplier: yMultiplier } = this.y;
                const { spline: zCurve, multiplier: zMultiplier } = this.z;
                const normalizedTime = context.executionStage === ModuleExecStage.SPAWN ? particles.spawnNormalizedTime.data : particles.normalizedAge.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = normalizedTime[i];
                    const x = xCurve.evaluate(time) * xMultiplier;
                    const y = yCurve.evaluate(time) * yMultiplier;
                    const z = zCurve.evaluate(time) * zMultiplier;
                    scale.set3fAt(x, y, z, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                const randomSeed = particles.randomSeed.data;
                const normalizedTime = context.executionStage === ModuleExecStage.SPAWN ? particles.spawnNormalizedTime.data : particles.normalizedAge.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = normalizedTime[i];
                    const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                    const x = lerp(xMin.evaluate(time), xMax.evaluate(time), ratio.x) * xMultiplier;
                    const y = lerp(yMin.evaluate(time), yMax.evaluate(time), ratio.y) * yMultiplier;
                    const z = lerp(zMin.evaluate(time), zMax.evaluate(time), ratio.z) * zMultiplier;
                    scale.set3fAt(x, y, z, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.x.mode === FloatExpression.Mode.CONSTANT) {
                const constantX = this.x.constant;
                scale.fill1f(constantX, fromIndex, toIndex);
            } else if (this.x.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const pSize = lerp(xMin, xMax, RandomStream.getFloat(randomSeed[i] + randomOffset));
                    scale.set1fAt(pSize, i);
                }
            } else if (this.x.mode === FloatExpression.Mode.CURVE) {
                const { spline: xCurve, multiplier: xMultiplier } = this.x;
                const normalizedTime = context.executionStage === ModuleExecStage.SPAWN ? particles.spawnNormalizedTime.data : particles.normalizedAge.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const pSize = xCurve.evaluate(normalizedTime[i]) * xMultiplier;
                    scale.set1fAt(pSize, i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const randomSeed = particles.randomSeed.data;
                const normalizedTime = context.executionStage === ModuleExecStage.SPAWN ? particles.spawnNormalizedTime.data : particles.normalizedAge.data;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const time = normalizedTime[i];
                    const pSize = lerp(xMin.evaluate(time), xMax.evaluate(time), RandomStream.getFloat(randomSeed[i] + randomOffset)) * xMultiplier;
                    scale.set1fAt(pSize, i);
                }
            }
        }
    }

    protected needsFilterSerialization () {
        return true;
    }

    protected getSerializedProps () {
        if (!this.separateAxes) {
            return ['separateAxes', 'x'];
        } else {
            return ['separateAxes', 'x', '_y', '_z'];
        }
    }
}
