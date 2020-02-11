
vec4 quaternionFromAxisAngle(float angle, vec3 axis){
    angle /= 2.;
    float s = sin(angle);
    vec4 res;
    res.xyz = s * axis;
    res.w = cos(angle);
    return res;
}

vec4 quaternionFromAxis(vec3 xAxis,vec3 yAxis,vec3 zAxis){
    mat3 m = mat3(xAxis,yAxis,zAxis);
    float trace = m[0][0] + m[1][1] + m[2][2];
    vec4 quat;

    if (trace > 0.) {
        float s = 0.5 / sqrt(trace + 1.0);
        quat.w = 0.25 / s;
        quat.x = (m[2][1] - m[1][2]) * s;
        quat.y = (m[0][2] - m[2][0]) * s;
        quat.z = (m[1][0] - m[0][1]) * s;
    } else if ((m[0][0] > m[1][1]) && (m[0][0] > m[2][2])) {
        float s = 2.0 * sqrt(1.0 + m[0][0] - m[1][1] - m[2][2]);
        quat.w = (m[2][1] - m[1][2]) / s;
        quat.x = 0.25 * s;
        quat.y = (m[0][1] + m[1][0]) / s;
        quat.z = (m[0][2] + m[2][0]) / s;
    } else if (m[1][1] > m[2][2]) {
        float s = 2.0 * sqrt(1.0 + m[1][1] - m[0][0] - m[2][2]);
        quat.w = (m[0][2] - m[2][0]) / s;
        quat.x = (m[0][1] + m[1][0]) / s;
        quat.y = 0.25 * s;
        quat.z = (m[1][2] + m[2][1]) / s;
    } else {
        float s = 2.0 * sqrt(1.0 + m[2][2] - m[0][0] - m[1][1]);
        quat.w = (m[1][0] - m[0][1]) / s;
        quat.x = (m[0][2] + m[2][0]) / s;
        quat.y = (m[1][2] + m[2][1]) / s;
        quat.z = 0.25 * s;
    }

    float len = quat.x * quat.x + quat.y * quat.y + quat.z * quat.z + quat.w * quat.w;
    if (len > 0.) {
        len = 1. / sqrt(len);
        quat.x = quat.x * len;
        quat.y = quat.y * len;
        quat.z = quat.z * len;
        quat.w = quat.w * len;
    }

    return quat;
}

vec4 quaternionFromEuler(vec3 angle){
    float x = angle.x / 2.;
    float y = angle.y / 2.;
    float z = angle.z / 2.;

    float sx = sin(x);
    float cx = cos(x);
    float sy = sin(y);
    float cy = cos(y);
    float sz = sin(z);
    float cz = cos(z);

    vec4 quat = vec4(0);

    quat.x = sx * cy * cz + cx * sy * sz;
    quat.y = cx * sy * cz + sx * cy * sz;
    quat.z = cx * cy * sz - sx * sy * cz;
    quat.w = cx * cy * cz - sx * sy * sz;

    return quat;
}

mat4 matrixFromRT(vec4 q, vec3 p){
    float x2 = q.x + q.x;
    float y2 = q.y + q.y;
    float z2 = q.z + q.z;
    float xx = q.x * x2;
    float xy = q.x * y2;
    float xz = q.x * z2;
    float yy = q.y * y2;
    float yz = q.y * z2;
    float zz = q.z * z2;
    float wx = q.w * x2;
    float wy = q.w * y2;
    float wz = q.w * z2;

    return mat4(
        1. - (yy + zz), xy + wz, xz - wy, 0,
        xy - wz, 1. - (xx + zz), yz + wx, 0,
        xz + wy, yz - wx, 1. - (xx + yy), 0,
        p.x, p.y, p.z, 1
    );
}

mat4 matFromRTS(vec4 q, vec3 t, vec3 s){
    float x = q.x, y = q.y, z = q.z, w = q.w;
    float x2 = x + x;
    float y2 = y + y;
    float z2 = z + z;

    float xx = x * x2;
    float xy = x * y2;
    float xz = x * z2;
    float yy = y * y2;
    float yz = y * z2;
    float zz = z * z2;
    float wx = w * x2;
    float wy = w * y2;
    float wz = w * z2;
    float sx = s.x;
    float sy = s.y;
    float sz = s.z;

    return mat4((1. - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
        (xy - wz) * sy, (1. - (xx + zz)) * sy, (yz + wx) * sy, 0,
        (xz + wy) * sz, (yz - wx) * sz, (1. - (xx + yy)) * sz, 0,
        t.x, t.y, t.z, 1);
}

void scaleMatrix(inout mat4 m, float s){
    m[0].xyz *= s;
    m[1].xyz *= s;
    m[2].xyz *= s;
}

vec4 quatMultiply(vec4 a, vec4 b){
    vec4 quat;
    quat.x = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y;
    quat.y = a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z;
    quat.z = a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x;
    quat.w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
    return quat;
}

void rotateVecFromQuat(inout vec3 v, vec4 q){
    float ix = q.w * v.x + q.y * v.z - q.z * v.y;
    float iy = q.w * v.y + q.z * v.x - q.x * v.z;
    float iz = q.w * v.z + q.x * v.y - q.y * v.x;
    float iw = -q.x * v.x - q.y * v.y - q.z * v.z;

    // calculate result * inverse quat
    v.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
    v.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
    v.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
}

vec3 rotateVecFromAxis(vec3 v, vec3 axis, float theta){
    return cos(theta) * v + sin(theta) * cross(v, axis) + (1. - cos(theta)) * dot(v, axis) * axis;
}

vec3 rotateInLocalSpace(vec3 pos, vec3 xAxis, vec3 yAxis, vec3 zAxis, vec4 q){
    float z = pos.z;
    float x = pos.x;
    float y = pos.y;
    vec4 viewQuat = quaternionFromAxis(xAxis, yAxis, zAxis);
    vec4 rotQuat = quatMultiply(viewQuat, q);
    rotateVecFromQuat(pos, rotQuat);

    return pos;
}

void rotateCorner(inout vec2 corner, float angle){
    float xOS = cos(angle) * corner.x - sin(angle) * corner.y;
    float yOS = sin(angle) * corner.x + cos(angle) * corner.y;
    corner.x = xOS;
    corner.y = yOS;
}