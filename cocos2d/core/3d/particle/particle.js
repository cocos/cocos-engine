import { vec3, color4 } from '../../vmath';

export default class Particle {
    particleSystem = null;
    position = null;
    velocity = null;
    animatedVelocity = null;
    ultimateVelocity = null;
    angularVelocity = null;
    axisOfRotation = null;
    rotation = null;
    startSize = null;
    size = null;
    startColor = null;
    color = cc.Color.WHITE;
    randomSeed = null; // uint
    remainingLifetime = null;
    startLifetime = null;
    emitAccumulator0 = null;
    emitAccumulator1 = null;
    frameIndex = null;

    constructor (particleSystem) {
        this.particleSystem = particleSystem;
        this.position = vec3.create(0, 0, 0);
        this.velocity = vec3.create(0, 0, 0);
        this.animatedVelocity = vec3.create(0, 0, 0);
        this.ultimateVelocity = vec3.create(0, 0, 0);
        this.angularVelocity = vec3.create(0, 0, 0);
        this.axisOfRotation = vec3.create(0, 0, 0);
        this.rotation = vec3.create(0, 0, 0);
        this.startSize = vec3.create(0, 0, 0);
        this.size = vec3.create(0, 0, 0);
        this.startColor = cc.Color.WHITE.clone();
        this.color = cc.Color.WHITE.clone();
        this.randomSeed = 0; // uint
        this.remainingLifetime = 0.0;
        this.startLifetime = 0.0;
        this.emitAccumulator0 = 0.0;
        this.emitAccumulator1 = 0.0;
        this.frameIndex = 0.0;
    }
}
