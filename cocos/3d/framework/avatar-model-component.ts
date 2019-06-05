/****************************************************************************
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { Texture2D } from '../../assets';
import { Filter, PixelFormat } from '../../assets/asset-enum';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { Vec2 } from '../../core/value-types';
import { vec2 } from '../../core/vmath';
import { GFXFormat, GFXType } from '../../gfx/define';
import { GFXAttributeName, GFXBufferTextureCopy, GFXFormatInfos } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { Node } from '../../scene-graph';
import { Material, Mesh } from '../assets';
import { IMeshStruct } from '../assets/mesh';
import { Skeleton } from '../assets/skeleton';
import { mapBuffer } from '../misc/utils';
import { LCA, SkinningModelComponent } from './skinning-model-component';

const repeat = (n: number) => n - Math.floor(n);
const batch_id: IGFXAttribute = { name: GFXAttributeName.ATTR_BATCH_ID, format: GFXFormat.R32F, isNormalized: false };
const batch_uv: IGFXAttribute = { name: GFXAttributeName.ATTR_BATCH_UV, format: GFXFormat.RG32F, isNormalized: false };
const batch_extras_size = GFXFormatInfos[batch_id.format].size + GFXFormatInfos[batch_uv.format].size;

@ccclass('cc.AvatarUnit')
export class AvatarUnit {

    @property(Mesh)
    public mesh: Mesh | null = null;
    @property(Skeleton)
    public skeleton: Skeleton | null = null;
    @property(Node)
    public skinningRoot: Node | null = null;
    @property(Material)
    public material: Material | null = null;
    @property
    private _offset: Vec2 = new Vec2(0, 0);
    @property
    private _size: Vec2 = new Vec2(1, 1);

    @property
    set offset (offset) {
        vec2.copy(this._offset, offset);
    }
    get offset () {
        return this._offset;
    }

    @property
    set size (size) {
        vec2.copy(this._size, size);
    }
    get size () {
        return this._size;
    }

    @property({ type: SkinningModelComponent })
    set source (comp: SkinningModelComponent | null) {
        if (!comp) { return; }
        this.mesh = comp.mesh;
        this.skeleton = comp.skeleton;
        this.skinningRoot = comp.skinningRoot;
        this.material = comp.getSharedMaterial(0);
    }
    get source () {
        return null;
    }
}

const getPrefix = (lca: Node, target: Node) => {
    let prefix = '';
    let cur: Node | null = target;
    while (cur && cur !== lca) {
        prefix = `${cur.name}/` + prefix;
        cur = cur.parent;
    }
    return prefix;
};
const concatPath = (prefix: string, path: string) => path ? prefix + path : prefix.slice(0, -1);

/**
 * !#en The Avatar Model Component
 * !#ch 换装模型组件
 */
@ccclass('cc.AvatarModelComponent')
@executionOrder(100)
@executeInEditMode
@menu('Components/AvatarModelComponent')
export class AvatarModelComponent extends SkinningModelComponent {

    @property
    public combinedTexSize: number = 1024;
    @property({ type: [String] })
    public combinableTextureNames: string[] = [];
    @property({ type: [AvatarUnit] })
    public avatarUnits: AvatarUnit[] = [];

    private _textures: Record<string, Texture2D> = {};

    @property({ override: true, visible: false })
    get mesh () {
        return this._mesh;
    }
    set mesh (val) {
        super.mesh = val;
    }

    @property({ override: true, visible: false })
    get skeleton () {
        return this._skeleton;
    }
    set skeleton (val) {
        super.skeleton = val;
    }

    @property({ override: true, visible: false })
    get skinningRoot () {
        return this._skinningRoot;
    }
    set skinningRoot (val) {
        super.skinningRoot = val;
    }

    public onLoad () {
        super.onLoad();
        this.combine();
    }

    public onDestroy () {
        for (const tex of Object.keys(this._textures)) {
            this._textures[tex].destroy();
        }
        this._textures = {};

        if (this._mesh) {
            this._mesh.destroy();
            this._mesh = null;
        }
    }

    public clear () {
        if (this._mesh) {
            this._mesh.destroy();
        }
    }

    public combine () {
        this.combineMaterials();
        this.combineSkeletons();
        this.combineMeshes();
    }

    public combineMaterials () {
        const mat = this.getMaterial(0);
        if (!mat) { console.warn('batch material not specified!'); return; }
        mat.reset();
        const tech = mat.effectAsset!.techniques[mat.technique];
        for (let i = 0; i < tech.passes.length; i++) {
            const pass = tech.passes[i];
            if (!pass.properties) { continue; }
            for (const prop of Object.keys(pass.properties)) {
                if (pass.properties[prop].type >= GFXType.SAMPLER1D) { // samplers
                    let tex: Texture2D = null!;
                    if (this.combinableTextureNames.find((n) => n === prop)) {
                        tex = this._textures[prop];
                        if (!tex) { tex = this.createTexture(prop); }
                        this.combineTextures(tex, prop, i);
                    } else {
                        this.avatarUnits.some((u) => tex = u.material && u.material.getProperty(prop, i));
                    }
                    if (tex) { mat.setProperty(prop, tex, i); }
                } else { // vectors
                    const value: any[] = [];
                    for (const unit of this.avatarUnits) {
                        if (!unit.material) { continue; }
                        value.push(unit.material.getProperty(prop.slice(0, -3), i));
                    }
                    mat.setProperty(prop, value, i);
                }
            }
        }
    }

    public combineSkeletons () {
        // find lowest common ancestor as the new skinning root
        let lca: Node | null = null;
        for (const unit of this.avatarUnits) {
            if (!unit || !unit.skinningRoot) { continue; }
            const cur = unit.skinningRoot;
            if (!lca) { lca = cur; continue; }
            lca = LCA(lca, cur);
        }
        this._skinningRoot = lca;
        if (!lca) { console.warn('illegal skinning roots'); return; }
        // merge joints accordingly
        const skeleton = new Skeleton();
        for (const unit of this.avatarUnits) {
            if (!unit || !unit.skeleton || !unit.skinningRoot) { continue; }
            const partial = unit.skeleton;
            const prefix = getPrefix(lca, unit.skinningRoot);
            for (let i = 0; i < partial.joints.length; i++) {
                const path = concatPath(prefix, partial.joints[i]);
                const idx = skeleton.joints.findIndex((p) => p === path);
                if (idx >= 0) { continue; }
                skeleton.joints.push(path);
                skeleton.bindposes.push(partial.bindposes[i]);
            }
        }
        // sort the array to be more cache-friendly
        const idxMap = [...Array(skeleton.joints.length).keys()].sort((a, b) => {
            if (skeleton.joints[a] > skeleton.joints[b]) { return 1; }
            if (skeleton.joints[a] < skeleton.joints[b]) { return -1; }
            return 0;
        });
        skeleton.joints = skeleton.joints.map((_, idx, arr) => arr[idxMap[idx]]);
        skeleton.bindposes = skeleton.bindposes.map((_, idx, arr) => arr[idxMap[idx]]);
        // apply
        super.skeleton = skeleton;
    }

    public combineMeshes () {
        let isValid = false;
        for (const unit of this.avatarUnits) {
            if (unit.mesh) {
                isValid = true;
                break;
            }
        }

        if (this._mesh) {
            this._mesh.destroyRenderingMesh();
        } else {
            this._mesh = new Mesh();
        }

        if (!isValid || !this._skinningRoot) {
            return;
        }

        let uvOffset = 0;
        let uvFormat = GFXFormat.UNKNOWN;
        let dataView: DataView;
        let jointOffset = 0;
        let jointFormat = GFXFormat.UNKNOWN;

        // prepare joint index map
        const jointIndexMap: number[][] = new Array(this.avatarUnits.length);
        const avatarLen = this.avatarUnits.length;
        for (let i = 0; i < avatarLen; i++) {
            const unit = this.avatarUnits[i];
            if (!unit || !unit.skeleton || !unit.skinningRoot) { continue; }
            const prefix = getPrefix(this._skinningRoot, unit.skinningRoot);
            jointIndexMap[i] = unit.skeleton.joints.map((j) => {
                const path = concatPath(prefix, j);
                return this._skeleton!.joints.findIndex((ref) => path === ref);
            });
        }

        for (let i = 0; i < avatarLen; i++) {
            const unit = this.avatarUnits[i];
            if (!unit || !unit.mesh || !unit.mesh.data) { continue; }

            // add batch ID to this temp mesh
            const newMeshStruct: IMeshStruct = JSON.parse(JSON.stringify(unit.mesh.struct));
            const extraLength = unit.mesh.struct.vertexBundles.reduce((acc, cur) => acc + cur.view.count * batch_extras_size, 0);
            const newMeshData = new Uint8Array(unit.mesh.data.byteLength + extraLength);
            dataView = new DataView(newMeshData.buffer);

            // first, update bookkeepping
            let newOffset = 0; let oldOffset = 0;
            for (const vb of newMeshStruct.vertexBundles) {
                vb.attributes.push(batch_id);
                vb.attributes.push(batch_uv);
                vb.view.offset = newOffset;
                vb.view.length += vb.view.count * batch_extras_size;
                vb.view.stride += batch_extras_size;
                newOffset += vb.view.length;
            }
            for (const pm of newMeshStruct.primitives) {
                if (pm.indexView) {
                    pm.indexView.offset = newOffset;
                    newOffset += pm.indexView.length;
                }
                if (pm.geometricInfo) {
                    pm.geometricInfo.view.offset = newOffset;
                    newOffset += pm.geometricInfo.view.length;
                }
            }
            // now, we ride!
            const src = unit.mesh.data;
            for (let k = 0; k < newMeshStruct.vertexBundles.length; k++) {
                const uvs = unit.mesh.readAttribute(k, GFXAttributeName.ATTR_TEX_COORD)!; // FIXME: should be kth bundle instead of primitive
                const oldView = unit.mesh.struct.vertexBundles[k].view;
                const newView = newMeshStruct.vertexBundles[k].view;
                const oldStride = oldView.stride;
                const newStride = newView.stride;
                oldOffset = oldView.offset;
                newOffset = newView.offset;
                for (let j = 0; j < newView.count; j++) {
                    const srcVertex = src.subarray(oldOffset, oldOffset + oldStride);
                    newMeshData.set(srcVertex, newOffset);
                    // insert batch ID
                    dataView.setFloat32(newOffset + oldStride, i, cc.sys.isLittleEndian);
                    // insert batch UV
                    dataView.setFloat32(newOffset + oldStride + 4, uvs[j * 2], cc.sys.isLittleEndian);
                    dataView.setFloat32(newOffset + oldStride + 8, uvs[j * 2 + 1], cc.sys.isLittleEndian);
                    newOffset += newStride; oldOffset += oldStride;
                }
            }
            for (let k = 0; k < newMeshStruct.primitives.length; k++) {
                const oldPrimitive = unit.mesh.struct.primitives[k];
                const newPrimitive = newMeshStruct.primitives[k];
                if (oldPrimitive.indexView && newPrimitive.indexView) {
                    const oldStride = oldPrimitive.indexView.stride;
                    const newStride = newPrimitive.indexView.stride;
                    oldOffset = oldPrimitive.indexView.offset;
                    newOffset = newPrimitive.indexView.offset;
                    for (let j = 0; j < newPrimitive.indexView.count; j++) {
                        const srcIndices = src.subarray(oldOffset, oldOffset + oldStride);
                        newMeshData.set(srcIndices, newOffset);
                        newOffset += newStride; oldOffset += oldStride;
                    }
                }
                if (oldPrimitive.geometricInfo && newPrimitive.geometricInfo) {
                    const oldStride = oldPrimitive.geometricInfo.view.stride;
                    const newStride = newPrimitive.geometricInfo.view.stride;
                    oldOffset = oldPrimitive.geometricInfo.view.offset;
                    newOffset = newPrimitive.geometricInfo.view.offset;
                    for (let j = 0; j < newPrimitive.geometricInfo.view.count; j++) {
                        const srcPositions = src.subarray(oldOffset, oldOffset + oldStride);
                        newMeshData.set(srcPositions, newOffset);
                        newOffset += newStride; oldOffset += oldStride;
                    }
                }
            }
            const newMesh = new Mesh();
            newMesh.assign(newMeshStruct, newMeshData);

            const offset = unit.offset;
            const size = unit.size;
            for (const bundle of newMeshStruct.vertexBundles) {
                // merge UV
                uvOffset = bundle.view.offset;
                uvFormat = GFXFormat.UNKNOWN;
                for (const attr of bundle.attributes) {
                    if (attr.name === GFXAttributeName.ATTR_BATCH_UV) {
                        uvFormat = attr.format;
                        break;
                    }
                    uvOffset += GFXFormatInfos[attr.format].size;
                }
                if (uvFormat) {
                    mapBuffer(dataView, (cur, idx) => {
                        cur = repeat(cur); // warp to [0, 1] first
                        const comp = idx === 0 ? 'x' : 'y';
                        return cur * size[comp] + offset[comp];
                    }, uvFormat, uvOffset, bundle.view.length, bundle.view.stride, dataView);
                }
                // merge joint indices
                const idxMap = jointIndexMap[i];
                if (!idxMap) { continue; }
                jointOffset = bundle.view.offset;
                jointFormat = GFXFormat.UNKNOWN;
                for (const attr of bundle.attributes) {
                    if (attr.name === GFXAttributeName.ATTR_JOINTS) {
                        jointFormat = attr.format;
                        break;
                    }
                    jointOffset += GFXFormatInfos[attr.format].size;
                }
                if (jointFormat) {
                    mapBuffer(dataView, (cur) => idxMap[cur], jointFormat, jointOffset, bundle.view.length, bundle.view.stride, dataView);
                }
            }
            this._mesh!.merge(newMesh);
        }

        this._onMeshChanged(this._mesh);
        this._updateModels();
    }

    protected combineTextures (target: Texture2D, prop: string, passIdx: number) {
        const texImages: TexImageSource[] = [];
        const texImageRegions: GFXBufferTextureCopy[] = [];
        const texBuffers: ArrayBuffer[] = [];
        const texBufferRegions: GFXBufferTextureCopy[] = [];
        for (const unit of this.avatarUnits) {
            if (!unit.material) { continue; }
            const partial: Texture2D = unit.material.getProperty(prop, passIdx);
            if (partial && partial.image && partial.image.data) {
                const region = new GFXBufferTextureCopy();
                region.texOffset.x = unit.offset.x * this.combinedTexSize;
                region.texOffset.y = unit.offset.y * this.combinedTexSize;
                region.texExtent.width = unit.size.x * this.combinedTexSize;
                region.texExtent.height = unit.size.y * this.combinedTexSize;
                const data = partial.image.data;
                if (data instanceof HTMLCanvasElement || data instanceof HTMLImageElement) {
                    texImages.push(data);
                    texImageRegions.push(region);
                } else {
                    texBuffers.push(data.buffer);
                    texBufferRegions.push(region);
                }
            }
        }
        const gfxTex = target.getGFXTexture()!;
        const device: GFXDevice = cc.director.root.device;
        if (texBuffers.length > 0) { device.copyBuffersToTexture(texBuffers, gfxTex, texBufferRegions); }
        if (texImages.length > 0) { device.copyTexImagesToTexture(texImages, gfxTex, texImageRegions); }
    }

    protected createTexture (prop: string) {
        const tex = new Texture2D();
        tex.setFilters(Filter.LINEAR, Filter.LINEAR);
        tex.create(this.combinedTexSize, this.combinedTexSize, PixelFormat.RGBA8888);
        tex.loaded = true;
        this._textures[prop] = tex;
        return tex;
    }

    protected resizeCombinedTexture () {
        for (const prop of Object.keys(this._textures)) {
            const tex = this._textures[prop];
            tex.destroy();
            tex.create(this.combinedTexSize, this.combinedTexSize, PixelFormat.RGBA8888);
        }
    }
}
