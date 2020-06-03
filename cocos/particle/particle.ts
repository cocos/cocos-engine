/**
 * @hidden
 */

import { Color, Vec3, Mat4 } from '../core/math';
import { ParticleSystemComponent } from './particle-system-component';
import { IParticleSystemRenderer } from './renderer/particle-system-renderer-base';

export class Particle {
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
    public color: Color;
    public randomSeed: number; // uint
    public remainingLifetime: number;
    public startLifetime: number;
    public emitAccumulator0: number;
    public emitAccumulator1: number;
    public frameIndex: number;
    public startRow: number;

    constructor (particleSystem: any) {
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
        this.startColor = Color.WHITE.clone();
        this.color = Color.WHITE.clone();
        this.randomSeed = 0; // uint
        this.remainingLifetime = 0.0;
        this.startLifetime = 0.0;
        this.emitAccumulator0 = 0.0;
        this.emitAccumulator1 = 0.0;
        this.frameIndex = 0.0;
        this.startRow = 0;
    }
}

export const PARTICLE_MODULE_NAME = {
    COLOR: 'colorModule',
    FORCE: 'forceModule',
    LIMIT: 'limitModule',
    ROTATION: 'rotationModule',
    SIZE: 'sizeModule',
    VELOCITY: 'velocityModule',
    TEXTURE: 'textureModule'
};

export const PARTICLE_MODULE_ORDER = [
    'sizeModule',
    'colorModule',
    'forceModule',
    'velocityModule',
    'limitModule',
    'rotationModule',
    'textureModule'
];

export const PARTICLE_MODULE_PROPERTY = [
    '_colorOverLifetimeModule',
    '_shapeModule',
    '_sizeOvertimeModule',
    '_velocityOvertimeModule',
    '_forceOvertimeModule',
    '_limitVelocityOvertimeModule',
    '_rotationOvertimeModule',
    '_textureAnimationModule',
    '_trailModule'
];

export interface IParticleModule {
    target: IParticleSystemRenderer | null;
    needUpdate: Boolean;
    needAnimate: Boolean;
    name: string;
    bindTarget (target: any): void;
    update (space: number, trans: Mat4): void;
    animate (p: Particle, dt?: number): void;
}

export abstract class ParticleModuleBase implements IParticleModule{
    public target:IParticleSystemRenderer | null = null;
    public needUpdate: Boolean = false;
    public needAnimate: Boolean = true;

    public bindTarget (target: IParticleSystemRenderer) {
        this.target = target;
    }

    public update (space: number, trans: Mat4) {}
    public abstract name: string;
    public abstract animate (p: Particle, dt?: number): void;
}
