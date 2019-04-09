import { vec3 } from '../../core/vmath';

export interface ICapsuteOptions {
    sides: number;
    heightSegments: number;
    capped: boolean;
    arc: number;
}

const temp1 = vec3.create(0, 0, 0);
const temp2 = vec3.create(0, 0, 0);

export default function (radiusTop = 0.5, radiusBottom = 0.5, height = 2, opts: RecursivePartial<ICapsuteOptions> = {}) {
  const torsoHeight = height - radiusTop - radiusBottom;
  const sides = opts.sides || 32;
  const heightSegments = opts.heightSegments || 32;
  const bottomProp = radiusBottom / height;
  const torProp = torsoHeight / height;
  const topProp = radiusTop / height;
  const bottomSegments = Math.floor(heightSegments * bottomProp);
  const topSegments = Math.floor(heightSegments * topProp);
  const torSegments = Math.floor(heightSegments * torProp);
  const topOffset = torsoHeight + radiusBottom - height / 2;
  const torOffset = radiusBottom - height / 2;
  const bottomOffset = radiusBottom - height / 2;

  const arc = opts.arc || 2.0 * Math.PI;

  // calculate vertex count
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const maxRadius = Math.max(radiusTop, radiusBottom);
  const minPos = vec3.create(-maxRadius, -height / 2, -maxRadius);
  const maxPos = vec3.create(maxRadius, height / 2, maxRadius);
  const boundingRadius = height / 2;

  let index = 0;
  const indexArray: number[][] = [];

  generateBottom();

  generateTorso();

  generateTop();

  return {
    positions,
    normals,
    uvs,
    indices,
    minPos,
    maxPos,
    boundingRadius,
  };

  // =======================
  // internal fucntions
  // =======================

  function generateTorso () {
    // this will be used to calculate the normal
    const slope = (radiusTop - radiusBottom) / torsoHeight;

    // generate positions, normals and uvs
    for (let y = 0; y <= torSegments; y++) {

      const indexRow: number[] = [];
      const lat = y / torSegments;
      const radius = lat * (radiusTop - radiusBottom) + radiusBottom;

      for (let x = 0; x <= sides; ++x) {
        const u = x / sides;
        const v = lat * torProp + bottomProp;
        const theta = u * arc - (arc / 4);

        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

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
        uvs.push(u, v);
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
        const i1 = indexArray[y][x];
        const i2 = indexArray[y + 1][x];
        const i3 = indexArray[y + 1][x + 1];
        const i4 = indexArray[y][x + 1];

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

  function generateBottom () {
    for (let lat = 0; lat <= bottomSegments; ++lat) {
      const theta = lat * Math.PI / bottomSegments / 2;
      const sinTheta = Math.sin(theta);
      const cosTheta = -Math.cos(theta);

      for (let lon = 0; lon <= sides; ++lon) {
        const phi = lon * 2 * Math.PI / sides - Math.PI / 2.0;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = sinPhi * sinTheta;
        const y = cosTheta;
        const z = cosPhi * sinTheta;
        const u = lon / sides;
        const v = lat / heightSegments;

        positions.push(x * radiusBottom, y * radiusBottom + bottomOffset, z * radiusBottom);
        normals.push(x, y, z);
        uvs.push(u, v);

        if ((lat < bottomSegments) && (lon < sides)) {
          const seg1 = sides + 1;
          const a = seg1 * lat + lon;
          const b = seg1 * (lat + 1) + lon;
          const c = seg1 * (lat + 1) + lon + 1;
          const d = seg1 * lat + lon + 1;

          indices.push(a, d, b);
          indices.push(d, c, b);
        }

        ++index;
      }
    }
  }

  function generateTop () {
    for (let lat = 0; lat <= topSegments; ++lat) {
      const theta = lat * Math.PI / topSegments / 2 + Math.PI / 2;
      const sinTheta = Math.sin(theta);
      const cosTheta = -Math.cos(theta);

      for (let lon = 0; lon <= sides; ++lon) {
        const phi = lon * 2 * Math.PI / sides - Math.PI / 2.0;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = sinPhi * sinTheta;
        const y = cosTheta;
        const z = cosPhi * sinTheta;
        const u = lon / sides;
        const v = lat / heightSegments + (1 - topProp);

        positions.push(x * radiusTop, y * radiusTop + topOffset, z * radiusTop);
        normals.push(x, y, z);
        uvs.push(u, v);

        if ((lat < topSegments) && (lon < sides)) {
          const seg1 = sides + 1;
          const a = seg1 * lat + lon + indexArray[torSegments][sides] + 1;
          const b = seg1 * (lat + 1) + lon + indexArray[torSegments][sides] + 1;
          const c = seg1 * (lat + 1) + lon + 1 + indexArray[torSegments][sides] + 1;
          const d = seg1 * lat + lon + 1 + indexArray[torSegments][sides] + 1;

          indices.push(a, d, b);
          indices.push(d, c, b);
        }
      }
    }
  }
}
