import { lerp, Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { ConstantVec3Expression } from './constant-vec3';
import { Vec3Expression } from './vec3';

const temp = new Vec3();
const tempRatio = new Vec3();

@ccclass('cc.RandomRangeVec3')
export class RandomRangeVec3 extends Vec3Expression {
    @type(Vec3Expression)
    @serializable
    public maximum: Vec3Expression = new ConstantVec3Expression(Vec3.ZERO);

    @type(Vec3Expression)
    @serializable
    public minimum: Vec3Expression = new ConstantVec3Expression(Vec3.ZERO);

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

    public evaluate (index: number, out: Vec3) {
        this.minimum.evaluate(index, out);
        this.maximum.evaluate(index, temp);
        const ratio = RandomStream.get3Float(this._seed[index] + this._randomOffset, tempRatio);
        out.x = lerp(out.x, temp.x, ratio.x);
        out.y = lerp(out.y, temp.y, ratio.y);
        out.z = lerp(out.z, temp.z, ratio.z);
        return out;
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext, out: Vec3) {
        this.minimum.evaluateSingle(time, randomStream, context, out);
        this.maximum.evaluateSingle(time, randomStream, context, temp);
        out.x = lerp(out.x, temp.x, randomStream.getFloat());
        out.y = lerp(out.y, temp.y, randomStream.getFloat());
        out.z = lerp(out.z, temp.z, randomStream.getFloat());
        return out;
    }
}
