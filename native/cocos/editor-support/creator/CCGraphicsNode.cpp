
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

#include "CCGraphicsNode.h"
#include "base/CCDirector.h"
#include "renderer/CCRenderer.h"
#include "renderer/ccGLStateCache.h"
#include "renderer/CCGLProgram.h"
#include "renderer/CCGLProgramState.h"

#define STRINGIFY(A)  #A
#include "CCGraphicsNode.vert"
#include "CCGraphicsNode.frag"

#include "Triangulate.h"


#define PI 3.14159265358979323846264338327f
#define PI_2 (PI * 2)
#define PI_HALF (PI * 0.5)

#define VECTOR_INIT_VERTS_SIZE 256

#define VECTOR_KAPPA90 0.5522847493f    // Length proportional to radius of a cubic bezier handle for 90deg arcs.

#define EPSILON 0.0000000001f

#define MAX_BUFFER_SIZE 65535

USING_NS_CC;

namespace creator {

GraphicsBuffer::GraphicsBuffer()
: vertsDirty(false)
, indicesDirty(false)
, vertsOffset(0)
, nVerts(VECTOR_INIT_VERTS_SIZE)
, indicesOffset(0)
, nIndices(VECTOR_INIT_VERTS_SIZE*3)
{
    verts = (VecVertex*)malloc(sizeof(VecVertex) * nVerts);
    indices = (GLushort*)malloc(sizeof(GLushort) * nIndices);
    
    glGenBuffers(2, buffersVBO);
}
    
GraphicsBuffer::~GraphicsBuffer()
{
    CC_SAFE_DELETE(verts);
    CC_SAFE_DELETE(indices);
}
    
bool GraphicsBuffer::allocVerts(int vertsCount)
{
    int dnverts = vertsOffset + vertsCount;
    if (dnverts > MAX_BUFFER_SIZE) {
        return false;
    }
        
    if (dnverts > nVerts) {
        while (dnverts > nVerts) {
            nVerts *= 2;
        }
        verts = (VecVertex*)realloc(verts, sizeof(VecVertex) * nVerts);
    }
    
    return true;
}
    
void GraphicsBuffer::allocIndices(int indicesCount)
{
    int dnIndices = indicesOffset + indicesCount;
    
    if (dnIndices > nIndices) {
        while (dnIndices > nIndices) {
            nIndices *= 2;
        }
        indices = (GLushort*)realloc(indices, sizeof(GLushort) * nIndices);
    }
}

void GraphicsBuffer::clear()
{
    vertsOffset = 0;
    indicesOffset = 0;
}
    
GraphicsNode* GraphicsNode::create()
{
    GraphicsNode * ret = new (std::nothrow) GraphicsNode();
    if (ret && ret->init()) {
        ret->autorelease();
    }
    else {
        CC_SAFE_DELETE(ret);
    }
    return ret;
}

GraphicsNode::GraphicsNode()
: _needUpdatePathOffset(false)
, _lineWidth(1)
, _lineCap(CAP_BUTT)
, _lineJoin(JOIN_MITER)
, _nPoints(0)
, _nPath(0)
, _pathOffset(0)

, _nCommands(0)
, _curPath(nullptr)
    
, _buffer(nullptr)
{
    _miterLimit = 10.0f;

    setDeviceRatio(1);

    _strokeColor = Color4F::BLACK;
    _fillColor = Color4F::WHITE;

    auto glprogram = GLProgram::createWithByteArrays(ccGraphicsVert, ccGraphicsFrag);
    auto glprogramstate = GLProgramState::getOrCreateWithGLProgram(glprogram);

    // shader state
    setGLProgramState(glprogramstate);


    CHECK_GL_ERROR_DEBUG();
}

GraphicsNode::~GraphicsNode()
{
    clear(true);
}

void GraphicsNode::moveTo(float x, float y)
{
    if (_needUpdatePathOffset) {
        _pathOffset = _nPath;
        _needUpdatePathOffset = false;
    }

    addPath();
    addPoint(_curPath, x, y, PT_CORNER);

    _commandx = x;
    _commandy = y;
}

void GraphicsNode::lineTo(float x, float y)
{
    addPoint(_curPath, x, y, PT_CORNER);

    _commandx = x;
    _commandy = y;
}

void GraphicsNode::bezierCurveTo(float c1x, float c1y, float c2x, float c2y, float x, float y)
{
    VecPoint* last = _curPath->points.back();

    if (last->x == c1x && last->y == c1y && c2x == x && c2y == y) {
        this->lineTo(x, y);
        return;
    }

    tesselateBezier(last->x,last->y, c1x,c1y, c2x,c2y, x,y, 0, PT_CORNER);

    _commandx = x;
    _commandy = y;
}

void GraphicsNode::quadraticCurveTo(float cx, float cy, float x, float y)
{
    float x0 = _commandx;
    float y0 = _commandy;
    bezierCurveTo(x0 + 2.0f/3.0f*(cx - x0), y0 + 2.0f/3.0f*(cy - y0),
             x + 2.0f/3.0f*(cx - x), y + 2.0f/3.0f*(cy - y),
             x, y);
}

void GraphicsNode::arcTo(float x1, float y1, float x2, float y2, float radius)
{
    float x0 = _commandx;
    float y0 = _commandy;
    float dx0,dy0, dx1,dy1, a, d, cx,cy, a0,a1;
    bool counterclockwise;

    // Handle degenerate cases.
    if (ptEquals(x0,y0, x1,y1, _distTol) ||
        ptEquals(x1,y1, x2,y2, _distTol) ||
        distPtSeg(x1,y1, x0,y0, x2,y2) < _distTol*_distTol ||
        radius < _distTol) {
        lineTo(x1,y1);
        return;
    }

    // Calculate tangential circle to lines (x0,y0)-(x1,y1) and (x1,y1)-(x2,y2).
    dx0 = x0-x1;
    dy0 = y0-y1;
    dx1 = x2-x1;
    dy1 = y2-y1;
    normalize(&dx0,&dy0);
    normalize(&dx1,&dy1);
    a = acosf(dx0*dx1 + dy0*dy1);
    d = radius / tanf(a/2.0f);

    //    printf("a=%f° d=%f\n", a/NVG_PI*180.0f, d);

    if (d > 10000.0f) {
        lineTo(x1,y1);
        return;
    }

    if (cross(dx0,dy0, dx1,dy1) > 0.0f) {
        cx = x1 + dx0*d + dy0*radius;
        cy = y1 + dy0*d + -dx0*radius;
        a0 = atan2f(dx0, -dy0);
        a1 = atan2f(-dx1, dy1);
        counterclockwise = false;
    } else {
        cx = x1 + dx0*d + -dy0*radius;
        cy = y1 + dy0*d + dx0*radius;
        a0 = atan2f(-dx0, dy0);
        a1 = atan2f(dx1, -dy1);
        counterclockwise = true;
    }

    arc(cx, cy, radius, a0, a1, counterclockwise);
}


void GraphicsNode::arc(float cx, float cy, float r, float startAngle, float endAngle, bool counterclockwise)
{
    float a = 0, da = 0, hda = 0, kappa = 0;
    float dx = 0, dy = 0, x = 0, y = 0, tanx = 0, tany = 0;
    float px = 0, py = 0, ptanx = 0, ptany = 0;
    int i, ndivs;

    // Clamp angles
    da = endAngle - startAngle;
    if (counterclockwise) {
        if (absf(da) >= PI_2) {
            da = PI_2;
        } else {
            while (da < 0.0f) da += PI_2;
        }
    } else {
        if (absf(da) >= PI_2) {
            da = -PI_2;
        } else {
            while (da > 0.0f) da -= PI_2;
        }
    }

    // Split arc into max 90 degree segments.
    ndivs = maxi(1, mini((int)(absf(da) / PI_HALF + 0.5f), 5));
    hda = (da / (float)ndivs) / 2.0f;
    kappa = absf(4.0f / 3.0f * (1.0f - cosf(hda)) / sinf(hda));

    if (!counterclockwise) {
        kappa = -kappa;
    }

    for (i = 0; i <= ndivs; i++) {
        a = startAngle + da * (i/(float)ndivs);
        dx = cosf(a);
        dy = sinf(a);
        x = cx + dx*r;
        y = cy + dy*r;
        tanx = -dy*r*kappa;
        tany = dx*r*kappa;

        if (i == 0) {
            moveTo(x, y);
        } else {
            bezierCurveTo(px+ptanx, py+ptany, x-tanx, y-tany, x, y);
        }
        px = x;
        py = y;
        ptanx = tanx;
        ptany = tany;
    }

    // _curPath->complex = false;
}

void GraphicsNode::rect(float x, float y, float w, float h)
{
    moveTo(x, y);
    lineTo(x, y+h);
    lineTo(x+w, y+h);
    lineTo(x+w, y);
    close();

    _curPath->complex = false;
}

void GraphicsNode::roundRect(float x, float y, float w, float h, float r)
{
    if (r < 0.1f) {
        rect(x,y,w,h);
        return;
    }
    else {
        float rx = minf(r, absf(w)*0.5f) * signf(w), ry = minf(r, absf(h)*0.5f) * signf(h);

        moveTo(x, y+ry);
        lineTo(x, y+h-ry);
        bezierCurveTo(x, y+h-ry*(1-VECTOR_KAPPA90), x+rx*(1-VECTOR_KAPPA90), y+h, x+rx, y+h);
        lineTo(x+w-rx, y+h);
        bezierCurveTo(x+w-rx*(1-VECTOR_KAPPA90), y+h, x+w, y+h-ry*(1-VECTOR_KAPPA90), x+w, y+h-ry);
        lineTo(x+w, y+ry);
        bezierCurveTo(x+w, y+ry*(1-VECTOR_KAPPA90), x+w-rx*(1-VECTOR_KAPPA90), y, x+w-rx, y);
        lineTo(x+rx, y);
        bezierCurveTo(x+rx*(1-VECTOR_KAPPA90), y, x, y+ry*(1-VECTOR_KAPPA90), x, y+ry);
        close();

        _curPath->complex = false;
    }
}

void GraphicsNode::ellipse(float cx, float cy, float rx, float ry)
{
    moveTo(cx-rx, cy);
    bezierCurveTo(cx-rx, cy+ry*VECTOR_KAPPA90, cx-rx*VECTOR_KAPPA90, cy+ry, cx, cy+ry);
    bezierCurveTo(cx+rx*VECTOR_KAPPA90, cy+ry, cx+rx, cy+ry*VECTOR_KAPPA90, cx+rx, cy);
    bezierCurveTo(cx+rx, cy-ry*VECTOR_KAPPA90, cx+rx*VECTOR_KAPPA90, cy-ry, cx, cy-ry);
    bezierCurveTo(cx-rx*VECTOR_KAPPA90, cy-ry, cx-rx, cy-ry*VECTOR_KAPPA90, cx-rx, cy);

    close();

    _curPath->complex = false;
}

void GraphicsNode::circle(float cx, float cy, float r)
{
    int divs = curveDivs(r, PI_2, _tessTol);
    float step = PI_2 / divs;

    moveTo(cx, cy + r);

    for (int i = 1; i < divs; i++) {
        float angle = step * i;
        float x = r * sin(angle);
        float y = r * cos(angle);

        lineTo(cx + x, cy + y);
    }

    close();
    _curPath->complex = false;
}

void GraphicsNode::fillRect(float x, float y, float w, float h)
{
    rect(x, y, w, h);
    fill();
}

void GraphicsNode::close()
{
    _curPath->closed = true;
}
void GraphicsNode::beginPath()
{
    _pathOffset = _nPath;
}


void GraphicsNode::stroke()
{
    float scale = (_scaleX + _scaleY) / 2;
    float strokeWidth = _lineWidth * scale;

    flattenPaths();
    
    expandStroke(strokeWidth*0.5f + _fringeWidth*0.5f, _lineCap, _lineJoin, _miterLimit);

    _buffer->vertsDirty = true;
    _buffer->indicesDirty = true;
    _needUpdatePathOffset = true;
}

void GraphicsNode::fill()
{
    flattenPaths();

    expandFill(_fringeWidth, JOIN_MITER, 2.4f);

    _buffer->vertsDirty = true;
    _buffer->indicesDirty = true;
    _needUpdatePathOffset = true;
}

void GraphicsNode::clear(bool clean)
{
    if (clean) {
        for (int i = (int)_paths.size() - 1; i >= 0; i--) {
            Path* path = _paths[i];
            _paths.pop_back();
            delete path;
        }

        for (int i = (int)_points.size() - 1; i >=0; i--) {
            VecPoint* p = _points[i];
            _points.pop_back();
            delete p;
        }

        for (int i = (int)_commands.size() - 1; i >=0; i--) {
            Command* c = _commands[i];
            _commands.pop_back();
            delete c;
        }
        
        for (int i = (int)_buffers.size() - 1; i >=0; i--) {
            GraphicsBuffer* b = _buffers[i];
            _buffers.pop_back();
            delete b;
        }
        
        _buffer = nullptr;
    }
    else if (_buffers.size() > 0) {
        for (int i = (int)_buffers.size() - 1; i >=0; i--) {
            GraphicsBuffer* b = _buffers[i];
            b->clear();
        }
        
        _buffer = _buffers[0];
    }

    _nPoints = 0;

    _nPath = 0;
    _pathOffset = 0;

    _curPath = nullptr;
    
    _nCommands = 0;
}

// static function

int GraphicsNode::ptEquals(float x1, float y1, float x2, float y2, float tol)
{
    float dx = x2 - x1;
    float dy = y2 - y1;
    return dx*dx + dy*dy < tol*tol;
}
float GraphicsNode::distPtSeg(float x, float y, float px, float py, float qx, float qy)
{
    float pqx, pqy, dx, dy, d, t;
    pqx = qx-px;
    pqy = qy-py;
    dx = x-px;
    dy = y-py;
    d = pqx*pqx + pqy*pqy;
    t = pqx*dx + pqy*dy;
    if (d > 0) t /= d;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    dx = px + t*pqx - x;
    dy = py + t*pqy - y;
    return dx*dx + dy*dy;
}

float GraphicsNode::normalize(float *x, float* y)
{
    float d = sqrtf((*x)*(*x) + (*y)*(*y));
    if (d > 1e-6f) {
        float id = 1.0f / d;
        *x *= id;
        *y *= id;
    }
    return d;
}

int GraphicsNode::curveDivs(float r, float arc, float tol)
{
    float da = acosf(r / (r + tol)) * 2.0f;
    return maxi(2, (int)ceilf(arc / da));
}

void GraphicsNode::chooseBevel(int bevel, VecPoint* p0, VecPoint* p1, float w,
                             float* x0, float* y0, float* x1, float* y1)
{
    if (bevel) {
        *x0 = p1->x + p0->dy * w;
        *y0 = p1->y - p0->dx * w;
        *x1 = p1->x + p1->dy * w;
        *y1 = p1->y - p1->dx * w;
    } else {
        *x0 = p1->x + p1->dmx * w;
        *y0 = p1->y + p1->dmy * w;
        *x1 = p1->x + p1->dmx * w;
        *y1 = p1->y + p1->dmy * w;
    }
}


// protected function

void GraphicsNode::tesselateBezier(float x1, float y1, float x2, float y2,
                                 float x3, float y3, float x4, float y4,
                                 int level, int type)
{
    float x12,y12,x23,y23,x34,y34,x123,y123,x234,y234,x1234,y1234;
    float dx,dy,d2,d3;

    if (level > 10) return;

    x12 = (x1+x2)*0.5f;
    y12 = (y1+y2)*0.5f;
    x23 = (x2+x3)*0.5f;
    y23 = (y2+y3)*0.5f;
    x34 = (x3+x4)*0.5f;
    y34 = (y3+y4)*0.5f;
    x123 = (x12+x23)*0.5f;
    y123 = (y12+y23)*0.5f;

    dx = x4 - x1;
    dy = y4 - y1;
    d2 = absf(((x2 - x4) * dy - (y2 - y4) * dx));
    d3 = absf(((x3 - x4) * dy - (y3 - y4) * dx));

    if ((d2 + d3)*(d2 + d3) < _tessTol * (dx*dx + dy*dy)) {
        addPoint(_curPath, x4, y4, type == 0 ? type | PT_BEVEL : type);
        return;
    }

    x234 = (x23+x34)*0.5f;
    y234 = (y23+y34)*0.5f;
    x1234 = (x123+x234)*0.5f;
    y1234 = (y123+y234)*0.5f;

    tesselateBezier(x1,y1, x12,y12, x123,y123, x1234,y1234, level+1, 0);
    tesselateBezier(x1234,y1234, x234,y234, x34,y34, x4,y4, level+1, type);
}

void GraphicsNode::addPoint(Path* path, float x, float y, int flags)
{
    VecPoint* pt;
    if (path == NULL) return;

    if (path->points.size() > 0) {
        pt = path->points.back();
        if (pt->equals(Vec2(x, y))) {
            pt->flags |= flags;
            return;
        }
    }

    _nPoints ++;
    if (_nPoints > _points.size()) {
        pt = new VecPoint(x, y);
        _points.push_back(pt);
    }
    else {
        pt = _points[_nPoints - 1];
        pt->reset();
        pt->x = x;
        pt->y = y;
    }

    pt->flags = (unsigned char)flags;
    path->points.push_back(pt);
}

Path* GraphicsNode::addPath()
{
    if (!(_curPath && _curPath->points.size() <= 1)) {
        _nPath ++;
    }

    Path* path = nullptr;


    if (_nPath > _paths.size()) {
        path = new Path();
        _paths.push_back(path);
    }
    else {

        path = _paths[_nPath - 1];
        path->points.clear();
    }

    path->closed = false;
    path->complex = true;

    _curPath = path;

    return path;
}

void GraphicsNode::expandStroke(float w, int lineCap, int lineJoin, float miterLimit)
{

    int cverts, i, j;
    float aa = _fringeWidth;
    int ncap = curveDivs(w, PI, _tessTol);

    calculateJoins(w, lineJoin, miterLimit);

    // Calculate max vertex usage.
    cverts = 0;
    for (i = _pathOffset; i < _nPath; i++) {
        Path* path = _paths[i];
        int pathSize = (int)path->points.size();

        int loop = (path->closed == 0) ? 0 : 1;
        if (lineJoin == JOIN_ROUND)
//            cverts += (pathSize + path->nbevel*(ncap+2) + 1) * 2;
            cverts += (pathSize*(ncap+2) + 1) * 2; // plus one for loop
        else
            cverts += (pathSize + path->nbevel*5 + 1) * 2; // plus one for loop
        if (loop == 0) {
            // space for caps
            if (lineCap == CAP_ROUND) {
                cverts += (ncap*2 + 2)*2;
            } else {
                cverts += (3+3)*2;
            }
        }
    }

    if (!_buffer || !_buffer->allocVerts(cverts)) {
        allocBuffer();
        _buffer->allocVerts(cverts);
    }
    
    _buffer->allocIndices((cverts - 2*(_nPath-_pathOffset)) * 3);
    
    for (i = _pathOffset; i < _nPath; i++) {
        VecVertex* verts = _buffer->verts + _buffer->vertsOffset;
        int offset = _buffer->vertsOffset;
        
        Path* path = _paths[i];

        VecPointVector& pts = path->points;
        int pathSize = (int)path->points.size();

        VecPoint* p0;
        VecPoint* p1;
        int s, e, loop;
        float dx, dy;

        // Calculate fringe or stroke
        loop = (path->closed == 0) ? 0 : 1;

        if (loop) {
            // Looping
            p0 = pts.back();
            p1 = pts.front();
            s = 0;
            e = pathSize;
        } else {
            // Add cap
            p0 = pts[0];
            p1 = pts[1];
            s = 1;
            e = pathSize-1;
        }

        if (loop == 0) {
            // Add cap
            dx = p1->x - p0->x;
            dy = p1->y - p0->y;
            normalize(&dx, &dy);
            if (lineCap == CAP_BUTT)
                buttCapStart(p0, dx, dy, w, -aa*0.5f, aa);
            else if (lineCap == CAP_BUTT || lineCap == CAP_SQUARE)
                buttCapStart(p0, dx, dy, w, w-aa, aa);
            else if (lineCap == CAP_ROUND)
                roundCapStart(p0, dx, dy, w, ncap, aa);
        }

        for (j = s; j < e; ++j) {
            if (lineJoin == JOIN_ROUND) {
                roundJoin(p0, p1, w, w, 0, 1, ncap, aa);
            }
            else if ((p1->flags & (PT_BEVEL | PT_INNERBEVEL)) != 0) {
                bevelJoin(p0, p1, w, w, 0, 1, aa);
            } else {
                vset(p1->x + (p1->dmx * w), p1->y + (p1->dmy * w), 0,1);
                vset(p1->x - (p1->dmx * w), p1->y - (p1->dmy * w), 1,1);
            }
            if (!loop || (loop && j < (e - 1))) {
                p0 = p1;
                p1 = pts[j + 1];
            }
        }

        if (loop) {
            // Loop it
            vset(verts[0].x, verts[0].y, 0,1);
            vset(verts[1].x, verts[1].y, 1,1);
        } else {
            // Add cap
            dx = p1->x - p0->x;
            dy = p1->y - p0->y;
            normalize(&dx, &dy);
            if (lineCap == CAP_BUTT)
                buttCapEnd(p1, dx, dy, w, -aa*0.5f, aa);
            else if (lineCap == CAP_BUTT || lineCap == CAP_SQUARE)
                buttCapEnd(p1, dx, dy, w, w-aa, aa);
            else if (lineCap == CAP_ROUND)
                roundCapEnd(p1, dx, dy, w, ncap, aa);
        }

        // stroke indices
        int indicesOffset = _buffer->indicesOffset;

        for (int start = offset+2, end = _buffer->vertsOffset; start < end; start++) {
            _buffer->indices[_buffer->indicesOffset++] = start - 2;
            _buffer->indices[_buffer->indicesOffset++] = start - 1;
            _buffer->indices[_buffer->indicesOffset++] = start;
        }

        float strokeMult = (_lineWidth*0.5f + _fringeWidth*0.5f) / _fringeWidth;
        pushCommand(_strokeColor, strokeMult, offset, _buffer->vertsOffset - offset, indicesOffset, _buffer->indicesOffset - indicesOffset);
    }
}

void GraphicsNode::expandFill(float w, int lineJoin, float miterLimit)
{
    int cverts, convex, i, j;
    float aa = _fringeWidth;
    int fringe = w > 0.0f;

    calculateJoins(w, lineJoin, miterLimit);

    // Calculate max vertex usage.
    cverts = 0;
    for (i = _pathOffset; i < _nPath; i++) {
        Path* path = _paths[i];
        int pathSize = (int)path->points.size();

        cverts += pathSize;// + path->nbevel + 1;
        if (fringe) {
            cverts += (pathSize + path->nbevel*5 + 1) * 2; // plus one for loop
//            cverts += (pathSize + 1) * 2;
        }
    }

    if (!_buffer || !_buffer->allocVerts(cverts)) {
        allocBuffer();
        _buffer->allocVerts(cverts);
    }

    convex = _nPath == 1 && _paths[_pathOffset]->convex;

    for (i = _pathOffset; i < _nPath; i++) {
        Path* path = _paths[i];

        VecVertex* verts = _buffer->verts + _buffer->vertsOffset;
        int offset = _buffer->vertsOffset;
        
        VecPointVector& pts = path->points;
        int pathSize = (int)pts.size();

        VecPoint* p0;
        VecPoint* p1;
        float woff;

        // Calculate shape vertices.
        woff = 0.5f*aa;

        if (fringe) {
            // Looping
            p0 = pts[pathSize-1];
            p1 = pts[0];
            for (j = 0; j < pathSize; ++j) {
                if (p1->flags & PT_BEVEL) {
                    float dlx0 = p0->dy;
                    float dly0 = -p0->dx;
                    float dlx1 = p1->dy;
                    float dly1 = -p1->dx;
                    if (p1->flags & PT_LEFT) {
                        float lx = p1->x + p1->dmx * woff;
                        float ly = p1->y + p1->dmy * woff;
                        vset(lx, ly, 0.5f,1);
                    } else {
                        float lx0 = p1->x + dlx0 * woff;
                        float ly0 = p1->y + dly0 * woff;
                        float lx1 = p1->x + dlx1 * woff;
                        float ly1 = p1->y + dly1 * woff;
                        vset(lx0, ly0, 0.5f,1);
                        vset(lx1, ly1, 0.5f,1);
                    }
                } else {
                    vset(p1->x + (p1->dmx * woff), p1->y + (p1->dmy * woff), 0.5f,1);
                }

                if (j < (pathSize - 1)) {
                    p0 = p1;
                    p1 = pts[j + 1];
                }
            }
        } else {
            for (j = 0; j < pathSize; ++j) {
                vset(pts[j]->x, pts[j]->y, 0.5f,1);
            }
        }
        
        int nVerts = _buffer->vertsOffset - offset;
        int indicesOffset = _buffer->indicesOffset;
        
        if (path->complex) {
            // indices
            std::vector<int> indices;
            Triangulate::process(verts, 0, _buffer->vertsOffset - offset, indices);
            int nIndices = (int)indices.size();

            _buffer->allocIndices(nIndices);
            
            for (j = 0; j < nIndices; j++) {
                _buffer->indices[j + _buffer->indicesOffset] = indices[j] + offset;
            }
            
            _buffer->indicesOffset += nIndices;
        }
        else {
            _buffer->allocIndices((nVerts - 2) * 3);
            
            int first = offset;
            for (int start = offset+2, end = _buffer->vertsOffset; start < end; start++) {
                _buffer->indices[_buffer->indicesOffset++] = first;
                _buffer->indices[_buffer->indicesOffset++] = start - 1;
                _buffer->indices[_buffer->indicesOffset++] = start;
            }
        }

        pushCommand(_fillColor, 1, offset, _buffer->vertsOffset - offset, indicesOffset, _buffer->indicesOffset - indicesOffset);
        
        // Calculate fringe
        if (fringe) {
            verts = _buffer->verts + _buffer->vertsOffset;
            offset = _buffer->vertsOffset;
            
            float lw = w + woff;
            float rw = w - woff;
            float lu = 0;
            float ru = 1;

            // Create only half a fringe for convex shapes so that
            // the shape can be rendered without stenciling.
            if (convex) {
                lw = woff;    // This should generate the same vertex as fill inset above.
                lu = 0.5f;    // Set outline fade at middle.
            }

            // Looping
            p0 = pts[pathSize-1];
            p1 = pts[0];

            for (j = 0; j < pathSize; ++j) {
                if ((p1->flags & (PT_BEVEL | PT_INNERBEVEL)) != 0) {
                    bevelJoin(p0, p1, lw, rw, lu, ru, _fringeWidth);
                } else {
                    vset(p1->x + (p1->dmx * lw), p1->y + (p1->dmy * lw), lu,1);
                    vset(p1->x - (p1->dmx * rw), p1->y - (p1->dmy * rw), ru,1);
                }

                if (j < (pathSize - 1)) {
                    p0 = p1;
                    p1 = pts[j + 1];
                }
            }

            // Loop it
            vset(verts[0].x, verts[0].y, lu,1);
            vset(verts[1].x, verts[1].y, ru,1);

            // fill stroke indices
            nVerts = _buffer->vertsOffset - offset;
            indicesOffset = _buffer->indicesOffset;
            
            _buffer->allocIndices((nVerts - 2) * 3);
            
            for (int start = offset+2, end = _buffer->vertsOffset; start < end; start++) {
                _buffer->indices[_buffer->indicesOffset++] = start - 2;
                _buffer->indices[_buffer->indicesOffset++] = start - 1;
                _buffer->indices[_buffer->indicesOffset++] = start;
            }

            pushCommand(_fillColor, 1, offset, nVerts, indicesOffset, _buffer->indicesOffset - indicesOffset);
        }
    }
}

void GraphicsNode::flattenPaths()
{
    if (_curPath && _curPath->points.size() <= 1) {
        _nPath --;
        _curPath = _nPath > 0 ? _paths[_nPath - 1] : nullptr;
    }

    for (int i = _pathOffset; i < _nPath; i++) {
        Path* path = _paths[i];
        VecPointVector& pts = path->points;

        VecPoint* p0 = pts.back();
        VecPoint* p1 = pts.front();

        if(p0->equals(*p1)) {
            path->closed = true;
            pts.pop_back();
            p0 = pts.back();
        }

        for (int j = 0, size = (int)pts.size(); j < size; j++) {
            // Calculate segment direction and length
            p0->dx = p1->x - p0->x;
            p0->dy = p1->y - p0->y;
            p0->len = normalize(&p0->dx, &p0->dy);

            // Advance
            if (j < (size - 1)) {
                p0 = p1;
                p1 = pts[j + 1];
            }
        }
    }
}


void GraphicsNode::calculateJoins(float w, int lineJoin, float miterLimit)
{
    int i, j, ii, jj;
    float iw = 0.0f;

    if (w > 0.0f)
        iw = 1.0f / w;

    // Calculate which joins needs extra vertices to append, and gather vertex count.
    for (i = _pathOffset, ii = _nPath; i < ii; i++) {
        Path* path = _paths[i];

        VecPointVector& pts = path->points;
        VecPoint* p0 = pts[pts.size()-1];
        VecPoint* p1 = pts[0];
        int nleft = 0;

        path->nbevel = 0;

        for (j = 0, jj = (int)pts.size(); j < jj; j++) {
            float dlx0, dly0, dlx1, dly1, dmr2, cross, limit;
            dlx0 = p0->dy;
            dly0 = -p0->dx;
            dlx1 = p1->dy;
            dly1 = -p1->dx;
            // Calculate extrusions
            p1->dmx = (dlx0 + dlx1) * 0.5f;
            p1->dmy = (dly0 + dly1) * 0.5f;
            dmr2 = p1->dmx*p1->dmx + p1->dmy*p1->dmy;
            if (dmr2 > 0.000001f) {
                float scale = 1.0f / dmr2;
                if (scale > 600.0f) {
                    scale = 600.0f;
                }
                p1->dmx *= scale;
                p1->dmy *= scale;
            }

            // Clear flags, but keep the corner.
            p1->flags = (p1->flags & PT_CORNER) ? PT_CORNER : 0;

            // Keep track of left turns.
            cross = p1->dx * p0->dy - p0->dx * p1->dy;
            if (cross > 0.0f) {
                nleft++;
                p1->flags |= PT_LEFT;
            }

            // Calculate if we should use bevel or miter for inner join.
            limit = maxf(1.01f, minf(p0->len, p1->len) * iw);
            if ((dmr2 * limit*limit) < 1.0f)
                p1->flags |= PT_INNERBEVEL;

            // Check to see if the corner needs to be beveled.
            if (p1->flags & PT_CORNER) {
                if ((dmr2 * miterLimit*miterLimit) < 1.0f || lineJoin == JOIN_BEVEL || lineJoin == JOIN_ROUND) {
                    p1->flags |= PT_BEVEL;
                }
            }

            if ((p1->flags & (PT_BEVEL | PT_INNERBEVEL)) != 0)
                path->nbevel++;

            if (j < (jj - 1)) {
                p0 = p1;
                p1 = pts[j + 1];
            }
        }

        path->convex = nleft == pts.size();
    }
}

void GraphicsNode::allocBuffer()
{
    if (_buffer) {
        const auto iterator = std::find(_buffers.begin(), _buffers.end(), _buffer);
        if (iterator != _buffers.end() && (*iterator) != _buffers.back()) {
            _buffer = *(iterator+1);
            return;
        }
    }
    
    GraphicsBuffer* buffer = new GraphicsBuffer();
    _buffer = buffer;
    _buffers.push_back(buffer);
}

    
void GraphicsNode::vset(float x, float y, float u, float v)
{
    VecVertex* vtx = &_buffer->verts[_buffer->vertsOffset];

    vtx->x = x;
    vtx->y = y;
    vtx->u = u;
    vtx->v = v;
    
    _buffer->vertsOffset ++;
}

void GraphicsNode::pushCommand(cocos2d::Color4F& color, float strokeMult, int vertsOffset, int nVerts, int indicesOffset, int nIndices)
{
    Command* lastCmd = nullptr;
    if (_commands.size() >= _nCommands && _nCommands > 0) {
        lastCmd = _commands[_nCommands - 1];
    }

    if (lastCmd &&
        ((lastCmd->vertsOffset + lastCmd->nVerts) == vertsOffset) &&
        ((lastCmd->indicesOffset + lastCmd->nIndices) == indicesOffset) &&
        lastCmd->color.equals(color) &&
        lastCmd->strokeMult == strokeMult &&
        lastCmd->buffer == _buffer) {
        lastCmd->nVerts += nVerts;
        lastCmd->nIndices += nIndices;
    }
    else {
        Command* cmd;

        _nCommands ++;
        if (_nCommands > _commands.size()) {
            cmd = new Command();
            _commands.push_back(cmd);
        }
        else {
            cmd = _commands[_nCommands - 1];
        }

        cmd->color = color;
        cmd->strokeMult = strokeMult;
        cmd->vertsOffset = vertsOffset;
        cmd->nVerts = nVerts;
        cmd->indicesOffset = indicesOffset;
        cmd->nIndices = nIndices;
        cmd->buffer = _buffer;
    }
}

void GraphicsNode::buttCapStart(VecPoint* p, float dx, float dy, float w, float d, float aa)
{
    float px = p->x - dx*d;
    float py = p->y - dy*d;
    float dlx = dy;
    float dly = -dx;
    vset(px + dlx*w - dx*aa, py + dly*w - dy*aa, 0,0);
    vset(px - dlx*w - dx*aa, py - dly*w - dy*aa, 1,0);
    vset(px + dlx*w, py + dly*w, 0,1);
    vset(px - dlx*w, py - dly*w, 1,1);
}

void GraphicsNode::buttCapEnd(VecPoint* p, float dx, float dy, float w, float d, float aa)
{
    float px = p->x + dx*d;
    float py = p->y + dy*d;
    float dlx = dy;
    float dly = -dx;
    vset(px + dlx*w, py + dly*w, 0,1);
    vset(px - dlx*w, py - dly*w, 1,1);
    vset(px + dlx*w + dx*aa, py + dly*w + dy*aa, 0,0);
    vset(px - dlx*w + dx*aa, py - dly*w + dy*aa, 1,0);
}

void GraphicsNode::roundCapStart(VecPoint* p, float dx, float dy, float w, int ncap, float aa)
{
    int i;
    float px = p->x;
    float py = p->y;
    float dlx = dy;
    float dly = -dx;

    for (i = 0; i < ncap; i++) {
        float a = i/(float)(ncap-1) * PI;
        float ax = cosf(a) * w, ay = sinf(a) * w;
        vset(px - dlx*ax - dx*ay, py - dly*ax - dy*ay, 0,1);
        vset(px, py, 0.5f,1);
    }
    vset(px + dlx*w, py + dly*w, 0,1);
    vset(px - dlx*w, py - dly*w, 1,1);
}

void GraphicsNode::roundCapEnd(VecPoint* p, float dx, float dy, float w, int ncap, float aa)
{
    int i;
    float px = p->x;
    float py = p->y;
    float dlx = dy;
    float dly = -dx;

    vset(px + dlx*w, py + dly*w, 0,1);
    vset(px - dlx*w, py - dly*w, 1,1);
    for (i = 0; i < ncap; i++) {
        float a = i/(float)(ncap-1)*PI;
        float ax = cosf(a) * w, ay = sinf(a) * w;
        vset(px, py, 0.5f,1);
        vset(px - dlx*ax + dx*ay, py - dly*ax + dy*ay, 0,1);
    }
}

void GraphicsNode::roundJoin(VecPoint* p0, VecPoint* p1, float lw, float rw, float lu, float ru, int ncap, float fringe)
{
    int i, n;
    float dlx0 = p0->dy;
    float dly0 = -p0->dx;
    float dlx1 = p1->dy;
    float dly1 = -p1->dx;

    if (p1->flags & PT_LEFT) {
        float lx0,ly0,lx1,ly1,a0,a1;
        chooseBevel(p1->flags & PT_INNERBEVEL, p0, p1, lw, &lx0,&ly0, &lx1,&ly1);
        a0 = atan2f(-dly0, -dlx0);
        a1 = atan2f(-dly1, -dlx1);
        if (a1 > a0) a1 -= PI_2;

        vset(lx0, ly0, lu,1);
        vset(p1->x - dlx0*rw, p1->y - dly0*rw, ru,1);

        n = clampi((int)ceilf(((a0 - a1) / PI) * ncap), 2, ncap);
        for (i = 0; i < n; i++) {
            float u = i/(float)(n-1);
            float a = a0 + u*(a1-a0);
            float rx = p1->x + cosf(a) * rw;
            float ry = p1->y + sinf(a) * rw;
            vset(p1->x, p1->y, 0.5f,1);
            vset(rx, ry, ru,1);
        }

        vset(lx1, ly1, lu,1);
        vset(p1->x - dlx1*rw, p1->y - dly1*rw, ru,1);

    } else {
        float rx0,ry0,rx1,ry1,a0,a1;
        chooseBevel(p1->flags & PT_INNERBEVEL, p0, p1, -rw, &rx0,&ry0, &rx1,&ry1);
        a0 = atan2f(dly0, dlx0);
        a1 = atan2f(dly1, dlx1);
        if (a1 < a0) a1 += PI_2;

        vset(p1->x + dlx0*rw, p1->y + dly0*rw, lu,1);
        vset(rx0, ry0, ru,1);

        n = clampi((int)ceilf(((a1 - a0) / PI) * ncap), 2, ncap);
        for (i = 0; i < n; i++) {
            float u = i/(float)(n-1);
            float a = a0 + u*(a1-a0);
            float lx = p1->x + cosf(a) * lw;
            float ly = p1->y + sinf(a) * lw;
            vset(lx, ly, lu,1);
            vset(p1->x, p1->y, 0.5f,1);
        }

        vset(p1->x + dlx1*rw, p1->y + dly1*rw, lu,1);
        vset(rx1, ry1, ru,1);

    }
}


void GraphicsNode::bevelJoin(VecPoint* p0, VecPoint* p1, float lw, float rw, float lu, float ru, float fringe)
{
    float rx0,ry0,rx1,ry1;
    float lx0,ly0,lx1,ly1;
    float dlx0 = p0->dy;
    float dly0 = -p0->dx;
    float dlx1 = p1->dy;
    float dly1 = -p1->dx;

    if (p1->flags & PT_LEFT) {
        chooseBevel(p1->flags & PT_INNERBEVEL, p0, p1, lw, &lx0,&ly0, &lx1,&ly1);

        vset(lx0, ly0, lu,1);
        vset(p1->x - dlx0*rw, p1->y - dly0*rw, ru,1);

//        if (p1->flags & PT_BEVEL) {
//            vset(lx0, ly0, lu,1);
//            vset(p1->x - dlx0*rw, p1->y - dly0*rw, ru,1);
//
//            vset(lx1, ly1, lu,1);
//            vset(p1->x - dlx1*rw, p1->y - dly1*rw, ru,1);
//        } else {
//            rx0 = p1->x - p1->dmx * rw;
//            ry0 = p1->y - p1->dmy * rw;
//
//            vset(p1->x, p1->y, 0.5f,1);
//            vset(p1->x - dlx0*rw, p1->y - dly0*rw, ru,1);
//
//            vset(rx0, ry0, ru,1);
//            vset(rx0, ry0, ru,1);
//
//            vset(p1->x, p1->y, 0.5f,1);
//            vset(p1->x - dlx1*rw, p1->y - dly1*rw, ru,1);
//        }

        vset(lx1, ly1, lu,1);
        vset(p1->x - dlx1*rw, p1->y - dly1*rw, ru,1);

    } else {
        chooseBevel(p1->flags & PT_INNERBEVEL, p0, p1, -rw, &rx0,&ry0, &rx1,&ry1);

        vset(p1->x + dlx0*lw, p1->y + dly0*lw, lu,1);
        vset(rx0, ry0, ru,1);

//        if (p1->flags & PT_BEVEL) {
//            vset(p1->x + dlx0*lw, p1->y + dly0*lw, lu,1);
//            vset(rx0, ry0, ru,1);
//
//            vset(p1->x + dlx1*lw, p1->y + dly1*lw, lu,1);
//            vset(rx1, ry1, ru,1);
//        } else {
//            lx0 = p1->x + p1->dmx * lw;
//            ly0 = p1->y + p1->dmy * lw;
//
//            vset(p1->x + dlx0*lw, p1->y + dly0*lw, lu,1);
//            vset(p1->x, p1->y, 0.5f,1);
//
//            vset(lx0, ly0, lu,1);
//            vset(lx0, ly0, lu,1);
//
//            vset(p1->x + dlx1*lw, p1->y + dly1*lw, lu,1);
//            vset(p1->x, p1->y, 0.5f,1);
//        }

        vset(p1->x + dlx1*lw, p1->y + dly1*lw, lu,1);
        vset(rx1, ry1, ru,1);
    }
}


void GraphicsNode::draw(Renderer *renderer, const Mat4 &transform, uint32_t flags)
{
    _customCommand.init(_globalZOrder);
    _customCommand.func = CC_CALLBACK_0(GraphicsNode::onDraw, this, transform, flags);
    renderer->addCommand(&_customCommand);
}


void GraphicsNode::onDraw(const Mat4 &transform, uint32_t flags)
{
    if (_nCommands <=0) return;

    auto program = getGLProgram();
    program->use();
    program->setUniformsForBuiltins(transform);

    glBlendFunc(BlendFunc::ALPHA_NON_PREMULTIPLIED.src, BlendFunc::ALPHA_NON_PREMULTIPLIED.dst);

    
    GLint colorLocation = program->getUniformLocation("color");
    GLint strokeMultLocation = program->getUniformLocation("strokeMult");
    
    // draw paths
    for (int i = 0; i < _nCommands; i++) {
        Command* cmd = _commands[i];
        
        GraphicsBuffer* buffer = cmd->buffer;
        
        glBindBuffer(GL_ARRAY_BUFFER, buffer->buffersVBO[0]);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, buffer->buffersVBO[1]);
        
        if (buffer->vertsDirty) {
            glBufferData(GL_ARRAY_BUFFER, sizeof(VecVertex) * buffer->vertsOffset, buffer->verts, GL_DYNAMIC_DRAW);
            
            buffer->vertsDirty = false;
        }
        
        if (buffer->indicesDirty) {
            glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(buffer->indices[0]) * buffer->indicesOffset, buffer->indices, GL_STREAM_DRAW);
            
            buffer->indicesDirty = false;
        }
        
        GL::enableVertexAttribs(GL::VERTEX_ATTRIB_FLAG_POSITION | GL::VERTEX_ATTRIB_FLAG_TEX_COORD);
        
        glVertexAttribPointer(GLProgram::VERTEX_ATTRIB_POSITION, 2, GL_FLOAT, GL_FALSE, sizeof(VecVertex), (const GLvoid*)(size_t)0);
        glVertexAttribPointer(GLProgram::VERTEX_ATTRIB_TEX_COORD, 2, GL_FLOAT, GL_FALSE, sizeof(VecVertex), (const GLvoid*)(0 + 2*sizeof(float)));
        
        if (cmd->nIndices) {
            Color4F& color = cmd->color;
            program->setUniformLocationWith4f(colorLocation, color.r, color.g, color.b, color.a);
            program->setUniformLocationWith1f(strokeMultLocation, cmd->strokeMult);
            
            glDrawElements(GL_TRIANGLES, (GLsizei)cmd->nIndices, GL_UNSIGNED_SHORT, (const GLvoid *)((size_t)cmd->indicesOffset*2));
            
            CC_INCREMENT_GL_DRAWN_BATCHES_AND_VERTICES(1, cmd->nVerts);
        }
    }
    
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);

    CHECK_GL_ERROR_DEBUG();
}

}
