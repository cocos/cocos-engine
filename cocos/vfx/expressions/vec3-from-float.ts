import { Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

const ratio = new Vec3();

@ccclass('cc.Vec3FromFloatExpression')
export class Vec3FromFloatExpression extends Vec3Expression {
    @type(FloatExpression)
    @serializable
    public value: FloatExpression = new ConstantFloatExpression();

    public get isConstant (): boolean {
        return this.value.isConstant;
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        this.value.tick(particles, params, context);
    }

    public bind (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, randomOffset: number) {
        this.value.bind(particles, params, context, randomOffset);
    }

    public evaluate (index: number, out: Vec3) {
        const val = this.value.evaluate(index);
        out.x = val;
        out.y = val;
        out.z = val;
        return out;
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext, out: Vec3): Vec3 {
        const val = this.value.evaluateSingle(time, randomStream, context);
        out.x = val;
        out.y = val;
        out.z = val;
        return out;
    }
}
