/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 
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

#ifndef CCPhysicsWorldManifoldWrapper_h
#define CCPhysicsWorldManifoldWrapper_h

#include "Box2D/Box2D.h"
#include "cocos2d.h"

namespace creator {
    class CC_DLL PhysicsWorldManifoldWrapper
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
