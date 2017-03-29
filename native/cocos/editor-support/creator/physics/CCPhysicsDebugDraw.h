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

#ifndef PhysicsDebugDraw_H
#define PhysicsDebugDraw_H

#include "Box2D/Box2D.h"
#include "editor-support/creator/CCGraphicsNode.h"

namespace creator {

// This class implements debug drawing callbacks that are invoked
// inside b2World::Step.
class CC_DLL PhysicsDebugDraw : public b2Draw
{
public:
    PhysicsDebugDraw();
    ~PhysicsDebugDraw();
    
    creator::GraphicsNode* getDrawer();
    
    void ClearDraw();
    
    void AddDrawerToNode(cocos2d::Node* node);
    
    void DrawPolygon(const b2Vec2* vertices, int32 vertexCount, const b2Color& color);
    
    void DrawSolidPolygon(const b2Vec2* vertices, int32 vertexCount, const b2Color& color);
    
    void DrawCircle(const b2Vec2& center, float32 radius, const b2Color& color);
    
    void DrawSolidCircle(const b2Vec2& center, float32 radius, const b2Vec2& axis, const b2Color& color);
    
    void DrawSegment(const b2Vec2& p1, const b2Vec2& p2, const b2Color& color);
    
    void DrawTransform(const b2Transform& xf);
    
protected:
    creator::GraphicsNode* _drawer;
    
};

}

#endif
