import { CCFloat, Vec3, serializable } from '../../core';
import { ccclass, type } from '../../core/data/class-decorator';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

@ccclass('cc.MakeVec3Expression')
export class MakeVec3Expression extends Vec3Expression {
    @type(FloatExpression)
    @serializable
    public x: FloatExpression = new ConstantFloatExpression();

    @type(CCFloat)
    @serializable
    public y: FloatExpression = new ConstantFloatExpression();

    @type(CCFloat)
    @serializable
    public z: FloatExpression = new ConstantFloatExpression();

    public get isConstant (): boolean {
        return this.x.isConstant && this.y.isConstant && this.z.isConstant;
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        this.x.tick(particles, params, context);
        this.y.tick(particles, params, context);
        this.z.tick(particles, params, context);
    }
    public bind (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, randomOffset: number) {
        this.x.bind(particles, params, context, randomOffset);
        this.y.bind(particles, params, context, randomOffset);
        this.z.bind(particles, params, context, randomOffset);
    }

    public evaluate (index: number, out: Vec3) {
        out.x = this.x.evaluate(index);
        out.y = this.y.evaluate(index);
        out.z = this.z.evaluate(index);
        return out;
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext, out: Vec3) {
        out.x = this.x.evaluateSingle(time, randomStream, context);
        out.y = this.y.evaluateSingle(time, randomStream, context);
        out.z = this.z.evaluateSingle(time, randomStream, context);
        return out;
    }
}
