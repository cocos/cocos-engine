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
#include <algorithm>

namespace creator {

class CC_DLL PhysicsContactListener : public b2ContactListener
{
public:
    PhysicsContactListener() {}
    virtual ~PhysicsContactListener() {
    }
    
    void setBeginContact(std::function<void(b2Contact* contact)> callback)
    {
        _beginContact = callback;
    }
    
    void setEndContact(std::function<void(b2Contact* contact)> callback)
    {
        _endContact = callback;
    }
    
    void setPreSolve(std::function<void(b2Contact* contact, const b2Manifold* oldManifold)> callback)
    {
        _preSolve = callback;
    }
    
    void setPostSolve(std::function<void(b2Contact* contact, const b2ContactImpulse* impulse)> callback)
    {
        _postSolve = callback;
    }
    
    
    virtual void BeginContact(b2Contact* contact)
    {
        if (!_beginContact) return;
        
        b2Fixture* fixtureA = contact->GetFixtureA();
        b2Fixture* fixtureB = contact->GetFixtureB();
        
        if (find(_contactFixtures.begin(), _contactFixtures.end(), fixtureA) != _contactFixtures.end( ) ||
            find(_contactFixtures.begin(), _contactFixtures.end(), fixtureB) != _contactFixtures.end( ))
        {
            _beginContact(contact);
        }
        
    }
    
    virtual void EndContact(b2Contact* contact)
    {
        if (!_endContact) return;
        
        b2Fixture* fixtureA = contact->GetFixtureA();
        b2Fixture* fixtureB = contact->GetFixtureB();
        
        if (find(_contactFixtures.begin(), _contactFixtures.end(), fixtureA) != _contactFixtures.end( ) ||
            find(_contactFixtures.begin(), _contactFixtures.end(), fixtureB) != _contactFixtures.end( ))
        {
            _endContact(contact);
        }
    }
    
    virtual void PreSolve(b2Contact* contact, const b2Manifold* oldManifold)
    {
        if (!_preSolve) return;
        
        b2Fixture* fixtureA = contact->GetFixtureA();
        b2Fixture* fixtureB = contact->GetFixtureB();
        
        if (find(_contactFixtures.begin(), _contactFixtures.end(), fixtureA) != _contactFixtures.end( ) ||
            find(_contactFixtures.begin(), _contactFixtures.end(), fixtureB) != _contactFixtures.end( ))
        {
            _preSolve(contact, oldManifold);
        }
    }
    
    virtual void PostSolve(b2Contact* contact, const b2ContactImpulse* impulse)
    {
        if (!_postSolve) return;
        
        b2Fixture* fixtureA = contact->GetFixtureA();
        b2Fixture* fixtureB = contact->GetFixtureB();
        
        if (find(_contactFixtures.begin(), _contactFixtures.end(), fixtureA) != _contactFixtures.end( ) ||
            find(_contactFixtures.begin(), _contactFixtures.end(), fixtureB) != _contactFixtures.end( ))
        {
            _postSolve(contact, impulse);
        }
    }
    
    void registerContactFixture (b2Fixture* fixture)
    {
        _contactFixtures.push_back(fixture);
    }
    
    void unregisterContactFixture (b2Fixture* fixture)
    {
        auto result = find(_contactFixtures.begin(), _contactFixtures.end(), fixture);
        if ( result != _contactFixtures.end( ) )
        {
            _contactFixtures.erase(result);
        }
    }
    
protected:
    std::function<void(b2Contact* contact)> _beginContact;
    std::function<void(b2Contact* contact)> _endContact;
    std::function<void(b2Contact* contact, const b2Manifold* oldManifold)> _preSolve;
    std::function<void(b2Contact* contact, const b2ContactImpulse* impulse)> _postSolve;
  
    std::vector<b2Fixture*> _contactFixtures;
};

}

#endif
