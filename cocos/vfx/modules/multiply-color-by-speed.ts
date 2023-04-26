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
import { ColorExpression } from '../expressions/color';
import { VFXEmitterParams, ModuleExecContext } from '../base';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { approx, assertIsTrue, Color, math, Vec3, Vec2 } from '../../core';
import { RandomStream } from '../random-stream';
import { UserDataSet } from '../user-data-set';

const tempVelocity = new Vec3();
const tempColor = new Color();
const tempColor2 = new Color();
const tempColor3 = new Color();
const MULTIPLY_COLOR_BY_SPEED_RAND_OFFSET = 27382;

@ccclass('cc.MultiplyColorBySpeed')
@VFXModule.register('MultiplyColorBySpeed', ModuleExecStageFlags.UPDATE, [ParameterName.COLOR], [ParameterName.VELOCITY])
export class MultiplyColorBySpeedModule extends VFXModule {
    /**
     * @zh 颜色随速度变化的参数，各个 key 之间线性差值变化。
     */
    @type(ColorExpression)
    @serializable
    public color = new ColorExpression();

    @type(Vec2)
    @serializable
    @rangeMin(0)
    public speedRange = new Vec2(0, 1);

    private _speedScale = 0;
    private _speedOffset = 0;

    public tick (particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
        assertIsTrue(!approx(this.speedRange.x, this.speedRange.y), 'Speed Range X is so closed to Speed Range Y');
        assertIsTrue(this.color.mode === ColorExpression.Mode.GRADIENT || this.color.mode === ColorExpression.Mode.TWO_GRADIENTS, 'Color mode must be Gradient or TwoGradients');
        particles.markRequiredParameters(BuiltinParticleParameterFlags.COLOR);
        if (this.color.mode === ColorExpression.Mode.TWO_GRADIENTS) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
        this._speedScale = 1 / Math.abs(this.speedRange.x - this.speedRange.y);
        this._speedOffset = -this.speedRange.x * this._speedScale;
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const hasVelocity = particles.hasParameter(BuiltinParticleParameter.VELOCITY);
        if (!hasVelocity) { return; }
        const scale = this._speedScale;
        const offset = this._speedOffset;
        const { color, velocity } = particles;
        if (this.color.mode === ColorExpression.Mode.GRADIENT) {
            const gradient = this.color.gradient;
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.getVec3At(tempVelocity, i);
                const ratio = math.clamp01(tempVelocity.length() * scale + offset);
                color.multiplyColorAt(gradient.evaluate(tempColor, ratio), i);
            }
        } else if (this.color.mode === ColorExpression.Mode.TWO_GRADIENTS) {
            const { gradientMin, gradientMax } = this.color;
            const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.getVec3At(tempVelocity, i);
                const ratio = math.clamp01(tempVelocity.length() * scale + offset);
                color.multiplyColorAt(Color.lerp(tempColor,
                    gradientMin.evaluate(tempColor2, ratio),
                    gradientMax.evaluate(tempColor3, ratio),
                    RandomStream.getFloat(randomSeed[i] + MULTIPLY_COLOR_BY_SPEED_RAND_OFFSET)), i);
            }
        }
    }
}
