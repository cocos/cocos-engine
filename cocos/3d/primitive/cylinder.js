'use strict';

import { vec3 } from '../vmath';

let temp1 = vec3.create(0, 0, 0);
let temp2 = vec3.create(0, 0, 0);

/**
 * @param {Number} radiusTop
 * @param {Number} radiusBottom
 * @param {Number} height
 * @param {Object} opts
 * @param {Number} opts.radialSegments
 * @param {Number} opts.heightSegments
 * @param {Boolean} opts.capped
 * @param {Number} opts.arc
 */
export default function (radiusTop = 0.5, radiusBottom = 0.5, height = 2, opts = {}) {
  let halfHeight = height * 0.5;
  let radialSegments = opts.radialSegments || 8;
  let heightSegments = opts.heightSegments || 1;
  let capped = opts.capped !== undefined ? opts.capped : true;
  let arc = opts.arc || 2.0 * Math.PI;

  let cntCap = 0;
  if (!capped) {
    if (radiusTop > 0) {
      cntCap++;
    }

    if (radiusBottom > 0) {
      cntCap++;
    }
  }

  // calculate vertex count
  let vertCount = (radialSegments + 1) * (heightSegments + 1);
  if (capped) {
    vertCount += ((radialSegments + 1) * cntCap) + (radialSegments * cntCap);
  }

  // calculate index count
  let indexCount = radialSegments * heightSegments * 2 * 3;
  if (capped) {
    indexCount += radialSegments * cntCap * 3;
  }

  let indices = new Array(indexCount);
  let positions = new Array(vertCount * 3);
  let normals = new Array(vertCount * 3);
  let uvs = new Array(vertCount * 2);
  let maxRadius = Math.max(radiusTop, radiusBottom);
  let minPos = vec3.create(-maxRadius, -halfHeight, -maxRadius);
  let maxPos = vec3.create(maxRadius, halfHeight, maxRadius);
  let boundingRadius = Math.sqrt(maxRadius * maxRadius + halfHeight * halfHeight);

  let index = 0;
  let indexOffset = 0;

  generateTorso();

  if (capped) {
    if (radiusBottom > 0) {
      generateCap(false);
    }

    if (radiusTop > 0) {
      generateCap(true);
    }
  }

  return {
    positions,
    normals,
    uvs,
    indices,
    minPos,
    maxPos,
    boundingRadius
  };

  // =======================
  // internal fucntions
  // =======================

  function generateTorso() {
    let indexArray = [];

    // this will be used to calculate the normal
    let slope = (radiusTop - radiusBottom) / height;

    // generate positions, normals and uvs
    for (let y = 0; y <= heightSegments; y++) {
      let indexRow = [];
      let v = y / heightSegments;

      // calculate the radius of the current row
      let radius = v * (radiusTop - radiusBottom) + radiusBottom;

      for (let x = 0; x <= radialSegments; ++x) {
        let u = x / radialSegments;
        let theta = u * arc;

        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);

        // vertex
        positions[3 * index] = radius * sinTheta;
        positions[3 * index + 1] = v * height - halfHeight;
        positions[3 * index + 2] = radius * cosTheta;

        // normal
        vec3.normalize(temp1, vec3.set(temp2, sinTheta, -slope, cosTheta));
        normals[3 * index] = temp1.x;
        normals[3 * index + 1] = temp1.y;
        normals[3 * index + 2] = temp1.z;

        // uv
        uvs[2 * index] = (1 - u) * 2 % 1;
        uvs[2 * index + 1] = v;

        // save index of vertex in respective row
        indexRow.push(index);

        // increase index
        ++index;
      }

      // now save positions of the row in our index array
      indexArray.push(indexRow);
    }

    // generate indices
    for (let y = 0; y < heightSegments; ++y) {
      for (let x = 0; x < radialSegments; ++x) {
        // we use the index array to access the correct indices
        let i1 = indexArray[y][x];
        let i2 = indexArray[y + 1][x];
        let i3 = indexArray[y + 1][x + 1];
        let i4 = indexArray[y][x + 1];

        // face one
        indices[indexOffset] = i1; ++indexOffset;
        indices[indexOffset] = i4; ++indexOffset;
        indices[indexOffset] = i2; ++indexOffset;

        // face two
        indices[indexOffset] = i4; ++indexOffset;
        indices[indexOffset] = i3; ++indexOffset;
        indices[indexOffset] = i2; ++indexOffset;
      }
    }
  }

  function generateCap(top) {
    let centerIndexStart, centerIndexEnd;

    let radius = top ? radiusTop : radiusBottom;
    let sign = top ? 1 : - 1;

    // save the index of the first center vertex
    centerIndexStart = index;

    // first we generate the center vertex data of the cap.
    // because the geometry needs one set of uvs per face,
    // we must generate a center vertex per face/segment

    for (let x = 1; x <= radialSegments; ++x) {
      // vertex
      positions[3 * index] = 0;
      positions[3 * index + 1] = halfHeight * sign;
      positions[3 * index + 2] = 0;

      // normal
      normals[3 * index] = 0;
      normals[3 * index + 1] = sign;
      normals[3 * index + 2] = 0;

      // uv
      uvs[2 * index] = 0.5;
      uvs[2 * index + 1] = 0.5;

      // increase index
      ++index;
    }

    // save the index of the last center vertex
    centerIndexEnd = index;

    // now we generate the surrounding positions, normals and uvs

    for (let x = 0; x <= radialSegments; ++x) {
      let u = x / radialSegments;
      let theta = u * arc;

      let cosTheta = Math.cos(theta);
      let sinTheta = Math.sin(theta);

      // vertex
      positions[3 * index] = radius * sinTheta;
      positions[3 * index + 1] = halfHeight * sign;
      positions[3 * index + 2] = radius * cosTheta;

      // normal
      normals[3 * index] = 0;
      normals[3 * index + 1] = sign;
      normals[3 * index + 2] = 0;

      // uv
      uvs[2 * index] = 0.5 - (sinTheta * 0.5 * sign);
      uvs[2 * index + 1] = 0.5 + (cosTheta * 0.5);

      // increase index
      ++index;
    }

    // generate indices

    for (let x = 0; x < radialSegments; ++x) {
      let c = centerIndexStart + x;
      let i = centerIndexEnd + x;

      if (top) {
        // face top
        indices[indexOffset] = i + 1; ++indexOffset;
        indices[indexOffset] = c; ++indexOffset;
        indices[indexOffset] = i; ++indexOffset;
      } else {
        // face bottom
        indices[indexOffset] = c; ++indexOffset;
        indices[indexOffset] = i + 1; ++indexOffset;
        indices[indexOffset] = i; ++indexOffset;
      }
    }
  }
}
