import { ccclass } from '../../core/data/decorators';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { ParameterNameSpace } from '../define';
import { ParticleDataSet } from '../particle-data-set';
import { UserDataSet } from '../user-data-set';
import { FloatExpression } from './float';
import { VFXParameterIdentity } from '../vfx-parameter';

@ccclass('cc.BindingFloatExpression')
export class BindingFloatExpression extends FloatExpression {
    get bindingParameter () {
        return this._bindingParameter;
    }

    set bindingParameter (val) {
        this._bindingParameter = val;
    }

    private _bindingParameter: VFXParameterIdentity | null = null;
    private declare _data: Float32Array;
    private _constant = 0;
    private _getFloat = this._getConstant;

    public get isConstant (): boolean {
        return this._bindingParameter?.namespace !== ParameterNameSpace.PARTICLE;
    }

    private _getConstant (index: number): number {
        return this._constant;
    }

    private _getFloatAt (index: number): number {
        return this._data[index];
    }

    constructor (vfxParameterIdentity: VFXParameterIdentity) {
        super();
        this._bindingParameter = vfxParameterIdentity;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (this._bindingParameter?.namespace === ParameterNameSpace.PARTICLE) {
            particles.markRequiredParameter(this._bindingParameter);
        }
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (this._bindingParameter?.namespace === ParameterNameSpace.PARTICLE) {
            this._data = particles.getFloatParameter(this._bindingParameter).data;
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
