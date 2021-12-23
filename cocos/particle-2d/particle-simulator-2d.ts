/*
 Copyright (c) 2018-2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module particle2d
 */

import { Vec2, Color } from '../core/math';
import Pool from '../core/utils/pool';
import { clampf, degreesToRadians, radiansToDegrees } from '../core/utils/misc';
import { vfmtPosUvColor, getComponentPerVertex } from '../2d/renderer/vertex-format';
import { PositionType, EmitterMode, START_SIZE_EQUAL_TO_END_SIZE, START_RADIUS_EQUAL_TO_END_RADIUS } from './define';
import { ParticleSystem2D } from './particle-system-2d';

const ZERO_VEC2 = new Vec2(0, 0);
const _pos = new Vec2();
const _tpa = new Vec2();
const _tpb = new Vec2();
const _tpc = new Vec2();

const formatBytes = getComponentPerVertex(vfmtPosUvColor);

// In the Free mode to get emit real rotation in the world coordinate.
function getWorldRotation (node) {
    let rotation = 0;
    let tempNode = node;
    while (tempNode) {
        rotation += tempNode.eulerAngles.z;
        tempNode = tempNode.parent;
    }
    return rotation;
}

class Particle {
    public pos = new Vec2(0, 0);
    public startPos = new Vec2(0, 0);
    public color = new Color(0, 0, 0, 255);
    public deltaColor = { r: 0, g: 0, b: 0, a: 255 };
    public size = 0;
    public deltaSize = 0;
    public rotation = 0;
    public deltaRotation = 0;
    public timeToLive = 0;
    public drawPos = new Vec2(0, 0);
    public aspectRatio = 1;
    // Mode A
    public dir = new Vec2(0, 0);
    public radialAccel = 0;
    public tangentialAccel = 0;
    // Mode B
    public angle = 0;
    public degreesPerSecond = 0;
    public radius = 0;
    public deltaRadius = 0;
}

class ParticlePool extends Pool<Particle> {
    public get (): Particle {
        return this._get() || new Particle();
    }
}

const pool = new ParticlePool((par: Particle) => {
    par.pos.set(ZERO_VEC2);
    par.startPos.set(ZERO_VEC2);
    par.color._val = 0xFF000000;
    par.deltaColor.r = par.deltaColor.g = par.deltaColor.b = 0;
    par.deltaColor.a = 255;
    par.size = 0;
    par.deltaSize = 0;
    par.rotation = 0;
    par.deltaRotation = 0;
    par.timeToLive = 0;
    par.drawPos.set(ZERO_VEC2);
    par.aspectRatio = 1;
    // Mode A
    par.dir.set(ZERO_VEC2);
    par.radialAccel = 0;
    par.tangentialAccel = 0;
    // Mode B
    par.angle = 0;
    par.degreesPerSecond = 0;
    par.radius = 0;
    par.deltaRadius = 0;
}, 1024);

export class Simulator {
    public particles: Particle[] = [];
    public active = false;
    public uvFilled = 0;
    public finished = false;
    public declare renderData;
    private readyToPlay = true;
    private elapsed = 0;
    private emitCounter = 0;
    private _worldRotation = 0;
    private declare sys: ParticleSystem2D;

    constructor (system) {
        this.sys = system;
        this.particles = [];
        this.active = false;
        this.readyToPlay = true;
        this.finished = false;
        this.elapsed = 0;
        this.emitCounter = 0;
        this.uvFilled = 0;
        this._worldRotation = 0;
    }

    public stop () {
        this.active = false;
        this.readyToPlay = false;
        this.elapsed = this.sys.duration;
        this.emitCounter = 0;
    }

    public reset () {
        this.active = true;
        this.readyToPlay = true;
        this.elapsed = 0;
        this.emitCounter = 0;
        this.finished = false;
        const particles = this.particles;
        for (let id = 0; id < particles.length; ++id) pool.put(particles[id]);
        particles.length = 0;
    }

    public emitParticle (pos) {
        const psys = this.sys;
        const particle = pool.get();
        this.particles.push(particle);

        // Init particle
        // timeToLive
        // no negative life. prevent division by 0
        particle.timeToLive = psys.life + psys.lifeVar * (Math.random() - 0.5) * 2;
        const timeToLive = particle.timeToLive = Math.max(0, particle.timeToLive);

        // position
        particle.pos.x = psys.sourcePos.x + psys.posVar.x * (Math.random() - 0.5) * 2;
        particle.pos.y = psys.sourcePos.y + psys.posVar.y * (Math.random() - 0.5) * 2;

        // Color
        let sr = 0;
        let sg = 0;
        let sb = 0;
        let sa = 0;
        const startColor = psys.startColor;
        const startColorVar = psys.startColorVar;
        const endColor = psys.endColor;
        const endColorVar = psys.endColorVar;

        particle.color.r = sr = clampf(startColor.r + startColorVar.r * (Math.random() - 0.5) * 2, 0, 255);
        particle.color.g = sg = clampf(startColor.g + startColorVar.g * (Math.random() - 0.5) * 2, 0, 255);
        particle.color.b = sb = clampf(startColor.b + startColorVar.b * (Math.random() - 0.5) * 2, 0, 255);
        particle.color.a = sa = clampf(startColor.a + startColorVar.a * (Math.random() - 0.5) * 2, 0, 255);
        particle.deltaColor.r = (clampf(endColor.r + endColorVar.r * (Math.random() - 0.5) * 2, 0, 255) - sr) / timeToLive;
        particle.deltaColor.g = (clampf(endColor.g + endColorVar.g * (Math.random() - 0.5) * 2, 0, 255) - sg) / timeToLive;
        particle.deltaColor.b = (clampf(endColor.b + endColorVar.b * (Math.random() - 0.5) * 2, 0, 255) - sb) / timeToLive;
        particle.deltaColor.a = (clampf(endColor.a + endColorVar.a * (Math.random() - 0.5) * 2, 0, 255) - sa) / timeToLive;

        // size
        let startS = psys.startSize + psys.startSizeVar * (Math.random() - 0.5) * 2;
        startS = Math.max(0, startS); // No negative value
        particle.size = startS;
        if (psys.endSize === START_SIZE_EQUAL_TO_END_SIZE) {
            particle.deltaSize = 0;
        } else {
            let endS = psys.endSize + psys.endSizeVar * (Math.random() - 0.5) * 2;
            endS = Math.max(0, endS); // No negative values
            particle.deltaSize = (endS - startS) / timeToLive;
        }

        // rotation
        const startA = psys.startSpin + psys.startSpinVar * (Math.random() - 0.5) * 2;
        const endA = psys.endSpin + psys.endSpinVar * (Math.random() - 0.5) * 2;
        particle.rotation = startA;
        particle.deltaRotation = (endA - startA) / timeToLive;

        // position
        particle.startPos.x = pos.x;
        particle.startPos.y = pos.y;

        // aspect ratio
        particle.aspectRatio = psys.aspectRatio || 1;

        // direction
        const a = degreesToRadians(psys.angle + this._worldRotation + psys.angleVar * (Math.random() - 0.5) * 2);
        // Mode Gravity: A
        if (psys.emitterMode === EmitterMode.GRAVITY) {
            const s = psys.speed + psys.speedVar * (Math.random() - 0.5) * 2;
            // direction
            particle.dir.x = Math.cos(a);
            particle.dir.y = Math.sin(a);
            particle.dir.multiplyScalar(s);
            // radial accel
            particle.radialAccel = psys.radialAccel + psys.radialAccelVar * (Math.random() - 0.5) * 2;
            // tangential accel
            particle.tangentialAccel = psys.tangentialAccel + psys.tangentialAccelVar * (Math.random() - 0.5) * 2;
            // rotation is dir
            if (psys.rotationIsDir) {
                particle.rotation = -radiansToDegrees(Math.atan2(particle.dir.y, particle.dir.x));
            }
        } else {
            // Mode Radius: B
            // Set the default diameter of the particle from the source position
            const startRadius = psys.startRadius + psys.startRadiusVar * (Math.random() - 0.5) * 2;
            const endRadius = psys.endRadius + psys.endRadiusVar * (Math.random() - 0.5) * 2;
            particle.radius = startRadius;
            particle.deltaRadius = (psys.endRadius === START_RADIUS_EQUAL_TO_END_RADIUS) ? 0 : (endRadius - startRadius) / timeToLive;
            particle.angle = a;
            particle.degreesPerSecond = degreesToRadians(psys.rotatePerS + psys.rotatePerSVar * (Math.random() - 0.5) * 2);
        }
    }

    public updateUVs (force?: boolean) {
        const renderData = this.renderData;
        if (renderData && this.sys._renderSpriteFrame) {
            const vbuf = renderData.vData;
            const uv = this.sys._renderSpriteFrame.uv;

            const start = force ? 0 : this.uvFilled;
            const particleCount = this.particles.length;
            for (let i = start; i < particleCount; i++) {
                const offset = i * formatBytes * 4;
                vbuf[offset + 3] = uv[0];
                vbuf[offset + 4] = uv[1];
                vbuf[offset + 12] = uv[2];
                vbuf[offset + 13] = uv[3];
                vbuf[offset + 21] = uv[4];
                vbuf[offset + 22] = uv[5];
                vbuf[offset + 30] = uv[6];
                vbuf[offset + 31] = uv[7];
            }
            this.uvFilled = particleCount;
        }
    }

    public updateParticleBuffer (particle, pos, buffer, offset: number) {
        const vbuf = buffer.vData;
        // const uintbuf = buffer._uintVData;

        const x: number = pos.x;
        const y: number = pos.y;
        let width = particle.size;
        let height = width;
        const aspectRatio = particle.aspectRatio;
        if (aspectRatio > 1) {
            height = width / aspectRatio;
        } else {
            width = height * aspectRatio;
        }
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        // pos
        if (particle.rotation) {
            const x1 = -halfWidth;
            const y1 = -halfHeight;
            const x2 = halfWidth;
            const y2 = halfHeight;
            const rad = -degreesToRadians(particle.rotation);
            const cr = Math.cos(rad);
            const sr = Math.sin(rad);
            // bl
            vbuf[offset] = x1 * cr - y1 * sr + x;
            vbuf[offset + 1] = x1 * sr + y1 * cr + y;
            vbuf[offset + 2] = 0;
            // br
            vbuf[offset + 9] = x2 * cr - y1 * sr + x;
            vbuf[offset + 10] = x2 * sr + y1 * cr + y;
            vbuf[offset + 11] = 0;
            // tl
            vbuf[offset + 18] = x1 * cr - y2 * sr + x;
            vbuf[offset + 19] = x1 * sr + y2 * cr + y;
            vbuf[offset + 20] = 0;
            // tr
            vbuf[offset + 27] = x2 * cr - y2 * sr + x;
            vbuf[offset + 28] = x2 * sr + y2 * cr + y;
            vbuf[offset + 29] = 0;
        } else {
            // bl
            vbuf[offset] = x - halfWidth;
            vbuf[offset + 1] = y - halfHeight;
            vbuf[offset + 2] = 0;
            // br
            vbuf[offset + 9] = x + halfWidth;
            vbuf[offset + 10] = y - halfHeight;
            vbuf[offset + 11] = 0;
            // tl
            vbuf[offset + 18] = x - halfWidth;
            vbuf[offset + 19] = y + halfHeight;
            vbuf[offset + 20] = 0;
            // tr
            vbuf[offset + 27] = x + halfWidth;
            vbuf[offset + 28] = y + halfHeight;
            vbuf[offset + 29] = 0;
        }
        // color
        Color.toArray(vbuf, particle.color, offset + 5);
        Color.toArray(vbuf, particle.color, offset + 14);
        Color.toArray(vbuf, particle.color, offset + 23);
        Color.toArray(vbuf, particle.color, offset + 32);
    }

    public step (dt) {
        const assembler = this.sys.assembler!;
        const psys = this.sys;
        const node = psys.node;
        const particles = this.particles;
        dt = dt > assembler.maxParticleDeltaTime ? assembler.maxParticleDeltaTime : dt;
        // Calculate pos
        node.updateWorldTransform();
        if (psys.positionType === PositionType.FREE) {
            this._worldRotation = getWorldRotation(node);
            const m =  node.worldMatrix;
            _pos.x = m.m12;
            _pos.y = m.m13;
        } else if (psys.positionType === PositionType.RELATIVE) {
            this._worldRotation = node.eulerAngles.z;
            _pos.x = node.position.x;
            _pos.y = node.position.y;
        } else {
            this._worldRotation = 0;
        }

        // Emission
        if (this.active && psys.emissionRate) {
            const rate = 1.0 / psys.emissionRate;
            // issue #1201, prevent bursts of particles, due to too high emitCounter
            if (particles.length < psys.totalParticles) this.emitCounter += dt;

            while ((particles.length < psys.totalParticles) && (this.emitCounter > rate)) {
                this.emitParticle(_pos);
                this.emitCounter -= rate;
            }

            this.elapsed += dt;
            if (psys.duration !== -1 && psys.duration < this.elapsed) {
                psys.stopSystem();
            }
        }

        // Request buffer for particles
        const renderData = this.renderData;
        const particleCount = particles.length;
        renderData.reset();
        this.requestData(particleCount * 4, particleCount * 6);

        // Fill up uvs
        if (particleCount > this.uvFilled) {
            this.updateUVs();
        }

        // Used to reduce memory allocation / creation within the loop
        let particleIdx = 0;
        while (particleIdx < particles.length) {
            // Reset temporary vectors
            _tpa.x = _tpa.y = _tpb.x = _tpb.y = _tpc.x = _tpc.y = 0;

            const particle = particles[particleIdx];

            // life
            particle.timeToLive -= dt;
            if (particle.timeToLive > 0) {
                // Mode A: gravity, direction, tangential accel & radial accel
                if (psys.emitterMode === EmitterMode.GRAVITY) {
                    const tmp = _tpc;
                    const radial = _tpa;
                    const tangential = _tpb;

                    // radial acceleration
                    if (particle.pos.x || particle.pos.y) {
                        radial.set(particle.pos);
                        radial.normalize();
                    }
                    tangential.set(radial);
                    radial.multiplyScalar(particle.radialAccel);

                    // tangential acceleration
                    const newy = tangential.x;
                    tangential.x = -tangential.y;
                    tangential.y = newy;

                    tangential.multiplyScalar(particle.tangentialAccel);

                    tmp.set(radial);
                    tmp.add(tangential);
                    tmp.add(psys.gravity);
                    tmp.multiplyScalar(dt);
                    particle.dir.add(tmp);

                    tmp.set(particle.dir);
                    tmp.multiplyScalar(dt);
                    particle.pos.add(tmp);
                } else {
                    // Mode B: radius movement
                    // Update the angle and radius of the particle.
                    particle.angle += particle.degreesPerSecond * dt;
                    particle.radius += particle.deltaRadius * dt;

                    particle.pos.x = -Math.cos(particle.angle) * particle.radius;
                    particle.pos.y = -Math.sin(particle.angle) * particle.radius;
                }

                // color
                particle.color.r += particle.deltaColor.r * dt;
                particle.color.g += particle.deltaColor.g * dt;
                particle.color.b += particle.deltaColor.b * dt;
                particle.color.a += particle.deltaColor.a * dt;

                // size
                particle.size += particle.deltaSize * dt;
                if (particle.size < 0) {
                    particle.size = 0;
                }

                // angle
                particle.rotation += particle.deltaRotation * dt;

                // update values in quad buffer
                const newPos = _tpa;
                newPos.set(particle.pos);
                if (psys.positionType !== PositionType.GROUPED) {
                    newPos.add(particle.startPos);
                }

                const offset = formatBytes * particleIdx * 4;
                this.updateParticleBuffer(particle, newPos, renderData, offset);

                // update particle counter
                ++particleIdx;
            } else {
                // life < 0
                const deadParticle = particles[particleIdx];
                if (particleIdx !== particles.length - 1) {
                    particles[particleIdx] = particles[particles.length - 1];
                }
                pool.put(deadParticle);
                particles.length--;
                renderData.indexCount -= 6;
                renderData.vertexCount -= 4;
            }
        }

        if (particles.length === 0 && !this.active && !this.readyToPlay) {
            this.finished = true;
            psys._finishedSimulation();
        }
    }

    requestData (vertexCount: number, indexCount: number) {
        let offset = this.renderData.indexCount;
        this.renderData.request(vertexCount, indexCount);
        const count = this.renderData.indexCount / 6;
        const buffer = this.renderData.iData;
        for (let i = offset; i < count; i++) {
            const vId = i * 4;
            buffer[offset++] = vId;
            buffer[offset++] = vId + 1;
            buffer[offset++] = vId + 2;
            buffer[offset++] = vId + 1;
            buffer[offset++] = vId + 3;
            buffer[offset++] = vId + 2;
        }
    }
}
