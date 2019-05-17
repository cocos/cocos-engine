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
#pragma once
#include "MiddlewareMacro.h"
#include "math/Vec3.h"
#include "base/ccTypes.h"
#include <vector>
#include "IOBuffer.h"
#include "renderer/scene/NodeProxy.hpp"
#include "renderer/renderer/Effect.h"
#include "MiddlewareManager.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"

NS_CC_BEGIN

struct Particle {
public:
    cocos2d::Vec3 pos;
    cocos2d::Vec3 startPos;
    cocos2d::Color4B color = cocos2d::Color4B::BLACK;
    cocos2d::Color4B deltaColor = cocos2d::Color4B::BLACK;
    float size = 0.0f;
    float deltaSize = 0.0f;
    float rotation = 0.0f;
    float deltaRotation = 0.0f;
    float timeToLive = 0.0f;
    cocos2d::Vec3 drawPos;

    // Mode A
    cocos2d::Vec3 dir;
    float radialAccel = 0.0f;
    float tangentialAccel = 0.0f;
    
    // Mode B
    float angle = 0.0f;
    float degreesPerSecond = 0.0f;
    float radius = 0.0f;
    float deltaRadius = 0.0f;

    bool inPool = false;
    void reset();
};

class ParticlePool {
public:
    ParticlePool();
    ~ParticlePool();
    
    void put(Particle* particle)
    {
        CCASSERT(!particle->inPool, "Particle is in pool already");
        _pool.push_back(particle);
        particle->inPool = true;
        particle->reset();
    }
    
    Particle* get()
    {
        Particle* obj = nullptr;
        if (_pool.size() > 0)
        {
            obj = _pool.back();
            _pool.pop_back();
            obj->inPool = false;
        } else {
            obj = new Particle();
        }
        return obj;
    }
    
private:
    std::vector<Particle*> _pool;
};

enum PositionType
{
    FREE = 0,
    RELATIVE = 1,
    GROUPED = 2
};

enum EmitterMode
{
    GRAVITY = 0,
    RADIUS = 1
};

class ParticleSimulator : public cocos2d::middleware::IMiddleware, public cocos2d::Ref {
    
    //* @enum
    enum {
        /** The Particle emitter lives forever. */
        DURATION_INFINITY = -1,
        
        /** The starting size of the particle is equal to the ending size. */
        START_SIZE_EQUAL_TO_END_SIZE = -1,
        
        /** The starting radius of the particle is equal to the ending radius. */
        START_RADIUS_EQUAL_TO_END_RADIUS = -1,
    };
    
public:
    ParticleSimulator();
    ~ParticleSimulator();
    void stop();
    void reset();
    void emitParticle(cocos2d::Vec3& pos);
    void update(float dt);
    void onEnable();
    void onDisable();
    
    typedef std::function<void()> finishedCallback;
    void setFinishedCallback(finishedCallback callback)
    {
        _finishedCallback = callback;
    }
    
    typedef std::function<void()> stopCallback;
    void setStopCallback(stopCallback callback)
    {
        _stopCallback = callback;
    }
    
    void bindNodeProxy(cocos2d::renderer::NodeProxy* node)
    {
        CC_SAFE_RELEASE(_nodeProxy);
        _nodeProxy = node;
        CC_SAFE_RETAIN(_nodeProxy);
    }
    
    void setNativeEffect(cocos2d::renderer::Effect* effect)
    {
        CC_SAFE_RELEASE(_effect);
        _effect = effect;
        CC_SAFE_RETAIN(_effect);
    }
    
    void updateUVs(const std::vector<float>& uv)
    {
        _uv = uv;
    }
    
    std::size_t getParticleCount()
    {
        return _particles.size();
    }
    
    bool active()
    {
        return _active;
    }
    
    void setGravity(float x, float y, float z)
    {
        _gravity.x = x;
        _gravity.y = y;
        _gravity.z = z;
    }
    
    void setSourcePos(float x, float y, float z)
    {
        _sourcePos.x = x;
        _sourcePos.y = y;
        _sourcePos.z = z;
    }
    
    void setPosVar(float x, float y, float z)
    {
        _posVar.x = x;
        _posVar.y = y;
        _posVar.z = z;
    }
    
    void setStartColor(GLubyte r, GLubyte g, GLubyte b, GLubyte a)
    {
        _startColor.r = r;
        _startColor.g = g;
        _startColor.b = b;
        _startColor.a = a;
    }
    
    void setStartColorVar(GLubyte r, GLubyte g, GLubyte b, GLubyte a)
    {
        _startColorVar.r = r;
        _startColorVar.g = g;
        _startColorVar.b = b;
        _startColorVar.a = a;
    }
    
    void setEndColor(GLubyte r, GLubyte g, GLubyte b, GLubyte a)
    {
        _endColor.r = r;
        _endColor.g = g;
        _endColor.b = b;
        _endColor.a = a;
    }
    
    void setEndColorVar(GLubyte r, GLubyte g, GLubyte b, GLubyte a)
    {
        _endColorVar.r = r;
        _endColorVar.g = g;
        _endColorVar.b = b;
        _endColorVar.a = a;
    }
    
private:
    std::vector<Particle*>          _particles;
    bool                            _active = false;
    bool                            _finished = false;
    float                           _elapsed = 0;
    float                           _emitCounter = 0;
    std::size_t                     _uvFilled = 0;
    finishedCallback                _finishedCallback = nullptr;
    stopCallback                    _stopCallback = nullptr;
    cocos2d::renderer::NodeProxy*   _nodeProxy = nullptr;
    cocos2d::renderer::Effect*      _effect = nullptr;
    std::vector<float>              _uv;
    
    cocos2d::Vec3      _gravity;
    cocos2d::Vec3      _sourcePos;
    cocos2d::Vec3      _posVar;
    cocos2d::Color4B   _startColor = cocos2d::Color4B::BLACK;
    cocos2d::Color4B   _startColorVar = cocos2d::Color4B::WHITE;
    cocos2d::Color4B   _endColor = cocos2d::Color4B::BLACK;
    cocos2d::Color4B   _endColorVar = cocos2d::Color4B::WHITE;
public:
    int                 positionType        = PositionType::FREE;
    float               emissionRate        = 0.0f;
    std::size_t         totalParticles      = 0;
    float               duration            = -1.0f;
    int                 emitterMode         = EmitterMode::GRAVITY;
    float               life                = 0.0f;
    float               lifeVar             = 0.0f;
    float               startSize           = 0.0f;
    float               startSizeVar        = 0.0f;
    float               endSize             = 0.0f;
    float               endSizeVar          = 0.0f;
    float               startSpin           = 0.0f;
    float               startSpinVar        = 0.0f;
    float               endSpin             = 0.0f;
    float               endSpinVar          = 0.0f;
    float               angle               = 0.0f;
    float               angleVar            = 0.0f;
    float               speed               = 0.0f;
    float               speedVar            = 0.0f;
    float               radialAccel         = 0.0f;
    float               radialAccelVar      = 0.0f;
    float               tangentialAccel     = 0.0f;
    float               tangentialAccelVar  = 0.0f;
    bool                rotationIsDir       = false;
    float               startRadius         = 0.0f;
    float               startRadiusVar      = 0.0f;
    float               endRadius           = 0.0f;
    float               endRadiusVar        = 0.0f;
    float               rotatePerS          = 0.0f;
    float               rotatePerSVar       = 0.0f;
};

NS_CC_END
