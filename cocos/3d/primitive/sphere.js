'use strict';

import { vec3 } from '../vmath';

/**
 * @param {Number} radius
 * @param {Object} opts
 * @param {Number} opts.segments
 */
export default function (radius = 0.5, opts = {}) {
  let segments = opts.segments !== undefined ? opts.segments : 16;

  // lat === latitude
  // lon === longitude

  let positions = [];
  let normals = [];
  let uvs = [];
  let indices = [];
  let minPos = vec3.create(-radius, -radius, -radius);
  let maxPos = vec3.create(radius, radius, radius);
  let boundingRadius = radius;

  for (let lat = 0; lat <= segments; ++lat) {
    let theta = lat * Math.PI / segments;
    let sinTheta = Math.sin(theta);
    let cosTheta = -Math.cos(theta);

    for (let lon = 0; lon <= segments; ++lon) {
      let phi = lon * 2 * Math.PI / segments - Math.PI / 2.0;
      let sinPhi = Math.sin(phi);
      let cosPhi = Math.cos(phi);

      let x = sinPhi * sinTheta;
      let y = cosTheta;
      let z = cosPhi * sinTheta;
      let u = lon / segments;
      let v = lat / segments;

      positions.push(x * radius, y * radius, z * radius);
      normals.push(x, y, z);
      uvs.push(u, v);


      if ((lat < segments) && (lon < segments)) {
        let seg1 = segments + 1;
        let a = seg1 * lat + lon;
        let b = seg1 * (lat + 1) + lon;
        let c = seg1 * (lat + 1) + lon + 1;
        let d = seg1 * lat + lon + 1;

        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
  }

  return {
    positions,
    indices,
    normals,
    uvs,
    minPos,
    maxPos,
    boundingRadius
  };
}