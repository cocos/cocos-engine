import { mat3, mat4, vec3 } from '../../core/vmath';
import enums from './enums';

const _v3_tmp = vec3.create();
const _v3_tmp2 = vec3.create();
const _m3_tmp = mat3.create();

// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
const transform_extent_m4 = (out: vec3, extent: vec3, m4: mat4) => {
  _m3_tmp.m00 = Math.abs(m4.m00); _m3_tmp.m01 = Math.abs(m4.m01); _m3_tmp.m02 = Math.abs(m4.m02);
  _m3_tmp.m03 = Math.abs(m4.m04); _m3_tmp.m04 = Math.abs(m4.m05); _m3_tmp.m05 = Math.abs(m4.m06);
  _m3_tmp.m06 = Math.abs(m4.m08); _m3_tmp.m07 = Math.abs(m4.m09); _m3_tmp.m08 = Math.abs(m4.m10);
  vec3.transformMat3(out, extent, _m3_tmp);
};

export default class aabb {

  /**
   * create a new aabb
   *
   * @param px - X coordinates for aabb's original point
   * @param py - Y coordinates for aabb's original point
   * @param pz - Z coordinates for aabb's original point
   * @param w - the half of aabb width
   * @param h - the half of aabb height
   * @param l - the half of aabb length
   * @returns the resulting aabb
   */
  public static create (px?: number, py?: number, pz?: number, w?: number, h?: number, l?: number) {
    return new aabb(px, py, pz, w, h, l);
  }

  /**
   * clone a new aabb
   *
   * @param a - the source aabb
   * @returns the cloned aabb
   */
  public static clone (a: aabb) {
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
  public static copy (out, a) {
    vec3.copy(out.center, a.center);
    vec3.copy(out.halfExtents, a.halfExtents);

    return out;
  }

  /**
   * create a new aabb from two corner points
   *
   * @param out - the receiving aabb
   * @param minPos - lower corner position of the aabb
   * @param maxPos - upper corner position of the aabb
   * @returns the resulting aabb
   */
  public static fromPoints (out: aabb, minPos: vec3, maxPos: vec3) {
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
  public static set (out, px, py, pz, w, h, l) {
    vec3.set(out.center, px, py, pz);
    vec3.set(out.halfExtents, w, h, l);
    return out;
  }

  public center: vec3;
  public halfExtents: vec3;
  protected _type: number = enums.SHAPE_AABB;

  constructor (px = 0, py = 0, pz = 0, w = 1, h = 1, l = 1) {
    this.center = vec3.create(px, py, pz);
    this.halfExtents = vec3.create(w, h, l);
  }

  /**
   * Get the bounding points of this shape
   * @param {vec3} minPos
   * @param {vec3} maxPos
   */
  public getBoundary (minPos, maxPos) {
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
  public transform (m, pos, rot, scale, out) {
    if (!out) { out = this; }
    vec3.transformMat4(out.center, this.center, m);
    transform_extent_m4(out.halfExtents, this.halfExtents, m);
  }

  get type (){
    return this._type;
  }
}
