import { RealCurve } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { ModuleExecStage } from '../particle-module';
import { RandomStream } from '../random-stream';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';

@ccclass('cc.FloatFromCurveExpression')
export class FloatFromCurveExpression extends FloatExpression {
    @type(RealCurve)
    @serializable
    public curve = new RealCurve();

    @type(FloatExpression)
    @serializable
    public scale: FloatExpression = new ConstantFloatExpression(1);

    public get isConstant (): boolean {
        return false;
    }

    private declare _time: Float32Array;

    constructor (curve?: RealCurve) {
        super();
        if (curve) {
            this.curve = curve;
        }
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredBuiltinParameters(context.executionStage === ModuleExecStage.UPDATE
            ? BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME : BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
        this.scale.tick(particles, params, context);
    }

    public bind (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, randomOffset: number) {
        this._time = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
        this.scale.bind(particles, params, context, randomOffset);
    }

    public evaluate (index: number): number {
        return this.curve.evaluate(this._time[index]) * this.scale.evaluate(index);
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext): number {
        return this.curve.evaluate(time) * this.scale.evaluateSingle(time, randomStream, context);
    }
}
