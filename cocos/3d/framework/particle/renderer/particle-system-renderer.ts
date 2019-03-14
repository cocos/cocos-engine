import { ccclass, executeInEditMode, property } from '../../../../core/data/class-decorator';
import { Enum, Vec2, Vec4 } from '../../../../core/value-types';
import { mat4, vec2, vec3, vec4 } from '../../../../core/vmath';
import { GFXAttributeName, GFXFormat } from '../../../../gfx/define';
import { IGFXInputAttribute } from '../../../../gfx/input-assembler';
import * as renderer from '../../../../renderer';
import ParticleBatchModel from '../../../../renderer/models/particle-batch-model';
import { Material } from '../../../assets/material';
import RecyclePool from '../../../memop/recycle-pool';
import Particle from '../particle';
import { RenderableComponent } from '../../renderable-component';
import { Space } from '../particle-general-function';
import { builtinResMgr } from '../../../builtin';
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

const RenderMode = Enum({
    Billboard: 0,
    StrecthedBillboard: 1,
    HorizontalBillboard: 2,
    VerticalBillboard: 3,
    Mesh: 4,
});

const USE_WORLD_SPACE = 'USE_WORLD_SPACE';
const USE_BILLBOARD = 'USE_BILLBOARD';
const USE_STRETCHED_BILLBOARD = 'USE_STRETCHED_BILLBOARD';
const USE_HORIZONTAL_BILLBOARD = 'USE_HORIZONTAL_BILLBOARD';
const USE_VERTICAL_BILLBOARD = 'USE_VERTICAL_BILLBOARD';

@ccclass('cc.ParticleSystemRenderer')
@executeInEditMode
export default class ParticleSystemRenderer extends RenderableComponent {

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
        this._updateMaterialParams();
        this._updateModel();
    }

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

    private _defines: { [index: string]: boolean };
    private _model: ParticleBatchModel | null;
    private frameTile_velLenScale: Vec4;
    private attrs: any[];
    private _vertAttrs: IGFXInputAttribute[];
    private particleSystem: any;
    private _particles: RecyclePool | null = null;
    private _defaultMat: Material | null = null;

    constructor () {
        super();
        this._model = null;

        this.frameTile_velLenScale = cc.v4(1, 1, 0, 0);
        this.attrs = new Array(5);
        this._vertAttrs = [
            { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },
            { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RGB32F },
            { name: GFXAttributeName.ATTR_TEX_COORD1, format: GFXFormat.RG32F },
            { name: GFXAttributeName.ATTR_COLOR, format: GFXFormat.RGBA8, isNormalized: true },
        ];
        this._defines = {
            USE_WORLD_SPACE: true,
            USE_BILLBOARD: true,
            USE_STRETCHED_BILLBOARD: false,
            USE_HORIZONTAL_BILLBOARD: false,
            USE_VERTICAL_BILLBOARD: false,
        };
    }

    public onInit () {
        this.particleSystem = this.node.getComponent('cc.ParticleSystemComponent');
        this._particles = new RecyclePool(() => {
            return new Particle(this);
        }, 16);
        this.onEnable();
        this._updateMaterialParams();
        this._updateModel();
    }

    public onEnable () {
        if (!this.particleSystem) {
            return;
        }
        if (this._model == null) {
            this._model = this._getRenderScene().createModel(ParticleBatchModel, this.node) as ParticleBatchModel;
            this._model.setCapacity(this.particleSystem.capacity);
            this._model.setVertexAttributes(this._vertAttrs);
            this._model.node = this.node;
            this._model.enabled = this.enabledInHierarchy;
        }
    }

    public onDisable () {
        this._getRenderScene().destroyModel(this._model!);
    }

    public onDestroy () {
        this._model!.destroy();
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
        for (let i = 0; i < this._particles!.length; ++i) {
            const p = this._particles!.data[i];
            p.remainingLifetime -= dt;
            vec3.set(p.animatedVelocity, 0, 0, 0);

            if (p.remainingLifetime < 0.0) {
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
        }
    }

    // internal function
    public _updateRenderData () {
        // update vertex buffer
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
                }

                this._model!.addParticleVertexData(idx++, this.attrs);
            }
        }

        // because we use index buffer, per particle index count = 6.
        this._model!.updateIA(this._particles!.length * 6);
    }

    public updateShaderUniform () {

    }

    public getParticleCount (): number {
        return this._particles!.length;
    }

    public _onMaterialModified (index: number, material: Material) {
        this._updateMaterialParams();
        this._updateModel();
    }

    public _onRebuildPSO (index: number, material: Material) {
        if (this._model) {
            this._model.setSubModelMaterial(0, material);
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
            this._defines[USE_WORLD_SPACE] = true;
        } else {
            this._defines[USE_WORLD_SPACE] = false;
        }

        if (this._renderMode === RenderMode.Billboard) {
            this._defines[USE_BILLBOARD] = true;
            this._defines[USE_STRETCHED_BILLBOARD] = false;
            this._defines[USE_HORIZONTAL_BILLBOARD] = false;
            this._defines[USE_VERTICAL_BILLBOARD] = false;
        } else if (this._renderMode === RenderMode.StrecthedBillboard) {
            this._defines[USE_BILLBOARD] = false;
            this._defines[USE_STRETCHED_BILLBOARD] = true;
            this._defines[USE_HORIZONTAL_BILLBOARD] = false;
            this._defines[USE_VERTICAL_BILLBOARD] = false;
            this.frameTile_velLenScale.z = this._velocityScale;
            this.frameTile_velLenScale.w = this._lengthScale;
        } else if (this._renderMode === RenderMode.HorizontalBillboard) {
            this._defines[USE_BILLBOARD] = false;
            this._defines[USE_STRETCHED_BILLBOARD] = false;
            this._defines[USE_HORIZONTAL_BILLBOARD] = true;
            this._defines[USE_VERTICAL_BILLBOARD] = false;
        } else if (this._renderMode === RenderMode.VerticalBillboard) {
            this._defines[USE_BILLBOARD] = false;
            this._defines[USE_STRETCHED_BILLBOARD] = false;
            this._defines[USE_HORIZONTAL_BILLBOARD] = false;
            this._defines[USE_VERTICAL_BILLBOARD] = true;
        } else {
            console.warn(`particle system renderMode ${this._renderMode} not support.`);
        }
        mat!.destroy();
        mat!.initialize({ defines: this._defines });

        if (this.particleSystem.textureAnimationModule.enable) {
            mat!.setProperty('frameTile_velLenScale', vec2.set(this.frameTile_velLenScale, this.particleSystem.textureAnimationModule.numTilesX, this.particleSystem.textureAnimationModule.numTilesY));
        } else {
            mat!.setProperty('frameTile_velLenScale', this.frameTile_velLenScale);
        }
    }

    private _updateModel () {
        if (!this.particleSystem) {
            return;
        }
        if (this._renderMode === RenderMode.StrecthedBillboard) {
            this._model!.enableStretchedBillboard();
        } else {
            this._model!.disableStretchedBillboard();
        }
        this._model!.setSubModelMaterial(0, this.sharedMaterial || this._defaultMat);
        // if (Object.getPrototypeOf(this).constructor.name === 'ParticleSystemGpuRenderer') {
        //     return;
        // }
    }
}

Object.assign(ParticleSystemRenderer, { uv: _uvs });
