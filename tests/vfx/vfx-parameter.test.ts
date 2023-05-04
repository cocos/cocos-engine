import { Vec3 } from '../../cocos/core';
import { ParameterNameSpace, VFXParameterType } from '../../cocos/vfx/enum';
import { BATCH_OPERATION_THRESHOLD_VEC3, BoolArrayParameter, ColorArrayParameter, FloatArrayParameter, Uint32ArrayParameter, Vec3ArrayParameter, VFXParameterIdentity } from '../../cocos/vfx/vfx-parameter';
import { RandomStream } from '../../cocos/vfx/random-stream';

describe('VFXParameterIdentity', () => {
    test('basic', () => {
        const parameter = new VFXParameterIdentity(0, 'test', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
        expect(parameter.id).toBe(0);
        expect(parameter.name).toBe('test');
        expect(parameter.type).toBe(VFXParameterType.FLOAT);
        expect(parameter.namespace).toBe(ParameterNameSpace.PARTICLE);
        parameter.name = 'test2';
        expect(parameter.name).toBe('test2');
        const parameter2 = new VFXParameterIdentity(1, 'test', VFXParameterType.COLOR, ParameterNameSpace.EMITTER);
    });
});

