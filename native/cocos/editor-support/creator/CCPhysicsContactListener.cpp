#include "CCPhysicsContactListener.h"
#include "cocos2d.h"

using namespace cocos2d;

namespace creator {
    
PhysicsContactListener::PhysicsContactListener() 
{
}

PhysicsContactListener::~PhysicsContactListener() {
}

void PhysicsContactListener::setBeginContact(std::function<void(b2Contact* contact)> callback)
{
    _beginContact = callback;
}

void PhysicsContactListener::setEndContact(std::function<void(b2Contact* contact)> callback)
{
    _endContact = callback;
}

void PhysicsContactListener::setPreSolve(std::function<void(b2Contact* contact, const b2Manifold* oldManifold)> callback)
{
    _preSolve = callback;
}

void PhysicsContactListener::setPostSolve(std::function<void(b2Contact* contact, const b2ContactImpulse* impulse)> callback)
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
        _beginContact(contact);
    }

}

void PhysicsContactListener::EndContact(b2Contact* contact)
{
    if (!_endContact) return;

    b2Fixture* fixtureA = contact->GetFixtureA();
    b2Fixture* fixtureB = contact->GetFixtureB();

    if (find(_contactFixtures.begin(), _contactFixtures.end(), fixtureA) != _contactFixtures.end() ||
        find(_contactFixtures.begin(), _contactFixtures.end(), fixtureB) != _contactFixtures.end())
    {
        _endContact(contact);
    }
}

void PhysicsContactListener::PreSolve(b2Contact* contact, const b2Manifold* oldManifold)
{
    if (!_preSolve) return;

    b2Fixture* fixtureA = contact->GetFixtureA();
    b2Fixture* fixtureB = contact->GetFixtureB();

    if (find(_contactFixtures.begin(), _contactFixtures.end(), fixtureA) != _contactFixtures.end() ||
        find(_contactFixtures.begin(), _contactFixtures.end(), fixtureB) != _contactFixtures.end())
    {
        _preSolve(contact, oldManifold);
    }
}

void PhysicsContactListener::PostSolve(b2Contact* contact, const b2ContactImpulse* impulse)
{
    if (!_postSolve) return;

    b2Fixture* fixtureA = contact->GetFixtureA();
    b2Fixture* fixtureB = contact->GetFixtureB();

    if (find(_contactFixtures.begin(), _contactFixtures.end(), fixtureA) != _contactFixtures.end() ||
        find(_contactFixtures.begin(), _contactFixtures.end(), fixtureB) != _contactFixtures.end())
    {
        _postSolve(contact, impulse);
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
