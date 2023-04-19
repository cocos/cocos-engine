import { Enum, RealCurve, Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { ParticleDataSet } from '../particle-data-set';
import { ModuleExecStage } from '../particle-module';
import { RandomStream } from '../random-stream';
import { ConstantExpression } from './constant';
import { ConstantVec3Expression } from './constant-vec3';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

const temp = new Vec3();

export enum Vec3Channel {
    X,
    Y,
    Z,
}

@ccclass('cc.MakeFloatFromVec3Expression')
export class MakeFloatFromVec3Expression extends FloatExpression {
    @type(Vec3Expression)
    @serializable
    public vec3 = new ConstantVec3Expression();

    @type(Enum(Vec3Channel))
    @serializable
    public channel = Vec3Channel.X;

    public get isConstant (): boolean {
        return this.vec3.isConstant;
    }

    private _getChannel = this._getX;

    private _getX (vec3: Vec3) {
        return vec3.x;
    }

    private _getY (vec3: Vec3) {
        return vec3.y;
    }

    private _getZ (vec3: Vec3) {
        return vec3.z;
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        this.vec3.tick(particles, params, context);
        switch (this.channel) {
        case Vec3Channel.X: this._getChannel = this._getX; break;
        case Vec3Channel.Y: this._getChannel = this._getY; break;
        case Vec3Channel.Z: this._getChannel = this._getZ; break;
        default: this._getChannel = this._getX; break;
        }
    }

    public bind (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, randomOffset: number) {
        this.vec3.bind(particles, params, context, randomOffset);
    }

    public evaluate (index: number): number {
        this.vec3.evaluate(index, temp);
        return this._getChannel(temp);
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext): number {
        this.vec3.evaluateSingle(time, randomStream, context, temp);
        switch (this.channel) {
        case Vec3Channel.X: return temp.x;
        case Vec3Channel.Y: return temp.y;
        case Vec3Channel.Z: return temp.z;
        default: return temp.x;
        }
    }
}
