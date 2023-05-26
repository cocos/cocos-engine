import { DEBUG } from 'internal:constants';
import { BoolParameter, ColorParameter, FloatParameter, Int32Parameter, Mat3Parameter, Mat4Parameter, QuatParameter, Uint32Parameter, Uint8Parameter, Vec2Parameter, Vec3Parameter, Vec4Parameter, VFXDataSet, VFXParameter, VFXParameterIdentity } from '../../exports/vfx';
import { assertIsTrue } from '../core';
import { VFXParameterNameSpace, VFXParameterType } from './define';

export const CUSTOM_USER_PARAMETER_ID = 40000;
export class UserDataSet extends VFXDataSet {
    constructor () {
        super(VFXParameterNameSpace.USER);
    }

    getFloatParameter (identity: VFXParameterIdentity): FloatParameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.FLOAT);
        }
        return this.getParameterUnsafe<FloatParameter>(identity);
    }

    getVec2Parameter (identity: VFXParameterIdentity): Vec2Parameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.VEC2);
        }
        return this.getParameterUnsafe<Vec2Parameter>(identity);
    }

    getVec3Parameter (identity: VFXParameterIdentity): Vec3Parameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.VEC3);
        }
        return this.getParameterUnsafe<Vec3Parameter>(identity);
    }

    getBoolParameter (identity: VFXParameterIdentity): BoolParameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.BOOL);
        }
        return this.getParameterUnsafe<BoolParameter>(identity);
    }

    getUint32Parameter (identity: VFXParameterIdentity): Uint32Parameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.UINT32);
        }
        return this.getParameterUnsafe<Uint32Parameter>(identity);
    }

    getQuatParameter (identity: VFXParameterIdentity): QuatParameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.QUAT);
        }
        return this.getParameterUnsafe<QuatParameter>(identity);
    }

    getMat3Parameter (identity: VFXParameterIdentity): Mat3Parameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.MAT3);
        }
        return this.getParameterUnsafe<Mat3Parameter>(identity);
    }

    getMat4Parameter (identity: VFXParameterIdentity): Mat4Parameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.MAT4);
        }
        return this.getParameterUnsafe<Mat4Parameter>(identity);
    }

    protected doAddParameter (identity: VFXParameterIdentity) {
        switch (identity.type) {
        case VFXParameterType.FLOAT:
            this.addParameter_internal(identity.id, new FloatParameter());
            break;
        case VFXParameterType.VEC3:
            this.addParameter_internal(identity.id, new Vec3Parameter());
            break;
        case VFXParameterType.COLOR:
            this.addParameter_internal(identity.id, new ColorParameter());
            break;
        case VFXParameterType.UINT32:
            this.addParameter_internal(identity.id, new Uint32Parameter());
            break;
        case VFXParameterType.BOOL:
            this.addParameter_internal(identity.id, new BoolParameter());
            break;
        case VFXParameterType.VEC2:
            this.addParameter_internal(identity.id, new Vec2Parameter());
            break;
        case VFXParameterType.VEC4:
            this.addParameter_internal(identity.id, new Vec4Parameter());
            break;
        case VFXParameterType.INT32:
            this.addParameter_internal(identity.id, new Int32Parameter());
            break;
        case VFXParameterType.UINT8:
            this.addParameter_internal(identity.id, new Uint8Parameter());
            break;
        case VFXParameterType.QUAT:
            this.addParameter_internal(identity.id, new QuatParameter());
            break;
        case VFXParameterType.MAT3:
            this.addParameter_internal(identity.id, new Mat3Parameter());
            break;
        case VFXParameterType.MAT4:
            this.addParameter_internal(identity.id, new Mat4Parameter());
            break;
        default:
            throw new Error('Does not support these parameter type in this data set!');
        }
    }

    protected doRemoveParameter (parameter: VFXParameter) {
    }
}
