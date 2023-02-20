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
import { approx, clamp01, EPSILON, lerp, Mat4, pseudoRandom, Quat, randomRangeInt, Size, Vec2, Vec3 } from '../core/math';
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
import { ParticleSystemParams, ParticleUpdateContext, SpawnEvent } from './particle-update-context';
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
import { CompositionModule } from './modules/composition';
import { InitialModule } from './modules/initial-module';

const startPositionOffset = new Vec3();
const velocity = new Vec3();

enum PlayingState {
    STOPPED,
    PLAYING,
    PAUSED,
}
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
        return this._particleSystemParams.duration;
    }

    public set duration (val) {
        this._particleSystemParams.duration = val;
    }

    /**
     * @zh 粒子系统是否循环播放。
     */
    @tooltip('i18n:particle_system.loop')
    public get loop () {
        return this._particleSystemParams.loop;
    }

    public set loop (val) {
        this._particleSystemParams.loop = val;
    }

    /**
     * @zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）。
     */
    @tooltip('i18n:particle_system.prewarm')
    public get prewarm () {
        return this._particleSystemParams.prewarm;
    }

    public set prewarm (val) {
        this._particleSystemParams.prewarm = val;
    }

    /**
     * @zh 粒子系统开始运行后，延迟粒子发射的时间。
     */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startDelay')
    public get startDelay () {
        return this._particleSystemParams.startDelay;
    }

    public set startDelay (val) {
        this._particleSystemParams.startDelay = val;
    }

    /**
     * @zh 选择粒子系统所在的坐标系[[Space]]。<br>
     */
    @type(Enum(Space))
    @tooltip('i18n:particle_system.simulationSpace')
    public get simulationSpace () {
        return this._particleSystemParams.simulationSpace;
    }

    public set simulationSpace (val) {
        this._particleSystemParams.simulationSpace = val;
    }

    /**
     * @zh 控制整个粒子系统的更新速度。
     */
    @tooltip('i18n:particle_system.simulationSpeed')
    public get simulationSpeed () {
        return this._particleSystemParams.simulationSpeed;
    }

    public set simulationSpeed (val) {
        this._particleSystemParams.simulationSpeed = val;
    }

    @type(Enum(Space))
    @tooltip('i18n:particle_system.scaleSpace')
    public get scaleSpace () {
        return this._particleSystemParams.scaleSpace;
    }

    public set scaleSpace (val) {
        this._particleSystemParams.scaleSpace = val;
    }

    /**
     * @zh 粒子系统能生成的最大粒子数量。
     */
    @type(CCInteger)
    @range([0, Number.POSITIVE_INFINITY])
    @tooltip('i18n:particle_system.capacity')
    public get capacity () {
        return this._particleSystemParams.capacity;
    }

    public set capacity (val) {
        this._particleSystemParams.capacity = Math.floor(val > 0 ? val : 0);
    }

    /**
     * @zh 粒子系统加载后是否自动开始播放。
     */
    @tooltip('i18n:particle_system.playOnAwake')
    public get playOnAwake () {
        return this._particleSystemParams.playOnAwake;
    }

    public set playOnAwake (val) {
        this._particleSystemParams.playOnAwake = val;
    }

    /**
     * @en Particle culling mode option. Includes pause, pause and catchup, always simulate.
     * @zh 粒子剔除模式选择。包括暂停模拟，暂停以后快进继续以及不间断模拟。
     */
    @type(Enum(CullingMode))
    @tooltip('i18n:particle_system.cullingMode')
    get cullingMode () {
        return this._particleSystemParams.cullingMode;
    }

    set cullingMode (val) {
        this._particleSystemParams.cullingMode = val;
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
        return this._particleModules;
    }

    public get isPlaying () {
        return this._state === PlayingState.PLAYING;
    }

    public get isPaused () {
        return this._state === PlayingState.PAUSED;
    }

    public get isStopped () {
        return this._state === PlayingState.STOPPED;
    }

    public get isEmitting () {
        return this._isEmitting;
    }

    public get time () {
        return this._particleUpdateContext.accumulatedTime;
    }

    @serializable
    private _particleModules: ParticleModule[] = [];
    @serializable
    private _particleSystemParams = new ParticleSystemParams();
    private _boundingBoxHalfExtents = new Vec3();
    private _state = PlayingState.STOPPED;
    private _isEmitting = false;
    private _isSimulating = true;
    private _particles = new ParticleSOAData();
    private _particleUpdateContext = new ParticleUpdateContext();

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

    public dispatchSpawnEvent (event: SpawnEvent) {

    }

    /**
     * @en play particle system
     * @zh 播放粒子效果。
     */
    public play () {
        this._state = PlayingState.PLAYING;
        this._isEmitting = true;

        // prewarm
        if (this.prewarm) {
            this._prewarmSystem();
        }
        this._particleUpdateContext.currentPosition.set(this.node.worldPosition);
        this._particleUpdateContext.emitterDelayRemaining = this.startDelay.evaluate(0, 1);
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
        this._state = PlayingState.PAUSED;
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
        if (this.isPlaying || this.isPaused) {
            this.clear();
        }
        particleSystemManager.removeParticleSystem(this);
        this._isEmitting = false;
        this._state = PlayingState.STOPPED;
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
        this.getOrAddModule(InitialModule);
        this.getOrAddModule(CompositionModule);
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

        if (this.isPlaying && this._isSimulating) {
            // simulation, update particles.
            this.updateParticles(this._particles, this._particleSystemParams, this._particleUpdateContext, scaledDeltaTime);

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
                this._isSimulating = false;
            }
            if (this.cullingMode === CullingMode.PAUSE_AND_CATCHUP) {
                this._particleUpdateContext.accumulatedTime += scaledDeltaTime;
            }
        } else {
            this._isSimulating = true;
        }
    }

    // initialize particle system as though it had already completed a full cycle.
    private _prewarmSystem () {
        this.startDelay.mode = Mode.Constant; // clear startDelay.
        this.startDelay.constant = 0;
        const dt = 1.0; // should use varying value?
        const cnt = this.duration / dt;

        for (let i = 0; i < cnt; ++i) {
            this.updateParticles(this._particles, this._particleSystemParams, this._particleUpdateContext, dt);
        }
    }

    private getEmissionModules () {
        return this._particleModules.filter((module) => module.updateStage === ParticleUpdateStage.EMITTER_UPDATE) as EmissionModule[];
    }

    private getInitializationModules () {
        return this._particleModules.filter((module) => module.updateStage === ParticleUpdateStage.INITIALIZE) as InitializationModule[];
    }

    private getPreUpdateModules () {
        return this._particleModules.filter((module) => module.updateStage === ParticleUpdateStage.PRE_UPDATE) as UpdateModule[];
    }

    private getPostUpdateModules () {
        return this._particleModules.filter((module) => module.updateStage === ParticleUpdateStage.POST_UPDATE) as UpdateModule[];
    }

    // internal function
    private updateParticles (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext, deltaTime: number) {
        let emitterDeltaTime = deltaTime;
        context.accumulatedTime += deltaTime;
        context.lastPosition.set(context.currentPosition);
        context.currentPosition.set(this.node.worldPosition);
        context.localToWorld.set(this.node.worldMatrix);
        Vec3.subtract(context.emitterVelocity, context.currentPosition, context.lastPosition);
        Vec3.multiplyScalar(context.emitterVelocity, context.emitterVelocity, 1 / deltaTime);
        Quat.normalize(context.worldRotation, this.node.worldRotation);
        if (context.emitterDelayRemaining > 0) {
            context.emitterDelayRemaining -= emitterDeltaTime;
            emitterDeltaTime = 0;
            if (context.emitterDelayRemaining < 0) {
                emitterDeltaTime = Math.abs(context.emitterDelayRemaining);
                context.emitterDelayRemaining = 0;
            }
        }
        const prevT = context.emitterAccumulatedTime;
        context.emitterAccumulatedTime += emitterDeltaTime;
        particles.clearParticleSnapshots();
        const { normalizedAliveTime, animatedVelocityX, animatedVelocityY, animatedVelocityZ, angularVelocityX, angularVelocityY, angularVelocityZ, color, startColor } = particles;

        for (let i = 0; i < particles.count; i++) {
            animatedVelocityX[i] = 0;
            animatedVelocityY[i] = 0;
            animatedVelocityZ[i] = 0;
            angularVelocityX[i] = 0;
            angularVelocityY[i] = 0;
            angularVelocityZ[i] = 0;
            color[i] = startColor[i];
        }

        const updateModules = this.getPreUpdateModules();
        for (let i = 0, length = updateModules.length; i < length; i++) {
            if (updateModules[i].enable) {
                updateModules[i].update(particles, params, context, 0, particles.count, deltaTime);
            }
        }
        this.composite(particles, 0, particles.count, deltaTime);
        this.killParticlesOverMaxLifeTime(particles, 0, particles.count);
        const postUpdateModules = this.getPostUpdateModules();
        for (let i = 0, length = postUpdateModules.length; i < length; i++) {
            if (postUpdateModules[i].enable) {
                postUpdateModules[i].update(particles, params, context, 0, particles.count, deltaTime);
            }
        }

        if (this._isEmitting) {
            this.emit(particles, params, context, prevT, context.emitterAccumulatedTime, deltaTime);
        }
    }

    private composite (particles: ParticleSOAData, fromIndex: number, toIndex: number, dt: number) {
        const { speedModifier, normalizedAliveTime, invStartLifeTime } = particles;
        for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
            particles.getFinalVelocity(velocity, particleHandle);
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
                particles.recordParticleSnapshot(i, RecordReason.DEATH);
                particles.removeParticle(i);
            }
        }
    }

    private emit (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext, prevT: number, t: number, dt: number) {
        const emissionModules = this.getEmissionModules();
        const updateModules = this.getPreUpdateModules();
        const initializationModules = this.getInitializationModules();

        for (let i = 0, length = emissionModules.length; i < length; i++) {
            emissionModules[i].update(particles, params, context, prevT, t);
        }

        const { emissionState, emitterVelocity } = context;

        let newEmittingCount = Math.floor(emissionState.emittingOverTimeAccumulatedCount);
        emissionState.emittingOverTimeAccumulatedCount -= newEmittingCount;
        if (newEmittingCount + particles.count > params.capacity) {
            newEmittingCount = params.capacity - particles.count;
        }

        if (newEmittingCount > 0) {
            const fromIndex = particles.count;
            const toIndex = fromIndex + newEmittingCount;
            particles.addParticles(newEmittingCount);
            for (let i = fromIndex; i < toIndex; ++i) {
                const offset = clamp01((emissionState.emittingOverTimeAccumulatedCount + i) * emissionState.emittingOverTimeInterval);
                const subDt = dt * offset;
                const normalizeT = lerp(t, prevT, offset);
                const nextIndex = i + 1;
                for (let j = 0, length = initializationModules.length; j < length; j++) {
                    initializationModules[j].update(particles, params, context, i, nextIndex, normalizeT);
                }
                for (let j = 0, length = updateModules.length; j < length; j++) {
                    updateModules[j].update(particles, params, context, i, nextIndex, subDt);
                }
                this.composite(particles, i, nextIndex, subDt);
            }
            this.killParticlesOverMaxLifeTime(particles, fromIndex, toIndex);
        }

        newEmittingCount = Math.floor(emissionState.emittingOverDistanceAccumulatedCount);
        emissionState.emittingOverDistanceAccumulatedCount -= newEmittingCount;
        if (newEmittingCount + particles.count > params.capacity) {
            newEmittingCount = params.capacity - particles.count;
        }

        if (newEmittingCount > 0) {
            const fromIndex = particles.count;
            particles.addParticles(newEmittingCount);
            const toIndex = particles.count;
            for (let i = fromIndex; i < toIndex; ++i) {
                const offset = clamp01((emissionState.emittingOverDistanceAccumulatedCount + i) * emissionState.emittingOverDistanceInterval);
                const subDt = dt * offset;
                const normalizeT = lerp(t, prevT, offset);
                const nextIndex = i + 1;
                for (let j = 0, length = initializationModules.length; j < length; j++) {
                    initializationModules[j].update(particles, params, context, i, nextIndex, normalizeT);
                }
                Vec3.copy(startPositionOffset, emitterVelocity);
                Vec3.multiplyScalar(startPositionOffset, startPositionOffset, -subDt);
                particles.addPositionAt(startPositionOffset, i);
                for (let j = 0, length = updateModules.length; j < length; j++) {
                    updateModules[j].update(particles, params, context, i, nextIndex, subDt);
                }
            }
        }

        newEmittingCount = Math.floor(emissionState.burstCount);
        emissionState.burstCount = 0;
        if (newEmittingCount + particles.count > params.capacity) {
            newEmittingCount = params.capacity - particles.count;
        }

        if (newEmittingCount > 0) {
            const fromIndex = particles.count;
            const toIndex = fromIndex + newEmittingCount;
            particles.addParticles(newEmittingCount);
            for (let j = 0, length = initializationModules.length; j < length; j++) {
                initializationModules[j].update(particles, params, context, fromIndex, toIndex, t);
            }
            for (let j = 0, length = updateModules.length; j < length; j++) {
                updateModules[j].update(particles, params, context, fromIndex, toIndex, dt);
            }
        }
    }
}
