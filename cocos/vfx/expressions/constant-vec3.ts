import { CCFloat, Vec3, serializable } from '../../core';
import { ccclass, type } from '../../core/data/class-decorator';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { Vec3Expression } from './vec3';

@ccclass('cc.ConstantVec3')
export class ConstantVec3Expression extends Vec3Expression {
    @type(CCFloat)
    @serializable
    public x = 0;

    @type(CCFloat)
    @serializable
    public y = 0;

    @type(CCFloat)
    @serializable
    public z = 0;

    public get isConstant (): boolean {
        return true;
    }

    constructor (val: Vec3 = Vec3.ZERO) {
        super();
        this.x = val.x;
        this.y = val.y;
        this.z = val.z;
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {}
    public bind (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, randomOffset: number) {}

    public evaluate (index: number, out: Vec3) {
        out.x = this.x;
        out.y = this.y;
        out.z = this.z;
        return out;
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext, out: Vec3) {
        out.x = this.x;
        out.y = this.y;
        out.z = this.z;
        return out;
    }
}
