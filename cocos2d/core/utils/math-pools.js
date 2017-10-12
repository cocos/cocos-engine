
const JS = require('../platform/js');
const renderEngine = require('../renderer/render-engine');
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
        vec2 = math.vec2.create();
    }
    return vec2;
};

module.exports = {
    mat4: mat4Pool,
    vec2: vec2Pool
};