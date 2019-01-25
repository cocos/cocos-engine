import { mat4, quat, randomRange, vec3, random, vec2, randomRangeInt } from '../../../core/vmath';
import { sign } from '../../../core/vmath/bits';
import { Enum } from '../../../core/value-types';

export const particleEmitZAxis = vec3.create(0, 0, -1);

export const Space = Enum({
    World: 0,
    Local: 1,
    Custom: 2,
});

export function calculateTransform (systemSpace, moduleSpace, worldTransform, outQuat) {
    if (moduleSpace !== systemSpace) {
        if (systemSpace === 'world') {
            mat4.getRotation(outQuat, worldTransform);
        }
        else {
            mat4.invert(worldTransform, worldTransform);
            mat4.getRotation(outQuat, worldTransform);
        }
        return true;
    }
    else {
        quat.set(outQuat, 0, 0, 0, 1);
        return false;
    }
}

export function fixedAngleUnitVector2 (out, theta) {
    vec2.set(out, Math.cos(theta), Math.sin(theta));
}

export function randomUnitVector2 (out) {
    const a = randomRange(0, 2 * Math.PI);
    const x = Math.cos(a);
    const y = Math.sin(a);
    vec2.set(out, x, y);
}

export function randomUnitVector (out) {
    const z = randomRange(-1, 1);
    const a = randomRange(0, 2 * Math.PI);
    const r = Math.sqrt(1 - z * z);
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    vec3.set(out, x, y, z);
}

export function randomPointInUnitSphere (out) {
    randomUnitVector(out);
    vec3.scale(out, out, random());
}

export function randomPointBetweenSphere (out, minRadius, maxRadius) {
    randomUnitVector(out);
    vec3.scale(out, out, minRadius + (maxRadius - minRadius) * random());
}

export function randomPointInUnitCircle (out) {
    randomUnitVector2(out);
    out.z = 0;
    vec3.scale(out, out, random());
}

export function randomPointBetweenCircle (out, minRadius, maxRadius) {
    randomUnitVector2(out);
    out.z = 0;
    vec3.scale(out, out, minRadius + (maxRadius - minRadius) * random());
}

export function randomPointBetweenCircleAtFixedAngle (out, minRadius, maxRadius, theta) {
    fixedAngleUnitVector2(out, theta);
    out.z = 0;
    vec3.scale(out, out, minRadius + (maxRadius - minRadius) * random());
}

export function randomPointInCube (out, extents) {
    vec3.set(out,
        randomRange(-extents.x, extents.x),
        randomRange(-extents.y, extents.y),
        randomRange(-extents.z, extents.z));
}

export function randomPointBetweenCube (out, minBox, maxBox) {
    const subscript = ['x', 'y', 'z'];
    const edge = randomRangeInt(0, 3);
    for (let i = 0; i < 3; i++) {
        if (i === edge) {
            out[subscript[i]] = randomRange(-maxBox[subscript[i]], maxBox[subscript[i]]);
            continue;
        }
        const x = random() * 2 - 1;
        if (x < 0) {
            out[subscript[i]] = -minBox[subscript[i]] + x * (maxBox[subscript[i]] - minBox[subscript[i]]);
        }
        else {
            out[subscript[i]] = minBox[subscript[i]] + x * (maxBox[subscript[i]] - minBox[subscript[i]]);
        }
    }
}

// Fisher–Yates shuffle
export function randomSortArray (arr) {
    for (let i = 0; i < arr.length; i++) {
        const transpose = i + randomRangeInt(0, arr.length - i);
        const val = arr[transpose];
        arr[transpose] = arr[i];
        arr[i] = val;
    }
}

export function randomSign () {
    let sgn = randomRange(-1, 1);
    sgn === 0 ? sgn++ : sgn;
    return sign(sgn);
}
