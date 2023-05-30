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
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { P_BASE_SCALE, P_NORMALIZED_AGE, ParticleDataSet, P_SCALE, C_FROM_INDEX, ContextDataSet, C_TO_INDEX, EmitterDataSet, UserDataSet } from '../data-set';
import { FloatExpression, ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';
import { Vec3 } from '../../core';
import { Vec3ArrayParameter, Uint32Parameter } from '../parameters';

const tempScale = new Vec3();
@ccclass('cc.SetMeshScaleModule')
@VFXModule.register('SetMeshScale', ModuleExecStageFlags.SPAWN | ModuleExecStageFlags.UPDATE, [P_SCALE.name], [P_NORMALIZED_AGE.name])
export class SetMeshScaleModule extends VFXModule {
    @serializable
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
            this._scale = new ConstantVec3Expression(1, 1, 1);
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

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(P_BASE_SCALE);
        }

        particles.markRequiredParameter(P_SCALE);
        if (this.separateAxes) {
            this.scale.tick(particles, emitter, user, context);
        } else {
            this.uniformScale.tick(particles, emitter, user, context);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const scale = particles.getParameterUnsafe<Vec3ArrayParameter>(context.executionStage === ModuleExecStage.SPAWN ? P_BASE_SCALE : P_SCALE);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(C_FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(C_TO_INDEX).data;
        if (this.separateAxes) {
            const scaleExp = this._scale as Vec3Expression;
            scaleExp.bind(particles, emitter, user, context);
            if (scaleExp.isConstant) {
                const srcScale = scaleExp.evaluate(0, tempScale);
                scale.fill(srcScale, fromIndex, toIndex);
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    scaleExp.evaluate(i, tempScale);
                    scale.setVec3At(tempScale, i);
                }
            }
        } else {
            const uniformScaleExp = this._uniformScale as FloatExpression;
            uniformScaleExp.bind(particles, emitter, user, context);
            if (uniformScaleExp.isConstant) {
                const srcScale = uniformScaleExp.evaluate(0);
                Vec3.set(tempScale, srcScale, srcScale, srcScale);
                scale.fill(tempScale, fromIndex, toIndex);
            } else {
                for (let i = fromIndex; i < toIndex; ++i) {
                    const srcScale = uniformScaleExp.evaluate(i);
                    scale.setUniformFloatAt(srcScale, i);
                }
            }
        }
    }
}
