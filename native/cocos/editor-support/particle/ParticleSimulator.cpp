/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
#include "ParticleSimulator.h"
#include "base/ccRandom.h"
#include <algorithm>
#include "base/ccMacros.h"
#include "math/Mat4.h"
#include "MiddlewareManager.h"
#include "middleware-adapter.h"
#include "renderer/scene/assembler/CustomAssembler.hpp"
#include "math/Vec2.h"

USING_NS_MW;

NS_CC_BEGIN

// global particle pool
static ParticlePool _pool;

void Particle::reset()
{
    pos = cocos2d::Vec3::ZERO;
    startPos = cocos2d::Vec3::ZERO;
    color = cocos2d::Color4B::BLACK;
    deltaColor = cocos2d::Color4B::BLACK;
    size = 0;
    deltaSize = 0;
    rotation = 0;
    deltaRotation = 0;
    timeToLive = 0;
    drawPos = cocos2d::Vec3::ZERO;
    
    // Mode A
    dir = cocos2d::Vec3::ZERO;
    radialAccel = 0;
    tangentialAccel = 0;
    
    // Mode B
    angle = 0;
    degreesPerSecond = 0;
    radius = 0;
    deltaRadius = 0;
}

ParticlePool::ParticlePool()
{
    
}

ParticlePool::~ParticlePool()
{
    for (auto particle : _pool)
    {
        delete particle;
    }
    _pool.clear();
}

ParticleSimulator::ParticleSimulator()
{
    
}

ParticleSimulator::~ParticleSimulator()
{
    onDisable();
    
    CC_SAFE_RELEASE(_effect);
    CC_SAFE_RELEASE(_nodeProxy);
    
    for (auto particle : _particles)
    {
        delete particle;
    }
    _particles.clear();
}

void ParticleSimulator::stop()
{
    _active = false;
    _elapsed = duration;
    _emitCounter = 0;
}

void ParticleSimulator::reset()
{
    _active = true;
    _elapsed = 0;
    _emitCounter = 0;
    _finished = false;
    for (auto particle : _particles)
    {
        _pool.put(particle);
    }
    _particles.clear();
}

void ParticleSimulator::emitParticle(cocos2d::Vec3 &pos)
{
    auto& particle = *_pool.get();
    _particles.push_back(&particle);
    
    // Init particle
    // timeToLive
    // no negative life. prevent division by 0
    particle.timeToLive = life + lifeVar * random(-1.0f, 1.0f);
    // avoid divide zero
    float timeToLive = particle.timeToLive = std::max(0.001f, particle.timeToLive);

    // position
    particle.pos.x = _sourcePos.x + _posVar.x * random(-1.0f, 1.0f);
    particle.pos.y = _sourcePos.y + _posVar.y * random(-1.0f, 1.0f);
    
    // Color
    GLubyte sr, sg, sb, sa;
    particle.color.r = sr = clampf(_startColor.r + _startColorVar.r * random(-1.0f, 1.0f), 0, 255);
    particle.color.g = sg = clampf(_startColor.g + _startColorVar.g * random(-1.0f, 1.0f), 0, 255);
    particle.color.b = sb = clampf(_startColor.b + _startColorVar.b * random(-1.0f, 1.0f), 0, 255);
    particle.color.a = sa = clampf(_startColor.a + _startColorVar.a * random(-1.0f, 1.0f), 0, 255);
    particle.deltaColor.r = (clampf(_endColor.r + _endColorVar.r * random(-1.0f, 1.0f), 0, 255) - sr) / timeToLive;
    particle.deltaColor.g = (clampf(_endColor.g + _endColorVar.g * random(-1.0f, 1.0f), 0, 255) - sg) / timeToLive;
    particle.deltaColor.b = (clampf(_endColor.b + _endColorVar.b * random(-1.0f, 1.0f), 0, 255) - sb) / timeToLive;
    particle.deltaColor.a = (clampf(_endColor.a + _endColorVar.a * random(-1.0f, 1.0f), 0, 255) - sa) / timeToLive;
    
    // size
    float startS = startSize + startSizeVar * random(-1.0f, 1.0f);
    startS = std::max(0.0f, startS); // No negative value
    particle.size = startS;
    if (endSize == START_SIZE_EQUAL_TO_END_SIZE)
    {
        particle.deltaSize = 0;
    }
    else
    {
        float endS = endSize + endSizeVar * random(-1.0f, 1.0f);
        endS = std::max(0.0f, endS); // No negative values
        particle.deltaSize = (endS - startS) / timeToLive;
    }
    
    // rotation
    float startA = startSpin + startSpinVar * random(-1.0f, 1.0f);
    float endA = endSpin + endSpinVar * random(-1.0f, 1.0f);
    particle.rotation = startA;
    particle.deltaRotation = (endA - startA) / timeToLive;
    
    // position
    particle.startPos.x = pos.x;
    particle.startPos.y = pos.y;
    
    // direction
    float a = CC_DEGREES_TO_RADIANS(angle + angleVar * random(-1.0f, 1.0f));
    // Mode Gravity: A
    if (emitterMode == EmitterMode::GRAVITY)
    {
        float s = speed + speedVar * random(-1.0f, 1.0f);
        // direction
        particle.dir.x = cos(a);
        particle.dir.y = sin(a);
        particle.dir.scale(s);
        // radial accel
        particle.radialAccel = radialAccel + radialAccelVar * random(-1.0f, 1.0f);
        // tangential accel
        particle.tangentialAccel = tangentialAccel + tangentialAccelVar * random(-1.0f, 1.0f);
        // rotation is dir
        if (rotationIsDir)
        {
            particle.rotation = -CC_RADIANS_TO_DEGREES(atan2(particle.dir.y, particle.dir.x));
        }
    }
    // Mode Radius: B
    else
    {
        // Set the default diameter of the particle from the source position
        float tempStartRadius = startRadius + startRadiusVar * random(-1.0f, 1.0f);
        float tempEndRadius = endRadius + endRadiusVar * random(-1.0f, 1.0f);
        particle.radius = tempStartRadius;
        particle.deltaRadius = (endRadius == START_RADIUS_EQUAL_TO_END_RADIUS) ? 0 : (tempEndRadius - tempStartRadius) / timeToLive;
        particle.angle = a;
        particle.degreesPerSecond = CC_DEGREES_TO_RADIANS(rotatePerS + rotatePerSVar * random(-1.0f, 1.0f));
    }
}

void ParticleSimulator::onEnable()
{
    MiddlewareManager::getInstance()->addTimer(this);
}

void ParticleSimulator::onDisable()
{
    MiddlewareManager::getInstance()->removeTimer(this);
}

void ParticleSimulator::render(float dt)
{
    if (_finished || _nodeProxy == nullptr || _effect == nullptr)
    {
        return;
    }
    
    // uv size must equal 8,because per particle has 4 vertex.
    if (_uv.size() != 8)
    {
        return;
    }
    
    renderer::CustomAssembler* assembler = (renderer::CustomAssembler*)_nodeProxy->getAssembler();
    if (assembler == nullptr)
    {
        return;
    }
    assembler->reset();
    assembler->updateEffect(0, _effect);
    
    // avoid other place call update.
    auto mgr = MiddlewareManager::getInstance();
    if (!mgr->isRendering) return;
    
    middleware::MeshBuffer* mb = mgr->getMeshBuffer(VF_XYUVC);
    middleware::IOBuffer& vb = mb->getVB();
    middleware::IOBuffer& ib = mb->getIB();
    
    // Calculate pos
    auto worldMatrix = _nodeProxy->getWorldMatrix();
    
    cocos2d::Vec3 pos;
    cocos2d::Vec3 tpa;
    cocos2d::Vec3 tpb;
    cocos2d::Vec3 tpc;
    
    if (positionType == PositionType::FREE)
    {
        worldMatrix.transformPoint(&pos);
    }
    else if (positionType == PositionType::RELATIVE)
    {
        _nodeProxy->getPosition(&pos);
    }
    
    // Get world to node trans only once
    worldMatrix.inverse();
    
    // Emission
    if (_active && emissionRate)
    {
        float rate = 1.0 / emissionRate;
        //issue #1201, prevent bursts of particles, due to too high emitCounter
        if (_particles.size() < totalParticles)
            _emitCounter += dt;
        
        while ((_particles.size() < totalParticles) && (_emitCounter > rate))
        {
            emitParticle(pos);
            _emitCounter -= rate;
        }
        
        _elapsed += dt;
        if (duration != -1 && duration < _elapsed)
        {
            _stopCallback();
        }
    }
    
    // Used to reduce memory allocation / creation within the loop
    std::size_t particleIdx = 0;
    std::size_t particleSize = _particles.size();
    vb.checkSpace(particleSize * 4 * sizeof (middleware::V2F_T2F_C4B));
    ib.checkSpace(particleSize * 6 * sizeof (unsigned short));
    std::size_t vbOffset = vb.getCurPos() / sizeof (middleware::V2F_T2F_C4B);
    uint32_t indexStart = (uint32_t)ib.getCurPos()/sizeof(unsigned short);
    uint32_t indexCount = 0;
    
    while (particleIdx < particleSize)
    {
        // Reset temporary vectors
        tpa.x = tpa.y = tpb.x = tpb.y = tpc.x = tpc.y = 0;
        
        auto& particle = *_particles[particleIdx];
        
        // life
        particle.timeToLive -= dt;
        if (particle.timeToLive > 0)
        {
            // Mode A: gravity, direction, tangential accel & radial accel
            if (emitterMode == EmitterMode::GRAVITY)
            {
                auto& tmp = tpc;
                auto& radial = tpa;
                auto& tangential = tpb;
                
                // radial acceleration
                if (particle.pos.x || particle.pos.y)
                {
                    radial.set(particle.pos);
                    radial.normalize();
                }
                tangential.set(radial);
                radial.scale(particle.radialAccel);
                
                // tangential acceleration
                auto newy = tangential.x;
                tangential.x = -tangential.y;
                tangential.y = newy;
                
                tangential.scale(particle.tangentialAccel);
                
                tmp.set(radial);
                tmp.add(tangential);
                tmp.add(_gravity.x, _gravity.y, _gravity.z);
                tmp.scale(dt);
                particle.dir.add(tmp);
                
                tmp.set(particle.dir);
                tmp.scale(dt);
                particle.pos.add(tmp);
            }
            // Mode B: radius movement
            else
            {
                // Update the angle and radius of the particle.
                particle.angle += particle.degreesPerSecond * dt;
                particle.radius += particle.deltaRadius * dt;
                
                particle.pos.x = -cos(particle.angle) * particle.radius;
                particle.pos.y = -sin(particle.angle) * particle.radius;
            }
            
            // color
            particle.color.r += particle.deltaColor.r * dt;
            particle.color.g += particle.deltaColor.g * dt;
            particle.color.b += particle.deltaColor.b * dt;
            particle.color.a += particle.deltaColor.a * dt;
            
            // size
            particle.size += particle.deltaSize * dt;
            if (particle.size < 0)
            {
                particle.size = 0;
            }
            
            // angle
            particle.rotation += particle.deltaRotation * dt;
            
            // update values in quad buffer
            auto& newPos = tpa;
            if (positionType == PositionType::FREE || positionType == PositionType::RELATIVE)
            {
                auto& diff = tpb;
                auto& startPos = tpc;
                // current Position convert To Node Space
                worldMatrix.transformPoint(pos, &diff);
                // start Position convert To Node Space
                worldMatrix.transformPoint(particle.startPos, &startPos);
                diff.add(-startPos.x, -startPos.y, -startPos.z);
                newPos.set(particle.pos);
                newPos.add(-diff.x, -diff.y, -diff.z);
            }
            else
            {
                newPos.set(particle.pos);
            }
            
            auto x = newPos.x, y = newPos.y;
            auto size_2 = particle.size * 0.5;
            auto x1 = -size_2, y1 = -size_2;
            auto x2 = size_2, y2 = size_2;
            
            auto rad = -CC_DEGREES_TO_RADIANS(particle.rotation);
            auto cr = cos(rad), sr = sin(rad);
            uint32_t tempColor = ((particle.color.a << 24) & 0xff000000) +
                                 ((particle.color.b << 16) & 0x00ff0000) +
                                 ((particle.color.g << 8)  & 0x0000ff00) +
                                 ((particle.color.r)       & 0x000000ff);
            // bl
            vb.writeFloat32(x1 * cr - y1 * sr + x);
            vb.writeFloat32(x1 * sr + y1 * cr + y);
            vb.writeFloat32(_uv[0]);
            vb.writeFloat32(_uv[1]);
            vb.writeUint32(tempColor);
            
            // br
            vb.writeFloat32(x2 * cr - y1 * sr + x);
            vb.writeFloat32(x2 * sr + y1 * cr + y);
            vb.writeFloat32(_uv[2]);
            vb.writeFloat32(_uv[3]);
            vb.writeUint32(tempColor);
            
            // tl
            vb.writeFloat32(x1 * cr - y2 * sr + x);
            vb.writeFloat32(x1 * sr + y2 * cr + y);
            vb.writeFloat32(_uv[4]);
            vb.writeFloat32(_uv[5]);
            vb.writeUint32(tempColor);
            
            // tr
            vb.writeFloat32(x2 * cr - y2 * sr + x);
            vb.writeFloat32(x2 * sr + y2 * cr + y);
            vb.writeFloat32(_uv[6]);
            vb.writeFloat32(_uv[7]);
            vb.writeUint32(tempColor);
            
            ib.writeUint16(vbOffset);
            ib.writeUint16(vbOffset + 1);
            ib.writeUint16(vbOffset + 2);
            ib.writeUint16(vbOffset + 1);
            ib.writeUint16(vbOffset + 3);
            ib.writeUint16(vbOffset + 2);
            
            vbOffset += 4;
            indexCount += 6;
            
            // update particle counter
            ++particleIdx;
        }
        else
        {
            // life < 0
            auto deadParticle = _particles[particleIdx];
            if (particleIdx != particleSize - 1)
            {
                _particles[particleIdx] = _particles[particleSize - 1];
            }
            _pool.put(deadParticle);
            particleSize--;
            _particles.resize(particleSize);
        }
    }
    
    assembler->updateIABuffer(0, mb->getGLVB(), mb->getGLIB());
    assembler->updateIARange(0, indexStart, indexCount);
    
    if (_particles.size() == 0 && !_active)
    {
        _finished = true;
        if (_finishedCallback)
        {
            _finishedCallback();
        }
    }
}

NS_CC_END
