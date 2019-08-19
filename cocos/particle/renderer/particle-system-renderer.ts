import { Component } from '../../core/components';
import { ccclass, property } from '../../core/data/class-decorator';
import { Mat4, Vec2, Vec3, Vec4 } from '../../core/math';
import { GFXAttributeName, GFXFormat } from '../../core/gfx/define';
import { IGFXAttribute } from '../../core/gfx/input-assembler';
import { IDefineMap } from '../../core/renderer/core/pass';
import ParticleBatchModel from '../models/particle-batch-model';
import { Mesh, Material } from '../../core/assets';
import { builtinResMgr } from '../../core/3d/builtin';
import RecyclePool from '../../core/memop/recycle-pool';
import { RenderMode, Space } from '../enum';
import Particle from '../particle';
import { ParticleSystemComponent } from '../particle-system-component';

const _tempAttribUV = new Vec3();
const _tempAttribUV0 = new Vec2();
const _tempWorldTrans = new Mat4();

const _uvs = [
    0, 0, // bottom-left
    1, 0, // bottom-right
    0, 1, // top-left
    1, 1, // top-right
];

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
const CC_USE_BILLBOARD = 'CC_USE_BILLBOARD';
const CC_USE_STRETCHED_BILLBOARD = 'CC_USE_STRETCHED_BILLBOARD';
const CC_USE_HORIZONTAL_BILLBOARD = 'CC_USE_HORIZONTAL_BILLBOARD';
const CC_USE_VERTICAL_BILLBOARD = 'CC_USE_VERTICAL_BILLBOARD';
const CC_USE_MESH = 'CC_USE_MESH';

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

@ccclass('cc.ParticleSystemRenderer')
export default class ParticleSystemRenderer {

    /**
     * @zh 设定粒子生成模式。
     */
    @property({
        type: RenderMode,
        displayOrder: 0,
    })
    public get renderMode () {
        return this._renderMode;
    }

    public set renderMode (val) {
        if (this._renderMode === val) {
            return;
        }
        this._renderMode = val;
        this._setVertexAttrib();
        this._updateModel();
        this._updateMaterialParams();
    }

    /**
     * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸。
     */
    @property({
        displayOrder: 1,
    })
    public get velocityScale () {
        return this._velocityScale;
    }

    public set velocityScale (val) {
        this._velocityScale = val;
        this._updateMaterialParams();
        // this._updateModel();
    }

    /**
     * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸。
     */
    @property({
        displayOrder: 2,
    })
    public get lengthScale () {
        return this._lengthScale;
    }

    public set lengthScale (val) {
        this._lengthScale = val;
        this._updateMaterialParams();
        // this._updateModel();
    }

    @property({
        type: RenderMode,
        displayOrder: 3,
    })
    private _renderMode = RenderMode.Billboard;

    @property({
        displayOrder: 4,
    })
    private _velocityScale = 1;

    @property({
        displayOrder: 5,
    })
    private _lengthScale = 1;

    @property({
        displayOrder: 6,
    })
    private _mesh: Mesh | null = null;

    @property({
        type: ParticleSystemComponent,
        visible: false,
    })
    private _particleSystem: any = null;

    /**
     * @zh 粒子发射的模型。
     */
    @property({
        type: Mesh,
        displayOrder: 7,
    })
    public get mesh () {
        return this._mesh;
    }

    public set mesh (val) {
        this._mesh = val;
        if (this._model) {
            this._model.setVertexAttributes(this._renderMode === RenderMode.Mesh ? this._mesh : null, this._vertAttrs);
        }
    }

    /**
     * @zh 粒子使用的材质。
     */
    @property({
        type: Material,
        displayOrder: 8,
    })
    public get particleMaterial () {
        if (!this._particleSystem) {
            return null;
        }
        return this._particleSystem.getMaterial(0);
    }

    public set particleMaterial (val) {
        this._particleSystem.setMaterial(val, 0);
    }

    /**
     * @zh 拖尾使用的材质。
     */
    @property({
        type: Material,
        displayOrder: 9,
    })
    public get trailMaterial () {
        if (!this._particleSystem) {
            return null;
        }
        return this._particleSystem.getMaterial(1)!;
    }

    public set trailMaterial (val) {
        this._particleSystem.setMaterial(val, 1);
    }

    private _defines: IDefineMap;
    private _trailDefines: IDefineMap;
    private _model: ParticleBatchModel | null;
    private frameTile_velLenScale: Vec4;
    private _node_scale: Vec4;
    private attrs: any[];
    private _vertAttrs: IGFXAttribute[] = [];
    private _particles: RecyclePool | null = null;
    private _defaultMat: Material | null = null;
    private _defaultTrailMat: Material | null = null;

    constructor () {
        this._model = null;

        this.frameTile_velLenScale = new Vec4(1, 1, 0, 0);
        this._node_scale = new Vec4();
        this.attrs = new Array(5);
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
        this._particleSystem = ps;
        this._particles = new RecyclePool(() => {
            return new Particle(this);
        }, 16);
        this._setVertexAttrib();
        this.onEnable();
        this._updateModel();
        this._updateMaterialParams();
        this._updateTrailMaterial();
    }

    public onEnable () {
        if (!this._particleSystem) {
            return;
        }
        if (this._model == null) {
            this._model = this._particleSystem._getRenderScene().createModel(ParticleBatchModel, this._particleSystem.node) as ParticleBatchModel;
            this._model.visFlags = this._particleSystem.visibility;
        }
        if (!this._model.inited) {
            this._model.setCapacity(this._particleSystem.capacity);
            this._model.node = this._particleSystem.node;
        }
        this._model.enabled = this._particleSystem.enabledInHierarchy;
    }

    public onDisable () {
        if (this._model) {
            this._model.enabled = this._particleSystem.enabledInHierarchy;
        }
    }

    public onDestroy () {
        this._particleSystem._getRenderScene().destroyModel(this._model!);
        this._model = null;
    }

    public clear () {
        this._particles!.reset();
        this._updateRenderData();
    }

    public _getFreeParticle (): Particle | null {
        if (this._particles!.length >= this._particleSystem.capacity) {
            return null;
        }
        return this._particles!.add();
    }

    public _setNewParticle (p: Particle) {

    }

    public _updateParticles (dt: number) {
        this._particleSystem.node.getWorldMatrix(_tempWorldTrans);
        switch (this._particleSystem.scaleSpace) {
            case Space.Local:
                this._particleSystem.node.getScale(this._node_scale);
                break;
            case Space.World:
                this._particleSystem.node.getWorldScale(this._node_scale);
                break;
        }
        const mat: Material | null = this._particleSystem.sharedMaterial ? this.particleMaterial : this._defaultMat;
        mat!.setProperty('scale', this._node_scale);
        if (this._particleSystem.velocityOvertimeModule.enable) {
            this._particleSystem.velocityOvertimeModule.update(this._particleSystem._simulationSpace, _tempWorldTrans);
        }
        if (this._particleSystem.forceOvertimeModule.enable) {
            this._particleSystem.forceOvertimeModule.update(this._particleSystem._simulationSpace, _tempWorldTrans);
        }
        if (this._particleSystem.trailModule.enable) {
            this._particleSystem.trailModule.update();
        }
        for (let i = 0; i < this._particles!.length; ++i) {
            const p = this._particles!.data[i];
            p.remainingLifetime -= dt;
            Vec3.set(p.animatedVelocity, 0, 0, 0);

            if (p.remainingLifetime < 0.0) {
                if (this._particleSystem.trailModule.enable) {
                    this._particleSystem.trailModule.removeParticle(p);
                }
                this._particles!.removeAt(i);
                --i;
                continue;
            }

            // apply gravity.
            p.velocity.y -= this._particleSystem.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, p.randomSeed)! * 9.8 * dt;
            if (this._particleSystem.sizeOvertimeModule.enable) {
                this._particleSystem.sizeOvertimeModule.animate(p);
            }
            if (this._particleSystem.colorOverLifetimeModule.enable) {
                this._particleSystem.colorOverLifetimeModule.animate(p);
            }
            if (this._particleSystem.forceOvertimeModule.enable) {
                this._particleSystem.forceOvertimeModule.animate(p, dt);
            }
            if (this._particleSystem.velocityOvertimeModule.enable) {
                this._particleSystem.velocityOvertimeModule.animate(p);
            } else {
                Vec3.copy(p.ultimateVelocity, p.velocity);
            }
            if (this._particleSystem.limitVelocityOvertimeModule.enable) {
                this._particleSystem.limitVelocityOvertimeModule.animate(p);
            }
            if (this._particleSystem.rotationOvertimeModule.enable) {
                this._particleSystem.rotationOvertimeModule.animate(p, dt);
            }
            if (this._particleSystem.textureAnimationModule.enable) {
                this._particleSystem.textureAnimationModule.animate(p);
            }
            Vec3.scaleAndAdd(p.position, p.position, p.ultimateVelocity, dt); // apply velocity.
            if (this._particleSystem.trailModule.enable) {
                this._particleSystem.trailModule.animate(p, dt);
            }
        }
        return this._particles!.length;
    }

    // internal function
    public _updateRenderData () {
        // update vertex buffer
        let idx = 0;
        const uploadVel = this._renderMode === RenderMode.StrecthedBillboard;
        for (let i = 0; i < this._particles!.length; ++i) {
            const p = this._particles!.data[i];
            let fi = 0;
            if (this._particleSystem.textureAnimationModule.enable) {
                fi = p.frameIndex;
            }
            idx = i * 4;
            let attrNum = 0;
            if (this._renderMode !== RenderMode.Mesh) {
                for (let j = 0; j < 4; ++j) { // four verts per particle.
                    attrNum = 0;
                    this.attrs[attrNum++] = p.position;
                    _tempAttribUV.x = _uvs[2 * j];
                    _tempAttribUV.y = _uvs[2 * j + 1];
                    _tempAttribUV.z = fi;
                    this.attrs[attrNum++] = _tempAttribUV;
                    this.attrs[attrNum++] = p.size;
                    this.attrs[attrNum++] = p.rotation;
                    this.attrs[attrNum++] = p.color._val;

                    if (uploadVel) {
                        this.attrs[attrNum++] = p.ultimateVelocity;
                    } else {
                        this.attrs[attrNum++] = null;
                    }

                    this._model!.addParticleVertexData(idx++, this.attrs);
                }
            } else {
                attrNum = 0;
                this.attrs[attrNum++] = p.position;
                _tempAttribUV.z = fi;
                this.attrs[attrNum++] = _tempAttribUV;
                this.attrs[attrNum++] = p.size;
                this.attrs[attrNum++] = p.rotation;
                this.attrs[attrNum++] = p.color._val;
                this._model!.addParticleVertexData(i, this.attrs);
            }
        }

        // because we use index buffer, per particle index count = 6.
        this._model!.updateIA(this._particles!.length);
    }

    public updateShaderUniform () {

    }

    public getParticleCount (): number {
        return this._particles!.length;
    }

    public _onMaterialModified (index: number, material: Material) {
        if (index === 0) {
            this._updateModel();
            this._updateMaterialParams();
        } else {
            this._updateTrailMaterial();
        }
    }

    public _onRebuildPSO (index: number, material: Material) {
        if (this._model && index === 0) {
            this._model.setSubModelMaterial(0, material);
        }
        if (this._particleSystem.trailModule._trailModel && index === 1) {
            this._particleSystem.trailModule._trailModel.setSubModelMaterial(0, material);
        }
    }

    private _setVertexAttrib () {
        switch (this._renderMode) {
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

    private _updateMaterialParams () {
        if (!this._particleSystem) {
            return;
        }
        if (this._particleSystem.sharedMaterial != null && this._particleSystem.sharedMaterial._effectAsset._name.indexOf('particle') === -1) {
            this._particleSystem.setMaterial(null, 0, false);
        }
        if (this._particleSystem.sharedMaterial == null && this._defaultMat == null) {
            this._defaultMat = Material.getInstantiatedMaterial(builtinResMgr.get<Material>('default-particle-material'), this._particleSystem, true);
        }
        const mat: Material | null = this._particleSystem.sharedMaterial ? this.particleMaterial : this._defaultMat;
        if (this._particleSystem._simulationSpace === Space.World) {
            this._defines[CC_USE_WORLD_SPACE] = true;
        } else {
            this._defines[CC_USE_WORLD_SPACE] = false;
        }

        if (this._renderMode === RenderMode.Billboard) {
            this._defines[CC_USE_BILLBOARD] = true;
            this._defines[CC_USE_STRETCHED_BILLBOARD] = false;
            this._defines[CC_USE_HORIZONTAL_BILLBOARD] = false;
            this._defines[CC_USE_VERTICAL_BILLBOARD] = false;
            this._defines[CC_USE_MESH] = false;
        } else if (this._renderMode === RenderMode.StrecthedBillboard) {
            this._defines[CC_USE_BILLBOARD] = false;
            this._defines[CC_USE_STRETCHED_BILLBOARD] = true;
            this._defines[CC_USE_HORIZONTAL_BILLBOARD] = false;
            this._defines[CC_USE_VERTICAL_BILLBOARD] = false;
            this._defines[CC_USE_MESH] = false;
            this.frameTile_velLenScale.z = this._velocityScale;
            this.frameTile_velLenScale.w = this._lengthScale;
        } else if (this._renderMode === RenderMode.HorizontalBillboard) {
            this._defines[CC_USE_BILLBOARD] = false;
            this._defines[CC_USE_STRETCHED_BILLBOARD] = false;
            this._defines[CC_USE_HORIZONTAL_BILLBOARD] = true;
            this._defines[CC_USE_VERTICAL_BILLBOARD] = false;
            this._defines[CC_USE_MESH] = false;
        } else if (this._renderMode === RenderMode.VerticalBillboard) {
            this._defines[CC_USE_BILLBOARD] = false;
            this._defines[CC_USE_STRETCHED_BILLBOARD] = false;
            this._defines[CC_USE_HORIZONTAL_BILLBOARD] = false;
            this._defines[CC_USE_VERTICAL_BILLBOARD] = true;
            this._defines[CC_USE_MESH] = false;
        } else if (this._renderMode === RenderMode.Mesh) {
            this._defines[CC_USE_BILLBOARD] = false;
            this._defines[CC_USE_STRETCHED_BILLBOARD] = false;
            this._defines[CC_USE_HORIZONTAL_BILLBOARD] = false;
            this._defines[CC_USE_VERTICAL_BILLBOARD] = false;
            this._defines[CC_USE_MESH] = true;
        } else {
            console.warn(`particle system renderMode ${this._renderMode} not support.`);
        }

        if (this._particleSystem.textureAnimationModule.enable) {
            Vec2.set(this.frameTile_velLenScale, this._particleSystem.textureAnimationModule.numTilesX, this._particleSystem.textureAnimationModule.numTilesY);
            mat!.setProperty('frameTile_velLenScale', this.frameTile_velLenScale);
        } else {
            mat!.setProperty('frameTile_velLenScale', this.frameTile_velLenScale);
        }
        mat!.recompileShaders(this._defines);
        if (this._model) {
            this._model.setSubModelMaterial(0, this._particleSystem.sharedMaterial || this._defaultMat);
        }
    }

    private _updateTrailMaterial () {
        if (this._particleSystem.trailModule.enable) {
            if (this._particleSystem._simulationSpace === Space.World || this._particleSystem.trailModule.space === Space.World) {
                this._trailDefines[CC_USE_WORLD_SPACE] = true;
            } else {
                this._trailDefines[CC_USE_WORLD_SPACE] = false;
            }
            let mat = this.trailMaterial;
            if (mat === null && this._defaultTrailMat === null) {
                this._defaultTrailMat = Material.getInstantiatedMaterial(builtinResMgr.get<Material>('default-trail-material'), this._particleSystem, true);
            }
            if (mat === null) {
                mat = this._defaultTrailMat;
            }
            mat!.recompileShaders(this._trailDefines);
            this._particleSystem.trailModule._updateMaterial();
        }
    }

    private _updateModel () {
        if (!this._model) {
            return;
        }
        this._model.setVertexAttributes(this._renderMode === RenderMode.Mesh ? this._mesh : null, this._vertAttrs);
        // if (Object.getPrototypeOf(this).constructor.name === 'ParticleSystemGpuRenderer') {
        //     return;
        // }
    }
}

Object.assign(ParticleSystemRenderer, { uv: _uvs });
