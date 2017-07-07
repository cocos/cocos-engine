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

#ifndef CCPhysicsRayCastCallback_h
#define CCPhysicsRayCastCallback_h

#include "Box2D/Box2D.h"
#include "cocos2d.h"

namespace creator {

class CC_DLL PhysicsRayCastCallback : public b2RayCastCallback
{
public:
    PhysicsRayCastCallback();
    ~PhysicsRayCastCallback();
    
    void init(int type);
    
    virtual float32 ReportFixture(b2Fixture* fixture, const b2Vec2& point, const b2Vec2& normal, float32 fraction);
    
    const std::vector<b2Fixture*>& getFixtures() const;
    const std::vector<b2Vec2>& getPoints() const;
    const std::vector<b2Vec2>& getNormals() const;
    const std::vector<float>& getFractions() const;
    
    int getType() const;
    
protected:
    int _rayCastType;
    
    std::vector<b2Fixture*> _fixtures;
    std::vector<b2Vec2> _points;
    std::vector<b2Vec2> _normals;
    std::vector<float> _fractions;
};

}

#endif /* CCPhysicsRayCastCallback_h */
