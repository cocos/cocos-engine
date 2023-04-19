import { Color, Gradient, serializable } from '../../core';
import { type } from '../../core/data/decorators';
import { ParticleExecContext, ParticleEmitterParams } from '../particle-base';
import { BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { ModuleExecStage } from '../particle-module';
import { RandomStream } from '../random-stream';
import { ColorExpression } from './color';

export class ColorFromCurveExpression extends ColorExpression {
    @type(Gradient)
    @serializable
    public curve = new Gradient();

    private declare _time: Float32Array;

    public get isConstant (): boolean {
        return false;
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (context.executionStage === ModuleExecStage.SPAWN) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
        } else {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME);
        }
    }

    public bind (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, randomOffset: number) {
        this._time = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
    }

    evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext, out: Color) {
        this.curve.evaluate(out, time);
        return out;
    }

    evaluate (index: number, out: Color) {
        this.curve.evaluate(out, this._time[index]);
        return out;
    }
}
