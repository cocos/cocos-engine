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

#ifndef PhysicsContactListener_H
#define PhysicsContactListener_H

#include "Box2D/Box2D.h"
#include "cocos2d.h"
#include <functional>
#include <vector>

namespace creator {

class CC_DLL PhysicsContactListener : public b2ContactListener
{
public:
    PhysicsContactListener();
    virtual ~PhysicsContactListener();
    
    void setBeginContact(std::function<void(b2Contact* contact)> callback);
    void setEndContact(std::function<void(b2Contact* contact)> callback);
    void setPreSolve(std::function<void(b2Contact* contact, const b2Manifold* oldManifold)> callback);
    void setPostSolve(std::function<void(b2Contact* contact, const b2ContactImpulse* impulse)> callback);
    
    
    virtual void BeginContact(b2Contact* contact);
    virtual void EndContact(b2Contact* contact);
    virtual void PreSolve(b2Contact* contact, const b2Manifold* oldManifold);
    virtual void PostSolve(b2Contact* contact, const b2ContactImpulse* impulse);
    
    void registerContactFixture(b2Fixture* fixture);
    void unregisterContactFixture(b2Fixture* fixture);
    
protected:
    std::function<void(b2Contact* contact)> _beginContact;
    std::function<void(b2Contact* contact)> _endContact;
    std::function<void(b2Contact* contact, const b2Manifold* oldManifold)> _preSolve;
    std::function<void(b2Contact* contact, const b2ContactImpulse* impulse)> _postSolve;
  
    std::vector<b2Fixture*> _contactFixtures;
};

}

#endif
