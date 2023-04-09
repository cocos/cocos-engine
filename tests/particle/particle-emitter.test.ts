import { ParticleEmitter } from '../../cocos/particle/particle-emitter';
describe('ParticleEmitter', () => {
    test('Parameters Validation', () => {
        const particleEmitter = new ParticleEmitter();
        expect(particleEmitter.duration).toBe(5);
    });
});