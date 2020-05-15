import { Material, Mesh } from '../../core/assets';
import { ccclass, property } from '../../core/data/class-decorator';
import { RenderMode} from '../enum';
import ParticleSystemRendererCPU from './particle-system-renderer-cpu';
import ParticleSystemRendererGPU from './particle-system-renderer-gpu';
/**
 * @en The render data of 3d particle.
 * @zh 3D 粒子的渲染数据模块
 * @class ParticleSystemRenderer
 */
@ccclass('cc.ParticleSystemRenderer')
export default class ParticleSystemRenderer {

    /**
     * @en Particle generation mode
     * @zh 设定粒子生成模式
     * @property {RenderMode} renderMode
     */
    @property({
        type: RenderMode,
        displayOrder: 0,
        tooltip: 'i18n:particle.render_mode',
    })
    public get renderMode () {
        return this._renderMode;
    }

    public set renderMode (val) {
        if (this._renderMode === val) {
            return;
        }
        this._renderMode = val;
        this._particleSystem.processor.updateRenderMode();
    }

    /**
     * @en When the particle generation mode is StrecthedBillboard, in the direction of movement of the particles is stretched by velocity magnitude
     * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸
     * @property {Number} velocityScale
     */
    @property({
        displayOrder: 1,
        tooltip: 'i18n:particle.velocity_scale',
    })
    public get velocityScale () {
        return this._velocityScale;
    }

    public set velocityScale (val) {
        this._velocityScale = val;
        this._particleSystem.processor.updateMaterialParams();
        // this._updateModel();
    }

    /**
     * @en When the particle generation method is StrecthedBillboard, the particles are stretched according to the particle size in the direction of motion
     * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸
     * @property {Number} lengthScale
     */
    @property({
        displayOrder: 2,
        tooltip: 'i18n:particle.length_scale',
    })
    public get lengthScale () {
        return this._lengthScale;
    }

    public set lengthScale (val) {
        this._lengthScale = val;
        this._particleSystem.processor.updateMaterialParams();
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
    /**
     * @en Particle model
     * @zh 粒子模型
     * @property {Mesh} mesh
     */
    @property({
        type: Mesh,
        displayOrder: 7,
        tooltip: 'i18n:particle.mesh',
    })
    public get mesh () {
        return this._mesh;
    }

    public set mesh (val) {
        this._mesh = val;
        this._particleSystem.processor.setVertexAttributes();
    }

    /**
     * @en Particle material
     * @zh 粒子材质
     * @property {Material} particleMaterial
     */
    @property({
        type: Material,
        displayOrder: 8,
        tooltip: 'i18n:particle.particle_material',
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
     * @en Particle trail material
     * @zh 粒子轨迹材质
     * @property {Material} trailMaterial
     */
    @property({
        type: Material,
        displayOrder: 9,
        tooltip: 'i18n:particle.trail_material',
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

    @property
    private _useGPU: boolean = false;
    /**
     * @en Whether to use a GPU renderer.
     * @zh 是否使用 GPU 渲染器
     * @property {Material} trailMaterial
     */
    @property({
        displayOrder: 10,
        tooltip:'i18n:particle.use_gpu',
    })
    public get useGPU () {
        return this._useGPU;
    }

    public set useGPU (val) {
        if (this._useGPU === val) {
            return;
        }

        this._useGPU = val;
        this._switchProcessor();
    }

    private _particleSystem: any = null;

    onInit (ps: any) {
        this._particleSystem = ps;
        this._particleSystem.processor = this._useGPU ? new ParticleSystemRendererGPU(this) : new ParticleSystemRendererCPU(this);
        this._particleSystem.processor.onInit(ps);
    }

    private _switchProcessor () {
        if (this._particleSystem.processor) {
            this._particleSystem.processor.detachFromScene();
            this._particleSystem.processor.clear();
            this._particleSystem.processor = null;
        }
        this._particleSystem.processor = this._useGPU ? new ParticleSystemRendererGPU(this) : new ParticleSystemRendererCPU(this);
        this._particleSystem.processor.onInit(this._particleSystem);
        this._particleSystem.processor.onEnable();
        this._particleSystem.bindModule();
    }
}
