import { Vec2 } from '../../cocos/core';
import { ParticleEmitter } from '../../cocos/particle/particle-emitter';
describe('ParticleEmitter', () => {
    test('Parameters Validation', () => {
        const particleEmitter = new ParticleEmitter();
        expect(particleEmitter.duration).toBe(5);
        particleEmitter.duration = -1;
        expect(particleEmitter.duration).toBe(0.01);
        expect(particleEmitter.loopCount).toBe(1);
        particleEmitter.loopCount = 0;
        expect(particleEmitter.loopCount).toBe(1);
        particleEmitter.loopCount = 2.2;
        expect(particleEmitter.loopCount).toBe(2);
        expect(particleEmitter.delayRange).toStrictEqual(new Vec2());
        particleEmitter.delayRange = new Vec2(-1, -0.2);
        expect(particleEmitter.delayRange).toStrictEqual(new Vec2(0, 0));
        expect(particleEmitter.prewarmTime).toStrictEqual(5);
        particleEmitter.prewarmTime = -1;
        expect(particleEmitter.prewarmTime).toStrictEqual(0.001);
        expect(particleEmitter.prewarmTimeStep).toStrictEqual(0.03);
        particleEmitter.prewarmTimeStep = -1;
        expect(particleEmitter.prewarmTimeStep).toStrictEqual(0.001);
        expect(particleEmitter.simulationSpeed).toStrictEqual(1);
        particleEmitter.simulationSpeed = -1;
        expect(particleEmitter.simulationSpeed).toStrictEqual(0.001);
        expect(particleEmitter.maxDeltaTime).toStrictEqual(0.05);
        
    });
});