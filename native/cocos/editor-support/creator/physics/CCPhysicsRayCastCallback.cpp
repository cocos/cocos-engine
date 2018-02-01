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
