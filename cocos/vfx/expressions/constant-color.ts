import { Color, serializable } from '../../core';
import { type } from '../../core/data/class-decorator';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { ColorExpression } from './color';

export class ConstantColorExpression extends ColorExpression {
    @type(Color)
    @serializable
    public color = Color.WHITE.clone();

    public get isConstant () {
        return true;
    }

    constructor (val: Color = Color.WHITE.clone()) {
        super();
        this.color.set(val);
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {}
    public bind (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, randomOffset: number) {}

    public evaluate (index: number, out: Color) {
        out.set(this.color);
        return out;
    }

    public evaluateSingle (time: number, randomStream: RandomStream, context: ParticleExecContext, out: Color) {
        out.set(this.color);
        return out;
    }
}
