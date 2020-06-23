import { Material, Mesh, Texture2D } from '../../core/assets';
import { ccclass, property } from '../../core/data/class-decorator';
import { RenderMode} from '../enum';
import ParticleSystemRendererCPU from './particle-system-renderer-cpu';
import ParticleSystemRendererGPU from './particle-system-renderer-gpu';
import { director } from '../../core/director';
import { GFXDevice, GFXFeature } from '../../core/gfx/device';
import { legacyCC } from '../../core/global-exports';

function isSupportGPUParticle () {
    const device: GFXDevice = director.root!.device;
    if (device.maxVertexTextureUnits >= 8 && device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
        return true;
    }

    legacyCC.warn("Maybe the device has restrictions on vertex textures or does not support float textures.");
    return false;
}

@ccclass('cc.ParticleSystemRenderer')
export default class ParticleSystemRenderer {
    /**
     * @zh 设定粒子生成模式。
     */
    @property({
        type: RenderMode,
        displayOrder: 0,
        tooltip: '设定粒子生成模式',
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
     * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸。
     */
    @property({
        displayOrder: 1,
        tooltip: '在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸',
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
     * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸。
     */
    @property({
        displayOrder: 2,
        tooltip: '在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸',
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
     * @zh 粒子发射的模型。
     */
    @property({
        type: Mesh,
        displayOrder: 7,
        tooltip: '粒子发射的模型',
    })
    public get mesh () {
        return this._mesh;
    }

    public set mesh (val) {
        this._mesh = val;
        this._particleSystem.processor.setVertexAttributes();
    }

    /**
     * @zh 粒子使用的材质。
     */
    @property({
        type: Material,
        displayOrder: 8,
        tooltip: '粒子使用的材质',
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
        tooltip: '拖尾使用的材质',
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
    private _mainTexture: Texture2D | null = null;

    public get mainTexture () {
        return this._mainTexture;
    }

    public set mainTexture (val) {
        this._mainTexture = val;
    }

    @property
    private _useGPU: boolean = false;

    @property({
        displayOrder: 10,
        tooltip:'是否启用GPU粒子',
    })
    public get useGPU () {
        return this._useGPU;
    }

    public set useGPU (val) {
        if (this._useGPU === val) {
            return;
        }

        if (!isSupportGPUParticle()) {
            this._useGPU = false;
        } else {
            this._useGPU = val;
        }

        this._switchProcessor();
    }

    private _particleSystem: any = null;

    onInit (ps: any) {
        this._particleSystem = ps;
        const useGPU = this._useGPU && isSupportGPUParticle();
        this._particleSystem.processor = useGPU ? new ParticleSystemRendererGPU(this) : new ParticleSystemRendererCPU(this);
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
