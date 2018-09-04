import { vec3, mat3 } from '../vmath';

let _v3_tmp = vec3.create();
let _v3_tmp2 = vec3.create();

/**
 * @access public
 */
class box {
  constructor(px, py, pz, w, h, l, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    this.center = vec3.create(px, py, pz);
    this.halfExtents = vec3.create(w, h, l);
    this.orientation = mat3.create(ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  }

  /**
   * create a new box
   *
   * @return {plane}
   */
  static create() {
    return new box(0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  /**
   * create a new box
   *
   * @param {Number} px X coordinates for box's original point
   * @param {Number} py Y coordinates for box's original point
   * @param {Number} pz Z coordinates for box's original point
   * @param {Number} w the half of box width
   * @param {Number} h the half of box height
   * @param {Number} l the half of box length
   * @param {Number} ox_1 the orientation vector coordinates
   * @param {Number} ox_2 the orientation vector coordinates
   * @param {Number} ox_3 the orientation vector coordinates
   * @param {Number} oy_1 the orientation vector coordinates
   * @param {Number} oy_2 the orientation vector coordinates
   * @param {Number} oy_3 the orientation vector coordinates
   * @param {Number} oz_1 the orientation vector coordinates
   * @param {Number} oz_2 the orientation vector coordinates
   * @param {Number} oz_3 the orientation vector coordinates
   * @return {box}
   */
  static new(px, py, pz, w, h, l, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    return new box(px, py, pz, w, h, l, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  }

  /**
   * create a new axis-aligned box from two corner points
   *
   * @param {vec3} minPos lower corner position of the box
   * @param {vec3} maxPos upper corner position of the box
   * @return {box}
   */
  static fromPoints(minPos, maxPos) {
    vec3.scale(_v3_tmp, vec3.add(_v3_tmp, minPos, maxPos), 0.5);
    vec3.scale(_v3_tmp2, vec3.sub(_v3_tmp2, maxPos, minPos), 0.5);
    return new box(_v3_tmp.x, _v3_tmp.y, _v3_tmp.z,
      _v3_tmp2.x, _v3_tmp2.y, _v3_tmp2.z,
      1, 0, 0, 0, 1, 0, 0, 0, 1);
  }
  
  /**
   * clone a new box
   *
   * @param {box} a the source box
   * @return {box}
   */
  static clone(a) {
    return new box(a.center.x, a.center.y, a.center.z,
      a.halfExtents.x, a.halfExtents.y, a.halfExtents.z,
      a.orientation.m00, a.orientation.m01, a.orientation.m02,
      a.orientation.m03, a.orientation.m04, a.orientation.m05,
      a.orientation.m06, a.orientation.m07, a.orientation.m08);
  }

  /**
   * copy the values from one box to another
   *
   * @param {box} out the receiving box
   * @param {box} a the source box
   * @return {box}
   */
  static copy(out, a) {
    out.center = a.center;
    out.halfExtents = a.halfExtents;
    out.orientation = a.orientation;

    return out;
  }

  /**
   * Set the components of a box to the given values
   *
   * @param {box} out the receiving box
   * @param {Number} px X coordinates for box's original point
   * @param {Number} py Y coordinates for box's original point
   * @param {Number} pz Z coordinates for box's original point
   * @param {Number} w the half of box width
   * @param {Number} h the half of box height
   * @param {Number} l the half of box length
   * @param {Number} ox_1 the orientation vector coordinates
   * @param {Number} ox_2 the orientation vector coordinates
   * @param {Number} ox_3 the orientation vector coordinates
   * @param {Number} oy_1 the orientation vector coordinates
   * @param {Number} oy_2 the orientation vector coordinates
   * @param {Number} oy_3 the orientation vector coordinates
   * @param {Number} oz_1 the orientation vector coordinates
   * @param {Number} oz_2 the orientation vector coordinates
   * @param {Number} oz_3 the orientation vector coordinates
   * @returns {box} out
   * @function
   */
  static set(out, px, py, pz, w, h, l, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    vec3.set(out.center, px, py, pz);
    vec3.set(out.halfExtents, w, h, l);
    mat3.set(out.orientation, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
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
   * Translate this shape and apply the effect to a target shape
   * @param {vec3} pos the translation factor
   * @param {box?} out the target shape
   */
  translate(pos, out) {
    if (!out) out = this;
    vec3.add(out.center, this.center, pos);
  }

  /**
   * Rotate this shape and apply the effect to a target shape
   * @param {quat} rot the rotation factor
   * @param {box?} out the target shape
   */
  rotate(rot, out) {
    if (!out) out = this;
    // parent box doesn't contain rotations for now
    mat3.fromQuat(out.orientation, rot);
  }

  /**
   * Scale this shape and apply the effect to a target shape
   * @param {vec3} scale the scaling factor
   * @param {box?} out the target shape
   */
  scale(scale, out) {
    if (!out) out = this;
    vec3.mul(out.halfExtents, this.halfExtents, scale);
  }
}


export default box;
