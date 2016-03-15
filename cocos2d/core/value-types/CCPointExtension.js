/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

/**
 * <p>cc.Vec2 extensions based on Chipmunk's cpVect file.<br />
 * These extensions work both with cc.Vec2</p>
 *
 * <p>The "ccp" prefix means: "CoCos2d Point"</p>
 */

/**
 * smallest such that 1.0+FLT_EPSILON != 1.0
 * @constant
 * @type Number
 */
var POINT_EPSILON = parseFloat('1.192092896e-07F');

/**
 * Returns opposite of point.
 * @method pNeg
 * @param {Vec2} point
 * @return {Vec2}
 */
cc.pNeg = function (point) {
    return cc.p(-point.x, -point.y);
};

/**
 * Calculates sum of two points.
 * @method pAdd
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 * @examples {@link utils/api/engine/docs/cocos2d/core/support/pAdd.js}
 */
cc.pAdd = function (v1, v2) {
    return cc.p(v1.x + v2.x, v1.y + v2.y);
};

/**
 * Calculates difference of two points.
 * @method pSub
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
cc.pSub = function (v1, v2) {
    return cc.p(v1.x - v2.x, v1.y - v2.y);
};

/**
 * Returns point multiplied by given factor.
 * @method pMult
 * @param {Vec2} point
 * @param {Number} floatVar
 * @return {Vec2}
 */
cc.pMult = function (point, floatVar) {
    return cc.p(point.x * floatVar, point.y * floatVar);
};

/**
 * Calculates midpoint between two points.
 * @method pMidpoint
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
cc.pMidpoint = function (v1, v2) {
    return cc.pMult(cc.pAdd(v1, v2), 0.5);
};

/**
 * Calculates dot product of two points.
 * @method pDot
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
cc.pDot = function (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * Calculates cross product of two points.
 * @method pCross
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
cc.pCross = function (v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
};

/**
 * Calculates perpendicular of v, rotated 90 degrees counter-clockwise -- cross(v, perp(v)) greater than 0
 * @method pPerp
 * @param {Vec2} point
 * @return {Vec2}
 */
cc.pPerp = function (point) {
    return cc.p(-point.y, point.x);
};

/**
 * Calculates perpendicular of v, rotated 90 degrees clockwise -- cross(v, rperp(v)) smaller than 0
 * @method pRPerp
 * @param {Vec2} point
 * @return {Vec2}
 */
cc.pRPerp = function (point) {
    return cc.p(point.y, -point.x);
};

/**
 * Calculates the projection of v1 over v2.
 * @method pProject
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 */
cc.pProject = function (v1, v2) {
    return cc.pMult(v2, cc.pDot(v1, v2) / cc.pDot(v2, v2));
};

/**
 * Rotates two points.
 * @method pRotate
 * @param  {Vec2} v1
 * @param  {Vec2} v2
 * @return {Vec2}
 */
cc.pRotate = function (v1, v2) {
    return cc.p(v1.x * v2.x - v1.y * v2.y, v1.x * v2.y + v1.y * v2.x);
};

/**
 * Unrotates two points.
 * @method pUnrotate
 * @param  {Vec2} v1
 * @param  {Vec2} v2
 * @return {Vec2}
 */
cc.pUnrotate = function (v1, v2) {
    return cc.p(v1.x * v2.x + v1.y * v2.y, v1.y * v2.x - v1.x * v2.y);
};

/**
 * Calculates the square length of a cc.Vec2 (not calling sqrt() )
 * @method pLengthSQ
 * @param  {Vec2} v
 * @return {Number}
 */
cc.pLengthSQ = function (v) {
    return cc.pDot(v, v);
};

/**
 * Calculates the square distance between two points (not calling sqrt() )
 * @method pDistanceSQ
 * @param {Vec2} point1
 * @param {Vec2} point2
 * @return {Number}
 */
cc.pDistanceSQ = function(point1, point2){
    return cc.pLengthSQ(cc.pSub(point1,point2));
};

/**
 * Calculates distance between point an origin
 * @method pLength
 * @param  {Vec2} v
 * @return {Number}
 */
cc.pLength = function (v) {
    return Math.sqrt(cc.pLengthSQ(v));
};

/**
 * Calculates the distance between two points
 * @method pDistance
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 */
cc.pDistance = function (v1, v2) {
    return cc.pLength(cc.pSub(v1, v2));
};

/**
 * Returns point multiplied to a length of 1.
 * @method pNormalize
 * @param {Vec2} v
 * @return {Vec2}
 */
cc.pNormalize = function (v) {
    var n = cc.pLength(v);
    return n === 0 ? cc.p(v) : cc.pMult(v, 1.0 / n);
};

/**
 * Converts radians to a normalized vector.
 * @method pForAngle
 * @param {Number} a
 * @return {Vec2}
 */
cc.pForAngle = function (a) {
    return cc.p(Math.cos(a), Math.sin(a));
};

/**
 * Converts a vector to radians.
 * @method pToAngle
 * @param {Vec2} v
 * @return {Number}
 */
cc.pToAngle = function (v) {
    return Math.atan2(v.y, v.x);
};

/**
 * Clamp a value between from and to.
 * @method clampf
 * @param {Number} value
 * @param {Number} min_inclusive
 * @param {Number} max_inclusive
 * @return {Number}
 */
cc.clampf = function (value, min_inclusive, max_inclusive) {
    if (min_inclusive > max_inclusive) {
        var temp = min_inclusive;
        min_inclusive = max_inclusive;
        max_inclusive = temp;
    }
    return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
};

/**
 * Clamp a value between 0 and 1.
 * @method clamp01
 * @param {Number} value
 * @return {Number}
 */
cc.clamp01 = function (value) {
    return value < 0 ? 0 : value < 1 ? value : 1;
};

/**
 * Clamp a point between from and to.
 * @method pClamp
 * @param {Vec2} p
 * @param {Number} min_inclusive
 * @param {Number} max_inclusive
 * @return {Vec2}
 */
cc.pClamp = function (p, min_inclusive, max_inclusive) {
    return cc.p(cc.clampf(p.x, min_inclusive.x, max_inclusive.x), cc.clampf(p.y, min_inclusive.y, max_inclusive.y));
};

/**
 * Quickly convert cc.Size to a cc.Vec2.
 * @method pFromSize
 * @param {Size} s
 * @return {Vec2}
 */
cc.pFromSize = function (s) {
    return cc.p(s.width, s.height);
};

/**
 * Run a math operation function on each point component <br />
 * Math.abs, Math.fllor, Math.ceil, Math.round.
 *
 * @method pCompOp
 * @param {Vec2} p
 * @param {Function} opFunc
 * @return {Vec2}
 * @example {@link utils/api/engine/docs/cocos2d/core/support/pCompOp.js}
 */
cc.pCompOp = function (p, opFunc) {
    return cc.p(opFunc(p.x), opFunc(p.y));
};

/**
 * Linear Interpolation between two points a and b.
 * alpha == 0 ? a
 * alpha == 1 ? b
 * otherwise a value between a..b
 *
 * @method pLerp
 * @param {Vec2} a
 * @param {Vec2} b
 * @param {Number} alpha
 * @return {Vec2}
 */
cc.pLerp = function (a, b, alpha) {
    return cc.pAdd(cc.pMult(a, 1 - alpha), cc.pMult(b, alpha));
};

/**
 * @method pFuzzyEqual
 * @param {Vec2} a
 * @param {Vec2} b
 * @param {Number} variance
 * @return {Boolean} if points have fuzzy equality which means equal with some degree of variance.
 */
cc.pFuzzyEqual = function (a, b, variance) {
    if (a.x - variance <= b.x && b.x <= a.x + variance) {
        if (a.y - variance <= b.y && b.y <= a.y + variance)
            return true;
    }
    return false;
};

/**
 * Multiplies a nd b components, a.x*b.x, a.y*b.y.
 * @method pCompMult
 * @param {Vec2} a
 * @param {Vec2} b
 * @return {Vec2}
 */
cc.pCompMult = function (a, b) {
    return cc.p(a.x * b.x, a.y * b.y);
};

/**
 * @method pAngleSigned
 * @param {Vec2} a
 * @param {Vec2} b
 * @return {Number} the signed angle in radians between two vector directions
 */
cc.pAngleSigned = function (a, b) {
    var a2 = cc.pNormalize(a);
    var b2 = cc.pNormalize(b);
    var angle = Math.atan2(a2.x * b2.y - a2.y * b2.x, cc.pDot(a2, b2));
    if (Math.abs(angle) < POINT_EPSILON)
        return 0.0;
    return angle;
};

/**
 * @method pAngle
 * @param {Vec2} a
 * @param {Vec2} b
 * @return {Number} the angle in radians between two vector directions
 */
cc.pAngle = function (a, b) {
    var angle = Math.acos(cc.pDot(cc.pNormalize(a), cc.pNormalize(b)));
    if (Math.abs(angle) < POINT_EPSILON) return 0.0;
    return angle;
};

/**
 * Rotates a point counter clockwise by the angle around a pivot.
 * @method pRotateByAngle
 * @param {Vec2} v - v is the point to rotate
 * @param {Vec2} pivot - pivot is the pivot, naturally
 * @param {Number} angle - angle is the angle of rotation cw in radians
 * @return {Vec2} the rotated point
 */
cc.pRotateByAngle = function (v, pivot, angle) {
    var r = cc.pSub(v, pivot);
    var cosa = Math.cos(angle), sina = Math.sin(angle);
    var t = r.x;
    r.x = t * cosa - r.y * sina + pivot.x;
    r.y = t * sina + r.y * cosa + pivot.y;
    return r;
};

/**
 * A general line-line intersection test
 * indicating successful intersection of a line<br />
 * note that to truly test intersection for segments we have to make<br />
 * sure that s & t lie within [0..1] and for rays, make sure s & t > 0<br />
 * the hit point is        p3 + t * (p4 - p3);<br />
 * the hit point also is    p1 + s * (p2 - p1);
 *
 * @method pLineIntersect
 * @param {Vec2} A - A is the startpoint for the first line P1 = (p1 - p2).
 * @param {Vec2} B - B is the endpoint for the first line P1 = (p1 - p2).
 * @param {Vec2} C - C is the startpoint for the second line P2 = (p3 - p4).
 * @param {Vec2} D - D is the endpoint for the second line P2 = (p3 - p4).
 * @param {Vec2} retP - retP.x is the range for a hitpoint in P1 (pa = p1 + s*(p2 - p1)), <br />
 * retP.y is the range for a hitpoint in P3 (pa = p2 + t*(p4 - p3)).
 * @return {Boolean}
 */
cc.pLineIntersect = function (A, B, C, D, retP) {
    if ((A.x === B.x && A.y === B.y) || (C.x === D.x && C.y === D.y)) {
        return false;
    }
    var BAx = B.x - A.x;
    var BAy = B.y - A.y;
    var DCx = D.x - C.x;
    var DCy = D.y - C.y;
    var ACx = A.x - C.x;
    var ACy = A.y - C.y;

    var denom = DCy * BAx - DCx * BAy;

    retP.x = DCx * ACy - DCy * ACx;
    retP.y = BAx * ACy - BAy * ACx;

    if (denom === 0) {
        if (retP.x === 0 || retP.y === 0) {
            // Lines incident
            return true;
        }
        // Lines parallel and not incident
        return false;
    }

    retP.x = retP.x / denom;
    retP.y = retP.y / denom;

    return true;
};

/**
 * ccpSegmentIntersect return YES if Segment A-B intersects with segment C-D.
 * @method pSegmentIntersect
 * @param {Vec2} A
 * @param {Vec2} B
 * @param {Vec2} C
 * @param {Vec2} D
 * @return {Boolean}
 */
cc.pSegmentIntersect = function (A, B, C, D) {
    var retP = cc.p(0, 0);
    if (cc.pLineIntersect(A, B, C, D, retP))
        if (retP.x >= 0.0 && retP.x <= 1.0 && retP.y >= 0.0 && retP.y <= 1.0)
            return true;
    return false;
};

/**
 * ccpIntersectPoint return the intersection point of line A-B, C-D.
 * @method pIntersectPoint
 * @param {Vec2} A
 * @param {Vec2} B
 * @param {Vec2} C
 * @param {Vec2} D
 * @return {Vec2}
 */
cc.pIntersectPoint = function (A, B, C, D) {
    var retP = cc.p(0, 0);

    if (cc.pLineIntersect(A, B, C, D, retP)) {
        // Point of intersection
        var P = cc.p(0, 0);
        P.x = A.x + retP.x * (B.x - A.x);
        P.y = A.y + retP.x * (B.y - A.y);
        return P;
    }

    return cc.p(0,0);
};

/**
 * check to see if both points are equal.
 * @method pSameAs
 * @param {Vec2} A - A ccp a
 * @param {Vec2} B - B ccp b to be compared
 * @return {Boolean} the true if both ccp are same
 */
cc.pSameAs = function (A, B) {
    if ((A != null) && (B != null)) {
        return (A.x === B.x && A.y === B.y);
    }
    return false;
};



// High Perfomance In Place Operationrs ---------------------------------------

/**
 * sets the position of the point to 0.
 * @method pZeroIn
 * @param {Vec2} v
 */
cc.pZeroIn = function(v) {
    v.x = 0;
    v.y = 0;
};

/**
 * copies the position of one point to another.
 * @method pIn
 * @param {Vec2} v1
 * @param {Vec2} v2
 */
cc.pIn = function(v1, v2) {
    v1.x = v2.x;
    v1.y = v2.y;
};

/**
 * multiplies the point with the given factor (inplace).
 * @method pMultIn
 * @param {Vec2} point
 * @param {Number} floatVar
 */
cc.pMultIn = function(point, floatVar) {
    point.x *= floatVar;
    point.y *= floatVar;
};

/**
 * subtracts one point from another (inplace).
 * @method pSubIn
 * @param {Vec2} v1
 * @param {Vec2} v2
 */
cc.pSubIn = function(v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
};

/**
 * adds one point to another (inplace).
 * @method pAddIn
 * @param {Vec2} v1
 * @param {Vec2} v2
 */
cc.pAddIn = function(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
};

/**
 * normalizes the point (inplace).
 * @method pNormalizeIn
 * @param {Vec2} v
 */
cc.pNormalizeIn = function(v) {
    cc.pMultIn(v, 1.0 / Math.sqrt(v.x * v.x + v.y * v.y));
};

