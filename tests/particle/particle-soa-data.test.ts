
import { ParticleSOAData } from '../../cocos/particle/particle-soa-data';

describe('particle-soa-data', () => {
    
    test('capacity', () => {
        const particles = new ParticleSOAData();
        expect(particles.capacity).toBe(16);
        expect(particles.count).toBe(0);
        particles.addParticles(5);

    });
    
});