#include "CCPhysicsRayCastCallback.h"

using namespace cocos2d;

namespace creator {
    
PhysicsRayCastCallback::PhysicsRayCastCallback(int type)
{
    _rayCastType = type;
}

PhysicsRayCastCallback::~PhysicsRayCastCallback() {
}

float32 PhysicsRayCastCallback::ReportFixture(b2Fixture* fixture, const b2Vec2& point, const b2Vec2& normal, float32 fraction)
{
    if (_rayCastType == 0) {
        if (_fixtures.size() > 0) {
            _fixtures[0] = fixture;
            _normals[0] = normal;
            _points[0] = point;
        }
        else {
            _fixtures.push_back(fixture);
            _normals.push_back(normal);
            _points.push_back(point);
        }

        return fraction;
    }

    _fixtures.push_back(fixture);
    _normals.push_back(normal);
    _points.push_back(point);

    if (_rayCastType == 1) {
        return 0;
    }
    else {
        return 1;
    }

    return fraction;
}

std::vector<b2Fixture*>& PhysicsRayCastCallback::getFixtures() {
    return _fixtures;
}

std::vector<b2Vec2>& PhysicsRayCastCallback::getPoints() {
    return _points;
}

std::vector<b2Vec2>& PhysicsRayCastCallback::getNormals() {
    return _normals;
}

int PhysicsRayCastCallback::getType() {
    return _rayCastType;
}

}
