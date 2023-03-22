import { ParticleVec3Parameter } from '../../cocos/particle/particle-parameter';

test('ParticleVec3Parameter', () => {
    const vec3Parameter = new ParticleVec3Parameter();
    expect(vec3Parameter.capacity).toBe(16);
    expect(vec3Parameter.data).toBeTruthy();
    expect(vec3Parameter.data.length).toBe(16);

    vec3Parameter.reserve(32);
    expect(vec3Parameter.capacity).toBe(32);
    expect(vec3Parameter.data.length).toBe(32);
});
