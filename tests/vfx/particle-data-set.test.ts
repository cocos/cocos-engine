
import { ParticleDataSet } from '../../cocos/vfx/particle-data-set';
import { ParticleFloatArrayParameter, ParticleParameterType } from '../../cocos/vfx/particle-parameter';

describe('particle-data-set', () => {
    
    test('capacity', () => {
        const particles = new ParticleDataSet();
        expect(particles.capacity).toBe(16);
        expect(particles.count).toBe(0);
        particles.reserve(100);
        expect(particles.capacity).toBe(100);
        expect(particles.count).toBe(0);
    });

    test('add particle', () => {
        const particles = new ParticleDataSet();
        particles.addParticles(5);
        expect(particles.count).toBe(5);
    });

    test('parameter', () => {
        const particles = new ParticleDataSet();
        const customId1 = 31;
        const customId2 = 32;
        expect(particles.hasParameter(customId1)).toBeFalsy();
        expect(particles.getParameter(customId1)).toBeFalsy();
        expect(particles.getParameterNoCheck(customId1)).toBeUndefined();
        particles.addParameter(customId1, ParticleParameterType.FLOAT);
        expect(particles.hasParameter(customId1)).toBeTruthy();
        expect(particles.getParameter(customId1)).toBeTruthy();
        expect(particles.getParameter(customId1)).toBeInstanceOf(ParticleFloatArrayParameter);

    });
});