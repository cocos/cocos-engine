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
import { Enum, Vec3 } from '../../core';
import { C_FROM_INDEX, C_TO_INDEX, CoordinateSpace, E_IS_WORLD_SPACE, E_LOCAL_TO_WORLD_RS, E_WORLD_TO_LOCAL_RS, P_BASE_VELOCITY, P_POSITION, P_VELOCITY, E_SIMULATION_POSITION } from '../define';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { ParticleDataSet, ContextDataSet, EmitterDataSet, UserDataSet } from '../data-set';
import { BindingVec3Expression, ConstantFloatExpression, ConstantVec3Expression, FloatExpression, Vec3Expression } from '../expressions';
import { BoolParameter, Vec3ArrayParameter, Uint32Parameter, Mat3Parameter } from '../parameters';

const tempVelocity = new Vec3();

export enum VelocityMode {
    LINEAR,
    FROM_POINT,
    IN_CONE,
}

@ccclass('cc.AddVelocityModule')
@VFXModule.register('AddVelocity', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [P_VELOCITY.name])
export class AddVelocityModule extends VFXModule {
    @type(Enum(VelocityMode))
    @serializable
    public velocityMode = VelocityMode.LINEAR;

    @type(Enum(CoordinateSpace))
    @serializable
    public coordinateSpace = CoordinateSpace.LOCAL;

    @type(Vec3Expression)
    @visible(function (this: AddVelocityModule) {
        return this.velocityMode === VelocityMode.LINEAR;
    })
    public get velocity () {
        if (!this._velocity) {
            this._velocity = new ConstantVec3Expression(0, 0, 0.5);
        }
        return this._velocity;
    }

    public set velocity (val) {
        this._velocity = val;
    }

    @type(FloatExpression)
    @visible(function (this: AddVelocityModule) {
        return this.velocityMode === VelocityMode.LINEAR;
    })
    public get velocityScale () {
        if (!this._velocityScale) {
            this._velocityScale = new ConstantFloatExpression(1);
        }
        return this._velocityScale;
    }

    public set velocityScale (val) {
        this._velocityScale = val;
    }

    @type(FloatExpression)
    @visible(function (this: AddVelocityModule) {
        return this.velocityMode === VelocityMode.FROM_POINT;
    })
    public get speed () {
        if (!this._speed) {
            this._speed = new ConstantFloatExpression(0.25);
        }
        return this._speed;
    }

    public set speed (val) {
        this._speed = val;
    }

    @type(Vec3Expression)
    @visible(function (this: AddVelocityModule) {
        return this.velocityMode === VelocityMode.FROM_POINT;
    })
    public get velocityOrigin () {
        if (!this._velocityOrigin) {
            this._velocityOrigin = new BindingVec3Expression(E_SIMULATION_POSITION);
        }
        return this._velocityOrigin;
    }

    public set velocityOrigin (val) {
        this._velocityOrigin = val;
    }

    @type(Vec3Expression)
    @visible(function (this: AddVelocityModule) {
        return this.velocityMode === VelocityMode.FROM_POINT;
    })
    public get defaultPosition () {
        if (!this._defaultPosition) {
            this._defaultPosition = new BindingVec3Expression(P_POSITION);
        }
        return this._defaultPosition;
    }

    public set defaultPosition (val) {
        this._defaultPosition = val;
    }

    @serializable
    private _velocity: Vec3Expression | null = null;
    @serializable
    private _velocityScale: FloatExpression | null = null;
    @serializable
    private _speed: FloatExpression | null = null;
    @serializable
    private _velocityOrigin: Vec3Expression | null = null;
    @serializable
    private _defaultPosition: Vec3Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(P_VELOCITY);
        particles.markRequiredParameter(P_POSITION);
        if (context.executionStage !== ModuleExecStage.UPDATE) {
            particles.markRequiredParameter(P_BASE_VELOCITY);
        }
        if (this.velocityMode === VelocityMode.LINEAR) {
            this.velocity.tick(particles, emitter, user, context);
            this.velocityScale.tick(particles, emitter, user, context);
        } else {
            this.speed.tick(particles, emitter, user, context);
            this.velocityOrigin.tick(particles, emitter, user, context);
            this.defaultPosition.tick(particles, emitter, user, context);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const velocity = particles.getParameterUnsafe<Vec3ArrayParameter>(context.executionStage === ModuleExecStage.UPDATE ? P_VELOCITY : P_BASE_VELOCITY);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(C_FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(C_TO_INDEX).data;
        const needTransform = this.coordinateSpace !== CoordinateSpace.SIMULATION && (this.coordinateSpace !== CoordinateSpace.WORLD) !== emitter.getParameterUnsafe<BoolParameter>(E_IS_WORLD_SPACE).data;

        if (this.velocityMode === VelocityMode.LINEAR) {
            const velocityExp = this._velocity as Vec3Expression;
            const velocityScaleExp = this._velocityScale as FloatExpression;
            velocityExp.bind(particles, emitter, user, context);
            velocityScaleExp.bind(particles, emitter, user, context);
            if (velocityExp.isConstant && velocityScaleExp.isConstant) {
                velocityExp.evaluate(0, tempVelocity);
                const scale = velocityScaleExp.evaluate(0);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, scale);
                if (needTransform) {
                    const transform = emitter.getParameterUnsafe<Mat3Parameter>(this.coordinateSpace === CoordinateSpace.LOCAL ? E_LOCAL_TO_WORLD_RS : E_WORLD_TO_LOCAL_RS).data;
                    Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                }
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addVec3At(tempVelocity, i);
                }
            } else if (needTransform) {
                const transform = emitter.getParameterUnsafe<Mat3Parameter>(this.coordinateSpace === CoordinateSpace.LOCAL ? E_LOCAL_TO_WORLD_RS : E_WORLD_TO_LOCAL_RS).data;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocityExp.evaluate(i, tempVelocity);
                    const scale = velocityScaleExp.evaluate(i);
                    Vec3.multiplyScalar(tempVelocity, tempVelocity, scale);
                    Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    velocityExp.evaluate(i, tempVelocity);
                    const scale = velocityScaleExp.evaluate(i);
                    Vec3.multiplyScalar(tempVelocity, tempVelocity, scale);
                    velocity.addVec3At(tempVelocity, i);
                }
            }
        } else if (this.velocityMode === VelocityMode.FROM_POINT) {
            const speedExp = this._speed as FloatExpression;
            const velocityOriginExp = this._velocityOrigin as Vec3Expression;
            const defaultPositionExp = this._defaultPosition as Vec3Expression;
            speedExp.bind(particles, emitter, user, context);
            velocityOriginExp.bind(particles, emitter, user, context);
            defaultPositionExp.bind(particles, emitter, user, context);
        }
    }
}
