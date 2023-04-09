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
import { ccclass, help, executeInEditMode, executionOrder, menu, tooltip, displayOrder, type, range, displayName, formerlySerializedAs, override, radian, serializable, visible, requireComponent, rangeMin } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { approx, clamp01, Color, EPSILON, lerp, Mat3, Mat4, Quat, randomRangeInt, Size, Vec2, Vec3, Vec4 } from '../core/math';
import { countTrailingZeros, INT_MAX } from '../core/math/bits';
import { CurveRange, Mode } from './curve-range';
import { AddSpeedInInitialDirectionModule } from './modules/add-speed-in-initial-direction';
import { SpawnRateModule } from './modules/spawn-rate';
import { StateModule } from './modules/state';
import { SolveModule } from './modules/solve';
import { BoundsMode, CapacityMode, DelayMode, InheritedProperty, LoopMode, ParticleEmitterParams, ParticleEmitterState, ParticleEventInfo, ParticleEventType, ParticleExecContext, PlayingState } from './particle-base';
import { CullingMode, FinishAction, Space } from './enum';
import { legacyCC } from '../core/global-exports';
import { assert, BitMask, CCBoolean, CCClass, CCFloat, CCInteger, Component, Enum, geometry, js } from '../core';
import { ParticleDataSet, BuiltinParticleParameter } from './particle-data-set';
import { ParticleModuleStage, ModuleExecStage } from './particle-module';
import { vfxManager } from './vfx-manager';
import { SpawnFractionCollection } from './spawn-fraction-collection';
import { SpriteRendererModule } from './modules';
import { ParticleParameterIdentity, ParticleParameterType } from './particle-parameter';
import { RandomStream } from './random-stream';
import { EventReceiver } from './event-receiver';

const startPositionOffset = new Vec3();
const tempPosition = new Vec3();
const tempDir = new Vec3();
const dir = new Vec3();
const up = new Vec3();
const rot = new Quat();
const tempEmitterTransform = new Mat4();
const eventInfo = new ParticleEventInfo();

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
    @rangeMin(0.01)
    public get duration () {
        return this._params.duration;
    }

    public set duration (val) {
        this._params.duration = Math.max(val, 0.01);
    }

    /**
     * @zh 粒子系统是否循环播放。
     */
    @type(Enum(LoopMode))
    @tooltip('i18n:particle_system.loop')
    public get loopMode () {
        return this._params.loopMode;
    }

    public set loopMode (val) {
        this._params.loopMode = val;
    }

    @type(CCInteger)
    @visible(function (this: ParticleEmitter) { return this.loopMode === LoopMode.MULTIPLE; })
    @rangeMin(1)
    public get loopCount () {
        return this._params.loopCount;
    }

    public set loopCount (val) {
        this._params.loopCount = Math.max(val, 1);
    }

    @visible(true)
    @type(Enum(DelayMode))
    public get delayMode () {
        return this._params.delayMode;
    }

    public set delayMode (val) {
        this._params.delayMode = val;
    }

    /**
     * @zh 粒子系统开始运行后，延迟粒子发射的时间。
     */
    @type(Vec2)
    @rangeMin(0)
    @visible(function (this: ParticleEmitter) { return this.delayMode !== DelayMode.NONE; })
    @tooltip('i18n:particle_system.startDelay')
    public get delayRange () {
        return this._params.delayRange as Readonly<Vec2>;
    }

    public set delayRange (val) {
        this._params.delayRange.set(Math.max(val.x, 0), Math.max(val.y, 0));
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

    @visible(function (this: ParticleEmitter) { return this.prewarm; })
    @rangeMin(0.001)
    public get prewarmTime () {
        return this._params.prewarmTime;
    }

    public set prewarmTime (val) {
        this._params.prewarmTime = Math.max(val, 0.001);
    }

    @visible(function (this: ParticleEmitter) { return this.prewarm; })
    @rangeMin(0.001)
    public get prewarmTimeStep () {
        return this._params.prewarmTimeStep;
    }

    public set prewarmTimeStep (val) {
        this._params.prewarmTimeStep = Math.max(val, 0.001);
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
    @rangeMin(0.001)
    public get simulationSpeed () {
        return this._params.simulationSpeed;
    }

    public set simulationSpeed (val) {
        this._params.simulationSpeed = Math.max(val, 0.001);
    }

    @visible(true)
    @rangeMin(0.001)
    public get maxDeltaTime () {
        return this._params.maxDeltaTime;
    }

    public set maxDeltaTime (val) {
        this._params.maxDeltaTime = Math.max(val, 0.001);
    }

    @type(Enum(Space))
    @tooltip('i18n:particle_system.scaleSpace')
    public get scaleSpace () {
        return this._params.scaleSpace;
    }

    public set scaleSpace (val) {
        this._params.scaleSpace = val;
    }

    @visible(true)
    @type(Enum(CapacityMode))
    public get capacityMode () {
        return this._params.capacityMode;
    }

    public set capacityMode (val) {
        this._params.capacityMode = val;
    }

    /**
     * @zh 粒子系统能生成的最大粒子数量。
     */
    @type(CCInteger)
    @tooltip('i18n:particle_system.capacity')
    @visible(function (this: ParticleEmitter) { return this.capacityMode === CapacityMode.FIXED; })
    @rangeMin(0)
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

    @type(CCBoolean)
    @visible(true)
    public get useAutoRandomSeed () {
        return this._params.useAutoRandomSeed;
    }

    public set useAutoRandomSeed (val) {
        this._params.useAutoRandomSeed = val;
    }

    @type(CCInteger)
    @rangeMin(0)
    @visible(function (this: ParticleEmitter) { return !this.useAutoRandomSeed; })
    public get randomSeed () {
        return this._params.randomSeed;
    }

    public set randomSeed (val) {
        this._params.randomSeed = val;
    }

    @visible(true)
    @type(Enum(BoundsMode))
    public get boundsMode () {
        return this._params.boundsMode;
    }

    public set boundsMode (val) {
        this._params.boundsMode = val;
    }

    @type(Vec3)
    @visible(function (this: ParticleEmitter) { return this.boundsMode === BoundsMode.FIXED; })
    public get fixedBoundsMin () {
        return this._params.fixedBoundsMin as Readonly<Vec3>;
    }

    public set fixedBoundsMin (val) {
        this._params.fixedBoundsMin.set(val);
    }

    @type(Vec3)
    @visible(function (this: ParticleEmitter) { return this.boundsMode === BoundsMode.FIXED; })
    public get fixedBoundsMax () {
        return this._params.fixedBoundsMax as Readonly<Vec3>;
    }

    public set fixedBoundsMax (val) {
        this._params.fixedBoundsMax.set(val);
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

    @visible(true)
    @type(Enum(FinishAction))
    public get finishAction () {
        return this._params.finishAction;
    }

    public set finishAction (val) {
        this._params.finishAction = val;
    }

    @type(CCBoolean)
    @visible(true)
    public get spawningUseInterpolation () {
        return this._params.spawningUseInterpolation;
    }

    public set spawningUseInterpolation (val) {
        this._params.spawningUseInterpolation = val;
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

    public get boundsMin () {
        return this._state.boundsMin as Readonly<Vec3>;
    }

    public get boundsMax () {
        return this._state.boundsMax as Readonly<Vec3>;
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
    private _context = new ParticleExecContext();
    private _state = new ParticleEmitterState();
    private _customParameterId: number = BuiltinParticleParameter.COUNT;
    private _customParameters: ParticleParameterIdentity[] = [];

    /**
     * @en play particle system
     * @zh 播放粒子效果。
     */
    public play () {
        if (!this.enabledInHierarchy) {
            throw new Error('Particle Emitter is not active, Please make sure the node is active in the scene.');
        }
        if (this._state.playingState === PlayingState.PLAYING) {
            return;
        }
        if (this._state.playingState === PlayingState.STOPPED) {
            this._state.rand.seed = this.useAutoRandomSeed ? randomRangeInt(0, INT_MAX) : this.randomSeed;
            this._state.currentDelay = Math.max(lerp(this.delayRange.x, this.delayRange.y, this._state.rand.getFloat()), 0);
            this._emitterStage.onPlay(this._params, this._state);
            this._spawningStage.onPlay(this._params, this._state);
            this._updateStage.onPlay(this._params, this._state);
            for (const receiver of this._eventReceivers) {
                receiver.onPlay(this._params, this._state);
            }
            this._renderStage.onPlay(this._params, this._state);
            if (this.prewarm) {
                this._prewarmSystem();
            }
        }

        this._state.playingState = PlayingState.PLAYING;
        this._state.isEmitting = true;
        this._state.updateTransform(this.node.worldPosition);
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
     * @en stop particle system
     * @zh 停止播放粒子。
     */
    public stop (clear = false) {
        this._state.isEmitting = false;
        if (clear) {
            this._state.playingState = PlayingState.STOPPED;
            this._particles.reset();
            vfxManager.removeEmitter(this);
        }
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

    protected onLoad () {
        // this._emitterStage.getOrAddModule(BurstModule);
        // this._emitterStage.getOrAddModule(SpawnPerUnitModule);
        this._emitterStage.getOrAddModule(SpawnRateModule);
        // this._spawningStage.getOrAddModule(ShapeModule);
        // this._spawningStage.getOrAddModule(SetColorModule);
        // this._spawningStage.getOrAddModule(SetLifeTimeModule);
        // this._spawningStage.getOrAddModule(SetRotationModule);
        // this._spawningStage.getOrAddModule(SetSizeModule);
        this._spawningStage.getOrAddModule(AddSpeedInInitialDirectionModule);
        // this._updateStage.getOrAddModule(MultiplyColorModule);
        // this._updateStage.getOrAddModule(ForceModule);
        // this._updateStage.getOrAddModule(GravityModule);
        // this._updateStage.getOrAddModule(LimitVelocityModule);
        // this._updateStage.getOrAddModule(NoiseModule);
        // this._updateStage.getOrAddModule(RotationModule);
        // this._updateStage.getOrAddModule(MultiplySizeModule);
        this._updateStage.getOrAddModule(StateModule);
        this._updateStage.getOrAddModule(SolveModule);
        // this._updateStage.getOrAddModule(ScaleSpeedModule);
        // this._updateStage.getOrAddModule(SubUVAnimationModule);
        // this._updateStage.getOrAddModule(AddVelocityModule);
        // this._updateStage.getOrAddModule(DeathEventGeneratorModule);
        // this._updateStage.getOrAddModule(LocationEventGeneratorModule);
        this._renderStage.getOrAddModule(SpriteRendererModule);
        // if (this.eventReceivers.length === 0) {
        //     this.addEventReceiver();
        // }
        // this.getEventReceiverAt(0).stage.getOrAddModule(SpawnOverTimeModule);
        // this.getEventReceiverAt(0).stage.getOrAddModule(SpawnPerUnitModule);
        // this.getEventReceiverAt(0).stage.getOrAddModule(BurstModule);
    }

    protected onEnable () {
        if (this.playOnAwake && (!EDITOR || legacyCC.GAME_VIEW)) {
            this.play();
        }
    }

    protected onDisable () {
        this.stop();
    }

    private _prewarmSystem () {
        const dt = Math.max(this.prewarmTimeStep, 0.01);
        const count = this.prewarmTime / dt;

        for (let i = 0; i < count; ++i) {
            this.tick(dt);
        }
    }

    public simulate (dt: number) {
        this._state.lastSimulateFrame = vfxManager.totalFrames;
        let scaledDeltaTime = dt * Math.max(this.simulationSpeed, 0);
        if (scaledDeltaTime > this.maxDeltaTime) {
            scaledDeltaTime /= Math.ceil(scaledDeltaTime / this.maxDeltaTime);
        }

        if (this.isPlaying) {
            this.tick(scaledDeltaTime);

            if (this._particles.count === 0 && !this.isEmitting) {
                this.stop();
            }
        }
    }

    // internal function
    private tick (deltaTime: number) {
        const particles = this._particles;
        const context = this._context;
        const params = this._params;
        const state = this._state;
        context.reset();
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
            state.spawnFraction = this.emit(state.spawnFraction, params.simulationSpace === Space.WORLD
                ? context.localToWorld : Mat4.IDENTITY, Color.WHITE, Vec3.ONE, Vec3.ZERO);
        }

        this.processEvents(particles, params, context);
        this.removeDeadParticles(particles, params, context);
    }

    public render () {
        this.updateBounds();
        this._context.setExecuteRange(0, this.particles.count);
        this._renderStage.execute(this._particles, this._params, this._context);
    }

    private preTick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        this._state.tick(this.node, params, context);
        this._emitterStage.tick(particles, params, context);
        this._spawningStage.tick(particles, params, context);
        this._updateStage.tick(particles, params, context);
        this._renderStage.tick(particles, params, context);
        if (this._eventReceivers.length > 0) {
            for (let i = 0, length = this._eventReceivers.length; i < length; i++) {
                this._eventReceivers[i].tick(particles, params, context);
            }
            context.markRequiredParameter(BuiltinParticleParameter.POSITION);
        }
        particles.ensureParameters(context.builtinParameterRequirements, context.customParameterRequirements, this._customParameters);
    }

    private updateBounds () {
        if (this.boundsMode === BoundsMode.FIXED) {
            Vec3.copy(this._state.boundsMin, this._params.fixedBoundsMin);
            Vec3.copy(this._state.boundsMax, this._params.fixedBoundsMax);
        }
    }

    private removeDeadParticles (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (particles.hasParameter(BuiltinParticleParameter.IS_DEAD)) {
            const isDead = particles.isDead.data;
            for (let i = particles.count - 1; i >= 0; i--) {
                if (isDead[i]) {
                    particles.removeParticle(i);
                }
            }
        }
    }

    private processEvents (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        for (let i = 0, length = this._eventReceivers.length; i < length; i++) {
            const eventReceiver = this._eventReceivers[i];
            const emitter = eventReceiver.target;
            if (emitter && emitter.isValid) {
                const spawnFractionCollection = eventReceiver.spawnFractionCollection;
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
                    Mat4.fromRT(tempEmitterTransform, rot, eventInfo.position);
                    Vec3.copy(context.emitterVelocity, eventInfo.velocity);
                    Vec3.copy(context.emitterVelocityInEmittingSpace, eventInfo.velocity);
                    if (params.simulationSpace === Space.LOCAL) {
                        Mat4.multiply(tempEmitterTransform, context.worldToLocal, tempEmitterTransform);
                        Vec3.transformMat4(context.emitterVelocityInEmittingSpace, context.emitterVelocityInEmittingSpace, context.worldToLocal);
                    }
                    context.setExecuteRange(0, 0);
                    context.resetSpawningState();
                    const loopDelay = Math.max(lerp(params.delayRange.x, params.delayRange.y, RandomStream.getFloat(eventInfo.randomSeed)), 0);
                    context.updateEmitterTime(eventInfo.currentTime, eventInfo.prevTime,
                        params.delayMode, loopDelay, params.loopMode, params.loopCount, params.duration);
                    let spawnFraction = 0;
                    if (eventReceiver.eventType === ParticleEventType.LOCATION) {
                        spawnFraction = spawnFractionCollection.fraction[i];
                    }
                    eventReceiver.execute(particles, params, context);
                    spawnFraction = this.emit(spawnFraction, tempEmitterTransform, eventInfo.color, eventInfo.size, eventInfo.rotation);
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

    private emit (spawnFraction: number, initialTransform: Mat4, initialColor: Color,
        initialSize: Vec3, initialRotation: Vec3): number {
        const { _particles: particles, _params: params, _context: context } = this;
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
        const { emitterDeltaTime, emitterVelocityInEmittingSpace: initialVelocity } = context;
        if (particles.hasParameter(BuiltinParticleParameter.POSITION)) {
            const initialPosition = initialTransform.getTranslation(tempPosition);
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
        if (particles.hasParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO)) {
            if (!approx(interval, 0) && numContinuous > 0) {
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex, num = 0, length = fromIndex + numContinuous; i < length; i++, num++) {
                    const offset = clamp01((spawnFraction + num) * interval);
                    spawnTime[i] = offset;
                }
                particles.spawnTimeRatio.fill(0, fromIndex + numContinuous, toIndex);
            } else {
                particles.spawnTimeRatio.fill(0, fromIndex, toIndex);
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.BASE_VELOCITY)) {
            particles.baseVelocity.fill1f(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.ROTATION)) {
            particles.rotation.fill(initialRotation, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.AXIS_OF_ROTATION)) {
            particles.axisOfRotation.fill1f(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.BASE_SIZE)) {
            particles.baseSize.fill(initialSize, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.BASE_COLOR)) {
            particles.baseColor.fill(initialColor, fromIndex, toIndex);
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
            const rand = this._state.rand;
            for (let i = fromIndex; i < toIndex; i++) {
                randomSeed[i] = rand.getUInt32();
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.START_DIR)) {
            const { startDir } = particles;
            const initialDir = Vec3.set(tempDir, initialTransform.m02, initialTransform.m06, initialTransform.m10);
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
