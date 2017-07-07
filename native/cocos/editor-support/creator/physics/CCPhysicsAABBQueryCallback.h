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

#ifndef CCPhysicsAABBQueryCallback_h
#define CCPhysicsAABBQueryCallback_h

#include "Box2D/Box2D.h"
#include "cocos2d.h"

namespace creator {

class CC_DLL PhysicsAABBQueryCallback : public b2QueryCallback
{
public:
    PhysicsAABBQueryCallback();
    
    void init();
    void init(const b2Vec2& p);
    
    ~PhysicsAABBQueryCallback();
    
    virtual bool ReportFixture(b2Fixture* fixture);
    
    b2Fixture* getFixture() const;
    const std::vector<b2Fixture*>& getFixtures() const;
    
protected:
    b2Vec2 _point;
    std::vector<b2Fixture*> _fixtures;
    bool _isPoint;
};

}

#endif /* CCPhysicsAABBQueryCallback_h */
