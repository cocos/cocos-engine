
import { ParticleDataSet } from '../../cocos/particle/particle-data-set';

describe('particle-soa-data', () => {
    
    test('capacity', () => {
        const particles = new ParticleDataSet();
        expect(particles.capacity).toBe(16);
        expect(particles.count).toBe(0);
    });

    test('add particle', () => {
        const particles = new ParticleDataSet();
        particles.addParticles(5);
        expect(particles.count).toBe(5);
    });

    test('id', () => {
        const particles = new ParticleDataSet();
        for (let i = 0; i < 100; i++) {
            particles.addParticles(1);
        }
        for (let i = 0; i < 100; i++) {
            expect(particles.id[i]).toBe(i + 1);
        }
    });
    
});