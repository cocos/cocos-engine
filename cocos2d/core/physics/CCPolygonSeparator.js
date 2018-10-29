/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

// http://answers.unity3d.com/questions/977416/2d-polygon-convex-decomposition-code.html

/// <summary>
/// This class is took from the "FarseerUnity" physics engine, which uses Mark Bayazit's decomposition algorithm.
/// I also have to make it work with self-intersecting polygons, so I'll use another different algorithm to decompose a self-intersecting polygon into several simple polygons,
/// and then I would decompose each of them into convex polygons.
/// </summary>

//From phed rev 36

/// <summary>
/// Convex decomposition algorithm created by Mark Bayazit (http://mnbayazit.com/)
/// For more information about this algorithm, see http://mnbayazit.com/406/bayazit
/// </summary>
 
function At(i, vertices) {
    var s = vertices.length;
    return vertices[i < 0 ? s - (-i % s) : i % s];
}

function Copy(i, j, vertices) {
    var p = [];
    while (j < i) j += vertices.length;
    //p.reserve(j - i + 1);
    for (; i <= j; ++i)
    {
        p.push(At(i, vertices));
    }
    return p;
}

/// <summary>
/// Decompose the polygon into several smaller non-concave polygon.
/// If the polygon is already convex, it will return the original polygon, unless it is over Settings.MaxPolygonVertices.
/// Precondition: Counter Clockwise polygon
/// </summary>
/// <param name="vertices"></param>
/// <returns></returns>
function ConvexPartition(vertices) {
    //We force it to CCW as it is a precondition in this algorithm.
    ForceCounterClockWise (vertices);
    
    var list = [];
    var d, lowerDist, upperDist;
    var p;
    var lowerInt = cc.v2();
    var upperInt = cc.v2(); // intersection points
    var lowerIndex = 0, upperIndex = 0;
    var lowerPoly, upperPoly;
    
    for (var i = 0; i < vertices.length; ++i) {
        if (Reflex(i, vertices)) {
            lowerDist = upperDist = 10e7; // std::numeric_limits<qreal>::max();
            for (var j = 0; j < vertices.length; ++j) {
                // if line intersects with an edge
                if (Left(At(i - 1, vertices), At(i, vertices), At(j, vertices)) &&
                    RightOn(At(i - 1, vertices), At(i, vertices), At(j - 1, vertices))) {
                    // find the povar of intersection
                    p = LineIntersect(At(i - 1, vertices), At(i, vertices), At(j, vertices),
                                                At(j - 1, vertices));
                    if (Right(At(i + 1, vertices), At(i, vertices), p)) {
                        // make sure it's inside the poly
                        d = SquareDist(At(i, vertices), p);
                        if (d < lowerDist) {
                            // keep only the closest intersection
                            lowerDist = d;
                            lowerInt = p;
                            lowerIndex = j;
                        }
                    }
                }
                
                if (Left(At(i + 1, vertices), At(i, vertices), At(j + 1, vertices)) &&
                    RightOn(At(i + 1, vertices), At(i, vertices), At(j, vertices))) {
                    p = LineIntersect(At(i + 1, vertices), At(i, vertices), At(j, vertices),
                                                At(j + 1, vertices));
                    if (Left(At(i - 1, vertices), At(i, vertices), p)) {
                        d = SquareDist(At(i, vertices), p);
                        if (d < upperDist) {
                            upperDist = d;
                            upperIndex = j;
                            upperInt = p;
                        }
                    }
                }
            }
            
            // if there are no vertices to connect to, choose a povar in the middle
            if (lowerIndex == (upperIndex + 1) % vertices.length) {
                var sp = lowerInt.add(upperInt).div(2);
                
                lowerPoly = Copy(i, upperIndex, vertices);
                lowerPoly.push(sp);
                upperPoly = Copy(lowerIndex, i, vertices);
                upperPoly.push(sp);
            }
            else {
                var highestScore = 0, bestIndex = lowerIndex;
                
                while (upperIndex < lowerIndex) {
                    upperIndex += vertices.length;
                }

                for (var j = lowerIndex; j <= upperIndex; ++j) {
                    if (CanSee(i, j, vertices)) {
                        var score = 1 / (SquareDist(At(i, vertices), At(j, vertices)) + 1);
                        if (Reflex(j, vertices)) {
                            if (RightOn(At(j - 1, vertices), At(j, vertices), At(i, vertices)) &&
                                LeftOn(At(j + 1, vertices), At(j, vertices), At(i, vertices))) {
                                score += 3;
                            }
                            else {
                                score += 2;
                            }
                        }
                        else {
                            score += 1;
                        }
                        
                        if (score > highestScore) {
                            bestIndex = j;
                            highestScore = score;
                        }
                    }
                }
                lowerPoly = Copy(i, bestIndex, vertices);
                upperPoly = Copy(bestIndex, i, vertices);
            }
            list = list.concat( ConvexPartition(lowerPoly) );
            list = list.concat( ConvexPartition(upperPoly) );
            return list;
        }
    }
    
    // polygon is already convex
    list.push(vertices);
    
    //Remove empty vertice collections
    for (var i = list.length - 1; i >= 0; i--)
    {
        if (list[i].length == 0)
            list.splice(i, 0);
    }
    
    return list;
}

function CanSee(i, j, vertices) {
    if (Reflex(i, vertices)) {
        if (LeftOn(At(i, vertices), At(i - 1, vertices), At(j, vertices)) &&
            RightOn(At(i, vertices), At(i + 1, vertices), At(j, vertices))) return false;
    }
    else {
        if (RightOn(At(i, vertices), At(i + 1, vertices), At(j, vertices)) ||
            LeftOn(At(i, vertices), At(i - 1, vertices), At(j, vertices))) return false;
    }
    if (Reflex(j, vertices)) {
        if (LeftOn(At(j, vertices), At(j - 1, vertices), At(i, vertices)) &&
            RightOn(At(j, vertices), At(j + 1, vertices), At(i, vertices))) return false;
    }
    else {
        if (RightOn(At(j, vertices), At(j + 1, vertices), At(i, vertices)) ||
            LeftOn(At(j, vertices), At(j - 1, vertices), At(i, vertices))) return false;
    }
    
    for (var k = 0; k < vertices.length; ++k) {
        if ((k + 1) % vertices.length == i || k == i || (k + 1) % vertices.length == j || k == j)
        {
            continue; // ignore incident edges
        }
        var intersectionPoint = cc.v2();
        if (LineIntersect2(At(i, vertices), At(j, vertices), At(k, vertices), At(k + 1, vertices), intersectionPoint))
        {
            return false;
        }
    }
    return true;
}

// precondition: ccw
function Reflex(i, vertices) {
    return Right(i, vertices);
}

function Right(a, b, c) {
    if (typeof c === 'undefined') {
        var i = a, vertices = b;

        a = At(i - 1, vertices);
        b = At(i, vertices);
        c = At(i + 1, vertices);
    }

    return Area(a, b, c) < 0;
}

function Left(a, b, c) {
    return Area(a, b, c) > 0;
}

function LeftOn(a, b, c) {
    return Area(a, b, c) >= 0;
}


function RightOn(a, b, c) {
    return Area(a, b, c) <= 0;
}

function SquareDist(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return dx * dx + dy * dy;
}

//forces counter clock wise order.
function ForceCounterClockWise(vertices) {
    if (!IsCounterClockWise(vertices)) {
        vertices.reverse();
    }
}

function IsCounterClockWise(vertices) {
    //We just return true for lines
    if (vertices.length < 3)
        return true;
    
    return (GetSignedArea(vertices) > 0);
}

//gets the signed area.
function GetSignedArea(vertices) {
    var i;
    var area = 0;
    
    for (i = 0; i < vertices.length; i++) {
        var j = (i + 1) % vertices.length;
        area += vertices[i].x * vertices[j].y;
        area -= vertices[i].y * vertices[j].x;
    }
    area /= 2;
    return area;
}

//From Mark Bayazit's convex decomposition algorithm
function LineIntersect(p1, p2, q1, q2) {
    var i = cc.v2();
    var a1 = p2.y - p1.y;
    var b1 = p1.x - p2.x;
    var c1 = a1 * p1.x + b1 * p1.y;
    var a2 = q2.y - q1.y;
    var b2 = q1.x - q2.x;
    var c2 = a2 * q1.x + b2 * q1.y;
    var det = a1 * b2 - a2 * b1;
    
    if (!FloatEquals(det, 0)) {
        // lines are not parallel
        i.x = (b2 * c1 - b1 * c2) / det;
        i.y = (a1 * c2 - a2 * c1) / det;
    }
    return i;
}

//from Eric Jordan's convex decomposition library, it checks if the lines a0->a1 and b0->b1 cross.
//if they do, intersectionPovar will be filled with the povar of crossing. Grazing lines should not return true.
function LineIntersect2(a0, a1, b0, b1, intersectionPoint) {
    if (a0 == b0 || a0 == b1 || a1 == b0 || a1 == b1)
        return false;
    
    var x1 = a0.x;
    var y1 = a0.y;
    var x2 = a1.x;
    var y2 = a1.y;
    var x3 = b0.x;
    var y3 = b0.y;
    var x4 = b1.x;
    var y4 = b1.y;
    
    //AABB early exit
    if (Math.max(x1, x2) < Math.min(x3, x4) || Math.max(x3, x4) < Math.min(x1, x2))
        return false;
    
    if (Math.max(y1, y2) < Math.min(y3, y4) || Math.max(y3, y4) < Math.min(y1, y2))
        return false;
    
    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3));
    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3));
    var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (Math.abs(denom) < 10e-7) {
        //Lines are too close to parallel to call
        return false;
    }
    ua /= denom;
    ub /= denom;
    
    if ((0 < ua) && (ua < 1) && (0 < ub) && (ub < 1)) {
        intersectionPoint.x = (x1 + ua * (x2 - x1));
        intersectionPoint.y = (y1 + ua * (y2 - y1));
        return true;
    }
    
    return false;
}

function FloatEquals(value1, value2) {
    return Math.abs(value1 - value2) <= 10e-7;
}


//returns a positive number if c is to the left of the line going from a to b. Positive number if povar is left, negative if povar is right, and 0 if points are collinear.</returns>
function Area(a, b, c) {
    return a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);
}

module.exports = {
    ConvexPartition: ConvexPartition,
    ForceCounterClockWise: ForceCounterClockWise,
    IsCounterClockWise: IsCounterClockWise
};
