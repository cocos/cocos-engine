const vec3 = cc.vmath.vec3;

/**
 * @class geomUtils.Ray
 * @param {Number} ox 
 * @param {Number} oy 
 * @param {Number} oz 
 * @param {Number} dx 
 * @param {Number} dy 
 * @param {Number} dz 
 */
function ray(ox, oy, oz, dx, dy, dz) {
    this.o = vec3.create(ox, oy, oz);
    this.d = vec3.create(dx, dy, dz);
}

/**
 * create a new ray
 * @method create
 * @param {Number} ox origin X component
 * @param {Number} oy origin Y component
 * @param {Number} oz origin Z component
 * @param {Number} dx dir X component
 * @param {Number} dy dir Y component
 * @param {Number} dz dir Z component
 * @return {geomUtils.Ray}
 */
ray.create = function (ox, oy, oz, dx, dy, dz) {
    return new ray(ox, oy, oz, dx, dy, dz);
}

/**
 * Creates a new ray initialized with values from an existing ray
 * @method clone
 * @param {geomUtils.Ray} a ray to clone
 * @returns {geomUtils.Ray} a new ray
 */
ray.clone = function (a) {
    return new ray(
        a.o.x, a.o.y, a.o.z,
        a.d.x, a.d.y, a.d.z
    );
}

/**
 * Copy the values from one ray to another
 * @method copy
 * @param {geomUtils.Ray} out the receiving ray
 * @param {geomUtils.Ray} a the source ray
 * @returns {geomUtils.Ray} out
 */
ray.copy = function (out, a) {
    out.o.x = a.o.x;
    out.o.y = a.o.y;
    out.o.z = a.o.z;
    out.d.x = a.d.x;
    out.d.y = a.d.y;
    out.d.z = a.d.z;

    return out;
}

/**
 * Set the components of a vec3 to the given values
 * @method set
 * @param {Vec3} out the receiving vector
 * @param {Number} ox origin X component
 * @param {Number} oy origin Y component
 * @param {Number} oz origin Z component
 * @param {Number} dx dir X component
 * @param {Number} dy dir Y component
 * @param {Number} dz dir Z component
 * @returns {Vec3} out
 */
ray.set = function (out, ox, oy, oz, dx, dy, dz) {
    out.o.x = ox;
    out.o.y = oy;
    out.o.z = oz;
    out.d.x = dx;
    out.d.y = dy;
    out.d.z = dz;

    return out;
}

/**
 * create ray from 2 points
 * @method fromPoints
 * @param {geomUtils.Ray} out the receiving plane
 * @param {Vec3} origin
 * @param {Vec3} lookAt
 * @returns {geomUtils.Ray} out
 */
ray.fromPoints = function (out, origin, lookAt) {
    vec3.copy(out.o, origin);
    vec3.normalize(out.d, vec3.sub(out.d, lookAt, origin));

    return out;
}

module.exports = ray;
