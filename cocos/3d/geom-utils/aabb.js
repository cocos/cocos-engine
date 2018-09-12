import enums from './enums';
import { vec3, mat3 } from '../vmath';

let _v3_tmp = vec3.create();
let _v3_tmp2 = vec3.create();
let _m3_tmp = mat3.create();

// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
let transform_extent_m4 = function(out, extent, m4) {
  _m3_tmp.m00 = Math.abs(m4.m00); _m3_tmp.m01 = Math.abs(m4.m01); _m3_tmp.m02 = Math.abs(m4.m02);
  _m3_tmp.m03 = Math.abs(m4.m04); _m3_tmp.m04 = Math.abs(m4.m05); _m3_tmp.m05 = Math.abs(m4.m06);
  _m3_tmp.m06 = Math.abs(m4.m08); _m3_tmp.m07 = Math.abs(m4.m09); _m3_tmp.m08 = Math.abs(m4.m10);
  vec3.transformMat3(out, extent, _m3_tmp);
};

export default class aabb {
  constructor(px = 0, py = 0, pz = 0, w = 1, h = 1, l = 1) {
    this._type = enums.SHAPE_AABB;
    this.center = vec3.create(px, py, pz);
    this.halfExtents = vec3.create(w, h, l);
  }

  /**
   * create a new aabb
   *
   * @param {number} px X coordinates for aabb's original point
   * @param {number} py Y coordinates for aabb's original point
   * @param {number} pz Z coordinates for aabb's original point
   * @param {number} w the half of aabb width
   * @param {number} h the half of aabb height
   * @param {number} l the half of aabb length
   * @return {aabb}
   */
  static create(px, py, pz, w, h, l) {
    return new aabb(px, py, pz, w, h, l);
  }

  /**
   * clone a new aabb
   *
   * @param {aabb} a the source aabb
   * @return {aabb}
   */
  static clone(a) {
    return new aabb(a.center.x, a.center.y, a.center.z,
      a.halfExtents.x, a.halfExtents.y, a.halfExtents.z);
  }

  /**
   * copy the values from one aabb to another
   *
   * @param {aabb} out the receiving aabb
   * @param {aabb} a the source aabb
   * @return {aabb}
   */
  static copy(out, a) {
    vec3.copy(out.center, a.center);
    vec3.copy(out.halfExtents, a.halfExtents);

    return out;
  }

  /**
   * create a new aabb from two corner points
   *
   * @param {aabb} out the receiving aabb
   * @param {vec3} minPos lower corner position of the aabb
   * @param {vec3} maxPos upper corner position of the aabb
   * @return {aabb}
   */
  static fromPoints(out, minPos, maxPos) {
    vec3.scale(out.center, vec3.add(_v3_tmp, minPos, maxPos), 0.5);
    vec3.scale(out.halfExtents, vec3.sub(_v3_tmp2, maxPos, minPos), 0.5);
    return out;
  }
  
  /**
   * Set the components of a aabb to the given values
   *
   * @param {aabb} out the receiving aabb
   * @param {number} px X coordinates for aabb's original point
   * @param {number} py Y coordinates for aabb's original point
   * @param {number} pz Z coordinates for aabb's original point
   * @param {number} w the half of aabb width
   * @param {number} h the half of aabb height
   * @param {number} l the half of aabb length
   * @return {aabb} out
   * @function
   */
  static set(out, px, py, pz, w, h, l) {
    vec3.set(out.center, px, py, pz);
    vec3.set(out.halfExtents, w, h, l);
    return out;
  }

  /**
   * Get the bounding points of this shape
   * @param {vec3} minPos
   * @param {vec3} maxPos
   */
  getBoundary(minPos, maxPos) {
    vec3.sub(minPos, this.center, this.halfExtents);
    vec3.add(maxPos, this.center, this.halfExtents);
  }

  /**
   * Transform this shape
   * @param {mat4} m the transform matrix
   * @param {vec3} pos the position part of the transform
   * @param {quat} rot the rotation part of the transform
   * @param {vec3} scale the scale part of the transform
   * @param {aabb} [out] the target shape
   */
  transform(m, pos, rot, scale, out) {
    if (!out) out = this;
    vec3.transformMat4(out.center, this.center, m);
    transform_extent_m4(out.halfExtents, this.halfExtents, m);
  }
}
