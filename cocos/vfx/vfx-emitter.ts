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
import { ccclass, help, executeInEditMode, executionOrder, menu, tooltip, type, displayName, serializable, visible, rangeMin } from 'cc.decorator';
import { DEBUG, EDITOR } from 'internal:constants';
import { approx, Color, lerp, Mat4, Quat, Mat3, randomRangeInt, Vec2, Vec3 } from '../core/math';
import { INT_MAX } from '../core/math/bits';
import { DELTA_TIME, FROM_INDEX, ModuleExecContext, TO_INDEX } from './module-exec-context';
import { BoundsMode, CapacityMode, CullingMode, DelayMode, FinishAction, LoopMode, PlayingState, ScalingMode } from './define';
import { legacyCC } from '../core/global-exports';
import { assertIsTrue, CCBoolean, CCClass, CCInteger, Enum } from '../core';
import { Component } from '../scene-graph';
import { ParticleDataSet, BASE_COLOR, BASE_SCALE, BASE_SPRITE_SIZE, BASE_VELOCITY, COLOR, ID, INV_START_LIFETIME, IS_DEAD, MESH_ORIENTATION, NORMALIZED_AGE, POSITION, RANDOM_SEED, SCALE, SPRITE_SIZE, VELOCITY } from './particle-data-set';
import { VFXModuleStage, ModuleExecStage } from './vfx-module';
import { vfxManager } from './vfx-manager';
import { EventHandler } from './event-handler';
import { ParticleRenderer } from './particle-renderer';
import { AGE, CURRENT_DELAY, CURRENT_LOOP_COUNT, EmitterDataSet, IS_WORLD_SPACE, LOCAL_TO_WORLD, LOOPED_AGE, NORMALIZED_LOOP_AGE, RENDER_SCALE, VELOCITY as EMITTER_VELOCITY, WORLD_TO_LOCAL, WORLD_TO_LOCAL_RS } from './emitter-data-set';
import { UserDataSet } from './user-data-set';
import { VFXEventInfo } from './vfx-events';
import { RandomStream } from './random-stream';

const startPositionOffset = new Vec3();
const tempPosition = new Vec3();
const dir = new Vec3();
const up = new Vec3();
const rot = new Quat();
const tempEmitterTransform = new Mat4();
const eventInfo = new VFXEventInfo();

@ccclass('cc.VFXEmitterLifeCycleParams')
export class VFXEmitterLifeCycleParams {
    @serializable
    public loopMode = LoopMode.INFINITE;
    @serializable
    public loopCount = 1;
    @serializable
    public duration = 5;
    @serializable
    public prewarm = false;
    @serializable
    public prewarmTime = 5;
    @serializable
    public prewarmTimeStep = 0.03;
    @serializable
    public simulationSpeed = 1.0;
    @serializable
    public playOnAwake = true;
    @serializable
    public delayMode = DelayMode.NONE;
    @serializable
    public delayRange = new Vec2(0, 0);
}

export class VFXEmitterState {
    public accumulatedTime = 0;
    public playingState = PlayingState.STOPPED;
    public needRestart = false;
    public isSimulating = true;
    public isEmitting = true;
    public lastSimulateFrame = 0;
    public maxParticleId = 0;
    public boundsMin = new Vec3();
    public boundsMax = new Vec3();
    public randomStream = new RandomStream();
    public lastTransformChangedVersion = 0xffffffff;
    public prevWorldPosition = new Vec3();
    public worldPosition = new Vec3();
}

@ccclass('cc.VFXEmitter')
@help('i18n:cc.VFXEmitter')
@menu('Effects/VFXEmitter')
@executionOrder(99)
@executeInEditMode
export class VFXEmitter extends Component {
    public static CullingMode = CullingMode;

    /**
     * @zh 粒子系统运行时间。
     */
    @tooltip('i18n:particle_system.duration')
    @rangeMin(0.01)
    public get duration () {
        return this._lifeCycleParams.duration;
    }

    public set duration (val) {
        this._lifeCycleParams.duration = Math.max(val, 0.01);
    }

    /**
     * @zh 粒子系统是否循环播放。
     */
    @type(Enum(LoopMode))
    @tooltip('i18n:particle_system.loop')
    public get loopMode () {
        return this._lifeCycleParams.loopMode;
    }

    public set loopMode (val) {
        this._lifeCycleParams.loopMode = val;
    }

    @type(CCInteger)
    @visible(function (this: VFXEmitter) { return this.loopMode === LoopMode.MULTIPLE; })
    @rangeMin(1)
    public get loopCount () {
        return this._lifeCycleParams.loopCount;
    }

    public set loopCount (val) {
        this._lifeCycleParams.loopCount = Math.floor(Math.max(val, 1));
    }

    @visible(true)
    @type(Enum(DelayMode))
    public get delayMode () {
        return this._lifeCycleParams.delayMode;
    }

    public set delayMode (val) {
        this._lifeCycleParams.delayMode = val;
    }

    /**
     * @zh 粒子系统开始运行后，延迟粒子发射的时间。
     */
    @type(Vec2)
    @rangeMin(0)
    @visible(function (this: VFXEmitter) { return this.delayMode !== DelayMode.NONE; })
    @tooltip('i18n:particle_system.startDelay')
    public get delayRange () {
        return this._lifeCycleParams.delayRange as Readonly<Vec2>;
    }

    public set delayRange (val) {
        this._lifeCycleParams.delayRange.set(Math.max(val.x, 0), Math.max(val.y, 0));
    }

    /**
     * @zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）。
     */
    @tooltip('i18n:particle_system.prewarm')
    public get prewarm () {
        return this._lifeCycleParams.prewarm;
    }

    public set prewarm (val) {
        this._lifeCycleParams.prewarm = val;
    }

    @visible(function (this: VFXEmitter) { return this.prewarm; })
    @rangeMin(0.001)
    public get prewarmTime () {
        return this._lifeCycleParams.prewarmTime;
    }

    public set prewarmTime (val) {
        this._lifeCycleParams.prewarmTime = Math.max(val, 0.001);
    }

    @visible(function (this: VFXEmitter) { return this.prewarm; })
    @rangeMin(0.001)
    public get prewarmTimeStep () {
        return this._lifeCycleParams.prewarmTimeStep;
    }

    public set prewarmTimeStep (val) {
        this._lifeCycleParams.prewarmTimeStep = Math.max(val, 0.001);
    }

    /**
     * @zh 选择粒子系统所在的坐标系[[Space]]。<br>
     */
    @type(CCBoolean)
    @tooltip('i18n:particle_system.simulationSpace')
    public get localSpace () {
        return this._localSpace;
    }

    public set localSpace (val) {
        this._localSpace = val;
    }

    /**
     * @zh 控制整个粒子系统的更新速度。
     */
    @tooltip('i18n:particle_system.simulationSpeed')
    @rangeMin(0.001)
    public get simulationSpeed () {
        return this._lifeCycleParams.simulationSpeed;
    }

    public set simulationSpeed (val) {
        this._lifeCycleParams.simulationSpeed = Math.max(val, 0.001);
    }

    @visible(true)
    @rangeMin(0.001)
    public get maxDeltaTime () {
        return this._maxDeltaTime;
    }

    public set maxDeltaTime (val) {
        this._maxDeltaTime = Math.max(val, 0.001);
    }

    @type(Enum(ScalingMode))
    @tooltip('i18n:particle_system.scalingMode')
    public get scalingMode () {
        return this._scalingMode;
    }

    public set scalingMode (val) {
        this._scalingMode = val;
    }

    @visible(true)
    @type(Enum(CapacityMode))
    public get capacityMode () {
        return this._capacityMode;
    }

    public set capacityMode (val) {
        this._capacityMode = val;
    }

    /**
     * @zh 粒子系统能生成的最大粒子数量。
     */
    @type(CCInteger)
    @tooltip('i18n:particle_system.capacity')
    @visible(function (this: VFXEmitter) { return this.capacityMode === CapacityMode.FIXED; })
    @rangeMin(0)
    public get capacity () {
        return this._capacity;
    }

    public set capacity (val) {
        this._capacity = Math.floor(val > 0 ? val : 0);
    }

    /**
     * @zh 粒子系统加载后是否自动开始播放。
     */
    @tooltip('i18n:particle_system.playOnAwake')
    public get playOnAwake () {
        return this._lifeCycleParams.playOnAwake;
    }

    public set playOnAwake (val) {
        this._lifeCycleParams.playOnAwake = val;
    }

    @type(CCBoolean)
    @visible(true)
    public get useAutoRandomSeed () {
        return this._useAutoRandomSeed;
    }

    public set useAutoRandomSeed (val) {
        this._useAutoRandomSeed = val;
    }

    @type(CCInteger)
    @rangeMin(0)
    @visible(function (this: VFXEmitter) { return !this.useAutoRandomSeed; })
    public get randomSeed () {
        return this._randomSeed;
    }

    public set randomSeed (val) {
        this._randomSeed = val >>> 0;
    }

    @visible(true)
    @type(Enum(BoundsMode))
    public get boundsMode () {
        return this._boundsMode;
    }

    public set boundsMode (val) {
        this._boundsMode = val;
    }

    @type(Vec3)
    @visible(function (this: VFXEmitter) { return this.boundsMode === BoundsMode.FIXED; })
    public get fixedBoundsMin () {
        return this._fixedBoundsMin as Readonly<Vec3>;
    }

    public set fixedBoundsMin (val) {
        this._fixedBoundsMin.set(val);
    }

    @type(Vec3)
    @visible(function (this: VFXEmitter) { return this.boundsMode === BoundsMode.FIXED; })
    public get fixedBoundsMax () {
        return this._fixedBoundsMax as Readonly<Vec3>;
    }

    public set fixedBoundsMax (val) {
        this._fixedBoundsMax.set(val);
    }

    /**
     * @en Particle culling mode option. Includes pause, pause and catchup, always simulate.
     * @zh 粒子剔除模式选择。包括暂停模拟，暂停以后快进继续以及不间断模拟。
     */
    @type(Enum(CullingMode))
    @tooltip('i18n:particle_system.cullingMode')
    public get cullingMode () {
        return this._cullingMode;
    }

    public set cullingMode (val) {
        this._cullingMode = val;
    }

    @visible(true)
    @type(Enum(FinishAction))
    public get finishAction () {
        return this._finishAction;
    }

    public set finishAction (val) {
        this._finishAction = val;
    }

    public get particles () {
        return this._particleDataSet;
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
    @type(VFXModuleStage)
    public get emitterStage () {
        return this._emitterStage;
    }

    @displayName('粒子生成')
    @type(VFXModuleStage)
    public get spawnStage () {
        return this._spawnStage;
    }

    @displayName('粒子更新')
    @type(VFXModuleStage)
    public get updateStage () {
        return this._updateStage;
    }

    @displayName('事件处理器')
    @type([EventHandler])
    public get eventHandlers () {
        return this._eventHandlers;
    }

    @displayName('渲染')
    @type([ParticleRenderer])
    public get renderers () {
        return this._renderers;
    }

    public get eventHandlerCount () {
        return this._eventHandlerCount;
    }

    public get rendererCount () {
        return this._rendererCount;
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
    private _emitterStage = new VFXModuleStage(ModuleExecStage.EMITTER);
    @serializable
    private _spawnStage = new VFXModuleStage(ModuleExecStage.SPAWN);
    @serializable
    private _updateStage = new VFXModuleStage(ModuleExecStage.UPDATE);
    @serializable
    private _eventHandlers: EventHandler[] = [];
    @serializable
    private _eventHandlerCount = 0;
    @serializable
    private _renderers: ParticleRenderer[] = [];
    @serializable
    private _rendererCount = 0;
    @serializable
    private _lifeCycleParams = new VFXEmitterLifeCycleParams();
    @serializable
    private _boundsMode = BoundsMode.AUTO;
    @serializable
    private _fixedBoundsMin = new Vec3(-100, -100, -100);
    @serializable
    private _fixedBoundsMax = new Vec3(100, 100, 100);
    @serializable
    private _cullingMode = CullingMode.ALWAYS_SIMULATE;
    @serializable
    private _capacityMode = CapacityMode.AUTO;
    @serializable
    private _capacity = 100;
    @serializable
    private _useAutoRandomSeed = true;
    @serializable
    private _randomSeed = 0;
    @serializable
    private _finishAction = FinishAction.NONE;
    @serializable
    private _maxDeltaTime = 0.05;
    @serializable
    private _localSpace = true;
    @serializable
    private _scalingMode = ScalingMode.LOCAL;
    private _state = new VFXEmitterState();
    private _particleDataSet = new ParticleDataSet();
    private _emitterDataSet = new EmitterDataSet();
    private _userDataSet = new UserDataSet();
    private _context = new ModuleExecContext();

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
            this._state.randomStream.seed = this.useAutoRandomSeed ? randomRangeInt(0, INT_MAX) : this.randomSeed;
            this._emitterDataSet.getFloatParameter(CURRENT_DELAY).data = Math.max(lerp(this.delayRange.x, this.delayRange.y, this._state.randomStream.getFloat()), 0);
            this._emitterStage.onPlay(this._state);
            this._spawnStage.onPlay(this._state);
            this._updateStage.onPlay(this._state);
            if (this._eventHandlerCount > 0) {
                for (let i = 0, length = this._eventHandlerCount; i < length; i++) {
                    this._eventHandlers[i].onPlay(this._state);
                }
            }
            if (this.prewarm) {
                this._prewarmSystem();
            }
        }

        this._state.playingState = PlayingState.PLAYING;
        this._state.isEmitting = true;
        Vec3.copy(this._state.prevWorldPosition, this._state.worldPosition);
        Vec3.copy(this._state.worldPosition, this.node.worldPosition);
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
            this._particleDataSet.reset();
            vfxManager.removeEmitter(this);
        }
    }

    /**
     * @en remove all particles from current particle system.
     * @zh 将所有粒子从粒子系统中清除。
     */
    public clear () {
        this._particleDataSet.clear();
    }

    /**
     * @zh 获取当前粒子数量
     */
    public getParticleCount () {
        return this._particleDataSet.count;
    }

    public addEventHandler () {
        const eventHandler = new EventHandler();
        this._eventHandlers.push(eventHandler);
        this._eventHandlerCount++;
        return eventHandler;
    }

    public getEventHandlerAt (index: number) {
        assertIsTrue(index < this._eventHandlerCount && index >= 0, 'Invalid index!');
        return this._eventHandlers[index];
    }

    public removeEventHandlerAt (index: number) {
        assertIsTrue(index < this._eventHandlerCount && index >= 0, 'Invalid index!');
        this._eventHandlers.splice(index, 1);
        this._eventHandlerCount--;
    }

    public addRenderer<T extends ParticleRenderer> (Type: Constructor<T>): T {
        const renderer = new Type();
        this._renderers.push(renderer);
        this._rendererCount++;
        return renderer;
    }

    /**
     * @internal
     * @engineInternal
     */
    protected onEnable () {
        if (this.playOnAwake && (!EDITOR || legacyCC.GAME_VIEW)) {
            this.play();
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    protected onDisable () {
        this.stop(true);
    }

    private _prewarmSystem () {
        let prewarmTime = this.prewarmTime;
        const timeStep = Math.max(this.prewarmTimeStep, 0.001);
        const count = Math.ceil(prewarmTime / timeStep);

        for (let i = 0; i < count; ++i) {
            const dt = Math.min(timeStep, prewarmTime);
            prewarmTime -= dt;
            this.tick(dt);
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public simulate (dt: number) {
        this._state.lastSimulateFrame = vfxManager.totalFrames;
        let scaledDeltaTime = dt * Math.max(this.simulationSpeed, 0);
        if (scaledDeltaTime > this.maxDeltaTime) {
            scaledDeltaTime /= Math.ceil(scaledDeltaTime / this.maxDeltaTime);
        }

        if (this.isPlaying) {
            this.tick(scaledDeltaTime);

            if (this._particleDataSet.count === 0 && !this.isEmitting) {
                this.stop();
            }
        }
    }

    // internal function
    private tick (deltaTime: number) {
        const particles = this._particleDataSet;
        const context = this._context;
        const emitter = this._emitterDataSet;
        const user = this._userDataSet;
        const state = this._state;
        context.reset();
        context.getFloatParameter(DELTA_TIME).data = deltaTime;
        this.preTick(particles, emitter, user, context);

        this.updateEmitterState(particles, emitter, user, context);
        this._emitterStage.execute(particles, emitter, user, context);
        const particleCount = particles.count;
        if (particleCount > 0) {
            context.getUint32Parameter(FROM_INDEX).data = 0;
            context.getUint32Parameter(TO_INDEX).data = particleCount;
            this.resetAnimatedState(particles, 0, particleCount);
            this._updateStage.execute(particles, emitter, user, context);
        }

        if (state.isEmitting) {
            const isWorldSpace = emitter.getBoolParameter(IS_WORLD_SPACE).data;
            const initialTransform = isWorldSpace ? emitter.getMat4Parameter(LOCAL_TO_WORLD).data : Mat4.IDENTITY;
            const initialVelocity = isWorldSpace ? emitter.getVec3Parameter(EMITTER_VELOCITY).data : Vec3.ZERO;
            for (let i = 0; i < emitter.spawnInfoCount; i++) {
                const spawnInfo = emitter.spawnInfos[i];
                this.spawn(spawnInfo.count, spawnInfo.intervalDt, spawnInfo.interpStartDt, initialTransform, initialVelocity, Color.WHITE);
            }
        }

        this.processEvents(particles, emitter, user, context);
        this.removeDeadParticles(particles);
        this.updateBounds();
    }

    private updateEmitterState (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        emitter.clearSpawnInfo();
        this.updateEmitterTime(particles, emitter, user, context);
        this.updateEmitterTransform(particles, emitter, user, context);
    }

    /**
     * only for test
     * @internal
     * @engineInternal
     */
    public updateEmitterTime (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const params = this._lifeCycleParams;
        const deltaTime = context.getFloatParameter(DELTA_TIME).data;
        if (DEBUG) {
            assertIsTrue(deltaTime < params.duration,
                'The delta time should not exceed the duration of the particle system. please adjust the duration of the particle system.');
            assertIsTrue(deltaTime >= 0);
        }

        const delayMode = params.delayMode;
        const delay = emitter.getFloatParameter(CURRENT_DELAY).data;
        const loopMode = params.loopMode;
        const loopCount = params.loopCount;
        const duration = params.duration;

        const age = emitter.getFloatParameter(AGE);
        let prevTime = age.data;
        age.data += deltaTime;
        let currentTime = age.data;
        prevTime = delayMode === DelayMode.FIRST_LOOP_ONLY ? Math.max(prevTime - delay, 0) : prevTime;
        currentTime = delayMode === DelayMode.FIRST_LOOP_ONLY ? Math.max(currentTime - delay, 0) : currentTime;
        const expectedLoopCount = loopMode === LoopMode.INFINITE ? Number.MAX_SAFE_INTEGER
            : (loopMode === LoopMode.MULTIPLE ? loopCount : 1);
        const invDuration = 1 / duration;
        const durationAndDelay = delayMode === DelayMode.EVERY_LOOP ? (duration + delay) : duration;
        const invDurationAndDelay = delayMode === DelayMode.EVERY_LOOP ? (1 / durationAndDelay) : invDuration;
        const count = Math.floor(currentTime * invDurationAndDelay);
        if (count < expectedLoopCount) {
            prevTime %= durationAndDelay;
            currentTime %= durationAndDelay;
            emitter.getUint32Parameter(CURRENT_LOOP_COUNT).data = count;
        } else {
            if (Math.floor(prevTime * invDurationAndDelay) >= expectedLoopCount) {
                prevTime = durationAndDelay;
            } else {
                prevTime %= durationAndDelay;
            }
            currentTime = durationAndDelay;
            emitter.getUint32Parameter(CURRENT_LOOP_COUNT).data = expectedLoopCount;
        }
        if (delayMode === DelayMode.EVERY_LOOP) {
            prevTime = Math.max(prevTime - delay, 0);
            currentTime = Math.max(currentTime - delay, 0);
        }

        emitter.getFloatParameter(LOOPED_AGE).data = currentTime;
        emitter.getFloatParameter(NORMALIZED_LOOP_AGE).data = currentTime * invDuration;
    }

    private updateEmitterTransform (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        emitter.getBoolParameter(IS_WORLD_SPACE).data = !this._localSpace;
        const transform = this.node;
        Vec3.copy(this._state.prevWorldPosition, this._state.worldPosition);
        Vec3.copy(this._state.worldPosition, transform.worldPosition);
        if (transform.flagChangedVersion !== this._state.lastTransformChangedVersion) {
            switch (this._scalingMode) {
            case ScalingMode.LOCAL:
                emitter.getVec3Parameter(RENDER_SCALE).data = transform.scale;
                break;
            case ScalingMode.HIERARCHY:
                emitter.getVec3Parameter(RENDER_SCALE).data = transform.worldScale;
                break;
            default:
                emitter.getVec3Parameter(RENDER_SCALE).data = Vec3.ONE;
                break;
            }
            emitter.getMat4Parameter(LOCAL_TO_WORLD).data = transform.worldMatrix;
            emitter.getMat4Parameter(WORLD_TO_LOCAL).data = Mat4.invert(new Mat4(), transform.worldMatrix);
            emitter.getMat3Parameter(WORLD_TO_LOCAL_RS).data = Mat3.fromMat4(new Mat3(),  emitter.getMat4Parameter(WORLD_TO_LOCAL).data);
            this._state.lastTransformChangedVersion = transform.flagChangedVersion;
        }
        const distance = Vec3.subtract(new Vec3(), this._state.worldPosition, this._state.prevWorldPosition);
        Vec3.multiplyScalar(distance, distance, 1 / context.getFloatParameter(DELTA_TIME).data);
        emitter.getVec3Parameter(EMITTER_VELOCITY).data = distance;
    }

    /**
     * @internal
     * @engineInternal
     */
    public render () {
        for (let i = 0, length = this._renderers.length; i < length; i++) {
            this._renderers[i].render(this._particleDataSet, this._emitterDataSet);
        }
    }

    private preTick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this._emitterStage.tick(particles, emitter, user, context);
        this._spawnStage.tick(particles, emitter, user, context);
        this._updateStage.tick(particles, emitter, user, context);
        if (this._eventHandlerCount > 0) {
            for (let i = 0, length = this._eventHandlerCount; i < length; i++) {
                this._eventHandlers[i].tick(particles, emitter, user, context);
            }
            particles.markRequiredParameter(POSITION);
        }
        if (emitter.getBoolParameter(IS_WORLD_SPACE).data) {
            particles.markRequiredParameter(POSITION);
        }
    }

    private updateBounds () {
        if (this.boundsMode === BoundsMode.FIXED) {
            Vec3.copy(this._state.boundsMin, this._fixedBoundsMin);
            Vec3.copy(this._state.boundsMax, this._fixedBoundsMax);
        }
    }

    private removeDeadParticles (particles: ParticleDataSet) {
        if (particles.hasParameter(IS_DEAD)) {
            const isDead = particles.getBoolParameter(IS_DEAD).data;
            for (let i = particles.count - 1; i >= 0; i--) {
                if (isDead[i]) {
                    particles.removeParticle(i);
                }
            }
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public processEvents (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const isWorldSpace = emitter.getBoolParameter(IS_WORLD_SPACE).data;
        const worldToLocal = emitter.getMat4Parameter(WORLD_TO_LOCAL).data;
        for (let i = 0, length = this._eventHandlerCount; i < length; i++) {
            const eventHandler = this._eventHandlers[i];
            const target = eventHandler.target;
            if (target && target.isValid) {
                const events = target._context.events;
                for (let i = 0, length = events.count; i < length; i++) {
                    events.getEventInfoAt(eventInfo, i);
                    if (eventInfo.type !== eventHandler.eventType) { continue; }
                    Vec3.normalize(dir, eventInfo.velocity);
                    const angle = Math.abs(Vec3.dot(dir, Vec3.UNIT_Z));
                    Vec3.lerp(up, Vec3.UNIT_Z, Vec3.UNIT_Y, angle);
                    Quat.fromViewUp(rot, dir, up);
                    Mat4.fromRT(tempEmitterTransform, rot, eventInfo.position);
                    const initialVelocity = new Vec3();
                    Vec3.copy(initialVelocity, eventInfo.velocity);
                    if (!isWorldSpace) {
                        Mat4.multiply(tempEmitterTransform, worldToLocal, tempEmitterTransform);
                        Vec3.transformMat4(initialVelocity, initialVelocity, worldToLocal);
                    }
                    this.spawn(eventHandler.spawnCount, 0, 0, tempEmitterTransform, initialVelocity, eventInfo.color);
                    eventHandler.execute(particles, emitter, user, context);
                }
            }
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public resetAnimatedState (particles: ParticleDataSet, fromIndex: number, toIndex: number) {
        if (particles.hasParameter(VELOCITY)) {
            if (particles.hasParameter(BASE_VELOCITY)) {
                particles.getVec3Parameter(VELOCITY).copyFrom(particles.getVec3Parameter(BASE_VELOCITY), fromIndex, toIndex);
            } else {
                particles.getVec3Parameter(VELOCITY).fill(Vec3.ZERO, fromIndex, toIndex);
            }
        }
        if (particles.hasParameter(SCALE)) {
            if (particles.hasParameter(BASE_SCALE)) {
                particles.getVec3Parameter(SCALE).copyFrom(particles.getVec3Parameter(BASE_SCALE), fromIndex, toIndex);
            } else {
                particles.getVec3Parameter(SCALE).fill(Vec3.ONE, fromIndex, toIndex);
            }
        }
        if (particles.hasParameter(SPRITE_SIZE)) {
            if (particles.hasParameter(BASE_SPRITE_SIZE)) {
                particles.getVec2Parameter(SPRITE_SIZE).copyFrom(particles.getVec2Parameter(BASE_SPRITE_SIZE), fromIndex, toIndex);
            } else {
                particles.getVec2Parameter(SPRITE_SIZE).fill(Vec2.ONE, fromIndex, toIndex);
            }
        }
        if (particles.hasParameter(COLOR)) {
            if (particles.hasParameter(BASE_COLOR)) {
                particles.getColorParameter(COLOR).copyFrom(particles.getColorParameter(BASE_COLOR), fromIndex, toIndex);
            } else {
                particles.getColorParameter(COLOR).fill(Color.WHITE, fromIndex, toIndex);
            }
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public spawn (spawnCount: number, intervalDt: number, interpStartDt: number, initialTransform: Mat4, initialVelocity: Vec3, initialColor: Color) {
        if (spawnCount === 0) {
            return;
        }
        const { _particleDataSet: particles, _context: context, _emitterDataSet: emitter, _userDataSet: user } = this;
        const fromIndex = particles.count;
        this.addNewParticles(particles, context, spawnCount);
        const numSpawned = particles.count - fromIndex;
        const toIndex = particles.count;
        const hasPosition = particles.hasParameter(POSITION);
        if (hasPosition) {
            const initialPosition = initialTransform.getTranslation(tempPosition);
            particles.getVec3Parameter(POSITION).fill(initialPosition, fromIndex, toIndex);
        }

        if (particles.hasParameter(BASE_VELOCITY)) {
            particles.getVec3Parameter(BASE_VELOCITY).fill(Vec3.ZERO, fromIndex, toIndex);
        }
        if (particles.hasParameter(MESH_ORIENTATION)) {
            particles.getVec3Parameter(MESH_ORIENTATION).fill(Vec3.ZERO, fromIndex, toIndex);
        }
        if (particles.hasParameter(BASE_SCALE)) {
            particles.getVec3Parameter(BASE_SCALE).fill(Vec3.ONE, fromIndex, toIndex);
        }
        if (particles.hasParameter(BASE_COLOR)) {
            particles.getColorParameter(BASE_COLOR).fill(initialColor, fromIndex, toIndex);
        }
        if (particles.hasParameter(INV_START_LIFETIME)) {
            particles.getFloatParameter(INV_START_LIFETIME).fill(1, fromIndex, toIndex);
        }
        if (particles.hasParameter(NORMALIZED_AGE)) {
            particles.getFloatParameter(NORMALIZED_AGE).fill(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(ID)) {
            const id = particles.getUint32Parameter(ID).data;
            for (let i = fromIndex; i < toIndex; i++) {
                id[i] = ++this._state.maxParticleId;
            }
        }
        if (particles.hasParameter(RANDOM_SEED)) {
            const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
            const randomStream = this._state.randomStream;
            for (let i = fromIndex; i < toIndex; i++) {
                randomSeed[i] = randomStream.getUInt32();
            }
        }

        const fi = context.getUint32Parameter(FROM_INDEX);
        const ti = context.getUint32Parameter(TO_INDEX);
        fi.data = fromIndex;
        ti.data = toIndex;
        this._spawnStage.execute(particles, emitter, user, context);
        this.resetAnimatedState(particles, fromIndex, toIndex);
        const interval = intervalDt;
        const deltaTime = context.getFloatParameter(DELTA_TIME);
        const dt = deltaTime.data;
        if (!approx(interval, 0) || interpStartDt > 0) {
            const needPositionOffset = hasPosition && !initialVelocity.equals(Vec3.ZERO);
            const position = needPositionOffset ? particles.getVec3Parameter(POSITION) : null;
            const updateStage = this._updateStage;

            // |------ Delay ------|-----------Duration-----------------------|
            //                     |-----------PrevTime----------|
            //                     |------------currentTime-------------------|
            //                                                   |----------dt--------------|
            //                                                   |---emitdt---|
            //                                                                |-frameOffset-|
            for (let i = fromIndex + numSpawned - 1, num = numSpawned - 1; i >= fromIndex; i--, num--) {
                const subDt = interpStartDt + num * interval * dt;
                if (DEBUG) {
                    assertIsTrue(subDt >= 0 && subDt <= dt);
                }
                if (needPositionOffset) {
                    Vec3.multiplyScalar(startPositionOffset, initialVelocity, -subDt);
                    position!.addVec3At(startPositionOffset, i);
                }
                fi.data = i;
                ti.data = i + 1;
                deltaTime.data = subDt;
                updateStage.execute(particles, emitter, user, context);
            }
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public addNewParticles (particles: ParticleDataSet, context: ModuleExecContext, numToEmit: number) {
        const capacity = this._capacityMode === CapacityMode.AUTO ? Number.MAX_SAFE_INTEGER : this._capacity;
        if (numToEmit + particles.count > capacity) {
            numToEmit = capacity - particles.count;
        }

        if (numToEmit > 0) {
            particles.addParticles(numToEmit);
        }
    }
}

CCClass.Attr.setClassAttr(EventHandler, 'target', 'type', 'Object');
CCClass.Attr.setClassAttr(EventHandler, 'target', 'ctor', VFXEmitter);
