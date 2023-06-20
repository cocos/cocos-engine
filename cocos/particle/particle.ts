/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Color, Vec3, Mat4, Quat } from '../core';
import { ParticleSystem } from './particle-system';
import { ParticleSystemRendererBase } from './renderer/particle-system-renderer-base';

export class Particle {
    public static INDENTIFY_NEG_QUAT = 10;
    public static R2D = 180.0 / Math.PI;

    public particleSystem: ParticleSystem;
    public position: Vec3;
    public velocity: Vec3;
    public animatedVelocity: Vec3;
    public ultimateVelocity: Vec3;
    public angularVelocity: Vec3;
    public axisOfRotation: Vec3;
    public rotation: Vec3;
    public startEuler: Vec3;
    public startRotation: Quat;
    public startRotated: boolean;
    public deltaQuat: Quat;
    public deltaMat: Mat4;
    public localMat: Mat4;
    public startSize: Vec3;
    public size: Vec3;
    public startColor: Color;
    public color: Color;
    public randomSeed: number; // uint
    public remainingLifetime: number;
    public loopCount: number;
    public lastLoop: number;
    public trailDelay: number;
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
        this.startEuler = new Vec3(0, 0, 0);
        this.startRotation = new Quat();
        this.startRotated = false;
        this.deltaQuat = new Quat();
        this.deltaMat = new Mat4();
        this.localMat = new Mat4();
        this.startSize = new Vec3(0, 0, 0);
        this.size = new Vec3(0, 0, 0);
        this.startColor = Color.WHITE.clone();
        this.color = Color.WHITE.clone();
        this.randomSeed = 0; // uint
        this.remainingLifetime = 0.0;
        this.loopCount = 0;
        this.lastLoop = 0;
        this.trailDelay = 0;
        this.startLifetime = 0.0;
        this.emitAccumulator0 = 0.0;
        this.emitAccumulator1 = 0.0;
        this.frameIndex = 0.0;
        this.startRow = 0;
    }

    public reset (): void {
        this.rotation.set(0, 0, 0);
        this.startEuler.set(0, 0, 0);
        this.startRotation.set(0, 0, 0, 1);
        this.startRotated = false;
        this.deltaQuat.set(0, 0, 0, 1);
        this.deltaMat.identity();
        this.localMat.identity();
    }
}

export const PARTICLE_MODULE_NAME = {
    COLOR: 'colorModule',
    FORCE: 'forceModule',
    LIMIT: 'limitModule',
    ROTATION: 'rotationModule',
    SIZE: 'sizeModule',
    VELOCITY: 'velocityModule',
    TEXTURE: 'textureModule',
    NOISE: 'noiseModule',
};

export const PARTICLE_MODULE_ORDER = [
    'sizeModule',
    'colorModule',
    'forceModule',
    'velocityModule',
    'limitModule',
    'rotationModule',
    'textureModule',
    'noiseModule',
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
    '_noiseModule',
    '_trailModule',
];

export interface IParticleModule {
    target: ParticleSystemRendererBase | null;
    needUpdate: boolean;
    needAnimate: boolean;
    name: string;
    bindTarget (target: any): void;
    update (space: number, trans: Mat4): void;
    animate (p: Particle, dt?: number): void;
}

export abstract class ParticleModuleBase implements IParticleModule {
    public target: ParticleSystemRendererBase | null = null;
    public needUpdate = false;
    public needAnimate = true;

    public bindTarget (target: ParticleSystemRendererBase): void {
        this.target = target;
    }

    public update (space: number, trans: Mat4): void {}
    public abstract name: string;
    public abstract animate (p: Particle, dt?: number): void;
}
