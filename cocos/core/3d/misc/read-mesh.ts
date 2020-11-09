
import { Mesh } from '../../assets/mesh';
import { AttributeName, Format, FormatInfos } from '../../gfx/define';
import { IGeometry } from '../../primitive/define';
import { readBuffer } from './buffer';

enum _keyMap {
    positions = AttributeName.ATTR_POSITION,
    normals = AttributeName.ATTR_NORMAL,
    uvs = AttributeName.ATTR_TEX_COORD,
    colors = AttributeName.ATTR_COLOR,
}

export function readMesh (mesh: Mesh, iPrimitive: number = 0) {
    const out: IGeometry = { positions: [] };
    const dataView = new DataView(mesh.data.buffer, mesh.data.byteOffset, mesh.data.byteLength);
    const struct = mesh.struct;
    const primitive = struct.primitives[iPrimitive];
    for (const idx of primitive.vertexBundelIndices) {
        const bundle = struct.vertexBundles[idx];
        let offset = bundle.view.offset;
        const { length, stride } = bundle.view;
        for (const attr of bundle.attributes) {
            const name: AttributeName = _keyMap[attr.name];
            if (name) { out[name] = (out[name] || []).concat(readBuffer(dataView, attr.format, offset, length, stride)); }
            offset += FormatInfos[attr.format].size;
        }
    }
    const view = primitive.indexView!;
    out.indices = readBuffer(dataView, Format[`R${view.stride * 8}UI`], view.offset, view.length);
    return out;
}
