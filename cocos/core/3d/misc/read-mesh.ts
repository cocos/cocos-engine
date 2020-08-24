
import { Mesh } from '../../assets/mesh';
import { GFXAttributeName, GFXFormat, GFXFormatInfos } from '../../gfx/define';
import { IGeometry } from '../../primitive/define';
import { readBuffer } from './buffer';

enum _keyMap {
    positions = GFXAttributeName.ATTR_POSITION,
    normals = GFXAttributeName.ATTR_NORMAL,
    uvs = GFXAttributeName.ATTR_TEX_COORD,
    colors = GFXAttributeName.ATTR_COLOR,
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
            const name: GFXAttributeName = _keyMap[attr.name];
            if (name) { out[name] = (out[name] || []).concat(readBuffer(dataView, attr.format, offset, length, stride)); }
            offset += GFXFormatInfos[attr.format].size;
        }
    }
    const view = primitive.indexView!;
    out.indices = readBuffer(dataView, GFXFormat[`R${view.stride * 8}UI`], view.offset, view.length);
    return out;
}
