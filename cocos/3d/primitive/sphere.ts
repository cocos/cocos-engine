import { vec3 } from '../../core/vmath';
import { IGeometry, IGeometryOptions } from './define';

interface ISphereOptions extends IGeometryOptions {
    segments: number;
}

export default function (radius = 0.5, opts: RecursivePartial<ISphereOptions> = {}): IGeometry {
  const segments = opts.segments !== undefined ? opts.segments : 32;

  // lat === latitude
  // lon === longitude

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const minPos = vec3.create(-radius, -radius, -radius);
  const maxPos = vec3.create(radius, radius, radius);
  const boundingRadius = radius;

  for (let lat = 0; lat <= segments; ++lat) {
    const theta = lat * Math.PI / segments;
    const sinTheta = Math.sin(theta);
    const cosTheta = -Math.cos(theta);

    for (let lon = 0; lon <= segments; ++lon) {
      const phi = lon * 2 * Math.PI / segments - Math.PI / 2.0;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = sinPhi * sinTheta;
      const y = cosTheta;
      const z = cosPhi * sinTheta;
      const u = lon / segments;
      const v = lat / segments;

      positions.push(x * radius, y * radius, z * radius);
      normals.push(x, y, z);
      uvs.push(u, v);

      if ((lat < segments) && (lon < segments)) {
        const seg1 = segments + 1;
        const a = seg1 * lat + lon;
        const b = seg1 * (lat + 1) + lon;
        const c = seg1 * (lat + 1) + lon + 1;
        const d = seg1 * lat + lon + 1;

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
    boundingRadius,
  };
}
