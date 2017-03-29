//
//  CCPhysicsWorldManifoldWrapper.cpp
//  cocos2d_libs
//
//  Created by youyou on 17/3/28.
//
//

#include "CCPhysicsWorldManifoldWrapper.h"
#include "CCPhysicsDefine.h"

namespace creator {
    PhysicsWorldManifoldWrapper::PhysicsWorldManifoldWrapper()
    {
    }
    PhysicsWorldManifoldWrapper::~PhysicsWorldManifoldWrapper()
    {
    }
    
    void PhysicsWorldManifoldWrapper::init(b2Contact* contact)
    {
        _contact = contact;
    }
    b2WorldManifold* PhysicsWorldManifoldWrapper::getb2WorldManifold()
    {
        return &_manifold;
    }
    
    int PhysicsWorldManifoldWrapper::getCount()
    {
        b2Manifold* m = _contact->GetManifold();
        return m->pointCount;
    }
    
    float32 PhysicsWorldManifoldWrapper::getX(int index)
    {
        return _manifold.points[index].x * CC_PTM_RATIO;
    }
    float32 PhysicsWorldManifoldWrapper::getY(int index)
    {
        return _manifold.points[index].y * CC_PTM_RATIO;
    }
    float32 PhysicsWorldManifoldWrapper::getSeparation(int index)
    {
        return _manifold.separations[index] * CC_PTM_RATIO;
    }
    float32 PhysicsWorldManifoldWrapper::getNormalX()
    {
        return _manifold.normal.x;
    }
    float32 PhysicsWorldManifoldWrapper::getNormalY()
    {
        return _manifold.normal.y;
    }
}
