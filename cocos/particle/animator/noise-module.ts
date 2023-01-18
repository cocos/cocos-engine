/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { CCFloat, CCInteger, _decorator, Vec3 } from '../../core';
import { ParticleNoise } from '../noise';
import { Particle, PARTICLE_MODULE_NAME, ParticleModuleBase } from '../particle';

const { ccclass, serializable, displayOrder, type, range, slide, visible } = _decorator;

@ccclass('cc.NoiseModule')
export class NoiseModule extends ParticleModuleBase {
    @serializable
    _enable = false;
    /**
     * @zh 是否启用。
     */
    @displayOrder(0)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        if (this._enable === val) return;
        this._enable = val;
        if (!this.target) return;
        this.target.enableModule(this.name, val, this);
    }

    @type(CCFloat)
    @range([0, 100])
    @displayOrder(16)
    @slide
    get strengthX () {
        return this._strengthX;
    }
    set strengthX (value: number) {
        this._strengthX = value;
    }
    @serializable
    private _strengthX = 10;

    @type(CCFloat)
    @range([0, 100])
    @displayOrder(16)
    @slide
    get strengthY () {
        return this._strengthY;
    }
    set strengthY (value: number) {
        this._strengthY = value;
    }
    @serializable
    private _strengthY = 10;

    @type(CCFloat)
    @range([0, 100])
    @displayOrder(16)
    @slide
    get strengthZ () {
        return this._strengthZ;
    }
    set strengthZ (value: number) {
        this._strengthZ = value;
    }
    @serializable
    private _strengthZ = 10;

    @type(CCFloat)
    @range([0, 100])
    @slide
    @displayOrder(16)
    get noiseSpeedX () {
        return this._noiseSpeedX;
    }
    set noiseSpeedX (value: number) {
        this._noiseSpeedX = value;
    }
    @serializable
    private _noiseSpeedX = 0;

    @type(CCFloat)
    @range([0, 100])
    @displayOrder(16)
    @slide
    get noiseSpeedY () {
        return this._noiseSpeedY;
    }
    set noiseSpeedY (value: number) {
        this._noiseSpeedY = value;
    }
    @serializable
    private _noiseSpeedY = 0;

    @type(CCFloat)
    @range([0, 100])
    @displayOrder(16)
    @slide
    get noiseSpeedZ () {
        return this._noiseSpeedZ;
    }
    set noiseSpeedZ (value: number) {
        this._noiseSpeedZ = value;
    }
    @serializable
    private _noiseSpeedZ = 0;

    @type(CCFloat)
    @range([0, 100, 0.1])
    @displayOrder(16)
    @slide
    get noiseFrequency () {
        return this._noiseFrequency;
    }
    set noiseFrequency (value: number) {
        this._noiseFrequency = value;
    }
    @serializable
    private _noiseFrequency = 1;

    @visible(false)
    @type(CCFloat)
    @range([0, 1, 0.1])
    @displayOrder(16)
    @slide
    get remapX () {
        return this._remapX;
    }
    set remapX (value: number) {
        this._remapX = value;
    }
    @serializable
    private _remapX = 0;

    @visible(false)
    @type(CCFloat)
    @range([0, 1, 0.1])
    @displayOrder(16)
    @slide
    get remapY () {
        return this._remapY;
    }
    set remapY (value: number) {
        this._remapY = value;
    }
    @serializable
    private _remapY = 0;

    @visible(false)
    @type(CCFloat)
    @range([0, 1, 0.1])
    @displayOrder(16)
    @slide
    get remapZ () {
        return this._remapZ;
    }
    set remapZ (value: number) {
        this._remapZ = value;
    }
    @serializable
    private _remapZ = 0;

    @type(CCInteger)
    @range([1, 4, 1])
    @displayOrder(16)
    @slide
    get octaves () {
        return this._octaves;
    }
    set octaves (value: number) {
        this._octaves = value;
    }
    @serializable
    private _octaves = 1;

    // eslint-disable-next-line func-names
    @visible(function (this: NoiseModule) { return this._octaves > 1; })
    @type(CCFloat)
    @range([0, 1, 0.1])
    @displayOrder(16)
    get octaveMultiplier () {
        return this._octaveMultiplier;
    }
    set octaveMultiplier (value: number) {
        this._octaveMultiplier = value;
    }
    @serializable
    private _octaveMultiplier = 0.5;

    // eslint-disable-next-line func-names
    @visible(function (this: NoiseModule) { return this._octaves > 1; })
    @type(CCFloat)
    @range([1, 4, 0.1])
    @displayOrder(16)
    get octaveScale () {
        return this._octaveScale;
    }
    set octaveScale (value: number) {
        this._octaveScale = value;
    }
    @serializable
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
