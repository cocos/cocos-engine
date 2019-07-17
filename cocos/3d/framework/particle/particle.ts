/**
 * @hidden
 */

import { Color, Vec3 } from '../../../core/value-types';
import { ParticleSystemComponent } from './particle-system-component';

export default class Particle {
    public particleSystem: ParticleSystemComponent;
    public position: Vec3;
    public velocity: Vec3;
    public animatedVelocity: Vec3;
    public ultimateVelocity: Vec3;
    public angularVelocity: Vec3;
    public axisOfRotation: Vec3;
    public rotation: Vec3;
    public startSize: Vec3;
    public size: Vec3;
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
        this.position = Vec3.create(0, 0, 0);
        this.velocity = Vec3.create(0, 0, 0);
        this.animatedVelocity = Vec3.create(0, 0, 0);
        this.ultimateVelocity = Vec3.create(0, 0, 0);
        this.angularVelocity = Vec3.create(0, 0, 0);
        this.axisOfRotation = Vec3.create(0, 0, 0);
        this.rotation = Vec3.create(0, 0, 0);
        this.startSize = Vec3.create(0, 0, 0);
        this.size = Vec3.create(0, 0, 0);
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
