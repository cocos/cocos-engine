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

import { ccclass, type, serializable } from 'cc.decorator';
import { Enum, Vec3 } from '../../core';
import { CoordinateSpace } from '../define';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { BASE_VELOCITY, POSITION, ParticleDataSet, VELOCITY } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, ConstantVec3Expression, FloatExpression, Vec3Expression } from '../expressions';

const tempVelocity = new Vec3();

@ccclass('cc.VortexVelocityModule')
@VFXModule.register('VortexVelocity', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [VELOCITY.name])
export class VortexVelocityModule extends VFXModule {
    @type(Enum(CoordinateSpace))
    @serializable
    public vortexAxisCoordinateSpace = CoordinateSpace.LOCAL;

    @type(Vec3Expression)
    public get vortexAxis () {
        if (!this._vortexAxis) {
            this._vortexAxis = new ConstantVec3Expression(Vec3.UNIT_Y);
        }
        return this._vortexAxis;
    }

    public set vortexAxis (val) {
        this._vortexAxis = val;
    }

    @type(FloatExpression)
    public get velocity () {
        if (!this._velocity) {
            this._velocity = new ConstantFloatExpression();
        }
        return this._velocity;
    }

    public set velocity (val) {
        this._velocity = val;
    }

    @type(Vec3Expression)
    public get vortexOrigin () {
        if (!this._vortexOrigin) {
            this._vortexOrigin = new ConstantVec3Expression(Vec3.ZERO);
        }
        return this._vortexOrigin;
    }

    public set vortexOrigin (val) {
        this._vortexOrigin = val;
    }

    @serializable
    private _vortexAxis: Vec3Expression | null = null;
    @serializable
    private _vortexOrigin: Vec3Expression | null = null;
    @serializable
    private _velocity: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this.velocity.tick(particles, emitter, user, context);

        particles.markRequiredParameter(VELOCITY);
        particles.markRequiredParameter(POSITION);
        if (context.executionStage !== ModuleExecStage.UPDATE) {
            particles.markRequiredParameter(BASE_VELOCITY);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const needTransform = this.vortexAxisCoordinateSpace !== CoordinateSpace.SIMULATION && (this.vortexAxisCoordinateSpace !== CoordinateSpace.WORLD) !== emitter.isWorldSpace;
        const velocity = particles.getVec3Parameter(context.executionStage === ModuleExecStage.UPDATE ? VELOCITY : BASE_VELOCITY);
        const { fromIndex, toIndex } = context;
        const exp = this._velocity as FloatExpression;

        if (exp.isConstant) {
            exp.evaluate(0, tempVelocity);
            if (needTransform) {
                const transform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.localToWorldRS : emitter.worldToLocalRS;
                Vec3.transformMat3(tempVelocity, tempVelocity, transform);
            }
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.addVec3At(tempVelocity, i);
            }
        } else if (needTransform) {
            const transform = this.coordinateSpace === CoordinateSpace.LOCAL ? emitter.localToWorldRS : emitter.worldToLocalRS;
            for (let i = fromIndex; i < toIndex; i++) {
                exp.evaluate(i, tempVelocity);
                Vec3.transformMat3(tempVelocity, tempVelocity, transform);
                velocity.addVec3At(tempVelocity, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                exp.evaluate(i, tempVelocity);
                velocity.addVec3At(tempVelocity, i);
            }
        }
    }
}
