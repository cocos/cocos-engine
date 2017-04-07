/*
 * Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
 *
 * iPhone port by Simon Oliver - http://www.simonoliver.com - http://www.handcircus.com
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */


#include "CCPhysicsManifoldWrapper.h"
#include "CCPhysicsDefine.h"

namespace creator {
    PhysicsManifoldWrapper::PhysicsManifoldWrapper()
    {
    }
    PhysicsManifoldWrapper::~PhysicsManifoldWrapper()
    {
    }
    
    void PhysicsManifoldWrapper::init(b2Contact* contact)
    {
        _contact = contact;
        _manifold = _contact->GetManifold();
    }
    
    int PhysicsManifoldWrapper::getCount()
    {
        return _manifold->pointCount;
    }
    int PhysicsManifoldWrapper::getType()
    {
        return _manifold->type;
    }
    
    float32 PhysicsManifoldWrapper::getX(int index)
    {
        return _manifold->points[index].localPoint.x * CC_PTM_RATIO;
    }
    float32 PhysicsManifoldWrapper::getY(int index)
    {
        return _manifold->points[index].localPoint.y * CC_PTM_RATIO;
    }
    float32 PhysicsManifoldWrapper::getNormalImpulse(int index)
    {
        return _manifold->points[index].normalImpulse * CC_PTM_RATIO;
    }
    float32 PhysicsManifoldWrapper::getTangentImpulse(int index)
    {
        return _manifold->points[index].tangentImpulse;
    }
    float32 PhysicsManifoldWrapper::getLocalNormalX()
    {
        return _manifold->localNormal.x;
    }
    float32 PhysicsManifoldWrapper::getLocalNormalY()
    {
        return _manifold->localNormal.y;
    }
    float32 PhysicsManifoldWrapper::getLocalPointX()
    {
        return _manifold->localPoint.x * CC_PTM_RATIO;
    }
    float32 PhysicsManifoldWrapper::getLocalPointY()
    {
        return _manifold->localPoint.y * CC_PTM_RATIO;
    }
}
