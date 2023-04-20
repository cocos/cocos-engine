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

import { ccclass, type, serializable, visible } from 'cc.decorator';
import { lerp, Vec3, CCBoolean } from '../../core';
import { FloatExpression } from '../expressions/float';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { VFXEmitterParams, VFXEmitterState, ModuleExecContext } from '../base';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';

const _temp_v3 = new Vec3();
const requiredParameters = BuiltinParticleParameterFlags.POSITION | BuiltinParticleParameterFlags.BASE_VELOCITY | BuiltinParticleParameterFlags.VELOCITY | BuiltinParticleParameterFlags.FLOAT_REGISTER;

@ccclass('cc.DragModule')
@VFXModule.register('Drag', ModuleExecStageFlags.UPDATE, [ParameterName.VELOCITY], [ParameterName.VELOCITY, ParameterName.SIZE])
export class DragModule extends VFXModule {
    @type(FloatExpression)
    @visible(true)
    @serializable
    public drag = new FloatExpression();

    @type(CCBoolean)
    @serializable
    public multiplyBySize = true;
    @type(CCBoolean)
    @serializable
    public multiplyBySpeed = true;

    private _randomOffset = 0;

    public onPlay (params: VFXEmitterParams, state: VFXEmitterState) {
        this._randomOffset = state.randomStream.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
        particles.markRequiredParameters(requiredParameters);
        if (this.drag.mode === FloatExpression.Mode.CURVE || this.drag.mode === FloatExpression.Mode.TWO_CURVES) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME);
        }
        if (this.drag.mode === FloatExpression.Mode.TWO_CONSTANTS || this.drag.mode === FloatExpression.Mode.TWO_CURVES) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
        if (this.multiplyBySize) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.SIZE);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { velocity, baseVelocity } = particles;
        const { fromIndex, toIndex, deltaTime } = context;
        const floatRegister = particles.floatRegister.data;
        const randomOffset = this._randomOffset;
        // eslint-disable-next-line no-lonely-if
        if (this.drag.mode === FloatExpression.Mode.CONSTANT) {
            const drag = this.drag.constant;
            for (let i = fromIndex; i < toIndex; i++) {
                floatRegister[i] = drag;
            }
        } else if (this.drag.mode === FloatExpression.Mode.CURVE) {
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            const { spline, multiplier } = this.drag;
            for (let i = fromIndex; i < toIndex; i++) {
                const normalizedTime = normalizedAliveTime[i];
                floatRegister[i] = spline.evaluate(normalizedTime) * multiplier;
            }
        } else if (this.drag.mode === FloatExpression.Mode.TWO_CONSTANTS) {
            const { constantMin, constantMax } = this.drag;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                floatRegister[i] = lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + randomOffset));
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.drag;
            const randomSeed = particles.randomSeed.data;
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            for (let i = fromIndex; i < toIndex; i++) {
                const normalizedTime = normalizedAliveTime[i];
                floatRegister[i] = lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), RandomStream.getFloat(randomSeed[i] + randomOffset))  * multiplier;
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
