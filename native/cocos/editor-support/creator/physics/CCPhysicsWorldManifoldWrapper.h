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

#ifndef CCPhysicsWorldManifoldWrapper_h
#define CCPhysicsWorldManifoldWrapper_h

#include "Box2D/Box2D.h"
#include "cocos2d.h"

namespace creator {
    class PhysicsWorldManifoldWrapper : public cocos2d::Ref
    {
    public:
        PhysicsWorldManifoldWrapper();
        ~PhysicsWorldManifoldWrapper();
        
        void init(b2Contact* contact);
        b2WorldManifold* getb2WorldManifold();
        
        int getCount();
        float32 getX(int index);
        float32 getY(int index);
        float32 getSeparation(int index);
        float32 getNormalX();
        float32 getNormalY();
        
    protected:
        b2WorldManifold _manifold;
        b2Contact* _contact;
    };
}


#endif /* CCPhysicsWorldManifoldWrapper_h */
