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

#include "CCPhysicsDebugDraw.h"
#include "CCPhysicsDefine.h"

#include "cocos2d.h"

using namespace cocos2d;

namespace creator {
    
PhysicsDebugDraw::PhysicsDebugDraw()
{
    _drawer = GraphicsNode::create();
    _drawer->retain();
}

PhysicsDebugDraw::~PhysicsDebugDraw()
{
    _drawer->release();
}

creator::GraphicsNode* PhysicsDebugDraw::getDrawer()
{
    return _drawer;
}
    
void PhysicsDebugDraw::ClearDraw()
{
    _drawer->clear();
}

void PhysicsDebugDraw::AddDrawerToNode(cocos2d::Node *node)
{
    _drawer->removeFromParent();
    node->addChild(_drawer);
}

void PhysicsDebugDraw::DrawPolygon(const b2Vec2* old_vertices, int vertexCount, const b2Color& color)
{
    Color4F c(color.r, color.g, color.b, /*color.a*/0.5);
    _drawer->setStrokeColor(c);
    
    for( int i=0;i<vertexCount;i++) {
        if (i == 0)
            _drawer->moveTo(old_vertices[i].x * CC_PTM_RATIO, old_vertices[i].y * CC_PTM_RATIO);
        else {
            _drawer->lineTo(old_vertices[i].x * CC_PTM_RATIO, old_vertices[i].y * CC_PTM_RATIO);
        }
    }
    _drawer->close();
    _drawer->stroke();
}

void PhysicsDebugDraw::DrawSolidPolygon(const b2Vec2* old_vertices, int vertexCount, const b2Color& color)
{
    Color4F c(color.r, color.g, color.b, /*color.a*/0.5);
    _drawer->setFillColor(c);
    
    for( int i=0;i<vertexCount;i++) {
        if (i == 0)
            _drawer->moveTo(old_vertices[i].x * CC_PTM_RATIO, old_vertices[i].y * CC_PTM_RATIO);
        else {
            _drawer->lineTo(old_vertices[i].x * CC_PTM_RATIO, old_vertices[i].y * CC_PTM_RATIO);
        }
    }
    _drawer->close();
    _drawer->fill();
}

void PhysicsDebugDraw::DrawCircle(const b2Vec2& center, float32 radius, const b2Color& color)
{
    Color4F c(color.r, color.g, color.b, /*color.a*/0.5);
    _drawer->setStrokeColor(c);
    
    _drawer->circle(center.x * CC_PTM_RATIO, center.y * CC_PTM_RATIO, radius * CC_PTM_RATIO);
    _drawer->stroke();
}

void PhysicsDebugDraw::DrawSolidCircle(const b2Vec2& center, float32 radius, const b2Vec2& axis, const b2Color& color)
{
    Color4F c(color.r, color.g, color.b, /*color.a*/0.5);
    _drawer->setFillColor(c);
    
    _drawer->circle(center.x * CC_PTM_RATIO, center.y * CC_PTM_RATIO, radius * CC_PTM_RATIO);
    _drawer->fill();
}

void PhysicsDebugDraw::DrawSegment(const b2Vec2& p1, const b2Vec2& p2, const b2Color& color)
{
    Color4F c(color.r, color.g, color.b, /*color.a*/0.5);
    _drawer->setStrokeColor(c);
    
    _drawer->moveTo(p1.x * CC_PTM_RATIO, p1.y * CC_PTM_RATIO);
    _drawer->lineTo(p2.x * CC_PTM_RATIO, p2.y * CC_PTM_RATIO);
    _drawer->stroke();
}

void PhysicsDebugDraw::DrawTransform(const b2Transform& xf)
{
    //	b2Vec2 p1 = xf.p, p2;
    //	const float32 k_axisScale = 0.4f;
    //
    //	p2 = p1 + k_axisScale * xf.R.col1;
    //	DrawSegment(p1,p2,b2Color(1,0,0));
    //
    //	p2 = p1 + k_axisScale * xf.R.col2;
    //	DrawSegment(p1,p2,b2Color(0,1,0));
}

}
