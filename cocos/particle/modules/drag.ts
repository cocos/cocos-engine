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

import { ccclass, tooltip, displayOrder, range, type, serializable, visible } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { lerp, Quat, Vec3 } from '../../core/math';
import { CurveRange } from '../curve-range';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { assert, CCBoolean, Enum } from '../../core';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { RandNumGen } from '../rand-num-gen';

const DRAG_RAND_OFFSET = 72617;

const _temp_v3 = new Vec3();

@ccclass('cc.DragModule')
@ParticleModule.register('Drag', ModuleExecStage.UPDATE, ['State'], ['Solve'])
export class DragModule extends ParticleModule {
    @type(CurveRange)
    @visible(true)
    @serializable
    public drag = new CurveRange();

    @type(CCBoolean)
    @serializable
    public multiplyBySize = true;
    @type(CCBoolean)
    @serializable
    public multiplyBySpeed = true;

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.POSITION);
        context.markRequiredParameter(BuiltinParticleParameter.BASE_VELOCITY);
        context.markRequiredParameter(BuiltinParticleParameter.VELOCITY);
        context.markRequiredParameter(BuiltinParticleParameter.FLOAT_REGISTER);
        if (this.drag.mode === CurveRange.Mode.Curve || this.drag.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
        }
        if (this.drag.mode === CurveRange.Mode.TwoConstants || this.drag.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
        }
        if (this.multiplyBySize) {
            context.markRequiredParameter(BuiltinParticleParameter.SIZE);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { velocity, baseVelocity } = particles;
        const { fromIndex, toIndex, deltaTime } = context;
        const floatRegister = particles.floatRegister.data;
        // eslint-disable-next-line no-lonely-if
        if (this.drag.mode === CurveRange.Mode.Constant) {
            const drag = this.drag.constant;
            for (let i = fromIndex; i < toIndex; i++) {
                floatRegister[i] = drag;
            }
        } else if (this.drag.mode === CurveRange.Mode.Curve) {
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            const { spline, multiplier } = this.drag;
            for (let i = fromIndex; i < toIndex; i++) {
                const normalizedTime = normalizedAliveTime[i];
                floatRegister[i] = spline.evaluate(normalizedTime) * multiplier;
            }
        } else if (this.drag.mode === CurveRange.Mode.TwoConstants) {
            const { constantMin, constantMax } = this.drag;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                floatRegister[i] = lerp(constantMin, constantMax, RandNumGen.getFloat(randomSeed[i] + DRAG_RAND_OFFSET));
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.drag;
            const randomSeed = particles.randomSeed.data;
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            for (let i = fromIndex; i < toIndex; i++) {
                const normalizedTime = normalizedAliveTime[i];
                floatRegister[i] = lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), RandNumGen.getFloat(randomSeed[i] + DRAG_RAND_OFFSET))  * multiplier;
            }
        }
        if (this.multiplyBySize) {
            const size = particles.size;
            for (let i = fromIndex; i < toIndex; i++) {
                size.getVec3At(_temp_v3, i);
                const maxDimension = Math.max(_temp_v3.x, _temp_v3.y, _temp_v3.z) * 0.5;
                floatRegister[i] *= maxDimension ** 2 * Math.PI;
            }
        }
        if (this.multiplyBySpeed) {
            for (let i = fromIndex; i < toIndex; i++) {
                const length = velocity.getVec3At(_temp_v3, i).length();
                const coefficient = floatRegister[i] * length * deltaTime;
                const ratio = length - Math.max(length - coefficient, 0);
                Vec3.multiplyScalar(_temp_v3, _temp_v3, ratio);
                baseVelocity.subVec3At(_temp_v3, i);
                velocity.subVec3At(_temp_v3, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                const length = velocity.getVec3At(_temp_v3, i).length();
                const coefficient = floatRegister[i] * deltaTime;
                const ratio = length - Math.max(length - coefficient, 0);
                Vec3.multiplyScalar(_temp_v3, _temp_v3, ratio);
                baseVelocity.subVec3At(_temp_v3, i);
                velocity.subVec3At(_temp_v3, i);
            }
        }
    }
}
