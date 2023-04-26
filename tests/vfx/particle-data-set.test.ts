
import { VFXParameterType } from '../../cocos/vfx/enum';
import { BuiltinParticleParameter, builtinParticleParameterIdentities } from '../../cocos/vfx/particle-data-set';
import { ParticleDataSet } from '../../cocos/vfx/particle-data-set';
import { BoolArrayParameter, ColorArrayParameter, FloatArrayParameter, VFXParameterIdentity, Uint32ArrayParameter, Vec3ArrayParameter } from '../../cocos/vfx/vfx-parameter';

describe('particle-data-set', () => {
    
    test('capacity', () => {
        const particles = new ParticleDataSet();
        expect(particles.capacity).toBe(16);
        expect(particles.count).toBe(0);
        particles.reserve(100);
        expect(particles.capacity).toBe(100);
        expect(particles.count).toBe(0);
        particles.reserve(10);
        expect(particles.capacity).toBe(100);
        expect(particles.count).toBe(0);
    });

    test('particle', () => {
        const particles = new ParticleDataSet();
        expect(particles.count).toBe(0);
        expect(() => particles.addParticles(-1)).toThrowError();
        particles.addParticles(5);
        expect(particles.count).toBe(5);
        expect(particles.capacity).toBe(16);
        particles.addParticles(15);
        expect(particles.count).toBe(20);
        expect(particles.capacity).toBe(32);
        particles.addParticles(16);
        expect(particles.count).toBe(36);
        expect(particles.capacity).toBe(64);
        particles.addParameter(0, VFXParameterType.FLOAT);
        particles.addParameter(1, VFXParameterType.FLOAT);
        const parameter0 = particles.getParameter(0);
        const parameter1 = particles.getParameter(1);
        expect(parameter0?.capacity).toBe(64);
        expect(parameter1?.capacity).toBe(64);
        particles.addParticles(40);
        expect(particles.count).toBe(76);
        expect(particles.capacity).toBe(128);
        expect(parameter0?.capacity).toBe(128);
        expect(parameter1?.capacity).toBe(128);

        for (let i = 0; i < 76; i++) {
            (parameter0 as FloatArrayParameter).setFloatAt(i, i);
            (parameter1 as FloatArrayParameter).setFloatAt(i * 2, i);
        }

        expect(() => particles.removeParticle(-1)).toThrowError();
        expect(() => particles.removeParticle(77)).toThrowError();

        particles.removeParticle(0);
        expect(particles.count).toBe(75);
        expect(particles.capacity).toBe(128);
        expect(parameter0?.capacity).toBe(128);
        expect(parameter1?.capacity).toBe(128);
        expect((parameter0 as FloatArrayParameter).getFloatAt(0)).toBe(75);
        expect((parameter1 as FloatArrayParameter).getFloatAt(0)).toBe(150);
        for (let i = 1; i < 75; i++) {
            expect((parameter0 as FloatArrayParameter).getFloatAt(i)).toBe(i);
            expect((parameter1 as FloatArrayParameter).getFloatAt(i)).toBe(i * 2);
        }
        particles.removeParticle(74);
        expect(particles.count).toBe(74);
        expect(particles.capacity).toBe(128);
        expect(parameter0?.capacity).toBe(128);
        expect(parameter1?.capacity).toBe(128);
        expect((parameter0 as FloatArrayParameter).getFloatAt(0)).toBe(75);
        expect((parameter1 as FloatArrayParameter).getFloatAt(0)).toBe(150);
        for (let i = 1; i < 74; i++) {
            expect((parameter0 as FloatArrayParameter).getFloatAt(i)).toBe(i);
            expect((parameter1 as FloatArrayParameter).getFloatAt(i)).toBe(i * 2);
        }
        particles.clear();
        expect(particles.count).toBe(0);
        expect(particles.capacity).toBe(128);
        expect(parameter0?.capacity).toBe(128);
        expect(parameter1?.capacity).toBe(128);
        expect(() => particles.removeParticle(0)).toThrowError();
    });
    
    test('parameter', () => {
        const particles = new ParticleDataSet();
        const customId1 = 31;
        const customId2 = 30;
        expect(particles.parameterCount).toBe(0);
        expect(() => particles.hasParameter(32)).toThrowError();
        expect(() => particles.hasParameter(29)).not.toThrowError();
        expect(() => particles.hasParameter(-1)).toThrowError();
        expect(() => particles.addParameter(32, VFXParameterType.FLOAT)).toThrowError();
        expect(() => particles.addParameter(-1, VFXParameterType.FLOAT)).toThrowError();
        expect(() => particles.getParameter(32)).toThrowError();
        expect(() => particles.getParameter(-1)).toThrowError();
        expect(() => particles.getParameterUnsafe(32)).toThrowError();
        expect(() => particles.getParameterUnsafe(-1)).toThrowError();
        expect(() => particles.removeParameter(32)).toThrowError();
        expect(() => particles.removeParameter(-1)).toThrowError();
        expect(particles.hasParameter(customId1)).toBeFalsy();
        expect(particles.hasParameter(customId2)).toBeFalsy();
        expect(particles.getParameter(customId1)).toBeFalsy();
        expect(particles.getParameter(customId2)).toBeFalsy();
        expect(() => particles.getParameterUnsafe(customId1)).toThrowError();
        expect(() => particles.getParameterUnsafe(customId2)).toThrowError();
        particles.addParameter(customId1, VFXParameterType.FLOAT);
        expect(particles.parameterCount).toBe(1);
        expect(particles.hasParameter(customId1)).toBeTruthy();
        const parameter = particles.getParameter(customId1);
        expect(parameter?.capacity).toBe(16);
        expect(parameter).toBeTruthy();
        expect(parameter).toBeInstanceOf(FloatArrayParameter);
        expect(particles.getParameterUnsafe(customId1)).toBe(parameter);
        expect(() => particles.addParameter(customId1, VFXParameterType.FLOAT)).toThrowError();
        particles.addParameter(customId2, VFXParameterType.VEC3);
        expect(particles.hasParameter(customId2)).toBeTruthy();
        const parameter2 = particles.getParameter(customId2);
        expect(parameter2).toBeTruthy();
        expect(parameter2).toBeInstanceOf(Vec3ArrayParameter);
        expect(parameter2).toBe(particles.getParameterUnsafe(customId2));
        expect(parameter2?.capacity).toBe(16);
        expect(particles.parameterCount).toBe(2);
        particles.reserve(50);
        expect(parameter?.capacity).toBe(50);
        expect(parameter2?.capacity).toBe(50);
        expect(() => particles.addParameter(customId2, VFXParameterType.VEC3)).toThrowError();
        expect(() => particles.addParameter(customId2, VFXParameterType.FLOAT)).toThrowError();
        particles.removeParameter(customId1);
        expect(particles.parameterCount).toBe(1);
        expect(particles.hasParameter(customId1)).toBeFalsy();
        expect(particles.getParameter(customId1)).toBeFalsy();
        expect(() => particles.getParameterUnsafe(customId1)).toThrowError();
        particles.removeParameter(customId2);
        expect(particles.parameterCount).toBe(0);
        expect(particles.hasParameter(customId2)).toBeFalsy();
        expect(particles.getParameter(customId2)).toBeFalsy();
        expect(() => particles.getParameterUnsafe(customId2)).toThrowError();
        particles.reserve(100);
        particles.addParameter(customId1, VFXParameterType.BOOL);
        expect(particles.parameterCount).toBe(1);
        expect(particles.hasParameter(customId1)).toBeTruthy();
        const parameter3 = particles.getParameter(customId1);
        expect(parameter3).toBeTruthy();
        expect(parameter3).toBeInstanceOf(BoolArrayParameter);
        expect(parameter3).toBe(particles.getParameterUnsafe(customId1));
        expect(parameter3?.capacity).toBe(100);
        particles.addParameter(customId2, VFXParameterType.COLOR);
        expect(particles.hasParameter(customId2)).toBeTruthy();
        const parameter4 = particles.getParameter(customId2);
        expect(parameter4).toBeTruthy();
        expect(parameter4).toBeInstanceOf(ColorArrayParameter);
        expect(parameter4).toBe(particles.getParameterUnsafe(customId2));
        expect(parameter4?.capacity).toBe(100);
        expect(particles.parameterCount).toBe(2);
        expect(() => particles.addParameter(customId2, VFXParameterType.COLOR)).toThrowError();
        expect(() => particles.addParameter(customId2, VFXParameterType.BOOL)).toThrowError();
        particles.reserve(200);
        expect(parameter3?.capacity).toBe(200);
        expect(parameter4?.capacity).toBe(200);
        particles.removeParameter(customId1);
        expect(particles.parameterCount).toBe(1);
        expect(particles.hasParameter(customId1)).toBeFalsy();
        expect(particles.getParameter(customId1)).toBeFalsy();
        expect(() => particles.getParameterUnsafe(customId1)).toThrowError();
        particles.removeParameter(customId2);
        expect(particles.parameterCount).toBe(0);
        expect(particles.hasParameter(customId2)).toBeFalsy();
        expect(particles.getParameter(customId2)).toBeFalsy();
        expect(() => particles.getParameterUnsafe(customId2)).toThrowError();
    });

    test('ensure parameters', () => {
        const particles = new ParticleDataSet();
        const identities = [
            new VFXParameterIdentity(31, 'test', VFXParameterType.FLOAT),
            new VFXParameterIdentity(30, 'test2', VFXParameterType.VEC3),
            new VFXParameterIdentity(29, 'test3', VFXParameterType.COLOR),
            new VFXParameterIdentity(28, 'test4', VFXParameterType.BOOL),
            new VFXParameterIdentity(27, 'test5', VFXParameterType.UINT32),
        ];
        expect(particles.parameterCount).toBe(0);
        let requiredParameters = 1 << 31 | 1 << 29 | 1 << 27;
        particles.markRequiredParameters(requiredParameters);
        particles.ensureParameters(identities);
        expect(particles.parameterCount).toBe(3);
        expect(particles.hasParameter(31)).toBeTruthy();
        expect(particles.hasParameter(29)).toBeTruthy();
        expect(particles.hasParameter(27)).toBeTruthy();
        expect(particles.hasParameter(30)).toBeFalsy();
        expect(particles.hasParameter(28)).toBeFalsy();
        const parameter1 = particles.getParameter(31);
        const parameter2 = particles.getParameter(29);
        const parameter3 = particles.getParameter(27);
        expect(parameter1).toBeInstanceOf(FloatArrayParameter);
        expect(parameter2).toBeInstanceOf(ColorArrayParameter);
        expect(parameter3).toBeInstanceOf(Uint32ArrayParameter);

        particles.clearRequiredParameters();
        requiredParameters = 1 << 31 | 1 << 30 | 1 << 28;
        particles.markRequiredParameters(requiredParameters);
        particles.ensureParameters(identities);
        expect(particles.parameterCount).toBe(3);
        expect(particles.hasParameter(31)).toBeTruthy();
        expect(particles.hasParameter(30)).toBeTruthy();
        expect(particles.hasParameter(28)).toBeTruthy();
        expect(particles.hasParameter(29)).toBeFalsy();
        expect(particles.hasParameter(27)).toBeFalsy();
        expect(particles.getParameter(31)).toBe(parameter1);
        expect(particles.getParameter(30)).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.getParameter(28)).toBeInstanceOf(BoolArrayParameter);
        expect(particles.getParameter(29)).toBeFalsy();
        expect(particles.getParameter(27)).toBeFalsy();

        particles.clearRequiredParameters();
        particles.ensureParameters(identities);
        expect(particles.parameterCount).toBe(0);
        expect(particles.hasParameter(31)).toBeFalsy();
        expect(particles.hasParameter(30)).toBeFalsy();
        expect(particles.hasParameter(29)).toBeFalsy();
        expect(particles.hasParameter(28)).toBeFalsy();
        expect(particles.hasParameter(27)).toBeFalsy();

        let requiredParameters2 = 1 << 1 | 1 << 2 | 1 << 3;
        particles.markRequiredParameters(requiredParameters2);
        particles.ensureParameters(identities);
        expect(particles.parameterCount).toBe(0);
        expect(particles.hasParameter(31)).toBeFalsy();
        expect(particles.hasParameter(30)).toBeFalsy();
        expect(particles.hasParameter(29)).toBeFalsy();
        expect(particles.hasParameter(28)).toBeFalsy();
        expect(particles.hasParameter(27)).toBeFalsy();
        expect(particles.hasParameter(1)).toBeFalsy();
        expect(particles.hasParameter(2)).toBeFalsy();
        expect(particles.hasParameter(3)).toBeFalsy();
    });

    test('builtin parameter', () => {
        const particles = new ParticleDataSet();
        expect(particles.parameterCount).toBe(0);
        expect(() => particles.position).toThrowError();
        expect(() => particles.velocity).toThrowError();
        expect(() => particles.id).toThrowError();
        expect(() => particles.randomSeed).toThrowError();
        expect(() => particles.color).toThrowError();
        expect(() => particles.scale).toThrowError();
        expect(() => particles.rotation).toThrowError();
        expect(() => particles.normalizedAge).toThrowError();
        expect(() => particles.invStartLifeTime).toThrowError();
        expect(() => particles.baseColor).toThrowError();
        expect(() => particles.baseScale).toThrowError();
        expect(() => particles.baseVelocity).toThrowError();
        expect(() => particles.initialDir).toThrowError();
        expect(() => particles.subUVIndex).toThrowError();
        expect(() => particles.isDead).toThrowError();
        expect(() => particles.angularVelocity).toThrowError();
        expect(() => particles.spawnTimeRatio).toThrowError();
        expect(() => particles.spawnNormalizedTime).toThrowError();
        expect(() => particles.vec3Register).toThrowError();
        expect(() => particles.floatRegister).toThrowError();

        const requiredParameters = 0xffffffff;
        particles.markRequiredParameters(requiredParameters);
        particles.ensureParameters(builtinParticleParameterIdentities);
        expect(particles.parameterCount).toBe(BuiltinParticleParameter.COUNT);
        expect(particles.position).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.velocity).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.id).toBeInstanceOf(Uint32ArrayParameter);
        expect(particles.randomSeed).toBeInstanceOf(Uint32ArrayParameter);
        expect(particles.color).toBeInstanceOf(ColorArrayParameter);
        expect(particles.scale).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.rotation).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.normalizedAge).toBeInstanceOf(FloatArrayParameter);
        expect(particles.invStartLifeTime).toBeInstanceOf(FloatArrayParameter);
        expect(particles.baseColor).toBeInstanceOf(ColorArrayParameter);
        expect(particles.baseScale).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.baseVelocity).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.initialDir).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.subUVIndex).toBeInstanceOf(FloatArrayParameter);
        expect(particles.isDead).toBeInstanceOf(BoolArrayParameter);
        expect(particles.angularVelocity).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.spawnTimeRatio).toBeInstanceOf(FloatArrayParameter);
        expect(particles.spawnNormalizedTime).toBeInstanceOf(FloatArrayParameter);
        expect(particles.vec3Register).toBeInstanceOf(Vec3ArrayParameter);
        expect(particles.floatRegister).toBeInstanceOf(FloatArrayParameter);
    });
    
});