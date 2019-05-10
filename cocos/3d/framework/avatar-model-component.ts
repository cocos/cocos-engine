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
import { Vec2 } from '../../core/value-types';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { GFXAttributeName, GFXBufferTextureCopy, GFXFormatInfos, GFXFormatSize, GFXFormat } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { Mesh } from '../assets';
import { SkinningModelComponent } from './skinning-model-component';

const _vec2 = new Vec2();

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

    constructor () {
        super();
    }

    public onLoad () {
        super.onLoad();

        this._mesh = new Mesh();

        this._combinedTex = new Texture2D();
        this._combinedTex.setFilters(Filter.LINEAR, Filter.LINEAR);
        this.resizeCombiendTexture();
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
            const mtrl = this._materials[0];
            if (mtrl) {
                mtrl.setProperty(this._albedoMapName, this._combinedTex);
            }
        }
    }

    public combine () {
        this.combineTextures();
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
            this._onMeshChanged(this._mesh);
            this._updateModels();
        }

        if (!isValid) {
            return;
        }

        let uvOffset = 0;
        let hasUV = false;
        let dataView: DataView;
        let uv_x: number;
        let uv_y: number;
        const isLittleEndian = cc.sys.isLittleEndian;

        for (const unit of this._avatarUnits) {
            if (unit) {
                // merge textures
                if (unit.mesh && unit.mesh.data) {
                    const offset = unit.offset;

                    const meshData = unit.mesh.data.slice(0);
                    const newMesh = new Mesh();
                    newMesh.assign(unit.mesh.struct, meshData);

                    dataView = new DataView(meshData.buffer);
                    const struct = unit.mesh.struct;
                    for (const bundle of struct.vertexBundles) {
                        uvOffset = bundle.view.offset;
                        hasUV = false;
                        for (const attr of bundle.attributes) {
                            if (attr.name.indexOf(GFXAttributeName.ATTR_TEX_COORD) >= 0) {
                                hasUV = true;
                                break;
                            }
                            uvOffset += GFXFormatInfos[attr.format].size;
                        }

                        if (hasUV) {
                            const fx = unit.atlasSize.x / this._combinedTexSize;
                            const fy = unit.atlasSize.y / this._combinedTexSize;
                            for (let v = 0; v < bundle.view.count; ++v) {
                                uv_x = dataView.getFloat32(uvOffset, isLittleEndian);
                                uv_y = dataView.getFloat32(uvOffset + 4, isLittleEndian);
                                uv_y = Math.abs(uv_y);
                                uv_x = uv_x * fx + offset.x;
                                uv_y = (1.0 - uv_y) * fy + offset.y;
                                dataView.setFloat32(uvOffset, uv_x, isLittleEndian);
                                dataView.setFloat32(uvOffset + 4, uv_y, isLittleEndian);
                                uvOffset += bundle.view.stride;
                            }
                        }
                    }

                    this._mesh!.merge(newMesh);
                }
            }
        }

        this._onMeshChanged(this._mesh);
        this._updateModels();
    }

    private resizeCombiendTexture () {
        if (this._combinedTex) {
            this._combinedTex.destroy();
            this._combinedTex.create(this._combinedTexSize, this._combinedTexSize, PixelFormat.RGBA8888);
        }
    }
}
