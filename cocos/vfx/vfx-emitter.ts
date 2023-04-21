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
import { approx, clamp01, Color, lerp, Mat4, Quat, Mat3, randomRangeInt, Vec2, Vec3 } from '../core/math';
import { INT_MAX } from '../core/math/bits';
import { VFXEmitterParams, VFXEmitterState, VFXEventInfo, ModuleExecContext } from './base';
import { BoundsMode, CapacityMode, CullingMode, DelayMode, FinishAction, LoopMode, PlayingState, ScalingMode, Space } from './enum';
import { legacyCC } from '../core/global-exports';
import { assertIsTrue, CCBoolean, CCClass, CCInteger, Enum } from '../core';
import { Component, Node } from '../scene-graph';
import { ParticleDataSet, BuiltinParticleParameter, BuiltinParticleParameterFlags, builtinParticleParameterIdentities } from './particle-data-set';
import { VFXModuleStage, ModuleExecStage } from './vfx-module';
import { vfxManager } from './vfx-manager';
import { RandomStream } from './random-stream';
import { EventHandler } from './event-handler';
import { ParticleRenderer } from './particle-renderer';
import { EmitterDataSet } from './emitter-data-set';
import { UserDataSet } from './user-data-set';

const startPositionOffset = new Vec3();
const tempPosition = new Vec3();
const tempDir = new Vec3();
const dir = new Vec3();
const up = new Vec3();
const rot = new Quat();
const tempEmitterTransform = new Mat4();
const eventInfo = new VFXEventInfo();

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
    @visible(function (this: VFXEmitter) { return this.loopMode === LoopMode.MULTIPLE; })
    @rangeMin(1)
    public get loopCount () {
        return this._params.loopCount;
    }

    public set loopCount (val) {
        this._params.loopCount = Math.floor(Math.max(val, 1));
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
    @visible(function (this: VFXEmitter) { return this.delayMode !== DelayMode.NONE; })
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

    @visible(function (this: VFXEmitter) { return this.prewarm; })
    @rangeMin(0.001)
    public get prewarmTime () {
        return this._params.prewarmTime;
    }

    public set prewarmTime (val) {
        this._params.prewarmTime = Math.max(val, 0.001);
    }

    @visible(function (this: VFXEmitter) { return this.prewarm; })
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

    @type(Enum(ScalingMode))
    @tooltip('i18n:particle_system.scalingMode')
    public get scalingMode () {
        return this._params.scalingMode;
    }

    public set scalingMode (val) {
        this._params.scalingMode = val;
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
    @visible(function (this: VFXEmitter) { return this.capacityMode === CapacityMode.FIXED; })
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
    @visible(function (this: VFXEmitter) { return !this.useAutoRandomSeed; })
    public get randomSeed () {
        return this._params.randomSeed;
    }

    public set randomSeed (val) {
        this._params.randomSeed = val >>> 0;
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
    @visible(function (this: VFXEmitter) { return this.boundsMode === BoundsMode.FIXED; })
    public get fixedBoundsMin () {
        return this._params.fixedBoundsMin as Readonly<Vec3>;
    }

    public set fixedBoundsMin (val) {
        this._params.fixedBoundsMin.set(val);
    }

    @type(Vec3)
    @visible(function (this: VFXEmitter) { return this.boundsMode === BoundsMode.FIXED; })
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
    private _userParameters: any[] = [];
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
    private _params = new VFXEmitterParams();
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
            this._emitterDataSet.currentDelay = Math.max(lerp(this.delayRange.x, this.delayRange.y, this._state.randomStream.getFloat()), 0);
            if (this.particles.count === 0) {
                this._emitterStage.onPlay(this._params, this._state);
                this._spawnStage.onPlay(this._params, this._state);
                this._updateStage.onPlay(this._params, this._state);
                if (this._eventHandlerCount > 0) {
                    for (let i = 0, length = this._eventHandlerCount; i < length; i++) {
                        this._eventHandlers[i].onPlay(this._params, this._state);
                    }
                }
            }
            if (this.prewarm) {
                this._prewarmSystem();
            }
        }

        this._state.playingState = PlayingState.PLAYING;
        this._state.isEmitting = true;
        this.updateEmitterTransform(this.node);
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
        this.updateEmitterState(deltaTime);
        this.preTick(particles, emitter, user, context);

        this._emitterStage.execute(particles, emitter, user, context);
        const particleCount = particles.count;
        if (particleCount > 0) {
            context.setExecuteRange(0, particleCount);
            this.resetAnimatedState(particles, 0, particleCount);
            this._updateStage.execute(particles, emitter, user, context);
        }

        if (state.isEmitting) {
            emitter.spawnFraction = this.spawn(emitter.spawnContinuousCount, emitter.burstCount, emitter.spawnFraction, emitter.isWorldSpace
                ? emitter.localToWorld : Mat4.IDENTITY, Color.WHITE, Vec3.ONE, Vec3.ZERO);
        }

        this.processEvents(particles, emitter, user, context);
        this.removeDeadParticles(particles);
    }

    private updateEmitterState (dt: number) {
        const params = this._params;
        const emitterDataSet = this._emitterDataSet;
        emitterDataSet.burstCount = emitterDataSet.spawnContinuousCount = 0;
        const prevTime = emitterDataSet.age;
        emitterDataSet.age += dt;
        const isWorldSpace = this._params.simulationSpace === Space.WORLD;
        if (isWorldSpace) {
            this._particleDataSet.markRequiredParameters(BuiltinParticleParameterFlags.POSITION);
        }
        this.updateEmitterTime(emitterDataSet.age, prevTime,
            params.delayMode, emitterDataSet.currentDelay, params.loopMode, params.loopCount, params.duration);
        this.updateEmitterTransform(this.node, dt);
    }

    private updateEmitterTime (deltaTime: number, delayMode: DelayMode,
        delay: number, loopMode: LoopMode, loopCount: number, duration: number) {
        assertIsTrue(deltaTime < duration,
            'The delta time should not exceed the duration of the particle system. please adjust the duration of the particle system.');
        assertIsTrue(deltaTime >= 0);
        const emitter = this._emitterDataSet;
        let prevTime = emitter.age;
        emitter.age += deltaTime;
        let currentTime = emitter.age;
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
            this.loopCount = count;
        } else {
            if (Math.floor(prevTime * invDurationAndDelay) >= expectedLoopCount) {
                prevTime = durationAndDelay;
            } else {
                prevTime %= durationAndDelay;
            }
            currentTime = durationAndDelay;
            this.loopCount = expectedLoopCount;
        }
        if (delayMode === DelayMode.EVERY_LOOP) {
            prevTime = Math.max(prevTime - delay, 0);
            currentTime = Math.max(currentTime - delay, 0);
        }

        let emitterDeltaTime = currentTime - prevTime;
        if (emitterDeltaTime < 0) {
            emitterDeltaTime += duration;
        }

        emitter.frameOffset = deltaTime > 0 ? (deltaTime - emitterDeltaTime) / deltaTime : 0;
        emitter.loopAge = currentTime;
        emitter.prevLoopAge = prevTime;
        emitter.deltaTime = emitterDeltaTime;
        emitter.normalizedLoopAge = currentTime * invDuration;
        emitter.normalizedPrevLoopAge = prevTime * invDuration;
    }

    private updateEmitterTransform (node: Node, dt: number) {
        const emitterDataSet = this._emitterDataSet;
        emitterDataSet.isWorldSpace = this._params.simulationSpace === Space.WORLD;
        Vec3.copy(emitterDataSet.prevWorldPosition, emitterDataSet.worldPosition);
        Vec3.copy(emitterDataSet.worldPosition, node.worldPosition);
        if (node.flagChangedVersion !== this._state.lastTransformChangedVersion) {
            Mat4.invert(emitterDataSet.worldToLocal, emitterDataSet.localToWorld);
            Mat3.fromMat4(emitterDataSet.worldToLocalRS, emitterDataSet.worldToLocal);
            this._state.lastTransformChangedVersion = node.flagChangedVersion;
        }
        Vec3.subtract(emitterDataSet.velocity, emitterDataSet.worldPosition, emitterDataSet.prevWorldPosition);
        Vec3.multiplyScalar(emitterDataSet.velocity, emitterDataSet.velocity, 1 / dt);
    }

    /**
     * @internal
     * @engineInternal
     */
    public render () {
        this.updateBounds();
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
            particles.markRequiredParameters(BuiltinParticleParameterFlags.POSITION);
        }
        particles.ensureParameters(builtinParticleParameterIdentities);
    }

    private updateBounds () {
        if (this.boundsMode === BoundsMode.FIXED) {
            Vec3.copy(this._state.boundsMin, this._params.fixedBoundsMin);
            Vec3.copy(this._state.boundsMax, this._params.fixedBoundsMax);
        }
    }

    private removeDeadParticles (particles: ParticleDataSet) {
        if (particles.hasParameter(BuiltinParticleParameter.IS_DEAD)) {
            const isDead = particles.isDead.data;
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
                    Vec3.copy(emitter.velocity, eventInfo.velocity);
                    const initialVelocity = new Vec3();
                    Vec3.copy(initialVelocity, eventInfo.velocity);
                    if (!emitter.isWorldSpace) {
                        Mat4.multiply(tempEmitterTransform, emitter.worldToLocal, tempEmitterTransform);
                        Vec3.transformMat4(initialVelocity, initialVelocity, emitter.worldToLocal);
                    }
                    context.setExecuteRange(0, 0);
                    this.spawn(spawnFraction, tempEmitterTransform, eventInfo.color, eventInfo.scale, eventInfo.rotation);
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
        if (particles.hasParameter(BuiltinParticleParameter.VELOCITY)) {
            if (particles.hasParameter(BuiltinParticleParameter.BASE_VELOCITY)) {
                particles.velocity.copyFrom(particles.baseVelocity, fromIndex, toIndex);
            } else {
                particles.velocity.fill1f(0, fromIndex, toIndex);
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.SCALE)) {
            if (particles.hasParameter(BuiltinParticleParameter.BASE_SCALE)) {
                particles.scale.copyFrom(particles.baseScale, fromIndex, toIndex);
            } else {
                particles.scale.fill1f(1, fromIndex, toIndex);
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

    /**
     * @internal
     * @engineInternal
     */
    public spawn (numContinuous: number, numBurst: number, spawnFraction: number, initialTransform: Mat4, initialVelocity: Vec3, initialColor: Color,
        initialSize: Vec3, initialRotation: Vec3): number {
        spawnFraction += numContinuous;
        const numOverTime = Math.floor(spawnFraction);
        const burstCount = Math.floor(numBurst);

        if (numOverTime === 0 && burstCount === 0) {
            return spawnFraction;
        }
        const { _particleDataSet: particles, _params: params, _context: context, _emitterDataSet: emitter } = this;
        const fromIndex = particles.count;
        if (numOverTime > 0) {
            spawnFraction -= numOverTime;
            this.addNewParticles(particles, params, context, numOverTime);
        }
        const numContinuousSpawned = particles.count - fromIndex;
        if (burstCount > 0) {
            this.addNewParticles(particles, params, context, burstCount);
        }
        const toIndex = particles.count;
        const { normalizedLoopAge, normalizedPrevLoopAge, deltaTime, frameOffset } = emitter;
        const hasPosition = particles.hasParameter(BuiltinParticleParameter.POSITION);
        const hasSpawnNormalizedTime = particles.hasParameter(BuiltinParticleParameter.SPAWN_NORMALIZED_TIME);
        const hasSpawnTimeRatio = particles.hasParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
        const emitterTimeInterval = 1 / numContinuous;
        if (hasPosition) {
            const initialPosition = initialTransform.getTranslation(tempPosition);
            particles.position.fill(initialPosition, fromIndex, toIndex);
        }
        if (hasSpawnNormalizedTime || hasSpawnTimeRatio) {
            let noContinuousStartIndex = fromIndex;
            if (!approx(emitterTimeInterval, 0) && numContinuousSpawned > 0) {
                const spawnNormalizedTime = hasSpawnNormalizedTime ? particles.spawnNormalizedTime.data : null;
                const spawnRatio = hasSpawnNormalizedTime ? particles.spawnTimeRatio.data : null;
                const emitterTime = normalizedLoopAge < normalizedPrevLoopAge ? normalizedLoopAge + 1 : normalizedLoopAge;
                for (let i = fromIndex, num = 0, length = fromIndex + numContinuousSpawned; i < length; i++, num++) {
                    const offset = clamp01((spawnFraction + num) * emitterTimeInterval);
                    if (hasSpawnTimeRatio) {
                        spawnRatio![i] = offset;
                    }
                    if (hasSpawnNormalizedTime) {
                        let time = lerp(emitterTime, normalizedPrevLoopAge, offset);
                        if (time > 1) {
                            time -= 1;
                        }
                        spawnNormalizedTime![i] = time;
                    }
                }
                noContinuousStartIndex = fromIndex + numContinuousSpawned;
            }
            if (hasSpawnNormalizedTime) {
                particles.spawnNormalizedTime.fill(normalizedLoopAge, noContinuousStartIndex, toIndex);
            }
            if (hasSpawnTimeRatio) {
                particles.spawnTimeRatio.fill(0, noContinuousStartIndex, toIndex);
            }
        }

        if (particles.hasParameter(BuiltinParticleParameter.BASE_VELOCITY)) {
            particles.baseVelocity.fill1f(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.ROTATION)) {
            particles.rotation.fill(initialRotation, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.BASE_SCALE)) {
            particles.baseScale.fill(initialSize, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.BASE_COLOR)) {
            particles.baseColor.fill(initialColor, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.INV_START_LIFETIME)) {
            particles.invStartLifeTime.fill(1, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.NORMALIZED_AGE)) {
            particles.normalizedAge.fill(0, fromIndex, toIndex);
        }
        if (particles.hasParameter(BuiltinParticleParameter.ID)) {
            const id = particles.id.data;
            for (let i = fromIndex; i < toIndex; i++) {
                id[i] = ++this._state.maxParticleId;
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.RANDOM_SEED)) {
            const randomSeed = particles.randomSeed.data;
            const randomStream = this._state.randomStream;
            for (let i = fromIndex; i < toIndex; i++) {
                randomSeed[i] = randomStream.getUInt32();
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.INITIAL_DIR)) {
            const { initialDir } = particles;
            const initialDirVal = Vec3.set(tempDir, initialTransform.m02, initialTransform.m06, initialTransform.m10);
            initialDir.fill(initialDirVal, fromIndex, toIndex);
        }

        const user = this._userDataSet;
        context.setExecuteRange(fromIndex, toIndex);
        this._spawnStage.execute(particles, emitter, user, context);
        this.resetAnimatedState(particles, fromIndex, toIndex);
        const emitterTimeDeltaTimeScale = deltaTime / context.deltaTime;
        const interval = emitterTimeInterval * emitterTimeDeltaTimeScale;
        if (!approx(interval, 0) && numContinuousSpawned > 0) {
            const needPositionOffset = hasPosition && !initialVelocity.equals(Vec3.ZERO);
            const position = needPositionOffset ? particles.position : null;
            const updateStage = this._updateStage;
            // handle edge case when delayMode is EveryLoop and delay is less than deltaTime
            if (params.delayMode === DelayMode.EVERY_LOOP && normalizedLoopAge < normalizedPrevLoopAge && normalizedLoopAge > 0) {
                // |------ Delay ------|-----------Duration------------------|
                // |---------------------PrevTime--------------------|
                //                     |----currentTime---|
                //                                                   |-dt----|
                // |-----------------dt-------------------|
                //                                                   |emitdt-|
                //                     |-----emitdt-------|
                // |----frameOffset----|
                // Should add frameOffset to particle which spawnNormalizedTime is less than 1
                const currentTime = normalizedLoopAge + 1;
                for (let i = fromIndex + numContinuousSpawned - 1, num = numContinuousSpawned - 1; i >= fromIndex; i--, num--) {
                    const spawnOffset = clamp01((spawnFraction + num) * emitterTimeInterval);
                    if (DEBUG) {
                        assertIsTrue(spawnOffset >= 0 && spawnOffset <= 1);
                    }
                    let dtOffset = spawnOffset * emitterTimeDeltaTimeScale;
                    const spawnTime = lerp(currentTime, normalizedPrevLoopAge, spawnOffset);
                    if (spawnTime < 1) {
                        dtOffset += frameOffset;
                    }
                    const subDt = dtOffset * deltaTime;
                    if (needPositionOffset) {
                        Vec3.multiplyScalar(startPositionOffset, initialVelocity, -subDt);
                        position!.addVec3At(startPositionOffset, i);
                    }
                    context.setExecuteRange(i, i + 1);
                    context.deltaTime = subDt;
                    updateStage.execute(particles, emitter, user, context);
                }
            } else {
                // |------ Delay ------|-----------Duration-----------------------|
                //                     |-----------PrevTime----------|
                //                     |------------currentTime-------------------|
                //                                                   |----------dt--------------|
                //                                                   |---emitdt---|
                //                                                                |-frameOffset-|
                for (let i = fromIndex + numContinuous - 1, num = numContinuous - 1; i >= fromIndex; i--, num--) {
                    const offset = (spawnFraction + num) * interval + frameOffset;
                    if (DEBUG) {
                        assertIsTrue(offset >= 0 && offset <= 1);
                    }
                    const subDt = offset * deltaTime;
                    if (needPositionOffset) {
                        Vec3.multiplyScalar(startPositionOffset, initialVelocity, -subDt);
                        position!.addVec3At(startPositionOffset, i);
                    }
                    context.setExecuteRange(i, i + 1);
                    context.deltaTime = subDt;
                    updateStage.execute(particles, emitter, user, context);
                }
            }
        }
        return spawnFraction;
    }

    /**
     * @internal
     * @engineInternal
     */
    public addNewParticles (particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext, numToEmit: number) {
        const capacity = params.capacityMode === CapacityMode.AUTO ? Number.MAX_SAFE_INTEGER : params.capacity;
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
