/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

#include "CCPhysicsContactListener.h"
#include "cocos2d.h"

using namespace cocos2d;

namespace creator {

std::vector<PhysicsContactListener*> PhysicsContactListener::__allInstances;

const std::vector<PhysicsContactListener*>& PhysicsContactListener::getAllInstances()
{
    return __allInstances;
}

PhysicsContactListener::PhysicsContactListener() 
{
    __allInstances.push_back(this);
}

PhysicsContactListener::~PhysicsContactListener()
{
    auto iter = std::find(__allInstances.begin(), __allInstances.end(), this);
    if (iter != __allInstances.end())
    {
        __allInstances.erase(iter);
    }
}

void PhysicsContactListener::setBeginContact(const std::function<void(b2Contact* contact)>& callback)
{
    _beginContact = callback;
}

void PhysicsContactListener::setEndContact(const std::function<void(b2Contact* contact)>& callback)
{
    _endContact = callback;
}

void PhysicsContactListener::setPreSolve(const std::function<void(b2Contact* contact)>& callback)
{
    _preSolve = callback;
}

void PhysicsContactListener::setPostSolve(const std::function<void(b2Contact* contact, const PhysicsContactImpulse* impulse)>& callback)
{
    _postSolve = callback;
}


void PhysicsContactListener::BeginContact(b2Contact* contact)
{
    if (!_beginContact) return;

    b2Fixture* fixtureA = contact->GetFixtureA();
    b2Fixture* fixtureB = contact->GetFixtureB();

    if (find(_contactFixtures.begin(), _contactFixtures.end(), fixtureA) != _contactFixtures.end() ||
        find(_contactFixtures.begin(), _contactFixtures.end(), fixtureB) != _contactFixtures.end())
    {
        _contactMap[contact] = true;
        _beginContact(contact);
    }

}

void PhysicsContactListener::EndContact(b2Contact* contact)
{
    if (!_endContact) return;

    auto i = _contactMap.find(contact);
    if (i != _contactMap.end())
    {
        _endContact(contact);
        _contactMap.erase(i);
    }
}

void PhysicsContactListener::PreSolve(b2Contact* contact, const b2Manifold* oldManifold)
{
    if (!_preSolve) return;

    if (_contactMap.find(contact) != _contactMap.end())
    {
        _preSolve(contact);
    }
}

void PhysicsContactListener::PostSolve(b2Contact* contact, const b2ContactImpulse* impulse)
{
    if (!_postSolve) return;

    if (_contactMap.find(contact) != _contactMap.end())
    {
        _impulse.init(impulse);
        _postSolve(contact, &_impulse);
    }
}

void PhysicsContactListener::registerContactFixture(b2Fixture* fixture)
{
    _contactFixtures.push_back(fixture);
}

void PhysicsContactListener::unregisterContactFixture(b2Fixture* fixture)
{
    auto result = find(_contactFixtures.begin(), _contactFixtures.end(), fixture);
    if (result != _contactFixtures.end())
    {
        _contactFixtures.erase(result);
    }
}

}
