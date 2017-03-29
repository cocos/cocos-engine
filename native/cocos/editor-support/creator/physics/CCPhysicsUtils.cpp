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
    
void PhysicsUtils::setFixtureNext(b2Fixture* fixture, b2Fixture* next)
{
    b2Fixture* f = fixture->GetNext();
    *&f = next;
}

const PhysicsWorldManifoldWrapper* PhysicsUtils::getContactWorldManifoldWrapper(b2Contact* contact)
{
    _worldManifoldWrapper.init(contact);
    contact->GetWorldManifold(_worldManifoldWrapper.getb2WorldManifold());
    return &_worldManifoldWrapper;
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
