/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

/*
 * !#en smallest such that 1.0+FLT_EPSILON != 1.0.
 * !#zh 它是满足 1.0+FLT_EPSILON != 1.0 的最小的正数。
 * @property POINT_EPSILON
 * @type {Number}
 * @static
 */
var POINT_EPSILON = parseFloat('1.192092896e-07F');

/**
 * !#en Returns opposite of Vec2.
 * !#zh 返回相反的向量。
 * @method pNeg
 * @param {Vec2} point
 * @return {Vec2}
 * @example
 * cc.pNeg(cc.v2(10, 10));// Vec2 {x: -10, y: -10};
 */
cc.pNeg = function (point) {
    return cc.p(-point.x, -point.y);
};

/**
 * !#en Calculates sum of two points.
 * !#zh 返回两个向量的和。
 * @method pAdd
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 * @example
 * cc.pAdd(cc.v2(1, 1), cc.v2(2, 2));// Vec2 {x: 3, y: 3};
 */
cc.pAdd = function (v1, v2) {
    return cc.p(v1.x + v2.x, v1.y + v2.y);
};

/**
 * !#en Calculates difference of two points.
 * !#zh 返回两个向量的差。
 * @method pSub
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 * @example
 * cc.pSub(cc.v2(20, 20), cc.v2(5, 5)); // Vec2 {x: 15, y: 15};
 */
cc.pSub = function (v1, v2) {
    return cc.p(v1.x - v2.x, v1.y - v2.y);
};

/**
 * !#en Returns point multiplied by given factor.
 * !#zh 向量缩放。
 * @method pMult
 * @param {Vec2} point
 * @param {Number} floatVar
 * @return {Vec2}
 * @example
 * cc.pMult(cc.v2(5, 5), 4); // Vec2 {x: 20, y: 20};
 */
cc.pMult = function (point, floatVar) {
    return cc.p(point.x * floatVar, point.y * floatVar);
};

/**
 * !#en Calculates midpoint between two points.
 * !#zh 两个向量之间的中心点。
 * @method pMidpoint
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 * @example
 * cc.pMidpoint(cc.v2(10, 10), cc.v2(5, 5)); // Vec2 {x: 7.5, y: 7.5};
 */
cc.pMidpoint = function (v1, v2) {
    return cc.pMult(cc.pAdd(v1, v2), 0.5);
};

/**
 * !#en Calculates dot product of two points.
 * !#zh 两个向量之间进行点乘。
 * @method pDot
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 * @example
 * cc.pDot(cc.v2(20, 20), cc.v2(5, 5)); // 200;
 */
cc.pDot = function (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * !#en Calculates cross product of two points.
 * !#zh 两个向量之间进行叉乘。
 * @method pCross
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 * @example
 * cc.pCross(cc.v2(20, 20), cc.v2(5, 5)); // 0;
 */
cc.pCross = function (v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
};

/**
 * !#en Calculates perpendicular of v, rotated 90 degrees counter-clockwise -- cross(v, perp(v)) greater than 0.
 * !#zh 返回逆时针旋转 90 度后的新向量。
 * @method pPerp
 * @param {Vec2} point
 * @return {Vec2}
 * @example
 * cc.pPerp(cc.v2(20, 20)); // Vec2 {x: -20, y: 20};
 */
cc.pPerp = function (point) {
    return cc.p(-point.y, point.x);
};

/**
 * !#en Calculates perpendicular of v, rotated 90 degrees clockwise -- cross(v, rperp(v)) smaller than 0.
 * !#zh 将指定向量顺时针旋转 90 度并返回。
 * @method pRPerp
 * @param {Vec2} point
 * @return {Vec2}
 * @example
 * cc.pRPerp(cc.v2(20, 20)); // Vec2 {x: 20, y: -20};
 */
cc.pRPerp = function (point) {
    return cc.p(point.y, -point.x);
};

/**
 * !#en Calculates the projection of v1 over v2.
 * !#zh 返回 v1 在 v2 上的投影向量。
 * @method pProject
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Vec2}
 * @example
 * var v1 = cc.v2(20, 20);
 * var v2 = cc.v2(5, 5);
 * cc.pProject(v1, v2); // Vec2 {x: 20, y: 20};
 */
cc.pProject = function (v1, v2) {
    return cc.pMult(v2, cc.pDot(v1, v2) / cc.pDot(v2, v2));
};

/**
 * !#en Calculates the square length of a cc.Vec2 (not calling sqrt() ).
 * !#zh 返回指定向量长度的平方。
 * @method pLengthSQ
 * @param  {Vec2} v
 * @return {Number}
 * @example
 * cc.pLengthSQ(cc.v2(20, 20)); // 800;
 */
cc.pLengthSQ = function (v) {
    return cc.pDot(v, v);
};

/**
 * !#en Calculates the square distance between two points (not calling sqrt() ).
 * !#zh 返回两个点之间距离的平方。
 * @method pDistanceSQ
 * @param {Vec2} point1
 * @param {Vec2} point2
 * @return {Number}
 * @example
 * var point1 = cc.v2(20, 20);
 * var point2 = cc.v2(5, 5);
 * cc.pDistanceSQ(point1, point2); // 450;
 */
cc.pDistanceSQ = function(point1, point2){
    return cc.pLengthSQ(cc.pSub(point1,point2));
};

/**
 * !#en Calculates distance between point an origin.
 * !#zh 返回指定向量的长度.
 * @method pLength
 * @param  {Vec2} v
 * @return {Number}
 * @example
 * cc.pLength(cc.v2(20, 20)); // 28.284271247461902;
 */
cc.pLength = function (v) {
    return Math.sqrt(cc.pLengthSQ(v));
};

/**
 * !#en Calculates the distance between two points.
 * !#zh 返回指定 2 个向量之间的距离。
 * @method pDistance
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Number}
 * @example
 * var v1 = cc.v2(20, 20);
 * var v2 = cc.v2(5, 5);
 * cc.pDistance(v1, v2); // 21.213203435596427;
 */
cc.pDistance = function (v1, v2) {
    return cc.pLength(cc.pSub(v1, v2));
};

/**
 * !#en Returns this vector with a magnitude of 1.
 * !#zh 返回一个长度为 1 的标准化过后的向量。
 * @method pNormalize
 * @param {Vec2} v
 * @return {Vec2}
 * @example
 * cc.pNormalize(cc.v2(20, 20)); // Vec2 {x: 0.7071067811865475, y: 0.7071067811865475};
 */
cc.pNormalize = function (v) {
    var n = cc.pLength(v);
    return n === 0 ? cc.p(v) : cc.pMult(v, 1.0 / n);
};

/**
 * !#en Converts radians to a normalized vector.
 * !#zh 将弧度转换为一个标准化后的向量，返回坐标 x = cos(a) , y = sin(a)。
 * @method pForAngle
 * @param {Number} a
 * @return {Vec2}
 * @example
 * cc.pForAngle(20); // Vec2 {x: 0.40808206181339196, y: 0.9129452507276277};
 */
cc.pForAngle = function (a) {
    return cc.p(Math.cos(a), Math.sin(a));
};

/**
 * !#en Converts a vector to radians.
 * !#zh 返回指定向量的弧度。
 * @method pToAngle
 * @param {Vec2} v
 * @return {Number}
 * @example
 * cc.pToAngle(cc.v2(20, 20)); // 0.7853981633974483;
 */
cc.pToAngle = function (v) {
    return Math.atan2(v.y, v.x);
};

/**
 * !#en Clamp a value between from and to.
 * !#zh
 * 限定浮点数的最大最小值。<br/>
 * 数值大于 max_inclusive 则返回 max_inclusive。<br/>
 * 数值小于 min_inclusive 则返回 min_inclusive。<br/>
 * 否则返回自身。
 * @method clampf
 * @param {Number} value
 * @param {Number} min_inclusive
 * @param {Number} max_inclusive
 * @return {Number}
 * @example
 * var v1 = cc.clampf(20, 0, 20); // 20;
 * var v2 = cc.clampf(-1, 0, 20); //  0;
 * var v3 = cc.clampf(10, 0, 20); // 10;
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
 * !#en Clamp a value between 0 and 1.
 * !#zh 限定浮点数的取值范围为 0 ~ 1 之间。
 * @method clamp01
 * @param {Number} value
 * @return {Number}
 * @example
 * var v1 = cc.clampf(20);  // 1;
 * var v2 = cc.clampf(-1);  // 0;
 * var v3 = cc.clampf(0.5); // 0.5;
 */
cc.clamp01 = function (value) {
    return value < 0 ? 0 : value < 1 ? value : 1;
};

/**
 * !#en Clamp a point between from and to.
 * !#zh
 * 返回指定限制区域后的向量。<br/>
 * 向量大于 max_inclusive 则返回 max_inclusive。<br/>
 * 向量小于 min_inclusive 则返回 min_inclusive。<br/>
 * 否则返回自身。
 * @method pClamp
 * @param {Vec2} p
 * @param {Vec2} min_inclusive
 * @param {Vec2} max_inclusive
 * @return {Vec2}
 * @example
 * var min_inclusive = cc.v2(0, 0);
 * var max_inclusive = cc.v2(20, 20);
 * var v1 = cc.pClamp(cc.v2(20, 20), min_inclusive, max_inclusive); // Vec2 {x: 20, y: 20};
 * var v2 = cc.pClamp(cc.v2(0, 0), min_inclusive, max_inclusive);   // Vec2 {x: 0, y: 0};
 * var v3 = cc.pClamp(cc.v2(10, 10), min_inclusive, max_inclusive); // Vec2 {x: 10, y: 10};
 */
cc.pClamp = function (p, min_inclusive, max_inclusive) {
    return cc.p(cc.clampf(p.x, min_inclusive.x, max_inclusive.x), cc.clampf(p.y, min_inclusive.y, max_inclusive.y));
};

/**
 * !#en Quickly convert cc.Size to a cc.Vec2.
 * !#zh 快速转换 cc.Size 为 cc.Vec2。
 * @method pFromSize
 * @param {Size} s
 * @return {Vec2}
 * @example
 * cc.pFromSize(new cc.size(20, 20)); // Vec2 {x: 20, y: 20};
 */
cc.pFromSize = function (s) {
    return cc.p(s.width, s.height);
};

/**
 * !#en
 * Run a math operation function on each point component <br />
 * Math.abs, Math.fllor, Math.ceil, Math.round.
 * !#zh 通过运行指定的数学运算函数来计算指定的向量。
 * @method pCompOp
 * @param {Vec2} p
 * @param {Function} opFunc
 * @return {Vec2}
 * @example
 * cc.pCompOp(cc.p(-10, -10), Math.abs); // Vec2 {x: 10, y: 10};
 */
cc.pCompOp = function (p, opFunc) {
    return cc.p(opFunc(p.x), opFunc(p.y));
};

/**
 * !#en
 * Linear Interpolation between two points a and b.<br />
 * alpha == 0 ? a <br />
 * alpha == 1 ? b <br />
 * otherwise a value between a..b.
 * !#zh
 * 两个点 A 和 B 之间的线性插值。 <br />
 * alpha == 0 ? a <br />
 * alpha == 1 ? b <br />
 * 否则这个数值在 a ~ b 之间。
 * @method pLerp
 * @param {Vec2} a
 * @param {Vec2} b
 * @param {Number} alpha
 * @return {Vec2}
 * @example
 * cc.pLerp(cc.v2(20, 20), cc.v2(5, 5), 0.5); // Vec2 {x: 12.5, y: 12.5};
 */
cc.pLerp = function (a, b, alpha) {
    return cc.pAdd(cc.pMult(a, 1 - alpha), cc.pMult(b, alpha));
};

/**
 * !#en TODO
 * !#zh
 * 近似判断两个点是否相等。<br/>
 * 判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
 * @method pFuzzyEqual
 * @param {Vec2} a
 * @param {Vec2} b
 * @param {Number} variance
 * @return {Boolean} if points have fuzzy equality which means equal with some degree of variance.
 * @example
 * var a = cc.v2(20, 20);
 * var b = cc.v2(5, 5);
 * var b1 = cc.pFuzzyEqual(a, b, 10); // false;
 * var b2 = cc.pFuzzyEqual(a, b, 18); // true;
 */
cc.pFuzzyEqual = function (a, b, variance) {
    if (a.x - variance <= b.x && b.x <= a.x + variance) {
        if (a.y - variance <= b.y && b.y <= a.y + variance)
            return true;
    }
    return false;
};

/**
 * !#en Multiplies a nd b components, a.x*b.x, a.y*b.y.
 * !#zh 计算两个向量的每个分量的乘积， a.x * b.x, a.y * b.y。
 * @method pCompMult
 * @param {Vec2} a
 * @param {Vec2} b
 * @return {Vec2}
 * @example
 * cc.pCompMult(acc.v2(20, 20), cc.v2(5, 5)); // Vec2 {x: 100, y: 100};
 */
cc.pCompMult = function (a, b) {
    return cc.p(a.x * b.x, a.y * b.y);
};

/**
 * !#en TODO
 * !#zh 返回两个向量之间带正负号的弧度。
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
 * !#en TODO
 * !#zh 获取当前向量与指定向量之间的弧度角。
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
 * !#en Rotates a point counter clockwise by the angle around a pivot.
 * !#zh 返回给定向量围绕指定轴心顺时针旋转一定弧度后的结果。
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
 * !#en
 * A general line-line intersection test
 * indicating successful intersection of a line<br />
 * note that to truly test intersection for segments we have to make<br />
 * sure that s & t lie within [0..1] and for rays, make sure s & t > 0<br />
 * the hit point is        p3 + t * (p4 - p3);<br />
 * the hit point also is    p1 + s * (p2 - p1);
 * !#zh
 * 返回 A 为起点 B 为终点线段 1 所在直线和 C 为起点 D 为终点线段 2 所在的直线是否相交，<br />
 * 如果相交返回 true，反之则为 false，参数 retP 是返回交点在线段 1、线段 2 上的比例。
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
 * !#en ccpSegmentIntersect return YES if Segment A-B intersects with segment C-D.
 * !#zh 返回线段 A - B 和线段 C - D 是否相交。
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
 * !#en ccpIntersectPoint return the intersection point of line A-B, C-D.
 * !#zh 返回线段 A - B 和线段 C - D 的交点。
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
 * !#en check to see if both points are equal.
 * !#zh 检查指定的 2 个向量是否相等。
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
 * !#en sets the position of the point to 0.
 * !#zh 设置指定向量归 0。
 * @method pZeroIn
 * @param {Vec2} v
 */
cc.pZeroIn = function(v) {
    v.x = 0;
    v.y = 0;
};

/**
 * !#en copies the position of one point to another.
 * !#zh 令 v1 向量等同于 v2。
 * @method pIn
 * @param {Vec2} v1
 * @param {Vec2} v2
 */
cc.pIn = function(v1, v2) {
    v1.x = v2.x;
    v1.y = v2.y;
};

/**
 * !#en multiplies the point with the given factor (inplace).
 * !#zh 向量缩放，结果保存到第一个向量。
 * @method pMultIn
 * @param {Vec2} point
 * @param {Number} floatVar
 */
cc.pMultIn = function(point, floatVar) {
    point.x *= floatVar;
    point.y *= floatVar;
};

/**
 * !#en subtracts one point from another (inplace).
 * !#zh 向量减法，结果保存到第一个向量。
 * @method pSubIn
 * @param {Vec2} v1
 * @param {Vec2} v2
 */
cc.pSubIn = function(v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
};

/**
 * !#en adds one point to another (inplace).
 * !#zh 向量加法，结果保存到第一个向量。
 * @method pAddIn
 * @param {Vec2} v1
 * @param {Vec2} v2
 */
cc.pAddIn = function(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
};

/**
 * !#en normalizes the point (inplace).
 * !#zh 规范化 v 向量，设置 v 向量长度为 1。
 * @method pNormalizeIn
 * @param {Vec2} v
 */
cc.pNormalizeIn = function(v) {
    cc.pMultIn(v, 1.0 / Math.sqrt(v.x * v.x + v.y * v.y));
};

