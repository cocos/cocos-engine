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

//var bezier = (function () {
//    function B1 (t) { return (t * t * t); }
//    function B2 (t) { return (3 * t * t * (1 - t)); }
//    function B3 (t) { return (3 * t * (1 - t) * (1 - t)); }
//    function B4 (t) { return ((1 - t) * (1 - t) * (1 - t)); }
//    function bezier (C1, C2, C3, C4, t) {
//        return C1 * B1(t) + C2 * B2(t) + C3 * B3(t) + C4 * B4(t);
//    }
//
//    //function bezier (C1, C2, C3, C4, t, out) {
//    //    out.x = C1.x * B1(t) + C2.x * B2(t) + C3.x * B3(t) + C4.x * B4(t);
//    //    out.y = C1.y * B1(t) + C2.y * B2(t) + C3.y * B3(t) + C4.y * B4(t);
//    //}
//
//    return bezier;
//})();
function bezier (C1, C2, C3, C4, t) {
    var t1 = 1 - t;
    return t1 * (t1 * (C1 + (C2 * 3 - C1) * t) + C3 * 3 * t * t) + C4 * t * t * t;
}
//function bezier (c0, c1, c2, c3, t) {
//    var cy = 3.0 * (c1);
//    var by = 3.0 * (c3 - c1) - cy;
//    var ay = 1 - cy - by;
//    return (ay * t * t * t) + (by * t * t) + (cy * t);
//}

//var sin = Math.sin;
var cos = Math.cos,
    acos = Math.acos,
    max = Math.max,
    //atan2 = Math.atan2,
    pi = Math.PI,
    tau = 2 * pi,
    sqrt = Math.sqrt;

function crt (v) {
    if (v < 0) {
        return -Math.pow(-v, 1 / 3);
    }
    else {
        return Math.pow(v, 1 / 3);
    }
}

//function align (curve, line) {
//    var tx = line.p1.x,
//        ty = line.p1.y,
//        a = -atan2(line.p2.y-ty, line.p2.x-tx);
//    curve = [{x:0, y:1}, {x: curve[0], y: 1-curve[1]}, {x: curve[2], y: 1-curve[3]}, {x:1, y:0}];
//    return curve.map(function(v) {
//        return {
//            x: (v.x-tx)*cos(a) - (v.y-ty)*sin(a),
//            y: (v.x-tx)*sin(a) + (v.y-ty)*cos(a)
//        };
//    });
//}

// Modified from http://jsbin.com/yibipofeqi/1/edit, optimized for animations.
// The origin Cardano's algorithm is based on http://www.trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm
function cardano (curve, x) {
    // align curve with the intersecting line:
        //var line = {p1: {x: x, y: 0}, p2: {x: x, y: 1}};
        //var aligned = align(curve, line);
        //// and rewrite from [a(1-t)^3 + 3bt(1-t)^2 + 3c(1-t)t^2 + dt^3] form
        //    pa = aligned[0].y,
        //    pb = aligned[1].y,
        //    pc = aligned[2].y,
        //    pd = aligned[3].y;
        ////// curve = [{x:0, y:1}, {x: curve[0], y: 1-curve[1]}, {x: curve[2], y: 1-curve[3]}, {x:1, y:0}];
    var pa = x - 0;
    var pb = x - curve[0];
    var pc = x - curve[2];
    var pd = x - 1;

    // to [t^3 + at^2 + bt + c] form:
    var pa3 = pa * 3;
    var pb3 = pb * 3;
    var pc3 = pc * 3;
    var d = (-pa + pb3 - pc3 + pd),
        rd = 1 / d,
        r3 = 1 / 3,
        a = (pa3 - 6 * pb + pc3) * rd,
        a3 = a * r3,
        b = (-pa3 + pb3) * rd,
        c = pa * rd,
    // then, determine p and q:
        p = (3 * b - a * a) * r3,
        p3 = p * r3,
        q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
        q2 = q / 2,
    // and determine the discriminant:
        discriminant = q2 * q2 + p3 * p3 * p3,
    // and some reserved variables
        u1, v1, x1, x2, x3;

    // If the discriminant is negative, use polar coordinates
    // to get around square roots of negative numbers
    if (discriminant < 0) {
        var mp3 = -p * r3,
            mp33 = mp3 * mp3 * mp3,
            r = sqrt(mp33),
        // compute cosphi corrected for IEEE float rounding:
            t = -q / (2 * r),
            cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
            phi = acos(cosphi),
            crtr = crt(r),
            t1 = 2 * crtr;
        x1 = t1 * cos(phi * r3) - a3;
        x2 = t1 * cos((phi + tau) * r3) - a3;
        x3 = t1 * cos((phi + 2 * tau) * r3) - a3;

        // choose best percentage
        if (0 <= x1 && x1 <= 1) {
            if (0 <= x2 && x2 <= 1) {
                if (0 <= x3 && x3 <= 1) {
                    return max(x1, x2, x3);
                }
                else {
                    return max(x1, x2);
                }
            }
            else if (0 <= x3 && x3 <= 1) {
                return max(x1, x3);
            }
            else {
                return x1;
            }
        }
        else {
            if (0 <= x2 && x2 <= 1) {
                if (0 <= x3 && x3 <= 1) {
                    return max(x2, x3);
                }
                else {
                    return x2;
                }
            }
            else {
                return x3;
            }
        }
    }
    else if (discriminant === 0) {
        u1 = q2 < 0 ? crt(-q2) : -crt(q2);
        x1 = 2 * u1 - a3;
        x2 = -u1 - a3;

        // choose best percentage
        if (0 <= x1 && x1 <= 1) {
            if (0 <= x2 && x2 <= 1) {
                return max(x1, x2);
            }
            else {
                return x1;
            }
        }
        else {
            return x2;
        }
    }
    // one real root, and two imaginary roots
    else {
        var sd = sqrt(discriminant);
        u1 = crt(-q2 + sd);
        v1 = crt(q2 + sd);
        x1 = u1 - v1 - a3;
        return x1;
    }
}

function bezierByTime (controlPoints, x) {
    var percent = cardano(controlPoints, x);    // t
    var p1y = controlPoints[1]; // b
    var p2y = controlPoints[3]; // c
    // return bezier(0, p1y, p2y, 1, percent);
    return ((1 - percent) * (p1y + (p2y - p1y) * percent) * 3 + percent * percent) * percent;
}

if (CC_TEST) {
    cc._Test.bezier = bezier;
    cc._Test.bezierByTime = bezierByTime;
}

module.exports = {
    bezier: bezier,
    bezierByTime: bezierByTime
};
