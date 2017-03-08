/*
 * Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
 *
 * iPhone port by Simon Oliver - http://www.simonoliver.com - http://www.handcircus.com
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

#ifndef CCPhysicsRayCastCallback_h
#define CCPhysicsRayCastCallback_h

#include "Box2D/Box2D.h"
#include "cocos2d.h"

namespace creator {

class CC_DLL PhysicsRayCastCallback : public b2RayCastCallback
{
public:
    PhysicsRayCastCallback (int type)
    {
        _rayCastType = type;
    }
    
    ~PhysicsRayCastCallback() {}
    
    virtual float32 ReportFixture(b2Fixture* fixture, const b2Vec2& point, const b2Vec2& normal, float32 fraction)
    {
        if (_rayCastType == 0) {
            if (_fixtures.size() > 0) {
                _fixtures[0] = fixture;
                _normals[0] = normal;
                _points[0] = point;
            }
            else {
                _fixtures.push_back(fixture);
                _normals.push_back(normal);
                _points.push_back(point);
            }
            
            return fraction;
        }
        
        _fixtures.push_back(fixture);
        _normals.push_back(normal);
        _points.push_back(point);
        
        if (_rayCastType == 1) {
            return 0;
        }
        else {
            return 1;
        }
        
        return fraction;
    }
    
    std::vector<b2Fixture*>& getFixtures () {
        return _fixtures;
    }
    
    std::vector<b2Vec2>& getPoints () {
        return _points;
    }
    
    std::vector<b2Vec2>& getNormals () {
        return _normals;
    }
    
    int getType () {
        return _rayCastType;
    }
    
protected:
    int _rayCastType;
    
    std::vector<b2Fixture*> _fixtures;
    std::vector<b2Vec2> _points;
    std::vector<b2Vec2> _normals;
};

}

#endif /* CCPhysicsRayCastCallback_h */
