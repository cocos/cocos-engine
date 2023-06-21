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
import { approx, Color, Mat4, Mat3, randomRangeInt, Vec2, Vec3 } from '../core/math';
import { INT_MAX } from '../core/math/bits';
import { BoundsMode, CapacityMode, CullingMode, C_DELTA_TIME, C_EVENTS, C_EVENT_COUNT, C_FROM_INDEX, C_TO_INDEX, E_IS_WORLD_SPACE, E_LOCAL_ROTATION, E_LOCAL_TO_WORLD, E_LOCAL_TO_WORLD_RS, E_POSITION, E_RENDER_SCALE, E_SIMULATION_POSITION, E_SPAWN_INFOS, E_SPAWN_INFO_COUNT, E_VELOCITY, E_WORLD_ROTATION, E_WORLD_TO_LOCAL, E_WORLD_TO_LOCAL_RS, FinishAction, PlayingState, P_BASE_COLOR, P_BASE_SCALE, P_BASE_SPRITE_SIZE, P_BASE_VELOCITY, P_COLOR, P_ID, P_INV_LIFETIME, P_IS_DEAD, P_MESH_ORIENTATION, P_NORMALIZED_AGE, P_POSITION, P_SCALE, P_SPRITE_SIZE, P_VELOCITY, ScalingMode, VFXBuiltinNamespace, E_RANDOM_SEED, C_TICK_COUNT, E_PARTICLE_NUM, E_AGE } from './define';
import { legacyCC } from '../core/global-exports';
import { assertIsTrue, CCBoolean, CCClass, CCInteger, Enum, geometry } from '../core';
import { Component } from '../scene-graph';
import { VFXStage, VFXExecutionStage } from './vfx-module';
import { vfxManager } from './vfx-manager';
import { EventHandler } from './event-handler';
import { ParticleRenderer } from './particle-renderer';
import { SpawnInfo, VFXEventInfo } from './data';
import { VFXArray, VFXParameterRegistry } from './vfx-parameter';
import { VFXParameterMap } from './vfx-parameter-map';

const startPositionOffset = new Vec3();
const eventInfo = new VFXEventInfo();
const spawnInfo = new SpawnInfo();

@ccclass('cc.VFXEmitter')
@help('i18n:cc.VFXEmitter')
@menu('Effects/VFXEmitter')
@executionOrder(99)
@executeInEditMode
export class VFXEmitter extends Component {
    public static CullingMode = CullingMode;

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
     * @zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）。
     */
    @tooltip('i18n:particle_system.prewarm')
    public get prewarm () {
        return this._prewarm;
    }

    public set prewarm (val) {
        this._prewarm = val;
    }

    @visible(function (this: VFXEmitter) { return this.prewarm; })
    @rangeMin(0.001)
    public get prewarmTime () {
        return this._prewarmTime;
    }

    public set prewarmTime (val) {
        this._prewarmTime = Math.max(val, 0.001);
    }

    @visible(function (this: VFXEmitter) { return this.prewarm; })
    @rangeMin(0.001)
    public get prewarmTimeStep () {
        return this._prewarmTimeStep;
    }

    public set prewarmTimeStep (val) {
        this._prewarmTimeStep = Math.max(val, 0.001);
    }

    /**
     * @zh 控制整个粒子系统的更新速度。
     */
    @tooltip('i18n:particle_system.simulationSpeed')
    @rangeMin(0.001)
    public get simulationSpeed () {
        return this._simulationSpeed;
    }

    public set simulationSpeed (val) {
        this._simulationSpeed = Math.max(val, 0.001);
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
        return this._playOnAwake;
    }

    public set playOnAwake (val) {
        this._playOnAwake = val;
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

    public get playingState () {
        return this._playingState;
    }

    public get isEmitting () {
        return this._isEmitting;
    }

    public get time () {
        if (this._parameterMap.has(E_AGE)) {
            return this._parameterMap.getFloatValue(E_AGE).data;
        }
        return 0;
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
        if (this._parameterMap.has(E_PARTICLE_NUM)) {
            return this._parameterMap.getUint32Value(E_PARTICLE_NUM).data;
        }
        return 0;
    }

    public get rendererCount () {
        return this._renderers.length;
    }

    public get lastSimulateFrame () {
        return this._lastSimulateFrame;
    }

    public get bounds () {
        return this._bounds as Readonly<geometry.AABB>;
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
    private _boundsMode = BoundsMode.DYNAMIC;
    @serializable
    private _fixedBoundsMin = new Vec3(-1, -1, -1);
    @serializable
    private _fixedBoundsMax = new Vec3(1, 1, 1);
    @serializable
    private _cullingMode = CullingMode.ALWAYS_SIMULATE;
    @serializable
    private _capacityMode = CapacityMode.DYNAMIC;
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
    @serializable
    private _prewarm = false;
    @serializable
    private _prewarmTime = 5;
    @serializable
    private _prewarmTimeStep = 0.03;
    @serializable
    private _simulationSpeed = 1.0;
    @serializable
    private _playOnAwake = true;
    @serializable
    private _parameterRegistry = new VFXParameterRegistry();
    private _parameterMap = new VFXParameterMap();
    private _particleCapacity = 16;
    private _needToRecompile = true;
    private _playingState = PlayingState.STOPPED;
    private _needRestart = false;
    private _isEmitting = true;
    private _lastSimulateFrame = 0;
    private _maxParticleId = 0;
    private _bounds = new geometry.AABB();
    private _lastTransformChangedVersion = 0xffffffff;

    /**
     * @internal
     * @engineInternal
     */
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
        if (this._playingState === PlayingState.PLAYING) {
            return;
        }
        if (this._playingState === PlayingState.STOPPED) {
            this._parameterMap.getFloatValue(E_RANDOM_SEED).data = this.determinism ? this.randomSeed : randomRangeInt(0, INT_MAX);
            this._parameterMap.getVec3Value(E_POSITION).data = this.node.worldPosition;
            if (this.prewarm) {
                this._prewarmSystem();
            }
        }

        this._playingState = PlayingState.PLAYING;
        this._isEmitting = true;
        vfxManager.addEmitter(this);
    }

    /**
     * @en pause particle system
     * @zh 暂停播放粒子效果。
     */
    public pause () {
        if (this._playingState !== PlayingState.PLAYING) {
            console.warn('pause(): particle system is already stopped.');
            return;
        }
        this._playingState = PlayingState.PAUSED;
    }

    /**
     * @en stop particle system
     * @zh 停止播放粒子。
     */
    public stop (clear = false) {
        this._isEmitting = false;
        if (clear) {
            this._playingState = PlayingState.STOPPED;
            this._parameterMap.reset();
            vfxManager.removeEmitter(this);
        }
    }

    /**
     * @en remove all particles from current particle system.
     * @zh 将所有粒子从粒子系统中清除。
     */
    public clear () {
        if (this._parameterMap.has(E_PARTICLE_NUM)) {
            this._parameterMap.getUint32Value(E_PARTICLE_NUM).data = 0;
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public addEventHandler () {
        const eventHandler = new EventHandler();
        this._eventHandlers.push(eventHandler);
        this._eventHandlerCount++;
        this.requireRecompile();
        return eventHandler;
    }

    /**
     * @internal
     * @engineInternal
     */
    public removeEventHandler (eventHandler: EventHandler) {
        const index = this._eventHandlers.indexOf(eventHandler);
        if (index !== -1) {
            this._eventHandlers.splice(index, 1);
            this._eventHandlerCount--;
            this.requireRecompile();
        }
    }

    /**
     * @internal
     * @engineInternal
     */
    public addRenderer<T extends ParticleRenderer> (Type: Constructor<T>): T {
        const renderer = new Type();
        this._renderers.push(renderer);
        return renderer;
    }

    public removeRenderer (renderer: ParticleRenderer) {
        const index = this._renderers.indexOf(renderer);
        if (index !== -1) {
            this._renderers.splice(index, 1);
        }
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
    public tick (deltaTime: number) {
        this._lastSimulateFrame = vfxManager.totalFrames;
        if (DEBUG) {
            assertIsTrue(this._playingState !== PlayingState.STOPPED, 'Particle Emitter is not playing, please call play() method first.');
        }
        const parameterMap = this._parameterMap;
        this.compile(parameterMap, this._parameterRegistry);
        this.updatePrerequisite(parameterMap, deltaTime);
        this._emitterStage.execute(parameterMap);
        const particleNum = parameterMap.getUint32Value(E_PARTICLE_NUM);
        if (particleNum.data > 0) {
            this.resetAnimatedState(parameterMap, 0, particleNum.data);
            this._updateStage.execute(parameterMap);
        }

        if (this._isEmitting) {
            const isWorldSpace = parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
            const initialPosition = parameterMap.getVec3Value(E_SIMULATION_POSITION).data;
            const initialVelocity = isWorldSpace ? parameterMap.getVec3Value(E_VELOCITY).data : Vec3.ZERO;
            const spawnInfoCount = parameterMap.getUint32Value(E_SPAWN_INFO_COUNT).data;
            if (spawnInfoCount > 0) {
                const spawnInfos = parameterMap.getSpawnInfoArrayValue(E_SPAWN_INFOS);
                for (let i = 0; i < spawnInfoCount; i++) {
                    spawnInfos.getSpawnInfoAt(spawnInfo, i);
                    this.spawn(spawnInfo.count, spawnInfo.intervalDt, spawnInfo.interpStartDt, initialPosition, initialVelocity, Color.WHITE);
                }
            }
            this.processEvents(parameterMap);
        }

        this.removeDeadParticles(parameterMap);
        this.updateBounds();
        if (particleNum.data === 0 && !this._isEmitting) {
            this.stop();
        }
    }

    private compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry) {
        if (this._needToRecompile) {
            parameterMap.ensure(C_EVENT_COUNT);
            parameterMap.ensure(C_DELTA_TIME);
            parameterMap.ensure(C_TICK_COUNT);
            parameterMap.ensure(C_FROM_INDEX);
            parameterMap.ensure(C_TO_INDEX);
            parameterMap.ensure(E_IS_WORLD_SPACE);
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
            parameterMap.ensure(E_SPAWN_INFO_COUNT);
            this._emitterStage.compile(parameterMap, parameterRegistry, this);
            this._spawnStage.compile(parameterMap, parameterRegistry, this);
            this._updateStage.compile(parameterMap, parameterRegistry, this);
            if (this._eventHandlerCount > 0) {
                for (let i = 0, length = this._eventHandlerCount; i < length; i++) {
                    this._eventHandlers[i].compile(parameterMap, parameterRegistry, this);
                }
            }
            this.reserveParticleParameter(this._particleCapacity);
            this._needToRecompile = false;
        }
    }

    private updatePrerequisite (parameterMap: VFXParameterMap, deltaTime: number) {
        let scaledDeltaTime = deltaTime * Math.max(this.simulationSpeed, 0);
        if (scaledDeltaTime > this.maxDeltaTime) {
            scaledDeltaTime /= Math.ceil(scaledDeltaTime / this.maxDeltaTime);
        }
        parameterMap.getBoolValue(E_IS_WORLD_SPACE).data = !this._localSpace;
        parameterMap.getUint32Value(C_EVENT_COUNT).data = 0;
        parameterMap.getUint32Value(C_TICK_COUNT).data++;
        parameterMap.getFloatValue(C_DELTA_TIME).data = scaledDeltaTime;
        parameterMap.getUint32Value(C_FROM_INDEX).data = 0;
        parameterMap.getUint32Value(C_TO_INDEX).data = parameterMap.getUint32Value(E_PARTICLE_NUM).data;
        parameterMap.getUint32Value(E_SPAWN_INFO_COUNT).data = 0;
        const transform = this.node;
        if (transform.flagChangedVersion !== this._lastTransformChangedVersion) {
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
            this._lastTransformChangedVersion = transform.flagChangedVersion;
        }
        const distance = Vec3.subtract(new Vec3(), transform.worldPosition, parameterMap.getVec3Value(E_POSITION).data);
        parameterMap.getVec3Value(E_VELOCITY).data = Vec3.multiplyScalar(distance, distance, 1 / scaledDeltaTime);
        parameterMap.getVec3Value(E_POSITION).data = transform.worldPosition;
        parameterMap.getVec3Value(E_SIMULATION_POSITION).data = !this._localSpace ? transform.worldPosition : Vec3.ZERO;
    }

    /**
     * @internal
     * @engineInternal
     */
    public render () {
        const renderers = this._renderers;
        const parameterMap = this._parameterMap;
        const parameterRegistry = this._parameterRegistry;
        for (let i = 0, length = renderers.length; i < length; i++) {
            if (renderers[i].enabled) {
                renderers[i].render(parameterMap, parameterRegistry);
            }
        }
    }

    private updateBounds () {
        if (this.boundsMode === BoundsMode.FIXED) {
            geometry.AABB.fromPoints(this._bounds, this._fixedBoundsMin, this._fixedBoundsMax);
        } else {
            const renderers = this._renderers;
            const bounds = this._bounds;
            const parameterMap = this._parameterMap;
            const parameterRegistry = this._parameterRegistry;
            geometry.AABB.fromPoints(this._bounds, Vec3.ZERO, Vec3.ZERO);
            for (let i = 0, length = renderers.length; i < length; i++) {
                if (renderers[i].enabled) {
                    renderers[i].updateBounds(bounds, parameterMap, parameterRegistry);
                }
            }
        }
    }

    private removeDeadParticles (parameterMap: VFXParameterMap) {
        if (parameterMap.has(P_IS_DEAD)) {
            const values = parameterMap.getValueEntriesWithNamespace(VFXBuiltinNamespace.PARTICLE);
            const valueLength = values.length;
            const isDead = parameterMap.getBoolArrayValue(P_IS_DEAD).data;
            const particleNum = parameterMap.getUint32Value(E_PARTICLE_NUM);
            for (let i = particleNum.data - 1; i >= 0; i--) {
                if (isDead[i]) {
                    const lastParticle = particleNum.data - 1;
                    if (lastParticle !== i) {
                        for (let i = 0; i < valueLength; i++) {
                            const value = values[i];
                            if (value.isArray) {
                                (value as VFXArray).moveTo(lastParticle, i);
                            }
                        }
                    }
                    particleNum.data--;
                }
            }
        }
    }

    private processEvents (parameterMap: VFXParameterMap) {
        const isWorldSpace = parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
        const worldToLocal = parameterMap.getMat4Value(E_WORLD_TO_LOCAL).data;
        const initialVelocity = new Vec3();
        const initialPosition = new Vec3();
        for (let i = 0, length = this._eventHandlerCount; i < length; i++) {
            const eventHandler = this._eventHandlers[i];
            const target = eventHandler.target;
            if (target && target.isValid) {
                const eventCount = target._parameterMap.getUint32Value(C_EVENT_COUNT).data;
                if (eventCount > 0) {
                    const events = target._parameterMap.getEventArrayValue(C_EVENTS);
                    for (let i = 0; i < eventCount; i++) {
                        events.getEventAt(eventInfo, i);
                        if (eventInfo.type !== eventHandler.eventType) { continue; }
                        Vec3.copy(initialVelocity, eventInfo.velocity);
                        Vec3.copy(initialPosition, eventInfo.position);
                        if (!isWorldSpace) {
                            Vec3.transformMat4(initialPosition, initialPosition, worldToLocal);
                            Vec3.transformMat4(initialVelocity, initialVelocity, worldToLocal);
                        }
                        this.spawn(eventHandler.spawnCount, 0, 0, initialPosition, initialVelocity, eventInfo.color);
                        eventHandler.execute(parameterMap);
                    }
                }
            }
        }
    }

    private resetAnimatedState (parameterMap: VFXParameterMap, fromIndex: number, toIndex: number) {
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

    private spawn (spawnCount: number, intervalDt: number, interpStartDt: number, initialPosition: Vec3, initialVelocity: Vec3, initialColor: Color) {
        if (spawnCount === 0) {
            return;
        }
        const parameterMap = this._parameterMap;
        const particleNum = parameterMap.getUint32Value(E_PARTICLE_NUM);
        const fromIndex = particleNum.data;
        this.addNewParticles(spawnCount);
        const toIndex = particleNum.data;
        const numSpawned = toIndex - fromIndex;
        const hasPosition = parameterMap.has(P_POSITION);
        if (hasPosition) {
            parameterMap.getVec3ArrayValue(P_POSITION).fill(initialPosition, fromIndex, toIndex);
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
                id[i] = ++this._maxParticleId;
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

    private addNewParticles (numToEmit: number) {
        const capacity = this._capacityMode === CapacityMode.DYNAMIC ? Number.MAX_SAFE_INTEGER : this._maxCapacity;
        const particleNum = this._parameterMap.getUint32Value(E_PARTICLE_NUM);
        if (numToEmit + particleNum.data > capacity) {
            numToEmit = capacity - particleNum.data;
        }

        if (numToEmit > 0) {
            particleNum.data += numToEmit;
            while (particleNum.data > this._particleCapacity) {
                this._particleCapacity *= 2;
            }
            this.reserveParticleParameter(this._particleCapacity);
        }
    }

    private reserveParticleParameter (capacity: number) {
        const parameterMap = this._parameterMap;
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
