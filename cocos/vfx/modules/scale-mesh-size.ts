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

import { ccclass, tooltip, displayOrder, type, serializable, visible } from 'cc.decorator';
import { Vec3 } from '../../core';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { BASE_SCALE, NORMALIZED_AGE, ParticleDataSet, SCALE } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';

const tempScalar = new Vec3();

@ccclass('cc.ScaleMeshSizeModule')
@VFXModule.register('ScaleMeshSize', ModuleExecStageFlags.UPDATE | ModuleExecStageFlags.SPAWN, [SCALE.name], [NORMALIZED_AGE.name])
export class ScaleMeshSizeModule extends VFXModule {
    /**
      * @zh 决定是否在每个轴上独立控制粒子大小。
      */
    @serializable
    public separateAxes = false;

    /**
      * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
      */
    @type(FloatExpression)
    @visible(function (this: ScaleMeshSizeModule): boolean { return !this.separateAxes; })
    public get uniformScalar () {
        if (!this._uniformScalar) {
            this._uniformScalar = new ConstantFloatExpression(1);
        }
        return this._uniformScalar;
    }

    public set uniformScalar (val) {
        this._uniformScalar = val;
    }

    @type(Vec3Expression)
    @visible(function (this: ScaleMeshSizeModule): boolean { return this.separateAxes; })
    public get scalar () {
        if (!this._scalar) {
            this._scalar = new ConstantVec3Expression(Vec3.ONE);
        }
        return this._scalar;
    }

    public set scalar (val) {
        this._scalar = val;
    }

    @serializable
    private _uniformScalar: FloatExpression | null = null;
    @serializable
    private _scalar: Vec3Expression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(SCALE);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameter(BASE_SCALE);
        }
        if (this.separateAxes) {
            this.scalar.tick(particles, emitter, user, context);
        } else {
            this.uniformScalar.tick(particles, emitter, user, context);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const scale = particles.getVec3Parameter(context.executionStage === ModuleExecStage.SPAWN ? BASE_SCALE : SCALE);
        const { fromIndex, toIndex } = context;
        if (!this.separateAxes) {
            const exp = this.uniformScalar;
            exp.bind(particles, emitter, user, context);
            if (exp.isConstant) {
                const scalar = exp.evaluate(0);
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiply1fAt(scalar, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = exp.evaluate(i);
                    scale.multiply1fAt(scalar, i);
                }
            }
        } else {
            const exp = this.scalar;
            exp.bind(particles, emitter, user, context);
            if (exp.isConstant) {
                const scalar = exp.evaluate(0, tempScalar);
                for (let i = fromIndex; i < toIndex; i++) {
                    scale.multiplyVec3At(scalar, i);
                }
            } else {
                for (let i = fromIndex; i < toIndex; i++) {
                    const scalar = exp.evaluate(i, tempScalar);
                    scale.multiplyVec3At(scalar, i);
                }
            }
        }
    }

    protected needsFilterSerialization () {
        return true;
    }

    protected getSerializedProps () {
        if (!this.separateAxes) {
            return ['separateAxes', 'x'];
        } else {
            return ['separateAxes', 'x', '_y', '_z'];
        }
    }
}
