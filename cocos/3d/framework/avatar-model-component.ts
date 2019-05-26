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
import { GFXAttributeName, GFXBufferTextureCopy, GFXFormatInfos } from '../../gfx/define';
import { GFXFormat } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { Mesh } from '../assets';
import { Skeleton } from '../assets/skeleton';
import { mapBuffer } from '../misc/utils';
import { SkinningModelComponent } from './skinning-model-component';

const _vec2 = new Vec2();

const repeat = (n: number) => n - Math.floor(n);

@ccclass('cc.AvatarUnit')
export class AvatarUnit {

    @property({ type: Mesh })
    get mesh (): Mesh | null {
        return this._mesh;
    }

    set mesh (mesh: Mesh | null) {
        if (this._mesh !== mesh) {
            this._mesh = mesh;
        }
    }

    @property({ type: Skeleton })
    get skeleton () {
        return this._skeleton;
    }

    set skeleton (skeleton: Skeleton | null) {
        if (this._skeleton !== skeleton) {
            this._skeleton = skeleton;
        }
    }

    @property({ type: cc.Vec2 })
    get atlasSize (): Vec2 {
        return this._atlasSize;
    }

    set atlasSize (atlasSize: Vec2) {
        if (this._atlasSize.x !== atlasSize.x ||
            this._atlasSize.y !== atlasSize.y) {
            this._atlasSize = atlasSize;
        }
    }

    @property({ type: cc.Vec2 })
    get offset (): Vec2 {
        return this._offset;
    }

    set offset (offset: Vec2) {
        if (this._offset.x !== offset.x ||
            this._offset.y !== offset.y) {
            this._offset = offset;
        }
    }

    @property({ type: Texture2D })
    get albedoMap (): Texture2D | null {
        return this._albedoMap;
    }

    set albedoMap (albedoMap: Texture2D | null) {
        if (this._albedoMap !== albedoMap) {
            this._albedoMap = albedoMap;

            if (this._albedoMap) {
                _vec2.x = this._albedoMap.width;
                _vec2.y = this._albedoMap.height;
                this.atlasSize = _vec2;
            }
        }
    }

    @property
    private _mesh: Mesh | null = null;

    @property
    private _skeleton: Skeleton | null = null;

    @property
    private _offset: Vec2 = new Vec2(0, 0);

    @property
    private _atlasSize: Vec2 = new Vec2(256, 256);

    @property
    private _albedoMap: Texture2D | null = null;
}

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

    @property({ type: Number })
    get combinedTexSize (): number {
        return this._combinedTexSize;
    }

    set combinedTexSize (size: number) {
        this._combinedTexSize = size;
    }

    @property({ type: String })
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

    public update (dt) {
        super.update(dt);
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
        // batched skinning model shouldn't have local transform
        this.node.setPosition(0, 0, 0);
        this.node.setRotation(0, 0, 0, 1);
        this.node.setScale(1, 1, 1);

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
        const skeleton = new Skeleton();
        for (const unit of this._avatarUnits) {
            if (!unit || !unit.skeleton) { continue; }
            const partial = unit.skeleton;
            for (let i = 0; i < partial.joints.length; i++) {
                const path = partial.joints[i];
                const idx = skeleton.joints.findIndex((p) => p === path);
                if (idx >= 0) { continue; }
                skeleton.joints.push(path);
                skeleton.bindposes.push(partial.bindposes[i]);
            }
        }
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

        if (!isValid) {
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
            if (!unit || !unit.skeleton) { continue; }
            jointIndexMap[i] = unit.skeleton.joints.map((j) => this._skeleton!.joints.findIndex((ref) => j === ref));
        }

        for (let i = 0; i < avatarLen; i++) {
            const unit = this._avatarUnits[i];
            if (!unit || !unit.mesh || !unit.mesh.data) { continue; }
            const offset = unit.offset;

            const meshData = unit.mesh.data.slice();
            const newMesh = new Mesh();
            newMesh.assign(unit.mesh.struct, meshData);

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
            this._combinedTex.create(this._combinedTexSize, this._combinedTexSize, PixelFormat.RGBA8888);
        }
    }
}
