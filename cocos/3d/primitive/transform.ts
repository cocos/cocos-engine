import { IGeometry } from './define';

export function translate (geometry: IGeometry, offset: { x?: number; y?: number; z?: number; }) {
    const x = offset.x || 0;
    const y = offset.y || 0;
    const z = offset.z || 0;
    const nVertex = Math.floor(geometry.positions.length / 3);
    for (let iVertex = 0; iVertex < nVertex; ++iVertex) {
        const iX = iVertex * 3;
        const iY = iVertex * 3 + 1;
        const iZ = iVertex * 3 + 2;
        geometry.positions[iX] = geometry.positions[iX] + x;
        geometry.positions[iY] = geometry.positions[iY] + y;
        geometry.positions[iZ] = geometry.positions[iZ] + z;
    }
    geometry.minPos.x += x;
    geometry.minPos.y += y;
    geometry.minPos.z += z;
    geometry.maxPos.x += x;
    geometry.maxPos.y += y;
    geometry.maxPos.z += z;
    return geometry;
}
