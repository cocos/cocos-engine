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

import { ccclass, serializable, type, visible } from 'cc.decorator';
import { CCBoolean, Enum, Vec3 } from '../../core';
import { FloatExpression } from '../expressions/float';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { ParticleDataSet, VELOCITY } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';
import { CoordinateSpace } from '../define';

const tempScalar = new Vec3();
const tempVelocity = new Vec3();

@ccclass('cc.ScaleVelocityModule')
@VFXModule.register('ScaleVelocity', ModuleExecStageFlags.UPDATE, [VELOCITY.name], [VELOCITY.name])
export class ScaleVelocityModule extends VFXModule {
    @type(Enum(CoordinateSpace))
    @serializable
    public coordinateSpace = CoordinateSpace.LOCAL;

    /**
     * @zh 决定是否在每个轴上独立控制粒子大小。
     */
    @serializable
    @type(CCBoolean)
    public separateAxes = false;

    /**
     * @zh 速度修正系数。
     */
    @type(Vec3Expression)
    @visible(function (this: ScaleVelocityModule): boolean { return this.separateAxes; })
    public get scalar () {
        if (!this._scalar) {
            this._scalar = new ConstantVec3Expression(Vec3.ONE);
        }
        return this._scalar;
    }

    public set scalar (val) {
        this._scalar = val;
    }

    @type(FloatExpression)
    @visible(function (this: ScaleVelocityModule): boolean { return !this.separateAxes; })
    public get uniformScalar () {
        if (!this._uniformScalar) {
            this._uniformScalar = new ConstantFloatExpression(1);
        }
        return this._uniformScalar;
    }

    public set uniformScalar (val) {
        this._uniformScalar = val;
    }

    @serializable
    private _scalar: Vec3Expression | null = null;
    @serializable
    private _uniformScalar: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(VELOCITY);
        if (this.separateAxes) {
            this.scalar.tick(particles, emitter, user, context);
        } else {
            this.uniformScalar.tick(particles, emitter, user, context);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const velocity  = particles.getVec3Parameter(VELOCITY);
        const needTransform = this.coordinateSpace !== CoordinateSpace.SIMULATION && (this.coordinateSpace !== CoordinateSpace.WORLD) !== emitter.isWorldSpace;
        const { fromIndex, toIndex } = context;
        if (this.separateAxes) {
            const exp = this.scalar;
            exp.bind(particles, emitter, user, context);
            if (needTransform) {
                const transform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.localToWorldRS : emitter.worldToLocalRS;
                const invTransform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.worldToLocalRS : emitter.localToWorldRS;
                if (exp.isConstant) {
                    const scalar = exp.evaluate(0, tempScalar);
                    for (let i = fromIndex; i < toIndex; i++) {
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                        Vec3.multiply(tempVelocity, tempVelocity, scalar);
                        Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                        velocity.setVec3At(tempVelocity, i);
                    }
                } else {
                    for (let i = fromIndex; i < toIndex; i++) {
                        const scalar = exp.evaluate(i, tempScalar);
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                        Vec3.multiply(tempVelocity, tempVelocity, scalar);
                        Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                        velocity.setVec3At(tempVelocity, i);
                    }
                }
            } else if (exp.isConstant) {
                const scalar = exp.evaluate(0, tempScalar);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.multiplyVec3At(scalar, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = exp.evaluate(i, tempScalar);
                    velocity.multiplyVec3At(scalar, i);
                }
            }
        } else {
            const exp = this.uniformScalar;
            exp.bind(particles, emitter, user, context);
            if (needTransform) {
                const transform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.localToWorldRS : emitter.worldToLocalRS;
                const invTransform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.worldToLocalRS : emitter.localToWorldRS;
                if (exp.isConstant) {
                    const scalar = exp.evaluate(0);
                    for (let i = fromIndex; i < toIndex; i++) {
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                        Vec3.multiplyScalar(tempVelocity, tempVelocity, scalar);
                        Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                        velocity.setVec3At(tempVelocity, i);
                    }
                } else {
                    for (let i = fromIndex; i < toIndex; i++) {
                        const scalar = exp.evaluate(i);
                        velocity.getVec3At(tempVelocity, i);
                        Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                        Vec3.multiplyScalar(tempVelocity, tempVelocity, scalar);
                        Vec3.transformMat3(tempVelocity, tempVelocity, invTransform);
                        velocity.setVec3At(tempVelocity, i);
                    }
                }
            } else if (exp.isConstant) {
                const scalar = exp.evaluate(0);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.multiplyScalarAt(scalar, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = exp.evaluate(i);
                    velocity.multiplyScalarAt(scalar, i);
                }
            }
        }
    }
}
