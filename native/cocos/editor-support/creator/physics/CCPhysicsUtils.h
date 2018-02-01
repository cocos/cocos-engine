/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
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

#ifndef PhysicsUtils_H
#define PhysicsUtils_H

#include <vector>

#include "Box2D/Box2D.h"
#include "cocos2d.h"

#include "CCPhysicsWorldManifoldWrapper.h"
#include "CCPhysicsManifoldWrapper.h"

namespace creator {

// This class implements debug drawing callbacks that are invoked
// inside b2World::Step.
class CC_DLL PhysicsUtils
{
public:
    PhysicsUtils();
    ~PhysicsUtils();
    
public:
    void addB2Body(b2Body* body);
    void removeB2Body(b2Body* body);
    
    void syncNode();
public:
    static const PhysicsWorldManifoldWrapper* getContactWorldManifoldWrapper(b2Contact* contact);
    static const PhysicsManifoldWrapper* getContactManifoldWrapper(b2Contact* contact);
protected:
    cocos2d::Vec2 _convertToNodePosition(cocos2d::Node* node, cocos2d::Vec2& position);
    float _convertToNodeRotation(cocos2d::Node* node, float rotation);
    
    std::vector<b2Body*> _bodies;
};
    
}

#endif
