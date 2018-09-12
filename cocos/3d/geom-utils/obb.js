import enums from './enums';
import { vec3, mat3 } from '../vmath';

let _v3_tmp = vec3.create();
let _v3_tmp2 = vec3.create();
let _m3_tmp = mat3.create();

// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
let transform_extent_m3 = function(out, extent, m3) {
  _m3_tmp.m00 = Math.abs(m3.m00); _m3_tmp.m01 = Math.abs(m3.m01); _m3_tmp.m02 = Math.abs(m3.m02);
  _m3_tmp.m03 = Math.abs(m3.m03); _m3_tmp.m04 = Math.abs(m3.m04); _m3_tmp.m05 = Math.abs(m3.m05);
  _m3_tmp.m06 = Math.abs(m3.m06); _m3_tmp.m07 = Math.abs(m3.m07); _m3_tmp.m08 = Math.abs(m3.m08);
  vec3.transformMat3(out, extent, _m3_tmp);
};

export default class obb {
  constructor(px = 0, py = 0, pz = 0,
    hw = 1, hh = 1, hl = 1,
    ox_1 = 1, ox_2 = 0, ox_3 = 0,
    oy_1 = 0, oy_2 = 1, oy_3 = 0,
    oz_1 = 0, oz_2 = 0, oz_3 = 1) {
    this._type = enums.SHAPE_OBB;
    this.center = vec3.create(px, py, pz);
    this.halfExtents = vec3.create(hw, hh, hl);
    this.orientation = mat3.create(ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  }

  /**
   * create a new obb
   *
   * @param {number} px X coordinates for obb's original point
   * @param {number} py Y coordinates for obb's original point
   * @param {number} pz Z coordinates for obb's original point
   * @param {number} hw the half of obb width
   * @param {number} hh the half of obb height
   * @param {number} hl the half of obb length
   * @param {number} ox_1 orientation matrix coefficient
   * @param {number} ox_2 orientation matrix coefficient
   * @param {number} ox_3 orientation matrix coefficient
   * @param {number} oy_1 orientation matrix coefficient
   * @param {number} oy_2 orientation matrix coefficient
   * @param {number} oy_3 orientation matrix coefficient
   * @param {number} oz_1 orientation matrix coefficient
   * @param {number} oz_2 orientation matrix coefficient
   * @param {number} oz_3 orientation matrix coefficient
   * @return {obb}
   */
  static create(px, py, pz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    return new obb(px, py, pz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  }

  /**
   * clone a new obb
   *
   * @param {obb} a the source obb
   * @return {obb}
   */
  static clone(a) {
    return new obb(a.center.x, a.center.y, a.center.z,
      a.halfExtents.x, a.halfExtents.y, a.halfExtents.z,
      a.orientation.m00, a.orientation.m01, a.orientation.m02,
      a.orientation.m03, a.orientation.m04, a.orientation.m05,
      a.orientation.m06, a.orientation.m07, a.orientation.m08);
  }

  /**
   * copy the values from one obb to another
   *
   * @param {obb} out the receiving obb
   * @param {obb} a the source obb
   * @return {obb}
   */
  static copy(out, a) {
    vec3.copy(out.center, a.center);
    vec3.copy(out.halfExtents, a.halfExtents);
    mat3.copy(out.orientation, a.orientation);

    return out;
  }

  /**
   * create a new obb from two corner points
   *
   * @param {obb} out the receiving obb
   * @param {vec3} minPos lower corner position of the obb
   * @param {vec3} maxPos upper corner position of the obb
   * @return {obb}
   */
  static fromPoints(out, minPos, maxPos) {
    vec3.scale(out.center, vec3.add(_v3_tmp, minPos, maxPos), 0.5);
    vec3.scale(out.halfExtents, vec3.sub(_v3_tmp2, maxPos, minPos), 0.5);
    mat3.identity(out.orientation);
    return out;
  }
  
  /**
   * Set the components of a obb to the given values
   *
   * @param {obb} out the receiving obb
   * @param {number} px X coordinates for obb's original point
   * @param {number} py Y coordinates for obb's original point
   * @param {number} pz Z coordinates for obb's original point
   * @param {number} hw the half of obb width
   * @param {number} hh the half of obb height
   * @param {number} hl the half of obb length
   * @param {number} ox_1 orientation matrix coefficient
   * @param {number} ox_2 orientation matrix coefficient
   * @param {number} ox_3 orientation matrix coefficient
   * @param {number} oy_1 orientation matrix coefficient
   * @param {number} oy_2 orientation matrix coefficient
   * @param {number} oy_3 orientation matrix coefficient
   * @param {number} oz_1 orientation matrix coefficient
   * @param {number} oz_2 orientation matrix coefficient
   * @param {number} oz_3 orientation matrix coefficient
   * @return {obb} out
   */
  static set(out, px, py, pz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    vec3.set(out.center, px, py, pz);
    vec3.set(out.halfExtents, hw, hh, hl);
    mat3.set(out.orientation, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
    return out;
  }

  /**
   * Get the bounding points of this shape
   * @param {vec3} minPos
   * @param {vec3} maxPos
   */
  getBoundary(minPos, maxPos) {
    transform_extent_m3(_v3_tmp, this.halfExtents, this.orientation);
    vec3.sub(minPos, this.center, _v3_tmp);
    vec3.add(maxPos, this.center, _v3_tmp);
  }

  /**
   * Transform this shape
   * @param {mat4} m the transform matrix
   * @param {vec3} pos the position part of the transform
   * @param {quat} rot the rotation part of the transform
   * @param {vec3} scale the scale part of the transform
   * @param {obb} [out] the target shape
   */
  transform(m, pos, rot, scale, out) {
    if (!out) out = this;
    vec3.transformMat4(out.center, this.center, m);
    // parent shape doesn't contain rotations for now
    mat3.fromQuat(out.orientation, rot);
    vec3.mul(out.halfExtents, this.halfExtents, scale);
  }
}
