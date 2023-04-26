import { ccclass } from '../../core/data/decorators';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { ParameterNameSpace } from '../define';
import { ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { UserDataSet } from '../user-data-set';
import { FloatExpression } from './float';

@ccclass('cc.BindingFloatExpression')
export class BindingFloatExpression extends FloatExpression {
    private _bindParameterId = -1;
    private _bindParameterNameSpace = ParameterNameSpace.EMITTER;
    private declare _data: Float32Array;
    private _constant = 0;
    private _getFloat = this._getConstant;

    public get isConstant (): boolean {
        return this._bindParameterNameSpace !== ParameterNameSpace.PARTICLE;
    }

    private _getConstant (index: number): number {
        return this._constant;
    }

    private _getFloatAt (index: number): number {
        return this._data[index];
    }

    constructor (bindParameterId: number, bindParameterNameSpace: ParameterNameSpace) {
        super();
        this._bindParameterId = bindParameterId;
        this._bindParameterNameSpace = bindParameterNameSpace;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (this._bindParameterNameSpace === ParameterNameSpace.PARTICLE) {
            particles.markRequiredParameter(this._bindParameterId);
        }
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (this._bindParameterNameSpace === ParameterNameSpace.PARTICLE) {
            this._data = particles.getParameterUnsafe(this._bindParameterId).data as Float32Array;
            this._getFloat = this._getFloatAt;
        } else {
            this._getFloat = this._getConstant;
        }
    }

    public evaluateSingle (): number {
        return this._getFloat(0);
    }

    public evaluate (index: number): number {
        return this._getFloat(index);
    }
}
