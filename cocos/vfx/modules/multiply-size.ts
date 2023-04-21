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

import { ccclass, tooltip, displayOrder, type, serializable, range, visible } from 'cc.decorator';
import { lerp, Vec3 } from '../../core';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { VFXEmitterParams, VFXEmitterState, ModuleExecContext } from '../base';
import { RandomStream } from '../random-stream';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const seed = new Vec3();

@ccclass('cc.MultiplySizeModule')
@VFXModule.register('MultiplySize', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [BuiltinParticleParameterName.SCALE], [BuiltinParticleParameterName.NORMALIZED_AGE])
export class MultiplySizeModule extends VFXModule {
    /**
     * @zh 决定是否在每个轴上独立控制粒子大小。
     */
    @serializable
    @displayOrder(1)
    @tooltip('i18n:sizeOvertimeModule.separateAxes')
    public separateAxes = false;

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
     */
    @type(FloatExpression)
    @range([0, 1])
    @displayOrder(2)
    @tooltip('i18n:sizeOvertimeModule.scale')
    @visible(function (this: MultiplySizeModule): boolean { return !this.separateAxes; })
    public get scalar () {
        return this.x;
    }

    public set scalar (val) {
        this.x = val;
    }

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。
     */
    @type(FloatExpression)
    @serializable
    @range([0, 1])
    @displayOrder(3)
    @tooltip('i18n:sizeOvertimeModule.x')
    @visible(function (this: MultiplySizeModule): boolean { return this.separateAxes; })
    public x = new FloatExpression(1);

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
     */
    @type(FloatExpression)
    @range([0, 1])
    @displayOrder(4)
    @tooltip('i18n:sizeOvertimeModule.y')
    @visible(function (this: MultiplySizeModule): boolean { return this.separateAxes; })
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
     * @zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。
     */
    @type(FloatExpression)
    @range([0, 1])
    @displayOrder(5)
    @tooltip('i18n:sizeOvertimeModule.z')
    @visible(function (this: MultiplySizeModule): boolean { return this.separateAxes; })
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


    public tick (particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
        particles.markRequiredParameters(BuiltinParticleParameterFlags.SCALE);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.BASE_SCALE);
        }
        if (this.x.mode === FloatExpression.Mode.TWO_CONSTANTS || this.x.mode === FloatExpression.Mode.TWO_CURVES) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
        if (this.x.mode === FloatExpression.Mode.CURVE || this.x.mode === FloatExpression.Mode.TWO_CURVES) {
            if (context.executionStage === ModuleExecStage.SPAWN) {
                particles.markRequiredParameters(BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
            } else {
                particles.markRequiredParameters(BuiltinParticleParameterFlags.NORMALIZED_AGE);
            }
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const scale = context.executionStage === ModuleExecStage.SPAWN ? particles.baseScale : particles.scale;
        const randomOffset = this._randomOffset;
        const { fromIndex, toIndex } = context;
        if (!this.separateAxes) {
            if (this.scalar.mode === FloatExpression.Mode.CONSTANT) {
                const constant = this.scalar.constant;
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply1fAt(constant, i);
                }
            } else if (this.scalar.mode === FloatExpression.Mode.CURVE) {
                const { spline, multiplier } = this.scalar;
                const normalizedTime = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAge.data : particles.spawnNormalizedTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply1fAt(spline.evaluate(normalizedTime[i]) * multiplier, i);
                }
            } else if (this.scalar.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const { constantMin, constantMax } = this.scalar;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply1fAt(lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + randomOffset)), i);
                }
            } else {
                const { splineMin, splineMax, multiplier } = this.scalar;
                const normalizedTime = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAge.data : particles.spawnNormalizedTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedTime[i];
                    scale.multiply1fAt(lerp(splineMin.evaluate(currentLife),
                        splineMax.evaluate(currentLife),
                        RandomStream.getFloat(randomSeed[i] + randomOffset)) * multiplier, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.scalar.mode === FloatExpression.Mode.CONSTANT) {
                const { constant: constantX } = this.x;
                const { constant: constantY } = this.y;
                const { constant: constantZ } = this.z;
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply3fAt(constantX, constantY, constantZ, i);
                }
            } else if (this.scalar.mode === FloatExpression.Mode.CURVE) {
                const { spline: splineX, multiplier: xMultiplier } = this.x;
                const { spline: splineY, multiplier: yMultiplier } = this.y;
                const { spline: splineZ, multiplier: zMultiplier } = this.z;
                const normalizedTime = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAge.data : particles.spawnNormalizedTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedTime[i];
                    scale.multiply3fAt(splineX.evaluate(currentLife) * xMultiplier,
                        splineY.evaluate(currentLife) * yMultiplier,
                        splineZ.evaluate(currentLife) * zMultiplier, i);
                }
            } else if (this.scalar.mode === FloatExpression.Mode.TWO_CONSTANTS) {
                const { constantMin: xMin, constantMax: xMax } = this.x;
                const { constantMin: yMin, constantMax: yMax } = this.y;
                const { constantMin: zMin, constantMax: zMax } = this.z;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                    scale.multiply3fAt(lerp(xMin, xMax, ratio.x),
                        lerp(yMin, yMax, ratio.y),
                        lerp(zMin, zMax, ratio.z), i);
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.x;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.y;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.z;
                const normalizedTime = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAge.data : particles.spawnNormalizedTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const currentLife = normalizedTime[i];
                    const ratio = RandomStream.get3Float(randomSeed[i] + randomOffset, seed);
                    scale.multiply3fAt(
                        lerp(xMin.evaluate(currentLife), xMax.evaluate(currentLife), ratio.x) * xMultiplier,
                        lerp(yMin.evaluate(currentLife), yMax.evaluate(currentLife), ratio.y) * yMultiplier,
                        lerp(zMin.evaluate(currentLife), zMax.evaluate(currentLife), ratio.z) * zMultiplier, i,
                    );
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
