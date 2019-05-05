import { ccclass, executeInEditMode, property } from '../../../../core/data/class-decorator';
import { Enum, Vec2, Vec4 } from '../../../../core/value-types';
import { mat4, vec2, vec3, vec4 } from '../../../../core/vmath';
import { GFXAttributeName, GFXFormat } from '../../../../gfx/define';
import { IGFXAttribute } from '../../../../gfx/input-assembler';
import * as renderer from '../../../../renderer';
import ParticleBatchModel from '../../../../renderer/models/particle-batch-model';
import { Material } from '../../../assets/material';
import RecyclePool from '../../../memop/recycle-pool';
import Particle from '../particle';
import { RenderableComponent } from '../../renderable-component';
import { Space } from '../particle-general-function';
import { builtinResMgr } from '../../../builtin';
import { Mesh } from '../../../assets';
import { postLoadMesh } from '../../../assets/utils/mesh-utils';
// import ParticleSystemComponent from '../particle-system-component';

// tslint:disable: max-line-length
const _tempAttribUV: vec3 = vec3.create();
const _tempAttribUV0: vec2 = vec2.create();
const _tempAttribColor: vec4 = vec4.create();
const _tempWorldTrans: mat4 = mat4.create();

const _uvs = [
    0, 0, // bottom-left
    1, 0, // bottom-right
    0, 1, // top-left
    1, 1, // top-right
];

/**
 * 粒子的生成模式
 * @enum ParticleSystemRenderer.RenderMode
 */
const RenderMode = Enum({

    /**
     * 粒子始终面向摄像机
     */
    Billboard: 0,

    /**
     * 粒子始终面向摄像机但会根据参数进行拉伸
     */
    StrecthedBillboard: 1,

    /**
     * 粒子始终与 XZ 平面平行
     */
    HorizontalBillboard: 2,

    /**
     * 粒子始终与 Y 轴平行且朝向摄像机
     */
    VerticalBillboard: 3,

    /**
     * 粒子保持模型本身状态
     */
    Mesh: 4,
});

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
const CC_USE_BILLBOARD = 'CC_USE_BILLBOARD';
const CC_USE_STRETCHED_BILLBOARD = 'CC_USE_STRETCHED_BILLBOARD';
const CC_USE_HORIZONTAL_BILLBOARD = 'CC_USE_HORIZONTAL_BILLBOARD';
const CC_USE_VERTICAL_BILLBOARD = 'CC_USE_VERTICAL_BILLBOARD';
const CC_USE_MESH = 'CC_USE_MESH';

const _vertex_attrs = [
    { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_TEX_COORD1, format: GFXFormat.RG32F },
    { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA8, isNormalized: true },
];

const _vertex_attrs_stretch = [
    { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_TEX_COORD1, format: GFXFormat.RG32F },
    { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA8, isNormalized: true },
    { name: GFXAttributeName.ATTR_COLOR1, format: GFXFormat.RGB32F },
];

const _vertex_attrs_mesh = [
    { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_TEX_COORD1, format: GFXFormat.RG32F },
    { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA8, isNormalized: true },
    { name: GFXAttributeName.ATTR_TEX_COORD2, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_NORMAL, format: GFXFormat.RGB32F },
    { name: GFXAttributeName.ATTR_COLOR1, format: GFXFormat.RGBA8, isNormalized: true },
];

@ccclass('cc.ParticleSystemRenderer')
@executeInEditMode
export default class ParticleSystemRenderer extends RenderableComponent {

    /**
     * 设定粒子生成模式
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
        this._updateMaterialParams();
        this._updateModel();
    }

    /**
     * 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸
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
     * 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸
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
    })
    private _renderMode = RenderMode.Billboard;

    @property
    private _velocityScale = 1;

    @property
    private _lengthScale = 1;

    @property
    private _mesh: Mesh | null = null;

    /**
     * 粒子模型
     */
    @property({
        type: Mesh,
    })
    public get mesh () {
        return this._mesh;
    }

    public set mesh (val) {
        const replaceMesh = () => {
            const old = this._mesh;
            this._mesh = val;
            if (this._model) {
                this._model.setVertexAttributes(this._renderMode === RenderMode.Mesh ? this._mesh : null, this._vertAttrs);
            }
            if (old && !old.loaded) {
                this._unfinished--;
                old.off('load', this._onMeshLoaded, this);
                if (this._unfinished === 0) {
                    this._assetReady();
                }
            }
        };
        if (val && !val.loaded) {
            val.once('load', replaceMesh);
            postLoadMesh(val);
        } else {
            replaceMesh();
        }
    }

    private _defines: { [index: string]: boolean };
    private _trailDefines: { [index: string]: boolean };
    private _model: ParticleBatchModel | null;
    private frameTile_velLenScale: Vec4;
    private attrs: any[];
    private _vertAttrs: IGFXAttribute[];
    private particleSystem: any;
    private _particles: RecyclePool | null = null;
    private _defaultMat: Material | null = null;
    private _isAssetReady = false;

    constructor () {
        super();
        this._model = null;

        this.frameTile_velLenScale = cc.v4(1, 1, 0, 0);
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
        };
    }

    public onInit () {
        this.particleSystem = this.node.getComponent('cc.ParticleSystemComponent');
        this._particles = new RecyclePool(() => {
            return new Particle(this);
        }, 16);
        this._setVertexAttrib();
        this.onEnable();
    }

    public onLoad () {
        super.onLoad();
        if (this._mesh && !this._mesh.loaded) {
            this._unfinished++;
            this._mesh.once('load', this._onMeshLoaded, this);
        }
    }

    public onEnable () {
        if (!this.particleSystem) {
            return;
        }
        super.onEnable();
        this._ensureLoadMesh();
    }

    public onDisable () {
        if (this._model) {
            this._model.enabled = this.enabledInHierarchy;
        }
    }

    public onDestroy () {
        this._getRenderScene().destroyModel(this._model!);
        this._model = null;
    }

    public clear () {
        this._particles!.reset();
    }

    public _getFreeParticle (): Particle | null {
        if (this._particles!.length >= this.particleSystem.capacity) {
            return null;
        }
        return this._particles!.add();
    }

    public _setNewParticle (p: Particle) {

    }

    public _updateParticles (dt: number) {
        this.node.getWorldMatrix(_tempWorldTrans);
        if (this.particleSystem.velocityOvertimeModule.enable) {
            this.particleSystem.velocityOvertimeModule.update(this.particleSystem._simulationSpace, _tempWorldTrans);
        }
        if (this.particleSystem.forceOvertimeModule.enable) {
            this.particleSystem.forceOvertimeModule.update(this.particleSystem._simulationSpace, _tempWorldTrans);
        }
        if (this.particleSystem.trailModule.enable) {
            this.particleSystem.trailModule.update();
        }
        for (let i = 0; i < this._particles!.length; ++i) {
            const p = this._particles!.data[i];
            p.remainingLifetime -= dt;
            vec3.set(p.animatedVelocity, 0, 0, 0);

            if (p.remainingLifetime < 0.0) {
                if (this.particleSystem.trailModule.enable) {
                    this.particleSystem.trailModule.removeParticle(p);
                }
                this._particles!.removeAt(i);
                --i;
                continue;
            }

            p.velocity.y -= this.particleSystem.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, p.randomSeed)! * 9.8 * dt; // apply gravity.
            if (this.particleSystem.sizeOvertimeModule.enable) {
                this.particleSystem.sizeOvertimeModule.animate(p);
            }
            if (this.particleSystem.colorOverLifetimeModule.enable) {
                this.particleSystem.colorOverLifetimeModule.animate(p);
            }
            if (this.particleSystem.forceOvertimeModule.enable) {
                this.particleSystem.forceOvertimeModule.animate(p, dt);
            }
            if (this.particleSystem.velocityOvertimeModule.enable) {
                this.particleSystem.velocityOvertimeModule.animate(p);
            } else {
                vec3.copy(p.ultimateVelocity, p.velocity);
            }
            if (this.particleSystem.limitVelocityOvertimeModule.enable) {
                this.particleSystem.limitVelocityOvertimeModule.animate(p);
            }
            if (this.particleSystem.rotationOvertimeModule.enable) {
                this.particleSystem.rotationOvertimeModule.animate(p, dt);
            }
            if (this.particleSystem.textureAnimationModule.enable) {
                this.particleSystem.textureAnimationModule.animate(p);
            }
            vec3.scaleAndAdd(p.position, p.position, p.ultimateVelocity, dt); // apply velocity.
            if (this.particleSystem.trailModule.enable) {
                this.particleSystem.trailModule.animate(p, dt);
            }
        }
    }

    // internal function
    public _updateRenderData () {
        // update vertex buffer
        if (!this._isAssetReady) { return; }
        let idx = 0;
        const uploadVel = this._renderMode === RenderMode.StrecthedBillboard;
        for (let i = 0; i < this._particles!.length; ++i) {
            const p = this._particles!.data[i];
            let fi = 0;
            if (this.particleSystem.textureAnimationModule.enable) {
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
                    _tempAttribUV0.x = p.size.x;
                    _tempAttribUV0.y = p.rotation.x;
                    this.attrs[attrNum++] = _tempAttribUV0;
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
                _tempAttribUV0.x = p.size.x;
                _tempAttribUV0.y = p.rotation.x;
                this.attrs[attrNum++] = _tempAttribUV0;
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
            this._updateMaterialParams();

        } else {
            if (this.particleSystem.trailModule.enable) {
                this.particleSystem.trailModule._updateMaterial();
                const mat = this.getMaterial(1, CC_EDITOR)!;
                mat!.recompileShaders(this._trailDefines);
            }
        }
        this._updateModel();
    }

    public _onRebuildPSO (index: number, material: Material) {
        if (this._model && index === 0) {
            this._model.setSubModelMaterial(0, material);
        }
        if (this.particleSystem.trailModule._trailModel && index === 1) {
            this.particleSystem.trailModule._trailModel.setSubModelMaterial(0, material);
        }
    }

    protected _ensureLoadMesh () {
        if (this._mesh && !this._mesh.loaded) {
            postLoadMesh(this._mesh);
        }
    }

    protected _assetReady () {
        super._assetReady();
        if (this._model == null) {
            this._model = this._getRenderScene().createModel(ParticleBatchModel, this.node) as ParticleBatchModel;
        }
        if (!this._model.inited) {
            this._model.setCapacity(this.particleSystem.capacity);
            this._model.node = this.node;
        }
        this._model.enabled = this.enabledInHierarchy;
        this._updateMaterialParams();
        this._updateModel();
        this._isAssetReady = true;
    }

    protected _onMeshLoaded () {
        this._unfinished--;
        if (this._unfinished === 0) {
            this._assetReady();
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
        if (!this.particleSystem) {
            return;
        }
        if (this.sharedMaterial == null && this._defaultMat == null) {
            this._defaultMat = Material.getInstantiatedMaterial(builtinResMgr.get<Material>('default-particle-material'), this, true);
        }
        const mat: Material | null = this.sharedMaterial ? this.getMaterial(0, CC_EDITOR)! : this._defaultMat;
        if (this.particleSystem._simulationSpace === Space.World) {
            this._defines[CC_USE_WORLD_SPACE] = true;
            this._trailDefines[CC_USE_WORLD_SPACE] = true;
        } else {
            this._defines[CC_USE_WORLD_SPACE] = false;
            this._trailDefines[CC_USE_WORLD_SPACE] = false;
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
        mat!.recompileShaders(this._defines);

        if (this.particleSystem.textureAnimationModule.enable) {
            mat!.setProperty('frameTile_velLenScale', vec2.set(this.frameTile_velLenScale, this.particleSystem.textureAnimationModule.numTilesX, this.particleSystem.textureAnimationModule.numTilesY));
        } else {
            mat!.setProperty('frameTile_velLenScale', this.frameTile_velLenScale);
        }
    }

    private _updateModel () {
        if (!this._model) {
            return;
        }
        this._model.setVertexAttributes(this._renderMode === RenderMode.Mesh ? this._mesh : null, this._vertAttrs);
        this._model.setSubModelMaterial(0, this.sharedMaterial || this._defaultMat);
        // if (Object.getPrototypeOf(this).constructor.name === 'ParticleSystemGpuRenderer') {
        //     return;
        // }
    }
}

Object.assign(ParticleSystemRenderer, { uv: _uvs });
