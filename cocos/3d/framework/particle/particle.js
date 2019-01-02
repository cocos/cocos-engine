import { vec3, color4 } from '../../../core/vmath';

export default class Particle {
    constructor(particleSystem) {
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
        this.startColor = cc.Color.WHITE;
        this.startColor01 = color4.create();
        this.color = cc.Color.WHITE;
        this.randomSeed = 0; // uint
        this.remainingLifetime = 0.0;
        this.startLifetime = 0.0;
        this.emitAccumulator0 = 0.0;
        this.emitAccumulator1 = 0.0;
        this.frameIndex = 0.0;
    }
}
