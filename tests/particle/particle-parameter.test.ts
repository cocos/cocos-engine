import { ParticleBoolParameter, ParticleColorParameter, ParticleFloatParameter, ParticleParameterType, ParticleUint32Parameter, ParticleVec3Parameter } from '../../cocos/particle/particle-parameter';

describe('ParticleVec3Parameter', () => {
    const vec3Parameter = new ParticleVec3Parameter('test');
    test('basic', () => {
        expect(vec3Parameter.name).toBe('test');
        vec3Parameter.name = 'test2';
        expect(vec3Parameter.name).toBe('test2');
        vec3Parameter.name = 'test';
        expect(vec3Parameter.name).toBe('test');
        expect(vec3Parameter.type).toBe(ParticleParameterType.VEC3);
    });
    
    test('capacity', () => {
        expect(vec3Parameter.capacity).toBe(16);
        expect(vec3Parameter.data).toBeTruthy();
        expect(vec3Parameter.data.length).toBe(16 * 3);
        vec3Parameter.reserve(32);
        expect(vec3Parameter.capacity).toBe(32);
        expect(vec3Parameter.data.length).toBe(32 * 3);
    });
});

describe('ParticleFloatParameter', () => {
    const floatParameter = new ParticleFloatParameter('test');
    test('basic', () => {
        expect(floatParameter.name).toBe('test');
        floatParameter.name = 'test2';
        expect(floatParameter.name).toBe('test2');
        floatParameter.name = 'test';
        expect(floatParameter.name).toBe('test');
        expect(floatParameter.type).toBe(ParticleParameterType.FLOAT);
    });
    
    test('capacity', () => {
        expect(floatParameter.capacity).toBe(16);
        expect(floatParameter.data).toBeTruthy();
        expect(floatParameter.data.length).toBe(16);
        floatParameter.reserve(32);
        expect(floatParameter.capacity).toBe(32);
        expect(floatParameter.data.length).toBe(32);
    });
});

describe('ParticleUint32Parameter', () => {
    const uint32Parameter = new ParticleUint32Parameter('test');
    test('basic', () => {
        expect(uint32Parameter.name).toBe('test');
        uint32Parameter.name = 'test2';
        expect(uint32Parameter.name).toBe('test2');
        uint32Parameter.name = 'test';
        expect(uint32Parameter.name).toBe('test');
        expect(uint32Parameter.type).toBe(ParticleParameterType.UINT32);
    });
    
    test('capacity', () => {
        expect(uint32Parameter.capacity).toBe(16);
        expect(uint32Parameter.data).toBeTruthy();
        expect(uint32Parameter.data.length).toBe(16);
        uint32Parameter.reserve(32);
        expect(uint32Parameter.capacity).toBe(32);
        expect(uint32Parameter.data.length).toBe(32);
    });
});

describe('ParticleBoolParameter', () => {
    const boolParameter = new ParticleBoolParameter('test');
    test('basic', () => {
        expect(boolParameter.name).toBe('test');
        boolParameter.name = 'test2';
        expect(boolParameter.name).toBe('test2');
        boolParameter.name = 'test';
        expect(boolParameter.name).toBe('test');
        expect(boolParameter.type).toBe(ParticleParameterType.BOOL);
    });
    
    test('capacity', () => {
        expect(boolParameter.capacity).toBe(16);
        expect(boolParameter.data).toBeTruthy();
        expect(boolParameter.data.length).toBe(16);
        boolParameter.reserve(32);
        expect(boolParameter.capacity).toBe(32);
        expect(boolParameter.data.length).toBe(32);
    });
});

describe('ParticleColorParameter', () => {
    const colorParameter = new ParticleColorParameter('test');
    test('basic', () => {
        expect(colorParameter.name).toBe('test');
        colorParameter.name = 'test2';
        expect(colorParameter.name).toBe('test2');
        colorParameter.name = 'test';
        expect(colorParameter.name).toBe('test');
        expect(colorParameter.type).toBe(ParticleParameterType.COLOR);
    });
    
    test('capacity', () => {
        expect(colorParameter.capacity).toBe(16);
        expect(colorParameter.data).toBeTruthy();
        expect(colorParameter.data.length).toBe(16);
        colorParameter.reserve(32);
        expect(colorParameter.capacity).toBe(32);
        expect(colorParameter.data.length).toBe(32);
    });
});

