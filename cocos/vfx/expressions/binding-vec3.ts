import { ccclass } from '../../core/data/decorators';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { ParameterNameSpace } from '../define';
import { ParticleDataSet } from '../particle-data-set';
import { UserDataSet } from '../user-data-set';
import { Vec3Expression } from './vec3';
import { VFXParameterIdentity } from '../vfx-parameter';
import { Vec3ArrayParameter } from '../parameters';
import { Vec3 } from '../../core';

@ccclass('cc.BindingVec3Expression')
export class BindingVec3Expression extends Vec3Expression {
    private _bindParameterId: VFXParameterIdentity | null = null;
    private declare _data: Vec3ArrayParameter;
    private _constant = new Vec3();
    private _getVec3 = this._getConstant;

    public get isConstant (): boolean {
        return !this._bindParameterId || this._bindParameterId.namespace !== ParameterNameSpace.PARTICLE;
    }

    private _getConstant (index: number, out: Vec3): Vec3 {
        Vec3.copy(out, this._constant);
        return this._constant;
    }

    private _getVec3At (index: number, out: Vec3): Vec3 {
        return this._data.getVec3At(out, index);
    }

    constructor (vfxParameterIdentity: VFXParameterIdentity) {
        super();
        this._bindParameterId = vfxParameterIdentity;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (this._bindParameterId?.namespace === ParameterNameSpace.PARTICLE) {
            particles.markRequiredParameter(this._bindParameterId);
        }
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (this._bindParameterId?.namespace === ParameterNameSpace.PARTICLE) {
            this._data = particles.getVec3Parameter(this._bindParameterId);
            this._getVec3 = this._getVec3At;
        } else {
            this._getVec3 = this._getConstant;
        }
    }

    public evaluateSingle (out: Vec3): Vec3 {
        return this._getVec3(0, out);
    }

    public evaluate (index: number, out: Vec3): Vec3 {
        return this._getVec3(index, out);
    }
}
