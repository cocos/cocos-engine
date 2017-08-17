#include "CCPhysicsRayCastCallback.h"

using namespace cocos2d;

namespace creator {
    
PhysicsRayCastCallback::PhysicsRayCastCallback()
{
}

PhysicsRayCastCallback::~PhysicsRayCastCallback() {
}
    
void PhysicsRayCastCallback::init(int type)
{
    _rayCastType = type;
    
    _fixtures.clear();
    _normals.clear();
    _points.clear();
    _fractions.clear();
}

float32 PhysicsRayCastCallback::ReportFixture(b2Fixture* fixture, const b2Vec2& point, const b2Vec2& normal, float32 fraction)
{
    if (_rayCastType == 0) {
        if (_fixtures.size() > 0) {
            _fixtures[0] = fixture;
            _normals[0] = normal;
            _points[0] = point;
            _fractions[0] = fraction;
        }
        else {
            _fixtures.push_back(fixture);
            _normals.push_back(normal);
            _points.push_back(point);
            _fractions.push_back(fraction);
        }

        return fraction;
    }

    _fixtures.push_back(fixture);
    _normals.push_back(normal);
    _points.push_back(point);
    _fractions.push_back(fraction);

    if (_rayCastType == 1) {
        return 0;
    }
    else {
        return 1;
    }

    return fraction;
}

const std::vector<b2Fixture*>& PhysicsRayCastCallback::getFixtures() const {
    return _fixtures;
}

const std::vector<b2Vec2>& PhysicsRayCastCallback::getPoints() const {
    return _points;
}

const std::vector<b2Vec2>& PhysicsRayCastCallback::getNormals() const {
    return _normals;
}
    
const std::vector<float>& PhysicsRayCastCallback::getFractions() const {
    return _fractions;
}

int PhysicsRayCastCallback::getType() const {
    return _rayCastType;
}

}
