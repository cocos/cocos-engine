import renderer from '../../../../renderer';
import { vec3, vec4, vec2, mat4 } from '../../../../core/vmath';
import gfx from '../../../../renderer/gfx';
import Material from '../../../assets/material';
import { RecyclePool } from '../../../memop';
import Particle from '../particle';
import RenderableComponent from '../../renderable-component';
import { Enum } from '../../../../core/value-types';
import { property, ccclass, executeInEditMode } from '../../../../core/data/class-decorator';
import { Space } from '../particle-general-function';

let _tempAttribUV = vec3.create();
let _tempAttribUV0 = vec2.create();
let _tempAttribColor = vec4.create();
let _tempWorldTrans = mat4.create();

let _uvs = [
    0, 0, // bottom-left
    1, 0, // bottom-right
    0, 1, // top-left
    1, 1  // top-right
];

const RenderMode = Enum({
    Billboard: 0,
    StrecthedBillboard: 1,
    HorizontalBillboard: 2,
    VerticalBillboard: 3,
    Mesh: 4
});

@ccclass('cc.ParticleSystemRenderer')
@executeInEditMode
export default class ParticleSystemRenderer extends RenderableComponent {

    @property({
        type: RenderMode
    })
    _renderMode = RenderMode.Billboard;

    @property({
        type: RenderMode
    })
    get renderMode() {
        return this._renderMode;
    }

    set renderMode(val) {
        if (this._renderMode === val) {
            return;
        }
        this._renderMode = val;
        this._updateMaterialParams();
        this._updateModel();
    }

    @property
    _velocityScale = 1;

    @property
    get velocityScale() {
        return this._velocityScale;
    }

    set velocityScale(val) {
        this._velocityScale = val;
        this._updateMaterialParams();
        this._updateModel();
    }

    @property
    _lengthScale = 1;

    @property
    get lengthScale() {
        return this._lengthScale;
    }

    set lengthScale(val) {
        this._lengthScale = val;
        this._updateMaterialParams();
        this._updateModel();
    }

    constructor() {
        super();
        this._model = null;

        this.frameTile = cc.v2(1, 1);
        this.attrs = new Array(5);

        this.device = cc.game._renderContext;
    }

    onInit() {
        this._vertAttrs = [
            { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3, index: gfx.ATTR_INDEX_POSITION },
            { name: gfx.ATTR_UV, type: gfx.ATTR_TYPE_FLOAT32, num: 3, index: gfx.ATTR_INDEX_UV },
            { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2, index: gfx.ATTR_INDEX_UV0 },
            { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, index: gfx.ATTR_INDEX_COLOR, normalize: true }
        ];
        this.particleSystem = this.node.getComponent('cc.ParticleSystemComponent');
        this._particles = new RecyclePool(() => {
            return new Particle(this);
        }, this.particleSystem.capacity);
        if (this.sharedMaterial == null) {
            this.material = new Material();
            this.sharedMaterial.effectAsset = cc.EffectAsset.get('builtin-effect-particle-add');
        }
        this._updateMaterialParams();
        this._updateModel();
    }

    onEnable() {
        this._scene.addModel(this._model);
    }

    onDisable() {
        this._scene.removeModel(this._model);
    }

    onDestroy() {
        this._model.destroy();
    }

    _updateMaterialParams() {
        if (!this.particleSystem) {
            return;
        }
        if (this.particleSystem._simulationSpace === Space.World) {
            this.sharedMaterial.define('USE_WORLD_SPACE', true);
        } else {
            this.sharedMaterial.define('USE_WORLD_SPACE', false);
        }

        if (this._renderMode === RenderMode.Billboard) {
            this.sharedMaterial.define('USE_BILLBOARD', true);
            this.sharedMaterial.define('USE_STRETCHED_BILLBOARD', false);
            this.sharedMaterial.define('USE_HORIZONTAL_BILLBOARD', false);
            this.sharedMaterial.define('USE_VERTICAL_BILLBOARD', false);
        } else if (this._renderMode === RenderMode.StrecthedBillboard) {
            this.sharedMaterial.define('USE_BILLBOARD', false);
            this.sharedMaterial.define('USE_STRETCHED_BILLBOARD', true);
            this.sharedMaterial.define('USE_HORIZONTAL_BILLBOARD', false);
            this.sharedMaterial.define('USE_VERTICAL_BILLBOARD', false);
            this.sharedMaterial.setProperty('velocityScale', this._velocityScale);
            this.sharedMaterial.setProperty('lengthScale', this._lengthScale);
        } else if (this._renderMode === RenderMode.HorizontalBillboard) {
            this.sharedMaterial.define('USE_BILLBOARD', false);
            this.sharedMaterial.define('USE_STRETCHED_BILLBOARD', false);
            this.sharedMaterial.define('USE_HORIZONTAL_BILLBOARD', true);
            this.sharedMaterial.define('USE_VERTICAL_BILLBOARD', false);
        } else if (this._renderMode === RenderMode.VerticalBillboard) {
            this.sharedMaterial.define('USE_BILLBOARD', false);
            this.sharedMaterial.define('USE_STRETCHED_BILLBOARD', false);
            this.sharedMaterial.define('USE_HORIZONTAL_BILLBOARD', false);
            this.sharedMaterial.define('USE_VERTICAL_BILLBOARD', true);
        } else {
            console.warn(`particle system renderMode ${this._renderMode} not support.`);
        }

        if (this.particleSystem.textureAnimationModule.enable) {
            this.sharedMaterial.setProperty('frameTile', vec2.set(this.frameTile, this.particleSystem.textureAnimationModule.numTilesX, this.particleSystem.textureAnimationModule.numTilesY));
        }
        else {
            this.sharedMaterial.setProperty('frameTile', this.frameTile);
        }
    }

    _updateModel() {
        if (!this.particleSystem) {
            return;
        }
        if (this._model === null) {
            this._model = new renderer.ParticleBatchModel(this.device, this.particleSystem.capacity, this._vertAttrs);
            this._model.setParticleRenderer(this);
            this._model.setNode(this.node);
        }
        this._model.setEffect(this.sharedMaterial ? this.sharedMaterial.effect : null);
        if (Object.getPrototypeOf(this).constructor.name === 'ParticleSystemGpuRenderer')
            return;
        if (this._renderMode === RenderMode.StrecthedBillboard) {
            this._model.enableStretchedBillboard();
        } else {
            this._model.disableStretchedBillboard();
        }
    }

    _getFreeParticle() {
        if (this._particles.length >= this.particleSystem._capacity)
            return null;
        return this._particles.add();
    }

    _setNewParticle(p) {

    }

    _updateParticles(dt) {
        this.node.getWorldMatrix(_tempWorldTrans);
        if (this.particleSystem.velocityOvertimeModule.enable) {
            this.particleSystem.velocityOvertimeModule.update(this.particleSystem._simulationSpace, _tempWorldTrans);
        }
        if (this.particleSystem.forceOvertimeModule.enable) {
            this.particleSystem.forceOvertimeModule.update(this.particleSystem._simulationSpace, _tempWorldTrans);
        }
        for (let i = 0; i < this._particles.length; ++i) {
            let p = this._particles.data[i];
            p.remainingLifetime -= dt;
            vec3.set(p.animatedVelocity, 0, 0, 0);

            if (p.remainingLifetime < 0.0) {
                this._particles.remove(i);
                --i;
                continue;
            }

            p.velocity.y -= this.particleSystem.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, p.randomSeed) * 9.8 * dt; // apply gravity.
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
            }
            else {
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
    _updateRenderData() {
        // update vertex buffer
        let idx = 0;
        let uploadVel = this._renderMode == RenderMode.StrecthedBillboard;
        for (let i = 0; i < this._particles.length; ++i) {
            let p = this._particles.data[i];
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

                this._model.addParticleVertexData(idx++, this.attrs);
            }
        }

        // because we use index buffer, per particle index count = 6.
        this._model.updateIA(this._particles.length * 6);
    }

    updateShaderUniform() {

    }

    _onMaterialModified(index, material) {
        this._updateMaterialParams();
        this._updateModel();
    }
}

Object.assign(ParticleSystemRenderer, { uv: _uvs });
