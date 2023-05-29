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
import { ccclass, rangeMin, serializable, type } from 'cc.decorator';
import { ColorExpression, ConstantColorExpression, ConstantFloatExpression, FloatExpression } from '../expressions';
import { FROM_INDEX, ContextDataSet, TO_INDEX, COLOR, ParticleDataSet, VELOCITY, UserDataSet, EmitterDataSet } from '../data-set';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { Color, math, Vec3 } from '../../core';
import { Uint32Parameter, Vec3ArrayParameter, ColorArrayParameter } from '../parameters';

const tempVelocity = new Vec3();
const tempColor = new Color();
const tempColor2 = new Color();
const tempColor3 = new Color();

@ccclass('cc.ScaleColorBySpeedModule')
@VFXModule.register('ScaleColorBySpeed', ModuleExecStageFlags.UPDATE, [COLOR.name], [VELOCITY.name])
export class ScaleColorBySpeedModule extends VFXModule {
    @type(ColorExpression)
    public get minScalar () {
        if (!this._minScalar) { this._minScalar = new ConstantColorExpression(Color.TRANSPARENT); }
        return this._minScalar;
    }

    public set minScalar (val) {
        this._minScalar = val;
    }

    @type(ColorExpression)
    public get maxScalar () {
        if (!this._maxScalar) { this._maxScalar = new ConstantColorExpression(Color.WHITE); }
        return this._maxScalar;
    }

    public set maxScalar (val) {
        this._maxScalar = val;
    }

    @type(FloatExpression)
    @rangeMin(0)
    public get minSpeedThreshold () {
        if (!this._minSpeedThreshold) { this._minSpeedThreshold = new ConstantFloatExpression(); }
        return this._minSpeedThreshold;
    }

    public set minSpeedThreshold (val) {
        this._minSpeedThreshold = val;
    }

    @type(FloatExpression)
    @rangeMin(0)
    public get maxSpeedThreshold () {
        if (!this._maxSpeedThreshold) { this._maxSpeedThreshold = new ConstantFloatExpression(1); }
        return this._maxSpeedThreshold;
    }

    public set maxSpeedThreshold (val) {
        this._maxSpeedThreshold = val;
    }

    @serializable
    private _minScalar: ColorExpression | null = null;
    @serializable
    private _maxScalar: ColorExpression | null = null;
    @serializable
    private _minSpeedThreshold: FloatExpression | null = null;
    @serializable
    private _maxSpeedThreshold: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(COLOR);
        this.maxScalar.tick(particles, emitter, user, context);
        this.minScalar.tick(particles, emitter, user, context);
        this.minSpeedThreshold.tick(particles, emitter, user, context);
        this.maxSpeedThreshold.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const hasVelocity = particles.hasParameter(VELOCITY);
        if (!hasVelocity) { return; }
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        const velocity = particles.getParameterUnsafe<Vec3ArrayParameter>(VELOCITY);
        const color = particles.getParameterUnsafe<ColorArrayParameter>(COLOR);
        const minSpeedThresholdExp = this._minSpeedThreshold as FloatExpression;
        const maxSpeedThresholdExp = this._maxSpeedThreshold as FloatExpression;
        const minScalarExp = this._minScalar as ColorExpression;
        const maxScalarExp = this._maxScalar as ColorExpression;

        if (minSpeedThresholdExp.isConstant && maxSpeedThresholdExp.isConstant) {
            const min = minSpeedThresholdExp.evaluate(0);
            const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(0));
            const speedOffset = -min * speedScale;
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.getVec3At(tempVelocity, i);
                const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                color.multiplyColorAt(Color.lerp(tempColor3, minScalarExp.evaluate(i, tempColor), maxScalarExp.evaluate(i, tempColor2), ratio), i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                const min = minSpeedThresholdExp.evaluate(i);
                const speedScale = 1 / Math.abs(min - maxSpeedThresholdExp.evaluate(i));
                const speedOffset = -min * speedScale;
                velocity.getVec3At(tempVelocity, i);
                const ratio = math.clamp01(tempVelocity.length() * speedScale + speedOffset);
                color.multiplyColorAt(Color.lerp(tempColor3, minScalarExp.evaluate(i, tempColor), maxScalarExp.evaluate(i, tempColor2), ratio), i);
            }
        }
    }
}
