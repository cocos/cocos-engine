// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// tslint:disable: max-line-length

import { Component } from '../../../components/component';
import { ccclass, executeInEditMode, executionOrder, menu, property, requireComponent } from '../../../core/data/class-decorator';
import { mat4, pseudoRandom, quat, randomRangeInt, vec2, vec3 } from '../../../core/vmath';
import { INT_MAX } from '../../../core/vmath/bits';
import { Material } from '../../assets';
import { RenderableComponent } from '../renderable-component';
import ColorOverLifetimeModule from './animator/color-overtime';
import CurveRange from './animator/curve-range';
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
import ParticleSystemRenderer from './renderer/particle-system-renderer';
import TrailModule from './renderer/trail';

const _world_mat = mat4.create();

@ccclass('cc.ParticleSystemComponent')
@menu('Components/ParticleSystemComponent')
@executionOrder(99)
@executeInEditMode
export class ParticleSystemComponent extends RenderableComponent {

    /**
     * 粒子系统能生成的最大粒子数量
     */
    @property({
        displayOrder: 1,
    })
    public get capacity () {
        return this._capacity;
    }

    public set capacity (val) {
        this._capacity = val;
        if (this.renderer && this.renderer._model) {
            this.renderer._model.setCapacity(this._capacity);
        }
    }

    /**
     * 粒子初始颜色
     */
    @property({
        type: GradientRange,
        displayOrder: 8,
    })
    public startColor = new GradientRange();

    /**
     * 粒子初始大小
     */
    @property({
        type: CurveRange,
        displayOrder: 9,
    })
    public startSize = new CurveRange();

    /**
     * 粒子初始速度
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 10,
    })
    public startSpeed = new CurveRange();

    /**
     * 粒子初始旋转角度
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 11,
    })
    public startRotation = new CurveRange();

    /**
     * 粒子系统开始运行后，延迟粒子发射的时间
     */
    @property({
        type: CurveRange,
        displayOrder: 6,
    })
    public startDelay = new CurveRange();

    /**
     * 粒子生命周期
     */
    @property({
        type: CurveRange,
        displayOrder: 7,
    })
    public startLifetime = new CurveRange();

    /**
     * 粒子系统运行时间
     */
    @property({
        displayOrder: 0,
    })
    public duration = 5.0;

    /**
     * 粒子系统是否循环播放
     */
    @property({
        displayOrder: 2,
    })
    public loop = true;

    /**
     * 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）
     */
    @property({
        displayOrder: 3,
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
     * 选择粒子系统所在的坐标系<br>
     * 世界坐标（不随其他物体位置改变而变换）<br>
     * 局部坐标（跟随父节点位置改变而移动）<br>
     * 自定坐标（跟随自定义节点的位置改变而移动）
     */
    @property({
        type: Space,
        displayOrder: 4,
    })
    get simulationSpace () {
        return this._simulationSpace;
    }

    set simulationSpace (val) {
        if (val !== this._simulationSpace) {
            this._simulationSpace = val;
            (this.renderer as any)._updateMaterialParams();
            (this.renderer as any)._updateTrailMaterial();
        }
    }

    /**
     * 控制整个粒子系统的更新速度
     */
    @property({
        displayOrder: 5,
    })
    public simulationSpeed = 1.0;

    /**
     * 粒子系统加载后是否自动开始播放
     */
    @property({
        displayOrder: 2,
    })
    public playOnAwake = true;

    /**
     * 粒子受重力影响的重力系数
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 12,
    })
    public gravityModifier = new CurveRange();

    // emission module
    /**
     * 每秒发射的粒子数
     */
    @property({
        type: CurveRange,
        displayOrder: 13,
    })
    public rateOverTime = new CurveRange();

    /**
     * 每移动单位距离发射的粒子数
     */
    @property({
        type: CurveRange,
        displayOrder: 14,
    })
    public rateOverDistance = new CurveRange();

    /**
     * 设定在指定时间发射指定数量的粒子的 Brust 的数量
     */
    @property({
        type: [Burst],
        displayOrder: 15,
    })
    public bursts = new Array();

    @property({
        type: Material,
        displayName: 'Materials',
        visible: false,
        override: true,
    })
    get sharedMaterials () {
        // if we don't create an array copy, the editor will modify the original array directly.
        return super.sharedMaterials;
    }

    set sharedMaterials (val) {
        super.sharedMaterials = val;
    }

    // color over lifetime module
    /**
     * 颜色控制模块
     */
    @property({
        type: ColorOverLifetimeModule,
    })
    public colorOverLifetimeModule = new ColorOverLifetimeModule();

    // shpae module
    /**
     * 粒子发射器模块
     */
    @property({
        type: ShapeModule,
    })
    public shapeModule = new ShapeModule();

    // size over lifetime module
    /**
     * 粒子大小模块
     */
    @property({
        type: SizeOvertimeModule,
    })
    public sizeOvertimeModule = new SizeOvertimeModule();

    /**
     * 粒子速度模块
     */
    @property({
        type: VelocityOvertimeModule,
    })
    public velocityOvertimeModule = new VelocityOvertimeModule();

    /**
     * 粒子加速度模块
     */
    @property({
        type: ForceOvertimeModule,
    })
    public forceOvertimeModule = new ForceOvertimeModule();

    /**
     * 粒子限制速度模块（只支持 CPU 粒子）
     */
    @property({
        type: LimitVelocityOvertimeModule,
    })
    public limitVelocityOvertimeModule = new LimitVelocityOvertimeModule();

    /**
     * 粒子旋转模块
     */
    @property({
        type: RotationOvertimeModule,
    })
    public rotationOvertimeModule = new RotationOvertimeModule();

    /**
     * 贴图动画模块
     */
    @property({
        type: TextureAnimationModule,
    })
    public textureAnimationModule = new TextureAnimationModule();

    /**
     * 粒子轨迹模块
     */
    @property({
        type: TrailModule,
    })
    public trailModule = new TrailModule();

    // particle system renderer
    @property({
        type: ParticleSystemRenderer,
    })
    public renderer: ParticleSystemRenderer = new ParticleSystemRenderer();

    private _isPlaying: boolean;
    private _isPaused: boolean;
    private _isStopped: boolean;
    private _isEmitting: boolean;

    private _time: number;  // playback position in seconds.
    private _emitRateTimeCounter: number;
    private _emitRateDistanceCounter: number;
    private _oldWPos: vec3;
    private _curWPos: vec3;

    private _customData1: vec2;
    private _customData2: vec2;

    private _subEmitters: any[]; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}

    @property
    private _prewarm = false;

    @property
    private _capacity = 100;

    @property
    private _simulationSpace = Space.Local;

    constructor () {
        super();

        this.rateOverTime.constant = 10;
        this.startLifetime.constant = 5;
        this.startSize.constant = 1;
        this.startSpeed.constant = 1;

        // internal status
        this._isPlaying = false;
        this._isPaused = false;
        this._isStopped = true;
        this._isEmitting = false;

        this._time = 0.0;  // playback position in seconds.
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
        this._oldWPos = vec3.create(0, 0, 0);
        this._curWPos = vec3.create(0, 0, 0);

        this._customData1 = vec2.create(0, 0);
        this._customData2 = vec2.create(0, 0);

        this._subEmitters = []; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}
    }

    public onLoad () {
        // HACK, TODO
        super.onLoad();
        this.renderer!.onInit(this);
        this.shapeModule.onInit(this);
        this.trailModule.init(this);
        this.textureAnimationModule.onInit(this);

        this.node.getWorldPosition(this._oldWPos);
        vec3.copy(this._curWPos, this._oldWPos);

        // this._system.add(this);
    }

    public _onMaterialModified (index: number, material: Material) {
        this.renderer._onMaterialModified(index, material);
    }

    public _onRebuildPSO (index: number, material: Material) {
        this.renderer._onRebuildPSO(index, material);
    }

    // TODO: fastforward current particle system by simulating particles over given period of time, then pause it.
    // simulate(time, withChildren, restart, fixedTimeStep) {

    // }

    /**
     * 播放粒子效果
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

        // prewarm
        if (this._prewarm) {
            this._prewarmSystem();
        }
    }

    /**
     * 暂停播放粒子效果
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
     * 停止播放粒子
     */
    public stop () {
        if (this._isPlaying) {
            this._isPlaying = false;
        }
        if (this._isPaused) {
            this._isPaused = false;
        }

        this.clear();
        this._time = 0.0;
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;

        this._isStopped = true;
    }

    // remove all particles from current particle system.
    /**
     * 将所有粒子从粒子系统中清除
     */
    public clear () {
        this.renderer!.clear();
    }

    public getParticleCount () {
        return this.renderer!.getParticleCount();
    }

    public setCustomData1 (x, y) {
        vec2.set(this._customData1, x, y);
    }

    public setCustomData2 (x, y) {
        vec2.set(this._customData2, x, y);
    }

    protected onDestroy () {
        // this._system.remove(this);
        this.renderer.onDestroy();
        this.trailModule.destroy();
    }

    protected onEnable () {
        super.onEnable();
        if (this.playOnAwake) {
            this.play();
        }
        this.renderer.onEnable();
        this.trailModule.onEnable();
    }

    protected onDisable () {
        this.renderer!.onDisable();
        this.trailModule.onDisable();
    }

    protected update (dt) {
        const scaledDeltaTime = dt * this.simulationSpeed;
        if (this._isPlaying) {
            this._time += scaledDeltaTime;

            // excute emission
            this._emit(scaledDeltaTime);

            // simulation, update particles.
            if (this.renderer!._updateParticles(scaledDeltaTime) === 0 && !this._isEmitting) {
                this.stop();
            }

            // update render data
            this.renderer!._updateRenderData();

            // update trail
            if (this.trailModule.enable) {
                this.trailModule.updateRenderData();
            }
        }
    }

    private emit (count, emitParams = null) {
        if (emitParams !== null) {
            // TODO:
        }

        for (let i = 0; i < count; ++i) {
            const particle = this.renderer!._getFreeParticle();
            if (particle === null) {
                return;
            }
            const rand = pseudoRandom(randomRangeInt(0, INT_MAX));

            if (this.shapeModule.enable) {
                this.shapeModule.emit(particle);
            }
            else {
                vec3.set(particle.position, 0, 0, 0);
                vec3.copy(particle.velocity, particleEmitZAxis);
            }

            vec3.scale(particle.velocity, particle.velocity, this.startSpeed.evaluate(this._time / this.duration, rand)!);

            switch (this._simulationSpace) {
                case Space.Local:
                    break;
                case Space.World:
                    this.node.getWorldMatrix(_world_mat);
                    vec3.transformMat4(particle.position, particle.position, _world_mat);
                    const worldRot = quat.create();
                    this.node.getWorldRotation(worldRot);
                    vec3.transformQuat(particle.velocity, particle.velocity, worldRot);
                    break;
                case Space.Custom:
                    // TODO:
                    break;
            }
            vec3.copy(particle.ultimateVelocity, particle.velocity);
            // apply startRotation. now 2D only.
            vec3.set(particle.rotation, this.startRotation.evaluate(this._time / this.duration, rand)!, 0, 0);

            // apply startSize. now 2D only.
            vec3.set(particle.startSize, this.startSize.evaluate(this._time / this.duration, rand)!, 0, 0);
            vec3.copy(particle.size, particle.startSize);

            // apply startColor.
            particle.startColor.set(this.startColor.evaluate(this._time / this.duration, rand));
            particle.color.set(particle.startColor);

            // apply startLifetime.
            particle.startLifetime = this.startLifetime.evaluate(this._time / this.duration, rand)!;
            particle.remainingLifetime = particle.startLifetime;

            particle.randomSeed = randomRangeInt(0, 233280);

            this.renderer!._setNewParticle(particle);

        } // end of particles forLoop.
    }

    // initialize particle system as though it had already completed a full cycle.
    private _prewarmSystem () {
        this.startDelay.mode = 'constant'; // clear startDelay.
        this.startDelay.constant = 0;
        const dt = 1.0; // should use varying value?
        const cnt = this.duration / dt;
        for (let i = 0; i < cnt; ++i) {
            this._time += dt;
            this._emit(dt);
            this.renderer!._updateParticles(dt);
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
                this.emit(emitNum);
            }
            // emit by rateOverDistance
            this.node.getWorldPosition(this._curWPos);
            const distance = vec3.distance(this._curWPos, this._oldWPos);
            vec3.copy(this._oldWPos, this._curWPos);
            this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(this._time / this.duration, 1)!;
            if (this._emitRateDistanceCounter > 1 && this._isEmitting) {
                const emitNum = Math.floor(this._emitRateDistanceCounter);
                this._emitRateDistanceCounter -= emitNum;
                this.emit(emitNum);
            }

            // bursts
            for (const burst of this.bursts) {
                burst.update(this, dt);
            }
        }
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
}
