#include "CCPhysicsAABBQueryCallback.h"

using namespace cocos2d;

namespace creator {
    
PhysicsAABBQueryCallback::PhysicsAABBQueryCallback()
: _isPoint(false)
{
}

PhysicsAABBQueryCallback::PhysicsAABBQueryCallback(const b2Vec2& p)
: _isPoint(false)
{
    _point = p;
}

PhysicsAABBQueryCallback::~PhysicsAABBQueryCallback()
{
}

bool PhysicsAABBQueryCallback::ReportFixture(b2Fixture* fixture)
{
    b2Body* body = fixture->GetBody();
    if (body->GetType() == b2_dynamicBody) {
        if (_isPoint) {
            if (fixture->TestPoint(_point)) {
                _fixtures.push_back(fixture);
                // We are done, terminate the query.
                return false;
            }
        }
        else {
            _fixtures.push_back(fixture);
        }
    }

    // Continue the query.
    return true;
}

b2Fixture* PhysicsAABBQueryCallback::getFixture()
{
    return _fixtures.size() > 0 ? _fixtures[0] : nullptr;
}

std::vector<b2Fixture*> PhysicsAABBQueryCallback::getFixtures()
{
    return _fixtures;
}

}
