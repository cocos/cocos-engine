/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { ccclass, tooltip, displayOrder, type, serializable, disallowAnimation, visible } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Mesh } from '../3d';
import { Material, Texture2D } from '../core/assets';
import { AlignmentSpace, RenderMode, Space } from './enum';
import { Attribute, AttributeName, BufferInfo, BufferUsageBit, Device, deviceManager, DrawInfo, Feature, Format, FormatFeatureBit, FormatInfos, IndirectBuffer, MemoryUsageBit } from '../core/gfx';
import { legacyCC } from '../core/global-exports';
import { builtinResMgr, director, errorID, Mat4, ModelRenderer, Quat, RenderingSubMesh, Vec2, Vec4, warnID } from '../core';
import { MacroRecord, MaterialInstance, Pass, scene } from '../core/renderer';
import ParticleBatchModel from './models/particle-batch-model';
import { ParticleSystem } from './particle-system';
import { Camera } from '../core/renderer/scene/camera';

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';

const CC_RENDER_MODE = 'CC_RENDER_MODE';
const ROTATION_OVER_TIME_MODULE_ENABLE = 'ROTATION_OVER_TIME_MODULE_ENABLE';
const INSTANCE_PARTICLE = 'CC_INSTANCE_PARTICLE';
const RENDER_MODE_BILLBOARD = 0;
const RENDER_MODE_STRETCHED_BILLBOARD = 1;
const RENDER_MODE_HORIZONTAL_BILLBOARD = 2;
const RENDER_MODE_VERTICAL_BILLBOARD = 3;
const RENDER_MODE_MESH = 4;

const _vertex_attrs = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),       // position
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F),      // uv,frame idx
    new Attribute(AttributeName.ATTR_TEX_COORD1, Format.RGB32F),     // size
    new Attribute(AttributeName.ATTR_TEX_COORD2, Format.RGB32F),     // rotation
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true),     // color
];

const _vertex_attrs_stretch = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),       // position
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F),      // uv,frame idx
    new Attribute(AttributeName.ATTR_TEX_COORD1, Format.RGB32F),     // size
    new Attribute(AttributeName.ATTR_TEX_COORD2, Format.RGB32F),     // rotation
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true),     // color
    new Attribute(AttributeName.ATTR_COLOR1, Format.RGB32F),         // particle velocity
];

const _vertex_attrs_mesh = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),       // particle position
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F),      // uv,frame idx
    new Attribute(AttributeName.ATTR_TEX_COORD1, Format.RGB32F),     // size
    new Attribute(AttributeName.ATTR_TEX_COORD2, Format.RGB32F),     // rotation
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true),     // particle color
    new Attribute(AttributeName.ATTR_TEX_COORD3, Format.RGB32F),     // mesh position
    new Attribute(AttributeName.ATTR_NORMAL, Format.RGB32F),         // mesh normal
    new Attribute(AttributeName.ATTR_COLOR1, Format.RGBA8, true),    // mesh color
];

const _vertex_attrs_ins = [
    new Attribute(AttributeName.ATTR_TEX_COORD4, Format.RGBA32F, false, 0, true),    // position,frame idx
    new Attribute(AttributeName.ATTR_TEX_COORD1, Format.RGB32F, false, 0, true),     // size
    new Attribute(AttributeName.ATTR_TEX_COORD2, Format.RGB32F, false, 0, true),     // rotation
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true, 0, true),            // color
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F, false, 1),            // uv
];

const _vertex_attrs_stretch_ins = [
    new Attribute(AttributeName.ATTR_TEX_COORD4, Format.RGBA32F, false, 0, true),    // position,frame idx
    new Attribute(AttributeName.ATTR_TEX_COORD1, Format.RGB32F, false, 0, true),     // size
    new Attribute(AttributeName.ATTR_TEX_COORD2, Format.RGB32F, false, 0, true),     // rotation
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true, 0, true),            // color
    new Attribute(AttributeName.ATTR_COLOR1, Format.RGB32F, false, 0, true),         // particle velocity
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F, false, 1),            // uv
];

const _vertex_attrs_mesh_ins = [
    new Attribute(AttributeName.ATTR_TEX_COORD4, Format.RGBA32F, false, 0, true),    // particle position,frame idx
    new Attribute(AttributeName.ATTR_TEX_COORD1, Format.RGB32F, false, 0, true),     // size
    new Attribute(AttributeName.ATTR_TEX_COORD2, Format.RGB32F, false, 0, true),     // rotation
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true, 0, true),            // particle color
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F, false, 1),            // mesh uv
    new Attribute(AttributeName.ATTR_TEX_COORD3, Format.RGB32F, false, 1),           // mesh position
    new Attribute(AttributeName.ATTR_NORMAL, Format.RGB32F, false, 1),               // mesh normal
    new Attribute(AttributeName.ATTR_COLOR1, Format.RGBA8, true, 1),                 // mesh color
];

@ccclass('cc.ParticleSystemRenderer')
export class ParticleSystemRenderer extends ModelRenderer {
    /**
     * @zh 设定粒子生成模式。
     */
    @type(RenderMode)
    @displayOrder(0)
    @tooltip('i18n:particleSystemRenderer.renderMode')
    public get renderMode () {
        return this._renderMode;
    }

    public set renderMode (val) {
        if (this._renderMode !== val) {
            this._renderMode = val;
            this.updateRenderMode();
        }
    }

    /**
     * @zh 在粒子生成方式为 StretchedBillboard 时,对粒子在运动方向上按速度大小进行拉伸。
     */
    @displayOrder(1)
    @tooltip('i18n:particleSystemRenderer.velocityScale')
    public get velocityScale () {
        return this._velocityScale;
    }

    public set velocityScale (val) {
        this._velocityScale = val;
        this.updateMaterialParams();
        // this._updateModel();
    }

    /**
     * @zh 在粒子生成方式为 StretchedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸。
     */
    @displayOrder(2)
    @tooltip('i18n:particleSystemRenderer.lengthScale')
    public get lengthScale () {
        return this._lengthScale;
    }

    public set lengthScale (val) {
        this._lengthScale = val;
        this.updateMaterialParams();
    }

    @type(RenderMode)
    @serializable
    private _renderMode = RenderMode.Billboard;

    @serializable
    private _velocityScale = 1;

    @serializable
    private _lengthScale = 1;

    @serializable
    private _mesh: Mesh | null = null;

    private _iaInfo: IndirectBuffer;
    private _defines: MacroRecord;
    private _trailDefines: MacroRecord;
    private _frameTile_velLenScale: Vec4;
    private _tmp_velLenScale: Vec4;
    private _defaultMat: Material | null = null;
    private _node_scale: Vec4;
    private _attrs: any[];
    private _defaultTrailMat: Material | null = null;
    private _uScaleHandle = 0;
    private _uLenHandle = 0;
    private _uNodeRotHandle = 0;
    private _inited = false;
    private _localMat = new Mat4();
    private _gravity = new Vec4();
    private _subMeshData: RenderingSubMesh | null = null;

    /**
     * @zh 粒子发射的模型。
     */
    @type(Mesh)
    @displayOrder(7)
    @tooltip('i18n:particleSystemRenderer.mesh')
    public get mesh () {
        return this._mesh;
    }

    public set mesh (val) {
        this._mesh = val;
        this.setVertexAttributes();
    }

    /**
     * @zh 粒子使用的材质。
     */
    @type(Material)
    @displayOrder(8)
    @disallowAnimation
    @visible(false)
    @tooltip('i18n:particleSystemRenderer.particleMaterial')
    public get particleMaterial () {
        return this.getMaterial(0) as Material;
    }

    public set particleMaterial (val: Material | null) {
        this.setMaterial(val, 0);
    }

    /**
     * @en particle trail material
     * @zh 拖尾使用的材质。
     */
    @type(Material)
    @displayOrder(9)
    @disallowAnimation
    @tooltip('i18n:particleSystemRenderer.trailMaterial')
    public get trailMaterial () {
        return this.getMaterial(1) as Material;
    }

    public set trailMaterial (val: Material | null) {
        this.setMaterial(val, 1);
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _collectModels (): scene.Model[] {
        this._models.length = 0;
        this._models.push(this._model!);
        if (this._trailModel) {
            this._models.push(this._trailModel);
        }
        return this._models;
    }

    public get mainTexture () {
        return this._mainTexture;
    }

    public set mainTexture (val) {
        this._mainTexture = val;
    }

    /**
     * @en Particle alignment space option. Includes world, local and view.
     * @zh 粒子对齐空间选择。包括世界空间，局部空间和视角空间。
     */
    @type(AlignmentSpace)
    @displayOrder(10)
    @tooltip('i18n:particle_system.alignSpace')
    public get alignSpace () {
        return this._alignSpace;
    }

    public set alignSpace (val) {
        this._alignSpace = val;
    }

    public static AlignmentSpace = AlignmentSpace;

    @serializable
    private _alignSpace = AlignmentSpace.VIEW;
    @serializable
    private _mainTexture: Texture2D | null = null;
    private _model: ParticleBatchModel | null = null;
    private _vertSize = 0;
    private _trailModel: scene.Model | null = null;
    protected _renderInfo: ParticleSystemRenderer | null = null;
    protected _vertAttrs: Attribute[] = [];
    protected _useInstance: boolean;

    constructor () {
        super();
        if (!deviceManager.gfxDevice.hasFeature(Feature.INSTANCED_ARRAYS)) {
            this._useInstance = false;
        } else {
            this._useInstance = true;
        }
        this._frameTile_velLenScale = new Vec4(1, 1, 0, 0);
        this._tmp_velLenScale = this._frameTile_velLenScale.clone();
        this._node_scale = new Vec4();
        this._attrs = new Array(7);
        this._defines = {
            CC_USE_WORLD_SPACE: true,
            CC_USE_BILLBOARD: true,
            CC_USE_STRETCHED_BILLBOARD: false,
            CC_USE_HORIZONTAL_BILLBOARD: false,
            CC_USE_VERTICAL_BILLBOARD: false,
        };
        this._trailDefines = {
            CC_USE_WORLD_SPACE: true,
            // CC_DRAW_WIRE_FRAME: true,   // <wireframe debug>
        };
        this._iaInfo = new IndirectBuffer([new DrawInfo()]);

        this._vertAttrs = [
            new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),   // xyz:position
            new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGBA32F), // x:index y:size zw:texcoord
            // new Attribute(AttributeName.ATTR_TEX_COORD2, Format.RGB32F), // <wireframe debug>
            new Attribute(AttributeName.ATTR_TEX_COORD1, Format.RGB32F), // xyz:velocity
            new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true),
        ];
        for (const a of this._vertAttrs) {
            this._vertSize += FormatInfos[a.format].size;
        }
    }

    public onLoad () {
        if (!this._model) {
            this._model = legacyCC.director.root.createModel(ParticleBatchModel);
            this._model!.setCapacity(this._particleSystem.capacity);
            this._model!.visFlags = this.node.layer;
        }
        if (this._trailModel) {
            return;
        }

        this._trailModel = legacyCC.director.root.createModel(scene.Model);
    }

    public onEnable () {
        this.attachToScene();
        const model = this._model;
        if (model) {
            model.node = model.transform = this.node;
        }
    }

    public onDisable () {
        this.detachFromScene();
    }

    public onDestroy () {
        if (this._model) {
            this._model.detachFromScene();
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
        }
        if (this._trailModel) {
            this._trailModel.detachFromScene();
            legacyCC.director.root.destroyModel(this._trailModel);
            this._trailModel = null;
        }
        if (this._subMeshData) {
            this._subMeshData.destroy();
            this._subMeshData = null;
        }
    }

    public attachToScene () {
        if (this._model) {
            if (this._model.scene) {
                this.detachFromScene();
            }
            this._getRenderScene().addModel(this._model);
        }
    }

    public detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    public setVertexAttributes () {
        if (this._model) {
            this.updateVertexAttrib();
            this._model.setVertexAttributes(this._renderInfo!.renderMode === RenderMode.Mesh ? this._renderInfo!.mesh : null, this._vertAttrs);
        }
    }

    public clear () {
        if (this._model) this._model.enabled = false;
    }

    public getModel () {
        return this._model;
    }

    // internal function
    public updateRenderData () {
        this._model!.setCapacity(this.ps.capacity);
        this.updateMaterialParams();
        this.updateTrailMaterial();

        // update vertex buffer
        let idx = 0;
        if (this.renderMode === RenderMode.MESH) {
            for (let i = 0; i < this._particleSystem._particles.count; ++i) {
                const p = this._particles.data[i];
                let fi = 0;
                const textureModule = this._particleSystem._textureAnimationModule;
                if (textureModule && textureModule.enable) {
                    fi = p.frameIndex;
                }
                idx = i * 4;
                this._fillMeshData(p, idx, fi);
            }
        } else if (this.renderMode === RenderMode.STRETCHED_BILLBOARD) {
            for (let i = 0; i < this._particleSystem._particles.count; ++i) {
                const p = this._particles.data[i];
                let fi = 0;
                const textureModule = this._particleSystem._textureAnimationModule;
                if (textureModule && textureModule.enable) {
                    fi = p.frameIndex;
                }
                idx = i * 4;
                this._fillStretchedData(p, idx, fi);
            }
        } else {
            for (let i = 0; i < this._particleSystem._particles.count; ++i) {
                const p = this._particles.data[i];
                let fi = 0;
                const textureModule = this._particleSystem._textureAnimationModule;
                if (textureModule && textureModule.enable) {
                    fi = p.frameIndex;
                }
                idx = i * 4;
                this._fillNormalData(p, idx, fi);
            }
        }

        this.updateTrailRenderData();
    }

    public updateMaterialParams () {
        const particleSystem = this.getComponent(ParticleSystem);
        if (!particleSystem) {
            return;
        }

        const mat: Material | null = this.getMaterialInstance(0) || this._defaultMat;
        const pass = mat!.passes[0];

        const shareMaterial = this.sharedMaterial;
        if (shareMaterial != null) {
            this.mainTexture = shareMaterial.getProperty('mainTexture', 0) as Texture2D;
        }

        if (shareMaterial == null && this._defaultMat == null) {
            this._defaultMat = new MaterialInstance({
                parent: builtinResMgr.get<Material>('default-particle-material'),
                owner: this,
                subModelIdx: 0,
            });
            if (this.mainTexture !== null) {
                this._defaultMat.setProperty('mainTexture', this.mainTexture);
            }
        }
        if (particleSystem.simulationSpace === Space.WORLD) {
            this._defines[CC_USE_WORLD_SPACE] = true;
        } else {
            this._defines[CC_USE_WORLD_SPACE] = false;
        }

        this._uScaleHandle = pass.getHandle('scale');
        this._uLenHandle = pass.getHandle('frameTile_velLenScale');
        this._uNodeRotHandle = pass.getHandle('nodeRotation');

        const renderMode = this.renderMode;
        const vlenScale = this._frameTile_velLenScale;
        if (renderMode === RenderMode.BILLBOARD) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_BILLBOARD;
        } else if (renderMode === RenderMode.STRETCHED_BILLBOARD) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_STRETCHED_BILLBOARD;
            vlenScale.z = this.velocityScale;
            vlenScale.w = this.lengthScale;
        } else if (renderMode === RenderMode.HORIZONTAL_BILLBOARD) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_HORIZONTAL_BILLBOARD;
        } else if (renderMode === RenderMode.VERTICAL_BILLBOARD) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_VERTICAL_BILLBOARD;
        } else if (renderMode === RenderMode.MESH) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_MESH;
        } else {
            console.warn(`particle system renderMode ${renderMode} not support.`);
        }
        const textureModule = ps._textureAnimationModule;
        if (textureModule && textureModule.enable) {
            Vec4.copy(this._tmp_velLenScale, vlenScale); // fix textureModule switch bug
            Vec2.set(this._tmp_velLenScale, textureModule.numTilesX, textureModule.numTilesY);
            pass.setUniform(this._uLenHandle, this._tmp_velLenScale);
        } else {
            pass.setUniform(this._uLenHandle, vlenScale);
        }

        let enable = false;
        const roationModule = this._particleSystem._rotationOvertimeModule;
        enable = roationModule && roationModule.enable;
        this._defines[ROTATION_OVER_TIME_MODULE_ENABLE] = enable;
        this._defines[INSTANCE_PARTICLE] = this._useInstance;

        mat.recompileShaders(this._defines);
        if (this._model) {
            this._model.updateMaterial(mat);
        }
    }

    private _fillMeshData (p: Particle, idx: number, fi: number) {
        const i = idx / 4;
        this._attrs[0] = p.position;
        _tempAttribUV.z = fi;
        this._attrs[1] = _tempAttribUV;
        this._attrs[2] = p.size;
        this._attrs[3] = p.rotation;
        this._attrs[4] = p.color._val;
        this._model!.addParticleVertexData(i, this._attrs);
    }

    protected beforeRender () {
        if (!this._isPlaying) return;
        this._processor.beforeRender();
        if (this._trailModule && this._trailModule.enable) {
            this._trailModule.beforeRender();
        }

        if (this.getParticleCount() <= 0) {
            if (this._processor.getModel()?.scene) {
                this._processor.detachFromScene();
                if (this._trailModule && this._trailModule.enable) {
                    this._trailModule._detachFromScene();
                }
                this._needAttach = false;
            }
        } else if (!this._processor.getModel()?.scene) {
            this._needAttach = true;
        }
        // because we use index buffer, per particle index count = 6.
        this._model!.updateIA(this._particles.count);
        const subModels = this._trailModel && this._trailModel.subModels;
        if (subModels && subModels.length > 0) {
            const subModel = subModels[0];
            subModel.inputAssembler.vertexBuffers[0].update(this._vbF32!);
            subModel.inputAssembler.indexBuffer!.update(this._iBuffer!);
            this._iaInfo.drawInfos[0].firstIndex = 0;
            this._iaInfo.drawInfos[0].indexCount = count;
            this._iaInfoBuffer!.update(this._iaInfo);
        }
    }

    private _fillVertexBuffer (trailSeg: ITrailElement, colorModifer: Color, indexOffset: number,
        xTexCoord: number, trailEleIdx: number, indexSet: number) {
        this._vbF32![this.vbOffset++] = trailSeg.position.x;
        this._vbF32![this.vbOffset++] = trailSeg.position.y;
        this._vbF32![this.vbOffset++] = trailSeg.position.z;
        this._vbF32![this.vbOffset++] = trailSeg.direction;
        this._vbF32![this.vbOffset++] = trailSeg.width;
        this._vbF32![this.vbOffset++] = xTexCoord;
        this._vbF32![this.vbOffset++] = 0;
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];  // <wireframe debug>
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
        // _bcIdx %= 9;
        this._vbF32![this.vbOffset++] = trailSeg.velocity.x;
        this._vbF32![this.vbOffset++] = trailSeg.velocity.y;
        this._vbF32![this.vbOffset++] = trailSeg.velocity.z;
        _temp_color.set(trailSeg.color);
        _temp_color.multiply(colorModifer);
        this._vbUint32![this.vbOffset++] = _temp_color._val;
        this._vbF32![this.vbOffset++] = trailSeg.position.x;
        this._vbF32![this.vbOffset++] = trailSeg.position.y;
        this._vbF32![this.vbOffset++] = trailSeg.position.z;
        this._vbF32![this.vbOffset++] = 1 - trailSeg.direction;
        this._vbF32![this.vbOffset++] = trailSeg.width;
        this._vbF32![this.vbOffset++] = xTexCoord;
        this._vbF32![this.vbOffset++] = 1;
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];  // <wireframe debug>
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
        // _bcIdx %= 9;
        this._vbF32![this.vbOffset++] = trailSeg.velocity.x;
        this._vbF32![this.vbOffset++] = trailSeg.velocity.y;
        this._vbF32![this.vbOffset++] = trailSeg.velocity.z;
        this._vbUint32![this.vbOffset++] = _temp_color._val;
        if (indexSet & PRE_TRIANGLE_INDEX) {
            this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx;
            this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx - 1;
            this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
        }
        if (indexSet & NEXT_TRIANGLE_INDEX) {
            this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx;
            this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
            this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx + 2;
        }
    }

    public updateTrailRenderData () {
        this.vbOffset = 0;
        this.ibOffset = 0;
        for (const p of this._particleTrail.keys()) {
            const trailSeg = this._particleTrail.get(p)!;
            if (trailSeg.start === -1) {
                continue;
            }
            const indexOffset = this.vbOffset * 4 / this._vertSize;
            const end = trailSeg.start >= trailSeg.end ? trailSeg.end + trailSeg.trailElements.length : trailSeg.end;
            const trailNum = end - trailSeg.start;
            // const lastSegRatio = vec3.distance(trailSeg.getTailElement()!.position, p.position) / this._minParticleDistance;
            const textCoordSeg = 1 / (trailNum /* - 1 + lastSegRatio */);
            const startSegEle = trailSeg.trailElements[trailSeg.start];
            this._fillVertexBuffer(startSegEle, this.colorOverTrail.evaluate(1, 1), indexOffset, 1, 0, NEXT_TRIANGLE_INDEX);
            for (let i = trailSeg.start + 1; i < end; i++) {
                const segEle = trailSeg.trailElements[i % trailSeg.trailElements.length];
                const j = i - trailSeg.start;
                this._fillVertexBuffer(segEle, this.colorOverTrail.evaluate(1 - j / trailNum, 1),
                    indexOffset, 1 - j * textCoordSeg, j, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);
            }
            if (this._needTransform) {
                Vec3.transformMat4(_temp_trailEle.position, p.position, _temp_xform);
            } else {
                Vec3.copy(_temp_trailEle.position, p.position);
            }

            // refresh particle node position to update emit position
            const trailModel = this._trailModel;
            if (trailModel) {
                trailModel.node.invalidateChildren(TransformBit.POSITION);
            }

            if (trailNum === 1 || trailNum === 2) {
                const lastSecondTrail = trailSeg.getElement(trailSeg.end - 1)!;
                Vec3.subtract(lastSecondTrail.velocity, _temp_trailEle.position, lastSecondTrail.position);
                this._vbF32![this.vbOffset - this._vertSize / 4 - 4] = lastSecondTrail.velocity.x;
                this._vbF32![this.vbOffset - this._vertSize / 4 - 3] = lastSecondTrail.velocity.y;
                this._vbF32![this.vbOffset - this._vertSize / 4 - 2] = lastSecondTrail.velocity.z;
                this._vbF32![this.vbOffset - 4] = lastSecondTrail.velocity.x;
                this._vbF32![this.vbOffset - 3] = lastSecondTrail.velocity.y;
                this._vbF32![this.vbOffset - 2] = lastSecondTrail.velocity.z;
                Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, lastSecondTrail.position);
                this._checkDirectionReverse(_temp_trailEle, lastSecondTrail);
            } else if (trailNum > 2) {
                const lastSecondTrail = trailSeg.getElement(trailSeg.end - 1)!;
                const lastThirdTrail = trailSeg.getElement(trailSeg.end - 2)!;
                Vec3.subtract(_temp_vec3, lastThirdTrail.position, lastSecondTrail.position);
                Vec3.subtract(_temp_vec3_1, _temp_trailEle.position, lastSecondTrail.position);
                Vec3.normalize(_temp_vec3, _temp_vec3);
                Vec3.normalize(_temp_vec3_1, _temp_vec3_1);
                Vec3.subtract(lastSecondTrail.velocity, _temp_vec3_1, _temp_vec3);
                Vec3.normalize(lastSecondTrail.velocity, lastSecondTrail.velocity);
                this._checkDirectionReverse(lastSecondTrail, lastThirdTrail);
                // refresh last trail segment data
                this.vbOffset -= this._vertSize / 4 * 2;
                this.ibOffset -= 6;
                // _bcIdx = (_bcIdx - 6 + 9) % 9;  // <wireframe debug>
                this._fillVertexBuffer(lastSecondTrail, this.colorOverTrail.evaluate(textCoordSeg, 1), indexOffset,
                    textCoordSeg, trailNum - 1, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);
                Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, lastSecondTrail.position);
                Vec3.normalize(_temp_trailEle.velocity, _temp_trailEle.velocity);
                this._checkDirectionReverse(_temp_trailEle, lastSecondTrail);
            }
            if (this.widthFromParticle) {
                _temp_trailEle.width = p.size.x * this.widthRatio.evaluate(0, 1)!;
            } else {
                _temp_trailEle.width = this.widthRatio.evaluate(0, 1)!;
            }
            _temp_trailEle.color = p.color;

            if (Vec3.equals(_temp_trailEle.velocity, Vec3.ZERO)) {
                this.ibOffset -= 3;
            } else {
                this._fillVertexBuffer(_temp_trailEle, this.colorOverTrail.evaluate(0, 1), indexOffset, 0, trailNum, PRE_TRIANGLE_INDEX);
            }
        }
        if (this._trailModel) {
            this._trailModel.enabled = this.ibOffset > 0;
        }
    }

    private _fillStretchedData (p: Particle, idx: number, fi: number) {
        if (!this._useInstance) {
            for (let j = 0; j < 4; ++j) { // four verts per particle.
                this._attrs[0] = p.position;
                _tempAttribUV.x = _uvs[2 * j];
                _tempAttribUV.y = _uvs[2 * j + 1];
                _tempAttribUV.z = fi;
                this._attrs[1] = _tempAttribUV;
                this._attrs[2] = p.size;
                this._attrs[3] = p.rotation;
                this._attrs[4] = p.color._val;
                this._attrs[5] = p.ultimateVelocity;
                this._attrs[6] = null;
                this._model!.addParticleVertexData(idx++, this._attrs);
            }
        } else {
            this._fillStrecthedDataIns(p, idx, fi);
        }
    }

    private _fillStrecthedDataIns (p: Particle, idx: number, fi: number) {
        const i = idx / 4;
        this._attrs[0] = p.position;
        _tempAttribUV.z = fi;
        this._attrs[1] = _tempAttribUV;
        this._attrs[2] = p.size;
        this._attrs[3] = p.rotation;
        this._attrs[4] = p.color._val;
        this._attrs[5] = p.ultimateVelocity;
        this._model!.addParticleVertexData(i, this._attrs);
    }

    private _fillNormalData (p: Particle, idx: number, fi: number) {
        if (!this._useInstance) {
            for (let j = 0; j < 4; ++j) { // four verts per particle.
                this._attrs[0] = p.position;
                _tempAttribUV.x = _uvs[2 * j];
                _tempAttribUV.y = _uvs[2 * j + 1];
                _tempAttribUV.z = fi;
                this._attrs[1] = _tempAttribUV;
                this._attrs[2] = p.size;
                this._attrs[3] = p.rotation;
                this._attrs[4] = p.color._val;
                this._attrs[5] = null;
                this._model!.addParticleVertexData(idx++, this._attrs);
            }
        } else {
            this._fillNormalDataIns(p, idx, fi);
        }
    }

    private _fillNormalDataIns (p: Particle, idx: number, fi: number) {
        const i = idx / 4;
        this._attrs[0] = p.position;
        _tempAttribUV.z = fi;
        this._attrs[1] = _tempAttribUV;
        this._attrs[2] = p.size;
        this._attrs[3] = p.rotation;
        this._attrs[4] = p.color._val;
        this._attrs[5] = null;
        this._model!.addParticleVertexData(i, this._attrs);
    }

    public updateTrailMaterial () {
        if (!this._particleSystem) {
            return;
        }
        const ps = this._particleSystem;
        const trailModule = ps._trailModule;
        if (trailModule && trailModule.enable) {
            if (ps.simulationSpace === Space.WORLD || trailModule.space === Space.WORLD) {
                this._trailDefines[CC_USE_WORLD_SPACE] = true;
            } else {
                this._trailDefines[CC_USE_WORLD_SPACE] = false;
            }
            let mat = ps.getMaterialInstance(1);
            if (mat === null && this._defaultTrailMat === null) {
                this._defaultTrailMat = new MaterialInstance({
                    parent: builtinResMgr.get<Material>('default-trail-material'),
                    owner: this,
                    subModelIdx: 1,
                });
            }
            mat = mat || this._defaultTrailMat;
            mat.recompileShaders(this._trailDefines);
            const trailMaterial = this.getMaterialInstance(1) || this._defaultTrailMat;
            if (this._trailModel) {
                this._trailModel.setSubModelMaterial(0, trailMaterial);
            }
        }
    }

    public setUseInstance (value: boolean) {
        if (this._useInstance === value) {
            return;
        }
        this._useInstance = value;
        if (this._model) {
            this._model.useInstance = value;
            this._model.doDestroy();
        }
        this.updateRenderMode();
    }

    public onMaterialModified (index: number, material: Material) {
        if (!this._inited) {
            return;
        }

        if (index === 0) {
            this.updateMaterialParams();
        } else {
            this.updateTrailMaterial();
        }
    }

    public _onMaterialModified (index: number, material: Material) {
        if (this._processor !== null) {
            this._processor.onMaterialModified(index, material);
        }
    }

    public _onRebuildPSO (index: number, material: Material) {
        if (this._model && index === 0) {
            this._model.setSubModelMaterial(0, material);
        }
        if (this._trailModel && index === 1) {
            this._trailModel.setSubModelMaterial(0, material);
        }
    }

    public updateRotation (pass: Pass | null) {
        if (pass) {
            this.doUpdateRotation(pass);
        }
    }

    public updateVertexAttrib () {
        if (this.renderMode !== RenderMode.Mesh) {
            return;
        }
        if (this.mesh) {
            const format = this.mesh.readAttributeFormat(0, AttributeName.ATTR_COLOR);
            if (format) {
                let type = Format.RGBA8;
                for (let i = 0; i < FormatInfos.length; ++i) {
                    if (FormatInfos[i].name === format.name) {
                        type = i;
                        break;
                    }
                }
                this._vertAttrs[7] = new Attribute(AttributeName.ATTR_COLOR1, type, true, !this._useInstance ? 0 : 1);
            } else { // mesh without vertex color
                const type = Format.RGBA8;
                this._vertAttrs[7] = new Attribute(AttributeName.ATTR_COLOR1, type, true, !this._useInstance ? 0 : 1);
            }
        }
    }

    private _setVertexAttrib () {
        if (!this._useInstance) {
            switch (this._renderInfo!.renderMode) {
            case RenderMode.StrecthedBillboard:
                this._vertAttrs = _vertex_attrs_stretch.slice();
                break;
            case RenderMode.Mesh:
                this._vertAttrs = _vertex_attrs_mesh.slice();
                break;
            default:
                this._vertAttrs = _vertex_attrs.slice();
            }
        } else {
            this._setVertexAttribIns();
        }
    }

    private _setVertexAttribIns () {
        switch (this._renderInfo!.renderMode) {
        case RenderMode.STRETCHED_BILLBOARD:
            this._vertAttrs = _vertex_attrs_stretch_ins.slice();
            break;
        case RenderMode.MESH:
            this._vertAttrs = _vertex_attrs_mesh_ins.slice();
            break;
        default:
            this._vertAttrs = _vertex_attrs_ins.slice();
        }
    }

    private rebuild () {
        const device: Device = director.root!.device;
        const vertexBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._vertSize * (this._trailNum + 1) * 2,
            this._vertSize,
        ));
        const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertSize * (this._trailNum + 1) * 2);
        this._vbF32 = new Float32Array(vBuffer);
        this._vbUint32 = new Uint32Array(vBuffer);
        vertexBuffer.update(vBuffer);

        const indexBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            Math.max(1, this._trailNum) * 6 * Uint16Array.BYTES_PER_ELEMENT,
            Uint16Array.BYTES_PER_ELEMENT,
        ));
        this._iBuffer = new Uint16Array(Math.max(1, this._trailNum) * 6);
        indexBuffer.update(this._iBuffer);

        this._iaInfoBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDIRECT,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            DRAW_INFO_SIZE,
            DRAW_INFO_SIZE,
        ));
        this._iaInfo.drawInfos[0].vertexCount = (this._trailNum + 1) * 2;
        this._iaInfo.drawInfos[0].indexCount = this._trailNum * 6;
        this._iaInfoBuffer.update(this._iaInfo);

        this._subMeshData = new RenderingSubMesh([vertexBuffer], this._vertAttrs, PrimitiveMode.TRIANGLE_LIST, indexBuffer, this._iaInfoBuffer);

        const trailModel = this._trailModel;
        if (trailModel && this._material) {
            trailModel.node = trailModel.transform = this.node;
            trailModel.visFlags = this.node.layer;
            trailModel.initSubModel(0, this._subMeshData, this._material);
            trailModel.enabled = true;
        }
    }

    private doUpdateRotation (pass) {
        const mode = this.renderMode;
        if (mode !== RenderMode.Mesh && this._alignSpace === AlignmentSpace.View) {
            return;
        }
        const rotation = new Quat();
        if (this._alignSpace === AlignmentSpace.LOCAL) {
            this.node.getRotation(rotation);
        } else if (this._alignSpace === AlignmentSpace.WORLD) {
            this.node.getWorldRotation(rotation);
        } else if (this._alignSpace === AlignmentSpace.VIEW) {
            // Quat.fromEuler(_node_rot, 0.0, 0.0, 0.0);
            rotation.set(0.0, 0.0, 0.0, 1.0);
            const cameraLst: Camera[]| undefined = this.node.scene.renderScene?.cameras;
            if (cameraLst !== undefined) {
                for (let i = 0; i < cameraLst?.length; ++i) {
                    const camera:Camera = cameraLst[i];
                    // eslint-disable-next-line max-len
                    const checkCamera: boolean = (!EDITOR || legacyCC.GAME_VIEW) ? (camera.visibility & this.node.layer) === this.node.layer : camera.name === 'Editor Camera';
                    if (checkCamera) {
                        Quat.fromViewUp(rotation, camera.forward);
                        break;
                    }
                }
            }
        } else {
            rotation.set(0.0, 0.0, 0.0, 1.0);
        }
        pass.setUniform(this._uNodeRotHandle, rotation);
    }

    public updateScale (pass: Pass | null) {
        if (pass) {
            this.doUpdateScale(pass);
        }
    }

    private doUpdateScale (pass) {
        switch (this._particleSystem.scaleSpace) {
        case Space.LOCAL:
            this._node_scale.set(this.node.scale.x, this.node.scale.y, this.node.scale.z);
            break;
        case Space.WORLD:
            this._node_scale.set(this.node.worldScale.x, this.node.worldScale.y, this.node.worldScale.z);
            break;
        default:
            break;
        }
        pass.setUniform(this._uScaleHandle, this._node_scale);
    }
}
