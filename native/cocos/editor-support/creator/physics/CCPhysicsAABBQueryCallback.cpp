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

b2Fixture* PhysicsAABBQueryCallback::getFixture() const
{
    return _fixtures.size() > 0 ? _fixtures[0] : nullptr;
}

const std::vector<b2Fixture*>& PhysicsAABBQueryCallback::getFixtures() const
{
    return _fixtures;
}

}
