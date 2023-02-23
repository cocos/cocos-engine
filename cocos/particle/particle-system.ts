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
import { approx, clamp01, EPSILON, lerp, Mat3, Mat4, pseudoRandom, Quat, randomRangeInt, Size, Vec2, Vec3, Vec4 } from '../core/math';
import { INT_MAX } from '../core/math/bits';
import { ColorOverLifetimeModule } from './modules/color-over-lifetime';
import { CurveRange, Mode } from './curve-range';
import { ForceOverLifetimeModule } from './modules/force-over-lifetime';
import { LimitVelocityOverLifetimeModule } from './modules/limit-velocity-over-lifetime';
import { RotationOverLifetimeModule } from './modules/rotation-over-lifetime';
import { SizeOverLifetimeModule } from './modules/size-over-lifetime';
import { TextureAnimationModule } from './modules/texture-animation';
import { VelocityOverLifetimeModule } from './modules/velocity-over-lifetime';
import { StartColorModule } from './modules/start-color';
import { StartSizeModule } from './modules/start-size';
import { StartSpeedModule } from './modules/start-speed';
import { StartLifeTimeModule } from './modules/start-life-time';
import { EmissionOverTimeModule } from './modules/emission-over-time';
import { EmissionOverDistanceModule } from './modules/emission-over-distance';
import { GravityModule } from './modules/gravity';
import { SpeedModifierModule } from './modules/speed-modifier';
import { StartRotationModule } from './modules/start-rotation';
import { ShapeModule } from './modules/shape-module';
import { ParticleEmitterContext, ParticleSystemParams, ParticleSystemState, ParticleUpdateContext, PlayingState, SpawnEvent } from './particle-update-context';
import { CullingMode, Space } from './enum';
import { ParticleSystemRenderer } from './particle-system-renderer';
import { TrailModule } from './modules/trail';
import { legacyCC } from '../core/global-exports';
import { TransformBit } from '../core/scene-graph/node-enum';
import { AABB, intersect } from '../core/geometry';
import { Camera, Model } from '../core/renderer/scene';
import { NoiseModule } from './modules/noise';
import { CCBoolean, CCFloat, CCInteger, Component, Enum, geometry, js } from '../core';
import { INVALID_HANDLE, ParticleHandle, ParticleSOAData, RecordReason } from './particle-soa-data';
import { EmissionModule, InitializationModule, ParticleModule, ParticleUpdateStage, UpdateModule } from './particle-module';
import { particleSystemManager } from './particle-system-manager';
import { BurstEmissionModule } from './modules/burst-emission';

const startPositionOffset = new Vec3();
const velocity = new Vec3();
const tempPosition = new Vec3();
const tempDir = new Vec3();

@ccclass('cc.ParticleSystem')
@help('i18n:cc.ParticleSystem')
@menu('Effects/ParticleSystem')
@executionOrder(99)
@requireComponent(ParticleSystemRenderer)
@executeInEditMode
export class ParticleSystem extends Component {
    public static CullingMode = CullingMode;

    /**
     * @zh 粒子系统运行时间。
     */
    @tooltip('i18n:particle_system.duration')
    public get duration () {
        return this._params.duration;
    }

    public set duration (val) {
        this._params.duration = val;
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
    get cullingMode () {
        return this._params.cullingMode;
    }

    set cullingMode (val) {
        this._params.cullingMode = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartColorModule.startColor]] instead.
     */
    get startColor () {
        return this.getOrAddModule(StartColorModule).startColor;
    }

    set startColor (val) {
        this.getOrAddModule(StartColorModule).startColor = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSizeModule.startSize3D]] instead.
     */
    get startSize3D () {
        return this.getOrAddModule(StartSizeModule).startSize3D;
    }

    set startSize3D (val) {
        this.getOrAddModule(StartSizeModule).startSize3D = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSizeModule.startSizeX]] instead.
     */
    get startSizeX () {
        return this.getOrAddModule(StartSizeModule).startSizeX;
    }

    set startSizeX (val) {
        this.getOrAddModule(StartSizeModule).startSizeX = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSizeModule.startSizeY]] instead.
     */
    get startSizeY () {
        return this.getOrAddModule(StartSizeModule).startSizeY;
    }

    set startSizeY (val) {
        this.getOrAddModule(StartSizeModule).startSizeY = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSizeModule.startSizeZ]] instead.
     */
    get startSizeZ () {
        return this.getOrAddModule(StartSizeModule).startSizeZ;
    }

    set startSizeZ (val) {
        this.getOrAddModule(StartSizeModule).startSizeZ = val;
    }

    /**
     * @deprecated since v3.8, please use [[StartSpeedModule.startSpeed]] instead.
     */
    get startSpeed () {
        return this.getOrAddModule(StartSpeedModule).startSpeed;
    }

    set startSpeed (val) {
        this.getOrAddModule(StartSpeedModule).startSpeed = val;
    }

    /**
     * @zh 颜色控制模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get colorOverLifetimeModule () {
        return this.getOrAddModule(ColorOverLifetimeModule);
    }

    /**
     * @zh 粒子发射器模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get shapeModule () {
        return this.getOrAddModule(ShapeModule);
    }

    /**
     * @zh 粒子大小模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get sizeOverLifetimeModule () {
        return this.getOrAddModule(SizeOverLifetimeModule);
    }

    /**
     * @zh 粒子速度模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get velocityOverLifetimeModule () {
        return this.getOrAddModule(VelocityOverLifetimeModule);
    }

    /**
     * @zh 粒子加速度模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get forceOverLifetimeModule () {
        return this.getOrAddModule(ForceOverLifetimeModule);
    }

    /**
     * @zh 粒子限制速度模块（只支持 CPU 粒子）
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.。
     */
    public get limitVelocityOverLifetimeModule () {
        return this.getOrAddModule(LimitVelocityOverLifetimeModule);
    }

    /**
     * @zh 粒子旋转模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get rotationOverLifetimeModule () {
        return this.getOrAddModule(RotationOverLifetimeModule);
    }

    /**
     * @zh 贴图动画模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get textureAnimationModule () {
        return this.getOrAddModule(TextureAnimationModule);
    }

    /**
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get noiseModule () {
        return this.getOrAddModule(NoiseModule);
    }

    /**
     * @zh 粒子轨迹模块。
     * @deprecated since v3.8, please use [[ParticleSystem.getModule]] instead.
     */
    public get trailModule () {
        return this.getOrAddModule(TrailModule);
    }

    public get particles () {
        return this._particles;
    }

    public get renderer () {
        return this.getComponent(ParticleSystemRenderer);
    }

    @type([ParticleModule])
    @displayName('Modules')
    private get particleModules (): ReadonlyArray<ParticleModule> {
        return this._particleModules.filter((module) => !module.hideInInspector);
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

    public get isSubEmitter () {
        return this._state.isSubEmitter;
    }

    public set isSubEmitter (val) {
        if (val) {
            this._state.isEmitting = false;
        }
        this._state.isSubEmitter = val;
    }

    @serializable
    private _particleModules: ParticleModule[] = [];
    private _activeModules: ParticleModule[] = [];
    @serializable
    private _params = new ParticleSystemParams();
    private _boundingBoxHalfExtents = new Vec3();
    private _particles = new ParticleSOAData();
    private _updateContext = new ParticleUpdateContext();
    private _emitterContext = new ParticleEmitterContext();
    private _state = new ParticleSystemState();

    private static _sortParticleModule (moduleA: ParticleModule, moduleB: ParticleModule) {
        return (moduleA.updateStage - moduleB.updateStage) || (moduleA.updatePriority - moduleB.updatePriority)
            || moduleA.name.localeCompare(moduleB.name);
    }

    /**
     * @zh 添加粒子模块
     */
    public addModule<T extends ParticleModule> (ModuleType: Constructor<T>): T {
        const newModule = new ModuleType();
        this._particleModules.push(newModule);
        this._particleModules.sort(ParticleSystem._sortParticleModule);
        return newModule;
    }

    public getModule<T extends ParticleModule> (moduleType: Constructor<T>): T | null {
        for (let i = 0, l = this._particleModules.length; i < l; i++) {
            const particleModule = this._particleModules[i];
            if (particleModule instanceof moduleType) {
                return particleModule;
            }
        }
        return null;
    }

    public removeModule (moduleType: Constructor<ParticleModule>) {
        let index = -1;
        for (let i = 0, l = this._particleModules.length; i < l; i++) {
            const particleModule = this._particleModules[i];
            if (particleModule instanceof moduleType) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            this._particleModules.splice(index, 1);
        }
    }

    public getOrAddModule<T extends ParticleModule> (moduleType: Constructor<T>): T {
        let module = this.getModule(moduleType);
        if (!module) {
            module = this.addModule(moduleType);
        }
        return module;
    }

    public emit (currentTime: number, prevTime: number, dt: number, context: ParticleEmitterContext) {
        if (this._params.simulationSpace === Space.LOCAL) {
            Mat4.multiply(context.emitterTransform, this._updateContext.worldToLocal, context.emitterTransform);
            Vec3.transformMat4(context.velocity, context.velocity, this._updateContext.worldToLocal);
        }
        this.startEmitParticles(this.particles, this._params, context, this._updateContext, context.velocity, prevTime, currentTime, dt);
    }

    public evaluateEmissionState (currentTime: number, prevTime: number, context: ParticleEmitterContext) {
        context.burstCount = context.emittingNumOverDistance = context.emittingNumOverTime = 0;
        const emissionModules = this.getEmissionModules();
        for (let i = 0, length = emissionModules.length; i < length; i++) {
            emissionModules[i].update(this._particles, this._params, context, prevTime, currentTime);
        }
    }

    public beginUpdate () {
        for (let i = 0, length = this._activeModules.length; i < length; i++) {
            this._activeModules[i].beginUpdate();
        }
    }

    /**
     * @en play particle system
     * @zh 播放粒子效果。
     */
    public play () {
        this._state.playingState = PlayingState.PLAYING;
        if (!this._state.isSubEmitter) {
            this._state.isEmitting = true;

            // prewarm
            if (this.prewarm) {
                this._prewarmSystem();
            }
        } else {
            this._state.isEmitting = false;
        }

        this._activeModules.length = 0;
        for (let i = 0; i < this._particleModules.length; i++) {
            const module = this._particleModules[i];
            if (module.enable) {
                this._activeModules.push(module);
                module.onPlay();
            }
        }
        this._state.currentPosition.set(this.node.worldPosition);
        this._state.startDelay = this.startDelay.evaluate(0, 1);
        particleSystemManager.addParticleSystem(this);
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
        particleSystemManager.removeParticleSystem(this);
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

    protected onLoad () {
        const renderer = this.getComponent(ParticleSystemRenderer);
        if (renderer) {
            renderer.setParticleSystem(this);
        }
        this.getOrAddModule(BurstEmissionModule);
        this.getOrAddModule(ColorOverLifetimeModule);
        this.getOrAddModule(EmissionOverDistanceModule);
        this.getOrAddModule(EmissionOverTimeModule);
        this.getOrAddModule(ForceOverLifetimeModule);
        this.getOrAddModule(GravityModule);
        this.getOrAddModule(LimitVelocityOverLifetimeModule);
        this.getOrAddModule(NoiseModule);
        this.getOrAddModule(RotationOverLifetimeModule);
        this.getOrAddModule(ShapeModule);
        this.getOrAddModule(SizeOverLifetimeModule);
        this.getOrAddModule(SpeedModifierModule);
        this.getOrAddModule(StartColorModule);
        this.getOrAddModule(StartLifeTimeModule);
        this.getOrAddModule(StartRotationModule);
        this.getOrAddModule(StartSizeModule);
        this.getOrAddModule(StartSpeedModule);
        this.getOrAddModule(TextureAnimationModule);
        this.getOrAddModule(VelocityOverLifetimeModule);
        this.getOrAddModule(js.getClassById('cc.EventModule') as Constructor<ParticleModule>);
    }

    protected onEnable () {
        if (this.playOnAwake && (!EDITOR || legacyCC.GAME_VIEW)) {
            this.play();
        }
    }

    protected onDisable () {
        this.stop();
    }

    public simulate (dt: number) {
        const scaledDeltaTime = dt * this.simulationSpeed;

        if (this.isPlaying && this._state.isSimulating) {
            // simulation, update particles.
            this.updateParticles(scaledDeltaTime);

            if (this._particles.count === 0 && !this.loop && !this.isEmitting) {
                this.stop();
            }
        }

        const currentPosition = this.node.worldPosition;
        const boundingBox = new AABB(currentPosition.x, currentPosition.y, currentPosition.z,
            this._boundingBoxHalfExtents.x, this._boundingBoxHalfExtents.y, this._boundingBoxHalfExtents.z);

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

    // initialize particle system as though it had already completed a full cycle.
    private _prewarmSystem () {
        this.startDelay.mode = Mode.Constant; // clear startDelay.
        this.startDelay.constant = 0;
        const dt = 1.0; // should use varying value?
        const cnt = this.duration / dt;

        for (let i = 0; i < cnt; ++i) {
            this.updateParticles(dt);
        }
    }

    private getEmissionModules () {
        return this._activeModules.filter((module) => module.updateStage === ParticleUpdateStage.EMITTER_UPDATE) as EmissionModule[];
    }

    private getInitializationModules () {
        return this._activeModules.filter((module) => module.updateStage === ParticleUpdateStage.INITIALIZE) as InitializationModule[];
    }

    private getPreUpdateModules () {
        return this._activeModules.filter((module) => module.updateStage === ParticleUpdateStage.PRE_UPDATE) as UpdateModule[];
    }

    private getPostUpdateModules () {
        return this._activeModules.filter((module) => module.updateStage === ParticleUpdateStage.POST_UPDATE) as UpdateModule[];
    }

    // internal function
    private updateParticles (deltaTime: number) {
        const particles = this._particles;
        const updateContext = this._updateContext;
        const emitterContext = this._emitterContext;
        const params = this._params;
        const state = this._state;
        state.lastPosition.set(state.currentPosition);
        state.currentPosition.set(this.node.worldPosition);
        updateContext.localToWorld.set(this.node.worldMatrix);
        Mat4.invert(updateContext.worldToLocal, updateContext.localToWorld);
        Vec3.subtract(emitterContext.velocity, state.currentPosition, state.lastPosition);
        Vec3.multiplyScalar(emitterContext.velocity, emitterContext.velocity, 1 / deltaTime);
        Quat.normalize(updateContext.worldRotation, this.node.worldRotation);
        emitterContext.emitterTransform.set(params.simulationSpace === Space.WORLD ? updateContext.localToWorld : Mat4.IDENTITY);
        const prevTime = Math.max(state.accumulatedTime - state.startDelay, 0);
        state.accumulatedTime += deltaTime;
        const currentTime = Math.max(state.accumulatedTime - state.startDelay, 0);

        const modules = this._activeModules;
        for (let i = 0, length = modules.length; i < length; i++) {
            modules[i].tick(particles, params, updateContext, currentTime, currentTime - prevTime);
        }

        let particleCount = particles.count;
        if (particleCount > 0) {
            this.resetAnimatedState(particles, 0, particleCount);

            const updateModules = this.getPreUpdateModules();
            for (let i = 0, length = updateModules.length; i < length; i++) {
                updateModules[i].update(particles, params, updateContext, 0, particleCount, deltaTime);
            }
            this.updateParticleState(particles, 0, particleCount, deltaTime);
            this.killParticlesOverMaxLifeTime(particles, 0, particleCount);
            // After killing particles, the count of particle may be changed. so get the current count.
            particleCount = particles.count;
            const postUpdateModules = this.getPostUpdateModules();
            for (let i = 0, length = postUpdateModules.length; i < length; i++) {
                postUpdateModules[i].update(particles, params, updateContext, 0, particleCount, deltaTime);
            }
            this.consumeEvents(particles, params, updateContext);
        }

        if (state.isEmitting) {
            this.evaluateEmissionState(currentTime, prevTime, emitterContext);
            this.startEmitParticles(particles, params, emitterContext, updateContext,
                params.simulationSpace === Space.WORLD ? emitterContext.velocity : Vec3.ZERO, prevTime, currentTime, currentTime - prevTime);
        }
    }

    private resetAnimatedState (particles: ParticleSOAData, fromIndex: number, toIndex: number) {
        const { animatedVelocityX, animatedVelocityY, animatedVelocityZ, angularVelocityX, angularVelocityY, angularVelocityZ, color, startColor } = particles;
        for (let i = fromIndex; i < toIndex; i++) {
            animatedVelocityX[i] = 0;
            animatedVelocityY[i] = 0;
            animatedVelocityZ[i] = 0;
            angularVelocityX[i] = 0;
            angularVelocityY[i] = 0;
            angularVelocityZ[i] = 0;
            color[i] = startColor[i];
        }
    }

    private consumeEvents (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext) {
        if (particles.particleEventSnapshotCount > 0) {
            const modules = this._activeModules;
            for (let i = 0, length = modules.length; i < length; i++) {
                modules[i].onEvent(particles, params, context);
            }
            particles.clearParticleEventSnapshots();
        }
    }

    private updateParticleState (particles: ParticleSOAData, fromIndex: number, toIndex: number, dt: number) {
        const { speedModifier, normalizedAliveTime, invStartLifeTime } = particles;
        for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
            particles.getFinalVelocityAt(velocity, particleHandle);
            particles.addPositionAt(Vec3.multiplyScalar(velocity, velocity, dt * speedModifier[particleHandle]), particleHandle);
            particles.getAngularVelocityAt(velocity, particleHandle);
            particles.addRotationAt(Vec3.multiplyScalar(velocity, velocity, dt), particleHandle);
            normalizedAliveTime[particleHandle] += dt * invStartLifeTime[particleHandle];
        }
    }

    private killParticlesOverMaxLifeTime (particles: ParticleSOAData, fromIndex: number, toIndex: number) {
        const { normalizedAliveTime } = particles;
        for (let i = toIndex - 1; i >= fromIndex; i--) {
            if (normalizedAliveTime[i] > 1) {
                particles.recordParticleEventSnapshot(i, RecordReason.DEATH);
                particles.removeParticle(i);
            }
        }
    }

    private startEmitParticles (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleEmitterContext, updateContext: ParticleUpdateContext,
        initialVelocity: Vec3, prevTime: number, currentTime: number, dt: number) {
        const timeInterval = 1 / context.emittingNumOverTime;
        context.emittingAccumulatedCount += context.emittingNumOverTime;
        const numOverTime = Math.floor(context.emittingAccumulatedCount);
        if (numOverTime > 0) {
            context.emittingAccumulatedCount -= numOverTime;
            this.initializeParticles(particles, params, context, updateContext, initialVelocity, prevTime, currentTime, dt, numOverTime, timeInterval, context.emittingAccumulatedCount);
        }
        const distanceInterval = 1 / context.emittingNumOverDistance;
        context.emittingAccumulatedCount += context.emittingNumOverDistance;
        const numOverDistance = Math.floor(context.emittingAccumulatedCount);
        if (numOverDistance > 0) {
            context.emittingAccumulatedCount -= numOverDistance;
            this.initializeParticles(particles, params, context, updateContext, initialVelocity, prevTime, currentTime, dt, numOverDistance, distanceInterval, context.emittingAccumulatedCount);
        }
        const burstCount = Math.floor(context.burstCount);
        if (burstCount > 0) {
            this.initializeParticles(particles, params, context, updateContext, initialVelocity, prevTime, currentTime, dt, burstCount, 0, 0);
        }
    }

    private initializeParticles (particles: ParticleSOAData, params: ParticleSystemParams, emitterContext: ParticleEmitterContext, updateContext: ParticleUpdateContext,
        initialVelocity: Vec3, prevTime: number, currentTime: number, dt: number, numToEmit: number, interval: number, frameOffset: number) {
        const updateModules = this.getPreUpdateModules();
        const postUpdateModules = this.getPostUpdateModules();
        const initializationModules = this.getInitializationModules();
        const { count: originCount, randomSeed } = particles;
        if (numToEmit + particles.count > params.capacity) {
            numToEmit = params.capacity - particles.count;
        }

        if (numToEmit > 0) {
            const fromIndex = particles.count;
            particles.addParticles(numToEmit);
            const toIndex = particles.count;
            const initialPosition = emitterContext.emitterTransform.getTranslation(tempPosition);
            const initialDir = Vec3.set(tempDir, emitterContext.emitterTransform.m02, emitterContext.emitterTransform.m06, emitterContext.emitterTransform.m10);
            for (let i = fromIndex; i < toIndex; i++) {
                randomSeed[i] = randomRangeInt(0, 233280);
                particles.setPositionAt(initialPosition, i);
                particles.setStartDirAt(initialDir, i);
            }
            if (!approx(interval, 0)) {
                let num = 0;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const offset = clamp01((frameOffset + num) * interval);
                    const subDt = dt * offset;
                    const normalizeT = lerp(currentTime, prevTime, offset);
                    const nextIndex = i + 1;
                    for (let j = 0, length = initializationModules.length; j < length; j++) {
                        initializationModules[j].update(particles, params, emitterContext, i, nextIndex, normalizeT);
                    }
                    Vec3.multiplyScalar(startPositionOffset, initialVelocity, -subDt);
                    particles.addPositionAt(startPositionOffset, i);
                    for (let j = 0, length = updateModules.length; j < length; j++) {
                        updateModules[j].update(particles, params, updateContext, i, nextIndex, subDt);
                    }
                    this.updateParticleState(particles, i, nextIndex, subDt);
                    for (let j = 0, length = postUpdateModules.length; j < length; j++) {
                        postUpdateModules[j].update(particles, params, updateContext, i, nextIndex, subDt);
                    }
                    num++;
                }
                this.killParticlesOverMaxLifeTime(particles, originCount, particles.count);
                this.consumeEvents(particles, params, updateContext);
            } else {
                for (let j = 0, length = initializationModules.length; j < length; j++) {
                    initializationModules[j].update(particles, params, emitterContext, fromIndex, toIndex, currentTime);
                }
            }
        }
    }
}
