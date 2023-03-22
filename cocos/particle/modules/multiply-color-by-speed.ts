import { ccclass, rangeMin, serializable, type } from '../../core/data/decorators';
import { GradientRange } from '../gradient-range';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleVec3Parameter } from '../particle-parameter';
import { approx, assert, Color, math, pseudoRandom, Vec3, Vec2 } from '../../core';

const tempVelocity = new Vec3();
const tempColor = new Color();
const tempColor2 = new Color();
const tempColor3 = new Color();
const MULTIPLY_COLOR_BY_SPEED_RAND_OFFSET = 27382;

@ccclass('cc.MultiplyColorBySpeed')
@ParticleModule.register('MultiplyColorBySpeed', ModuleExecStage.UPDATE, 22)
export class MultiplyColorBySpeedModule extends ParticleModule {
    /**
     * @zh 颜色随速度变化的参数，各个 key 之间线性差值变化。
     */
    @type(GradientRange)
    @serializable
    public color = new GradientRange();

    @type(GradientRange)
    @serializable
    @rangeMin(0)
    public speedRange = new Vec2(0, 1);

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.COLOR);
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex } = context;
        assert(!approx(this.speedRange.x, this.speedRange.y), 'Speed Range X is so closed to Speed Range Y');
        const scale = 1 / Math.abs(this.speedRange.x - this.speedRange.y);
        const offset = -this.speedRange.x * scale;
        const { color } = particles;
        const hasVelocity = particles.hasParameter(BuiltinParticleParameter.VELOCITY);
        const hasAnimatedVelocity = particles.hasParameter(BuiltinParticleParameter.ANIMATED_VELOCITY);
        if (!hasVelocity && !hasAnimatedVelocity) { return; }
        if (this.color.mode === GradientRange.Mode.Gradient) {
            const gradient = this.color.gradient;
            for (let i = fromIndex; i < toIndex; i++) {
                ParticleVec3Parameter.addSingle(tempVelocity, velocity, animatedVelocity, i);
                const ratio = math.clamp01(tempVelocity.length() * scale + offset);
                color.multiplyColorAt(gradient.evaluate(tempColor, ratio), i);
            }
        } else if (this.color.mode === GradientRange.Mode.TwoGradients) {
            const { gradientMin, gradientMax } = this.color;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                ParticleVec3Parameter.addSingle(tempVelocity, velocity, animatedVelocity, i);
                const ratio = math.clamp01(tempVelocity.length() * scale + offset);
                color.multiplyColorAt(Color.lerp(tempColor,
                    gradientMin.evaluate(tempColor2, ratio),
                    gradientMax.evaluate(tempColor3, ratio),
                    pseudoRandom(randomSeed[i] + MULTIPLY_COLOR_BY_SPEED_RAND_OFFSET)), i);
            }
        }
    }
}
