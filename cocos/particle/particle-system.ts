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
import { Mat4, pseudoRandom, Quat, randomRangeInt, Vec2, Vec3 } from '../core/math';
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
import { CCBoolean, CCFloat, Component } from '../core';
import { INVALID_HANDLE, ParticleHandle, ParticleSOAData } from './particle-soa-data';
import { ParticleModule } from './particle-module';

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
     * @en Enable particle culling switch. Open it to enable particle culling. If enabled will generate emitter bounding box and emitters outside the frustum will be culled.
     * @zh 粒子剔除开关，如果打开将会生成一个发射器包围盒，包围盒在相机外发射器将被剔除。
     */
    @type(CCBoolean)
    @displayOrder(27)
    @tooltip('i18n:particle_system.renderCulling')
    set renderCulling (value: boolean) {
        this._renderCulling = value;
        if (value) {
            if (!this._boundingBox) {
                this._boundingBox = new AABB();
                this._calculateBounding(false);
            }
        }
    }

    get renderCulling () {
        return this._renderCulling;
    }
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

    /**
     * @en Particle bounding box half width.
     * @zh 粒子包围盒半宽。
     */
    @type(CCFloat)
    @displayOrder(17)
    @tooltip('i18n:particle_system.aabbHalfX')
    get aabbHalfX () {
        const res = this.getBoundingX();
        if (res) {
            return res;
        } else {
            return 0;
        }
    }

    set aabbHalfX (value: number) {
        this.setBoundingX(value);
    }

    /**
     * @en Particle bounding box half height.
     * @zh 粒子包围盒半高。
     */
    @type(CCFloat)
    @displayOrder(17)
    @tooltip('i18n:particle_system.aabbHalfY')
    get aabbHalfY () {
        const res = this.getBoundingY();
        if (res) {
            return res;
        } else {
            return 0;
        }
    }

    set aabbHalfY (value: number) {
        this.setBoundingY(value);
    }

    /**
     * @en Particle bounding box half depth.
     * @zh 粒子包围盒半深。
     */
    @type(CCFloat)
    @displayOrder(17)
    @tooltip('i18n:particle_system.aabbHalfZ')
    get aabbHalfZ () {
        const res = this.getBoundingZ();
        if (res) {
            return res;
        } else {
            return 0;
        }
    }

    set aabbHalfZ (value: number) {
        this.setBoundingZ(value);
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
    private _renderCulling = false;

    @serializable
    private _cullingMode = CullingMode.PAUSE;

    @serializable
    private _aabbHalfX = 0;
    @serializable
    private _aabbHalfY = 0;
    @serializable
    private _aabbHalfZ = 0;

    private _state = PlayingState.STOPPED;
    private _isEmitting = false;
    private _needRefresh = true;
    private _isCulled = false;
    private _isSimulating = true;

    private _time = 0;  // playback position in seconds.

    private _boundingBox: AABB | null = null;
    private _culler: ParticleCuller | null = null;
    private _oldPos: Vec3 | null = null;
    private _curPos: Vec3 | null = null;
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

        // if stop emit modify the refresh flag to true
        this._needRefresh = true;
    }

    /**
     * @en remove all particles from current particle system.
     * @zh 将所有粒子从粒子系统中清除。
     */
    public clear () {
        if (this.enabledInHierarchy) {
            this._particles.clear();
        }
        this._calculateBounding(false);
    }

    /**
     * @zh 获取当前粒子数量
     */
    public getParticleCount () {
        return this._particles.count;
    }

    protected onDestroy () {
        this.stop();
        if (this._culler) {
            this._culler.clear();
            this._culler.destroy();
            this._culler = null;
        }
    }

    protected onEnable () {
        if (this.playOnAwake && (!EDITOR || legacyCC.GAME_VIEW)) {
            this.play();
        }
    }
    protected onDisable () {
        if (this._boundingBox) {
            this._boundingBox = null;
        }
        if (this._culler) {
            this._culler.clear();
            this._culler.destroy();
            this._culler = null;
        }
    }

    private _calculateBounding (forceRefresh: boolean) {
        if (this._boundingBox) {
            if (!this._culler) {
                this._culler = new ParticleCuller(this);
            }
            this._culler.calculatePositions();
            AABB.fromPoints(this._boundingBox, this._culler.minPos, this._culler.maxPos);
            if (forceRefresh) {
                this.aabbHalfX = this._boundingBox.halfExtents.x;
                this.aabbHalfY = this._boundingBox.halfExtents.y;
                this.aabbHalfZ = this._boundingBox.halfExtents.z;
            } else {
                if (this.aabbHalfX) {
                    this.setBoundingX(this.aabbHalfX);
                } else {
                    this.aabbHalfX = this._boundingBox.halfExtents.x;
                }

                if (this.aabbHalfY) {
                    this.setBoundingY(this.aabbHalfY);
                } else {
                    this.aabbHalfY = this._boundingBox.halfExtents.y;
                }

                if (this.aabbHalfZ) {
                    this.setBoundingZ(this.aabbHalfZ);
                } else {
                    this.aabbHalfZ = this._boundingBox.halfExtents.z;
                }
            }
            this._culler.clear();
        }
    }

    public simulate (dt: number) {
        const scaledDeltaTime = dt * this.simulationSpeed;

        if (!this.renderCulling) {
            if (this._boundingBox) {
                this._boundingBox = null;
            }
            if (this._culler) {
                this._culler.clear();
                this._culler.destroy();
                this._culler = null;
            }
            this._isSimulating = true;
        } else {
            if (!this._boundingBox) {
                this._boundingBox = new AABB();
                this._calculateBounding(false);
            }

            if (!this._curPos) {
                this._curPos = new Vec3();
            }
            this.node.getWorldPosition(this._curPos);
            if (!this._oldPos) {
                this._oldPos = new Vec3();
                this._oldPos.set(this._curPos);
            }
            if (!this._curPos.equals(this._oldPos) && this._boundingBox && this._culler) {
                const dx = this._curPos.x - this._oldPos.x;
                const dy = this._curPos.y - this._oldPos.y;
                const dz = this._curPos.z - this._oldPos.z;
                const center = this._boundingBox.center;
                center.x += dx;
                center.y += dy;
                center.z += dz;
                this._culler.setBoundingBoxCenter(center.x, center.y, center.z);
                this._oldPos.set(this._curPos);
            }

            const cameraLst: Camera[]|undefined = this.node.scene.renderScene?.cameras;
            let culled = true;
            if (cameraLst !== undefined && this._boundingBox) {
                for (let i = 0; i < cameraLst.length; ++i) {
                    const camera:Camera = cameraLst[i];
                    const visibility = camera.visibility;
                    if ((visibility & this.node.layer) === this.node.layer) {
                        if (EDITOR && !legacyCC.GAME_VIEW) {
                            if (camera.name === 'Editor Camera' && intersect.aabbFrustum(this._boundingBox, camera.frustum)) {
                                culled = false;
                                break;
                            }
                        } else if (intersect.aabbFrustum(this._boundingBox, camera.frustum)) {
                            culled = false;
                            break;
                        }
                    }
                }
            }
            if (culled) {
                if (this._cullingMode !== CullingMode.AlwaysSimulate) {
                    this._isSimulating = false;
                }
                this._isCulled = true;
                if (this._cullingMode === CullingMode.PauseAndCatchup) {
                    this._time += scaledDeltaTime;
                }
                if (this._cullingMode !== CullingMode.AlwaysSimulate) {
                    return;
                }
            } else {
                this._isCulled = false;
                this._isSimulating = true;
            }

            if (!this._isSimulating) {
                return;
            }
        }

        if (this.isPlaying) {
            this._time += scaledDeltaTime;

            // simulation, update particles.
            if (this.updateParticles(scaledDeltaTime) === 0 && !this.isEmitting) {
                this.stop();
            }
        }
    }

    private emit (count: number, dt: number) {
        const loopDelta = (this._time % this.duration) / this.duration; // loop delta value

        // refresh particle node position to update emit position
        if (this._needRefresh) {
            // this.node.setPosition(this.node.getPosition());
            this.node.invalidateChildren(TransformBit.POSITION);

            this._needRefresh = false;
        }

        if (this._simulationSpace === Space.WORLD) {
            this.node.getWorldMatrix(_world_mat);
            this.node.getWorldRotation(_world_rol);
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
        particleUpdateContext.accumulatedTime += deltaTime;
        particleUpdateContext.deltaTime = deltaTime;
        particleUpdateContext.simulationSpace = this.simulationSpace;
        particleUpdateContext.worldTransform.set(this.node.worldMatrix);
        particleUpdateContext.worldRotation.set(this.node.worldRotation);

        const { normalizedAliveTime, invStartLifeTime, animatedVelocityX, animatedVelocityY, animatedVelocityZ } = this._particles;
        for (let i = 0, length = this._particles.count; i < length; ++i) {
            normalizedAliveTime[i] += deltaTime * invStartLifeTime[i];

            animatedVelocityX[i] = 0;
            animatedVelocityY[i] = 0;
            animatedVelocityZ[i] = 0;

            if (normalizedAliveTime[i] > 1) {
                this._particles.removeParticle(i);
                --i;
                continue;
            }
        }

        const startDelay = this.startDelay.evaluate(0, 1)!;
        if (this._time > startDelay) {
            if (this._time > (this.duration + startDelay)) {
                if (!this.loop) {
                    this._isEmitting = false;
                }
            }
        }
        particleUpdateContext.isEmitting = this._isEmitting;

        for (let i = 0, length = this._particles.count; i < length; ++i) {

        }

        Vec3.copy(p.ultimateVelocity, p.velocity);

        Vec3.scaleAndAdd(p.position, p.position, p.ultimateVelocity, dt); // apply velocity.

        return this._particles.count;
    }

    private getBoundingX () {
        return this._aabbHalfX;
    }

    private getBoundingY () {
        return this._aabbHalfY;
    }

    private getBoundingZ () {
        return this._aabbHalfZ;
    }

    private setBoundingX (value: number) {
        if (this._boundingBox && this._culler) {
            this._boundingBox.halfExtents.x = value;
            this._culler.setBoundingBoxSize(this._boundingBox.halfExtents);
            this._aabbHalfX = value;
        }
    }

    private setBoundingY (value: number) {
        if (this._boundingBox && this._culler) {
            this._boundingBox.halfExtents.y = value;
            this._culler.setBoundingBoxSize(this._boundingBox.halfExtents);
            this._aabbHalfY = value;
        }
    }

    private setBoundingZ (value: number) {
        if (this._boundingBox && this._culler) {
            this._boundingBox.halfExtents.z = value;
            this._culler.setBoundingBoxSize(this._boundingBox.halfExtents);
            this._aabbHalfZ = value;
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

    public getFreeParticle (): ParticleHandle {
        if (this._particles.count >= this.capacity) {
            return INVALID_HANDLE;
        }
        return this._particles.addParticle();
    }
}
