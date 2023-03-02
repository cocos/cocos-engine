import { lerp, Vec2, Vec3 } from '../../core/math';

// https://mrl.cs.nyu.edu/~perlin/noise/
const permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233,  7, 225,
    140, 36, 103, 30, 69, 142,  8, 99, 37, 240, 21, 10, 23, 190,  6, 148,
    247, 120, 234, 75,  0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161,  1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,  3, 64,
    52, 217, 226, 250, 124, 123,  5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
    207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
    119, 248, 152,  2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172,  9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
    218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127,  4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,

    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233,  7, 225,
    140, 36, 103, 30, 69, 142,  8, 99, 37, 240, 21, 10, 23, 190,  6, 148,
    247, 120, 234, 75,  0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161,  1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,  3, 64,
    52, 217, 226, 250, 124, 123,  5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
    207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
    119, 248, 152,  2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172,  9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
    218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127,  4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
];

const gradients3D = [
    new Vec3(1, 1, 0),
    new Vec3(-1, 1, 0),
    new Vec3(1, -1, 0),
    new Vec3(-1, -1, 0),
    new Vec3(1, 0, 1),
    new Vec3(-1, 0, 1),
    new Vec3(1, 0, -1),
    new Vec3(-1, 0, -1),
    new Vec3(0, 1, 1),
    new Vec3(0, -1, 1),
    new Vec3(0, 1, -1),
    new Vec3(0, -1, -1),

    new Vec3(1, 1, 0),
    new Vec3(-1, 1, 0),
    new Vec3(0, -1, 1),
    new Vec3(0, -1, -1),
];

const gradientMask3D = 15;

const gradients2D = [
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(0, 1),
    new Vec2(0, -1),
    new Vec2(1, 1).normalize(),
    new Vec2(-1, 1).normalize(),
    new Vec2(1, -1).normalize(),
    new Vec2(-1, -1).normalize(),
];
const gradientMask2D = 7;

const gradients1D = [
    1, -1,
];
const gradientsMask1D = 1;

function smooth (t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function smoothDerivative (t: number) { return 30 * t * t * (t * (t - 2) + 1); }

const db3 = new Vec3();
const dc3 = new Vec3();
const dd3 = new Vec3();
const de3 = new Vec3();
const df3 = new Vec3();
const dg3 = new Vec3();
const dh3 = new Vec3();

const temp1 = new Vec3();
const temp2 = new Vec3();

export function perlin3D (outDerivative: Vec2, position: Vec3, frequency: number) {
    const x = position.x * frequency;
    const y = position.y * frequency;
    const z = position.z * frequency;
    let ix0 = Math.floor(x);
    let iy0 = Math.floor(y);
    let iz0 = Math.floor(z);
    const tx0 = x - ix0;
    const ty0 = y - iy0;
    const tz0 = z - iz0;
    const tx1 = tx0 - 1;
    const ty1 = ty0 - 1;
    const tz1 = tz0 - 1;
    ix0 &= 255;
    iy0 &= 255;
    iz0 &= 255;
    const ix1 = ix0 + 1;
    const iy1 = iy0 + 1;
    const iz1 = iz0 + 1;

    const h0 = permutation[ix0];
    const h1 = permutation[ix1];
    const h00 = permutation[h0 + iy0];
    const h10 = permutation[h1 + iy0];
    const h01 = permutation[h0 + iy1];
    const h11 = permutation[h1 + iy1];
    const g000 = gradients3D[permutation[h00 + iz0] & gradientMask3D];
    const g100 = gradients3D[permutation[h10 + iz0] & gradientMask3D];
    const g010 = gradients3D[permutation[h01 + iz0] & gradientMask3D];
    const g110 = gradients3D[permutation[h11 + iz0] & gradientMask3D];
    const g001 = gradients3D[permutation[h00 + iz1] & gradientMask3D];
    const g101 = gradients3D[permutation[h10 + iz1] & gradientMask3D];
    const g011 = gradients3D[permutation[h01 + iz1] & gradientMask3D];
    const g111 = gradients3D[permutation[h11 + iz1] & gradientMask3D];
    const v000 = dot3(g000, tx0, ty0, tz0);
    const v100 = dot3(g100, tx1, ty0, tz0);
    const v010 = dot3(g010, tx0, ty1, tz0);
    const v110 = dot3(g110, tx1, ty1, tz0);
    const v001 = dot3(g001, tx0, ty0, tz1);
    const v101 = dot3(g101, tx1, ty0, tz1);
    const v011 = dot3(g011, tx0, ty1, tz1);
    const v111 = dot3(g111, tx1, ty1, tz1);
    const tx = smooth(tx0);
    const ty = smooth(ty0);
    const tz = smooth(tz0);
    const dtx = smoothDerivative(tx0);
    const dty = smoothDerivative(ty0);

    const b = v100 - v000;
    const c = v010 - v000;
    const e = v110 - v010 - v100 + v000;
    const f = v101 - v001 - v100 + v000;
    const g = v011 - v001 - v010 + v000;
    const h = v111 - v011 - v101 + v001 - v110 + v010 + v100 - v000;

    Vec2.subtract(db3, g100, g000);
    Vec2.subtract(dc3, g010, g000);
    Vec2.subtract(dd3, g001, g000);
    Vec2.subtract(de3, g110, g010);
    Vec2.subtract(de3, de3, db3);
    Vec2.subtract(df3, g101, g001);
    Vec2.subtract(df3, df3, db3);
    Vec2.subtract(dg3, g011, g001);
    Vec2.subtract(dg3, dg3, dc3);
    Vec2.subtract(dh3, g111, g011);
    Vec2.subtract(dh3, dh3, df3);
    Vec2.subtract(dh3, dh3, de3);
    Vec2.subtract(dh3, dh3, db3);

    Vec2.scaleAndAdd(temp1,
        Vec2.scaleAndAdd(temp1, Vec2.scaleAndAdd(temp1, g000, Vec2.scaleAndAdd(temp1, dc3, de3, tx), ty), db3, tx),
        Vec2.scaleAndAdd(temp2, Vec2.scaleAndAdd(temp2, dd3, Vec2.scaleAndAdd(temp2, dg3, dh3, tx), ty), df3, tx),
        tz);
    outDerivative.x = temp1.x + (b + e * ty + (f + h * ty) * tz) * dtx;
    outDerivative.y = temp1.y + (c + e * tx + (g + h * tx) * tz) * dty;
    Vec2.multiplyScalar(outDerivative, outDerivative, frequency);
    return outDerivative;
}

const db2 = new Vec2();
const dc2 = new Vec2();
const dd2 = new Vec2();
export function perlin2D (outDerivative: Vec2, position: Vec2, frequency: number) {
    const x = position.x * frequency;
    const y = position.y * frequency;
    let ix0 = Math.floor(x);
    let iy0 = Math.floor(y);
    const tx0 = x - ix0;
    const ty0 = y - iy0;
    const tx1 = tx0 - 1;
    const ty1 = ty0 - 1;
    ix0 &= 255;
    iy0 &= 255;
    const ix1 = ix0 + 1.0;
    const iy1 = iy0 + 1.0;

    const h0 = permutation[ix0];
    const h1 = permutation[ix1];

    const g00 = gradients2D[permutation[h0 + iy0] & gradientMask2D];
    const g01 = gradients2D[permutation[h1 + iy0] & gradientMask2D];
    const g10 = gradients2D[permutation[h0 + iy1] & gradientMask2D];
    const g11 = gradients2D[permutation[h1 + iy1] & gradientMask2D];
    const v00 = dot2(g00, tx0, ty0);
    const v10 = dot2(g10, tx1, ty0);
    const v01 = dot2(g01, tx0, ty1);
    const v11 = dot2(g11, tx1, ty1);
    const tx = smooth(tx0);
    const ty = smooth(ty0);
    const dtx = smoothDerivative(tx0);
    const dty = smoothDerivative(ty0);

    const b = v10 - v00;
    const c = v01 - v00;
    const d = v11 - v01 - b;

    Vec2.subtract(db2, g10, g00);
    Vec2.subtract(dc2, g01, g00);
    Vec2.subtract(dd2, g11, g01);
    Vec2.subtract(dd2, dd2, db2);

    Vec2.scaleAndAdd(outDerivative, Vec2.scaleAndAdd(outDerivative, g00, Vec2.scaleAndAdd(outDerivative, dc2, dd2, tx), ty), db2, tx);
    outDerivative.x += (b + d * ty) * dtx;
    outDerivative.y += (c + d * tx) * dty;
    Vec2.multiplyScalar(outDerivative, outDerivative, frequency * Math.SQRT2);
    return outDerivative;
}

export function perlin1D (outDerivative: Vec2, x: number, frequency: number) {
    x *= frequency;
    let i0 = Math.floor(x);
    const t0 = x - i0;
    const t1 = t0 - 1;
    i0 &= 255;
    const i1 = i0 + 1;
    const g0 = gradients1D[permutation[i0] & gradientsMask1D];
    const g1 = gradients1D[permutation[i1] & gradientsMask1D];
    const v0 = g0 * t0;
    const v1 = g1 * t1;
    const dt = smoothDerivative(t0);
    const t = smooth(t0);
    outDerivative.x = (g0 + (g1 - g0) * t + (v1 - v0) * dt) * frequency * 2.0;
    outDerivative.y = 0;
    return outDerivative;
}

function dot2 (a: Vec2, bx: number, by: number) {
    return a.x * bx + a.y * by;
}

function dot3 (a: Vec3, bx: number, by: number, bz: number) {
    return a.x * bx + a.y * by + a.z * bz;
}
