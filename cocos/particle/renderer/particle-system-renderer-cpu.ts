import { builtinResMgr } from '../../core/3d/builtin';
import { Material } from '../../core/assets';
import { GFXAttributeName, GFXFormat } from '../../core/gfx/define';
import { Mat4, Vec2, Vec3, Vec4, pseudoRandom } from '../../core/math';
import { RecyclePool } from '../../core/memop';
import { MaterialInstance, IMaterialInstanceInfo } from '../../core/renderer/core/material-instance';
import { IDefineMap } from '../../core/renderer/core/pass-utils';
import { RenderMode, Space } from '../enum';
import Particle from '../particle';
import { ParticleSystemRendererBase } from './particle-system-renderer-base';
import { Component } from '../../core';

const _tempAttribUV = new Vec3();
const _tempWorldTrans = new Mat4();

const _uvs = [
    0, 0, // bottom-left
    1, 0, // bottom-right
    0, 1, // top-left
    1, 1, // top-right
];

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';

const CC_RENDER_MODE = 'CC_RENDER_MODE';
const RENDER_MODE_BILLBOARD = 0;
const RENDER_MODE_STRETCHED_BILLBOARD = 1;
const RENDER_MODE_HORIZONTAL_BILLBOARD = 2;
const RENDER_MODE_VERTICAL_BILLBOARD = 3;
const RENDER_MODE_MESH = 4;

const _vertex_attrs = [
    { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },                     // position
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGB32F },                    // uv,frame idx
    { name: GFXAttributeName.ATTR_TEX_COORD1, format: GFXFormat.RGB32F },                    // size
    { name: GFXAttributeName.ATTR_TEX_COORD2, format: GFXFormat.RGB32F },                    // rotation
    { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA8, isNormalized: true },     // color
];

const _vertex_attrs_stretch = [
    { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },                     // position
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGB32F },                    // uv,frame idx
    { name: GFXAttributeName.ATTR_TEX_COORD1, format: GFXFormat.RGB32F },                    // size
    { name: GFXAttributeName.ATTR_TEX_COORD2, format: GFXFormat.RGB32F },                    // rotation
    { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA8, isNormalized: true },     // color
    { name: GFXAttributeName.ATTR_COLOR1, format: GFXFormat.RGB32F },                       // particle velocity
];

const _vertex_attrs_mesh = [
    { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },                     // particle position
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGB32F },                    // uv,frame idx
    { name: GFXAttributeName.ATTR_TEX_COORD1, format: GFXFormat.RGB32F },                    // size
    { name: GFXAttributeName.ATTR_TEX_COORD2, format: GFXFormat.RGB32F },                    // rotation
    { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA8, isNormalized: true },     // particle color
    { name: GFXAttributeName.ATTR_TEX_COORD3, format: GFXFormat.RGB32F },                   // mesh position
    { name: GFXAttributeName.ATTR_NORMAL, format: GFXFormat.RGB32F },                       // mesh normal
    { name: GFXAttributeName.ATTR_COLOR1, format: GFXFormat.RGBA8, isNormalized: true },    // mesh color
];

const _matInsInfo: IMaterialInstanceInfo = {
    parent: null!,
    owner: null!,
    subModelIdx: 0,
};

export default class ParticleSystemRendererCPU extends ParticleSystemRendererBase {
    private _defines: IDefineMap;
    private _trailDefines: IDefineMap;
    private _frameTile_velLenScale: Vec4;
    private _defaultMat: Material | null = null;
    private _node_scale: Vec4;
    private _attrs: any[];
    private _particles: RecyclePool | null = null;
    private _defaultTrailMat: Material | null = null;

    constructor (info: any) {
        super(info);

        this._model = null;

        this._frameTile_velLenScale = new Vec4(1, 1, 0, 0);
        this._node_scale = new Vec4();
        this._attrs = new Array(5);
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

    public onInit (ps: Component) {
        super.onInit(ps);

        this._particles = new RecyclePool(() => {
            return new Particle(this);
        }, 16);
        this._setVertexAttrib();
        this._updateModel();
        this.updateMaterialParams();
        this._updateTrailMaterial();
    }

    public clear () {
        this._particles!.reset();
        this.updateRenderData();
    }

    public updateRenderMode () {
        this._setVertexAttrib();
        this._updateModel();
        this.updateMaterialParams();
    }

    public getFreeParticle (): Particle | null {
        if (this._particles!.length >= this._particleSystem!.capacity) {
            return null;
        }
        return this._particles!.add();
    }

    public setNewParticle (p: Particle) {
    }

    public updateParticles (dt: number) {
        this._particleSystem!.node.getWorldMatrix(_tempWorldTrans);
        switch (this._particleSystem!.scaleSpace) {
            case Space.Local:
                this._particleSystem!.node.getScale(this._node_scale);
                break;
            case Space.World:
                this._particleSystem!.node.getWorldScale(this._node_scale);
                break;
        }
        const mat: Material | null = this._particleSystem!.getMaterialInstance(0) || this._defaultMat;
        mat!.setProperty('scale', this._node_scale);
        if (this._particleSystem!.velocityOvertimeModule.enable) {
            this._particleSystem!.velocityOvertimeModule.update(this._particleSystem!._simulationSpace, _tempWorldTrans);
        }
        if (this._particleSystem!.limitVelocityOvertimeModule.enable) {
            this._particleSystem!.limitVelocityOvertimeModule.update(this._particleSystem!._simulationSpace, _tempWorldTrans);
        }
        if (this._particleSystem!.forceOvertimeModule.enable) {
            this._particleSystem!.forceOvertimeModule.update(this._particleSystem!._simulationSpace, _tempWorldTrans);
        }
        if (this._particleSystem!.trailModule.enable) {
            this._particleSystem!.trailModule.update();
        }
        for (let i = 0; i < this._particles!.length; ++i) {
            const p = this._particles!.data[i];
            p.remainingLifetime -= dt;
            Vec3.set(p.animatedVelocity, 0, 0, 0);

            if (p.remainingLifetime < 0.0) {
                if (this._particleSystem!.trailModule.enable) {
                    this._particleSystem!.trailModule.removeParticle(p);
                }
                this._particles!.removeAt(i);
                --i;
                continue;
            }

            // apply gravity.
            p.velocity.y -= this._particleSystem!.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed))! * 9.8 * dt;
            if (this._particleSystem!.sizeOvertimeModule.enable) {
                this._particleSystem!.sizeOvertimeModule.animate(p);
            }
            if (this._particleSystem!.colorOverLifetimeModule.enable) {
                this._particleSystem!.colorOverLifetimeModule.animate(p);
            }
            if (this._particleSystem!.forceOvertimeModule.enable) {
                this._particleSystem!.forceOvertimeModule.animate(p, dt);
            }
            if (this._particleSystem!.velocityOvertimeModule.enable) {
                this._particleSystem!.velocityOvertimeModule.animate(p);
            } else {
                Vec3.copy(p.ultimateVelocity, p.velocity);
            }
            if (this._particleSystem!.limitVelocityOvertimeModule.enable) {
                this._particleSystem!.limitVelocityOvertimeModule.animate(p);
            }
            if (this._particleSystem!.rotationOvertimeModule.enable) {
                this._particleSystem!.rotationOvertimeModule.animate(p, dt);
            }
            if (this._particleSystem!.textureAnimationModule.enable) {
                this._particleSystem!.textureAnimationModule.animate(p);
            }
            Vec3.scaleAndAdd(p.position, p.position, p.ultimateVelocity, dt); // apply velocity.
            if (this._particleSystem!.trailModule.enable) {
                this._particleSystem!.trailModule.animate(p, dt);
            }
        }
        return this._particles!.length;
    }

    // internal function
    public updateRenderData () {
        // update vertex buffer
        let idx = 0;
        let renderMode = this._renderInfo!.renderMode;
        const uploadVel = renderMode === RenderMode.StrecthedBillboard;
        for (let i = 0; i < this._particles!.length; ++i) {
            const p = this._particles!.data[i];
            let fi = 0;
            if (this._particleSystem!.textureAnimationModule.enable) {
                fi = p.frameIndex;
            }
            idx = i * 4;
            let attrNum = 0;
            if (renderMode !== RenderMode.Mesh) {
                for (let j = 0; j < 4; ++j) { // four verts per particle.
                    attrNum = 0;
                    this._attrs[attrNum++] = p.position;
                    _tempAttribUV.x = _uvs[2 * j];
                    _tempAttribUV.y = _uvs[2 * j + 1];
                    _tempAttribUV.z = fi;
                    this._attrs[attrNum++] = _tempAttribUV;
                    this._attrs[attrNum++] = p.size;
                    this._attrs[attrNum++] = p.rotation;
                    this._attrs[attrNum++] = p.color._val;

                    if (uploadVel) {
                        this._attrs[attrNum++] = p.ultimateVelocity;
                    } else {
                        this._attrs[attrNum++] = null;
                    }

                    this._model!.addParticleVertexData(idx++, this._attrs);
                }
            } else {
                attrNum = 0;
                this._attrs[attrNum++] = p.position;
                _tempAttribUV.z = fi;
                this._attrs[attrNum++] = _tempAttribUV;
                this._attrs[attrNum++] = p.size;
                this._attrs[attrNum++] = p.rotation;
                this._attrs[attrNum++] = p.color._val;
                this._model!.addParticleVertexData(i, this._attrs);
            }
        }

        // because we use index buffer, per particle index count = 6.
        this._model!.updateIA(this._particles!.length);
    }

    public getParticleCount (): number {
        return this._particles!.length;
    }

    public onMaterialModified (index: number, material: Material) {
        if (index === 0) {
            this._updateModel();
            this.updateMaterialParams();
        } else {
            this._updateTrailMaterial();
        }
    }

    public onRebuildPSO (index: number, material: Material) {
        if (this._model && index === 0) {
            this._model.setSubModelMaterial(0, material);
        }
        if (this._particleSystem!.trailModule._trailModel && index === 1) {
            this._particleSystem!.trailModule._trailModel.setSubModelMaterial(0, material);
        }
    }

    private _setVertexAttrib () {
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
    }

    public updateMaterialParams () {
        if (!this._particleSystem) {
            return;
        }

        let shareMaterial = this._particleSystem!.sharedMaterial;
        if (shareMaterial != null) {
            let effectName = shareMaterial._effectAsset._name;
            // reset material
            if (effectName.indexOf('particle') === -1 || effectName.indexOf('particle-gpu') !== -1) {
                this._particleSystem!.setMaterial(null, 0);
            }
        }

        if (this._particleSystem!.sharedMaterial == null && this._defaultMat == null) {
            _matInsInfo.parent = builtinResMgr.get<Material>('default-particle-material');
            _matInsInfo.owner = this._particleSystem;
            _matInsInfo.subModelIdx = 0;
            this._defaultMat = new MaterialInstance(_matInsInfo);
        }
        const mat: Material | null = this._particleSystem!.getMaterialInstance(0) || this._defaultMat;
        if (this._particleSystem!._simulationSpace === Space.World) {
            this._defines[CC_USE_WORLD_SPACE] = true;
        } else {
            this._defines[CC_USE_WORLD_SPACE] = false;
        }

        let renderMode = this._renderInfo!.renderMode;
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

        if (this._particleSystem!.textureAnimationModule.enable) {
            Vec2.set(this._frameTile_velLenScale, this._particleSystem!.textureAnimationModule.numTilesX, this._particleSystem!.textureAnimationModule.numTilesY);
            mat!.setProperty('frameTile_velLenScale', this._frameTile_velLenScale);
        } else {
            mat!.setProperty('frameTile_velLenScale', this._frameTile_velLenScale);
        }
        mat!.recompileShaders(this._defines);
        if (this._model) {
            this._model.setSubModelMaterial(0, mat);
        }
    }

    private _updateTrailMaterial () {
        if (this._particleSystem!.trailModule.enable) {
            if (this._particleSystem!.simulationSpace === Space.World || this._particleSystem!.trailModule.space === Space.World) {
                this._trailDefines[CC_USE_WORLD_SPACE] = true;
            } else {
                this._trailDefines[CC_USE_WORLD_SPACE] = false;
            }
            let mat = this._particleSystem!.getMaterialInstance(1);
            if (mat === null && this._defaultTrailMat === null) {
                _matInsInfo.parent = builtinResMgr.get<Material>('default-trail-material');
                _matInsInfo.owner = this._particleSystem;
                _matInsInfo.subModelIdx = 1;
                this._defaultTrailMat = new MaterialInstance(_matInsInfo);
            }
            if (mat === null) {
                mat = this._defaultTrailMat;
            }
            mat!.recompileShaders(this._trailDefines);
            this._particleSystem!.trailModule._updateMaterial();
        }
    }
}
