
const JS = require('../platform/js');
const renderEngine = require('../renderer/render-engine');
const Vec2 = require('../value-types/CCVec2');
const Vec3 = require('../value-types/CCVec3');
const math = renderEngine.math;

var mat4Pool = new JS.Pool(512);
mat4Pool.get = function () {
    var matrix = this._get();
    if (matrix) {
        math.mat4.identity(matrix);
    }
    else {
        matrix = math.mat4.create();
    }
    return matrix;
};

var vec2Pool = new JS.Pool(1024);
vec2Pool.get = function () {
    var vec2 = this._get();
    if (vec2) {
        vec2.x = vec2.y = 0;
    }
    else {
        vec2 = new Vec2();
    }
    return vec2;
};

var vec3Pool = new JS.Pool(512);
vec3Pool.get = function () {
    var vec3 = this._get();
    if (vec3) {
        vec3.x = vec3.y = vec3.z = 0;
    }
    else {
        vec3 = new Vec3();
    }
    return vec3;
};

module.exports = {
    mat4: mat4Pool,
    vec2: vec2Pool,
    vec3: vec3Pool
};