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
