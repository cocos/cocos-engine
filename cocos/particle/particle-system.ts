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
import { approx, EPSILON, Mat4, pseudoRandom, Quat, randomRangeInt, Vec2, Vec3 } from '../core/math';
import { INT_MAX } from '../core/math/bits';
import { ColorOverLifetimeModule } from './modules/color-over-lifetime';
import { InitializationModule } from './modules/initialization';
import { CurveRange, Mode } from './curve-range';
import { ForceOverLifetimeModule } from './modules/force-over-lifetime';
import { LimitVelocityOverLifetimeModule } from './modules/limit-velocity-over-lifetime';
import { RotationOverLifetimeModule } from './modules/rotation-over-lifetime';
import { SizeOverLifetimeModule } from './modules/size-over-lifetime';
import { TextureAnimationModule } from './modules/texture-animation';
import { VelocityOverLifetimeModule } from './modules/velocity-over-lifetime';
import { EmissionModule } from './modules/emission';
import { ShapeModule } from './modules/shape-module';
import { ParticleUpdateContext } from './particle-update-context';
import { CullingMode, Space } from './enum';
import { particleEmitZAxis } from './particle-general-function';
import { ParticleSystemRenderer } from './particle-system-renderer';
import { TrailModule } from './modules/trail';
import { legacyCC } from '../core/global-exports';
import { TransformBit } from '../core/scene-graph/node-enum';
import { AABB, intersect } from '../core/geometry';
import { Camera } from '../core/renderer/scene';
import { ParticleCuller } from './particle-culler';
import { NoiseModule } from './modules/noise';
import { CCBoolean, CCFloat, Component, geometry } from '../core';
import { INVALID_HANDLE, ParticleHandle, ParticleSOAData } from './particle-soa-data';
import { ParticleModule, ParticleUpdateStage } from './particle-module';

const _world_mat = new Mat4();
const _world_rol = new Quat();

enum PlayingState {
    STOPPED,
    PLAYING,
    PAUSED,
}

@ccclass('cc.ParticleSystem')
@help('i18n:cc.ParticleSystem')
@menu('Effects/ParticleSystem')
@executionOrder(99)
//@requireComponent(ParticleSystemRenderer)
@executeInEditMode
export class ParticleSystem extends Component {
    public static CullingMode = CullingMode;
    /**
     * @zh 粒子系统能生成的最大粒子数量。
     */
    @range([0, Number.POSITIVE_INFINITY])
    @displayOrder(1)
    @tooltip('i18n:particle_system.capacity')
    public get capacity () {
        return this._capacity;
    }

    public set capacity (val) {
        this._capacity = Math.floor(val > 0 ? val : 0);
    }

    @type(Space)
    @serializable
    @displayOrder(9)
    @tooltip('i18n:particle_system.scaleSpace')
    public scaleSpace = Space.LOCAL;

    /**
     * @zh 粒子系统开始运行后，延迟粒子发射的时间。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(6)
    @tooltip('i18n:particle_system.startDelay')
    public startDelay = new CurveRange();

    /**
     * @zh 粒子系统运行时间。
     */
    @serializable
    @displayOrder(0)
    @tooltip('i18n:particle_system.duration')
    public duration = 5.0;

    /**
     * @zh 粒子系统是否循环播放。
     */
    @serializable
    @displayOrder(2)
    @tooltip('i18n:particle_system.loop')
    public loop = true;

    /**
     * @zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）。
     */
    @displayOrder(3)
    @tooltip('i18n:particle_system.prewarm')
    get prewarm () {
        return this._prewarm;
    }

    set prewarm (val) {
        this._prewarm = val;
    }

    /**
     * @zh 选择粒子系统所在的坐标系[[Space]]。<br>
     */
    @type(Space)
    @serializable
    @displayOrder(4)
    @tooltip('i18n:particle_system.simulationSpace')
    get simulationSpace () {
        return this._simulationSpace;
    }

    set simulationSpace (val) {
        this._simulationSpace = val;
    }

    /**
     * @zh 控制整个粒子系统的更新速度。
     */
    @serializable
    @displayOrder(5)
    @tooltip('i18n:particle_system.simulationSpeed')
    public simulationSpeed = 1.0;

    /**
     * @zh 粒子系统加载后是否自动开始播放。
     */
    @serializable
    @displayOrder(2)
    @tooltip('i18n:particle_system.playOnAwake')
    public playOnAwake = true;

    /**
     * @en Particle culling mode option. Includes pause, pause and catchup, always simulate.
     * @zh 粒子剔除模式选择。包括暂停模拟，暂停以后快进继续以及不间断模拟。
     */
    @type(CullingMode)
    @displayOrder(17)
    @tooltip('i18n:particle_system.cullingMode')
    get cullingMode () {
        return this._cullingMode;
    }

    set cullingMode (value: CullingMode) {
        this._cullingMode = value;
    }

    @type(Vec3)
    @displayOrder(17)
    @tooltip('i18n:particle_system.aabbHalfX')
    get boundingBoxHalfExtents (): Readonly<Vec3> {
        return this._boundingBoxHalfExtents;
    }

    set boundingBoxExtent (val) {
        this._boundingBoxHalfExtents.set(val);
    }

    @type(InitializationModule)
    public get initializationModule () {
        return this.getOrAddModule(InitializationModule);
    }

    @type(EmissionModule)
    public get emissionModule () {
        return this.getOrAddModule(EmissionModule);
    }

    /**
     * @zh 颜色控制模块。
     */
    @type(ColorOverLifetimeModule)
    @displayOrder(23)
    @tooltip('i18n:particle_system.colorOverLifetimeModule')
    public get colorOverLifetimeModule () {
        return this.getOrAddModule(ColorOverLifetimeModule);
    }

    /**
     * @zh 粒子发射器模块。
     */
    @type(ShapeModule)
    @displayOrder(17)
    @tooltip('i18n:particle_system.shapeModule')
    public get shapeModule () {
        return this.getOrAddModule(ShapeModule);
    }

    /**
     * @zh 粒子大小模块。
     */
    @type(SizeOverLifetimeModule)
    @displayOrder(21)
    @tooltip('i18n:particle_system.sizeOvertimeModule')
    public get sizeOverLifetimeModule () {
        return this.getOrAddModule(SizeOverLifetimeModule);
    }

    /**
     * @zh 粒子速度模块。
     */
    @type(VelocityOverLifetimeModule)
    @displayOrder(18)
    @tooltip('i18n:particle_system.velocityOvertimeModule')
    public get velocityOverLifetimeModule () {
        return this.getOrAddModule(VelocityOverLifetimeModule);
    }

    /**
     * @zh 粒子加速度模块。
     */
    @type(ForceOverLifetimeModule)
    @displayOrder(19)
    @tooltip('i18n:particle_system.forceOvertimeModule')
    public get forceOverLifetimeModule () {
        return this.getOrAddModule(ForceOverLifetimeModule);
    }

    /**
     * @zh 粒子限制速度模块（只支持 CPU 粒子）。
     */
    @type(LimitVelocityOverLifetimeModule)
    @displayOrder(20)
    @tooltip('i18n:particle_system.limitVelocityOvertimeModule')
    public get limitVelocityOverLifetimeModule () {
        return this.getOrAddModule(LimitVelocityOverLifetimeModule);
    }

    /**
     * @zh 粒子旋转模块。
     */
    @type(RotationOverLifetimeModule)
    @displayOrder(22)
    @tooltip('i18n:particle_system.rotationOvertimeModule')
    public get rotationOverLifetimeModule () {
        return this.getOrAddModule(RotationOverLifetimeModule);
    }

    /**
     * @zh 贴图动画模块。
     */
    @type(TextureAnimationModule)
    @displayOrder(24)
    @tooltip('i18n:particle_system.textureAnimationModule')
    public get textureAnimationModule () {
        return this.getOrAddModule(TextureAnimationModule);
    }

    @type(NoiseModule)
    @displayOrder(24)
    public get noiseModule () {
        return this.getOrAddModule(NoiseModule);
    }

    /**
     * @zh 粒子轨迹模块。
     */
    @type(TrailModule)
    @displayOrder(25)
    @tooltip('i18n:particle_system.trailModule')
    public get trailModule () {
        return this.getOrAddModule(TrailModule);
    }

    // @type(ParticleSystemRenderer)
    // @displayOrder(26)
    // @tooltip('i18n:particle_system.renderer')
    // public get renderer () {
    //     return this.getComponent(ParticleSystemRenderer) as ParticleSystemRenderer;
    // }

    @serializable
    private _particleModules: ParticleModule[] = [];

    @serializable
    private _cullingMode = CullingMode.ALWAYS_SIMULATE;

    @serializable
    private _boundingBoxHalfExtents = new Vec3();

    private _state = PlayingState.STOPPED;
    private _isEmitting = false;
    private _isSimulating = true;

    private _time = 0;  // playback position in seconds.
    private _particles = new ParticleSOAData();
    private _particleUpdateContext = new ParticleUpdateContext();

    @serializable
    private _prewarm = false;

    @serializable
    private _capacity = 100;

    @serializable
    private _simulationSpace = Space.LOCAL;

    /**
     * @zh 添加粒子模块
     */
    public addModule<T extends ParticleModule> (ModuleType: Constructor<T>): T {
        const newModule = new ModuleType();
        this._particleModules.push(newModule);
        this._particleModules.sort((moduleA, moduleB) => (moduleA.updateStage - moduleB.updateStage) || moduleA.name.localeCompare(moduleB.name));
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

    /**
     * @en play particle system
     * @zh 播放粒子效果。
     */
    public play () {
        this._state = PlayingState.PLAYING;
        this._isEmitting = true;

        // prewarm
        if (this._prewarm) {
            this._prewarmSystem();
        }

        this._particleUpdateContext.currentPosition.set(this.node.worldPosition);
        this._particleUpdateContext.emitterDelayRemaining = this._particleUpdateContext.emitterStartDelay = this.startDelay.evaluate(0, 1);
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
        this._isEmitting = false;
        this._time = 0.0;

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
            this._time += scaledDeltaTime;
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
            if (this._cullingMode !== CullingMode.ALWAYS_SIMULATE) {
                this._isSimulating = false;
            }
            if (this._cullingMode === CullingMode.PAUSE_AND_CATCHUP) {
                this._time += scaledDeltaTime;
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
            this._time += dt;
            this.updateParticles(dt);
        }
    }

    // internal function

    private updateParticles (deltaTime: number) {
        const particleUpdateContext = this._particleUpdateContext;
        const particles = this._particles;
        particleUpdateContext.accumulatedTime += deltaTime;
        particleUpdateContext.deltaTime = deltaTime;
        particleUpdateContext.emitterDeltaTime = this._isEmitting ? deltaTime : 0;
        particleUpdateContext.simulationSpace = this.simulationSpace;
        particleUpdateContext.newParticleIndexStart = particleUpdateContext.newParticleIndexStart = -1;
        particleUpdateContext.duration = this.duration;
        particleUpdateContext.lastPosition.set(particleUpdateContext.currentPosition);
        particleUpdateContext.currentPosition.set(this.node.worldPosition);
        particleUpdateContext.worldTransform.set(this.node.worldMatrix);
        particleUpdateContext.worldRotation.set(this.node.worldRotation);
        if (particleUpdateContext.emitterDelayRemaining > 0) {
            particleUpdateContext.emitterDelayRemaining -= particleUpdateContext.emitterDeltaTime;
            particleUpdateContext.emitterDeltaTime = 0;
            if (particleUpdateContext.emitterDelayRemaining < 0) {
                particleUpdateContext.emitterDeltaTime = Math.abs(particleUpdateContext.emitterDelayRemaining);
                particleUpdateContext.emitterDelayRemaining = 0;
            }
        }
        particleUpdateContext.emitterAccumulatedTime += particleUpdateContext.emitterDeltaTime;
        particleUpdateContext.normalizedTimeInCycle = ((particleUpdateContext.emitterAccumulatedTime - particleUpdateContext.emitterStartDelay)
            % this.duration) / this.duration;

        const { normalizedAliveTime, invStartLifeTime, animatedVelocityX, animatedVelocityY, animatedVelocityZ } = particles;
        for (let i = 0, length = particles.count; i < length; ++i) {
            normalizedAliveTime[i] += deltaTime * invStartLifeTime[i];

            animatedVelocityX[i] = 0;
            animatedVelocityY[i] = 0;
            animatedVelocityZ[i] = 0;

            if (normalizedAliveTime[i] > 1) {
                particles.removeParticle(i);
                --i;
                continue;
            }
        }

        let i = 0;
        const length = this._particleModules.length;
        for (; i < length; i++) {
            const module = this._particleModules[i];
            if (module.updateStage !== ParticleUpdateStage.EMITTER_UPDATE) {
                break;
            }
            if (module.enable) {
                module.update(particles, particleUpdateContext);
            }
        }

        let newEmittingCount = Math.floor(particleUpdateContext.emittingAccumulatedCount);
        particleUpdateContext.emittingAccumulatedCount -= newEmittingCount;
        if (newEmittingCount + particles.count > this.capacity) {
            newEmittingCount = this.capacity - particles.count;
        }

        if (newEmittingCount > 0) {
            particleUpdateContext.newParticleIndexStart = particles.addParticles(newEmittingCount);
            particleUpdateContext.newParticleIndexEnd = particleUpdateContext.newParticleIndexStart + newEmittingCount;
            if (this._simulationSpace === Space.WORLD) {
                for (let i = particleUpdateContext.newParticleIndexStart, end = particleUpdateContext.newParticleIndexEnd; i < end; ++i) {
                    particles.setPositionAt(this.node.worldPosition, i);
                }
            }
        }

        for (let stage = ParticleUpdateStage.INITIALIZE; stage < ParticleUpdateStage.POST_UPDATE; stage++) {
            for (; i < length; i++) {
                const module = this._particleModules[i];
                if (module.updateStage !== stage) {
                    break;
                }
                if (module.enable) {
                    module.update(particles, particleUpdateContext);
                }
            }
        }
        const velocity = new Vec3();
        const animatedVelocity = new Vec3();
        for (let particleHandle = 0; particleHandle < particles.count; particleHandle++) {
            particles.getVelocityAt(velocity, particleHandle);
            particles.getAnimatedVelocityAt(animatedVelocity, particleHandle);
            velocity.add(animatedVelocity);
            particles.addPositionAt(velocity.multiplyScalar(deltaTime), particleHandle);
        }

        for (; i < length; i++) {
            const module = this._particleModules[i];
            if (module.updateStage !== ParticleUpdateStage.POST_UPDATE) {
                break;
            }
            if (module.enable) {
                module.update(particles, particleUpdateContext);
            }
        }
    }

    get isPlaying () {
        return this._state === PlayingState.PLAYING;
    }

    get isPaused () {
        return this._state === PlayingState.PAUSED;
    }

    get isStopped () {
        return this._state === PlayingState.STOPPED;
    }

    get isEmitting () {
        return this._isEmitting;
    }

    get time () {
        return this._time;
    }
}
