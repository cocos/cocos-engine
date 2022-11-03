/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { CCFloat, CCInteger, _decorator, Vec3 } from '../../core';
import { ParticleNoise } from '../noise';
import { Particle, PARTICLE_MODULE_NAME, ParticleModuleBase } from '../particle';

@_decorator.ccclass('cc.NoiseModule')
export class NoiseModule extends ParticleModuleBase {
    @_decorator.serializable
    _enable = false;
    /**
     * @zh 是否启用。
     */
    @_decorator.displayOrder(0)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        if (this._enable === val) return;
        this._enable = val;
        if (!this.target) return;
        this.target.enableModule(this.name, val, this);
    }

    @_decorator.type(CCFloat)
    @_decorator.range([0, 100])
    @_decorator.displayOrder(16)
    @_decorator.slide
    get strengthX () {
        return this._strengthX;
    }
    set strengthX (value: number) {
        this._strengthX = value;
    }
    @_decorator.serializable
    private _strengthX = 10;

    @_decorator.type(CCFloat)
    @_decorator.range([0, 100])
    @_decorator.displayOrder(16)
    @_decorator.slide
    get strengthY () {
        return this._strengthY;
    }
    set strengthY (value: number) {
        this._strengthY = value;
    }
    @_decorator.serializable
    private _strengthY = 10;

    @_decorator.type(CCFloat)
    @_decorator.range([0, 100])
    @_decorator.displayOrder(16)
    @_decorator.slide
    get strengthZ () {
        return this._strengthZ;
    }
    set strengthZ (value: number) {
        this._strengthZ = value;
    }
    @_decorator.serializable
    private _strengthZ = 10;

    @_decorator.type(CCFloat)
    @_decorator.range([0, 100])
    @_decorator.slide
    @_decorator.displayOrder(16)
    get noiseSpeedX () {
        return this._noiseSpeedX;
    }
    set noiseSpeedX (value: number) {
        this._noiseSpeedX = value;
    }
    @_decorator.serializable
    private _noiseSpeedX = 0;

    @_decorator.type(CCFloat)
    @_decorator.range([0, 100])
    @_decorator.displayOrder(16)
    @_decorator.slide
    get noiseSpeedY () {
        return this._noiseSpeedY;
    }
    set noiseSpeedY (value: number) {
        this._noiseSpeedY = value;
    }
    @_decorator.serializable
    private _noiseSpeedY = 0;

    @_decorator.type(CCFloat)
    @_decorator.range([0, 100])
    @_decorator.displayOrder(16)
    @_decorator.slide
    get noiseSpeedZ () {
        return this._noiseSpeedZ;
    }
    set noiseSpeedZ (value: number) {
        this._noiseSpeedZ = value;
    }
    @_decorator.serializable
    private _noiseSpeedZ = 0;

    @_decorator.type(CCFloat)
    @_decorator.range([0, 100])
    @_decorator.rangeStep(0.1)
    @_decorator.displayOrder(16)
    @_decorator.slide
    get noiseFrequency () {
        return this._noiseFrequency;
    }
    set noiseFrequency (value: number) {
        this._noiseFrequency = value;
    }
    @_decorator.serializable
    private _noiseFrequency = 1;

    @_decorator.visible(false)
    @_decorator.type(CCFloat)
    @_decorator.range([0, 1])
    @_decorator.rangeStep(0.1)
    @_decorator.displayOrder(16)
    @_decorator.slide
    get remapX () {
        return this._remapX;
    }
    set remapX (value: number) {
        this._remapX = value;
    }
    @_decorator.serializable
    private _remapX = 0;

    @_decorator.visible(false)
    @_decorator.type(CCFloat)
    @_decorator.range([0, 1])
    @_decorator.rangeStep(0.1)
    @_decorator.displayOrder(16)
    @_decorator.slide
    get remapY () {
        return this._remapY;
    }
    set remapY (value: number) {
        this._remapY = value;
    }
    @_decorator.serializable
    private _remapY = 0;

    @_decorator.visible(false)
    @_decorator.type(CCFloat)
    @_decorator.range([0, 1])
    @_decorator.rangeStep(0.1)
    @_decorator.displayOrder(16)
    @_decorator.slide
    get remapZ () {
        return this._remapZ;
    }
    set remapZ (value: number) {
        this._remapZ = value;
    }
    @_decorator.serializable
    private _remapZ = 0;

    @_decorator.type(CCInteger)
    @_decorator.range([1, 4])
    @_decorator.rangeStep(1)
    @_decorator.displayOrder(16)
    @_decorator.slide
    get octaves () {
        return this._octaves;
    }
    set octaves (value: number) {
        this._octaves = value;
    }
    @_decorator.serializable
    private _octaves = 1;

    // eslint-disable-next-line func-names
    @_decorator.visible(function (this: NoiseModule) { return this._octaves > 1; })
    @_decorator.type(CCFloat)
    @_decorator.range([0, 1])
    @_decorator.rangeStep(0.1)
    @_decorator.displayOrder(16)
    get octaveMultiplier () {
        return this._octaveMultiplier;
    }
    set octaveMultiplier (value: number) {
        this._octaveMultiplier = value;
    }
    @_decorator.serializable
    private _octaveMultiplier = 0.5;

    // eslint-disable-next-line func-names
    @_decorator.visible(function (this: NoiseModule) { return this._octaves > 1; })
    @_decorator.type(CCFloat)
    @_decorator.range([1, 4])
    @_decorator.rangeStep(0.1)
    @_decorator.displayOrder(16)
    get octaveScale () {
        return this._octaveScale;
    }
    set octaveScale (value: number) {
        this._octaveScale = value;
    }
    @_decorator.serializable
    private _octaveScale = 2;

    public name = PARTICLE_MODULE_NAME.NOISE;

    private noise: ParticleNoise = new ParticleNoise();

    private samplePosition: Vec3 = new Vec3();

    public animate (particle: Particle, dt: number) {
        this.noise.setTime(particle.particleSystem.time);
        this.noise.setSpeed(this.noiseSpeedX, this.noiseSpeedY, this.noiseSpeedZ);
        this.noise.setFrequency(this.noiseFrequency);
        this.noise.setAbs(this.remapX, this.remapY, this.remapZ);
        this.noise.setAmplititude(this.strengthX, this.strengthY, this.strengthZ);
        this.noise.setOctaves(this.octaves, this.octaveMultiplier, this.octaveScale);

        this.samplePosition.set(particle.position);
        this.samplePosition.add3f(Math.random() * 1.0, Math.random() * 1.0, Math.random() * 1.0);
        this.noise.setSamplePoint(this.samplePosition);
        this.noise.getNoiseParticle();

        const noisePosition: Vec3 = this.noise.getResult();
        noisePosition.multiply3f(Math.random(), Math.random(), Math.random());
        Vec3.add(particle.position, particle.position, noisePosition.multiplyScalar(dt));
    }

    public getNoisePreview (out: number[], ps, width: number, height: number) {
        this.noise.setTime(ps.time);
        this.noise.setSpeed(this.noiseSpeedX, this.noiseSpeedY, this.noiseSpeedZ);
        this.noise.setFrequency(this.noiseFrequency);
        this.noise.setAbs(this.remapX, this.remapY, this.remapZ);
        this.noise.setAmplititude(this.strengthX, this.strengthY, this.strengthZ);
        this.noise.setOctaves(this.octaves, this.octaveMultiplier, this.octaveScale);
        this.noise.getNoiseParticle();

        this.noise.getPreview(out, width, height);
    }
}
