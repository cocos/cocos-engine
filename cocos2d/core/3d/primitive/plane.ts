'use strict';

import Vec3 from '../../value-types/vec3';
import VertexData from './vertex-data';

let temp1 = new Vec3();
let temp2 = new Vec3();
let temp3 = new Vec3();
let r = new Vec3();
let c00 = new Vec3();
let c10 = new Vec3();
let c01 = new Vec3();

/**
 * @param {Number} width
 * @param {Number} length
 * @param {Object} opts
 * @param {Number} opts.widthSegments
 * @param {Number} opts.lengthSegments
 */
export default function (width = 10, length = 10, opts = {widthSegments: 10, lengthSegments: 10}) {
  let uSegments = opts.widthSegments;
  let vSegments = opts.lengthSegments;

  let hw = width * 0.5;
  let hl = length * 0.5;

  let positions: number[] = [];
  let normals: number[] = [];
  let uvs: number[] = [];
  let indices: number[] = [];
  let minPos = new Vec3(-hw, 0, -hl);
  let maxPos = new Vec3(hw, 0, hl);
  let boundingRadius = Math.sqrt(width * width + length * length);

  Vec3.set(c00, -hw, 0,  hl);
  Vec3.set(c10,  hw, 0,  hl);
  Vec3.set(c01, -hw, 0, -hl);

  for (let y = 0; y <= vSegments; y++) {
    for (let x = 0; x <= uSegments; x++) {
      let u = x / uSegments;
      let v = y / vSegments;

      Vec3.lerp(temp1, c00, c10, u);
      Vec3.lerp(temp2, c00, c01, v);
      Vec3.sub(temp3, temp2, c00);
      Vec3.add(r, temp1, temp3);

      positions.push(r.x, r.y, r.z);
      normals.push(0, 1, 0);
      uvs.push(u, v);

      if ((x < uSegments) && (y < vSegments)) {
        let useg1 = uSegments + 1;
        let a = x + y * useg1;
        let b = x + (y + 1) * useg1;
        let c = (x + 1) + (y + 1) * useg1;
        let d = (x + 1) + y * useg1;

        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
  }

  return new VertexData(
    positions,
    normals,
    uvs,
    indices,
    minPos,
    maxPos,
    boundingRadius
  );
}
