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

import { ccclass, serializable, tooltip, type, visible } from 'cc.decorator';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { BASE_SCALE, NORMALIZED_AGE, ParticleDataSet, SCALE } from '../particle-data-set';
import { ModuleExecContext } from '../module-exec-context';
import { FloatExpression } from '../expressions/float';
import { Vec3 } from '../../core';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';

const tempScale = new Vec3();
@ccclass('cc.SetMeshScaleModule')
@VFXModule.register('SetMeshScale', ModuleExecStageFlags.SPAWN | ModuleExecStageFlags.UPDATE, [SCALE.name], [NORMALIZED_AGE.name])
export class SetMeshScaleModule extends VFXModule {
    @serializable
    @tooltip('i18n:particle_system.startSize3D')
    public separateAxes = false;

    @type(FloatExpression)
    @visible(function (this: SetMeshScaleModule): boolean { return !this.separateAxes; })
    public get uniformScale () {
        if (!this._uniformScale) {
            this._uniformScale = new ConstantFloatExpression(1);
        }
        return this._uniformScale;
    }

    public set uniformScale (val) {
        this._uniformScale = val;
    }

    @type(Vec3Expression)
    @visible(function (this: SetMeshScaleModule): boolean { return this.separateAxes; })
    public get scale () {
        if (!this._scale) {
            this._scale = new ConstantVec3Expression(new Vec3(1, 1, 1));
        }
        return this._scale;
    }

    public set scale (val) {
        this._scale = val;
    }

    @serializable
    private _uniformScale: FloatExpression | null = null;
    @serializable
    private _scale: Vec3Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(BASE_SCALE);
        }

        particles.markRequiredParameter(SCALE);
        if (this.separateAxes) {
            this.scale.tick(particles, emitter, user, context);
        } else {
            this.uniformScale.tick(particles, emitter, user, context);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const scale = particles.getVec3Parameter(context.executionStage === ModuleExecStage.SPAWN ? BASE_SCALE : SCALE);
        const { fromIndex, toIndex } = context;
        if (this.separateAxes) {
            const exp = this._scale as Vec3Expression;
            exp.bind(particles, emitter, user, context);
            if (exp.isConstant) {
                const srcScale = exp.evaluate(0, tempScale);
                scale.fill(srcScale, fromIndex, toIndex);
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    exp.evaluate(i, tempScale);
                    scale.setVec3At(tempScale, i);
                }
            }
        } else {
            const exp = this._uniformScale as FloatExpression;
            exp.bind(particles, emitter, user, context);
            if (exp.isConstant) {
                const srcScale = exp.evaluate(0);
                Vec3.set(tempScale, srcScale, srcScale, srcScale);
                scale.fill(tempScale, fromIndex, toIndex);
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const srcScale = exp.evaluate(i);
                    scale.setUniformFloatAt(srcScale, i);
                }
            }
        }
    }
}
