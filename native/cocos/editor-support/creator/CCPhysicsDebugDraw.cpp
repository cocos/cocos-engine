#include "CCPhysicsDebugDraw.h"
#include "CCGL.h"

#include "cocos2d.h"

#include <cstdio>
#include <cstdarg>

#include <cstring>

using namespace cocos2d;

namespace creator {
    
PhysicsDebugDraw::PhysicsDebugDraw( float32 ratio )
: mRatio( ratio )
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
            _drawer->moveTo(old_vertices[i].x * mRatio, old_vertices[i].y * mRatio);
        else {
            _drawer->lineTo(old_vertices[i].x * mRatio, old_vertices[i].y * mRatio);
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
            _drawer->moveTo(old_vertices[i].x * mRatio, old_vertices[i].y * mRatio);
        else {
            _drawer->lineTo(old_vertices[i].x * mRatio, old_vertices[i].y * mRatio);
        }
    }
    _drawer->close();
    _drawer->fill();
}

void PhysicsDebugDraw::DrawCircle(const b2Vec2& center, float32 radius, const b2Color& color)
{
    Color4F c(color.r, color.g, color.b, /*color.a*/0.5);
    _drawer->setStrokeColor(c);
    
    _drawer->circle(center.x * mRatio, center.y * mRatio, radius * mRatio);
    _drawer->stroke();
}

void PhysicsDebugDraw::DrawSolidCircle(const b2Vec2& center, float32 radius, const b2Vec2& axis, const b2Color& color)
{
    Color4F c(color.r, color.g, color.b, /*color.a*/0.5);
    _drawer->setFillColor(c);
    
    _drawer->circle(center.x * mRatio, center.y * mRatio, radius * mRatio);
    _drawer->fill();
}

void PhysicsDebugDraw::DrawSegment(const b2Vec2& p1, const b2Vec2& p2, const b2Color& color)
{
    Color4F c(color.r, color.g, color.b, /*color.a*/0.5);
    _drawer->setStrokeColor(c);
    
    _drawer->moveTo(p1.x * mRatio, p1.y * mRatio);
    _drawer->lineTo(p2.x * mRatio, p2.y * mRatio);
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
