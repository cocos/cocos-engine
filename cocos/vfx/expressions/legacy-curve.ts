import { RealCurve, serializable } from '../../core';
import { type } from '../../core/data/decorators';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { NORMALIZED_AGE, ParticleDataSet, SPAWN_NORMALIZED_TIME } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { UserDataSet } from '../user-data-set';
import { ModuleExecStage } from '../vfx-module';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';

export class LegacyCurveExpression extends FloatExpression {
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

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(context.executionStage === ModuleExecStage.UPDATE
            ? NORMALIZED_AGE : SPAWN_NORMALIZED_TIME);
        this.scale.tick(particles, emitter, user, context);
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this._time = particles.getFloatParameter(context.executionStage === ModuleExecStage.UPDATE ? NORMALIZED_AGE : SPAWN_NORMALIZED_TIME).data;
        this.scale.bind(particles, emitter, user, context);
    }

    public evaluate (index: number): number {
        return this.curve.evaluate(this._time[index]) * this.scale.evaluate(index);
    }

    public evaluateSingle (): number {
        return this.curve.evaluate(time) * this.scale.evaluateSingle();
    }
}
