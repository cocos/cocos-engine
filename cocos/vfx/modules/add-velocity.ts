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
import { VFXModule, VFXExecutionStage, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { BindingVec3Expression, ConstantFloatExpression, ConstantVec3Expression, FloatExpression, Vec3Expression } from '../expressions';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterRegistry } from '../vfx-parameter';

const tempVelocity = new Vec3();
const defaultPosition = new Vec3();
const originPosition = new Vec3();

export enum VelocityMode {
    LINEAR,
    FROM_POINT,
    IN_CONE,
}

@ccclass('cc.AddVelocityModule')
@VFXModule.register('AddVelocity', VFXExecutionStageFlags.UPDATE | VFXExecutionStageFlags.SPAWN, [P_VELOCITY.name])
export class AddVelocityModule extends VFXModule {
    @type(Enum(VelocityMode))
    public get velocityMode () {
        return this._velocityMode;
    }

    public set velocityMode (val) {
        this._velocityMode = val;
        this.requireRecompile();
    }

    @type(Enum(CoordinateSpace))
    public get coordinateSpace () {
        return this._coordinateSpace;
    }

    public set coordinateSpace (val) {
        this._coordinateSpace = val;
        this.requireRecompile();
    }

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
        this.requireRecompile();
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
        this.requireRecompile();
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
        this.requireRecompile();
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
        this.requireRecompile();
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
        this.requireRecompile();
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
    @serializable
    private _velocityMode = VelocityMode.LINEAR;
    @serializable
    private _coordinateSpace = CoordinateSpace.SIMULATION;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        parameterMap.ensure(P_VELOCITY);
        parameterMap.ensure(P_POSITION);
        if (this.usage !== VFXExecutionStage.UPDATE) {
            parameterMap.ensure(P_BASE_VELOCITY);
        }
        if (this._velocityMode === VelocityMode.LINEAR) {
            compileResult &&= this.velocity.compile(parameterMap, parameterRegistry, this);
            compileResult &&= this.velocityScale.compile(parameterMap, parameterRegistry, this);
        } else {
            compileResult &&= this.speed.compile(parameterMap, parameterRegistry, this);
            compileResult &&= this.velocityOrigin.compile(parameterMap, parameterRegistry, this);
            compileResult &&= this.defaultPosition.compile(parameterMap, parameterRegistry, this);
        }
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap) {
        const velocity = parameterMap.getVec3ArrayValue(this.usage === VFXExecutionStage.UPDATE ? P_VELOCITY : P_BASE_VELOCITY);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const needTransform = this._coordinateSpace !== CoordinateSpace.SIMULATION && (this._coordinateSpace !== CoordinateSpace.WORLD) !== parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;

        if (this._velocityMode === VelocityMode.LINEAR) {
            const velocityExp = this._velocity as Vec3Expression;
            const velocityScaleExp = this._velocityScale as FloatExpression;
            velocityExp.bind(parameterMap);
            velocityScaleExp.bind(parameterMap);
            if (needTransform) {
                const transform = parameterMap.getMat3Value(this._coordinateSpace === CoordinateSpace.LOCAL ? E_LOCAL_TO_WORLD_RS : E_WORLD_TO_LOCAL_RS).data;
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
        } else if (this._velocityMode === VelocityMode.FROM_POINT) {
            const speedExp = this._speed as FloatExpression;
            const velocityOriginExp = this._velocityOrigin as Vec3Expression;
            const defaultPositionExp = this._defaultPosition as Vec3Expression;
            speedExp.bind(parameterMap);
            velocityOriginExp.bind(parameterMap);
            defaultPositionExp.bind(parameterMap);
            for (let i = fromIndex; i < toIndex; i++) {
                defaultPositionExp.evaluate(i, defaultPosition);
                Vec3.subtract(tempVelocity, defaultPosition, velocityOriginExp.evaluate(i, originPosition));
                Vec3.normalize(tempVelocity, tempVelocity);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, speedExp.evaluate(i));
                velocity.addVec3At(tempVelocity, i);
            }
        }
    }
}
