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
    PhysicsRayCastCallback(int type);
    ~PhysicsRayCastCallback();
    
    virtual float32 ReportFixture(b2Fixture* fixture, const b2Vec2& point, const b2Vec2& normal, float32 fraction);
    
    std::vector<b2Fixture*>& getFixtures();
    std::vector<b2Vec2>& getPoints();
    std::vector<b2Vec2>& getNormals();
    
    int getType();
    
protected:
    int _rayCastType;
    
    std::vector<b2Fixture*> _fixtures;
    std::vector<b2Vec2> _points;
    std::vector<b2Vec2> _normals;
};

}

#endif /* CCPhysicsRayCastCallback_h */
