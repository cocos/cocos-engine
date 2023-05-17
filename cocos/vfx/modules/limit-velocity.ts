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

import { ccclass, type, serializable, visible, rangeMin } from 'cc.decorator';
import { lerp, Vec3 } from '../../core';
import { CoordinateSpace } from '../define';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { ModuleExecContext } from '../base';
import { BASE_VELOCITY, ParticleDataSet, VELOCITY } from '../particle-data-set';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';

const limit = new Vec3();
const tempVelocity = new Vec3();
const srcVelocity = new Vec3();

@ccclass('cc.LimitVelocity')
@VFXModule.register('LimitVelocity', ModuleExecStageFlags.UPDATE, [VELOCITY.name], [VELOCITY.name])
export class LimitVelocityModule extends VFXModule {
    /**
     * @zh 是否三个轴分开限制。
     */
    @serializable
    public separateAxes = false;

    /**
     * @zh 计算速度下限时采用的坐标系 [[Space]]。
     */
    @type(CoordinateSpace)
    @serializable
    public coordinateSpace = CoordinateSpace.LOCAL;
    /**
     * @zh X 轴方向上的速度下限。
     */
    @type(FloatExpression)
    @visible(function (this: LimitVelocityModule): boolean {
        return !this.separateAxes;
    })
    public get uniformLimit () {
        if (!this._uniformLimit) {
            this._uniformLimit = new ConstantFloatExpression(1);
        }
        return this._uniformLimit;
    }

    /**
     * @zh 速度下限。
     */
    @type(Vec3Expression)
    @visible(function (this: LimitVelocityModule): boolean {
        return this.separateAxes;
    })
    public get limit () {
        if (!this._limit) {
            this._limit = new ConstantVec3Expression(Vec3.ONE);
        }
        return this._limit;
    }

    public set limit (val) {
        this._limit = val;
    }

    /**
     * @zh 当前速度与速度下限的插值。
     */
    @type(FloatExpression)
    @serializable
    @rangeMin(0)
    public dampen = new ConstantFloatExpression(0.3);

    @serializable
    private _uniformLimit: FloatExpression | null = null;
    @serializable
    private _limit: Vec3Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(VELOCITY);
        particles.markRequiredParameter(BASE_VELOCITY);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const velocity = particles.getVec3Parameter(VELOCITY);
        const baseVelocity = particles.getVec3Parameter(BASE_VELOCITY);
        const needTransform = this.coordinateSpace !== CoordinateSpace.SIMULATION && (this.coordinateSpace !== CoordinateSpace.WORLD) !== emitter.isWorldSpace;
        if (this.separateAxes) {
            const exp = this._limit as Vec3Expression;
            exp.bind(particles, emitter, user, context);
            const dampen = this.dampen;
            dampen.bind(particles, emitter, user, context);
            if (needTransform) {
                const transform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.localToWorldRS : emitter.worldToLocalRS;
                const invTransform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.worldToLocalRS : emitter.localToWorldRS;
                for (let i = fromIndex; i < toIndex; i++) {
                    exp.evaluate(i, limit);
                    velocity.getVec3At(srcVelocity, i);
                    Vec3.transformMat3(tempVelocity, srcVelocity, transform);
                    const dampenRatio = dampen.evaluate(i);
                    Vec3.set(tempVelocity,
                        dampenBeyondLimit(tempVelocity.x, limit.x, dampenRatio),
                        dampenBeyondLimit(tempVelocity.y, limit.y, dampenRatio),
                        dampenBeyondLimit(tempVelocity.z, limit.z, dampenRatio));
                    Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                    velocity.setVec3At(tempVelocity, i);
                    baseVelocity.addVec3At(Vec3.subtract(tempVelocity, tempVelocity, srcVelocity), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    exp.evaluate(i, limit);
                    velocity.getVec3At(tempVelocity, i);
                    const dampenRatio = dampen.evaluate(i);
                    Vec3.set(tempVelocity,
                        dampenBeyondLimit(tempVelocity.x, limit.x, dampenRatio),
                        dampenBeyondLimit(tempVelocity.y, limit.y, dampenRatio),
                        dampenBeyondLimit(tempVelocity.z, limit.z, dampenRatio));
                    velocity.setVec3At(tempVelocity, i);
                    baseVelocity.addVec3At(Vec3.subtract(tempVelocity, tempVelocity, srcVelocity), i);
                }
            }
        } else {
            const exp = this._uniformLimit as FloatExpression;
            exp.bind(particles, emitter, user, context);
            const dampen = this.dampen;
            dampen.bind(particles, emitter, user, context);
            if (needTransform) {
                const transform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.localToWorldRS : emitter.worldToLocalRS;
                const invTransform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.worldToLocalRS : emitter.localToWorldRS;
                for (let i = fromIndex; i < toIndex; i++) {
                    const limit = exp.evaluate(i);
                    velocity.getVec3At(srcVelocity, i);
                    Vec3.transformMat3(tempVelocity, srcVelocity, transform);
                    const dampenRatio = dampen.evaluate(i);
                    const oldLength = tempVelocity.length();
                    const newLength = dampenBeyondLimit(oldLength, limit, dampenRatio);
                    tempVelocity.multiplyScalar(newLength / oldLength);
                    Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                    velocity.setVec3At(tempVelocity, i);
                    baseVelocity.addVec3At(Vec3.subtract(tempVelocity, tempVelocity, srcVelocity), i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const limit = exp.evaluate(i);
                    velocity.getVec3At(tempVelocity, i);
                    const dampenRatio = dampen.evaluate(i);
                    const oldLength = tempVelocity.length();
                    const newLength = dampenBeyondLimit(oldLength, limit, dampenRatio);
                    tempVelocity.multiplyScalar(newLength / oldLength);
                    velocity.setVec3At(tempVelocity, i);
                    baseVelocity.addVec3At(Vec3.subtract(tempVelocity, tempVelocity, srcVelocity), i);
                }
            }
        }
    }
}

function dampenBeyondLimit (vel: number, limit: number, dampen: number) {
    const sgn = Math.sign(vel);
    let abs = Math.abs(vel);
    if (abs > limit) {
        abs = lerp(abs, limit, dampen);
    }
    return abs * sgn;
}
