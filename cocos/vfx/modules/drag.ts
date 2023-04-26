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
import { lerp, Vec3, CCBoolean, Enum } from '../../core';
import { FloatExpression } from '../expressions/float';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ModuleExecContext } from '../base';
import { BASE_VELOCITY, PHYSICS_FORCE, POSITION, ParticleDataSet, SCALE, SPRITE_SIZE, VELOCITY } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { ConstantFloatExpression } from '../expressions';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const _temp_v3 = new Vec3();

export enum RadiusSource {
    SPRITE_SIZE,
    MESH_SCALE,
    CUSTOM,
}
@ccclass('cc.DragModule')
@VFXModule.register('Drag', ModuleExecStageFlags.UPDATE, [VELOCITY.name], [VELOCITY.name, SCALE.name, SPRITE_SIZE.name])
export class DragModule extends VFXModule {
    @type(FloatExpression)
    @visible(true)
    @serializable
    public drag: FloatExpression = new ConstantFloatExpression();

    @type(CCBoolean)
    @serializable
    public multiplyByRadius = true;

    @type(Enum(RadiusSource))
    @visible(function (this: DragModule) { return this.multiplyByRadius; })
    @serializable
    public radiusSource = RadiusSource.SPRITE_SIZE;

    @type(FloatExpression)
    @visible(function (this: DragModule) { return this.multiplyByRadius && this.radiusSource === RadiusSource.CUSTOM; })
    @serializable
    public radius: FloatExpression = new ConstantFloatExpression(1);

    @type(CCBoolean)
    @serializable
    public multiplyBySpeed = true;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(POSITION);
        particles.markRequiredParameter(BASE_VELOCITY);
        particles.markRequiredParameter(VELOCITY);
        particles.markRequiredParameter(PHYSICS_FORCE);
        this.drag.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const physicsForce = particles.getVec3Parameter(PHYSICS_FORCE);
        const { fromIndex, toIndex } = context;
        const exp = this.drag;
        exp.bind(particles, emitter, user, context);

        if (exp.isConstant) {
            const drag = exp.evaluate(0);
            for (let i = fromIndex; i < toIndex; i++) {
                floatRegister[i] = drag;
            }
        }
        // eslint-disable-next-line no-lonely-if
        if (this.drag.mode === FloatExpression.Mode.CONSTANT) {
            const drag = this.drag.constant;
            for (let i = fromIndex; i < toIndex; i++) {
                floatRegister[i] = drag;
            }
        } else if (this.drag.mode === FloatExpression.Mode.CURVE) {
            const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
            const { spline, multiplier } = this.drag;
            for (let i = fromIndex; i < toIndex; i++) {
                const normalizedTime = normalizedAge[i];
                floatRegister[i] = spline.evaluate(normalizedTime) * multiplier;
            }
        } else if (this.drag.mode === FloatExpression.Mode.TWO_CONSTANTS) {
            const { constantMin, constantMax } = this.drag;
            const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
            for (let i = fromIndex; i < toIndex; i++) {
                floatRegister[i] = lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + randomOffset));
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.drag;
            const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
            const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
            for (let i = fromIndex; i < toIndex; i++) {
                const normalizedTime = normalizedAge[i];
                floatRegister[i] = lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), RandomStream.getFloat(randomSeed[i] + randomOffset))  * multiplier;
            }
        }
        if (this.multiplyBySize) {
            const scale = particles.getVec3Parameter(SCALE);
            for (let i = fromIndex; i < toIndex; i++) {
                scale.getVec3At(_temp_v3, i);
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
