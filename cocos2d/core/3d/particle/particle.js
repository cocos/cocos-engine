import { Vec3, Color } from '../../value-types';

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
        this.position = new Vec3(0, 0, 0);
        this.velocity = new Vec3(0, 0, 0);
        this.animatedVelocity = new Vec3(0, 0, 0);
        this.ultimateVelocity = new Vec3(0, 0, 0);
        this.angularVelocity = new Vec3(0, 0, 0);
        this.axisOfRotation = new Vec3(0, 0, 0);
        this.rotation = new Vec3(0, 0, 0);
        this.startSize = new Vec3(0, 0, 0);
        this.size = new Vec3(0, 0, 0);
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
