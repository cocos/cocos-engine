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

// eslint-disable-next-line max-len
import { ccclass, help, executeInEditMode, executionOrder, menu, tooltip, displayOrder, type, range, displayName, formerlySerializedAs, override, radian, serializable, visible, boolean } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Renderer } from '../core/components/renderer';
import { ModelRenderer } from '../core/components/model-renderer';
import { Material } from '../core/assets/material';
import { Mat4, pseudoRandom, Quat, random, randomRangeInt, SetRandomSeed, SetUseRandomSeed, Vec2, Vec3 } from '../core/math';
import { INT_MAX } from '../core/math/bits';
import { scene } from '../core/renderer';
import ColorOverLifetimeModule from './animator/color-overtime';
import CurveRange, { Mode } from './animator/curve-range';
import ForceOvertimeModule from './animator/force-overtime';
import GradientRange from './animator/gradient-range';
import LimitVelocityOvertimeModule from './animator/limit-velocity-overtime';
import RotationOvertimeModule from './animator/rotation-overtime';
import SizeOvertimeModule from './animator/size-overtime';
import TextureAnimationModule from './animator/texture-animation';
import VelocityOvertimeModule from './animator/velocity-overtime';
import Burst from './burst';
import ShapeModule from './emitter/shape-module';
import { CullingMode, Space } from './enum';
import { particleEmitZAxis } from './particle-general-function';
import ParticleSystemRenderer from './renderer/particle-system-renderer-data';
import TrailModule from './renderer/trail';
import { IParticleSystemRenderer } from './renderer/particle-system-renderer-base';
import { Particle, PARTICLE_MODULE_PROPERTY } from './particle';
import { legacyCC } from '../core/global-exports';
import { TransformBit } from '../core/scene-graph/node-enum';
import { AABB, intersect } from '../core/geometry';
import { Camera } from '../core/renderer/scene';
import { ParticleCuller } from './particle-culler';
import { NoiseModule } from './animator/noise-module';
import { ForceFieldModule } from './animator/force-field-module';
import InheritVelocityModule from './animator/inherit-velocity';
import { CustomDataModule } from './animator/custom-data';
import { RotationSpeedModule } from './animator/rotation-speed';
import { SizeSpeedModule } from './animator/size-speed';
import { ColorSpeedModule } from './animator/color-speed';
import { CCBoolean, CCFloat, CCInteger, CCObject, Node } from '../core';

const _world_mat = new Mat4();
const _world_rol = new Quat();
const _world_scale = new Vec3();
const _local_scale = new Vec3();
const _temp_trans = new Mat4();
const _temp_pos = new Vec3();
const _temp_rol = new Quat();
const _temp_velo = new Vec3();
const _inv_mat = new Mat4();
const _inv_rol = new Quat();
const _local_mat = new Mat4();

const superMaterials = Object.getOwnPropertyDescriptor(Renderer.prototype, 'sharedMaterials')!;

@ccclass('cc.ParticleSystem')
@help('i18n:cc.ParticleSystem')
@menu('Effects/ParticleSystem')
@executionOrder(99)
@executeInEditMode
export class ParticleSystem extends ModelRenderer {
    /**
     * @zh 粒子系统能生成的最大粒子数量。
     */
    @range([0, Number.POSITIVE_INFINITY])
    @displayOrder(1)
    @tooltip('i18n:particle_system.capacity')
    public get capacity () {
        return this._capacity;
    }

    public set capacity (val) {
        this._capacity = Math.floor(val > 0 ? val : 0);
        // @ts-expect-error private property access
        if (this.processor && this.processor._model) {
            // @ts-expect-error private property access
            this.processor._model.setCapacity(this._capacity);
        }
    }

    /**
     * @zh 粒子初始颜色。
     */
    @type(GradientRange)
    @serializable
    @displayOrder(8)
    @tooltip('i18n:particle_system.startColor')
    public startColor = new GradientRange();

    @type(Space)
    @serializable
    @displayOrder(9)
    @tooltip('i18n:particle_system.scaleSpace')
    public scaleSpace = Space.Local;

    @serializable
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSize3D')
    public startSize3D = false;

    /**
     * @zh 粒子初始大小。
     */
    @formerlySerializedAs('startSize')
    @range([0, 1])
    @type(CurveRange)
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeX')
    public startSizeX = new CurveRange();

    /**
     * @zh 粒子初始大小。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeY')
    @visible(function (this: ParticleSystem): boolean { return this.startSize3D; })
    public startSizeY = new CurveRange();

    /**
     * @zh 粒子初始大小。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeZ')
    @visible(function (this: ParticleSystem): boolean { return this.startSize3D; })
    public startSizeZ = new CurveRange();

    /**
     * @zh 粒子初始速度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(11)
    @tooltip('i18n:particle_system.startSpeed')
    public startSpeed = new CurveRange();

    @serializable
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotation3D')
    public startRotation3D = false;

    /**
     * @zh 粒子初始旋转角度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotationX')
    @visible(function (this: ParticleSystem): boolean { return this.startRotation3D; })
    public startRotationX = new CurveRange();

    /**
     * @zh 粒子初始旋转角度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotationY')
    @visible(function (this: ParticleSystem): boolean { return this.startRotation3D; })
    public startRotationY = new CurveRange();

    /**
     * @zh 粒子初始旋转角度。
     */
    @type(CurveRange)
    @formerlySerializedAs('startRotation')
    @range([-1, 1])
    @radian
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotationZ')
    @visible(function (this: ParticleSystem): boolean { return this.startRotation3D; })
    public startRotationZ = new CurveRange();

    /**
     * @zh 粒子系统开始运行后，延迟粒子发射的时间。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(6)
    @tooltip('i18n:particle_system.startDelay')
    public startDelay = new CurveRange();

    /**
     * @zh 粒子生命周期。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(7)
    @tooltip('i18n:particle_system.startLifetime')
    public startLifetime = new CurveRange();

    /**
     * @zh 粒子系统运行时间。
     */
    @serializable
    @displayOrder(0)
    @tooltip('i18n:particle_system.duration')
    public duration = 5.0;

    /**
     * @zh 粒子系统是否循环播放。
     */
    @serializable
    @displayOrder(2)
    @tooltip('i18n:particle_system.loop')
    public loop = true;

    /**
     * @zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）。
     */
    @displayOrder(3)
    @tooltip('i18n:particle_system.prewarm')
    get prewarm () {
        return this._prewarm;
    }

    set prewarm (val) {
        if (val === true && this.loop === false) {
            // console.warn('prewarm only works if loop is also enabled.');
        }
        this._prewarm = val;
    }

    /**
     * @zh 选择粒子系统所在的坐标系[[Space]]。<br>
     */
    @type(Space)
    @serializable
    @displayOrder(4)
    @tooltip('i18n:particle_system.simulationSpace')
    get simulationSpace () {
        return this._simulationSpace;
    }

    set simulationSpace (val) {
        if (val !== this._simulationSpace) {
            this._simulationSpace = val;
            if (this.processor) {
                this.processor.updateMaterialParams();
                this.processor.updateTrailMaterial();
            }
        }
    }

    /**
     * @zh 控制整个粒子系统的更新速度。
     */
    @serializable
    @displayOrder(5)
    @tooltip('i18n:particle_system.simulationSpeed')
    public simulationSpeed = 1.0;

    /**
     * @zh 粒子系统加载后是否自动开始播放。
     */
    @serializable
    @displayOrder(2)
    @tooltip('i18n:particle_system.playOnAwake')
    public playOnAwake = true;

    /**
     * @zh 粒子受重力影响的重力系数。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(13)
    @tooltip('i18n:particle_system.gravityModifier')
    public gravityModifier = new CurveRange();

    // emission module
    /**
     * @zh 每秒发射的粒子数。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(14)
    @tooltip('i18n:particle_system.rateOverTime')
    public rateOverTime = new CurveRange();

    /**
     * @zh 每移动单位距离发射的粒子数。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(15)
    @tooltip('i18n:particle_system.rateOverDistance')
    public rateOverDistance = new CurveRange();

    /**
     * @zh 设定在指定时间发射指定数量的粒子的 burst 的数量。
     */
    @type([Burst])
    @serializable
    @displayOrder(16)
    @tooltip('i18n:particle_system.bursts')
    public bursts: Burst[] = [];

    /**
     * @en Enable particle culling switch. Open it to enable particle culling. If enabled will generate emitter bounding box and emitters outside the frustum will be culled.
     * @zh 粒子剔除开关，如果打开将会生成一个发射器包围盒，包围盒在相机外发射器将被剔除。
     */
    @type(CCBoolean)
    @displayOrder(27)
    @tooltip('i18n:particle_system.renderCulling')
    set renderCulling (value: boolean) {
        this._renderCulling = value;
        if (value) {
            if (!this._boundingBox) {
                this._boundingBox = new AABB();
                this._calculateBounding(false);
            }
        }
    }

    get renderCulling () {
        return this._renderCulling;
    }

    @serializable
    private _renderCulling = false;

    /**
     * @en Particle culling mode option. Includes pause, pause and catchup, always simulate.
     * @zh 粒子剔除模式选择。包括暂停模拟，暂停以后快进继续以及不间断模拟。
     */
    @type(CullingMode)
    @displayOrder(17)
    @tooltip('i18n:particle_system.cullingMode')
    get cullingMode () {
        return this._cullingMode;
    }

    set cullingMode (value: number) {
        this._cullingMode = value;
    }

    @serializable
    _cullingMode = CullingMode.Pause;

    public static CullingMode = CullingMode;

    /**
     * @en Particle bounding box half width.
     * @zh 粒子包围盒半宽。
     */
    @type(CCFloat)
    @displayOrder(17)
    @tooltip('i18n:particle_system.aabbHalfX')
    get aabbHalfX () {
        const res = this.getBoundingX();
        if (res) {
            return res;
        } else {
            return 0;
        }
    }

    set aabbHalfX (value: number) {
        this.setBoundingX(value);
    }

    @serializable
    private _aabbHalfX = 0;

    /**
     * @en Particle bounding box half height.
     * @zh 粒子包围盒半高。
     */
    @type(CCFloat)
    @displayOrder(17)
    @tooltip('i18n:particle_system.aabbHalfY')
    get aabbHalfY () {
        const res = this.getBoundingY();
        if (res) {
            return res;
        } else {
            return 0;
        }
    }

    set aabbHalfY (value: number) {
        this.setBoundingY(value);
    }

    @serializable
    private _aabbHalfY = 0;

    /**
     * @en Particle bounding box half depth.
     * @zh 粒子包围盒半深。
     */
    @type(CCFloat)
    @displayOrder(17)
    @tooltip('i18n:particle_system.aabbHalfZ')
    get aabbHalfZ () {
        const res = this.getBoundingZ();
        if (res) {
            return res;
        } else {
            return 0;
        }
    }

    set aabbHalfZ (value: number) {
        this.setBoundingZ(value);
    }

    @serializable
    private _aabbHalfZ = 0;

    /**
     * @en Culling module data before serialize.
     * @zh 序列化之前剔除不需要的模块数据。
     */
    @displayOrder(28)
    @tooltip('i18n:particle_system.dataCulling')
    get dataCulling () {
        return this._dataCulling;
    }

    set dataCulling (value: boolean) {
        this._dataCulling = value;
    }

    @serializable
    @formerlySerializedAs('enableCulling')
    private _dataCulling = false;

    @override
    @visible(false)
    @type(Material)
    @serializable
    @displayName('Materials')
    get sharedMaterials () {
        // if we don't create an array copy, the editor will modify the original array directly.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return superMaterials.get!.call(this);
    }

    set sharedMaterials (val) {
        // @ts-expect-error private property access
        superMaterials.set.call(this, val);
    }

    // color over lifetime module
    @type(ColorOverLifetimeModule)
    _colorOverLifetimeModule: ColorOverLifetimeModule | null = null;
    /**
     * @zh 颜色控制模块。
     */
    @type(ColorOverLifetimeModule)
    @displayOrder(23)
    @tooltip('i18n:particle_system.colorOverLifetimeModule')
    public get colorOverLifetimeModule () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (!this._colorOverLifetimeModule) {
                this._colorOverLifetimeModule = new ColorOverLifetimeModule();
                this._colorOverLifetimeModule.bindTarget(this.processor);
            }
        }
        return this._colorOverLifetimeModule;
    }

    public set colorOverLifetimeModule (val) {
        if (!val) return;
        this._colorOverLifetimeModule = val;
    }

    // shape module
    @type(ShapeModule)
    _shapeModule: ShapeModule | null = null;
    /**
     * @zh 粒子发射器模块。
     */
    @type(ShapeModule)
    @displayOrder(17)
    @tooltip('i18n:particle_system.shapeModule')
    public get shapeModule () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (!this._shapeModule) {
                this._shapeModule = new ShapeModule();
                this._shapeModule.onInit(this);
            }
        }
        return this._shapeModule;
    }

    public set shapeModule (val) {
        if (!val) return;
        this._shapeModule = val;
    }

    // size over lifetime module
    @type(SizeOvertimeModule)
    _sizeOvertimeModule: SizeOvertimeModule | null = null;
    /**
     * @zh 粒子大小模块。
     */
    @type(SizeOvertimeModule)
    @displayOrder(21)
    @tooltip('i18n:particle_system.sizeOvertimeModule')
    public get sizeOvertimeModule () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (!this._sizeOvertimeModule) {
                this._sizeOvertimeModule = new SizeOvertimeModule();
                this._sizeOvertimeModule.bindTarget(this.processor);
            }
        }
        return this._sizeOvertimeModule;
    }

    public set sizeOvertimeModule (val) {
        if (!val) return;
        this._sizeOvertimeModule = val;
    }

    // velocity overtime module
    @type(VelocityOvertimeModule)
    _velocityOvertimeModule: VelocityOvertimeModule | null = null;
    /**
     * @zh 粒子速度模块。
     */
    @type(VelocityOvertimeModule)
    @displayOrder(18)
    @tooltip('i18n:particle_system.velocityOvertimeModule')
    public get velocityOvertimeModule () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (!this._velocityOvertimeModule) {
                this._velocityOvertimeModule = new VelocityOvertimeModule();
                this._velocityOvertimeModule.bindTarget(this.processor);
            }
        }
        return this._velocityOvertimeModule;
    }

    public set velocityOvertimeModule (val) {
        if (!val) return;
        this._velocityOvertimeModule = val;
    }

    // force overTime module
    @type(ForceOvertimeModule)
    _forceOvertimeModule: ForceOvertimeModule | null = null;
    /**
     * @zh 粒子加速度模块。
     */
    @type(ForceOvertimeModule)
    @displayOrder(19)
    @tooltip('i18n:particle_system.forceOvertimeModule')
    public get forceOvertimeModule () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (!this._forceOvertimeModule) {
                this._forceOvertimeModule = new ForceOvertimeModule();
                this._forceOvertimeModule.bindTarget(this.processor);
            }
        }
        return this._forceOvertimeModule;
    }

    public set forceOvertimeModule (val) {
        if (!val) return;
        this._forceOvertimeModule = val;
    }

    // limit velocity overtime module
    @type(LimitVelocityOvertimeModule)
    _limitVelocityOvertimeModule: LimitVelocityOvertimeModule | null = null;

    /**
     * @zh 粒子限制速度模块（只支持 CPU 粒子）。
     */
    @type(LimitVelocityOvertimeModule)
    @displayOrder(20)
    @tooltip('i18n:particle_system.limitVelocityOvertimeModule')
    public get limitVelocityOvertimeModule () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (!this._limitVelocityOvertimeModule) {
                this._limitVelocityOvertimeModule = new LimitVelocityOvertimeModule();
                this._limitVelocityOvertimeModule.bindTarget(this.processor);
            }
        }
        return this._limitVelocityOvertimeModule;
    }

    public set limitVelocityOvertimeModule (val) {
        if (!val) return;
        this._limitVelocityOvertimeModule = val;
    }

    // rotation overtime module
    @type(RotationOvertimeModule)
    _rotationOvertimeModule: RotationOvertimeModule | null = null;
    /**
     * @zh 粒子旋转模块。
     */
    @type(RotationOvertimeModule)
    @displayOrder(22)
    @tooltip('i18n:particle_system.rotationOvertimeModule')
    public get rotationOvertimeModule () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (!this._rotationOvertimeModule) {
                this._rotationOvertimeModule = new RotationOvertimeModule();
                this._rotationOvertimeModule.bindTarget(this.processor);
            }
        }
        return this._rotationOvertimeModule;
    }

    public set rotationOvertimeModule (val) {
        if (!val) return;
        this._rotationOvertimeModule = val;
    }

    // texture animation module
    @type(TextureAnimationModule)
    _textureAnimationModule: TextureAnimationModule | null = null;
    /**
     * @zh 贴图动画模块。
     */
    @type(TextureAnimationModule)
    @displayOrder(24)
    @tooltip('i18n:particle_system.textureAnimationModule')
    public get textureAnimationModule () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (!this._textureAnimationModule) {
                this._textureAnimationModule = new TextureAnimationModule();
                this._textureAnimationModule.bindTarget(this.processor);
            }
        }
        return this._textureAnimationModule;
    }

    public set textureAnimationModule (val) {
        if (!val) return;
        this._textureAnimationModule = val;
    }

    // noise module
    @type(NoiseModule)
    private _noiseModule: NoiseModule | null = null;

    @type(NoiseModule)
    @displayOrder(24)
    public get noiseModule () {
        if (EDITOR) {
            if (!this._noiseModule) {
                this._noiseModule = new NoiseModule();
                this._noiseModule.bindTarget(this.processor);
            }
        }
        return this._noiseModule;
    }

    public set noiseModule (val) {
        if (!val) return;
        this._noiseModule = val;
    }

    // force field module
    @type(ForceFieldModule)
    private _forceFieldModule: ForceFieldModule | null = null;

    @type(ForceFieldModule)
    @displayOrder(24)
    public get forceFieldModule () {
        if (EDITOR) {
            if (!this._forceFieldModule) {
                this._forceFieldModule = new ForceFieldModule();
                this._forceFieldModule.bindTarget(this.processor);
            }
        }
        return this._forceFieldModule;
    }

    public set forceFieldModule (val) {
        if (!val) return;
        this._forceFieldModule = val;
    }

    @type(InheritVelocityModule)
    private _inheritVelocityModule: InheritVelocityModule | null = null;

    @type(InheritVelocityModule)
    @displayOrder(25)
    public get inheritVelocityModule () {
        if (EDITOR) {
            if (!this._inheritVelocityModule) {
                this._inheritVelocityModule = new InheritVelocityModule();
                this._inheritVelocityModule.bindTarget(this.processor);
            }
        }
        return this._inheritVelocityModule;
    }

    public set inheritVelocityModule (val) {
        if (!val) return;
        this._inheritVelocityModule = val;
    }

    @type(CustomDataModule)
    private _customDataModule: CustomDataModule | null = null;

    @type(CustomDataModule)
    @displayOrder(26)
    public get customDataModule () {
        if (EDITOR) {
            if (!this._customDataModule) {
                this._customDataModule = new CustomDataModule();
                this._customDataModule.bindTarget(this.processor);
            }
        }
        if (this._customDataModule && this.processor) {
            this.processor.setUseCustom(this._customDataModule._enable);
            this.processor.updateRenderMode();
        }
        return this._customDataModule;
    }

    public set customDataModule (val) {
        if (!val) return;
        this._customDataModule = val;
    }

    @type(RotationSpeedModule)
    private _rotationSpeedModule: RotationSpeedModule | null = null;

    @type(RotationSpeedModule)
    @displayOrder(27)
    public get rotationSpeedModule () {
        if (EDITOR) {
            if (!this._rotationSpeedModule) {
                this._rotationSpeedModule = new RotationSpeedModule();
                this._rotationSpeedModule.bindTarget(this.processor);
            }
        }
        return this._rotationSpeedModule;
    }

    public set rotationSpeedModule (val) {
        if (!val) return;
        this._rotationSpeedModule = val;
    }

    @type(SizeSpeedModule)
    private _sizeSpeedModule: SizeSpeedModule | null = null;

    @type(SizeSpeedModule)
    @displayOrder(28)
    public get sizeSpeedModule () {
        if (EDITOR) {
            if (!this._sizeSpeedModule) {
                this._sizeSpeedModule = new SizeSpeedModule();
                this._sizeSpeedModule.bindTarget(this.processor);
            }
        }
        return this._sizeSpeedModule;
    }

    public set sizeSpeedModule (val) {
        if (!val) return;
        this._sizeSpeedModule = val;
    }

    @type(ColorSpeedModule)
    private _colorSpeedModule: ColorSpeedModule | null = null;

    @type(ColorSpeedModule)
    @displayOrder(29)
    public get colorSpeedModule () {
        if (EDITOR) {
            if (!this._colorSpeedModule) {
                this._colorSpeedModule = new ColorSpeedModule();
                this._colorSpeedModule.bindTarget(this.processor);
            }
        }
        return this._colorSpeedModule;
    }

    public set colorSpeedModule (val) {
        if (!val) return;
        this._colorSpeedModule = val;
    }

    // trail module
    @type(TrailModule)
    _trailModule: TrailModule | null = null;
    /**
     * @zh 粒子轨迹模块。
     */
    @type(TrailModule)
    @displayOrder(25)
    @tooltip('i18n:particle_system.trailModule')
    public get trailModule () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (!this._trailModule) {
                this._trailModule = new TrailModule();
            }
        }
        return this._trailModule;
    }

    public set trailModule (val) {
        if (!val) return;
        this._trailModule = val;
    }

    // particle system renderer
    @type(ParticleSystemRenderer)
    @serializable
    @displayOrder(26)
    @tooltip('i18n:particle_system.renderer')
    public renderer: ParticleSystemRenderer = new ParticleSystemRenderer();

    @type(CCBoolean)
    public get useSubEmitter () {
        return this._useSubEmitter;
    }

    public set useSubEmitter (value) {
        this._useSubEmitter = value;
    }

    @serializable
    private _useSubEmitter = false;

    @type(CCBoolean)
    public get subBase () {
        return this._subBase;
    }

    public set subBase (value) {
        this._subBase = value;
    }

    @serializable
    private _subBase = false;

    @type(CCBoolean)
    @visible(function (this: ParticleSystem): boolean { return this._subBase; })
    public get actDie () {
        return this._actDie;
    }

    public set actDie (value) {
        this._actDie = value;
    }

    @serializable
    private _actDie = false;

    @type(CCBoolean)
    @visible(function (this: ParticleSystem): boolean { return this._subBase; })
    public get inheritColor () {
        return this._inheritColor;
    }

    public set inheritColor (value) {
        this._inheritColor = value;
    }

    @serializable
    private _inheritColor = false;

    @type(CCFloat)
    @visible(function (this: ParticleSystem): boolean { return this._subBase; })
    public get subPercent () {
        return this._subPercent;
    }

    public set subPercent (value) {
        this._subPercent = value;
    }

    @serializable
    private _useSeed = false;

    @type(CCBoolean)
    public get useSeed () {
        return this._useSeed;
    }

    public set useSeed (val) {
        this._useSeed = val;
        SetUseRandomSeed(this.useSeed);
    }

    @serializable
    private _randomSeed = 10;

    @type(CCInteger)
    @visible(function (this: ParticleSystem): boolean { return this._useSeed; })
    public get randomSeed () {
        return this._randomSeed;
    }

    public set randomSeed (val) {
        this._randomSeed = val;
    }

    @serializable
    private _subPercent = 1.0;

    private copyEmitter (subSrc: ParticleSystem, sub: ParticleSystem, cap: number) {
        sub.loop = subSrc.loop;
        sub.capacity = cap;
        sub.playOnAwake = subSrc.playOnAwake;
        sub.prewarm = subSrc.prewarm;
        sub.simulationSpace = subSrc.simulationSpace;
        sub.scaleSpace = subSrc.scaleSpace;
        sub.actDie = subSrc.actDie;
        sub.inheritColor = subSrc.inheritColor;
        sub.startSize3D = subSrc.startSize3D;
        sub.startRotation3D = subSrc.startRotation3D;
        sub.simulationSpeed = subSrc.simulationSpeed;
        sub.subPercent = subSrc.subPercent;
        Object.assign(sub.startColor, subSrc.startColor);
        Object.assign(sub.startDelay, subSrc.startDelay);
        Object.assign(sub.startLifetime, subSrc.startLifetime);
        Object.assign(sub.rateOverTime, subSrc.rateOverTime);
        Object.assign(sub.rateOverDistance, subSrc.rateOverDistance);
        Object.assign(sub.startSpeed, subSrc.startSpeed);
        Object.assign(sub.startSizeX, subSrc.startSizeX);
        Object.assign(sub.startSizeY, subSrc.startSizeY);
        Object.assign(sub.startSizeZ, subSrc.startSizeZ);
        Object.assign(sub.startRotationX, subSrc.startRotationX);
        Object.assign(sub.startRotationY, subSrc.startRotationY);
        Object.assign(sub.startRotationZ, subSrc.startRotationZ);
        Object.assign(sub.gravityModifier, subSrc.gravityModifier);

        if (subSrc._colorOverLifetimeModule) {
            sub._colorOverLifetimeModule = new ColorOverLifetimeModule();
            Object.assign(sub._colorOverLifetimeModule, subSrc._colorOverLifetimeModule);
            sub._colorOverLifetimeModule.bindTarget(sub.processor);
        }
        if (subSrc._sizeOvertimeModule) {
            sub._sizeOvertimeModule = new SizeOvertimeModule();
            Object.assign(sub._sizeOvertimeModule, subSrc._sizeOvertimeModule);
            sub._sizeOvertimeModule.bindTarget(sub.processor);
        }
        if (subSrc._velocityOvertimeModule) {
            sub._velocityOvertimeModule = new VelocityOvertimeModule();
            Object.assign(sub._velocityOvertimeModule, subSrc._velocityOvertimeModule);
            sub._velocityOvertimeModule.bindTarget(sub.processor);
        }
        if (subSrc._forceOvertimeModule) {
            sub._forceOvertimeModule = new ForceOvertimeModule();
            Object.assign(sub._forceOvertimeModule, subSrc._forceOvertimeModule);
            sub._forceOvertimeModule.bindTarget(sub.processor);
        }
        if (subSrc._limitVelocityOvertimeModule) {
            sub._limitVelocityOvertimeModule = new LimitVelocityOvertimeModule();
            Object.assign(sub._limitVelocityOvertimeModule, subSrc._limitVelocityOvertimeModule);
            sub._limitVelocityOvertimeModule.bindTarget(sub.processor);
        }
        if (subSrc._rotationOvertimeModule) {
            sub._rotationOvertimeModule = new RotationOvertimeModule();
            Object.assign(sub._rotationOvertimeModule, subSrc._rotationOvertimeModule);
            sub._rotationOvertimeModule.bindTarget(sub.processor);
        }
        if (subSrc._textureAnimationModule) {
            sub._textureAnimationModule = new TextureAnimationModule();
            Object.assign(sub._textureAnimationModule, subSrc._textureAnimationModule);
            sub._textureAnimationModule.bindTarget(sub.processor);
        }

        for (let b = 0; b < subSrc.bursts.length; ++b) {
            const subburst = new Burst();
            subburst.time = subSrc.bursts[b].time;
            subburst.repeatCount = subSrc.bursts[b].repeatCount;
            subburst.repeatInterval = subSrc.bursts[b].repeatInterval;
            Object.assign(subburst.count, subSrc.bursts[b].count);
            sub.bursts.push(subburst);
        }
        if (!sub.shapeModule && subSrc.shapeModule) {
            sub.shapeModule = new ShapeModule();
            sub.shapeModule.onInit(sub);
        }
        if (sub.shapeModule && !sub.shapeModule?.enable) {
            if (subSrc.shapeModule) {
                sub.shapeModule.shapeType = subSrc.shapeModule.shapeType;
                sub.shapeModule.position = subSrc.shapeModule.position;
                sub.shapeModule.rotation = subSrc.shapeModule.rotation;
                sub.shapeModule.scale = subSrc.shapeModule.scale;
                sub.shapeModule.arc = subSrc.shapeModule.arc;
                sub.shapeModule.angle = subSrc.shapeModule.angle;
                sub.shapeModule.emitFrom = subSrc.shapeModule.emitFrom;
                sub.shapeModule.alignToDirection = subSrc.shapeModule.alignToDirection;
                sub.shapeModule.randomDirectionAmount = subSrc.shapeModule.randomDirectionAmount;
                sub.shapeModule.sphericalDirectionAmount = subSrc.shapeModule.sphericalDirectionAmount;
                sub.shapeModule.randomPositionAmount = subSrc.shapeModule.randomPositionAmount;
                sub.shapeModule.radius = subSrc.shapeModule.radius;
                sub.shapeModule.radiusThickness = subSrc.shapeModule.radiusThickness;
                sub.shapeModule.arcMode = subSrc.shapeModule.arcMode;
                sub.shapeModule.arcSpread = subSrc.shapeModule.arcSpread;
                sub.shapeModule.arcSpeed = subSrc.shapeModule.arcSpeed;
                sub.shapeModule.length = subSrc.shapeModule.length;
                sub.shapeModule.boxThickness = subSrc.shapeModule.boxThickness;
                sub.shapeModule.enable = subSrc.shapeModule.enable;
            } else {
                sub.shapeModule.enable = false;
            }
        }

        if (subSrc.forceFieldModule) {
            if (sub.forceFieldModule) {
                for (let f = 0; f < subSrc.forceFieldModule.forceList.length; ++f) {
                    const ff = subSrc.forceFieldModule.forceList[f];
                    sub.forceFieldModule.forceList.push(ff);
                }
                sub.forceFieldModule.enable = subSrc.forceFieldModule.enable;
            }
        }

        if (subSrc.inheritVelocityModule) {
            if (sub.inheritVelocityModule) {
                sub.inheritVelocityModule.mode = subSrc.inheritVelocityModule.mode;
                Object.assign(sub.inheritVelocityModule.speedModifier, subSrc.inheritVelocityModule.speedModifier);
                sub.inheritVelocityModule.enable = subSrc.inheritVelocityModule.enable;
            }
        }

        if (subSrc.customDataModule) {
            if (sub.customDataModule) {
                sub.customDataModule.dataType1 = subSrc.customDataModule.dataType1;
                sub.customDataModule.dataType2 = subSrc.customDataModule.dataType2;
                Object.assign(sub.customDataModule.data1Color, subSrc.customDataModule.data1Color);
                Object.assign(sub.customDataModule.data2Color, subSrc.customDataModule.data2Color);
                Object.assign(sub.customDataModule.data1X, subSrc.customDataModule.data1X);
                Object.assign(sub.customDataModule.data1Y, subSrc.customDataModule.data1Y);
                Object.assign(sub.customDataModule.data1Z, subSrc.customDataModule.data1Z);
                Object.assign(sub.customDataModule.data1W, subSrc.customDataModule.data1W);
                Object.assign(sub.customDataModule.data2X, subSrc.customDataModule.data2X);
                Object.assign(sub.customDataModule.data2Y, subSrc.customDataModule.data2Y);
                Object.assign(sub.customDataModule.data2Z, subSrc.customDataModule.data2Z);
                Object.assign(sub.customDataModule.data2W, subSrc.customDataModule.data2W);
                sub.customDataModule.enable = subSrc.customDataModule.enable;
            }
        }

        if (subSrc.rotationSpeedModule) {
            if (sub.rotationSpeedModule) {
                sub.rotationSpeedModule.rotation3D = subSrc.rotationSpeedModule.rotation3D;
                Object.assign(sub.rotationSpeedModule.range, subSrc.rotationSpeedModule.range);
                Object.assign(sub.rotationSpeedModule.rotationX, subSrc.rotationSpeedModule.rotationX);
                Object.assign(sub.rotationSpeedModule.rotationY, subSrc.rotationSpeedModule.rotationY);
                Object.assign(sub.rotationSpeedModule.rotationZ, subSrc.rotationSpeedModule.rotationZ);
                sub.rotationSpeedModule.enable = subSrc.rotationSpeedModule.enable;
            }
        }

        if (subSrc.sizeSpeedModule) {
            if (sub.sizeSpeedModule) {
                sub.sizeSpeedModule.size3D = subSrc.sizeSpeedModule.size3D;
                Object.assign(sub.sizeSpeedModule.sizeX, subSrc.sizeSpeedModule.sizeX);
                Object.assign(sub.sizeSpeedModule.sizeY, subSrc.sizeSpeedModule.sizeY);
                Object.assign(sub.sizeSpeedModule.sizeZ, subSrc.sizeSpeedModule.sizeZ);
                sub.sizeSpeedModule.rangeX = subSrc.sizeSpeedModule.rangeX;
                sub.sizeSpeedModule.rangeY = subSrc.sizeSpeedModule.rangeY;
                sub.sizeSpeedModule.enable = subSrc.sizeSpeedModule.enable;
            }
        }

        if (subSrc.colorSpeedModule) {
            if (sub.colorSpeedModule) {
                Object.assign(sub.colorSpeedModule.color, subSrc.colorSpeedModule.color);
                sub.colorSpeedModule.rangeX = subSrc.colorSpeedModule.rangeX;
                sub.colorSpeedModule.rangeY = subSrc.colorSpeedModule.rangeY;
                sub.colorSpeedModule.enable = subSrc.colorSpeedModule.enable;
            }
        }

        if (subSrc.noiseModule) {
            if (sub.noiseModule) {
                sub.noiseModule.strengthX = subSrc.noiseModule.strengthX;
                sub.noiseModule.strengthY = subSrc.noiseModule.strengthY;
                sub.noiseModule.strengthZ = subSrc.noiseModule.strengthZ;
                sub.noiseModule.noiseSpeedX = subSrc.noiseModule.noiseSpeedX;
                sub.noiseModule.noiseSpeedY = subSrc.noiseModule.noiseSpeedY;
                sub.noiseModule.noiseSpeedZ = subSrc.noiseModule.noiseSpeedZ;
                sub.noiseModule.noiseFrequency = subSrc.noiseModule.noiseFrequency;
                sub.noiseModule.remapX = subSrc.noiseModule.remapX;
                sub.noiseModule.remapY = subSrc.noiseModule.remapY;
                sub.noiseModule.remapZ = subSrc.noiseModule.remapZ;
                sub.noiseModule.octaves = subSrc.noiseModule.octaves;
                sub.noiseModule.octaveMultiplier = subSrc.noiseModule.octaveMultiplier;
                sub.noiseModule.octaveScale = subSrc.noiseModule.octaveScale;
                sub.noiseModule.enable = subSrc.noiseModule.enable;
            }
        }

        sub.setMaterial(subSrc.getMaterial(1), 1);

        if (subSrc._trailModule) {
            sub.trailModule = new TrailModule();
            if (sub._trailModule) {
                sub._trailModule.onInit(sub);
                sub._trailModule.updateMaterial();
                sub._trailModule.enable = subSrc._trailModule.enable;
                sub._trailModule.onEnable();
                sub._trailModule.mode = subSrc._trailModule.mode;
                sub._trailModule.textureMode = subSrc._trailModule.textureMode;
                sub._trailModule.widthFromParticle = subSrc._trailModule.widthFromParticle;
                sub._trailModule.colorFromParticle = subSrc._trailModule.colorFromParticle;
                sub._trailModule.existWithParticles = subSrc._trailModule.existWithParticles;
                sub._trailModule.minParticleDistance = subSrc._trailModule.minParticleDistance;
                sub._trailModule.space = subSrc._trailModule.space;
                Object.assign(sub._trailModule.lifeTime, subSrc._trailModule.lifeTime);
                Object.assign(sub._trailModule.widthRatio, subSrc._trailModule.widthRatio);
                Object.assign(sub._trailModule.colorOverTrail, subSrc._trailModule.colorOverTrail);
                Object.assign(sub._trailModule.colorOvertime, subSrc._trailModule.colorOvertime);
            }
        }

        sub.renderer.cpuMaterial = subSrc.renderer.cpuMaterial;
        sub.renderer.alignSpace = subSrc.renderer.alignSpace;
        sub.renderer.mesh = subSrc.renderer.mesh;
        sub.renderer.renderMode = subSrc.renderer.renderMode;
    }

    private genSubEmitter (base: ParticleSystem, i: number, parent: ParticleSystem, subIndex: number) {
        const subNode = new Node(base.name + i.toString());
        subNode.setParent(parent.node);
        subNode.addComponent(ParticleSystem);
        subNode.setRotation(parent.node.children[subIndex].rotation);
        const sub = subNode.components[0] as ParticleSystem;
        sub._parentEmitter = parent;

        this.copyEmitter(base, sub, parent.capacity * base.capacity);

        sub.name = base.name + i.toString();
        sub.stop();
        parent.addSubEmitter(sub);
        // sub.node._objFlags |= CCObject.Flags.HideInHierarchy;

        for (let bs = 0; bs < base.node.children.length; ++bs) {
            const progenyBaseNode = base.node.children[bs];
            if (progenyBaseNode.components.length > 0 && progenyBaseNode.components[0] instanceof ParticleSystem) {
                const progenySrc: ParticleSystem = progenyBaseNode.components[0];
                if (progenySrc.subBase) {
                    const progenyName = `progenyBase:${progenySrc.name}${i.toString()}`;
                    const progenyNode = new Node(progenyName);
                    progenyNode.setParent(subNode);
                    progenyNode.addComponent(ParticleSystem);
                    progenyNode.setRotation(base.node.children[bs].rotation);
                    const progeny = progenyNode.components[0] as ParticleSystem;
                    progeny._parentEmitter = sub;

                    this.copyEmitter(progenySrc, progeny, progenySrc.capacity);

                    progeny.name = progenyName;
                    progeny.stop();
                    progenyNode.active = false;
                    progeny.subBase = progenySrc.subBase;
                    // progeny.node._objFlags |= CCObject.Flags.HideInHierarchy;
                }
            }
        }

        return sub;
    }

    private refreshSubemitters () {
        if (!this._useSubEmitter) {
            this.removeSubEmitters(this);
        } else {
            this.createSubEmitterByBase(this);
        }
    }

    private createSubEmitterByBase (ps: ParticleSystem) {
        if (ps._subEmitters.length === 0) {
            for (let sub = 0; sub < ps.node.children.length; ++sub) {
                const baseNode = ps.node.children[sub];
                if (baseNode.components.length > 0 && baseNode.components[0] instanceof ParticleSystem) {
                    const base: ParticleSystem = baseNode.components[0];
                    if (base.subBase) {
                        ps._baseEmitters.push(base);
                        const cap = 1;
                        for (let i = 0; i < cap; ++i) {
                            const subEmit = ps.genSubEmitter(base, i, ps, sub);
                            subEmit._useSubEmitter = base._useSubEmitter;
                        }
                    }
                }
            }
        }
    }

    private removeSubEmitters (ps: ParticleSystem) {
        if (ps._subEmitters.length > 0) {
            while (ps._subEmitters.length > 0) {
                const subRemove = ps._subEmitters.pop();
                if (subRemove) {
                    this.removeSubEmitters(subRemove);
                    subRemove.node.parent?.removeChild(subRemove.node);
                    subRemove.destroy();
                }
            }
            ps._baseEmitters = [];
            if (ps.processor) {
                ps.processor.clearSubemitter();
            }
        }
    }

    /**
     * @ignore
     */
    private _isPlaying: boolean;
    private _isPaused: boolean;
    private _isStopped: boolean;
    private _isEmitting: boolean;
    private _needRefresh: boolean;

    private _time: number;  // playback position in seconds.
    private _emitRateTimeCounter: number;
    private _emitRateDistanceCounter: number;
    private _oldWPos: Vec3;
    private _curWPos: Vec3;

    private _boundingBox: AABB | null;
    private _culler: ParticleCuller | null;
    private _oldPos: Vec3 | null;
    private _curPos: Vec3 | null;
    private _isCulled: boolean;
    private _isSimulating: boolean;

    private _customData1: Vec2;
    private _customData2: Vec2;

    @serializable
    private _subEmitters: ParticleSystem[]; // array of { emitter: ParticleSystem, type: 'birth', 'collision' or 'death'}

    @serializable
    private _baseEmitters: ParticleSystem[];

    @serializable
    private _parentEmitter: ParticleSystem | null;

    private _needAttach: boolean;

    private _trigged: boolean;

    @serializable
    private _prewarm = false;

    @serializable
    private _capacity = 100;

    @serializable
    private _simulationSpace = Space.Local;

    public processor: IParticleSystemRenderer = null!;

    constructor () {
        super();

        this.rateOverTime.constant = 10;
        this.startLifetime.constant = 5;
        this.startSizeX.constant = 1;
        this.startSpeed.constant = 5;

        // internal status
        this._isPlaying = false;
        this._isPaused = false;
        this._isStopped = true;
        this._isEmitting = false;
        this._needRefresh = true;
        this._needAttach = false;

        this._time = 0.0;  // playback position in seconds.
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
        this._oldWPos = new Vec3();
        this._curWPos = new Vec3();

        this._boundingBox = null;
        this._culler = null;
        this._oldPos = null;
        this._curPos = null;
        this._isCulled = false;
        this._isSimulating = true;

        this._customData1 = new Vec2();
        this._customData2 = new Vec2();

        this._subEmitters = []; // array of { emitter: ParticleSystem, type: 'birth', 'collision' or 'death'}
        this._baseEmitters = [];
        this._parentEmitter = null;
        this._trigged = false;

        SetUseRandomSeed(this.useSeed);
        SetRandomSeed(this.randomSeed);
    }

    public onFocusInEditor () {
        this.renderer.create(this);
    }

    public onLoad () {
        // HACK, TODO
        this.renderer.onInit(this);
        if (this._shapeModule) this._shapeModule.onInit(this);
        if (this._trailModule && !this.renderer.useGPU && this._trailModule.enable) {
            this._trailModule.onInit(this);
        }
        this.bindModule();
        this._resetPosition();

        // this._system.add(this);
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _onMaterialModified (index: number, material: Material) {
        if (this.processor !== null) {
            this.processor.onMaterialModified(index, material);
        }
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _onRebuildPSO (index: number, material: Material) {
        this.processor.onRebuildPSO(index, material);
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _collectModels (): scene.Model[] {
        this._models.length = 0;
        this._models.push((this.processor as any)._model);
        if (this._trailModule && this._trailModule.enable && (this._trailModule as any)._trailModel) {
            this._models.push((this._trailModule as any)._trailModel);
        }
        return this._models;
    }

    protected _attachToScene () {
        this.processor.attachToScene();
        if (this._trailModule && this._trailModule.enable) {
            this._trailModule._attachToScene();
        }
    }

    protected _detachFromScene () {
        this.processor.detachFromScene();
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

    public bindModule () {
        if (this._colorOverLifetimeModule) this._colorOverLifetimeModule.bindTarget(this.processor);
        if (this._sizeOvertimeModule) this._sizeOvertimeModule.bindTarget(this.processor);
        if (this._rotationOvertimeModule) this._rotationOvertimeModule.bindTarget(this.processor);
        if (this._forceOvertimeModule) this._forceOvertimeModule.bindTarget(this.processor);
        if (this._limitVelocityOvertimeModule) this._limitVelocityOvertimeModule.bindTarget(this.processor);
        if (this._velocityOvertimeModule) this._velocityOvertimeModule.bindTarget(this.processor);
        if (this._textureAnimationModule) this._textureAnimationModule.bindTarget(this.processor);
        if (this._noiseModule) this._noiseModule.bindTarget(this.processor);
        if (this._forceFieldModule) this._forceFieldModule.bindTarget(this.processor);
        if (this._inheritVelocityModule) this._inheritVelocityModule.bindTarget(this.processor);
        if (this._customDataModule) this._customDataModule.bindTarget(this.processor);
        if (this._rotationSpeedModule) this._rotationSpeedModule.bindTarget(this.processor);
        if (this._sizeSpeedModule) this._sizeSpeedModule.bindTarget(this.processor);
        if (this._colorSpeedModule) this._colorSpeedModule.bindTarget(this.processor);
    }

    // TODO: Fast forward current particle system by simulating particles over given period of time, then pause it.
    // simulate(time, withChildren, restart, fixedTimeStep) {

    // }

    /**
     * @en play particle system
     * @zh 播放粒子效果。
     */
    public play () {
        if (this._isPaused) {
            this._isPaused = false;
        }
        if (this._isStopped) {
            this._isStopped = false;
        }

        this._isPlaying = true;
        this._isEmitting = true;

        this._resetPosition();

        // prewarm
        if (this._prewarm) {
            this._prewarmSystem();
        }

        if (this._trailModule) {
            this._trailModule.play();
        }

        if (this.processor) {
            const model = this.processor.getModel();
            if (model) {
                model.enabled = this.enabledInHierarchy;
            }
        }

        SetUseRandomSeed(this.useSeed);
        SetRandomSeed(this.randomSeed);
    }

    /**
     * @en pause particle system
     * @zh 暂停播放粒子效果。
     */
    public pause () {
        if (this._isStopped) {
            console.warn('pause(): particle system is already stopped.');
            return;
        }
        if (this._isPlaying) {
            this._isPlaying = false;
        }

        this._isPaused = true;
    }

    /**
     * @zh 停止发射粒子。
     * @en Stop emitting particles.
     */
    public stopEmitting () {
        this._isEmitting = false;
    }

    /**
     * @en stop particle system
     * @zh 停止播放粒子。
     */
    public stop () {
        if (this._isPlaying || this._isPaused) {
            this.clear();
        }
        if (this._isPlaying) {
            this._isPlaying = false;
        }
        if (this._isPaused) {
            this._isPaused = false;
        }
        if (this._isEmitting) {
            this._isEmitting = false;
        }

        this._time = 0.0;
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;

        this._isStopped = true;

        // if stop emit modify the refresh flag to true
        this._needRefresh = true;

        for (const burst of this.bursts) {
            burst.reset();
        }
    }

    /**
     * @en remove all particles from current particle system.
     * @zh 将所有粒子从粒子系统中清除。
     */
    public clear () {
        if (this.enabledInHierarchy) {
            this.processor.clear();
            if (this._trailModule) this._trailModule.clear();
        }
        this._calculateBounding(false);
    }

    /**
     * @zh 获取当前粒子数量
     */
    public getParticleCount () {
        return this.processor.getParticleCount();
    }

    /**
     * @ignore
     */
    public setCustomData1 (x, y) {
        Vec2.set(this._customData1, x, y);
    }

    public setCustomData2 (x, y) {
        Vec2.set(this._customData2, x, y);
    }

    protected onDestroy () {
        this.stop();
        if (this.processor.getModel()?.scene) {
            this.processor.detachFromScene();
            if (this._trailModule && this._trailModule.enable) {
                this._trailModule._detachFromScene();
            }
        }
        legacyCC.director.off(legacyCC.Director.EVENT_BEFORE_COMMIT, this.beforeRender, this);
        // this._system.remove(this);
        this.processor.onDestroy();
        if (this._trailModule) this._trailModule.destroy();
        if (this._culler) {
            this._culler.clear();
            this._culler.destroy();
            this._culler = null;
        }
    }

    protected onEnable () {
        super.onEnable();
        legacyCC.director.on(legacyCC.Director.EVENT_BEFORE_COMMIT, this.beforeRender, this);
        if (this.playOnAwake && (!EDITOR || legacyCC.GAME_VIEW)) {
            this.play();
        }
        this.processor.onEnable();
        if (this._trailModule) this._trailModule.onEnable();
    }
    protected onDisable () {
        legacyCC.director.off(legacyCC.Director.EVENT_BEFORE_COMMIT, this.beforeRender, this);
        this.processor.onDisable();
        if (this._trailModule) this._trailModule.onDisable();
        if (this._boundingBox) {
            this._boundingBox = null;
        }
        if (this._culler) {
            this._culler.clear();
            this._culler.destroy();
            this._culler = null;
        }
    }

    private _calculateBounding (forceRefresh: boolean) {
        if (this._boundingBox) {
            if (!this._culler) {
                this._culler = new ParticleCuller(this);
            }
            this._culler.calculatePositions();
            AABB.fromPoints(this._boundingBox, this._culler.minPos, this._culler.maxPos);
            if (forceRefresh) {
                this.aabbHalfX = this._boundingBox.halfExtents.x;
                this.aabbHalfY = this._boundingBox.halfExtents.y;
                this.aabbHalfZ = this._boundingBox.halfExtents.z;
            } else {
                if (this.aabbHalfX) {
                    this.setBoundingX(this.aabbHalfX);
                } else {
                    this.aabbHalfX = this._boundingBox.halfExtents.x;
                }

                if (this.aabbHalfY) {
                    this.setBoundingY(this.aabbHalfY);
                } else {
                    this.aabbHalfY = this._boundingBox.halfExtents.y;
                }

                if (this.aabbHalfZ) {
                    this.setBoundingZ(this.aabbHalfZ);
                } else {
                    this.aabbHalfZ = this._boundingBox.halfExtents.z;
                }
            }
            this._culler.clear();
        }
    }

    protected update (dt: number) {
        if (EDITOR) {
            this.refreshSubemitters();
        }

        const scaledDeltaTime = dt * this.simulationSpeed;

        if (!this.renderCulling) {
            if (this._boundingBox) {
                this._boundingBox = null;
            }
            if (this._culler) {
                this._culler.clear();
                this._culler.destroy();
                this._culler = null;
            }
            this._isSimulating = true;
        } else {
            if (!this._boundingBox) {
                this._boundingBox = new AABB();
                this._calculateBounding(false);
            }

            if (!this._curPos) {
                this._curPos = new Vec3();
            }
            this.node.getWorldPosition(this._curPos);
            if (!this._oldPos) {
                this._oldPos = new Vec3();
                this._oldPos.set(this._curPos);
            }
            if (!this._curPos.equals(this._oldPos) && this._boundingBox && this._culler) {
                const dx = this._curPos.x - this._oldPos.x;
                const dy = this._curPos.y - this._oldPos.y;
                const dz = this._curPos.z - this._oldPos.z;
                const center = this._boundingBox.center;
                center.x += dx;
                center.y += dy;
                center.z += dz;
                this._culler.setBoundingBoxCenter(center.x, center.y, center.z);
                this._oldPos.set(this._curPos);
            }

            const cameraLst: Camera[]|undefined = this.node.scene.renderScene?.cameras;
            let culled = true;
            if (cameraLst !== undefined && this._boundingBox) {
                for (let i = 0; i < cameraLst.length; ++i) {
                    const camera:Camera = cameraLst[i];
                    const visibility = camera.visibility;
                    if ((visibility & this.node.layer) === this.node.layer) {
                        if (EDITOR && !legacyCC.GAME_VIEW) {
                            if (camera.name === 'Editor Camera' && intersect.aabbFrustum(this._boundingBox, camera.frustum)) {
                                culled = false;
                                break;
                            }
                        } else if (intersect.aabbFrustum(this._boundingBox, camera.frustum)) {
                            culled = false;
                            break;
                        }
                    }
                }
            }
            if (culled) {
                if (this._cullingMode !== CullingMode.AlwaysSimulate) {
                    this._isSimulating = false;
                }
                if (!this._isCulled) {
                    this.processor.detachFromScene();
                    this._isCulled = true;
                }
                if (this._trailModule && this._trailModule.enable) {
                    this._trailModule._detachFromScene();
                }
                if (this._cullingMode === CullingMode.PauseAndCatchup) {
                    this._time += scaledDeltaTime;
                }
                if (this._cullingMode !== CullingMode.AlwaysSimulate) {
                    return;
                }
            } else {
                if (this._isCulled) {
                    this._attachToScene();
                    this._isCulled = false;
                }
                if (!this._isSimulating) {
                    this._isSimulating = true;
                }
            }

            if (!this._isSimulating) {
                return;
            }
        }

        if (this._isPlaying) {
            this._time += scaledDeltaTime;

            // simulation, update particles.
            if (this.processor.updateParticles(scaledDeltaTime) === 0 && !this._isEmitting) {
                this.stop();
            }

            if (!this._parentEmitter) {
                // Execute emission
                this._emit(scaledDeltaTime);
            }
        } else {
            const mat: Material | null = this.getMaterialInstance(0) || this.processor.getDefaultMaterial();
            this.processor.updateRotation(mat);
            this.processor.updateScale(mat);
        }
        // // update render data
        // this.processor.updateRenderData();

        // // update trail
        // if (this._trailModule && this._trailModule.enable) {
        //     this._trailModule.updateRenderData();
        // }

        if (this._needAttach) { // Check whether this particle model should be reattached
            if (this.getParticleCount() > 0) {
                if (!this._isCulled) {
                    if (!this.processor.getModel()?.scene) {
                        this.processor.attachToScene();
                    }
                    if (this._trailModule && this._trailModule.enable) {
                        if (!this._trailModule.getModel()?.scene) {
                            this._trailModule._attachToScene();
                        }
                    }
                    this._needAttach = false;
                }
            }
        }

        if (!this.renderer.useGPU && this._trailModule && this._trailModule.enable) {
            // @ts-expect-error private property access
            if (!this._trailModule._inited) {
                this._trailModule.clear();
                this._trailModule.destroy();
                this._trailModule.onInit(this);
                // Rebuild trail buffer
                this._trailModule.enable = false;
                this._trailModule.enable = true;
            }
        }
    }

    protected beforeRender () {
        if (this.getParticleCount() <= 0) {
            if (this.processor.getModel()?.scene) {
                this.processor.detachFromScene();
                if (this._trailModule && this._trailModule.enable) {
                    this._trailModule._detachFromScene();
                }
                this._needAttach = false;
            }
        } else if (!this.processor.getModel()?.scene) {
            this._needAttach = true;
        }

        if (!this._isPlaying) return;

        if (this.processor.getModel()?.scene) { // Just update particle system in the scene
            this.processor.updateRenderData();
            if (this._trailModule && this._trailModule.enable) {
                this._trailModule.updateRenderData();
            }

            this.processor.beforeRender();
            if (this._trailModule && this._trailModule.enable) {
                this._trailModule.beforeRender();
            }
        }
    }

    protected _onVisibilityChange (val) {
        // @ts-expect-error private property access
        if (this.processor._model) {
            // @ts-expect-error private property access
            this.processor._model.visFlags = val;
        }
    }

    private emit (count: number, dt: number, parentParticle?: Particle) {
        let time = this._time;
        if (parentParticle) {
            time = parentParticle.time;
        }

        const loopDelta = (time % this.duration) / this.duration; // loop delta value

        // refresh particle node position to update emit position
        if (this._needRefresh) {
            // this.node.setPosition(this.node.getPosition());
            this.node.invalidateChildren(TransformBit.POSITION);

            this._needRefresh = false;
        }

        if (this._simulationSpace === Space.World) {
            if (!parentParticle) {
                this.node.getWorldMatrix(_world_mat);
                this.node.getWorldRotation(_world_rol);
            } else if (parentParticle.particleSystem._simulationSpace === Space.World) {
                _world_mat.set(Mat4.IDENTITY);
                this.node.getWorldScale(_world_scale);
                Mat4.fromTranslation(_temp_trans, parentParticle.position);
                Mat4.multiply(_world_mat, _world_mat, _temp_trans);
                Mat4.fromQuat(_temp_trans, parentParticle.dir);
                Mat4.multiply(_world_mat, _world_mat, _temp_trans);
                Mat4.fromScaling(_temp_trans, _world_scale);
                Mat4.multiply(_world_mat, _world_mat, _temp_trans);
                Quat.copy(_world_rol, parentParticle.dir);
            } else {
                parentParticle.particleSystem.node.getWorldMatrix(_world_mat);
                parentParticle.particleSystem.node.getScale(_local_scale);
                Mat4.fromTranslation(_temp_trans, parentParticle.position);
                Mat4.multiply(_world_mat, _world_mat, _temp_trans);
                Mat4.fromQuat(_temp_trans, parentParticle.dir);
                Mat4.multiply(_world_mat, _world_mat, _temp_trans);
                Mat4.fromScaling(_temp_trans, _local_scale);
                Mat4.multiply(_world_mat, _world_mat, _temp_trans);

                Mat4.getRotation(_world_rol, _world_mat);
            }
        } else if (parentParticle && parentParticle.particleSystem._simulationSpace === Space.World) {
            parentParticle.particleSystem.node.getWorldMatrix(_inv_mat);
            parentParticle.particleSystem.node.getWorldRotation(_inv_rol);
            Mat4.invert(_inv_mat, _inv_mat);
            Quat.invert(_inv_rol, _inv_rol);
        } else if (parentParticle && parentParticle.particleSystem._simulationSpace !== Space.World) {
            this.node.getPosition(_temp_pos);
            this.node.getScale(_local_scale);
            this.node.getRotation(_temp_rol);
            _local_mat.set(Mat4.IDENTITY);
            Mat4.fromScaling(_temp_trans, _local_scale);
            Mat4.multiply(_local_mat, _temp_trans, _local_mat);
            Mat4.fromQuat(_temp_trans, _temp_rol);
            Mat4.multiply(_local_mat, _temp_trans, _local_mat);
            Mat4.fromTranslation(_temp_trans, _temp_pos);
            Mat4.multiply(_local_mat, _temp_trans, _local_mat);

            Mat4.invert(_inv_mat, _local_mat);
            Quat.invert(_inv_rol, _temp_rol);
        }

        const dd = dt / count;
        for (let i = 0; i < count; ++i) {
            const particle = this.processor.getFreeParticle();
            if (particle === null) {
                return;
            }
            particle.particleSystem = this;
            particle.reset();
            if (parentParticle) {
                particle.parentParticle = parentParticle;
            }

            const rand = pseudoRandom(randomRangeInt(0, INT_MAX));

            if (this._shapeModule && this._shapeModule.enable) {
                this._shapeModule.emit(particle);
            } else {
                Vec3.set(particle.position, 0, 0, 0);
                Vec3.copy(particle.velocity, particleEmitZAxis);
            }

            if (this._textureAnimationModule && this._textureAnimationModule.enable) {
                this._textureAnimationModule.init(particle);
            }

            this.startSpeed.bake();
            const curveStartSpeed = this.startSpeed.evaluate(loopDelta, rand)!;
            Vec3.multiplyScalar(particle.velocity, particle.velocity, curveStartSpeed);

            if (this._simulationSpace === Space.World) {
                Vec3.transformMat4(particle.position, particle.position, _world_mat);
                Vec3.transformQuat(particle.velocity, particle.velocity, _world_rol);
            } else if (parentParticle) {
                Vec3.transformQuat(particle.position, particle.position, parentParticle.dir);
                Mat4.fromTranslation(_temp_trans, parentParticle.position);
                Vec3.transformMat4(particle.position, particle.position, _temp_trans);
                Vec3.transformMat4(particle.position, particle.position, _inv_mat);

                Vec3.transformQuat(particle.velocity, particle.velocity, parentParticle.dir);
                Vec3.transformQuat(particle.velocity, particle.velocity, _inv_rol);
            }

            if (this._simulationSpace === Space.World) {
                Vec3.copy(particle.initialVelocity, particle.velocity);
            } else {
                this.node.getWorldRotation(_world_rol);
                Vec3.copy(particle.initialVelocity, _temp_velo);
            }

            Vec3.copy(particle.ultimateVelocity, particle.velocity);

            if (parentParticle && parentParticle.particleSystem) {
                if (parentParticle.particleSystem.simulationSpace === Space.World) {
                    Vec3.copy(_temp_velo, parentParticle.ultimateVelocity);
                } else {
                    parentParticle.particleSystem.node.getWorldRotation(_temp_rol);
                    Vec3.transformQuat(_temp_velo, parentParticle.ultimateVelocity, _temp_rol);
                }
                particle.position.add3f(_temp_velo.x * i * dd, _temp_velo.y * i * dd, _temp_velo.z * i * dd);
            }

            // apply startRotation.
            if (this.startRotation3D) {
                this.startRotationX.bake();
                this.startRotationY.bake();
                this.startRotationZ.bake();
                // eslint-disable-next-line max-len
                particle.startEuler.set(this.startRotationX.evaluate(loopDelta, rand), this.startRotationY.evaluate(loopDelta, rand), this.startRotationZ.evaluate(loopDelta, rand));
            } else {
                this.startRotationZ.bake();
                particle.startEuler.set(0, 0, this.startRotationZ.evaluate(loopDelta, rand));
            }
            particle.rotation.set(particle.startEuler);

            // apply startSize.
            if (this.startSize3D) {
                this.startSizeX.bake();
                this.startSizeY.bake();
                this.startSizeZ.bake();
                Vec3.set(particle.startSize, this.startSizeX.evaluate(loopDelta, rand)!,
                    this.startSizeY.evaluate(loopDelta, rand)!,
                    this.startSizeZ.evaluate(loopDelta, rand)!);
            } else {
                this.startSizeX.bake();
                Vec3.set(particle.startSize, this.startSizeX.evaluate(loopDelta, rand)!, 1, 1);
                particle.startSize.y = particle.startSize.x;
            }
            Vec3.copy(particle.size, particle.startSize);

            // apply startColor.
            this.startColor.bake();
            particle.startColor.set(this.startColor.evaluate(loopDelta, rand));

            if (parentParticle && this.inheritColor) {
                particle.startColor.r = parentParticle.color.r;
                particle.startColor.g = parentParticle.color.g;
                particle.startColor.b = parentParticle.color.b;
            }

            particle.color.set(particle.startColor);

            // apply startLifetime.
            this.startLifetime.bake();
            particle.startLifetime = this.startLifetime.evaluate(loopDelta, rand)!;
            particle.remainingLifetime = particle.startLifetime;

            particle.randomSeed = randomRangeInt(0, 233280);
            particle.loopCount++;
            if (this._trailModule && this._trailModule.enable) {
                this._trailModule.removeParticle(particle);
            }

            particle.active = true;
            this._trigged = true;
            this.processor.setNewParticle(particle);

            if (parentParticle) {
                if (this._colorOverLifetimeModule && this._colorOverLifetimeModule.enable) {
                    this._colorOverLifetimeModule.animate(particle);
                }
            }
        } // end of particles forLoop.
    }

    // initialize particle system as though it had already completed a full cycle.
    private _prewarmSystem () {
        this.startDelay.mode = Mode.Constant; // clear startDelay.
        this.startDelay.constant = 0;
        const dt = 1.0; // should use varying value?
        const cnt = this.duration / dt;

        for (let i = 0; i < cnt; ++i) {
            this._time += dt;
            if (!this._parentEmitter) {
                this._emit(dt);
            }
            this.processor.updateParticles(dt);
        }
    }

    // internal function
    private _emit (dt, parentParticle?: Particle) {
        if (!parentParticle) {
            // bursts
            if (!this.loop && this.time <= this.duration) {
                for (const burst of this.bursts) {
                    burst.update(this, dt, parentParticle);
                }
            }
        }

        // emit particles.
        this.startDelay.bake();
        const startDelay = this.startDelay.evaluate(0, random())!;

        let time = this._time;
        if (parentParticle) {
            time = parentParticle.time;
        }

        if (time > startDelay) {
            if (time > (this.duration + startDelay)) {
                if (!this.loop) {
                    this._isEmitting = false;
                }
            }

            if (!this._isEmitting) return;

            if (!parentParticle) {
                // emit by rateOverTime
                this.rateOverTime.bake();
                this._emitRateTimeCounter += this.rateOverTime.evaluate(time / this.duration, 1)! * dt;
                if (this._emitRateTimeCounter > 1) {
                    const emitNum = Math.floor(this._emitRateTimeCounter);
                    this._emitRateTimeCounter -= emitNum;
                    this.emit(emitNum, dt, parentParticle);
                }

                // emit by rateOverDistance
                this.node.getWorldPosition(this._curWPos);
                const distance = Vec3.distance(this._curWPos, this._oldWPos);
                Vec3.copy(this._oldWPos, this._curWPos);
                this.rateOverDistance.bake();
                this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(time / this.duration, 1)!;

                if (this._emitRateDistanceCounter > 1) {
                    const emitNum = Math.floor(this._emitRateDistanceCounter);
                    this._emitRateDistanceCounter -= emitNum;
                    this.emit(emitNum, dt, parentParticle);
                }
            } else {
                // emit by rateOverTime
                this.rateOverTime.bake();
                parentParticle.timeCounter += this.rateOverTime.evaluate(time / this.duration, 1)! * dt;
                if (parentParticle.timeCounter > 1) {
                    const emitNum = Math.floor(parentParticle.timeCounter);
                    parentParticle.timeCounter -= emitNum;
                    this.emit(emitNum, dt, parentParticle);
                }

                // emit by rateOverDistance
                const distance = parentParticle.ultimateVelocity.length() * dt;
                this.rateOverDistance.bake();
                parentParticle.distanceCounter += distance * this.rateOverDistance.evaluate(time / this.duration, 1)!;

                if (parentParticle.distanceCounter > 1) {
                    const emitNum = Math.floor(parentParticle.distanceCounter);
                    parentParticle.distanceCounter -= emitNum;
                    this.emit(emitNum, dt, parentParticle);
                }
            }
        }
    }

    private _resetPosition () {
        this.node.getWorldPosition(this._oldWPos);
        Vec3.copy(this._curWPos, this._oldWPos);
    }

    private addSubEmitter (subEmitter) {
        this._subEmitters.push(subEmitter);
    }

    private removeSubEmitter (idx) {
        this._subEmitters.splice(this._subEmitters.indexOf(idx), 1);
    }

    public getSubEmitters (): ParticleSystem[] {
        return this._subEmitters;
    }

    private addBurst (burst) {
        this.bursts.push(burst);
    }

    private removeBurst (idx) {
        this.bursts.splice(this.bursts.indexOf(idx), 1);
    }

    private getBoundingX () {
        return this._aabbHalfX;
    }

    private getBoundingY () {
        return this._aabbHalfY;
    }

    private getBoundingZ () {
        return this._aabbHalfZ;
    }

    private setBoundingX (value: number) {
        if (this._boundingBox && this._culler) {
            this._boundingBox.halfExtents.x = value;
            this._culler.setBoundingBoxSize(this._boundingBox.halfExtents);
            this._aabbHalfX = value;
        }
    }

    private setBoundingY (value: number) {
        if (this._boundingBox && this._culler) {
            this._boundingBox.halfExtents.y = value;
            this._culler.setBoundingBoxSize(this._boundingBox.halfExtents);
            this._aabbHalfY = value;
        }
    }

    private setBoundingZ (value: number) {
        if (this._boundingBox && this._culler) {
            this._boundingBox.halfExtents.z = value;
            this._culler.setBoundingBoxSize(this._boundingBox.halfExtents);
            this._aabbHalfZ = value;
        }
    }

    /**
     * @ignore
     */
    get isPlaying () {
        return this._isPlaying;
    }

    get isPaused () {
        return this._isPaused;
    }

    get isStopped () {
        return this._isStopped;
    }

    get isEmitting () {
        return this._isEmitting;
    }

    get time () {
        return this._time;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _onBeforeSerialize (props) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.dataCulling ? props.filter((p) => !PARTICLE_MODULE_PROPERTY.includes(p) || (this[p] && this[p].enable)) : props;
    }

    public getNoisePreview (width: number, height: number): number[] {
        const out: number[] = [];
        if (this.processor) {
            this.processor.getNoisePreview(out, width, height);
        }
        return out;
    }
}
