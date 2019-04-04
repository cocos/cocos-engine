import { vec3, color4 } from '../../../core/vmath';
import { Color } from '../../../core/value-types';
import { ParticleSystemComponent } from './particle-system-component';

export default class Particle {
    public particleSystem: ParticleSystemComponent;
    public position: vec3;
    public velocity: vec3;
    public animatedVelocity: vec3;
    public ultimateVelocity: vec3;
    public angularVelocity: vec3;
    public axisOfRotation: vec3;
    public rotation: vec3;
    public startSize: vec3;
    public size: vec3;
    public startColor: Color;
    public color = cc.Color.WHITE;
    public randomSeed: number; // uint
    public remainingLifetime: number;
    public startLifetime: number;
    public emitAccumulator0: number;
    public emitAccumulator1: number;
    public frameIndex: number;

    constructor (particleSystem: any) {
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
        this.color = cc.Color.WHITE;
        this.randomSeed = 0; // uint
        this.remainingLifetime = 0.0;
        this.startLifetime = 0.0;
        this.emitAccumulator0 = 0.0;
        this.emitAccumulator1 = 0.0;
        this.frameIndex = 0.0;
    }
}
