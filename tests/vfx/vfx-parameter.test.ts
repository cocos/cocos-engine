import { ParameterNameSpace } from '../../cocos/vfx';
import { VFXValueType, ParameterNameSpace } from '../../cocos/vfx/define';
import { VFXParameterDecl } from '../../cocos/vfx/vfx-parameter';

describe('VFXParameterDecl', () => {
    test('basic', () => {
        const parameter = new VFXParameterDecl(0, 'test', VFXValueType.FLOAT, ParameterNameSpace.PARTICLE);
        expect(parameter.id).toBe(0);
        expect(parameter.name).toBe('test');
        expect(parameter.type).toBe(VFXValueType.FLOAT);
        expect(parameter.namespace).toBe(ParameterNameSpace.PARTICLE);
        parameter.name = 'test2';
        expect(parameter.name).toBe('test2');
        const parameter2 = new VFXParameterDecl(1, 'test', VFXValueType.COLOR, ParameterNameSpace.EMITTER);
    });
});

