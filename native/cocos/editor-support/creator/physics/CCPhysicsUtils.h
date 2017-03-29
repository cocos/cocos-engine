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

#ifndef PhysicsUtils_H
#define PhysicsUtils_H

#include <vector>

#include "Box2D/Box2D.h"
#include "cocos2d.h"

#include "CCPhysicsWorldManifoldWrapper.h"

namespace creator {

// This class implements debug drawing callbacks that are invoked
// inside b2World::Step.
class CC_DLL PhysicsUtils
{
public:
    PhysicsUtils();
    ~PhysicsUtils();
    
    void addB2Body(b2Body* body);
    void removeB2Body(b2Body* body);
    
    void syncNode();
    
    void setFixtureNext(b2Fixture* fixture, b2Fixture* next);
    
public:
    static const PhysicsWorldManifoldWrapper* getContactWorldManifoldWrapper(b2Contact* contact);
    
protected:
    cocos2d::Vec2 _convertToNodePosition(cocos2d::Node* node, cocos2d::Vec2& position);
    float _convertToNodeRotation(cocos2d::Node* node, float rotation);
    
    std::vector<b2Body*> _bodies;
};
    
}

#endif
