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
import { BoundsMode, CapacityMode, CullingMode, C_DELTA_TIME, C_EVENTS, C_EVENT_COUNT, C_FROM_INDEX, C_TO_INDEX, DelayMode, E_AGE, E_CURRENT_DELAY, E_CURRENT_LOOP_COUNT, E_IS_WORLD_SPACE, E_LOCAL_ROTATION, E_LOCAL_TO_WORLD, E_LOCAL_TO_WORLD_RS, E_LOOPED_AGE, E_NORMALIZED_LOOP_AGE, E_POSITION, E_RENDER_SCALE, E_SIMULATION_POSITION, E_SPAWN_INFOS, E_SPAWN_INFO_COUNT, E_SPAWN_REMAINDER, E_SPAWN_REMAINDER_PER_UNIT, E_VELOCITY, E_WORLD_ROTATION, E_WORLD_TO_LOCAL, E_WORLD_TO_LOCAL_RS, FinishAction, LoopMode, PlayingState, P_BASE_COLOR, P_BASE_SCALE, P_BASE_SPRITE_SIZE, P_BASE_VELOCITY, P_COLOR, P_ID, P_INV_LIFETIME, P_IS_DEAD, P_MESH_ORIENTATION, P_NORMALIZED_AGE, P_POSITION, P_RANDOM_SEED, P_SCALE, P_SPRITE_SIZE, P_VELOCITY, ScalingMode, VFXBuiltinNamespace } from './define';
import { legacyCC } from '../core/global-exports';
import { assertIsTrue, CCBoolean, CCClass, CCInteger, Enum } from '../core';
import { Component } from '../scene-graph';
import { VFXStage, VFXExecutionStage } from './vfx-module';
import { vfxManager } from './vfx-manager';
import { EventHandler } from './event-handler';
import { ParticleRenderer } from './particle-renderer';
import { RandomStream } from './random-stream';
import { SpawnInfo, VFXEventInfo } from './data';
import { VFXArray, Handle } from './vfx-parameter';
import { VFXParameterMap } from './vfx-parameter-map';

const startPositionOffset = new Vec3();
const tempPosition = new Vec3();
const dir = new Vec3();
const up = new Vec3();
const rot = new Quat();
const tempEmitterTransform = new Mat4();
const eventInfo = new VFXEventInfo();
const spawnInfo = new SpawnInfo();

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
    public get maxCapacity () {
        return this._maxCapacity;
    }

    public set maxCapacity (val) {
        this._maxCapacity = Math.floor(val > 0 ? val : 0);
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
    public get determinism () {
        return this._determinism;
    }

    public set determinism (val) {
        this._determinism = val;
    }

    @type(CCInteger)
    @rangeMin(0)
    @visible(function (this: VFXEmitter) { return this._determinism; })
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
    @type(VFXStage)
    public get emitterStage () {
        return this._emitterStage;
    }

    @displayName('粒子生成')
    @type(VFXStage)
    public get spawnStage () {
        return this._spawnStage;
    }

    @displayName('粒子更新')
    @type(VFXStage)
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

    /**
     * @zh 获取当前粒子数量
     */
    public get particleCount () {
        return this._particleCount;
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
    private _emitterStage = new VFXStage(VFXExecutionStage.EMITTER);
    @serializable
    private _spawnStage = new VFXStage(VFXExecutionStage.SPAWN);
    @serializable
    private _updateStage = new VFXStage(VFXExecutionStage.UPDATE);
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
    private _maxCapacity = 100;
    @serializable
    private _determinism = false;
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
    private _parameterMap = new VFXParameterMap();
    private _particleCapacity = 16;
    private _particleCount = 0;
    private _needToRecompile = true;

    public requireRecompile () {
        this._needToRecompile = true;
    }

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
            this._state.randomStream.seed = this.determinism ? this.randomSeed : randomRangeInt(0, INT_MAX);
            this._parameterMap.getFloatValue(E_CURRENT_DELAY).data = Math.max(lerp(this.delayRange.x, this.delayRange.y, this._state.randomStream.getFloat()), 0);
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
            this._parameterMap.reset();
            vfxManager.removeEmitter(this);
        }
    }

    /**
     * @en remove all particles from current particle system.
     * @zh 将所有粒子从粒子系统中清除。
     */
    public clear () {
        this._particleCount = 0;
    }

    public addEventHandler () {
        const eventHandler = new EventHandler();
        this._eventHandlers.push(eventHandler);
        this._eventHandlerCount++;
        this.requireRecompile();
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
        this.requireRecompile();
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

            if (this._particleCount === 0 && !this.isEmitting) {
                this.stop();
            }
        }
    }

    // internal function
    private tick (deltaTime: number) {
        const parameterMap = this._parameterMap;
        const state = this._state;
        const particleCount = this._particleCount;
        this.compile(parameterMap);
        parameterMap.getUint32Value(C_EVENT_COUNT).data = 0;
        parameterMap.getFloatValue(C_DELTA_TIME).data = deltaTime;
        parameterMap.getUint32Value(C_FROM_INDEX).data = 0;
        parameterMap.getUint32Value(C_TO_INDEX).data = particleCount;

        this.updateEmitterState(parameterMap);
        this._emitterStage.execute(parameterMap);
        if (particleCount > 0) {
            this.resetAnimatedState(parameterMap, 0, particleCount);
            this._updateStage.execute(parameterMap);
        }

        if (state.isEmitting) {
            const isWorldSpace = parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
            const initialTransform = isWorldSpace ? parameterMap.getMat4Value(E_LOCAL_TO_WORLD).data : Mat4.IDENTITY;
            const initialVelocity = isWorldSpace ? parameterMap.getVec3Value(E_VELOCITY).data : Vec3.ZERO;
            const spawnInfoCount = parameterMap.getUint32Value(E_SPAWN_INFO_COUNT).data;
            const spawnInfos = parameterMap.getSpawnInfoArrayValue(E_SPAWN_INFOS);
            for (let i = 0; i < spawnInfoCount; i++) {
                spawnInfos.getSpawnInfoAt(spawnInfo, i);
                this.spawn(spawnInfo.count, spawnInfo.intervalDt, spawnInfo.interpStartDt, initialTransform, initialVelocity, Color.WHITE);
            }
        }

        this.processEvents(parameterMap);
        this.removeDeadParticles(parameterMap);
        this.updateBounds();
    }

    private updateEmitterState (parameterMap: VFXParameterMap) {
        parameterMap.getUint32Value(E_SPAWN_INFO_COUNT).data = 0;
        this.updateEmitterTime(parameterMap);
        this.updateEmitterTransform(parameterMap);
    }

    private compile (parameterMap: VFXParameterMap) {
        if (this._needToRecompile) {
            parameterMap.ensure(P_POSITION);
            parameterMap.ensure(C_DELTA_TIME);
            parameterMap.ensure(C_FROM_INDEX);
            parameterMap.ensure(C_TO_INDEX);
            parameterMap.ensure(C_EVENT_COUNT);
            parameterMap.ensure(E_IS_WORLD_SPACE);
            parameterMap.ensure(E_CURRENT_DELAY);
            parameterMap.ensure(E_AGE);
            parameterMap.ensure(E_LOOPED_AGE);
            parameterMap.ensure(E_NORMALIZED_LOOP_AGE);
            parameterMap.ensure(E_CURRENT_LOOP_COUNT);
            parameterMap.ensure(E_SPAWN_REMAINDER);
            parameterMap.ensure(E_SPAWN_REMAINDER_PER_UNIT);
            parameterMap.ensure(E_VELOCITY);
            parameterMap.ensure(E_LOCAL_TO_WORLD);
            parameterMap.ensure(E_WORLD_TO_LOCAL);
            parameterMap.ensure(E_LOCAL_TO_WORLD_RS);
            parameterMap.ensure(E_WORLD_TO_LOCAL_RS);
            parameterMap.ensure(E_LOCAL_ROTATION);
            parameterMap.ensure(E_WORLD_ROTATION);
            parameterMap.ensure(E_RENDER_SCALE);
            parameterMap.ensure(E_SIMULATION_POSITION);
            parameterMap.ensure(E_POSITION);
            parameterMap.ensure(E_SPAWN_INFOS);
            parameterMap.ensure(E_SPAWN_INFO_COUNT);
            this._emitterStage.compile(parameterMap, this);
            this._spawnStage.compile(parameterMap, this);
            this._updateStage.compile(parameterMap, this);
            if (this._eventHandlerCount > 0) {
                for (let i = 0, length = this._eventHandlerCount; i < length; i++) {
                    this._eventHandlers[i].compile(parameterMap, this);
                }
            }
            this.reserveParticleParameter(this._particleCapacity);
            this._needToRecompile = false;
        }
    }

    /**
     * only for test
     * @internal
     * @engineInternal
     */
    public updateEmitterTime (parameterMap: VFXParameterMap) {
        const params = this._lifeCycleParams;
        const deltaTime = parameterMap.getFloatValue(C_DELTA_TIME).data;
        if (DEBUG) {
            assertIsTrue(deltaTime < params.duration,
                'The delta time should not exceed the duration of the particle system. please adjust the duration of the particle system.');
            assertIsTrue(deltaTime >= 0);
        }

        const delayMode = params.delayMode;
        const delay = parameterMap.getFloatValue(E_CURRENT_DELAY).data;
        const loopMode = params.loopMode;
        const loopCount = params.loopCount;
        const duration = params.duration;

        const age = parameterMap.getFloatValue(E_AGE);
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
            parameterMap.getUint32Value(E_CURRENT_LOOP_COUNT).data = count;
        } else {
            if (Math.floor(prevTime * invDurationAndDelay) >= expectedLoopCount) {
                prevTime = durationAndDelay;
            } else {
                prevTime %= durationAndDelay;
            }
            currentTime = durationAndDelay;
            parameterMap.getUint32Value(E_CURRENT_LOOP_COUNT).data = expectedLoopCount;
        }
        if (delayMode === DelayMode.EVERY_LOOP) {
            prevTime = Math.max(prevTime - delay, 0);
            currentTime = Math.max(currentTime - delay, 0);
        }

        parameterMap.getFloatValue(E_LOOPED_AGE).data = currentTime;
        parameterMap.getFloatValue(E_NORMALIZED_LOOP_AGE).data = currentTime * invDuration;
    }

    private updateEmitterTransform (parameterMap: VFXParameterMap) {
        parameterMap.getBoolValue(E_IS_WORLD_SPACE).data = !this._localSpace;
        const transform = this.node;
        Vec3.copy(this._state.prevWorldPosition, this._state.worldPosition);
        Vec3.copy(this._state.worldPosition, transform.worldPosition);
        if (transform.flagChangedVersion !== this._state.lastTransformChangedVersion) {
            switch (this._scalingMode) {
            case ScalingMode.LOCAL:
                parameterMap.getVec3Value(E_RENDER_SCALE).data = transform.scale;
                break;
            case ScalingMode.HIERARCHY:
                parameterMap.getVec3Value(E_RENDER_SCALE).data = transform.worldScale;
                break;
            default:
                parameterMap.getVec3Value(E_RENDER_SCALE).data = Vec3.ONE;
                break;
            }
            parameterMap.getMat4Value(E_LOCAL_TO_WORLD).data = transform.worldMatrix;
            parameterMap.getMat4Value(E_WORLD_TO_LOCAL).data = Mat4.invert(new Mat4(), transform.worldMatrix);
            parameterMap.getMat3Value(E_WORLD_TO_LOCAL_RS).data = Mat3.fromMat4(new Mat3(),  parameterMap.getMat4Value(E_WORLD_TO_LOCAL).data);
            this._state.lastTransformChangedVersion = transform.flagChangedVersion;
        }
        const distance = Vec3.subtract(new Vec3(), this._state.worldPosition, this._state.prevWorldPosition);
        Vec3.multiplyScalar(distance, distance, 1 / parameterMap.getFloatValue(C_DELTA_TIME).data);
        parameterMap.getVec3Value(E_VELOCITY).data = distance;
        parameterMap.getVec3Value(E_POSITION).data = this._state.worldPosition;
        parameterMap.getVec3Value(E_SIMULATION_POSITION).data = !this._localSpace ? this._state.worldPosition : Vec3.ZERO;
    }

    /**
     * @internal
     * @engineInternal
     */
    public render () {
        for (let i = 0, length = this._renderers.length; i < length; i++) {
            this._renderers[i].render(this._parameterMap, this._particleCount);
        }
    }

    private updateBounds () {
        if (this.boundsMode === BoundsMode.FIXED) {
            Vec3.copy(this._state.boundsMin, this._fixedBoundsMin);
            Vec3.copy(this._state.boundsMax, this._fixedBoundsMax);
        }
    }

    private removeDeadParticles (parameterMap: VFXParameterMap) {
        if (parameterMap.has(P_IS_DEAD)) {
            const values = parameterMap.getValueEntriesWithNamespace(VFXBuiltinNamespace.PARTICLE);
            const valueLength = values.length;
            const isDead = parameterMap.getBoolArrayValue(P_IS_DEAD).data;
            for (let i = this._particleCount - 1; i >= 0; i--) {
                if (isDead[i]) {
                    const lastParticle = this._particleCount - 1;
                    if (lastParticle !== i) {
                        for (let i = 0; i < valueLength; i++) {
                            const value = values[i];
                            if (value.isArray) {
                                (value as VFXArray).moveTo(lastParticle, i);
                            }
                        }
                    }
                    this._particleCount -= 1;
                }
            }
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public processEvents (parameterMap: VFXParameterMap) {
        const isWorldSpace = parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
        const worldToLocal = parameterMap.getMat4Value(E_WORLD_TO_LOCAL).data;
        for (let i = 0, length = this._eventHandlerCount; i < length; i++) {
            const eventHandler = this._eventHandlers[i];
            const target = eventHandler.target;
            if (target && target.isValid) {
                if (!target._parameterMap.has(C_EVENTS)) {
                    return;
                }
                const events = target._parameterMap.getEventArrayValue(C_EVENTS);
                const eventCount = target._parameterMap.getUint32Value(C_EVENT_COUNT).data;
                for (let i = 0; i < eventCount; i++) {
                    events.getEventAt(eventInfo, i);
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
                    eventHandler.execute(parameterMap);
                }
            }
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public resetAnimatedState (parameterMap: VFXParameterMap, fromIndex: number, toIndex: number) {
        if (parameterMap.has(P_VELOCITY)) {
            if (parameterMap.has(P_BASE_VELOCITY)) {
                parameterMap.getVec3ArrayValue(P_VELOCITY).copyFrom(parameterMap.getVec3ArrayValue(P_BASE_VELOCITY), fromIndex, toIndex);
            } else {
                parameterMap.getVec3ArrayValue(P_VELOCITY).fill(Vec3.ZERO, fromIndex, toIndex);
            }
        }
        if (parameterMap.has(P_SCALE)) {
            if (parameterMap.has(P_BASE_SCALE)) {
                parameterMap.getVec3ArrayValue(P_SCALE).copyFrom(parameterMap.getVec3ArrayValue(P_BASE_SCALE), fromIndex, toIndex);
            } else {
                parameterMap.getVec3ArrayValue(P_SCALE).fill(Vec3.ONE, fromIndex, toIndex);
            }
        }
        if (parameterMap.has(P_SPRITE_SIZE)) {
            if (parameterMap.has(P_BASE_SPRITE_SIZE)) {
                parameterMap.getVec2ArrayValue(P_SPRITE_SIZE).copyFrom(parameterMap.getVec2ArrayValue(P_BASE_SPRITE_SIZE), fromIndex, toIndex);
            } else {
                parameterMap.getVec2ArrayValue(P_SPRITE_SIZE).fill(Vec2.ONE, fromIndex, toIndex);
            }
        }
        if (parameterMap.has(P_COLOR)) {
            if (parameterMap.has(P_BASE_COLOR)) {
                parameterMap.getColorArrayValue(P_COLOR).copyFrom(parameterMap.getColorArrayValue(P_BASE_COLOR), fromIndex, toIndex);
            } else {
                parameterMap.getColorArrayValue(P_COLOR).fill(Color.WHITE, fromIndex, toIndex);
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
        const parameterMap = this._parameterMap;
        const fromIndex = this._particleCount;
        this.addNewParticles(spawnCount);
        const numSpawned = this._particleCount - fromIndex;
        const toIndex = this._particleCount;
        const hasPosition = parameterMap.has(P_POSITION);
        if (hasPosition) {
            const simulationPosition = parameterMap.getVec3Value(E_SIMULATION_POSITION).data;
            parameterMap.getVec3ArrayValue(P_POSITION).fill(simulationPosition, fromIndex, toIndex);
        }

        if (parameterMap.has(P_BASE_VELOCITY)) {
            parameterMap.getVec3ArrayValue(P_BASE_VELOCITY).fill(Vec3.ZERO, fromIndex, toIndex);
        }
        if (parameterMap.has(P_MESH_ORIENTATION)) {
            parameterMap.getVec3ArrayValue(P_MESH_ORIENTATION).fill(Vec3.ZERO, fromIndex, toIndex);
        }
        if (parameterMap.has(P_BASE_SCALE)) {
            parameterMap.getVec3ArrayValue(P_BASE_SCALE).fill(Vec3.ONE, fromIndex, toIndex);
        }
        if (parameterMap.has(P_BASE_COLOR)) {
            parameterMap.getColorArrayValue(P_BASE_COLOR).fill(initialColor, fromIndex, toIndex);
        }
        if (parameterMap.has(P_INV_LIFETIME)) {
            parameterMap.getFloatArrayVale(P_INV_LIFETIME).fill(1, fromIndex, toIndex);
        }
        if (parameterMap.has(P_NORMALIZED_AGE)) {
            parameterMap.getFloatArrayVale(P_NORMALIZED_AGE).fill(0, fromIndex, toIndex);
        }
        if (parameterMap.has(P_ID)) {
            const id = parameterMap.getUint32ArrayValue(P_ID).data;
            for (let i = fromIndex; i < toIndex; i++) {
                id[i] = ++this._state.maxParticleId;
            }
        }
        if (parameterMap.has(P_RANDOM_SEED)) {
            const randomSeed = parameterMap.getUint32ArrayValue(P_RANDOM_SEED).data;
            const randomStream = this._state.randomStream;
            for (let i = fromIndex; i < toIndex; i++) {
                randomSeed[i] = randomStream.getUInt32();
            }
        }

        const fi = parameterMap.getUint32Value(C_FROM_INDEX);
        const ti = parameterMap.getUint32Value(C_TO_INDEX);
        fi.data = fromIndex;
        ti.data = toIndex;
        this._spawnStage.execute(parameterMap);
        this.resetAnimatedState(parameterMap, fromIndex, toIndex);
        const interval = intervalDt;
        const deltaTime = parameterMap.getFloatValue(C_DELTA_TIME);
        const dt = deltaTime.data;
        if (!approx(interval, 0) || interpStartDt > 0) {
            const needPositionOffset = hasPosition && !initialVelocity.equals(Vec3.ZERO);
            const position = needPositionOffset ? parameterMap.getVec3ArrayValue(P_POSITION) : null;
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
                updateStage.execute(parameterMap);
            }
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public addNewParticles (numToEmit: number) {
        const capacity = this._capacityMode === CapacityMode.AUTO ? Number.MAX_SAFE_INTEGER : this._maxCapacity;
        if (numToEmit + this._particleCount > capacity) {
            numToEmit = capacity - this._particleCount;
        }

        if (numToEmit > 0) {
            let reservedCount = this._particleCapacity;
            while (this._particleCount + numToEmit > reservedCount) {
                reservedCount *= 2;
            }
            this.reserveParticleParameter(reservedCount);
            this._particleCount += numToEmit;
        }
    }

    private reserveParticleParameter (capacity: number) {
        if (capacity <= this._particleCapacity) return;
        const parameterMap = this._parameterMap;
        this._particleCapacity = capacity;
        const values = parameterMap.getValueEntriesWithNamespace(VFXBuiltinNamespace.PARTICLE);
        for (let i = 0, length = values.length; i < length; i++) {
            const value = values[i];
            if (value.isArray) {
                (value as VFXArray).reserve(capacity);
            }
        }
    }
}

CCClass.Attr.setClassAttr(EventHandler, 'target', 'type', 'Object');
CCClass.Attr.setClassAttr(EventHandler, 'target', 'ctor', VFXEmitter);
