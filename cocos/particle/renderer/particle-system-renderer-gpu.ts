import { builtinResMgr } from '../../core/3d/builtin';
import { Material } from '../../core/assets';
import { Texture2D } from '../../core';
import { Component } from '../../core/components';
import { GFXAttributeName, GFXFormat } from '../../core/gfx/define';
import { IGFXAttribute } from '../../core/gfx/input-assembler';
import { Mat4, Vec2, Vec4, Quat} from '../../core/math';
import { MaterialInstance, IMaterialInstanceInfo } from '../../core/renderer/core/material-instance';
import { IDefineMap } from '../../core/renderer/core/pass-utils';
import { RenderMode, Space } from '../enum';
import { Particle, IParticleModule } from '../particle';
import { packGradientRange } from '../animator/gradient-range';
import { Pass } from '../../core/renderer';
import { packCurveRangeXYZ, packCurveRangeZ, packCurveRangeXYZW, packCurveRangeN, packCurveRangeXY } from '../animator/curve-range';
import { ParticleSystemRendererBase } from './particle-system-renderer-base';
import { EDITOR } from 'internal:constants';

const _tempWorldTrans = new Mat4();
const _tempVec4 = new Vec4();
const _world_rot = new Quat();

const _sample_num = 32;
const _sample_interval = 1.0 / _sample_num;

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';

const CC_RENDER_MODE = 'CC_RENDER_MODE';
const RENDER_MODE_BILLBOARD = 0;
const RENDER_MODE_STRETCHED_BILLBOARD = 1;
const RENDER_MODE_HORIZONTAL_BILLBOARD = 2;
const RENDER_MODE_VERTICAL_BILLBOARD = 3;
const RENDER_MODE_MESH = 4;

const COLOR_OVER_TIME_MODULE_ENABLE = 'COLOR_OVER_TIME_MODULE_ENABLE';
const ROTATION_OVER_TIME_MODULE_ENABLE = 'ROTATION_OVER_TIME_MODULE_ENABLE';
const SIZE_OVER_TIME_MODULE_ENABLE = 'SIZE_OVER_TIME_MODULE_ENABLE';
const VELOCITY_OVER_TIME_MODULE_ENABLE = 'VELOCITY_OVER_TIME_MODULE_ENABLE';
const FORCE_OVER_TIME_MODULE_ENABLE = 'FORCE_OVER_TIME_MODULE_ENABLE';
const TEXTURE_ANIMATION_MODULE_ENABLE = 'TEXTURE_ANIMATION_MODULE_ENABLE';

const _vert_attr_name = {
    POSITION_STARTTIME: 'a_position_starttime',
    VERT_SIZE_UV: 'a_size_uv',
    VERT_ROTATION_UV: 'a_rotation_uv',
    COLOR: 'a_color',
    DIR_LIFE: 'a_dir_life',
    RANDOM_SEED: 'a_rndSeed'
  };

const _gpu_vert_attr = [
    { name: _vert_attr_name.POSITION_STARTTIME, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.VERT_SIZE_UV, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.VERT_ROTATION_UV, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.COLOR, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.DIR_LIFE, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.RANDOM_SEED, format: GFXFormat.R32F}
];

const _gpu_vert_attr_mesh = [
    { name: _vert_attr_name.POSITION_STARTTIME, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.VERT_SIZE_UV, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.VERT_ROTATION_UV, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.COLOR, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.DIR_LIFE, format: GFXFormat.RGBA32F},
    { name: _vert_attr_name.RANDOM_SEED, format: GFXFormat.R32F},
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGB32F },                    // uv,frame idx
    { name: GFXAttributeName.ATTR_TEX_COORD3, format: GFXFormat.RGB32F },                   // mesh position
    { name: GFXAttributeName.ATTR_NORMAL, format: GFXFormat.RGB32F },                       // mesh normal
    { name: GFXAttributeName.ATTR_COLOR1, format: GFXFormat.RGBA8, isNormalized: true },    // mesh color
];

const _matInsInfo: IMaterialInstanceInfo = {
    parent: null!,
    owner: null!,
    subModelIdx: 0,
};

export default class ParticleSystemRendererGPU extends ParticleSystemRendererBase {
    private _defines: IDefineMap;
    private _frameTile_velLenScale: Vec4;
    private _node_scale: Vec4;
    protected _vertAttrs: IGFXAttribute[] = [];
    protected _defaultMat: Material | null = null;
    private _particleNum: number = 0;
    private _tempParticle: any = null;
    private _colorTexture: Texture2D | null = null;
    private _forceTexture: Texture2D | null = null;
    private _velocityTexture: Texture2D | null = null;
    private _rotationTexture: Texture2D | null = null;
    private _sizeTexture: Texture2D | null = null;
    private _animTexture: Texture2D | null = null;
    private _uTimeHandle: number = 0;
    private _uRotHandle: number = 0;

    constructor (info: any) {
        super(info);

        this._frameTile_velLenScale = new Vec4(1, 1, 0, 0);
        this._node_scale = new Vec4();
        this._defines = {
            CC_USE_WORLD_SPACE: true,
            CC_USE_BILLBOARD: true,
            CC_USE_STRETCHED_BILLBOARD: false,
            CC_USE_HORIZONTAL_BILLBOARD: false,
            CC_USE_VERTICAL_BILLBOARD: false,
            COLOR_OVER_TIME_MODULE_ENABLE: false,
        };

        this._tempParticle = new Particle(null);
        this._particleNum = 0;
    }

    public onInit (ps: Component) {
        super.onInit(ps);
        this._setVertexAttrib();
        this._updateModel();
        this._model!.constructAttributeIndex();
        this.updateMaterialParams();
    }

    public updateRenderMode () {
        this._setVertexAttrib();
        this._updateModel();
        this.updateMaterialParams();
    }

    public clear () {
        this._particleNum = 0;
        this.updateRenderData();
    }

    public onDestroy () {
        super.onDestroy();
        this._forceTexture && this._forceTexture.destroy();
        this._velocityTexture && this._velocityTexture.destroy();
        this._colorTexture && this._colorTexture.destroy();
        this._sizeTexture && this._sizeTexture.destroy();
        this._rotationTexture && this._rotationTexture.destroy();
        this._animTexture && this._animTexture.destroy();
    }

    public enableModule (name: string, val: Boolean, pm: IParticleModule) {
        const mat: Material | null = this._particleSystem.getMaterialInstance(0) || this._defaultMat;
        if (!mat) {
            return;
        }
        this.initShaderUniform(mat);
        mat.recompileShaders(this._defines);
        if (this._model) {
            this._model.setSubModelMaterial(0, mat);
        }
    }

    public getFreeParticle (): Particle | null {
        if (this._particleNum >= this._particleSystem._capacity) {
            return null;
        }

        return this._tempParticle;
    }

    public setNewParticle (p: Particle) {
        this._model!.addGPUParticleVertexData(p, this._particleNum, this._particleSystem._time);
        this._particleNum++;
    }

    public updateParticles (dt: number) {
        if (EDITOR) {
            const mat: Material | null = this._particleSystem.getMaterialInstance(0) || this._defaultMat;

            this._particleSystem.node.getWorldMatrix(_tempWorldTrans);
            switch (this._particleSystem.scaleSpace) {
                case Space.Local:
                    this._particleSystem.node.getScale(this._node_scale);
                    break;
                case Space.World:
                    this._particleSystem.node.getWorldScale(this._node_scale);
                    break;
            }

            this.initShaderUniform(mat!);
        }
        this._particleNum = this._model!.updateGPUParticles(this._particleNum, this._particleSystem._time, dt);
        this.updateShaderUniform(dt);
        return this._particleNum;
    }

    // internal function
    public updateRenderData () {
        // update vertex buffer
        this._model!.updateIA(this._particleNum);
    }

    public updateShaderUniform (dt: number) {
        const mat: Material | null = this._particleSystem.getMaterialInstance(0) || this._defaultMat;
        if (!mat) {
            return;
        }

        const pass = mat.passes[0];
        _tempVec4.x = this._particleSystem._time;
        _tempVec4.y = dt;
        pass.setUniform(this._uTimeHandle, _tempVec4);

        this._particleSystem.node.getWorldRotation(_world_rot);
        pass.setUniform(this._uRotHandle, _world_rot);
    }

    public initShaderUniform (mat: Material) {
        const pass = mat.passes[0];

        this._uTimeHandle = pass.getHandle('u_timeDelta')!;
        this._uRotHandle = pass.getHandle('u_worldRot')!;

        pass.setUniform(pass.getHandle('scale')!, this._node_scale);
        pass.setUniform(pass.getHandle('frameTile_velLenScale')!, this._frameTile_velLenScale);
        _tempVec4.x = _sample_num;
        _tempVec4.y = _sample_interval;
        pass.setUniform(pass.getHandle('u_sampleInfo')!, _tempVec4);

        let enable = false;
        // force
        const forceModule = this._particleSystem._forceOvertimeModule;
        enable = forceModule && forceModule.enable;
        this._defines[FORCE_OVER_TIME_MODULE_ENABLE] = enable;
        if (enable) {
            this._forceTexture && this._forceTexture.destroy();
            this._forceTexture = packCurveRangeXYZ(_sample_num, forceModule.x, forceModule.y, forceModule.z);
            const handle = pass.getHandle('force_over_time_tex0');
            const binding = Pass.getBindingFromHandle(handle!);
            pass.bindSampler(binding, this._forceTexture.getGFXSampler()!);
            pass.bindTextureView(binding, this._forceTexture.getGFXTextureView()!);
            const spaceHandle = pass.getHandle('u_force_space');
            pass.setUniform(spaceHandle!, forceModule.space);
            const modeHandle = pass.getHandle('u_force_mode');
            pass.setUniform(modeHandle!, this._forceTexture.height);
        }

        // velocity
        const velocityModule = this._particleSystem._velocityOvertimeModule;
        enable = velocityModule && velocityModule.enable;
        this._defines[VELOCITY_OVER_TIME_MODULE_ENABLE] = enable;
        if (enable) {
            this._velocityTexture && this._velocityTexture.destroy();
            this._velocityTexture = packCurveRangeXYZW(_sample_num, velocityModule.x, velocityModule.y, velocityModule.z, velocityModule.speedModifier);
            const handle = pass.getHandle('velocity_over_time_tex0');
            const binding = Pass.getBindingFromHandle(handle!);
            pass.bindSampler(binding, this._velocityTexture.getGFXSampler()!);
            pass.bindTextureView(binding, this._velocityTexture.getGFXTextureView()!);
            const spaceHandle = pass.getHandle('u_velocity_space');
            pass.setUniform(spaceHandle!, velocityModule.space);
            const modeHandle = pass.getHandle('u_velocity_mode');
            pass.setUniform(modeHandle!, this._velocityTexture.height);
        }

        // color module
        const colorModule = this._particleSystem._colorOverLifetimeModule;
        enable = colorModule && colorModule.enable;
        this._defines[COLOR_OVER_TIME_MODULE_ENABLE] = enable;
        if (enable) {
            this._colorTexture && this._colorTexture.destroy();
            this._colorTexture = packGradientRange(_sample_num, colorModule.color);
            const handle = pass.getHandle('color_over_time_tex0');
            const binding = Pass.getBindingFromHandle(handle!);
            pass.bindSampler(binding, this._colorTexture.getGFXSampler()!);
            pass.bindTextureView(binding, this._colorTexture.getGFXTextureView()!);
            const modeHandle = pass.getHandle('u_color_mode');
            pass.setUniform(modeHandle!, this._colorTexture.height);
        }

        // rotation module
        const roationModule = this._particleSystem._rotationOvertimeModule;
        enable = roationModule && roationModule.enable;
        this._defines[ROTATION_OVER_TIME_MODULE_ENABLE] = enable;
        if (enable) {
            this._rotationTexture && this._rotationTexture.destroy();
            if (roationModule.separateAxes) {
                this._rotationTexture = packCurveRangeXYZ(_sample_num, roationModule.x, roationModule.y, roationModule.z);
            } else {
                this._rotationTexture = packCurveRangeZ(_sample_num, roationModule.z);
            }
            const handle = pass.getHandle('rotation_over_time_tex0');
            const binding = Pass.getBindingFromHandle(handle!);
            pass.bindSampler(binding, this._rotationTexture.getGFXSampler()!);
            pass.bindTextureView(binding, this._rotationTexture.getGFXTextureView()!);
            const modeHandle = pass.getHandle('u_rotation_mode');
            pass.setUniform(modeHandle!, this._rotationTexture.height);
        }

        // size module
        const sizeModule = this._particleSystem._sizeOvertimeModule;
        enable = sizeModule && sizeModule.enable;
        this._defines[SIZE_OVER_TIME_MODULE_ENABLE] = enable;
        if (enable) {
            this._sizeTexture && this._sizeTexture.destroy();
            if (sizeModule.separateAxes) {
                this._sizeTexture = packCurveRangeXYZ(_sample_num, sizeModule.x, sizeModule.y, sizeModule.z, true);
            } else {
                this._sizeTexture = packCurveRangeN(_sample_num, sizeModule.size, true);
            }
            const handle = pass.getHandle('size_over_time_tex0');
            const binding = Pass.getBindingFromHandle(handle!);
            pass.bindSampler(binding, this._sizeTexture.getGFXSampler()!);
            pass.bindTextureView(binding, this._sizeTexture.getGFXTextureView()!);
            const modeHandle = pass.getHandle('u_size_mode');
            pass.setUniform(modeHandle!, this._sizeTexture.height);
        }

        // texture module
        const textureModule = this._particleSystem._textureAnimationModule;
        enable = textureModule && textureModule.enable;
        this._defines[TEXTURE_ANIMATION_MODULE_ENABLE] = enable;
        if (enable) {
            this._animTexture && this._animTexture.destroy();
            this._animTexture = packCurveRangeXY(_sample_num, textureModule.startFrame, textureModule.frameOverTime);
            const handle = pass.getHandle('texture_animation_tex0');
            const binding = Pass.getBindingFromHandle(handle!);
            pass.bindSampler(binding, this._animTexture.getGFXSampler()!);
            pass.bindTextureView(binding, this._animTexture.getGFXTextureView()!);
            const infoHandle = pass.getHandle('u_anim_info');
            _tempVec4.x = this._animTexture.height;
            _tempVec4.y = textureModule.numTilesX * textureModule.numTilesY;
            _tempVec4.z = textureModule.cycleCount;
            pass.setUniform(infoHandle!, _tempVec4);
        }
    }

    public getParticleCount (): number {
        return this._particleNum;
    }

    public onMaterialModified (index: number, material: Material) {
        this._updateModel();
        this.updateMaterialParams();
    }

    public onRebuildPSO (index: number, material: Material) {
        if (this._model && index === 0) {
            this._model.setSubModelMaterial(0, material);
        }
    }

    private _setVertexAttrib () {
        switch (this._renderInfo!.renderMode) {
            case RenderMode.StrecthedBillboard:
                this._vertAttrs = _gpu_vert_attr.slice();
                break;
            case RenderMode.Mesh:
                this._vertAttrs = _gpu_vert_attr_mesh.slice();
                break;
            default:
                this._vertAttrs = _gpu_vert_attr.slice();
        }
    }

    public updateMaterialParams () {
        if (!this._particleSystem) {
            return;
        }
        if (this._particleSystem.sharedMaterial != null && this._particleSystem.sharedMaterial._effectAsset._name.indexOf('particle-gpu') === -1) {
            // reset material
            this._particleSystem.setMaterial(null, 0);
        }
        if (this._particleSystem.sharedMaterial == null && this._defaultMat == null) {
            _matInsInfo.parent = builtinResMgr.get<Material>('default-particle-gpu-material');
            _matInsInfo.owner = this._particleSystem;
            _matInsInfo.subModelIdx = 0;
            this._defaultMat = new MaterialInstance(_matInsInfo);
        }
        const mat: Material | null = this._particleSystem.getMaterialInstance(0) || this._defaultMat;

        this._particleSystem.node.getWorldMatrix(_tempWorldTrans);
        switch (this._particleSystem.scaleSpace) {
            case Space.Local:
                this._particleSystem.node.getScale(this._node_scale);
                break;
            case Space.World:
                this._particleSystem.node.getWorldScale(this._node_scale);
                break;
        }

        if (this._particleSystem._simulationSpace === Space.World) {
            this._defines[CC_USE_WORLD_SPACE] = true;
        } else {
            this._defines[CC_USE_WORLD_SPACE] = false;
        }
        const renderMode = this._renderInfo!.renderMode;
        if (renderMode === RenderMode.Billboard) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_BILLBOARD;
        } else if (renderMode === RenderMode.StrecthedBillboard) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_STRETCHED_BILLBOARD;
            this._frameTile_velLenScale.z = this._renderInfo!.velocityScale;
            this._frameTile_velLenScale.w = this._renderInfo!.lengthScale;
        } else if (renderMode === RenderMode.HorizontalBillboard) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_HORIZONTAL_BILLBOARD;
        } else if (renderMode === RenderMode.VerticalBillboard) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_VERTICAL_BILLBOARD;
        } else if (renderMode === RenderMode.Mesh) {
            this._defines[CC_RENDER_MODE] = RENDER_MODE_MESH;
        } else {
            console.warn(`particle system renderMode ${renderMode} not support.`);
        }
        const textureModule = this._particleSystem._textureAnimationModule;
        if (textureModule && textureModule.enable) {
            Vec2.set(this._frameTile_velLenScale, textureModule.numTilesX, textureModule.numTilesY);
        }

        this.initShaderUniform(mat!);

        mat!.recompileShaders(this._defines);

        if (this._model) {
            this._model.setSubModelMaterial(0, mat);
        }
    }
}