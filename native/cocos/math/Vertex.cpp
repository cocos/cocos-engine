/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2011 ForzeField Studios S.L
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

#include "math/Vertex.h"
#include <vector>
#include "base/Macros.h"

namespace cc {

void ccVertexLineToPolygon(const std::vector<Vec2> &points, float stroke, unsigned int offset, unsigned int nuPoints, std::vector<Vec2> *vertices) {
    GP_ASSERT(vertices);
    nuPoints += offset;
    if (nuPoints <= 1) return;

    stroke *= 0.5F;

    unsigned int idx;
    unsigned int nuPointsMinus = nuPoints - 1;

    for (unsigned int i = offset; i < nuPoints; i++) {
        idx     = i * 2;
        Vec2 p1 = points[i];
        Vec2 perpVector;

        if (i == 0) {
            perpVector = (p1 - points[i + 1]).getNormalized().getPerp();
        } else if (i == nuPointsMinus) {
            perpVector = (points[i - 1] - p1).getNormalized().getPerp();
        } else {
            Vec2 p2 = points[i + 1];
            Vec2 p0 = points[i - 1];

            Vec2 p2p1 = (p2 - p1).getNormalized();
            Vec2 p0p1 = (p0 - p1).getNormalized();

            // Calculate angle between vectors
            float angle = acosf(p2p1.dot(p0p1));

            if (angle < CC_DEGREES_TO_RADIANS(70)) {
                perpVector = p2p1.getMidpoint(p0p1).getNormalized().getPerp();
            } else if (angle < CC_DEGREES_TO_RADIANS(170)) {
                perpVector = p2p1.getMidpoint(p0p1).getNormalized();
            } else {
                perpVector = (p2 - p0).getNormalized().getPerp();
            }
        }
        perpVector = perpVector * stroke;

        (*vertices)[idx].set(p1.x + perpVector.x, p1.y + perpVector.y);
        (*vertices)[idx + 1].set(p1.x - perpVector.x, p1.y - perpVector.y);
    }

    // Validate vertexes
    offset = (offset == 0) ? 0 : offset - 1;
    for (unsigned int i = offset; i < nuPointsMinus; i++) {
        idx                     = i * 2;
        const unsigned int idx1 = idx + 2;

        Vec2 p1 = (*vertices)[idx];
        Vec2 p2 = (*vertices)[idx + 1];
        Vec2 p3 = (*vertices)[idx1];
        Vec2 p4 = (*vertices)[idx1 + 1];

        float s;
        //BOOL fixVertex = !ccpLineIntersect(Vec2(p1.x, p1.y), Vec2(p4.x, p4.y), Vec2(p2.x, p2.y), Vec2(p3.x, p3.y), &s, &t);
        bool fixVertex = !ccVertexLineIntersect(p1.x, p1.y, p4.x, p4.y, p2.x, p2.y, p3.x, p3.y, &s);
        if (!fixVertex) {
            if (s < 0.F || s > 1.F) {
                fixVertex = true;
            }
        }

        if (fixVertex) {
            (*vertices)[idx1]     = p4;
            (*vertices)[idx1 + 1] = p3;
        }
    }
}

bool ccVertexLineIntersect(float ax, float ay,
                           float bx, float by,
                           float cx, float cy,
                           float dx, float dy, float *t) {
    float distAB;
    float theCos;
    float theSin;
    float newX;

    // FAIL: Line undefined
    if ((ax == bx && ay == by) || (cx == dx && cy == dy)) {
        return false;
    }

    //  Translate system to make A the origin
    bx -= ax;
    by -= ay;
    cx -= ax;
    cy -= ay;
    dx -= ax;
    dy -= ay;

    // Length of segment AB
    distAB = sqrtf(bx * bx + by * by);

    // Rotate the system so that point B is on the positive X axis.
    theCos = bx / distAB;
    theSin = by / distAB;
    newX   = cx * theCos + cy * theSin;
    cy     = cy * theCos - cx * theSin;
    cx     = newX;
    newX   = dx * theCos + dy * theSin;
    dy     = dy * theCos - dx * theSin;
    dx     = newX;

    // FAIL: Lines are parallel.
    if (cy == dy) {
        return false;
    }

    // Discover the relative position of the intersection in the line AB
    *t = (dx + (cx - dx) * dy / (dy - cy)) / distAB;

    // Success.
    return true;
}

} // namespace cc
