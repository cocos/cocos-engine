/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

const AffineTrans = require('../core/utils/affine-transform');
const js = require('../core/platform/js');
const misc = require('../core/utils/misc');

const ZERO_VEC2 = cc.v2(0, 0);

let _trans = AffineTrans.create();
let _pos = cc.v2();
let _tpa = cc.v2();
let _tpb = cc.v2();
let _tpc = cc.v2();

let Particle = function () {
    this.pos = cc.v2(0, 0);
    this.startPos = cc.v2(0, 0);
    this.color = cc.color(0, 0, 0, 255);
    this.deltaColor = {r: 0, g: 0, b: 0, a: 255};
    this.size = 0;
    this.deltaSize = 0;
    this.rotation = 0;
    this.deltaRotation = 0;
    this.timeToLive = 0;
    this.drawPos = cc.v2(0, 0);
    // Mode A
    this.dir = cc.v2(0, 0);
    this.radialAccel = 0;
    this.tangentialAccel = 0;
    // Mode B
    this.angle = 0;
    this.degreesPerSecond = 0;
    this.radius = 0;
    this.deltaRadius = 0;
}

let pool = new js.Pool(function (par) {
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
pool.get = function () {
    return this._get() || new Particle();
}

let Simulator = function (system) {
    this.sys = system;
    this.particles = [];
    this.active = false;
    this.finished = false;
    this.elapsed = 0;
    this.emitCounter = 0;
    this._uvFilled = 0;
}

Simulator.prototype.stop = function () {
    this.active = false;
    this.elapsed = this.sys.duration;
    this.emitCounter = 0;
}

Simulator.prototype.reset = function () {
    this.active = true;
    this.elapsed = 0;
    this.emitCounter = 0;
    this.finished = false;
    let particles = this.particles;
    for (let id = 0; id < particles.length; ++id)
        pool.put(particles[id]);
    particles.length = 0;
}

Simulator.prototype.emitParticle = function (pos) {
    let psys = this.sys;
    let clampf = misc.clampf;
    let particle = pool.get();
    this.particles.push(particle);

    // Init particle
    // timeToLive
    // no negative life. prevent division by 0
    particle.timeToLive = psys.life + psys.lifeVar * (Math.random() - 0.5) * 2;
    let timeToLive = particle.timeToLive = Math.max(0, particle.timeToLive);

    // position
    particle.pos.x = psys.sourcePos.x + psys.posVar.x * (Math.random() - 0.5) * 2;
    particle.pos.y = psys.sourcePos.y + psys.posVar.y * (Math.random() - 0.5) * 2;

    // Color
    let sr, sg, sb, sa;
    let startColor = psys._startColor, startColorVar = psys._startColorVar;
    let endColor = psys._endColor, endColorVar = psys._endColorVar;
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
    if (psys.endSize === cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE) {
        particle.deltaSize = 0;
    } else {
        var endS = psys.endSize + psys.endSizeVar * (Math.random() - 0.5) * 2;
        endS = Math.max(0, endS); // No negative values
        particle.deltaSize = (endS - startS) / timeToLive;
    }

    // rotation
    var startA = psys.startSpin + psys.startSpinVar * (Math.random() - 0.5) * 2;
    var endA = psys.endSpin + psys.endSpinVar * (Math.random() - 0.5) * 2;
    particle.rotation = startA;
    particle.deltaRotation = (endA - startA) / timeToLive;

    // position
    particle.startPos.x = pos.x;
    particle.startPos.y = pos.y;

    // direction
    let worldRotation = getWorldRotation(psys.node);
    let relAngle = psys.positionType === cc.ParticleSystem.PositionType.FREE ? psys.angle + worldRotation : psys.angle;
    let a = misc.degreesToRadians(relAngle + psys.angleVar * (Math.random() - 0.5) * 2);
    // Mode Gravity: A
    if (psys.emitterMode === cc.ParticleSystem.EmitterMode.GRAVITY) {
        let s = psys.speed + psys.speedVar * (Math.random() - 0.5) * 2;
        // direction
        particle.dir.x = Math.cos(a);
        particle.dir.y = Math.sin(a);
        particle.dir.mulSelf(s);
        // radial accel
        particle.radialAccel = psys.radialAccel + psys.radialAccelVar * (Math.random() - 0.5) * 2;
        // tangential accel
        particle.tangentialAccel = psys.tangentialAccel + psys.tangentialAccelVar * (Math.random() - 0.5) * 2;
        // rotation is dir
        if (psys.rotationIsDir) {
            particle.rotation = -misc.radiansToDegrees(Math.atan2(particle.dir.y, particle.dir.x));
        }
    }
    // Mode Radius: B
    else {
        // Set the default diameter of the particle from the source position
        var startRadius = psys.startRadius + psys.startRadiusVar * (Math.random() - 0.5) * 2;
        var endRadius = psys.endRadius + psys.endRadiusVar * (Math.random() - 0.5) * 2;
        particle.radius = startRadius;
        particle.deltaRadius = (psys.endRadius === cc.ParticleSystem.START_RADIUS_EQUAL_TO_END_RADIUS) ? 0 : (endRadius - startRadius) / timeToLive;
        particle.angle = a;
        particle.degreesPerSecond = misc.degreesToRadians(psys.rotatePerS + psys.rotatePerSVar * (Math.random() - 0.5) * 2);
    }
};
// In the Free mode to get emit real rotation in the world coordinate.
function getWorldRotation (node) {
    let rotation = 0;
    let tempNode = node;
    while (tempNode) {
        rotation += tempNode.angle;
        tempNode = tempNode.parent;
    }
    return rotation;
}

Simulator.prototype.updateUVs = function (force) {
    let particleCount = this.particles.length;
    let assembler = this.sys._assembler;
    let buffer = assembler.getBuffer();
    if (buffer && this.sys._renderSpriteFrame) {
        const FLOAT_PER_PARTICLE = 4 * assembler._vfmt._bytes / 4;
        let vbuf = buffer._vData;
        let uv = this.sys._renderSpriteFrame.uv;

        let start = force ? 0 : this._uvFilled;
        for (let i = start; i < particleCount; i++) {
            let offset = i * FLOAT_PER_PARTICLE;
            vbuf[offset+2] = uv[0];
            vbuf[offset+3] = uv[1];
            vbuf[offset+7] = uv[2];
            vbuf[offset+8] = uv[3];
            vbuf[offset+12] = uv[4];
            vbuf[offset+13] = uv[5];
            vbuf[offset+17] = uv[6];
            vbuf[offset+18] = uv[7];
        }
        this._uvFilled = particleCount;
    }
}

Simulator.prototype.updateParticleBuffer = function (particle, pos, buffer, offset) {
    let vbuf = buffer._vData;
    let uintbuf = buffer._uintVData;
    
    let x = pos.x, y = pos.y;
    let size_2 = particle.size / 2;
    // pos
    if (particle.rotation) {
        let x1 = -size_2, y1 = -size_2;
        let x2 = size_2, y2 = size_2;
        let rad = -misc.degreesToRadians(particle.rotation);
        let cr = Math.cos(rad), sr = Math.sin(rad);
        // bl
        vbuf[offset] = x1 * cr - y1 * sr + x;
        vbuf[offset+1] = x1 * sr + y1 * cr + y;
        // br
        vbuf[offset+5] = x2 * cr - y1 * sr + x;
        vbuf[offset+6] = x2 * sr + y1 * cr + y;
        // tl
        vbuf[offset+10] = x1 * cr - y2 * sr + x;
        vbuf[offset+11] = x1 * sr + y2 * cr + y;
        // tr
        vbuf[offset+15] = x2 * cr - y2 * sr + x;
        vbuf[offset+16] = x2 * sr + y2 * cr + y;
    }
    else {
        // bl
        vbuf[offset] = x - size_2;
        vbuf[offset+1] = y - size_2;
        // br
        vbuf[offset+5] = x + size_2;
        vbuf[offset+6] = y - size_2;
        // tl
        vbuf[offset+10] = x - size_2;
        vbuf[offset+11] = y + size_2;
        // tr
        vbuf[offset+15] = x + size_2;
        vbuf[offset+16] = y + size_2;
    }
    // color
    uintbuf[offset+4] = particle.color._val;
    uintbuf[offset+9] = particle.color._val;
    uintbuf[offset+14] = particle.color._val;
    uintbuf[offset+19] = particle.color._val;
};

Simulator.prototype.step = function (dt) {
    let psys = this.sys;
    let node = psys.node;
    let particles = this.particles;
    const FLOAT_PER_PARTICLE = 4 * this.sys._assembler._vfmt._bytes / 4;

    // Calculate pos
    node._updateWorldMatrix();
    _trans = AffineTrans.identity();
    if (psys.positionType === cc.ParticleSystem.PositionType.FREE) {
        let m =  node._worldMatrix.m;
        _trans.tx = m[12];
        _trans.ty = m[13];
        AffineTrans.transformVec2(_pos, ZERO_VEC2, _trans);
    } else if (psys.positionType === cc.ParticleSystem.PositionType.RELATIVE) {
        let angle = misc.degreesToRadians(-node.angle);
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        _trans = AffineTrans.create(cos, -sin, sin, cos, 0, 0);
        _pos.x = node.x;
        _pos.y = node.y;
    }

    // Get world to node trans only once
    AffineTrans.invert(_trans, _trans);
    let worldToNodeTrans = _trans;

    // Emission
    if (this.active && psys.emissionRate) {
        var rate = 1.0 / psys.emissionRate;
        //issue #1201, prevent bursts of particles, due to too high emitCounter
        if (particles.length < psys.totalParticles)
            this.emitCounter += dt;

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
    let buffer = psys._assembler.getBuffer();
    let particleCount = particles.length;
    buffer.reset();
    buffer.request(particleCount * 4, particleCount * 6);

    // Fill up uvs
    if (particleCount > this._uvFilled) {
        this.updateUVs();
    }

    // Used to reduce memory allocation / creation within the loop
    let particleIdx = 0;
    while (particleIdx < particles.length) {
        // Reset temporary vectors
        _tpa.x = _tpa.y = _tpb.x = _tpb.y = _tpc.x = _tpc.y = 0;

        let particle = particles[particleIdx];

        // life
        particle.timeToLive -= dt;
        if (particle.timeToLive > 0) {
            // Mode A: gravity, direction, tangential accel & radial accel
            if (psys.emitterMode === cc.ParticleSystem.EmitterMode.GRAVITY) {
                let tmp = _tpc, radial = _tpa, tangential = _tpb;

                // radial acceleration
                if (particle.pos.x || particle.pos.y) {
                    radial.set(particle.pos);
                    radial.normalizeSelf();
                }
                tangential.set(radial);
                radial.mulSelf(particle.radialAccel);

                // tangential acceleration
                let newy = tangential.x;
                tangential.x = -tangential.y;
                tangential.y = newy;

                tangential.mulSelf(particle.tangentialAccel);

                tmp.set(radial);
                tmp.addSelf(tangential);
                tmp.addSelf(psys.gravity);
                tmp.mulSelf(dt);
                particle.dir.addSelf(tmp);

                tmp.set(particle.dir);
                tmp.mulSelf(dt);
                particle.pos.addSelf(tmp);
            }
            // Mode B: radius movement
            else {
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
            let newPos = _tpa;
            let diff = _tpb;
            if (psys.positionType === cc.ParticleSystem.PositionType.FREE) {
                diff.set(particle.startPos);
                diff.negSelf();  // Unify direction with other positionType
                newPos.set(particle.pos);
                newPos.subSelf(diff);
            }
            else if (psys.positionType === cc.ParticleSystem.PositionType.RELATIVE) {
                let startPos = _tpc;
                // current Position convert To Node Space
                AffineTrans.transformVec2(diff, _pos, worldToNodeTrans);
                // start Position convert To Node Space
                AffineTrans.transformVec2(startPos, particle.startPos, worldToNodeTrans);
                diff.subSelf(startPos);
                newPos.set(particle.pos);
                newPos.subSelf(diff);
            } else {
                newPos.set(particle.pos);
            }

            let offset = FLOAT_PER_PARTICLE * particleIdx;
            this.updateParticleBuffer(particle, newPos, buffer, offset);

            // update particle counter
            ++particleIdx;
        } else {
            // life < 0
            let deadParticle = particles[particleIdx];
            if (particleIdx !== particles.length - 1) {
                particles[particleIdx] = particles[particles.length - 1];
            }
            pool.put(deadParticle);
            particles.length--;
        }
    }

    if (particles.length > 0) {
        buffer.uploadData();
        psys._assembler._ia._count = particles.length * 6;
    }
    else if (!this.active) {
        this.finished = true;
        psys._finishedSimulation();
    }
}

module.exports = Simulator;