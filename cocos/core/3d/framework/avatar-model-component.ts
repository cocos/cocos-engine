/*
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
*/
/**
 * 模型相关模块
 * @category model
 */

import { Filter, PixelFormat } from '../../assets/asset-enum';
import { Texture2D } from '../../assets/texture-2d';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { CCInteger, CCString } from '../../core/data/utils/attribute';
import { Mat4, Vec2 } from '../../core/math';
import { GFXFormat } from '../../gfx/define';
import { GFXAttributeName, GFXBufferTextureCopy, GFXFormatInfos } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { Mesh } from '../assets/mesh';
import { Skeleton } from '../assets/skeleton';
import { LCA, mapBuffer } from '../misc/utils';
import { SkinningModelComponent } from './skinning-model-component';
import { INode } from '../../core/utils/interfaces';
import { Node } from '../../scene-graph/node';

const _vec2 = new Vec2();

const repeat = (n: number) => n - Math.floor(n);

@ccclass('cc.AvatarUnit')
export class AvatarUnit {

    @property(Mesh)
    public mesh: Mesh | null = null;
    @property(Skeleton)
    public skeleton: Skeleton | null = null;
    @property(Node)
    public skinningRoot: INode | null = null;
    @property
    private _offset: Vec2 = new Vec2(0, 0);
    @property
    private _atlasSize: Vec2 = new Vec2(256, 256);
    @property(Texture2D)
    private _albedoMap: Texture2D | null = null;

    @property
    set atlasSize (atlasSize) {
        Vec2.copy(this._atlasSize, atlasSize);
    }
    get atlasSize () {
        return this._atlasSize;
    }

    @property
    set offset (offset) {
        Vec2.copy(this._offset, offset);
    }
    get offset () {
        return this._offset;
    }

    @property({ type: Texture2D })
    get albedoMap () {
        return this._albedoMap;
    }
    set albedoMap (albedoMap) {
        if (this._albedoMap !== albedoMap) {
            this._albedoMap = albedoMap;
            if (this._albedoMap) {
                _vec2.x = this._albedoMap.width;
                _vec2.y = this._albedoMap.height;
                this.atlasSize = _vec2;
            }
        }
    }

    @property({ type: SkinningModelComponent })
    set source (comp: SkinningModelComponent | null) {
        if (!comp) { return; }
        this.mesh = comp.mesh;
        this.skeleton = comp.skeleton;
        this.skinningRoot = comp.skinningRoot;
    }
    get source () {
        return null;
    }
}

const getPrefix = (lca: INode, target: INode) => {
    let prefix = '';
    let cur: INode | null = target;
    while (cur && cur !== lca) {
        prefix = `${cur.name}/` + prefix;
        cur = cur.parent;
    }
    return prefix;
};
const concatPath = (prefix: string, path: string) => path ? prefix + path : prefix.slice(0, -1);

/**
 * @en The Avatar Model Component
 * @zh 换装模型组件
 */
@ccclass('cc.AvatarModelComponent')
@executionOrder(100)
@executeInEditMode
export class AvatarModelComponent extends SkinningModelComponent {

    @property
    private _combinedTexSize: number = 1024;
    private _combinedTex: Texture2D | null = null;

    @property
    private _albedoMapName: string = '';

    @property
    private _avatarUnits: AvatarUnit[] = [];

    @property({ override: true, visible: false })
    get mesh (): Mesh | null {
        return this._mesh;
    }

    @property({ override: true, visible: false })
    get skeleton () {
        return this._skeleton;
    }

    @property({ override: true, visible: false })
    get skinningRoot () {
        return this._skinningRoot;
    }

    @property({ type: CCInteger })
    get combinedTexSize (): number {
        return this._combinedTexSize;
    }

    set combinedTexSize (size: number) {
        this._combinedTexSize = size;
    }

    @property({ type: CCString })
    get albedoMapName (): string {
        return this._albedoMapName;
    }

    set albedoMapName (name: string) {
        if (this._albedoMapName !== name) {
            this._albedoMapName = name;
        }
    }

    @property({ type: [AvatarUnit] })
    get avatarUnits (): AvatarUnit[] {
        return this._avatarUnits;
    }

    set avatarUnits (units: AvatarUnit[]) {
        this._avatarUnits = units;
    }

    public onLoad () {
        super.onLoad();

        this._combinedTex = new Texture2D();
        this._combinedTex.onLoaded();
        this._combinedTex.setFilters(Filter.LINEAR, Filter.LINEAR);
        this.resizeCombinedTexture();
        this.combine();
    }

    public onDestroy () {
        if (this._combinedTex) {
            this._combinedTex.destroy();
            this._combinedTex = null;
        }

        if (this._mesh) {
            this._mesh.destroy();
            this._mesh = null;
        }
    }

    public addAvatarUnit (unit: AvatarUnit) {
        this._avatarUnits.push(unit);
    }

    public clear () {
        if (this._mesh) {
            this._mesh.destroy();
        }
    }

    public bindTextures () {
        if (this._albedoMapName.length > 0 && this._materials.length > 0) {
            const mtrl = this.material;
            if (mtrl) {
                mtrl.setProperty(this._albedoMapName, this._combinedTex);
            }
        }
    }

    public combine () {
        this.combineTextures();
        this.combineSkeletons();
        this.combineMeshes();
        this.bindTextures();
    }

    public combineTextures () {
        let isValid = false;
        for (const unit of this._avatarUnits) {
            if (unit.albedoMap) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            return;
        }

        const texImages: TexImageSource[] = [];
        const texImageRegions: GFXBufferTextureCopy[] = [];
        const texBuffers: ArrayBuffer[] = [];
        const texBufferRegions: GFXBufferTextureCopy[] = [];

        /*
        const buffSize = GFXFormatSize(GFXFormat.RGBA8, this._combinedTexSize, this._combinedTexSize, 1);
        const clearBuff = new ArrayBuffer(buffSize);
        texBuffers.push(clearBuff);

        let region = new GFXBufferTextureCopy();
        region.texExtent.width = this._combinedTexSize;
        region.texExtent.height = this._combinedTexSize;
        texBufferRegions.push(region);
        */

        for (const unit of this._avatarUnits) {
            if (unit) {
                const offset = unit.offset;
                isValid = (offset.x >= 0 && offset.y >= 0);
                if (isValid && unit.albedoMap && unit.albedoMap.image && unit.albedoMap.image.data) {
                    // merge textures
                    const region = new GFXBufferTextureCopy();
                    region.texOffset.x = offset.x;
                    region.texOffset.y = offset.y;
                    region.texExtent.width = unit.albedoMap.image.width;
                    region.texExtent.height = unit.albedoMap.image.height;

                    const data = unit.albedoMap.image.data;
                    if (data instanceof HTMLCanvasElement || data instanceof HTMLImageElement) {
                        texImages.push(data);
                        texImageRegions.push(region);
                    } else {
                        texBuffers.push(data.buffer);
                        texBufferRegions.push(region);
                    }
                }
            }
        }

        const gfxTex = this._combinedTex!.getGFXTexture();
        const device: GFXDevice = cc.director.root.device;

        if (texBuffers.length > 0) {
            device.copyBuffersToTexture(texBuffers, gfxTex!, texBufferRegions);
        }

        if (texImages.length > 0) {
            device.copyTexImagesToTexture(texImages, gfxTex!, texImageRegions);
        }
    }

    public combineSkeletons () {
        // find lowest common ancestor as the new skinning root
        let lca: INode | null = null;
        for (const unit of this._avatarUnits) {
            if (!unit || !unit.skinningRoot) { continue; }
            const cur = unit.skinningRoot;
            if (!lca) { lca = cur; continue; }
            lca = LCA(lca, cur);
        }
        this._skinningRoot = lca;
        if (!lca) { console.warn('illegal skinning roots'); return; }
        // merge joints accordingly
        const skeleton = new Skeleton();
        const bindposes: Mat4[] = [];
        for (const unit of this._avatarUnits) {
            if (!unit || !unit.skeleton || !unit.skinningRoot) { continue; }
            const partial = unit.skeleton;
            const prefix = getPrefix(lca, unit.skinningRoot);
            for (let i = 0; i < partial.joints.length; i++) {
                const path = concatPath(prefix, partial.joints[i]);
                const idx = skeleton.joints.findIndex((p) => p === path);
                if (idx >= 0) { continue; }
                skeleton.joints.push(path);
                bindposes.push(partial.bindposes[i] || new Mat4());
            }
        }
        // sort the array to be more cache-friendly
        const idxMap = [...Array(skeleton.joints.length).keys()].sort((a, b) => {
            if (skeleton.joints[a] > skeleton.joints[b]) { return 1; }
            if (skeleton.joints[a] < skeleton.joints[b]) { return -1; }
            return 0;
        });
        skeleton.joints = skeleton.joints.map((_, idx, arr) => arr[idxMap[idx]]);
        skeleton.bindposes = bindposes.map((_, idx, arr) => arr[idxMap[idx]]);
        // apply
        // @ts-ignore
        super.skeleton = skeleton;
    }

    public combineMeshes () {
        let isValid = false;
        for (const unit of this._avatarUnits) {
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
        const jointIndexMap: number[][] = new Array(this._avatarUnits.length);
        const avatarLen = this._avatarUnits.length;
        for (let i = 0; i < avatarLen; i++) {
            const unit = this._avatarUnits[i];
            if (!unit || !unit.skeleton || !unit.skinningRoot) { continue; }
            const prefix = getPrefix(this._skinningRoot, unit.skinningRoot);
            jointIndexMap[i] = unit.skeleton.joints.map((j) => {
                const path = concatPath(prefix, j);
                return this._skeleton!.joints.findIndex((ref) => path === ref);
            });
        }

        for (let i = 0; i < avatarLen; i++) {
            const unit = this._avatarUnits[i];
            if (!unit || !unit.mesh || !unit.mesh.data) { continue; }
            const offset = unit.offset;

            const meshData = unit.mesh.data.slice();
            const newMesh = new Mesh();
            newMesh.reset({
                struct: unit.mesh.struct,
                data: meshData,
            });

            dataView = new DataView(meshData.buffer);
            const struct = unit.mesh.struct;
            for (const bundle of struct.vertexBundles) {
                // merge UV
                uvOffset = bundle.view.offset;
                uvFormat = GFXFormat.UNKNOWN;
                for (const attr of bundle.attributes) {
                    if (attr.name.indexOf(GFXAttributeName.ATTR_TEX_COORD) >= 0) {
                        uvFormat = attr.format;
                        break;
                    }
                    uvOffset += GFXFormatInfos[attr.format].size;
                }
                if (uvFormat) {
                    mapBuffer(dataView, (cur, idx) => {
                        cur = repeat(cur); // warp to [0, 1] first
                        const comp = idx === 0 ? 'x' : 'y';
                        return (cur * unit.atlasSize[comp] + offset[comp]) / this._combinedTexSize;
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

    private resizeCombinedTexture () {
        if (this._combinedTex) {
            this._combinedTex.destroy();
            this._combinedTex.reset({
                width: this._combinedTexSize,
                height: this._combinedTexSize,
                format: PixelFormat.RGBA8888,
            });
        }
    }
}
