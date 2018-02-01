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

//
//  CCPhysicsUtils.cpp
//  cocos2d_libs
//
//  Created by youyou on 16/12/22.
//
//

#include "CCPhysicsUtils.h"
#include "CCPhysicsDefine.h"

using namespace cocos2d;

namespace creator {

static PhysicsWorldManifoldWrapper _worldManifoldWrapper;
static PhysicsManifoldWrapper _manifoldWrapper;

PhysicsUtils::PhysicsUtils()
{
    
}
    
PhysicsUtils::~PhysicsUtils()
{
        
}
    
void PhysicsUtils::addB2Body(b2Body* body)
{
    _bodies.push_back(body);
}
    
void PhysicsUtils::removeB2Body(b2Body *body)
{
    const auto iterator = std::find(_bodies.begin(), _bodies.end(), body);
    if (iterator != _bodies.end())
    {
        _bodies.erase(iterator);
    }
}
    
void PhysicsUtils::syncNode()
{
    for (auto begin = _bodies.begin(); begin != _bodies.end(); begin++)
    {
        b2Body* body = *begin;
        Node* node = (Node*)body->GetUserData();
        
        const b2Vec2& pos = body->GetPosition();
        
        Vec2 position(pos.x*CC_PTM_RATIO, pos.y*CC_PTM_RATIO);
        float angle = -CC_RADIANS_TO_DEGREES(body->GetAngle());
        
        if (node->getParent() && node->getParent()->getParent()) {
            node->setPosition( _convertToNodePosition(node->getParent(), position) );
            node->setRotation( _convertToNodeRotation(node->getParent(), angle) );
        }
        else {
            node->setPosition(position);
            node->setRotation(angle);
        }
    }
}
    
const PhysicsWorldManifoldWrapper* PhysicsUtils::getContactWorldManifoldWrapper(b2Contact* contact)
{
    _worldManifoldWrapper.init(contact);
    contact->GetWorldManifold(_worldManifoldWrapper.getb2WorldManifold());
    return &_worldManifoldWrapper;
}
    
const PhysicsManifoldWrapper* PhysicsUtils::getContactManifoldWrapper(b2Contact* contact)
{
    _manifoldWrapper.init(contact);
    return &_manifoldWrapper;
}
    
cocos2d::Vec2 PhysicsUtils::_convertToNodePosition(cocos2d::Node* node, cocos2d::Vec2& position)
{
    if (node->isIgnoreAnchorPointForPosition()) {
        // see https://github.com/cocos-creator/engine/pull/391
        return node->convertToNodeSpace(position);
    }
    else {
        return node->convertToNodeSpaceAR(position);
    }
}

float PhysicsUtils::_convertToNodeRotation(cocos2d::Node* node, float rotation)
{
    rotation -= node->getRotation();
    Node* parent = node->getParent();
    while(parent->getParent()){
        rotation -= parent->getRotation();
        parent = parent->getParent();
    }
    return rotation;
}
    
}
