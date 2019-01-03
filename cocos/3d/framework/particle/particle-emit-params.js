import Particle from './particle';

export default class ParticleEmitParams {
    constructor() {
        this._particle = new Particle(); // to be integrable with particle structure
        this.positionSet = false;
        this.velocitySet = false;
        this.angularVelocitySet = false;
        this.axisOfRotationSet = false;
        this.rotationSet = false;
        this.startSizeSet = false;
        this.startColorSet = false;
        this.randomSeedSet = false;
        this.startLifetimeSet = false;
    }
}
