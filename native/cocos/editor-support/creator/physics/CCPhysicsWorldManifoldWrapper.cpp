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
