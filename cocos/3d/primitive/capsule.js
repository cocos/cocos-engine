'use strict';

import { vec3 } from '../vmath';

let temp1 = vec3.create(0, 0, 0);
let temp2 = vec3.create(0, 0, 0);

/**
 * @param {Number} radiusTop
 * @param {Number} radiusBottom
 * @param {Number} height
 * @param {Object} opts
 * @param {Number} opts.sides
 * @param {Number} opts.heightSegments
 * @param {Boolean} opts.capped
 * @param {Number} opts.arc
 */
export default function (radiusTop = 0.5, radiusBottom = 0.5, height = 2, opts = {}) {
  let torsoHeight = height - radiusTop - radiusBottom;
  let sides = opts.sides || 16;
  let heightSegments = opts.heightSegments || 10;
  let bottomProp = radiusBottom / height;
  let torProp = torsoHeight / height;
  let topProp = radiusTop / height;
  let bottomSegments = Math.floor(heightSegments * bottomProp);
  let topSegments = Math.floor(heightSegments * topProp);
  let torSegments = Math.floor(heightSegments * torProp);
  let topOffset = torsoHeight + radiusBottom - height / 2;
  let torOffset = radiusBottom - height / 2;
  let bottomOffset = radiusBottom - height / 2;

  let arc = opts.arc || 2.0 * Math.PI;

  // calculate vertex count
  let positions = [];
  let normals = [];
  let uvs = [];
  let indices = [];
  let maxRadius = Math.max(radiusTop, radiusBottom);
  let minPos = vec3.create(-maxRadius, -height / 2, -maxRadius);
  let maxPos = vec3.create(maxRadius, height / 2, maxRadius);

  let index = 0;
  let indexArray = [];

  generateBottom();

  generateTorso();

  generateTop();

  return {
    positions,
    normals,
    uvs,
    indices,
    minPos,
    maxPos
  };

  // =======================
  // internal fucntions
  // =======================

  function generateTorso() {
    // this will be used to calculate the normal
    let slope = (radiusTop - radiusBottom) / torsoHeight;

    // generate positions, normals and uvs
    for (let y = 0; y <= torSegments; y++) {

      let indexRow = [];
      let lat = y / torSegments;
      let radius = lat * (radiusTop - radiusBottom) + radiusBottom;

      for (let x = 0; x <= sides; ++x) {
        let u = x / sides;
        let v = lat * torProp + bottomProp;
        let theta = u * arc - (arc / 4);

        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);

        // vertex
        positions.push(radius * sinTheta);
        positions.push(lat * torsoHeight + torOffset);
        positions.push(radius * cosTheta);

        // normal
        vec3.normalize(temp1, vec3.set(temp2, sinTheta, -slope, cosTheta));
        normals.push(temp1.x);
        normals.push(temp1.y);
        normals.push(temp1.z);

        // uv
        uvs.push(-u,v);
        // save index of vertex in respective row
        indexRow.push(index);

        // increase index
        ++index;
      }

      // now save positions of the row in our index array
      indexArray.push(indexRow);
    }

    // generate indices
    for (let y = 0; y < torSegments; ++y) {
      for (let x = 0; x < sides; ++x) {
        // we use the index array to access the correct indices
        let i1 = indexArray[y][x];
        let i2 = indexArray[y + 1][x];
        let i3 = indexArray[y + 1][x + 1];
        let i4 = indexArray[y][x + 1];

        // face one
        indices.push(i1);
        indices.push(i4);
        indices.push(i2);

        // face two
        indices.push(i4);
        indices.push(i3);
        indices.push(i2);
      }
    }
  }

  function generateBottom() {
    for (let lat = 0; lat <= bottomSegments; ++lat) {
      let theta = lat * Math.PI / bottomSegments / 2;
      let sinTheta = Math.sin(theta);
      let cosTheta = -Math.cos(theta);

      for (let lon = 0; lon <= sides; ++lon) {
        let phi = lon * 2 * Math.PI / sides - Math.PI / 2.0;
        let sinPhi = Math.sin(phi);
        let cosPhi = Math.cos(phi);

        let x = sinPhi * sinTheta;
        let y = cosTheta;
        let z = cosPhi * sinTheta;
        let u = lon / sides;
        let v = lat / heightSegments;

        positions.push(x * radiusBottom, y * radiusBottom + bottomOffset, z * radiusBottom);
        normals.push(x, y, z);
        uvs.push(-u, v);

        if ((lat < bottomSegments) && (lon < sides)) {
          let seg1 = sides + 1;
          let a = seg1 * lat + lon;
          let b = seg1 * (lat + 1) + lon;
          let c = seg1 * (lat + 1) + lon + 1;
          let d = seg1 * lat + lon + 1;

          indices.push(a, d, b);
          indices.push(d, c, b);
        }

        ++index;
      }
    }
  }

  function generateTop() {
    for (let lat = 0; lat <= topSegments; ++lat) {
      let theta = lat * Math.PI / topSegments / 2 + Math.PI / 2;
      let sinTheta = Math.sin(theta);
      let cosTheta = -Math.cos(theta);

      for (let lon = 0; lon <= sides; ++lon) {
        let phi = lon * 2 * Math.PI / sides - Math.PI / 2.0;
        let sinPhi = Math.sin(phi);
        let cosPhi = Math.cos(phi);

        let x = sinPhi * sinTheta;
        let y = cosTheta;
        let z = cosPhi * sinTheta;
        let u = lon / sides;
        let v = lat / heightSegments + (1-topProp);

        positions.push(x * radiusTop, y * radiusTop + topOffset, z * radiusTop);
        normals.push(x, y, z);
        uvs.push(-u, v);

        if ((lat < topSegments) && (lon < sides)) {
          let seg1 = sides + 1;
          let a = seg1 * lat + lon + indexArray[torSegments][sides] + 1;
          let b = seg1 * (lat + 1) + lon + indexArray[torSegments][sides] + 1;
          let c = seg1 * (lat + 1) + lon + 1 + indexArray[torSegments][sides] + 1;
          let d = seg1 * lat + lon + 1 + indexArray[torSegments][sides] + 1;

          indices.push(a, d, b);
          indices.push(d, c, b);
        }
      }
    }
  }
}
