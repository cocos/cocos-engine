// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

/**
 * @category particle
 */

// tslint:disable: max-line-length

import { RenderableComponent } from '../core/3d/framework/renderable-component';
import { Material } from '../core/assets/material';
import { ccclass, help, executeInEditMode, executionOrder, menu, property } from '../core/data/class-decorator';
import { Mat4, pseudoRandom, Quat, randomRangeInt, Vec2, Vec3 } from '../core/math';
import { INT_MAX } from '../core/math/bits';
import { Model } from '../core/renderer';
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
import { Space } from './enum';
import { particleEmitZAxis } from './particle-general-function';
import ParticleSystemRenderer from './renderer/particle-system-renderer-data';
import TrailModule from './renderer/trail';
import { IParticleSystemRenderer } from './renderer/particle-system-renderer-base';
import { PARTICLE_MODULE_PROPERTY } from './particle';

const _world_mat = new Mat4();
const _world_rol = new Quat();

/**
 * @en The ParticleSystem3D Component.
 * @zh 3D 粒子组件
 * @class ParticleSystemComponent
 * @extends RenderableComponent
 */
@ccclass('cc.ParticleSystemComponent')
@help('i18n:cc.ParticleSystemComponent')
@menu('Components/ParticleSystem')
@executionOrder(99)
@executeInEditMode
export class ParticleSystemComponent extends RenderableComponent {

    /**
     * @en The maximum number of particles that a particle system can generate.
     * @zh 粒子系统能生成的最大粒子数量
     * @property {Number} capacity
     */
    @property({
        displayOrder: 1,
        tooltip:'i18n:particle.capacity',
    })
    public get capacity () {
        return this._capacity;
    }

    public set capacity (val) {
        this._capacity = val;
        // @ts-ignore
        if (this.processor && this.processor._model) {
            // @ts-ignore
            this.processor._model.setCapacity(this._capacity);
        }
    }

    /**
     * @en Particle initial color
     * @zh 粒子初始颜色
     * @property {GradientRange} startColor
     */
    @property({
        type: GradientRange,
        displayOrder: 8,
        tooltip:'i18n:particle.start_color',
    })
    public startColor = new GradientRange();

    /**
     * @en Particle scale space
     * @zh 缩放空间
     * @property {Space} scaleSpace
     */
    @property({
        type: Space,
        displayOrder: 9,
        tooltip:'i18n:particle.scale_space',
    })
    public scaleSpace = Space.Local;

    /**
     * @en Whether to open the particle at the initial size of the XYZ axis
     * @zh 是否开启粒子分别在 XYZ 轴的初始大小
     * @property {boolean} startSize3D
     */
    @property({
        displayOrder: 10,
        tooltip:'i18n:particle.start_size_3d',
    })
    public startSize3D = false;

    /**
     * @en Initial particle size
     * @zh 粒子初始大小
     * @property {CurveRange} startSizeX
     */
    @property({
        type: CurveRange,
        displayOrder: 10,
        formerlySerializedAs: 'startSize',
        tooltip:'i18n:particle.start_size',
    })
    public startSizeX = new CurveRange();

    /**
     * @en Initial particle size
     * @zh 粒子初始大小
     * @property {CurveRange} startSizeY
     */
    @property({
        type: CurveRange,
        displayOrder: 10,
        tooltip:'i18n:particle.start_size',
    })
    public startSizeY = new CurveRange();

    /**
     * @en Initial particle size
     * @zh 粒子初始大小
     * @property {CurveRange} startSizeZ
     */
    @property({
        type: CurveRange,
        displayOrder: 10,
        tooltip:'i18n:particle.start_size',
    })
    public startSizeZ = new CurveRange();

    /**
     * @en Initial particle speed
     * @zh 粒子初始速度
     * @property {CurveRange} startSpeed
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 11,
        tooltip:'i18n:particle.start_speed',
    })
    public startSpeed = new CurveRange();

    /**
     * @en Whether to open the particle at the rotation angle of the XYZ axis
     * @zh 是否开启粒子分别在 XYZ 轴的旋转角度
     * @property {boolean} startRotation3D
     */
    @property({
        displayOrder: 12,
        tooltip:'i18n:particle.start_rotation_3d',
    })
    public startRotation3D = false;

    /**
     * @en Particle initial rotation angle
     * @zh 粒子初始旋转角度
     * @property {CurveRange} startRotationX
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 12,
        tooltip:'i18n:particle.start_rotation',
    })
    public startRotationX = new CurveRange();

    /**
     * @en Particle initial rotation angle
     * @zh 粒子初始旋转角度
     * @property {CurveRange} startRotationY
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 12,
        tooltip:'i18n:particle.start_rotation',
    })
    public startRotationY = new CurveRange();

    /**
     * @en Particle initial rotation angle
     * @zh 粒子初始旋转角度
     * @property {CurveRange} startRotationZ
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 12,
        formerlySerializedAs: 'startRotation',
        tooltip:'i18n:particle.start_rotation',
    })
    public startRotationZ = new CurveRange();

    /**
     * @en Delay particle emission time after particle system starts running.
     * @zh 粒子系统开始运行后，延迟粒子发射的时间。
     * @property {CurveRange} startDelay
     */
    @property({
        type: CurveRange,
        displayOrder: 6,
        tooltip:'i18n:particle.start_delay',
    })
    public startDelay = new CurveRange();

    /**
     * @en Particle life cycle。
     * @zh 粒子生命周期。
     * @property {CurveRange} startLifetime
     */
    @property({
        type: CurveRange,
        displayOrder: 7,
        tooltip:'i18n:particle.start_life_time',
    })
    public startLifetime = new CurveRange();

    /**
     * @en The run time of particle.
     * @zh 粒子系统运行时间
     * @property {Number} duration
     */
    @property({
        displayOrder: 0,
        tooltip:'i18n:particle.duration',
    })
    public duration = 5.0;

    /**
     * @en Whether the particle system loops.
     * @zh 粒子系统是否循环播放
     * @property {Boolean} loop
     */
    @property({
        displayOrder: 2,
        tooltip:'i18n:particle.loop',
    })
    public loop = true;

    /**
     * @en When selected, the particle system will start playing after one round has been played (only effective when loop is enabled).
     * @zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）
     * @property {Boolean} prewarm
     */
    @property({
        displayOrder: 3,
        tooltip:'i18n:particle.prewarm',
    })
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
     * @en The coordinate system in which the particle system is located.<br>
     * World coordinates (does not change when the position of other objects changes)<br>
     * Local coordinates (moving as the position of the parent node changes)<br>
     * Custom coordinates (moving with the position of a custom node)
     * @zh 选择粒子系统所在的坐标系<br>
     * 世界坐标（不随其他物体位置改变而变换）<br>
     * 局部坐标（跟随父节点位置改变而移动）<br>
     * 自定坐标（跟随自定义节点的位置改变而移动）
     * @property {Space} simulationSpace
     */
    @property({
        type: Space,
        displayOrder: 4,
        tooltip:'i18n:particle.simulation_space',
    })
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
     * @en Controlling the update speed of the entire particle system.
     * @zh 控制整个粒子系统的更新速度。
     * @property {Number} simulationSpeed
     */
    @property({
        displayOrder: 5,
        tooltip:'i18n:particle.simulation_speed',
    })
    public simulationSpeed = 1.0;

    /**
     * @en Whether the particles start playing automatically after loaded.
     * @zh 粒子系统加载后是否自动开始播放
     * @property {Boolean} playOnAwake
     */
    @property({
        displayOrder: 2,
        tooltip:'i18n:particle.play_on_awake',
    })
    public playOnAwake = true;

    /**
     * @en Gravity coefficient of particles affected by gravity.
     * @zh 粒子受重力影响的重力系数
     * @property {CurveRange} gravityModifier
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 13,
        tooltip:'i18n:particle.gravity_modifier',
    })
    public gravityModifier = new CurveRange();

    // emission module
    /**
     * @en Particles emitted per second
     * @zh 每秒发射的粒子数
     * @property {CurveRange} rateOverTime
     */
    @property({
        type: CurveRange,
        displayOrder: 14,
        tooltip:'i18n:particle.rate_over_time',
    })
    public rateOverTime = new CurveRange();

    /**
     * @en Number of particles emitted per unit distance moved
     * @zh 每移动单位距离发射的粒子数
     * @property {CurveRange} rateOverDistance
     */
    @property({
        type: CurveRange,
        displayOrder: 15,
        tooltip:'i18n:particle.rate_over_distance',
    })
    public rateOverDistance = new CurveRange();

    /**
     * @en The number of Brusts that emit a specified number of particles at a specified time
     * @zh 设定在指定时间发射指定数量的粒子的 Brust 的数量
     * @property {[Burst]} bursts
     */
    @property({
        type: [Burst],
        displayOrder: 16,
        tooltip:'i18n:particle.bursts',
    })
    public bursts: Burst[] = new Array();

    @property({
        type: Material,
        displayName: 'Materials',
        visible: false,
        override: true,
    })
    get sharedMaterials () {
        // if we don't create an array copy, the editor will modify the original array directly.
        // @ts-ignore
        return super.sharedMaterials;
    }

    set sharedMaterials (val) {
        // @ts-ignore
        super.sharedMaterials = val;
    }

    // color over lifetime module
    /**
     * @en Color control module
     * @zh 颜色控制模块
     * @property {ColorOverLifetimeModule} colorOverLifetimeModule
     */
    @property({
        type: ColorOverLifetimeModule,
        displayOrder: 23,
        tooltip:'i18n:particle.color_module',
    })
    public colorOverLifetimeModule = new ColorOverLifetimeModule();

    // Shape module
    /**
     * @en Particle emitter module
     * @zh 粒子发射器模块
     * @property {ShapeModule} shapeModule
     */
    @property({
        type: ShapeModule,
        displayOrder: 17,
        tooltip:'i18n:particle.shape_module',
    })
    public shapeModule = new ShapeModule();

    // size over lifetime module
    /**
     * @en Particle size module
     * @zh 粒子大小模块
     * @property {SizeOvertimeModule} sizeOvertimeModule
     */
    @property({
        type: SizeOvertimeModule,
        displayOrder: 21,
        tooltip:'i18n:particle.size_module',
    })
    public sizeOvertimeModule = new SizeOvertimeModule();

    /**
     * @en Particle speed module
     * @zh 粒子速度模块
     * @property {VelocityOvertimeModule} velocityOvertimeModule
     */
    @property({
        type: VelocityOvertimeModule,
        displayOrder: 18,
        tooltip:'i18n:particle.speed_module',
    })
    public velocityOvertimeModule = new VelocityOvertimeModule();

    /**
     * @en Particle acceleration module
     * @zh 粒子加速度模块
     * @property {ForceOvertimeModule} forceOvertimeModule
     */
    @property({
        type: ForceOvertimeModule,
        displayOrder: 19,
        tooltip:'i18n:particle.force_module',
    })
    public forceOvertimeModule = new ForceOvertimeModule();

    /**
     * @en Particle limit speed module (only CPU particles are supported)
     * @zh 粒子限制速度模块（只支持 CPU 粒子）
     * @property {LimitVelocityOvertimeModule} limitVelocityOvertimeModule
     */
    @property({
        type: LimitVelocityOvertimeModule,
        displayOrder: 20,
        tooltip:'i18n:particle.limit_module',
    })
    public limitVelocityOvertimeModule = new LimitVelocityOvertimeModule();

    /**
     * @en Particle rotation module
     * @zh 粒子旋转模块
     * @property {RotationOvertimeModule} rotationOvertimeModule
     */
    @property({
        type: RotationOvertimeModule,
        displayOrder: 22,
        tooltip:'i18n:particle.rotation_module',
    })
    public rotationOvertimeModule = new RotationOvertimeModule();

    /**
     * @en Texture Animation Module
     * @zh 贴图动画模块
     * @property {TextureAnimationModule} textureAnimationModule
     */
    @property({
        type: TextureAnimationModule,
        displayOrder: 24,
        tooltip:'i18n:particle.texture_module',
    })
    public textureAnimationModule = new TextureAnimationModule();

    /**
     * @en Particle Trajectory Module
     * @zh 粒子轨迹模块
     * @property {TrailModule} trailModule
     */
    @property({
        type: TrailModule,
        displayOrder: 25,
        tooltip:'i18n:particle.trail_module',
    })
    public trailModule = new TrailModule();

    // particle system renderer
    /**
     * @en Particle renderer.
     * @zh 粒子渲染器
     * @property {ParticleSystemRenderer} renderer
     */
    @property({
        type: ParticleSystemRenderer,
        displayOrder: 26,
        tooltip:'i18n:particle.renderer_module',
    })
    public renderer: ParticleSystemRenderer = new ParticleSystemRenderer();

    // serilized culling
    @property({
        displayOrder: 27,
        tooltip:'i18n:particle.culling',
    })
    public enableCulling: boolean = false;

    /**
     * @ignore
     */
    private _isPlaying: boolean;
    private _isPaused: boolean;
    private _isStopped: boolean;
    private _isEmitting: boolean;

    private _time: number;  // playback position in seconds.
    private _emitRateTimeCounter: number;
    private _emitRateDistanceCounter: number;
    private _oldWPos: Vec3;
    private _curWPos: Vec3;

    private _customData1: Vec2;
    private _customData2: Vec2;

    private _subEmitters: any[]; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}

    @property
    private _prewarm = false;

    @property
    private _capacity = 100;

    @property
    private _simulationSpace = Space.Local;

    public processor: IParticleSystemRenderer | null = null;

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

        this._time = 0.0;  // playback position in seconds.
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
        this._oldWPos = new Vec3();
        this._curWPos = new Vec3();

        this._customData1 = new Vec2();
        this._customData2 = new Vec2();

        this._subEmitters = []; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}
    }

    public onLoad () {
        // HACK, TODO
        this.renderer.onInit(this);
        this.shapeModule.onInit(this);
        this.trailModule.onInit(this);
        this.bindModule();
        this._resetPosition();

        // this._system.add(this);
    }

    public _onMaterialModified (index: number, material: Material) {
        this.processor!.onMaterialModified(index, material);
    }

    public _onRebuildPSO (index: number, material: Material) {
        this.processor!.onRebuildPSO(index, material);
    }

    public _collectModels (): Model[] {
        this._models.length = 0;
        this._models.push((this.processor as any)._model);
        if (this.trailModule.enable && (this.trailModule as any)._trailModel) {
            this._models.push((this.trailModule as any)._trailModel);
        }
        return this._models;
    }

    protected _attachToScene () {
        this.processor!.attachToScene();
        if (this.trailModule.enable) {
            this.trailModule._attachToScene();
        }
    }

    protected _detachFromScene () {
        this.processor!.detachFromScene();
        if (this.trailModule.enable) {
            this.trailModule._detachFromScene();
        }
    }

    public bindModule () {
        this.colorOverLifetimeModule.bindTarget(this.processor!);
        this.sizeOvertimeModule.bindTarget(this.processor!);
        this.rotationOvertimeModule.bindTarget(this.processor!);
        this.forceOvertimeModule.bindTarget(this.processor!);
        this.limitVelocityOvertimeModule.bindTarget(this.processor!);
        this.velocityOvertimeModule.bindTarget(this.processor!);
        this.textureAnimationModule.bindTarget(this.processor!);
    }

    // TODO: Fast forward current particle system by simulating particles over given period of time, then pause it.
    // simulate(time, withChildren, restart, fixedTimeStep) {

    // }

    /**
     * 播放粒子效果。
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
    }

    /**
     * 暂停播放粒子效果。
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
     * 停止播放粒子。
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

        this._time = 0.0;
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;

        this._isStopped = true;
    }

    // remove all particles from current particle system.
    /**
     * @en Remove all particles from the particle system.
     * @zh 将所有粒子从粒子系统中清除。
     */
    public clear () {
        if (this.enabledInHierarchy) {
            this.processor!.clear();
            this.trailModule.clear();
        }
    }

    /**
     * @en Get the current particle count.
     * @zh 获取当前粒子数量
     */
    public getParticleCount () {
        return this.processor!.getParticleCount();
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
        // this._system.remove(this);
        this.processor!.onDestroy();
        this.trailModule.destroy();
    }

    protected onEnable () {
        if (this.playOnAwake) {
            this.play();
        }
        this.processor!.onEnable();
        this.trailModule.onEnable();
    }
    protected onDisable () {
        this.processor!.onDisable();
        this.trailModule.onDisable();
    }
    protected update (dt) {
        const scaledDeltaTime = dt * this.simulationSpeed;
        if (this._isPlaying) {
            this._time += scaledDeltaTime;

            // Execute emission
            this._emit(scaledDeltaTime);

            // simulation, update particles.
            if (this.processor!.updateParticles(scaledDeltaTime) === 0 && !this._isEmitting) {
                this.stop();
            }

            // update render data
            this.processor!.updateRenderData();

            // update trail
            if (this.trailModule.enable) {
                this.trailModule.updateRenderData();
            }
        }
    }

    protected _onVisibilityChange (val) {
        // @ts-ignore
        if (this.processor._model) {
            // @ts-ignore
            this.processor._model.visFlags = val;
        }
    }

    private emit (count, dt) {
        const delta = this._time / this.duration;

        if (this._simulationSpace === Space.World) {
            this.node.getWorldMatrix(_world_mat);
            this.node.getWorldRotation(_world_rol);
        }

        for (let i = 0; i < count; ++i) {
            const particle = this.processor!.getFreeParticle();
            if (particle === null) {
                return;
            }
            const rand = pseudoRandom(randomRangeInt(0, INT_MAX));

            if (this.shapeModule.enable) {
                this.shapeModule.emit(particle);
            }
            else {
                Vec3.set(particle.position, 0, 0, 0);
                Vec3.copy(particle.velocity, particleEmitZAxis);
            }

            if (this.textureAnimationModule.enable) {
                this.textureAnimationModule.init(particle);
            }

            Vec3.multiplyScalar(particle.velocity, particle.velocity, this.startSpeed.evaluate(delta, rand)!);

            if (this._simulationSpace === Space.World) {
                Vec3.transformMat4(particle.position, particle.position, _world_mat);
                Vec3.transformQuat(particle.velocity, particle.velocity, _world_rol);
            }

            Vec3.copy(particle.ultimateVelocity, particle.velocity);
            // apply startRotation.
            if (this.startRotation3D) {
                Vec3.set(particle.rotation, this.startRotationX.evaluate(delta, rand)!,
                    this.startRotationY.evaluate(delta, rand)!,
                    this.startRotationZ.evaluate(delta, rand)!);
            } else {
                Vec3.set(particle.rotation, 0, 0, this.startRotationZ.evaluate(delta, rand)!);
            }

            // apply startSize.
            if (this.startSize3D) {
                Vec3.set(particle.startSize, this.startSizeX.evaluate(delta, rand)!,
                    this.startSizeY.evaluate(delta, rand)!,
                    this.startSizeZ.evaluate(delta, rand)!);
            } else {
                Vec3.set(particle.startSize, this.startSizeX.evaluate(delta, rand)!, 1, 1);
                particle.startSize.y = particle.startSize.x;
            }
            Vec3.copy(particle.size, particle.startSize);

            // apply startColor.
            particle.startColor.set(this.startColor.evaluate(delta, rand));
            particle.color.set(particle.startColor);

            // apply startLifetime.
            particle.startLifetime = this.startLifetime.evaluate(delta, rand)! + dt;
            particle.remainingLifetime = particle.startLifetime;

            particle.randomSeed = randomRangeInt(0, 233280);

            this.processor!.setNewParticle(particle);

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
            this.processor!.updateParticles(dt);
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
                    return;
                }
            }

            // emit by rateOverTime
            this._emitRateTimeCounter += this.rateOverTime.evaluate(this._time / this.duration, 1)! * dt;
            if (this._emitRateTimeCounter > 1 && this._isEmitting) {
                const emitNum = Math.floor(this._emitRateTimeCounter);
                this._emitRateTimeCounter -= emitNum;
                this.emit(emitNum, dt);
            }
            // emit by rateOverDistance
            this.node.getWorldPosition(this._curWPos);
            const distance = Vec3.distance(this._curWPos, this._oldWPos);
            Vec3.copy(this._oldWPos, this._curWPos);
            this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(this._time / this.duration, 1)!;
            if (this._emitRateDistanceCounter > 1 && this._isEmitting) {
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

    private addBurst (burst) {
        this.bursts.push(burst);
    }

    private removeBurst (idx) {
        this.bursts.splice(this.bursts.indexOf(idx), 1);
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

    public _onBeforeSerialize (props) {
        return this.enableCulling ? props.filter(p => !PARTICLE_MODULE_PROPERTY.includes(p) || this[p].enable) : props;
    }
}
