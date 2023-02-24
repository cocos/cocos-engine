import { lerp, Vec2, Vec3 } from '../../core/math';

// https://mrl.cs.nyu.edu/~perlin/noise/
const permutation = [
    63, 9, 212, 205, 31, 128, 72, 59, 137, 203, 195, 170, 181, 115, 165, 40, 116, 139, 175, 225, 132, 99, 222, 2, 41, 15, 197, 93, 169, 90, 228, 43, 221, 38, 206, 204, 73, 17, 97, 10, 96, 47, 32, 138, 136, 30, 219,
    78, 224, 13, 193, 88, 134, 211, 7, 112, 176, 19, 106, 83, 75, 217, 85, 0, 98, 140, 229, 80, 118, 151, 117, 251, 103, 242, 81, 238, 172, 82, 110, 4, 227, 77, 243, 46, 12, 189, 34, 188, 200, 161, 68, 76, 171, 194,
    57, 48, 247, 233, 51, 105, 5, 23, 42, 50, 216, 45, 239, 148, 249, 84, 70, 125, 108, 241, 62, 66, 64, 240, 173, 185, 250, 49, 6, 37, 26, 21, 244, 60, 223, 255, 16, 145, 27, 109, 58, 102, 142, 253, 120, 149, 160,
    124, 156, 79, 186, 135, 127, 14, 121, 22, 65, 54, 153, 91, 213, 174, 24, 252, 131, 192, 190, 202, 208, 35, 94, 231, 56, 95, 183, 163, 111, 147, 25, 67, 36, 92, 236, 71, 166, 1, 187, 100, 130, 143, 237, 178, 158,
    104, 184, 159, 177, 52, 214, 230, 119, 87, 114, 201, 179, 198, 3, 248, 182, 39, 11, 152, 196, 113, 20, 232, 69, 141, 207, 234, 53, 86, 180, 226, 74, 150, 218, 29, 133, 8, 44, 123, 28, 146, 89, 101, 154, 220, 126,
    155, 122, 210, 168, 254, 162, 129, 33, 18, 209, 61, 191, 199, 157, 245, 55, 164, 167, 215, 246, 144, 107, 235,

    63, 9, 212, 205, 31, 128, 72, 59, 137, 203, 195, 170, 181, 115, 165, 40, 116, 139, 175, 225, 132, 99, 222, 2, 41, 15, 197, 93, 169, 90, 228, 43, 221, 38, 206, 204, 73, 17, 97, 10, 96, 47, 32, 138, 136, 30, 219,
    78, 224, 13, 193, 88, 134, 211, 7, 112, 176, 19, 106, 83, 75, 217, 85, 0, 98, 140, 229, 80, 118, 151, 117, 251, 103, 242, 81, 238, 172, 82, 110, 4, 227, 77, 243, 46, 12, 189, 34, 188, 200, 161, 68, 76, 171, 194,
    57, 48, 247, 233, 51, 105, 5, 23, 42, 50, 216, 45, 239, 148, 249, 84, 70, 125, 108, 241, 62, 66, 64, 240, 173, 185, 250, 49, 6, 37, 26, 21, 244, 60, 223, 255, 16, 145, 27, 109, 58, 102, 142, 253, 120, 149, 160,
    124, 156, 79, 186, 135, 127, 14, 121, 22, 65, 54, 153, 91, 213, 174, 24, 252, 131, 192, 190, 202, 208, 35, 94, 231, 56, 95, 183, 163, 111, 147, 25, 67, 36, 92, 236, 71, 166, 1, 187, 100, 130, 143, 237, 178, 158,
    104, 184, 159, 177, 52, 214, 230, 119, 87, 114, 201, 179, 198, 3, 248, 182, 39, 11, 152, 196, 113, 20, 232, 69, 141, 207, 234, 53, 86, 180, 226, 74, 150, 218, 29, 133, 8, 44, 123, 28, 146, 89, 101, 154, 220, 126,
    155, 122, 210, 168, 254, 162, 129, 33, 18, 209, 61, 191, 199, 157, 245, 55, 164, 167, 215, 246, 144, 107, 235,
];
const grad1Scales = [-8 / 8, -7 / 8.0, -6 / 8.0, -5 / 8.0, -4 / 8.0, -3 / 8.0, -2 / 8.0, -1 / 8.0, 1 / 8.0, 2 / 8.0, 3 / 8.0, 4 / 8.0, 5 / 8.0, 6 / 8.0, 7 / 8.0, 8 / 8];

function grad1 (hash: number, x: number) {
    return grad1Scales[hash & 15] * x;
}
function grad2 (hash: number, x: number, y: number) {
    switch (hash & 7) {
    case 0: return x;
    case 1: return x + y;
    case 2: return y;
    case 3: return -x + y;
    case 4: return -x;
    case 5: return -x - y;
    case 6: return -y;
    case 7: return x - y;
        // can't happen
    default: return 0;
    }
}
function grad3 (hash: number, x: number, y: number, z: number) {
    switch (hash & 15) {
    // 12 cube midpoints
    case 0: return x + z;
    case 1: return x + y;
    case 2: return y + z;
    case 3: return -x + y;
    case 4: return -x + z;
    case 5: return -x - y;
    case 6: return -y + z;
    case 7: return x - y;
    case 8: return x - z;
    case 9: return y - z;
    case 10: return -x - z;
    case 11: return -y - z;
    // 4 vertices of regular tetrahedron
    case 12: return x + y;
    case 13: return -x + y;
    case 14: return -y + z;
    case 15: return -y - z;
    // can't happen
    default: return 0;
    }
}

const gradients3D = [

];

function smooth (t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function smoothDerivative (t: number) { return 30 * t * t * (t * (t - 2) + 1); }

const samplePoint = new Vec3();
export function perlin3D (outDerivative: Vec2, position: Vec3, frequency: number) {
    Vec3.multiplyScalar(samplePoint, position, frequency);
    let { x, y, z } = samplePoint;
    const XF = Math.floor(x);
    const YF = Math.floor(y);
    const ZF = Math.floor(z);
    const X = XF & 255;
    const Y = YF & 255;
    const Z = ZF & 255;
    x -= XF;
    y -= YF;
    z -= ZF;
    const x1 = x - 1.0;
    const y1 = y - 1.0;
    const z1 = z - 1.0;
    const u = smooth(x);
    const v = smooth(y);
    const w = smooth(z);
    const A = permutation[X] + Y;
    const AA = permutation[A] + Z;
    const AB = permutation[A + 1] + Z;
    const B = permutation[X + 1] + Y;
    const BA = permutation[B] + Z;
    const BB = permutation[B + 1] + Z;

    return 0.97 * lerp(
        lerp(
            lerp(grad3(permutation[AA], x, y, z), grad3(permutation[BA], x1, y, z), u),
            lerp(grad3(permutation[AB], x, y1, z), grad3(permutation[BB], x1, y1, z), u),
            v,
        ),
        lerp(
            lerp(grad3(permutation[AA + 1], x, y, z1), grad3(permutation[BA + 1], x1, y, z1), u),
            lerp(grad3(permutation[AB + 1], x, y1, z1), grad3(permutation[BB + 1], x1, y1, z1), u),
            v,
        ),
        w,
    );
}

export function perlinNoise2D (position: Vec2) {
    let { x, y } = position;
    const XF = Math.floor(x);
    const YF = Math.floor(y);
    const X = XF & 255;
    const Y = YF & 255;
    x -= XF;
    y -= YF;
    const x1 = x - 1.0;
    const y1 = y - 1.0;
    const u = smooth(x);
    const v = smooth(y);
    const AA = permutation[X] + Y;
    const AB = AA + 1;
    const BA = permutation[X + 1] + Y;
    const BB = BA + 1;

    return 2 * lerp(
        lerp(grad2(permutation[AA], x, y), grad2(permutation[BA], x1, y), u),
        lerp(grad2(permutation[AB], x, y1), grad2(permutation[BB], x1, y1), u),
        v,
    );
}

export function perlinNoise1D (x: number) {
    const XF = Math.floor(x);
    const X = XF & 255;
    x -= XF;
    const x1 = x - 1.0;
    const u = smooth(x);
    return lerp(grad1(permutation[X], x), grad1(permutation[X + 1], x1), u);
}
