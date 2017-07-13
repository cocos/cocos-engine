#include "CCPhysicsAABBQueryCallback.h"

using namespace cocos2d;

namespace creator {
    
PhysicsAABBQueryCallback::PhysicsAABBQueryCallback()
: _isPoint(false)
{
}

void PhysicsAABBQueryCallback::init()
{
    _isPoint = false;
    _fixtures.clear();
}
    
void PhysicsAABBQueryCallback::init(const b2Vec2& p)
{
    _isPoint = true;
    _point = p;
    _fixtures.clear();
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

const std::vector<b2Fixture*> PhysicsAABBQueryCallback::getFixtures() const
{
    return _fixtures;
}

}
