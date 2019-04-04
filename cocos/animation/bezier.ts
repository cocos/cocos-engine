
export function bezier (C1: number, C2: number, C3: number, C4: number, t: number) {
    const t1 = 1 - t;
    return C1 * t1 * t1 * t1 +
           C2 * 3 * t1 * t1 * t +
           C3 * 3 * t1 * t * t +
           C4 * t * t * t;
}

// var sin = Math.sin;
const cos = Math.cos;
const acos = Math.acos;
const max = Math.max;
// var atan2 = Math.atan2;
const pi = Math.PI;
const tau = 2 * pi;
const sqrt = Math.sqrt;

function crt (v: number) {
    if (v < 0) {
        return -Math.pow(-v, 1 / 3);
    }
    else {
        return Math.pow(v, 1 / 3);
    }
}

// Modified from http://jsbin.com/yibipofeqi/1/edit, optimized for animations.
// The origin Cardano's algorithm is based on http://www.trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm
function cardano (curve: number[], x: number) {
    // align curve with the intersecting line:
        // var line = {p1: {x: x, y: 0}, p2: {x: x, y: 1}};
        // var aligned = align(curve, line);
        //// and rewrite from [a(1-t)^3 + 3bt(1-t)^2 + 3c(1-t)t^2 + dt^3] form
        //    pa = aligned[0].y,
        //    pb = aligned[1].y,
        //    pc = aligned[2].y,
        //    pd = aligned[3].y;
        ////// curve = [{x:0, y:1}, {x: curve[0], y: 1-curve[1]}, {x: curve[2], y: 1-curve[3]}, {x:1, y:0}];
    const pa = x - 0;
    const pb = x - curve[0];
    const pc = x - curve[2];
    const pd = x - 1;

    // to [t^3 + at^2 + bt + c] form:
    const pa3 = pa * 3;
    const pb3 = pb * 3;
    const pc3 = pc * 3;
    const d = (-pa + pb3 - pc3 + pd);
    const rd = 1 / d;
    const r3 = 1 / 3;
    const a = (pa3 - 6 * pb + pc3) * rd;
    const a3 = a * r3;
    const b = (-pa3 + pb3) * rd;
    const c = pa * rd;
    // then, determine p and q:
    const p = (3 * b - a * a) * r3;
    const p3 = p * r3;
    const q = (2 * a * a * a - 9 * a * b + 27 * c) / 27;
    const q2 = q / 2;
    // and determine the discriminant:
    const discriminant = q2 * q2 + p3 * p3 * p3;
    // and some reserved variables
    let u1;
    let v1;
    let x1;
    let x2;
    let x3;

    // If the discriminant is negative, use polar coordinates
    // to get around square roots of negative numbers
    if (discriminant < 0) {
        const mp3 = -p * r3;
        const mp33 = mp3 * mp3 * mp3;
        const r = sqrt(mp33);
        // compute cosphi corrected for IEEE float rounding:
        const t = -q / (2 * r);
        const cosphi = t < -1 ? -1 : t > 1 ? 1 : t;
        const phi = acos(cosphi);
        const crtr = crt(r);
        const t1 = 2 * crtr;
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
        const sd = sqrt(discriminant);
        u1 = crt(-q2 + sd);
        v1 = crt(q2 + sd);
        x1 = u1 - v1 - a3;
        return x1;
    }
}

export function bezierByTime (controlPoints, x) {
    const percent = cardano(controlPoints, x);    // t
    const p0y = 0;                // a
    const p1y = controlPoints[1]; // b
    const p2y = controlPoints[3]; // c
    const p3y = 1;                // d
    const t1 = 1 - percent;
    return p0y * t1 * t1 * t1 +
           p1y * 3 * percent * t1 * t1 +
           p2y * 3 * percent * percent * t1 +
           p3y * percent * percent * percent;
}
