'use strict';

import VertexData from './vertex-data';
import { Vec3 } from '../../value-types';

let positions = [
  -0.5, -0.5, 0, // bottom-left
  -0.5,  0.5, 0, // top-left
   0.5,  0.5, 0, // top-right
   0.5, -0.5, 0, // bottom-right
];

let normals = [
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
];

let uvs = [
  0, 0,
  0, 1,
  1, 1,
  1, 0,
];

let indices = [
  0, 3, 1,
  3, 2, 1
];

// TODO: ?
let minPos = new Vec3(-0.5, -0.5, 0);
let maxPos = new Vec3(0.5, 0.5, 0);
let boundingRadius = Math.sqrt(0.5 * 0.5 + 0.5 * 0.5);

export default function () {
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
