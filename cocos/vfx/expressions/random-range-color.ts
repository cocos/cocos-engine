import { Color, lerp } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { ColorExpression } from './color';
import { ConstantColorExpression } from './constant-color';

const tempColor = new Color();

@ccclass('cc.RandomRangeColor')
export class RandomRangeColor extends ColorExpression {
    @type(ColorExpression)
    @serializable
    public maximum: ColorExpression = new ConstantColorExpression();

    @type(ColorExpression)
    @serializable
    public minimum: ColorExpression = new ConstantColorExpression();

    public get isConstant (): boolean {
        return false;
    }

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

    public evaluate (index: number, out: Color) {
        return Color.lerp(out, this.minimum.evaluate(index, out), this.maximum.evaluate(index, tempColor), RandomStream.getFloat(this._seed[index] + this._randomOffset));
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext, out: Color) {
        const min = this.minimum.evaluateSingle(time, randomStream, context, out);
        const max = this.maximum.evaluateSingle(time, randomStream, context, tempColor);
        return Color.lerp(out, min, max, randomStream.getFloat());
    }
}
