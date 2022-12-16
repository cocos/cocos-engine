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
import { ccclass, help, executeInEditMode, executionOrder, menu, tooltip, displayOrder, type, range, displayName, formerlySerializedAs, override, radian, serializable, visible } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Renderer } from '../core/components/renderer';
import { ModelRenderer } from '../core/components/model-renderer';
import { Material } from '../core/assets/material';
import { Mat4, pseudoRandom, Quat, randomRangeInt, Vec2, Vec3 } from '../core/math';
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
import ShapeModule from './animator/shape-module';
import { CullingMode, Space } from './enum';
import { particleEmitZAxis } from './particle-general-function';
import ParticleSystemRenderer from './particle-system-renderer';
import TrailModule from './animator/trail';
import { PARTICLE_MODULE_PROPERTY } from './particle';
import { legacyCC } from '../core/global-exports';
import { TransformBit } from '../core/scene-graph/node-enum';
import { AABB, intersect } from '../core/geometry';
import { Camera } from '../core/renderer/scene';
import { ParticleCuller } from './particle-culler';
import { NoiseModule } from './animator/noise-module';
import { CCBoolean, CCFloat } from '../core';
import { INVALID_HANDLE, ParticleHandle, ParticleSOAData } from './particle-soa-data';

const _world_mat = new Mat4();
const _world_rol = new Quat();

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
        if (this._processor && this._processor._model) {
            // @ts-expect-error private property access
            this._processor._model.setCapacity(this._capacity);
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
    public scaleSpace = Space.LOCAL;

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
            if (this._processor) {
                this._processor.updateMaterialParams();
                this._processor.updateTrailMaterial();
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

    /**
     * @zh 颜色控制模块。
     */
    @type(ColorOverLifetimeModule)
    @displayOrder(23)
    @tooltip('i18n:particle_system.colorOverLifetimeModule')
    public get colorOverLifetimeModule () {
        return this._colorOverLifetimeModule;
    }

    /**
     * @zh 粒子发射器模块。
     */
    @type(ShapeModule)
    @displayOrder(17)
    @tooltip('i18n:particle_system.shapeModule')
    public get shapeModule () {
        return this._shapeModule;
    }

    /**
     * @zh 粒子大小模块。
     */
    @type(SizeOvertimeModule)
    @displayOrder(21)
    @tooltip('i18n:particle_system.sizeOvertimeModule')
    public get sizeOvertimeModule () {
        return this._sizeOvertimeModule;
    }

    /**
     * @zh 粒子速度模块。
     */
    @type(VelocityOvertimeModule)
    @displayOrder(18)
    @tooltip('i18n:particle_system.velocityOvertimeModule')
    public get velocityOvertimeModule () {
        return this._velocityOvertimeModule;
    }

    /**
     * @zh 粒子加速度模块。
     */
    @type(ForceOvertimeModule)
    @displayOrder(19)
    @tooltip('i18n:particle_system.forceOvertimeModule')
    public get forceOvertimeModule () {
        return this._forceOvertimeModule;
    }

    /**
     * @zh 粒子限制速度模块（只支持 CPU 粒子）。
     */
    @type(LimitVelocityOvertimeModule)
    @displayOrder(20)
    @tooltip('i18n:particle_system.limitVelocityOvertimeModule')
    public get limitVelocityOvertimeModule () {
        return this._limitVelocityOvertimeModule;
    }

    /**
     * @zh 粒子旋转模块。
     */
    @type(RotationOvertimeModule)
    @displayOrder(22)
    @tooltip('i18n:particle_system.rotationOvertimeModule')
    public get rotationOvertimeModule () {
        return this._rotationOvertimeModule;
    }

    /**
     * @zh 贴图动画模块。
     */
    @type(TextureAnimationModule)
    @displayOrder(24)
    @tooltip('i18n:particle_system.textureAnimationModule')
    public get textureAnimationModule () {
        return this._textureAnimationModule;
    }

    @type(NoiseModule)
    @displayOrder(24)
    public get noiseModule () {
        return this._noiseModule;
    }

    /**
     * @zh 粒子轨迹模块。
     */
    @type(TrailModule)
    @displayOrder(25)
    @tooltip('i18n:particle_system.trailModule')
    public get trailModule () {
        return this._trailModule;
    }

    // particle system renderer
    @type(ParticleSystemRenderer)
    @serializable
    @displayOrder(26)
    @tooltip('i18n:particle_system.renderer')
    public renderer: ParticleSystemRenderer = new ParticleSystemRenderer();

    // color over lifetime module
    @type(ColorOverLifetimeModule)
    private _colorOverLifetimeModule = new ColorOverLifetimeModule();
    // shape module
    @type(ShapeModule)
    private _shapeModule = new ShapeModule();
    // size over lifetime module
    @type(SizeOvertimeModule)
    private _sizeOvertimeModule = new SizeOvertimeModule();
    // velocity overtime module
    @type(VelocityOvertimeModule)
    private _velocityOvertimeModule = new VelocityOvertimeModule();
    // force overTime module
    @type(ForceOvertimeModule)
    private _forceOvertimeModule = new ForceOvertimeModule();
    // limit velocity overtime module
    @type(LimitVelocityOvertimeModule)
    private _limitVelocityOvertimeModule = new LimitVelocityOvertimeModule();
    // rotation overtime module
    @type(RotationOvertimeModule)
    private _rotationOvertimeModule = new RotationOvertimeModule();
    // texture animation module
    @type(TextureAnimationModule)
    private _textureAnimationModule = new TextureAnimationModule();
    // noise module
    @type(NoiseModule)
    private _noiseModule = new NoiseModule();
    // trail module
    @type(TrailModule)
    private _trailModule = new TrailModule();

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
    private _particles = new ParticleSOAData();

    private _needAttach: boolean;

    @serializable
    private _prewarm = false;

    @serializable
    private _capacity = 100;

    @serializable
    private _simulationSpace = Space.LOCAL;

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
    }

    public onFocusInEditor () {
        this.renderer.create(this);
    }

    public onLoad () {
        // HACK, TODO
        this.renderer.onInit(this);
        this._processor.onInit(this);
        if (this._shapeModule) this._shapeModule.onInit(this);
        if (this._trailModule && !this.renderer.useGPU) {
            this._trailModule.onInit(this);
        }
        this._resetPosition();

        // this._system.add(this);
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

        if (this._processor) {
            const model = this._processor.getModel();
            if (model) {
                model.enabled = this.enabledInHierarchy;
            }
        }
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
            this._processor.clear();
            if (this._trailModule) this._trailModule.clear();
        }
        this._calculateBounding(false);
    }

    /**
     * @zh 获取当前粒子数量
     */
    public getParticleCount () {
        return this._particles.count;
    }

    protected onDestroy () {
        this.stop();
        if (this._processor.getModel()?.scene) {
            this._processor.detachFromScene();
            if (this._trailModule && this._trailModule.enable) {
                this._trailModule._detachFromScene();
            }
        }
        legacyCC.director.off(legacyCC.Director.EVENT_BEFORE_COMMIT, this.beforeRender, this);
        // this._system.remove(this);
        this._processor.onDestroy();
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
        this._processor.onEnable();
        if (this._trailModule) this._trailModule.onEnable();
    }
    protected onDisable () {
        legacyCC.director.off(legacyCC.Director.EVENT_BEFORE_COMMIT, this.beforeRender, this);
        this._processor.onDisable();
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
                    this._processor.detachFromScene();
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

            // Execute emission
            this._emit(scaledDeltaTime);

            // simulation, update particles.
            if (this._processor.updateParticles(scaledDeltaTime) === 0 && !this._isEmitting) {
                this.stop();
            }
        } else {
            const mat: Material | null = this.getMaterialInstance(0) || this._processor.getDefaultMaterial();
            const pass = mat!.passes[0];
            this._processor.updateRotation(pass);
            this._processor.updateScale(pass);
        }
        // update render data
        this._processor.updateRenderData();

        // update trail
        if (this._trailModule && this._trailModule.enable) {
            this._trailModule.updateRenderData();
        }

        if (this._needAttach) { // Check whether this particle model should be reattached
            if (this.getParticleCount() > 0) {
                if (!this._isCulled) {
                    if (!this._processor.getModel()?.scene) {
                        this._processor.attachToScene();
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
    }

    protected _onVisibilityChange (val) {
        // @ts-expect-error private property access
        if (this._processor._model) {
            // @ts-expect-error private property access
            this._processor._model.visFlags = val;
        }
    }

    private emit (count: number, dt: number) {
        const loopDelta = (this._time % this.duration) / this.duration; // loop delta value

        // refresh particle node position to update emit position
        if (this._needRefresh) {
            // this.node.setPosition(this.node.getPosition());
            this.node.invalidateChildren(TransformBit.POSITION);

            this._needRefresh = false;
        }

        if (this._simulationSpace === Space.WORLD) {
            this.node.getWorldMatrix(_world_mat);
            this.node.getWorldRotation(_world_rol);
        }

        for (let i = 0; i < count; ++i) {
            const particle = this._processor.getFreeParticle();
            if (particle === null) {
                return;
            }
            particle.particleSystem = this;
            particle.reset();

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

            const curveStartSpeed = this.startSpeed.evaluate(loopDelta, rand)!;
            Vec3.multiplyScalar(particle.velocity, particle.velocity, curveStartSpeed);

            if (this._simulationSpace === Space.World) {
                Vec3.transformMat4(particle.position, particle.position, _world_mat);
                Vec3.transformQuat(particle.velocity, particle.velocity, _world_rol);
            }

            Vec3.copy(particle.ultimateVelocity, particle.velocity);
            // apply startRotation.
            if (this.startRotation3D) {
                // eslint-disable-next-line max-len
                particle.startEuler.set(this.startRotationX.evaluate(loopDelta, rand), this.startRotationY.evaluate(loopDelta, rand), this.startRotationZ.evaluate(loopDelta, rand));
            } else {
                particle.startEuler.set(0, 0, this.startRotationZ.evaluate(loopDelta, rand));
            }
            particle.rotation.set(particle.startEuler);

            // apply startSize.
            if (this.startSize3D) {
                Vec3.set(particle.startSize, this.startSizeX.evaluate(loopDelta, rand)!,
                    this.startSizeY.evaluate(loopDelta, rand)!,
                    this.startSizeZ.evaluate(loopDelta, rand)!);
            } else {
                Vec3.set(particle.startSize, this.startSizeX.evaluate(loopDelta, rand)!, 1, 1);
                particle.startSize.y = particle.startSize.x;
            }
            Vec3.copy(particle.size, particle.startSize);

            // apply startColor.
            particle.startColor.set(this.startColor.evaluate(loopDelta, rand));
            particle.color.set(particle.startColor);

            // apply startLifetime.
            particle.startLifetime = this.startLifetime.evaluate(loopDelta, rand)! + dt;
            particle.remainingLifetime = particle.startLifetime;

            particle.randomSeed = randomRangeInt(0, 233280);
            particle.loopCount++;

            this._processor.setNewParticle(particle);
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
            this._emit(dt);
            this._processor.updateParticles(dt);
        }
    }

    // internal function
    private _emit (dt) {
        // emit particles.
        const startDelay = this.startDelay.evaluate(0, 1)!;
        if (this._time > startDelay) {
            if (this._time > (this.duration + startDelay)) {
                // this._time = startDelay; // delay will not be applied from the second loop.(Unity)
                // this._emitRateTimeCounter = 0.0;
                // this._emitRateDistanceCounter = 0.0;
                if (!this.loop) {
                    this._isEmitting = false;
                }
            }

            if (!this._isEmitting) return;

            // emit by rateOverTime
            this._emitRateTimeCounter += this.rateOverTime.evaluate(this._time / this.duration, 1)! * dt;
            if (this._emitRateTimeCounter > 1) {
                const emitNum = Math.floor(this._emitRateTimeCounter);
                this._emitRateTimeCounter -= emitNum;
                this.emit(emitNum, dt);
            }

            // emit by rateOverDistance
            this.node.getWorldPosition(this._curWPos);
            const distance = Vec3.distance(this._curWPos, this._oldWPos);
            Vec3.copy(this._oldWPos, this._curWPos);
            this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(this._time / this.duration, 1)!;

            if (this._emitRateDistanceCounter > 1) {
                const emitNum = Math.floor(this._emitRateDistanceCounter);
                this._emitRateDistanceCounter -= emitNum;
                this.emit(emitNum, dt);
            }

            // bursts
            for (const burst of this.bursts) {
                burst.update(this, dt);
            }
        }
    }

    private simulate () {
        this.updateMaterialParams();
        const ps = this._particleSystem;
        if (!ps) {
            return this._particles.count;
        }
        ps.node.getWorldMatrix(_tempWorldTrans);
        const mat: Material | null = ps.getMaterialInstance(0) || this._defaultMat;
        const pass = mat!.passes[0];
        this.doUpdateScale(pass);
        this.doUpdateRotation(pass);

        const trailModule = this._trailModule;
        const trailEnable = trailModule && trailModule.enable;
        if (trailEnable) {
            trailModule.update();
        }

        if (ps.simulationSpace === Space.LOCAL) {
            const r:Quat = ps.node.getRotation();
            Mat4.fromQuat(this._localMat, r);
            this._localMat.transpose(); // just consider rotation, use transpose as invert
        }

        if (ps.node.parent) {
            ps.node.parent.getWorldMatrix(_tempParentInverse);
            _tempParentInverse.invert();
        }
        const { normalizedAliveTime } = this._particles;
        for (let i = 0, length = this._particles.count; i < length; ++i) {
            normalizedAliveTime[i] -= dt;
            Vec3.set(p.animatedVelocity, 0, 0, 0);

            if (p.remainingLifetime < 0.0) {
                if (trailEnable) {
                    trailModule.removeParticle(p);
                }
                this._particles.removeAt(i);
                --i;
                continue;
            }
        }

        if (ps.simulationSpace === Space.LOCAL) {
            const gravityFactor = -ps.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed))! * 9.8 * dt;
            this._gravity.x = 0.0;
            this._gravity.y = gravityFactor;
            this._gravity.z = 0.0;
            this._gravity.w = 1.0;
            if (!approx(gravityFactor, 0.0, EPSILON)) {
                if (ps.node.parent) {
                    this._gravity = this._gravity.transformMat4(_tempParentInverse);
                }
                this._gravity = this._gravity.transformMat4(this._localMat);

                p.velocity.x += this._gravity.x;
                p.velocity.y += this._gravity.y;
                p.velocity.z += this._gravity.z;
            }
        } else {
            // apply gravity.
            p.velocity.y -= ps.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed))! * 9.8 * dt;
        }

        Vec3.copy(p.ultimateVelocity, p.velocity);

        this._runAnimateList.forEach((value) => {
            value.animate(p, dt);
        });

        Vec3.scaleAndAdd(p.position, p.position, p.ultimateVelocity, dt); // apply velocity.
        if (trailEnable) {
            trailModule.animate(p, dt);
        }

        this._model!.enabled = this._particles.count > 0;
        return this._particles.count;
    }

    private _resetPosition () {
        this.node.getWorldPosition(this._oldWPos);
        Vec3.copy(this._curWPos, this._oldWPos);
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

    public getFreeParticle (): ParticleHandle {
        if (this._particles.count >= this.capacity) {
            return INVALID_HANDLE;
        }
        return this._particles.addParticle();
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
        this.noiseModule.getNoisePreview(out, this.time, width, height);
        return out;
    }
}
