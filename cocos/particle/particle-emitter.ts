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
import { ColorModule } from './modules/color';
import { CurveRange, Mode } from './curve-range';
import { ForceOverLifetimeModule } from './modules/force';
import { LimitVelocityOverLifetimeModule } from './modules/limit-velocity';
import { RotationOverLifetimeModule } from './modules/rotation';
import { SizeOverLifetimeModule } from './modules/size';
import { TextureAnimationModule } from './modules/texture-animation';
import { VelocityOverLifetimeModule } from './modules/velocity-over-lifetime';
import { StartColorModule } from './modules/start-color';
import { StartSizeModule } from './modules/start-size';
import { StartSpeedModule } from './modules/start-speed';
import { StartLifeTimeModule } from './modules/start-life-time';
import { SpawnOverTimeModule } from './modules/spawn-over-time';
import { SpawnPerUnitModule } from './modules/spawn-per-unit';
import { GravityModule } from './modules/gravity';
import { SpeedModifierModule } from './modules/speed-modifier';
import { StartRotationModule } from './modules/start-rotation';
import { ShapeModule } from './modules/shape';
import { ParticleEmitterContext, ParticleEmitterParams, ParticleEmitterState, ParticleUpdateContext, PlayingState, SpawnEvent } from './particle-update-context';
import { CullingMode, Space } from './enum';
import { ParticleSystemRenderer } from './particle-system-renderer';
import { legacyCC } from '../core/global-exports';
import { TransformBit } from '../core/scene-graph/node-enum';
import { AABB, intersect } from '../core/geometry';
import { Camera, Model } from '../core/renderer/scene';
import { NoiseModule } from './modules/noise';
import { CCBoolean, CCFloat, CCInteger, Component, Enum, geometry, js } from '../core';
import { INVALID_HANDLE, ParticleHandle, ParticleSOAData, RecordReason } from './particle-soa-data';
import { ParticleModule, ParticleModuleStage, ModuleExecStage } from './particle-module';
import { particleSystemManager } from './particle-system-manager';
import { BurstModule } from './modules/burst';
import { EventReceiver } from './event-receiver';
import { LocationEventGeneratorModule } from './modules';

const startPositionOffset = new Vec3();
const tempPosition = new Vec3();
const tempDir = new Vec3();

@ccclass('cc.ParticleEmitter')
@help('i18n:cc.ParticleEmitter')
@menu('Effects/ParticleEmitter')
@executionOrder(99)
@requireComponent(ParticleSystemRenderer)
@executeInEditMode
export class ParticleEmitter extends Component {
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

    public get particles () {
        return this._particles;
    }

    public get renderer () {
        return this.getComponent(ParticleSystemRenderer);
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

    @type(ParticleModuleStage)
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
    private _ownerSystem: 
    private _params = new ParticleEmitterParams();
    private _boundingBoxHalfExtents = new Vec3();
    private _particles = new ParticleSOAData();
    private _updateContext = new ParticleUpdateContext();
    private _emitterContext = new ParticleEmitterContext();
    private _state = new ParticleEmitterState();

    /**
     * @en play particle system
     * @zh 播放粒子效果。
     */
    public play () {
        this._state.playingState = PlayingState.PLAYING;
        this._state.isEmitting = false;
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
        this._emitterStage.getOrAddModule(BurstModule);
        this._emitterStage.getOrAddModule(SpawnPerUnitModule);
        this._emitterStage.getOrAddModule(SpawnOverTimeModule);
        this._spawningStage.getOrAddModule(ShapeModule);
        this._spawningStage.getOrAddModule(StartColorModule);
        this._spawningStage.getOrAddModule(StartLifeTimeModule);
        this._spawningStage.getOrAddModule(StartRotationModule);
        this._spawningStage.getOrAddModule(StartSizeModule);
        this._spawningStage.getOrAddModule(StartSpeedModule);
        this._updateStage.getOrAddModule(ColorOverLifetimeModule);
        this._updateStage.getOrAddModule(ForceOverLifetimeModule);
        this._updateStage.getOrAddModule(GravityModule);
        this._updateStage.getOrAddModule(LimitVelocityOverLifetimeModule);
        this._updateStage.getOrAddModule(NoiseModule);
        this._updateStage.getOrAddModule(RotationOverLifetimeModule);
        this._updateStage.getOrAddModule(SizeOverLifetimeModule);
        this._updateStage.getOrAddModule(SpeedModifierModule);
        this._updateStage.getOrAddModule(TextureAnimationModule);
        this._updateStage.getOrAddModule(VelocityOverLifetimeModule);
        this._updateStage.getOrAddModule(LocationEventGeneratorModule);
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

    // spawn particle system as though it had already completed a full cycle.
    private _prewarmSystem () {
        this.startDelay.mode = Mode.Constant; // clear startDelay.
        this.startDelay.constant = 0;
        const dt = 1.0; // should use varying value?
        const cnt = this.duration / dt;

        for (let i = 0; i < cnt; ++i) {
            this.updateParticles(dt);
        }
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

        this._emitterStage.preTick(params, currentTime, currentTime - prevTime);
        this._spawningStage.preTick(params, currentTime, currentTime - prevTime);
        this._updateStage.preTick(params, currentTime, currentTime - prevTime);
        this._renderStage.preTick(params, currentTime, currentTime - prevTime);

        const particleCount = particles.count;
        if (particleCount > 0) {
            this.resetAnimatedState(particles, 0, particleCount);

            const updateModules = this._updateStage.modules;
            for (let i = 0, length = updateModules.length; i < length; i++) {
                const module = updateModules[i];
                if (module.enable) {
                    updateModules[i].update(particles, params, updateContext, 0, particles.count, deltaTime);
                }
            }
        }

        if (state.isEmitting) {
            this.startEmitParticles(particles, params, emitterContext, updateContext,
                params.simulationSpace === Space.WORLD ? emitterContext.velocity : Vec3.ZERO, prevTime, currentTime, currentTime - prevTime);
        }

        this.handleEvent();
    }

    private handleEvent () {
        for (let i = 0, length = this._eventReceivers.length; i < length; i++) {
            const eventReceiver = this._eventReceivers[i];
            const emitter = eventReceiver.target;
            if (emitter && emitter.isValid) {

            }
            if (this._params.simulationSpace === Space.LOCAL) {
                Mat4.multiply(context.emitterTransform, this._updateContext.worldToLocal, context.emitterTransform);
                Vec3.transformMat4(context.velocity, context.velocity, this._updateContext.worldToLocal);
            }
            this.startEmitParticles(this.particles, this._params, context, this._updateContext, context.velocity, prevTime, currentTime, dt);
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

    private startEmitParticles (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleEmitterContext, updateContext: ParticleUpdateContext,
        initialVelocity: Vec3, prevTime: number, currentTime: number, dt: number) {
        context.burstCount = context.emittingNumOverDistance = context.emittingNumOverTime = 0;
        this._emitterStage.emitterUpdate(this._particles, this._params, context, prevTime, currentTime);
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

    private initializeParticles (particles: ParticleSOAData, params: ParticleEmitterParams, emitterContext: ParticleEmitterContext, updateContext: ParticleUpdateContext,
        initialVelocity: Vec3, prevTime: number, currentTime: number, dt: number, numToEmit: number, interval: number, frameOffset: number) {
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
            this._spawningStage.spawn(particles, params, emitterContext, fromIndex, toIndex, currentTime);
            if (!approx(interval, 0)) {
                let num = 0;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const offset = clamp01((frameOffset + num) * interval);
                    const subDt = dt * offset;
                    const nextIndex = i + 1;
                    Vec3.multiplyScalar(startPositionOffset, initialVelocity, -subDt);
                    particles.addPositionAt(startPositionOffset, i);
                    // for (let j = 0, length = updateModules.length; j < length; j++) {
                    //     updateModules[j].update(particles, params, updateContext, i, nextIndex, subDt);
                    // }
                    num++;
                }
            }
        }
    }
}
