import { lerp } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { ConstantExpression } from './constant';
import { FloatExpression } from './float';

@ccclass('cc.RandomRangeFloat')
export class RandomRangeFloat extends FloatExpression {
    @type(FloatExpression)
    @serializable
    public maximum: FloatExpression = new ConstantExpression(0);

    @type(FloatExpression)
    @serializable
    public minimum: FloatExpression = new ConstantExpression(0);

    private declare _seed: Uint32Array;
    private _randomOffset = 0;

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        this.maximum.tick(particles, params, context);
        this.minimum.tick(particles, params, context);
        context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
    }

    public bind (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, randomOffset: number) {
        this.maximum.bind(particles, params, context, randomOffset);
        this.minimum.bind(particles, params, context, randomOffset);
        this._seed = particles.randomSeed.data;
        this._randomOffset = randomOffset;
    }

    public evaluate (index: number): number {
        return lerp(this.minimum.evaluate(index), this.maximum.evaluate(index), RandomStream.getFloat(this._seed[index] + this._randomOffset));
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext): number {
        const min = this.minimum.evaluateSingle(time, randomStream, context);
        const max = this.maximum.evaluateSingle(time, randomStream, context);
        return lerp(min, max, randomStream.getFloat());
    }
}
