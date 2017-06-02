
/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 
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

#ifndef __CREATOR_CCGRAPHICSNODE_H__
#define __CREATOR_CCGRAPHICSNODE_H__

#include "2d/CCNode.h"
#include "renderer/CCCustomCommand.h"

namespace creator {

// join: bevel, round, miter
// cap : butt, round, square
enum LineCap
{
    CAP_BUTT,
    CAP_ROUND,
    CAP_SQUARE,
};

enum LineJoin
{
    JOIN_BEVEL,
    JOIN_ROUND,
    JOIN_MITER,
};

enum PointFlags
{
    PT_CORNER = 0x01,
    PT_LEFT = 0x02,
    PT_BEVEL = 0x04,
    PT_INNERBEVEL = 0x08,
};

struct VecVertex {
    float x,y,u,v;
};
typedef struct VecVertex VecVertex;

class VecPoint: public cocos2d::Vec2
{
public:
    VecPoint()
    {
        reset();
    }

    VecPoint(float x, float y)
        : Vec2(x, y)
    {
        reset();
    }
    
    void reset () {
        dx = 0;
        dy = 0;
        dmx = 0;
        dmy = 0;
        flags = 0;
        len = 0;
    }

    float dx;
    float dy;
    float dmx;
    float dmy;
    unsigned char flags;
    float len;
};

typedef std::vector< VecPoint* > VecPointVector;

struct Path
{
    VecPointVector points;
    bool closed;
    bool convex;
    int nbevel;

    bool complex;
};
typedef struct Path Path;
    
struct Command
{
    cocos2d::Color4F color;
    float strokeMult;
        
    int nVerts;
    int vertsOffset;
    int nIndices;
    int indicesOffset;
};
typedef struct Command Command;
typedef std::vector< Command* > CommandVector;


class CC_DLL GraphicsNode : public cocos2d::Node
{
public:

    static GraphicsNode* create();

    void setLineCap(LineCap cap) { _lineCap = cap; }
    LineCap getLineCap() { return _lineCap; }

    void setLineJoin(LineJoin join) { _lineJoin = join; }
    LineJoin getLineJoin() { return _lineJoin; }

    void setLineWidth(float width) { _lineWidth = width; }
    float getLineWidth() { return _lineWidth; }

    void setMiterLimit(float miterLimit) { _miterLimit = miterLimit; }
    float getMiterLimit() { return _miterLimit; }

    void setStrokeColor(const cocos2d::Color4F& color) {
        _strokeColor = color;
    }
    cocos2d::Color4F getStrokeColor() { return _strokeColor; }

    void setFillColor(const cocos2d::Color4F& color) { _fillColor = color; }
    cocos2d::Color4F getFillColor() { return _fillColor; }

    void setDeviceRatio(float ratio) {
        _ratio = ratio;
        _fringeWidth = 1.0f / _ratio;
        _tessTol = 0.25f / _ratio;
        _distTol = 0.01f / _ratio;
    }
    float getDeviceRatio() { return _ratio; }

    // draw command
    void moveTo(float x, float y);
    void lineTo(float x, float y);
    void bezierCurveTo(float c1x, float c1y, float c2x, float c2y, float x, float y);
    void quadraticCurveTo(float cx, float cy, float x, float y);
    void arcTo(float x1, float y1, float x2, float y2, float radius);

    void arc(float cx, float cy, float r, float startAngle, float endAngle, bool counterclockwise);
    void rect(float x, float y, float w, float h);
    void roundRect(float x, float y, float w, float h, float r);
    void ellipse(float cx, float cy, float rx, float ry);
    void circle(float cx, float cy, float r);
    
    void fillRect(float x, float y, float w, float h);

    void close();

    void beginPath();

    void stroke();
    void fill();

    void clear(bool clean=false);
public:

    void draw(cocos2d::Renderer *renderer, const cocos2d::Mat4 &transform, uint32_t flags);
    void onDraw(const cocos2d::Mat4 &transform, uint32_t flags);

public:

    GraphicsNode();
    virtual ~GraphicsNode();

protected:

    static int mini(int a, int b) { return a < b ? a : b; }
    static int maxi(int a, int b) { return a > b ? a : b; }
    static int clampi(int a, int mn, int mx) { return a < mn ? mn : (a > mx ? mx : a); }
    static float minf(float a, float b) { return a < b ? a : b; }
    static float maxf(float a, float b) { return a > b ? a : b; }
    static float absf(float a) { return a >= 0.0f ? a : -a; }
    static float signf(float a) { return a >= 0.0f ? 1.0f : -1.0f; }
    static float clampf(float a, float mn, float mx) { return a < mn ? mn : (a > mx ? mx : a); }
    static float cross(float dx0, float dy0, float dx1, float dy1) { return dx1*dy0 - dx0*dy1; }

    static int ptEquals(float x1, float y1, float x2, float y2, float tol);
    static float distPtSeg(float x, float y, float px, float py, float qx, float qy);

    static float normalize(float *x, float* y);
    static int curveDivs(float r, float arc, float tol);
    
    static void chooseBevel(int bevel, VecPoint* p0, VecPoint* p1, float w,
                            float* x0, float* y0, float* x1, float* y1);

protected:
    void tesselateBezier(float x1, float y1, float x2, float y2,
                         float x3, float y3, float x4, float y4,
                         int level, int type);

    void addPoint(Path* path, float x, float y, int flags);
    Path* addPath();

    void flattenPaths();

    void expandStroke(float w, int lineCap, int lineJoin, float miterLimit);
    void expandFill(float w, int lineJoin, float miterLimit);

    void calculateJoins(float w, int lineJoin, float miterLimit);

    void allocVerts(int count);
    void allocIndices(int count);
    
    void vset(float x, float y, float u, float v);
    
    void pushCommand(cocos2d::Color4F& color, float strokeMult, int vertsOffset, int nVerts, int indicesOffset, int nIndices);
    
    void buttCapStart(VecPoint* p, float dx, float dy, float w, float d, float aa);
    void buttCapEnd(VecPoint* p, float dx, float dy, float w, float d, float aa);
    void roundCapStart(VecPoint* p, float dx, float dy, float w, int ncap, float aa);
    void roundCapEnd(VecPoint* p, float dx, float dy, float w, int ncap, float aa);
    
    void roundJoin(VecPoint* p0, VecPoint* p1, float lw, float rw, float lu, float ru, int ncap, float fringe);
    void bevelJoin(VecPoint* p0, VecPoint* p1, float lw, float rw, float lu, float ru, float fringe);
protected:

    cocos2d::CustomCommand _customCommand;

    bool _vertsDirty;
    bool _indicesDirty;
    bool _needUpdatePathOffset;


    GLuint _buffersVBO[2];
    float _ratio;

    float _lineWidth;
    float _miterLimit;
    LineCap _lineCap;
    LineJoin _lineJoin;
    cocos2d::Color4F _strokeColor;
    cocos2d::Color4F _fillColor;

    float _fringeWidth;

    float _tessTol;
    float _distTol;

    float _commandx;
    float _commandy;

    // points
    int _nPoints;
    VecPointVector _points;
    
    // commands
    int _nCommands;
    CommandVector _commands;
    
    
    // path
    int _nPath;
    int _pathOffset;
    std::vector<Path*> _paths;
    
    Path* _curPath;

    // verts
    int _nVerts;
    int _vertsOffset;
    VecVertex* _verts;

    // indices
    int _nIndices;
    int _indicesOffset;
    GLushort* _indices;
    bool _insideBounds;
};

}

#endif /* defined(__CREATOR_CCGRAPHICSNODE_H__) */
