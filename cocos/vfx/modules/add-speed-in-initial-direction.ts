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

import { ccclass, serializable, type } from 'cc.decorator';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { BASE_VELOCITY, INITIAL_DIR, POSITION, ParticleDataSet, VELOCITY } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { FloatExpression } from '../expressions/float';
import { Vec3 } from '../../core';
import { ConstantFloatExpression } from '../expressions';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const tempVelocity = new Vec3();

@ccclass('cc.AddSpeedInInitialDirectionModule')
@VFXModule.register('AddSpeedInInitialDirection', ModuleExecStageFlags.SPAWN | ModuleExecStageFlags.UPDATE, [VELOCITY.name], [INITIAL_DIR.name])
export class AddSpeedInInitialDirectionModule extends VFXModule {
    @type(FloatExpression)
    public get speed () {
        if (!this._speed) {
            this._speed = new ConstantFloatExpression(5);
        }
        return this._speed;
    }

    public set speed (val) {
        this._speed = val;
    }

    @serializable
    private _speed: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(POSITION);
        particles.markRequiredParameter(VELOCITY);
        particles.markRequiredParameter(INITIAL_DIR);

        this.speed.tick(particles, emitter, user, context);
        if (context.executionStage !== ModuleExecStage.UPDATE) {
            particles.markRequiredParameter(BASE_VELOCITY);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const velocity = particles.getVec3Parameter(context.executionStage === ModuleExecStage.SPAWN ? BASE_VELOCITY : VELOCITY);
        const initialDir = particles.getVec3Parameter(INITIAL_DIR);
        const exp = this._speed as FloatExpression;
        exp.bind(particles, emitter, user, context);
        if (exp.isConstant) {
            const curveStartSpeed = exp.evaluate(fromIndex);
            for (let i = fromIndex; i < toIndex; ++i) {
                initialDir.getVec3At(tempVelocity, i);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, curveStartSpeed);
                velocity.addVec3At(tempVelocity, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; ++i) {
                const curveStartSpeed = exp.evaluate(i);
                initialDir.getVec3At(tempVelocity, i);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, curveStartSpeed);
                velocity.addVec3At(tempVelocity, i);
            }
        }
    }
}
