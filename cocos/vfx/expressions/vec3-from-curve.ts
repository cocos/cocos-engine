import { RealCurve, Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { ModuleExecStage } from '../particle-module';
import { RandomStream } from '../random-stream';
import { ConstantVec3Expression } from './constant-vec3';
import { Vec3Expression } from './vec3';

const ratio = new Vec3();

@ccclass('cc.Vec3FromCurveExpression')
export class Vec3FromCurveExpression extends Vec3Expression {
    @type(RealCurve)
    @serializable
    public x = new RealCurve();

    @type(RealCurve)
    @serializable
    public y = new RealCurve();

    @type(RealCurve)
    @serializable
    public z = new RealCurve();

    @type(Vec3Expression)
    @serializable
    public curveScaler: Vec3Expression = new ConstantVec3Expression(Vec3.ONE);

    public get isConstant (): boolean {
        return false;
    }

    private declare _time: Float32Array;

    constructor (x?: RealCurve, y?: RealCurve, z?: RealCurve) {
        super();
        if (x) {
            this.x = x;
        }
        if (y) {
            this.y = y;
        }
        if (z) {
            this.z = z;
        }
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredBuiltinParameters(context.executionStage === ModuleExecStage.UPDATE
            ? BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME : BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
        this.curveScaler.tick(particles, params, context);
    }

    public bind (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, randomOffset: number) {
        this._time = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
        this.curveScaler.bind(particles, params, context, randomOffset);
    }

    public evaluate (index: number, out: Vec3) {
        this.curveScaler.evaluate(index, ratio);
        const time = this._time[index];
        out.x = this.x.evaluate(time) * ratio.x;
        out.y = this.y.evaluate(time) * ratio.y;
        out.z = this.z.evaluate(time) * ratio.z;
        return out;
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext, out: Vec3): Vec3 {
        this.curveScaler.evaluateSingle(time, randomStream, context, out);
        out.x = this.x.evaluate(time) * ratio.x;
        out.y = this.y.evaluate(time) * ratio.y;
        out.z = this.z.evaluate(time) * ratio.z;
        return out;
    }
}
