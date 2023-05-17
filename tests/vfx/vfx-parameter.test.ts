import { ParameterNameSpace } from '../../cocos/vfx';
import { VFXParameterType, ParameterNameSpace } from '../../cocos/vfx/define';
import { VFXParameterIdentity } from '../../cocos/vfx/vfx-parameter';

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

