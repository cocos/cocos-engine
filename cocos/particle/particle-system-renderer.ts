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
import { Mesh } from '../3d';
import { Material, Texture2D } from '../core/assets';
import { AlignmentSpace, RenderMode, Space } from './enum';
import { Attribute, AttributeName, Device, deviceManager, Feature, Format, FormatFeatureBit, FormatInfos } from '../core/gfx';
import { legacyCC } from '../core/global-exports';
import { errorID, Mat4, ModelRenderer, Vec2, Vec4, warnID } from '../core';
import { MacroRecord, scene } from '../core/renderer';
import ParticleBatchModel from './models/particle-batch-model';

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
export default class ParticleSystemRenderer extends ModelRenderer {
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
        if (this._renderMode === val) {
            return;
        }
        this._renderMode = val;
        if (this._particleSystem) {
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
        if (this._particleSystem) {
            this._particleSystem.processor.setVertexAttributes();
        }
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
        if (!this._particleSystem) {
            return null;
        }
        return this._particleSystem.getMaterial(0) as Material;
    }

    public set particleMaterial (val: Material | null) {
        if (this._particleSystem) {
            this._particleSystem.setMaterial(val, 0);
        }
    }

    /**
     * @en particle cpu material
     * @zh 粒子使用的cpu材质。
     */
    @type(Material)
    @displayOrder(8)
    @disallowAnimation
    @visible(function (this: ParticleSystemRenderer): boolean { return !this._useGPU; })
    public get cpuMaterial () {
        return this._cpuMaterial;
    }

    public set cpuMaterial (val: Material | null) {
        if (val === null) {
            return;
        } else {
            const effectName = val.effectName;
            if (effectName.indexOf('particle') === -1 || effectName.indexOf('particle-gpu') !== -1) {
                warnID(6035);
                return;
            }
        }
        this._cpuMaterial = val;
        this.particleMaterial = this._cpuMaterial;
    }

    @serializable
    private _cpuMaterial: Material | null = null;

    /**
     * @en particle gpu material
     * @zh 粒子使用的gpu材质。
     */
    @type(Material)
    @displayOrder(8)
    @disallowAnimation
    @visible(function (this: ParticleSystemRenderer): boolean { return this._useGPU; })
    public get gpuMaterial () {
        return this._gpuMaterial;
    }

    public set gpuMaterial (val: Material | null) {
        if (val === null) {
            return;
        } else {
            const effectName = val.effectName;
            if (effectName.indexOf('particle-gpu') === -1) {
                warnID(6035);
                return;
            }
        }
        this._gpuMaterial = val;
        this.particleMaterial = this._gpuMaterial;
    }

    @serializable
    private _gpuMaterial: Material | null = null;

    /**
     * @en particle trail material
     * @zh 拖尾使用的材质。
     */
    @type(Material)
    @displayOrder(9)
    @disallowAnimation
    @visible(function (this: ParticleSystemRenderer): boolean { return !this._useGPU; })
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
        this._models.push((this._processor as any)._model);
        if (this._trailModule && this._trailModule.enable && (this._trailModule as any)._trailModel) {
            this._models.push((this._trailModule as any)._trailModel);
        }
        return this._models;
    }

    public get mainTexture () {
        return this._mainTexture;
    }

    public set mainTexture (val) {
        this._mainTexture = val;
    }

    @displayOrder(10)
    @tooltip('i18n:particleSystemRenderer.useGPU')
    public get useGPU () {
        return this._useGPU;
    }

    public set useGPU (val) {
        this._useGPU = val;
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
        this._particleSystem.processor.updateAlignSpace(this._alignSpace);
    }

    public static AlignmentSpace = AlignmentSpace;

    @serializable
    private _alignSpace = AlignmentSpace.View;
    @serializable
    private _useGPU = false;
    @serializable
    private _mainTexture: Texture2D | null = null;
    protected _model: ParticleBatchModel | null = null;
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
    }

    public onEnable () {
        if (!this._particleSystem) {
            return;
        }
        this.attachToScene();
        const model = this._model;
        if (model) {
            model.node = model.transform = this._particleSystem.node;
        }
    }

    public onDisable () {
        this.detachFromScene();
    }

    public onDestroy () {
        if (this._model) {
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
        }
    }

    public attachToScene () {
        if (this._model) {
            if (this._model.scene) {
                this.detachFromScene();
            }
            this._particleSystem._getRenderScene().addModel(this._model);
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

    protected _initModel () {
        if (!this._model) {
            this._model = legacyCC.director.root.createModel(ParticleBatchModel);
            this._model!.setCapacity(this._particleSystem.capacity);
            this._model!.visFlags = this._particleSystem.visibility;
        }
    }

    // internal function
    public updateRenderData () {
        // update vertex buffer
        let idx = 0;
        if (this.renderMode === RenderMode.Mesh) {
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
        } else if (this.renderMode === RenderMode.StrecthedBillboard) {
            for (let i = 0; i < this._particleSystem._particles.count; ++i) {
                const p = this._particles.data[i];
                let fi = 0;
                const textureModule = this._particleSystem._textureAnimationModule;
                if (textureModule && textureModule.enable) {
                    fi = p.frameIndex;
                }
                idx = i * 4;
                this._fillStrecthedData(p, idx, fi);
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
    }

    public updateMaterialParams () {
        if (!this._particleSystem) {
            return;
        }

        const ps = this._particleSystem;
        const shareMaterial = ps.sharedMaterial;
        if (shareMaterial != null) {
            const effectName = shareMaterial._effectAsset._name;
            this._renderInfo!.mainTexture = shareMaterial.getProperty('mainTexture', 0);
        }

        if (ps.sharedMaterial == null && this._defaultMat == null) {
            _matInsInfo.parent = builtinResMgr.get<Material>('default-particle-material');
            _matInsInfo.owner = this._particleSystem;
            _matInsInfo.subModelIdx = 0;
            this._defaultMat = new MaterialInstance(_matInsInfo);
            _matInsInfo.parent = null!;
            _matInsInfo.owner = null!;
            _matInsInfo.subModelIdx = 0;
            if (this._renderInfo!.mainTexture !== null) {
                this._defaultMat.setProperty('mainTexture', this._renderInfo!.mainTexture);
            }
        }
        const mat: Material = ps.getMaterialInstance(0) || this._defaultMat;
        if (ps._simulationSpace === Space.World) {
            this._defines[CC_USE_WORLD_SPACE] = true;
        } else {
            this._defines[CC_USE_WORLD_SPACE] = false;
        }

        const pass = mat.passes[0];
        this._uScaleHandle = pass.getHandle('scale');
        this._uLenHandle = pass.getHandle('frameTile_velLenScale');
        this._uNodeRotHandle = pass.getHandle('nodeRotation');

        const renderMode = this.renderMode;
        const vlenScale = this._frameTile_velLenScale;
        if (renderMode === RenderMode.Billboard) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_BILLBOARD;
        } else if (renderMode === RenderMode.StrecthedBillboard) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_STRETCHED_BILLBOARD;
            vlenScale.z = this.velocityScale;
            vlenScale.w = this.lengthScale;
        } else if (renderMode === RenderMode.HorizontalBillboard) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_HORIZONTAL_BILLBOARD;
        } else if (renderMode === RenderMode.VerticalBillboard) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_VERTICAL_BILLBOARD;
        } else if (renderMode === RenderMode.Mesh) {
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

    private _fillStrecthedData (p: Particle, idx: number, fi: number) {
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
            if (ps.simulationSpace === Space.World || trailModule.space === Space.World) {
                this._trailDefines[CC_USE_WORLD_SPACE] = true;
            } else {
                this._trailDefines[CC_USE_WORLD_SPACE] = false;
            }
            let mat = ps.getMaterialInstance(1);
            if (mat === null && this._defaultTrailMat === null) {
                _matInsInfo.parent = builtinResMgr.get<Material>('default-trail-material');
                _matInsInfo.owner = this._particleSystem;
                _matInsInfo.subModelIdx = 1;
                this._defaultTrailMat = new MaterialInstance(_matInsInfo);
                _matInsInfo.parent = null!;
                _matInsInfo.owner = null!;
                _matInsInfo.subModelIdx = 0;
            }
            mat = mat || this._defaultTrailMat;
            mat.recompileShaders(this._trailDefines);
            trailModule.updateMaterial();
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

    onInit (ps) {
        this.create(ps);
        this.cpuMaterial = this.particleMaterial;
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

    public onRebuildPSO (index: number, material: Material) {
        if (this._model && index === 0) {
            this._model.setSubModelMaterial(0, material);
        }
        const trailModule = this._particleSystem._trailModule;
        if (trailModule && trailModule._trailModel && index === 1) {
            trailModule._trailModel.setSubModelMaterial(0, material);
        }
    }

    public _onMaterialModified (index: number, material: Material) {
        if (this._processor !== null) {
            this._processor.onMaterialModified(index, material);
        }
    }

    public _onRebuildPSO (index: number, material: Material) {
        this._processor.onRebuildPSO(index, material);
    }

    public updateRotation (pass: Pass | null) {
        if (pass) {
            this.doUpdateRotation(pass);
        }
    }

    protected _attachToScene () {
        this._processor.attachToScene();
        if (this._trailModule && this._trailModule.enable) {
            this._trailModule._attachToScene();
        }
    }

    protected _detachFromScene () {
        this._processor.detachFromScene();
        if (this._trailModule && this._trailModule.enable) {
            this._trailModule._detachFromScene();
        }
        if (this._boundingBox) {
            this._boundingBox = null;
        }
        if (this._culler) {
            this._culler.clear();
            this._culler.destroy();
            this._culler = null;
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
        case RenderMode.StrecthedBillboard:
            this._vertAttrs = _vertex_attrs_stretch_ins.slice();
            break;
        case RenderMode.Mesh:
            this._vertAttrs = _vertex_attrs_mesh_ins.slice();
            break;
        default:
            this._vertAttrs = _vertex_attrs_ins.slice();
        }
    }

    private doUpdateRotation (pass) {
        const mode = this.renderMode;
        if (mode !== RenderMode.Mesh && this._alignSpace === AlignmentSpace.View) {
            return;
        }

        if (this._alignSpace === AlignmentSpace.Local) {
            this._particleSystem.node.getRotation(_node_rot);
        } else if (this._alignSpace === AlignmentSpace.World) {
            this._particleSystem.node.getWorldRotation(_node_rot);
        } else if (this._alignSpace === AlignmentSpace.View) {
            // Quat.fromEuler(_node_rot, 0.0, 0.0, 0.0);
            _node_rot.set(0.0, 0.0, 0.0, 1.0);
            const cameraLst: Camera[]|undefined = this._particleSystem.node.scene.renderScene?.cameras;
            if (cameraLst !== undefined) {
                for (let i = 0; i < cameraLst?.length; ++i) {
                    const camera:Camera = cameraLst[i];
                    // eslint-disable-next-line max-len
                    const checkCamera: boolean = (!EDITOR || legacyCC.GAME_VIEW) ? (camera.visibility & this._particleSystem.node.layer) === this._particleSystem.node.layer : camera.name === 'Editor Camera';
                    if (checkCamera) {
                        Quat.fromViewUp(_node_rot, camera.forward);
                        break;
                    }
                }
            }
        } else {
            _node_rot.set(0.0, 0.0, 0.0, 1.0);
        }
        pass.setUniform(this._uNodeRotHandle, _node_rot);
    }

    public updateScale (pass: Pass | null) {
        if (pass) {
            this.doUpdateScale(pass);
        }
    }

    private doUpdateScale (pass) {
        switch (this._particleSystem.scaleSpace) {
        case Space.Local:
            this._particleSystem.node.getScale(this._node_scale);
            break;
        case Space.World:
            this._particleSystem.node.getWorldScale(this._node_scale);
            break;
        default:
            break;
        }
        pass.setUniform(this._uScaleHandle, this._node_scale);
    }
}
