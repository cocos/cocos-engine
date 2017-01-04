/**
 * @name cc3d.math
 * @namespace
 * @description Math API
 */
cc3d.math = cc.MathUtils;

// IE doesn't have native log2
if (!Math.log2) {
    Math.log2 = function (x) {
        return Math.log(x) * cc3d.math.INV_LOG2;
    };
}

cc3d.extend(cc3d, (function () {
    return {
        Vec2: cc.Vec2v2
    };
}()));

cc3d.extend(cc3d, (function () {
    return {
        Vec3: cc.Vec3
    };
}()));

cc3d.extend(cc3d, (function () {
    return {
        Vec4: cc.Vec4
    };
}()));

cc3d.extend(cc3d, (function () {
    return {
        Quat: cc.Quat
    };
}()));

cc3d.extend(cc3d, (function () {
    return {
        Mat3: cc.Mat3
    };
}()));

cc3d.extend(cc3d, (function () {
    return {
        Mat4: cc.Mat4
    };
}()));
