import { DEBUG } from 'internal:constants';
import { assertIsTrue } from '../core';
import { VFXParameterNameSpace, VFXParameterType } from './define';
import { BoolParameter, ColorParameter, FloatParameter, Int32Parameter, Mat3Parameter, Mat4Parameter, QuatParameter, Uint32Parameter, Uint8Parameter, Vec2Parameter, Vec3Parameter, Vec4Parameter } from './parameters';
import { VFXParameter, VFXParameterIdentity } from './vfx-parameter';

export abstract class VFXDataSet {
    public get parameterCount () {
        return this._parameterCount;
    }
    private _parameterMap: Record<number, VFXParameter> = {};
    private _namespace = VFXParameterNameSpace.PARTICLE;
    private _parameterCount = 0;

    constructor (namespace: VFXParameterNameSpace) {
        this._namespace = namespace;
    }

    public hasParameter (identity: VFXParameterIdentity) {
        return identity.id in this._parameterMap;
    }

    protected getParameterUnsafe<T extends VFXParameter> (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(this.hasParameter(identity));
            assertIsTrue(identity.namespace === this._namespace);
        }
        return this._parameterMap[identity.id] as T;
    }

    protected addParameter_internal (id: number, parameter: VFXParameter) {
        this._parameterCount++;
        this._parameterMap[id] = parameter;
    }

    public addParameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.namespace === VFXParameterNameSpace.PARTICLE);
        }
        if (this.hasParameter(identity)) {
            throw new Error('Already exist a particle parameter with same id!');
        }
        this.doAddParameter(identity);
    }

    public removeParameter (identity: VFXParameterIdentity) {
        if (!this.hasParameter(identity)) {
            return;
        }
        const parameter = this._parameterMap[identity.id];
        if (DEBUG) {
            assertIsTrue(parameter);
        }
        delete this._parameterMap[identity.id];
        this._parameterCount--;
        this.doRemoveParameter(parameter);
    }

    public reset () {
        this._parameterMap = {};
        this._parameterCount = 0;
    }

    protected abstract doAddParameter (identity: VFXParameterIdentity);
    protected abstract doRemoveParameter (parameter: VFXParameter);
}
