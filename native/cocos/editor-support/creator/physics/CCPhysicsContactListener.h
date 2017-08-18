/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 
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

#ifndef PhysicsContactListener_H
#define PhysicsContactListener_H

#include "Box2D/Box2D.h"
#include "cocos2d.h"
#include "CCPhysicsContactImpulse.h"

#include <functional>
#include <vector>


namespace creator {

class CC_DLL PhysicsContactListener : public b2ContactListener
{
public:

    static const std::vector<PhysicsContactListener*>& getAllInstances();

    PhysicsContactListener();
    virtual ~PhysicsContactListener();
    
    void setBeginContact(const std::function<void(b2Contact* contact)>& callback);
    void setEndContact(const std::function<void(b2Contact* contact)>& callback);
    void setPreSolve(const std::function<void(b2Contact* contact)>& callback);
    void setPostSolve(const std::function<void(b2Contact* contact, const PhysicsContactImpulse* impulse)>& callback);
    
    
    virtual void BeginContact(b2Contact* contact) override;
    virtual void EndContact(b2Contact* contact) override;
    virtual void PreSolve(b2Contact* contact, const b2Manifold* oldManifold) override;
    virtual void PostSolve(b2Contact* contact, const b2ContactImpulse* impulse) override;
    
    void registerContactFixture(b2Fixture* fixture);
    void unregisterContactFixture(b2Fixture* fixture);
    
protected:
    std::function<void(b2Contact* contact)> _beginContact;
    std::function<void(b2Contact* contact)> _endContact;
    std::function<void(b2Contact* contact)> _preSolve;
    std::function<void(b2Contact* contact, const PhysicsContactImpulse* impulse)> _postSolve;
  
    std::vector<b2Fixture*> _contactFixtures;
    PhysicsContactImpulse _impulse;
    
    std::unordered_map<b2Contact*, bool> _contactMap;

    static std::vector<PhysicsContactListener*> __allInstances;
};

}

#endif
