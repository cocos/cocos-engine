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
import { ccclass, help, executeInEditMode, executionOrder, menu, tooltip, displayOrder, type, range, displayName, formerlySerializedAs, override, radian, serializable, visible, requireComponent } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { approx, clamp01, Color, EPSILON, lerp, Mat3, Mat4, pseudoRandom, Quat, randomRangeInt, Size, Vec2, Vec3, Vec4 } from '../core/math';
import { countTrailingZeros, INT_MAX } from '../core/math/bits';
import { MultiplyColorModule } from './modules/multiply-color';
import { CurveRange, Mode } from './curve-range';
import { ForceModule } from './modules/force';
import { LimitVelocityModule } from './modules/limit-velocity';
import { RotationModule } from './modules/rotation';
import { SizeModule } from './modules/size';
import { SubUVAnimationModule } from './modules/sub-uv-animation';
import { AddVelocityModule } from './modules/add-velocity';
import { StartColorModule } from './modules/start-color';
import { StartSizeModule } from './modules/start-size';
import { StartSpeedModule } from './modules/start-speed';
import { StartLifeTimeModule } from './modules/start-life-time';
import { SpawnOverTimeModule } from './modules/spawn-over-time';
import { SpawnPerUnitModule } from './modules/spawn-per-unit';
import { GravityModule } from './modules/gravity';
import { StateModule } from './modules/state';
import { SolveModule } from './modules/solve';
import { ScaleSpeedModule } from './modules/scale-speed';
import { StartRotationModule } from './modules/start-rotation';
import { ShapeModule } from './modules/shape';
import { InheritedProperty, ParticleEmitterParams, ParticleEmitterState, ParticleEventInfo, ParticleEventType, ParticleExecContext, PlayingState } from './particle-base';
import { CullingMode, Space } from './enum';
import { ParticleRenderer } from './particle-renderer';
import { legacyCC } from '../core/global-exports';
import { TransformBit } from '../core/scene-graph/node-enum';
import { AABB, intersect } from '../core/geometry';
import { Camera, Model } from '../core/renderer/scene';
import { NoiseModule } from './modules/noise';
import { assert, BitMask, CCBoolean, CCClass, CCFloat, CCInteger, Component, Enum, geometry, js } from '../core';
import { INVALID_HANDLE, ParticleHandle, ParticleDataSet, BuiltinParticleParameter } from './particle-data-set';
import { ParticleModule, ParticleModuleStage, ModuleExecStage } from './particle-module';
import { vfxManager } from './vfx-manager';
import { BurstModule } from './modules/burst';
import { SpawnFractionCollection } from './spawn-fraction-collection';
import { DeathEventGeneratorModule, LegacyTrailModule, LocationEventGeneratorModule } from './modules';
import { VFXSystem } from './vfx-system';
import { ParticleParameterIdentity, ParticleParameterType } from './particle-parameter';

const startPositionOffset = new Vec3();
const tempPosition = new Vec3();
const tempDir = new Vec3();
const dir = new Vec3();
const up = new Vec3();
const rot = new Quat();
const eventInfo = new ParticleEventInfo();

@ccclass('cc.EventReceiver')
export class EventReceiver {
    @visible(true)
    @serializable
    public target: ParticleEmitter | null = null;

    @type(Enum(ParticleEventType))
    @visible(true)
    @serializable
    public eventType = ParticleEventType.UNKNOWN;

    @type(BitMask(InheritedProperty))
    @visible(true)
    @serializable
    public inheritedProperties = 0;

    @displayName('事件处理')
    @type(ParticleModuleStage)
    get stage () {
        return this._stage;
    }

    get spawnFractionCollection () {
        if (!this._spawnFractionCollection) {
            this._spawnFractionCollection = new SpawnFractionCollection();
        }
        return this._spawnFractionCollection;
    }

    @serializable
    private _stage = new ParticleModuleStage(ModuleExecStage.EVENT_HANDLER);
    private _spawnFractionCollection: SpawnFractionCollection | null = null;
}

@ccclass('cc.ParticleEmitter')
@help('i18n:cc.ParticleEmitter')
@menu('Effects/ParticleEmitter')
@executionOrder(99)
@executeInEditMode
export class ParticleEmitter extends Component {
    public static CullingMode = CullingMode;

    /**
     * @zh 粒子系统运行时间。
     */
    @tooltip('i18n:particle_system.duration')
    public get duration () {
        return 1 / this._params.invDuration;
    }

    public set duration (val) {
        this._params.invDuration = 1 / val;
    }

    /**
     * @zh 粒子系统是否循环播放。
     */
    @tooltip('i18n:particle_system.loop')
    public get loop () {
        return this._params.loop;
    }

    public set loop (val) {
        this._params.loop = val;
    }

    /**
     * @zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）。
     */
    @tooltip('i18n:particle_system.prewarm')
    public get prewarm () {
        return this._params.prewarm;
    }

    public set prewarm (val) {
        this._params.prewarm = val;
    }

    /**
     * @zh 粒子系统开始运行后，延迟粒子发射的时间。
     */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startDelay')
    public get startDelay () {
        return this._params.startDelay;
    }

    public set startDelay (val) {
        this._params.startDelay = val;
    }

    /**
     * @zh 选择粒子系统所在的坐标系[[Space]]。<br>
     */
    @type(Enum(Space))
    @tooltip('i18n:particle_system.simulationSpace')
    public get simulationSpace () {
        return this._params.simulationSpace;
    }

    public set simulationSpace (val) {
        this._params.simulationSpace = val;
    }

    /**
     * @zh 控制整个粒子系统的更新速度。
     */
    @tooltip('i18n:particle_system.simulationSpeed')
    public get simulationSpeed () {
        return this._params.simulationSpeed;
    }

    public set simulationSpeed (val) {
        this._params.simulationSpeed = val;
    }

    @type(Enum(Space))
    @tooltip('i18n:particle_system.scaleSpace')
    public get scaleSpace () {
        return this._params.scaleSpace;
    }

    public set scaleSpace (val) {
        this._params.scaleSpace = val;
    }

    /**
     * @zh 粒子系统能生成的最大粒子数量。
     */
    @type(CCInteger)
    @range([0, Number.POSITIVE_INFINITY])
    @tooltip('i18n:particle_system.capacity')
    public get capacity () {
        return this._params.capacity;
    }

    public set capacity (val) {
        this._params.capacity = Math.floor(val > 0 ? val : 0);
    }

    /**
     * @zh 粒子系统加载后是否自动开始播放。
     */
    @tooltip('i18n:particle_system.playOnAwake')
    public get playOnAwake () {
        return this._params.playOnAwake;
    }

    public set playOnAwake (val) {
        this._params.playOnAwake = val;
    }

    /**
     * @en Particle culling mode option. Includes pause, pause and catchup, always simulate.
     * @zh 粒子剔除模式选择。包括暂停模拟，暂停以后快进继续以及不间断模拟。
     */
    @type(Enum(CullingMode))
    @tooltip('i18n:particle_system.cullingMode')
    public get cullingMode () {
        return this._params.cullingMode;
    }

    public set cullingMode (val) {
        this._params.cullingMode = val;
    }

    @type(CCBoolean)
    @visible(true)
    public get spawningUseInterpolation () {
        return this._params.spawningUseInterpolation;
    }

    public set spawningUseInterpolation (val) {
        this._params.spawningUseInterpolation = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartColorModule.startColor]] instead.
     */
    get startColor () {
        return this._spawningStage.getOrAddModule(StartColorModule).startColor;
    }

    set startColor (val) {
        this._spawningStage.getOrAddModule(StartColorModule).startColor = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSizeModule.startSize3D]] instead.
     */
    get startSize3D () {
        return this._spawningStage.getOrAddModule(StartSizeModule).startSize3D;
    }

    set startSize3D (val) {
        this._spawningStage.getOrAddModule(StartSizeModule).startSize3D = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSizeModule.startSizeX]] instead.
     */
    get startSizeX () {
        return this._spawningStage.getOrAddModule(StartSizeModule).startSizeX;
    }

    set startSizeX (val) {
        this._spawningStage.getOrAddModule(StartSizeModule).startSizeX = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSizeModule.startSizeY]] instead.
     */
    get startSizeY () {
        return this._spawningStage.getOrAddModule(StartSizeModule).startSizeY;
    }

    set startSizeY (val) {
        this._spawningStage.getOrAddModule(StartSizeModule).startSizeY = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSizeModule.startSizeZ]] instead.
     */
    get startSizeZ () {
        return this._spawningStage.getOrAddModule(StartSizeModule).startSizeZ;
    }

    set startSizeZ (val) {
        this._spawningStage.getOrAddModule(StartSizeModule).startSizeZ = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSpeedModule.startSpeed]] instead.
     */
    get startSpeed () {
        return this._spawningStage.getOrAddModule(StartSpeedModule).startSpeed;
    }

    set startSpeed (val) {
        this._spawningStage.getOrAddModule(StartSpeedModule).startSpeed = val;
    }

    /**
     * @zh 颜色控制模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get colorOverLifetimeModule () {
        return this._updateStage.getOrAddModule(MultiplyColorModule);
    }

    /**
     * @zh 粒子发射器模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get shapeModule () {
        return this._spawningStage.getOrAddModule(ShapeModule);
    }

    /**
     * @zh 粒子大小模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get sizeOverLifetimeModule () {
        return this._updateStage.getOrAddModule(SizeModule);
    }

    /**
     * @zh 粒子速度模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get velocityOverLifetimeModule () {
        return this._updateStage.getOrAddModule(AddVelocityModule);
    }

    /**
     * @zh 粒子加速度模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get forceOverLifetimeModule () {
        return this._updateStage.getOrAddModule(ForceModule);
    }

    /**
     * @zh 粒子限制速度模块（只支持 CPU 粒子）
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.。
     */
    public get limitVelocityOverLifetimeModule () {
        return this._updateStage.getOrAddModule(LimitVelocityModule);
    }

    /**
     * @zh 粒子旋转模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get rotationOverLifetimeModule () {
        return this._updateStage.getOrAddModule(RotationModule);
    }

    /**
     * @zh 贴图动画模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get textureAnimationModule () {
        return this._updateStage.getOrAddModule(SubUVAnimationModule);
    }

    /**
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get noiseModule () {
        return this._updateStage.getOrAddModule(NoiseModule);
    }

    /**
     * @zh 粒子轨迹模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get trailModule () {
        return this._updateStage.getOrAddModule(LegacyTrailModule);
    }

    public get particles () {
        return this._particles;
    }

    public get isPlaying () {
        return this._state.playingState === PlayingState.PLAYING;
    }

    public get isPaused () {
        return this._state.playingState === PlayingState.PAUSED;
    }

    public get isStopped () {
        return this._state.playingState === PlayingState.STOPPED;
    }

    public get isEmitting () {
        return this._state.isEmitting;
    }

    public get time () {
        return this._state.accumulatedTime;
    }

    @displayName('发射器更新')
    @type(ParticleModuleStage)
    public get emitterStage () {
        return this._emitterStage;
    }

    @displayName('粒子生成')
    @type(ParticleModuleStage)
    public get spawningStage () {
        return this._spawningStage;
    }

    @displayName('粒子更新')
    @type(ParticleModuleStage)
    public get updateStage () {
        return this._updateStage;
    }

    @displayName('事件接收器')
    @type([EventReceiver])
    public get eventReceivers () {
        return this._eventReceivers;
    }

    @displayName('渲染')
    @type(ParticleModuleStage)
    public get renderStage () {
        return this._renderStage;
    }

    public get lastSimulateFrame () {
        return this._state.lastSimulateFrame;
    }

    @serializable
    private _emitterStage = new ParticleModuleStage(ModuleExecStage.EMITTER_UPDATE);
    @serializable
    private _spawningStage = new ParticleModuleStage(ModuleExecStage.SPAWN);
    @serializable
    private _updateStage = new ParticleModuleStage(ModuleExecStage.UPDATE);
    @serializable
    private _eventReceivers: EventReceiver[] = [];
    @serializable
    private _renderStage = new ParticleModuleStage(ModuleExecStage.RENDER);
    @serializable
    private _params = new ParticleEmitterParams();
    @serializable
    private _particles = new ParticleDataSet();
    private _bounds = new Vec3();
    private _context = new ParticleExecContext();
    private _state = new ParticleEmitterState();
    private _customParameterId: number = BuiltinParticleParameter.COUNT;
    private _customParameters: ParticleParameterIdentity[] = [];

    /**
     * @en play particle system
     * @zh 播放粒子效果。
     */
    public play () {
        this._state.playingState = PlayingState.PLAYING;
        this._state.isEmitting = true;
        this._state.currentPosition.set(this.node.worldPosition);
        this._state.startDelay = this.startDelay.evaluate(0, 1);
        vfxManager.addEmitter(this);
    }

    /**
     * @en pause particle system
     * @zh 暂停播放粒子效果。
     */
    public pause () {
        if (this.isStopped) {
            console.warn('pause(): particle system is already stopped.');
            return;
        }
        this._state.playingState = PlayingState.PAUSED;
    }

    /**
     * @zh 停止发射粒子。
     * @en Stop emitting particles.
     */
    public stopEmitting () {
        this._state.isEmitting = false;
    }

    /**
     * @en stop particle system
     * @zh 停止播放粒子。
     */
    public stop () {
        if (this.isPlaying || this.isPaused) {
            this.clear();
        }
        vfxManager.removeEmitter(this);
        this._state.isEmitting = false;
        this._state.playingState = PlayingState.STOPPED;
    }

    /**
     * @en remove all particles from current particle system.
     * @zh 将所有粒子从粒子系统中清除。
     */
    public clear () {
        this._particles.clear();
    }

    /**
     * @zh 获取当前粒子数量
     */
    public getParticleCount () {
        return this._particles.count;
    }

    public addCustomParameter (name: string, type: ParticleParameterType) {
        const identity = new ParticleParameterIdentity(this._customParameterId++, name, type);
        this._customParameters.push(identity);
        return identity;
    }

    public removeCustomParameter (name: string) {
        const index = this._customParameters.findIndex((identity) => identity.name === name);
        if (index >= 0) {
            this._customParameters.splice(index, 1);
        }
    }

    public getCustomParameter (name: string) {
        return this._customParameters.find((identity) => identity.name === name);
    }

    public addEventReceiver () {
        const eventReceiver = new EventReceiver();
        this._eventReceivers.push(eventReceiver);
        return eventReceiver;
    }

    public getEventReceiverAt (index: number) {
        assert(index < this._eventReceivers.length && index >= 0, 'Invalid index!');
        return this._eventReceivers[index];
    }

    public removeEventReceiverAt (index: number) {
        assert(index < this._eventReceivers.length && index >= 0, 'Invalid index!');
        this._eventReceivers.splice(index, 1);
    }

    public simulate (dt: number) {
        this._state.lastSimulateFrame = vfxManager.totalFrames;
        let scaledDeltaTime = dt * Math.max(this.simulationSpeed, 0);
        if (scaledDeltaTime > vfxManager.maxEmitterDeltaTime) {
            scaledDeltaTime /= Math.ceil(scaledDeltaTime / vfxManager.maxEmitterDeltaTime);
        }

        if (this.isPlaying && this._state.isSimulating) {
            // simulation, update particles.
            this.tick(scaledDeltaTime);

            if (this._particles.count === 0 && !this.loop && !this.isEmitting) {
                this.stop();
            }
        }

        const currentPosition = this.node.worldPosition;
        const boundingBox = new AABB(currentPosition.x, currentPosition.y, currentPosition.z,
            this._bounds.x, this._bounds.y, this._bounds.z);

        const cameraLst: Camera[]| undefined = this.node.scene.renderScene?.cameras;
        let culled = true;
        if (cameraLst) {
            for (let i = 0; i < cameraLst.length; ++i) {
                const camera = cameraLst[i];
                const visibility = camera.visibility;
                if ((visibility & this.node.layer) === this.node.layer) {
                    if (intersect.aabbFrustum(boundingBox, camera.frustum)) {
                        culled = false;
                        break;
                    }
                }
            }
        }
        if (culled) {
            if (this.cullingMode !== CullingMode.ALWAYS_SIMULATE) {
                this._state.isSimulating = false;
            }
            if (this.cullingMode === CullingMode.PAUSE_AND_CATCHUP) {
                this._state.accumulatedTime += scaledDeltaTime;
            }
        } else {
            this._state.isSimulating = true;
        }
    }

    protected onLoad () {
        this._emitterStage.getOrAddModule(BurstModule);
        this._emitterStage.getOrAddModule(SpawnPerUnitModule);
        this._emitterStage.getOrAddModule(SpawnOverTimeModule);
        this._spawningStage.getOrAddModule(ShapeModule);
        this._spawningStage.getOrAddModule(StartColorModule);
        this._spawningStage.getOrAddModule(StartLifeTimeModule);
        this._spawningStage.getOrAddModule(StartRotationModule);
        this._spawningStage.getOrAddModule(StartSizeModule);
        this._spawningStage.getOrAddModule(StartSpeedModule);
        this._updateStage.getOrAddModule(MultiplyColorModule);
        this._updateStage.getOrAddModule(ForceModule);
        this._updateStage.getOrAddModule(GravityModule);
        this._updateStage.getOrAddModule(LimitVelocityModule);
        this._updateStage.getOrAddModule(NoiseModule);
        this._updateStage.getOrAddModule(RotationModule);
        this._updateStage.getOrAddModule(SizeModule);
        this._updateStage.getOrAddModule(StateModule);
        this._updateStage.getOrAddModule(SolveModule);
        this._updateStage.getOrAddModule(ScaleSpeedModule);
        this._updateStage.getOrAddModule(SubUVAnimationModule);
        this._updateStage.getOrAddModule(AddVelocityModule);
        this._updateStage.getOrAddModule(DeathEventGeneratorModule);
        this._updateStage.getOrAddModule(LocationEventGeneratorModule);
        if (this.eventReceivers.length === 0) {
            this.addEventReceiver();
        }
        this.getEventReceiverAt(0).stage.getOrAddModule(SpawnOverTimeModule);
        this.getEventReceiverAt(0).stage.getOrAddModule(SpawnPerUnitModule);
        this.getEventReceiverAt(0).stage.getOrAddModule(BurstModule);
    }

    protected onEnable () {
        if (this.playOnAwake && (!EDITOR || legacyCC.GAME_VIEW)) {
            this.play();
        }
    }

    protected onDisable () {
        this.stop();
    }

    // spawn particle system as though it had already completed a full cycle.
    private _prewarmSystem () {
        this.startDelay.mode = Mode.Constant; // clear startDelay.
        this.startDelay.constant = 0;
        const dt = 1.0; // should use varying value?
        const cnt = this.duration / dt;

        for (let i = 0; i < cnt; ++i) {
            this.tick(dt);
        }
    }

    // internal function
    private tick (deltaTime: number) {
        const particles = this._particles;
        const context = this._context;
        const params = this._params;
        const state = this._state;
        context.clear();
        state.lastPosition.set(state.currentPosition);
        state.currentPosition.set(this.node.worldPosition);
        context.setWorldMatrix(this.node.worldMatrix, this.simulationSpace === Space.WORLD);
        Vec3.subtract(context.velocity, state.currentPosition, state.lastPosition);
        Vec3.multiplyScalar(context.velocity, context.velocity, 1 / deltaTime);
        context.emitterTransform.set(params.simulationSpace === Space.WORLD ? context.localToWorld : Mat4.IDENTITY);
        const prevTime = Math.max(state.accumulatedTime - state.startDelay, 0);
        state.accumulatedTime += deltaTime;
        const currentTime = Math.max(state.accumulatedTime - state.startDelay, 0);
        context.setEmitterTime(currentTime, prevTime, params.invDuration);
        context.setDeltaTime(deltaTime);
        this.preTick(particles, params, context);

        this._emitterStage.execute(particles, params, context);
        const particleCount = particles.count;
        if (particleCount > 0) {
            context.setExecuteRange(0, particleCount);
            this.resetAnimatedState(particles, 0, particleCount);
            this._updateStage.execute(particles, params, context);
        }

        if (state.isEmitting) {
            state.spawnFraction = this.emit(particles, params,
                params.simulationSpace === Space.WORLD ? context.velocity : Vec3.ZERO, state.spawnFraction);
        }

        this.handleEvents();
        this.updateBounds();
        context.setExecuteRange(0, particleCount);
        this._renderStage.execute(particles, params, context);
    }

    private preTick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        this._emitterStage.tick(particles, params, context);
        this._spawningStage.tick(particles, params, context);
        this._updateStage.tick(particles, params, context);
        this._renderStage.tick(particles, params, context);
        if (this._eventReceivers.length > 0 || params.simulationSpace === Space.WORLD) {
            context.markRequiredParameter(BuiltinParticleParameter.POSITION);
        }
        particles.ensureParameters(context.requiredParameters, this._customParameters);
    }

    private updateBounds () {

    }

    private handleEvents () {
        for (let i = 0, length = this._eventReceivers.length; i < length; i++) {
            const eventReceiver = this._eventReceivers[i];
            const emitter = eventReceiver.target;
            const spawnFractionCollection = eventReceiver.spawnFractionCollection;
            if (emitter && emitter.isValid) {
                let events = emitter._context.locationEvents;
                if (eventReceiver.eventType === ParticleEventType.DEATH) {
                    events = emitter._context.deathEvents;
                } else if (eventReceiver.eventType === ParticleEventType.LOCATION) {
                    spawnFractionCollection.reserve(events.capacity);
                    spawnFractionCollection.sync(events.particleId, events.count);
                }
                for (let i = 0, length = events.count; i < length; i++) {
                    events.getEventInfoAt(eventInfo, i);
                    Vec3.normalize(dir, eventInfo.velocity);
                    const angle = Math.abs(Vec3.dot(dir, Vec3.UNIT_Z));
                    Vec3.lerp(up, Vec3.UNIT_Z, Vec3.UNIT_Y, angle);
                    Quat.fromViewUp(rot, dir, up);
                    Mat4.fromRT(this._context.emitterTransform, rot, eventInfo.position);
                    Vec3.copy(this._context.velocity, eventInfo.velocity);
                    if (this._params.simulationSpace === Space.LOCAL) {
                        Mat4.multiply(this._context.emitterTransform, this._context.worldToLocal, this._context.emitterTransform);
                        Vec3.transformMat4(this._context.velocity, this._context.velocity, this._context.worldToLocal);
                    }
                    let spawnFraction = 0;
                    if (eventReceiver.eventType === ParticleEventType.LOCATION) {
                        spawnFraction = spawnFractionCollection.fraction[i];
                    }
                    this._context.setExecuteRange(0, 0);
                    this._context.resetSpawningState();
                    this._context.setEmitterTime(eventInfo.currentTime, eventInfo.prevTime, this._params.invDuration);
                    eventReceiver.stage.execute(this._particles, this._params, this._context);
                    spawnFraction = this.emit(this.particles, this._params, this._context.velocity, spawnFraction);
                    if (eventReceiver.eventType === ParticleEventType.LOCATION) {
                        spawnFractionCollection.fraction[i] = spawnFraction;
                    }
                }
            }
        }
    }

    private resetAnimatedState (particles: ParticleDataSet, fromIndex: number, toIndex: number) {
        if (particles.hasParameter(BuiltinParticleParameter.VELOCITY)) {
            if (particles.hasParameter(BuiltinParticleParameter.BASE_VELOCITY)) {
                particles.velocity.copyFrom(particles.baseVelocity, fromIndex, toIndex);
            } else {
                particles.velocity.fill1f(0, fromIndex, toIndex);
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.SIZE)) {
            if (particles.hasParameter(BuiltinParticleParameter.BASE_SIZE)) {
                particles.size.copyFrom(particles.baseSize, fromIndex, toIndex);
            } else {
                particles.size.fill1f(1, fromIndex, toIndex);
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.ANGULAR_VELOCITY)) {
            particles.angularVelocity.fill1f(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.COLOR)) {
            if (particles.hasParameter(BuiltinParticleParameter.BASE_COLOR)) {
                particles.color.copyFrom(particles.baseColor, fromIndex, toIndex);
            } else {
                particles.color.fill(Color.WHITE, fromIndex, toIndex);
            }
        }
    }

    private emit (particles: ParticleDataSet, params: ParticleEmitterParams,
        initialVelocity: Vec3, spawnFraction: number): number {
        const context = this._context;
        const interval = 1 / context.spawnContinuousCount;
        spawnFraction += context.spawnContinuousCount;
        const numOverTime = Math.floor(spawnFraction);
        const fromIndex = particles.count;
        if (numOverTime > 0) {
            spawnFraction -= numOverTime;
            this.spawnParticles(particles, params, context, numOverTime);
        }
        const numContinuous = particles.count - fromIndex;
        const burstCount = Math.floor(context.burstCount);
        if (burstCount > 0) {
            this.spawnParticles(particles, params, context, burstCount);
        }
        const toIndex = particles.count;
        const { emitterDeltaTime, emitterNormalizedTime, emitterNormalizedPrevTime } = context;
        if (particles.hasParameter(BuiltinParticleParameter.POSITION)) {
            const initialPosition = context.emitterTransform.getTranslation(tempPosition);
            const { position } = particles;

            if (!initialVelocity.equals(Vec3.ZERO) && !approx(interval, 0) && numContinuous > 0) {
                for (let i = fromIndex, num = 0, length = fromIndex + numContinuous; i < length; i++, num++) {
                    const offset = clamp01((spawnFraction + num) * interval);
                    const subDt = offset * emitterDeltaTime;
                    Vec3.multiplyScalar(startPositionOffset, initialVelocity, -subDt);
                    position.addVec3At(startPositionOffset, i);
                }
                position.fill(initialPosition, fromIndex + numContinuous, toIndex);
            } else {
                position.fill(initialPosition, fromIndex, toIndex);
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.SPAWN_NORMALIZED_TIME)) {
            if (!approx(interval, 0) && numContinuous > 0) {
                const spawnTime = particles.spawnNormalizedTime.data;
                for (let i = fromIndex, num = 0, length = fromIndex + numContinuous; i < length; i++, num++) {
                    const offset = clamp01((spawnFraction + num) * interval);
                    const time = lerp(emitterNormalizedTime, emitterNormalizedPrevTime, offset);
                    spawnTime[i] = time;
                }
                particles.spawnNormalizedTime.fill(emitterNormalizedTime, fromIndex + numContinuous, toIndex);
            } else {
                particles.spawnNormalizedTime.fill(emitterNormalizedTime, fromIndex, toIndex);
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.BASE_VELOCITY)) {
            particles.baseVelocity.fill1f(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.ROTATION)) {
            particles.rotation.fill1f(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.AXIS_OF_ROTATION)) {
            particles.axisOfRotation.fill1f(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.BASE_SIZE)) {
            particles.baseSize.fill1f(1, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.BASE_COLOR)) {
            particles.baseColor.fill(Color.WHITE, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.INV_START_LIFETIME)) {
            particles.invStartLifeTime.fill(1, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME)) {
            particles.normalizedAliveTime.fill(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.ID)) {
            const id = particles.id.data;
            for (let i = fromIndex; i < toIndex; i++) {
                id[i] = ++this._state.maxParticleId;
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.RANDOM_SEED)) {
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                randomSeed[i] = randomRangeInt(0, 233280);
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.START_DIR)) {
            const { startDir } = particles;
            const initialDir = Vec3.set(tempDir, context.emitterTransform.m02, context.emitterTransform.m06, context.emitterTransform.m10);
            startDir.fill(initialDir, fromIndex, toIndex);
        }

        context.setExecuteRange(fromIndex, toIndex);
        this._spawningStage.execute(particles, params, context);
        this.resetAnimatedState(particles, fromIndex, toIndex);
        if (this._params.spawningUseInterpolation && !approx(interval, 0) && numContinuous > 0) {
            const updateStage = this._updateStage;
            for (let i = fromIndex + numContinuous - 1, num = numContinuous - 1; i >= fromIndex; i--, num--) {
                context.setExecuteRange(i, i + 1);
                const offset = clamp01((spawnFraction + num) * interval);
                const subDt = offset * emitterDeltaTime;
                context.setDeltaTime(subDt);
                updateStage.execute(particles, params, context);
            }
        }
        return spawnFraction;
    }

    private spawnParticles (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext, numToEmit: number) {
        if (numToEmit + particles.count > params.capacity) {
            numToEmit = params.capacity - particles.count;
        }

        if (numToEmit > 0) {
            particles.addParticles(numToEmit);
        }
    }
}

CCClass.Attr.setClassAttr(EventReceiver, 'target', 'type', 'Object');
CCClass.Attr.setClassAttr(EventReceiver, 'target', 'ctor', ParticleEmitter);
