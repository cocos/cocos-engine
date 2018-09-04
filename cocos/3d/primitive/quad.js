'use strict';

import { vec3 } from '../vmath';

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
let minPos = vec3.create(-0.5, -0.5, 0);
let maxPos = vec3.create(0.5, 0.5, 0);

export default function () {
  return {
    positions: positions,
    indices: indices,
    normals: normals,
    uvs: uvs,
    minPos: minPos,
    maxPos: maxPos
  };
}
