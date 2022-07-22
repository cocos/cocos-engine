/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import { Mat4, pseudoRandom, Quat, randomRangeInt, Vec2, Vec3 } from '../../value-types';
import { INT_MAX } from '../../value-types/utils';
import Material from '../../assets/material/CCMaterial';
import ColorOverLifetimeModule from './animator/color-overtime';
import CurveRange, { Mode }from './animator/curve-range';
import ForceOvertimeModule from './animator/force-overtime';
import GradientRange from './animator/gradient-range';
import LimitVelocityOvertimeModule from './animator/limit-velocity-overtime';
import RotationOvertimeModule from './animator/rotation-overtime';
import SizeOvertimeModule from './animator/size-overtime';
import TextureAnimationModule from './animator/texture-animation';
import VelocityOvertimeModule from './animator/velocity-overtime';
import Burst from './burst';
import ShapeModule from './emitter/shape-module';
import { RenderMode, Space } from './enum';
import { particleEmitZAxis } from './particle-general-function';
import TrailModule from './renderer/trail';
import Mesh from '../../mesh/CCMesh';

const { ccclass, menu, property, executeInEditMode, executionOrder} = require('../../platform/CCClassDecorator')
const RenderComponent = require('../../components/CCRenderComponent');

const _world_mat = new Mat4();
const _module_props = CC_EDITOR && [
    "_colorOverLifetimeModule",
    "_shapeModule",
    "_sizeOvertimeModule",
    "_velocityOvertimeModule",
    "_forceOvertimeModule",
    "_limitVelocityOvertimeModule",
    "_rotationOvertimeModule",
    "_textureAnimationModule",
    "_trailModule"
]

/**
 * !#en The ParticleSystem3D Component.
 * !#zh 3D 粒子组件
 * @class ParticleSystem3D
 * @extends RenderComponent
 */
@ccclass('cc.ParticleSystem3D')
@menu('i18n:MAIN_MENU.component.renderers/ParticleSystem3D')
@executionOrder(99)
@executeInEditMode
export default class ParticleSystem3D extends RenderComponent {
    /**
     * !#en The run time of particle.
     * !#zh 粒子系统运行时间
     * @property {Number} duration
     */
    @property
    duration = 5.0;

    @property
    _capacity = 100;
    /**
     * !#en The maximum number of particles that a particle system can generate.
     * !#zh 粒子系统能生成的最大粒子数量
     * @property {Number} capacity
     */
    @property
    get capacity () {
        return this._capacity;
    }

    set capacity (val) {
        this._capacity = val;
        if (this._assembler) {
            this._assembler.setCapacity(this._capacity);
        }
    }

    /**
     * !#en Whether the particle system loops.
     * !#zh 粒子系统是否循环播放
     * @property {Boolean} loop
     */
    @property
    loop = true;

    /**
     * !#en Whether the particles start playing automatically after loaded.
     * !#zh 粒子系统加载后是否自动开始播放
     * @property {Boolean} playOnAwake
     */
    @property({
        animatable: false
    })
    playOnAwake = true;

    @property
    _prewarm = false;
    /**
     * !#en When selected, the particle system will start playing after one round has been played (only effective when loop is enabled).
     * !#zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）
     * @property {Boolean} prewarm
     */
    @property({
        animatable: false
    })
    get prewarm () {
        return this._prewarm;
    }

    set prewarm (val) {
        if (val === true && this.loop === false) {
            // console.warn('prewarm only works if loop is also enabled.');
        }
        this._prewarm = val;
    }

    @property
    _simulationSpace = Space.Local;
    /**
     * !#en The coordinate system in which the particle system is located.<br>
     * World coordinates (does not change when the position of other objects changes)<br>
     * Local coordinates (moving as the position of the parent node changes)<br>
     * Custom coordinates (moving with the position of a custom node)
     * !#zh 选择粒子系统所在的坐标系<br>
     * 世界坐标（不随其他物体位置改变而变换）<br>
     * 局部坐标（跟随父节点位置改变而移动）<br>
     * 自定坐标（跟随自定义节点的位置改变而移动）
     * @property {Space} simulationSpace
     */
    @property({
        type: Space,
        animatable: false
    })
    get simulationSpace () {
        return this._simulationSpace;
    }

    set simulationSpace (val) {
        if (val !== this._simulationSpace) {
            this._simulationSpace = val;
            if (this._assembler) {
                this._assembler._updateMaterialParams();
                this._assembler._updateTrailMaterial();
            }
        }
    }

    /**
     * !#en Controlling the update speed of the entire particle system.
     * !#zh 控制整个粒子系统的更新速度。
     * @property {Number} simulationSpeed
     */
    @property
    simulationSpeed = 1.0;

    /**
     * !#en Delay particle emission time after particle system starts running.
     * !#zh 粒子系统开始运行后，延迟粒子发射的时间。
     * @property {CurveRange} startDelay
     */
    @property({
        type: CurveRange,
    })
    startDelay = new CurveRange();

    /**
     * !#en Particle life cycle。
     * !#zh 粒子生命周期。
     * @property {CurveRange} startLifetime
     */
    @property({
        type: CurveRange,
    })
    startLifetime = new CurveRange();

    /**
     * !#en Particle initial color
     * !#zh 粒子初始颜色
     * @property {GradientRange} startColor
     */
    @property({
        type: GradientRange,
    })
    startColor = new GradientRange();

    /**
     * !#en Particle scale space
     * !#zh 缩放空间
     * @property {Space} scaleSpace
     */
    @property({
        type: Space,
    })
    scaleSpace = Space.Local;

    /**
     * !#en Initial particle size
     * !#zh 粒子初始大小
     * @property {CurveRange} startSize
     */
    @property({
        type: CurveRange,
    })
    startSize = new CurveRange();

    /**
     * !#en Initial particle speed
     * !#zh 粒子初始速度
     * @property {CurveRange} startSpeed
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    startSpeed = new CurveRange();

    /**
     * !#en Particle initial rotation angle
     * !#zh 粒子初始旋转角度
     * @property {CurveRange} startRotation
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
    })
    startRotation = new CurveRange();

    /**
     * !#en Gravity coefficient of particles affected by gravity
     * !#zh 粒子受重力影响的重力系数
     * @property {CurveRange} gravityModifier
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    gravityModifier = new CurveRange();

    // emission module
    /**
     * !#en Particles emitted per second
     * !#zh 每秒发射的粒子数
     * @property {CurveRange} rateOverTime
     */
    @property({
        type: CurveRange,
    })
    rateOverTime = new CurveRange();

    /**
     * !#en Number of particles emitted per unit distance moved
     * !#zh 每移动单位距离发射的粒子数
     * @property {CurveRange} rateOverDistance
     */
    @property({
        type: CurveRange,
    })
    rateOverDistance = new CurveRange();

    /**
     * !#en The number of Brusts that emit a specified number of particles at a specified time
     * !#zh 设定在指定时间发射指定数量的粒子的 Brust 的数量
     * @property {[Burst]} bursts
     */
    @property({
        type: [Burst],
        animatable: false
    })
    bursts = new Array();

    @property({
        type: [Material],
        displayName: 'Materials',
        visible: false,
        override: true,
    })
    get materials () {
        // if we don't create an array copy, the editor will modify the original array directly.
        return this._materials;
    }

    set materials (val) {
        this._materials = val;
        this._activateMaterial();
    }

    @property
    // shpae module
    _shapeModule = new ShapeModule();
    /**
     * !#en Particle emitter module
     * !#zh 粒子发射器模块
     * @property {ShapeModule} shapeModule
     */
    @property({
        type: ShapeModule,
        animatable: false
    })
    get shapeModule () {
        return this._shapeModule;
    }
    set shapeModule (val) {
        this._shapeModule = val;
        this._shapeModule.onInit(this);
    }

    @property
    // color over lifetime module
    _colorOverLifetimeModule = new ColorOverLifetimeModule();
    /**
     * !#en Color control module
     * !#zh 颜色控制模块
     * @property {ColorOverLifetimeModule} colorOverLifetimeModule
     */
    @property({
        type: ColorOverLifetimeModule,
        animatable: false
    })
    get colorOverLifetimeModule () {
        return this._colorOverLifetimeModule;
    }
    set colorOverLifetimeModule (val) {
        this._colorOverLifetimeModule = val;
    }

    @property
    // size over lifetime module
    _sizeOvertimeModule = new SizeOvertimeModule();
    /**
     * !#en Particle size module
     * !#zh 粒子大小模块
     * @property {SizeOvertimeModule} sizeOvertimeModule
     */
    @property({
        type: SizeOvertimeModule,
        animatable: false
    })
    get sizeOvertimeModule () {
        return this._sizeOvertimeModule;
    }
    set sizeOvertimeModule (val) {
        this._sizeOvertimeModule = val;
    }

    @property
    _velocityOvertimeModule = new VelocityOvertimeModule();
    /**
     * !#en Particle speed module
     * !#zh 粒子速度模块
     * @property {VelocityOvertimeModule} velocityOvertimeModule
     */
    @property({
        type: VelocityOvertimeModule,
        animatable: false
    })
    get velocityOvertimeModule () {
        return this._velocityOvertimeModule;
    }

    set velocityOvertimeModule (val) {
        this._velocityOvertimeModule = val;
    }

    @property
    _forceOvertimeModule = new ForceOvertimeModule();
    /**
     * !#en Particle acceleration module
     * !#zh 粒子加速度模块
     * @property {ForceOvertimeModule} forceOvertimeModule
     */
    @property({
        type: ForceOvertimeModule,
        animatable: false
    })
    get forceOvertimeModule () {
        return this._forceOvertimeModule;
    }
    set forceOvertimeModule (val) {
        this._forceOvertimeModule = val;
    }

    @property
    _limitVelocityOvertimeModule = new LimitVelocityOvertimeModule();
    /**
     * !#en Particle limit speed module (only CPU particles are supported)
     * !#zh 粒子限制速度模块（只支持 CPU 粒子）
     * @property {LimitVelocityOvertimeModule} limitVelocityOvertimeModule
     */
    @property({
        type: LimitVelocityOvertimeModule,
        animatable: false
    })
    get limitVelocityOvertimeModule () {
        return this._limitVelocityOvertimeModule;
    }
    set limitVelocityOvertimeModule (val) {
        this._limitVelocityOvertimeModule = val;
    }

    @property
    _rotationOvertimeModule = new RotationOvertimeModule();
    /**
     * !#en Particle rotation module
     * !#zh 粒子旋转模块
     * @property {RotationOvertimeModule} rotationOvertimeModule
     */
    @property({
        type: RotationOvertimeModule,
        animatable: false
    })
    get rotationOvertimeModule () {
        return this._rotationOvertimeModule;
    }
    set rotationOvertimeModule (val) {
        this._rotationOvertimeModule = val;
    }

    @property
    _textureAnimationModule = new TextureAnimationModule();
    /**
     * !#en Texture Animation Module
     * !#zh 贴图动画模块
     * @property {TextureAnimationModule} textureAnimationModule
     */
    @property({
        type: TextureAnimationModule,
        animatable: false
    })
    get textureAnimationModule () {
        return this._textureAnimationModule;
    }
    set textureAnimationModule (val) {
        this._textureAnimationModule = val;
        this._textureAnimationModule.onInit(this);
    }

    @property
    _trailModule = new TrailModule();
    /**
     * !#en Particle Trajectory Module
     * !#zh 粒子轨迹模块
     * @property {TrailModule} trailModule
     */
    @property({
        type: TrailModule,
        animatable: false
    })
    get trailModule () {
        return this._trailModule;
    }
    set trailModule (val) {
        this._trailModule = val;
        this._trailModule.onInit(this);
    }

    @property
    _renderMode = RenderMode.Billboard;

    /**
     * !#en Particle generation mode
     * !#zh 设定粒子生成模式
     * @property {RenderMode} renderMode
     */
    @property({
        type: RenderMode,
        animatable: false
    })
    get renderMode () {
        return this._renderMode;
    }

    set renderMode (val) {
        if (this._renderMode === val) {
            return;
        }
        this._renderMode = val;
        if (this._assembler) {
            this._assembler._setVertexAttrib();
            this._assembler._updateModel();
            this._assembler._updateMaterialParams();
        }
    }

    @property
    _velocityScale = 1;

    /**
     * !#en When the particle generation mode is StrecthedBillboard, in the direction of movement of the particles is stretched by velocity magnitude
     * !#zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸
     * @property {Number} velocityScale
     */
    @property({
        animatable: false
    })
    get velocityScale () {
        return this._velocityScale;
    }

    set velocityScale (val) {
        this._velocityScale = val;
        this._assembler && this._assembler._updateMaterialParams();
    }

    @property
    _lengthScale = 1;
    /**
     * !#en When the particle generation method is StrecthedBillboard, the particles are stretched according to the particle size in the direction of motion
     * !#zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸
     * @property {Number} lengthScale
     */
    @property({
        animatable: false
    })
    get lengthScale () {
        return this._lengthScale;
    }

    set lengthScale (val) {
        this._lengthScale = val;
        this._assembler && this._assembler._updateMaterialParams();
    }

    @property
    _mesh = null;

    /**
     * !#en Particle model
     * !#zh 粒子模型
     * @property {Mesh} mesh
     */
    @property({
        type: Mesh,
        animatable: false
    })
    get mesh () {
        return this._mesh;
    }

    set mesh (val) {
        this._mesh = val;
        this._assembler && this._assembler._updateModel();
    }

    /**
     * !#en Particle material
     * !#zh 粒子材质
     * @property {Material} particleMaterial
     */
    @property({
        type: Material,
        animatable: false
    })
    get particleMaterial () {
        return this.getMaterial(0);
    }

    set particleMaterial (val) {
        this.setMaterial(0, val);
        this._onMaterialModified(0, val);
    }
    
    /**
     * !#en Particle trail material
     * !#zh 粒子轨迹材质
     * @property {Material} trailMaterial
     */
    @property({
        type: Material,
        animatable: false
    })
    get trailMaterial () {
        return this.getMaterial(1);
    }

    set trailMaterial (val) {
        this.setMaterial(1, val);
        this._onMaterialModified(1, val);
    }

    _isPlaying;
    _isPaused;
    _isStopped;
    _isEmitting;
    _time;  // playback position in seconds.
    _emitRateTimeCounter;
    _emitRateDistanceCounter;
    _oldWPos;
    _curWPos;
    _customData1;
    _customData2;
    _subEmitters; // array of { emitter: ParticleSystem3D, type: 'birth', 'collision' or 'death'}

    constructor () {
        super();

        this.rateOverTime.constant = 10;
        this.startLifetime.constant = 5;
        this.startSize.constant = 1;
        this.startSpeed.constant = 5;

        // internal status
        this._isPlaying = false;
        this._isPaused = false;
        this._isStopped = true;
        this._isEmitting = false;

        this._time = 0.0;  // playback position in seconds.
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
        this._oldWPos = new Vec3(0, 0, 0);
        this._curWPos = new Vec3(0, 0, 0);

        this._customData1 = new Vec2(0, 0);
        this._customData2 = new Vec2(0, 0);

        this._subEmitters = []; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}
    }

    onLoad () {
        this._assembler.onInit(this);
        this.shapeModule.onInit(this);
        this.trailModule.onInit(this);
        this.textureAnimationModule.onInit(this);

        this._resetPosition();

        // this._system.add(this);
    }

    _onMaterialModified (index, material) {
        this._assembler && this._assembler._onMaterialModified(index, material);
    }

    _onRebuildPSO (index, material) {
        this._assembler && this._assembler._onRebuildPSO(index, material);
    }

    // TODO: fastforward current particle system by simulating particles over given period of time, then pause it.
    // simulate(time, withChildren, restart, fixedTimeStep) {

    // }

    /**
     * !#en Playing particle effects
     * !#zh 播放粒子效果
     * @method play
     */
    play () {
        if (this._isPaused) {
            this._isPaused = false;
        }
        if (this._isStopped) {
            this._isStopped = false;
        }

        this._isPlaying = true;
        this._isEmitting = true;

        this._resetPosition();

        // prewarm
        if (this._prewarm) {
            this._prewarmSystem();
        }
    }

    /**
     * !#en Pause particle effect
     * !#zh 暂停播放粒子效果
     * @method pause
     */
    pause () {
        if (this._isStopped) {
            console.warn('pause(): particle system is already stopped.');
            return;
        }
        if (this._isPlaying) {
            this._isPlaying = false;
        }

        this._isPaused = true;
    }

    /**
     * !#en Stop particle effect
     * !#zh 停止播放粒子效果
     * @method stop
     */
    stop () {
        if (this._isPlaying || this._isPaused) {
            this.clear();
        }
        if (this._isPlaying) {
            this._isPlaying = false;
        }
        if (this._isPaused) {
            this._isPaused = false;
        }

        this._time = 0.0;
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;

        this._isStopped = true;
    }

    // remove all particles from current particle system.
    /**
     * !#en Remove all particle effect
     * !#zh 将所有粒子从粒子系统中清除
     * @method clear
     */
    clear () {
        if (this.enabledInHierarchy) {
            this._assembler && this._assembler.clear();
            this.trailModule.clear();
        }
    }

    getParticleCount () {
        return this._assembler ? this._assembler.getParticleCount() : 0;
    }

    setCustomData1 (x, y) {
        Vec2.set(this._customData1, x, y);
    }

    setCustomData2 (x, y) {
        Vec2.set(this._customData2, x, y);
    }

    onDestroy () {
        // this._system.remove(this);
        this._assembler.onDestroy();
        this.trailModule.destroy();
    }

    onEnable () {
        super.onEnable();
        if (this.playOnAwake) {
            this.play();
        }
        this._assembler.onEnable();
        this.trailModule.onEnable();
    }

    onDisable () {
        super.onDisable();
        this._assembler.onDisable();
        this.trailModule.onDisable();
    }

    update (dt) {
        const scaledDeltaTime = dt * this.simulationSpeed;
        if (this._isPlaying) {
            this._time += scaledDeltaTime;

            // excute emission
            this._emit(scaledDeltaTime);

            // simulation, update particles.
            if (this._assembler._updateParticles(scaledDeltaTime) === 0 && !this._isEmitting) {
                this.stop();
            }

            // update render data
            this._assembler.updateParticleBuffer();

            // update trail
            if (this.trailModule.enable) {
                this.trailModule.updateTrailBuffer();
            }
        }
    }

    emit (count, dt) {
        if (!this._assembler) {
            return;
        }

        if (this._simulationSpace === Space.World) {
            this.node.getWorldMatrix(_world_mat);
        }

        for (let i = 0; i < count; ++i) {
            const particle = this._assembler._getFreeParticle();
            if (particle === null) {
                return;
            }
            const rand = pseudoRandom(randomRangeInt(0, INT_MAX));

            if (this.shapeModule.enable) {
                this.shapeModule.emit(particle);
            }
            else {
                Vec3.set(particle.position, 0, 0, 0);
                Vec3.copy(particle.velocity, particleEmitZAxis);
            }

            if (this.textureAnimationModule.enable) {
                this.textureAnimationModule.init(particle);
            }

            Vec3.scale(particle.velocity, particle.velocity, this.startSpeed.evaluate(this._time / this.duration, rand));

            switch (this._simulationSpace) {
                case Space.Local:
                    break;
                case Space.World:
                    Vec3.transformMat4(particle.position, particle.position, _world_mat);
                    const worldRot = new Quat();
                    this.node.getWorldRotation(worldRot);
                    Vec3.transformQuat(particle.velocity, particle.velocity, worldRot);
                    break;
                case Space.Custom:
                    // TODO:
                    break;
            }
            Vec3.copy(particle.ultimateVelocity, particle.velocity);
            // apply startRotation. now 2D only.
            Vec3.set(particle.rotation, 0, 0, this.startRotation.evaluate(this._time / this.duration, rand));

            // apply startSize. now 2D only.
            Vec3.set(particle.startSize, this.startSize.evaluate(this._time / this.duration, rand), 1, 1);
            particle.startSize.y = particle.startSize.x;
            Vec3.copy(particle.size, particle.startSize);

            // apply startColor.
            particle.startColor.set(this.startColor.evaluate(this._time / this.duration, rand));
            particle.color.set(particle.startColor);

            // apply startLifetime.
            particle.startLifetime = this.startLifetime.evaluate(this._time / this.duration, rand) + dt;
            particle.remainingLifetime = particle.startLifetime;

            particle.randomSeed = randomRangeInt(0, 233280);

            this._assembler._setNewParticle(particle);

        } // end of particles forLoop.
    }

    // initialize particle system as though it had already completed a full cycle.
    _prewarmSystem () {
        this.startDelay.mode = Mode.Constant; // clear startDelay.
        this.startDelay.constant = 0;
        const dt = 1.0; // should use varying value?
        const cnt = this.duration / dt;
        for (let i = 0; i < cnt; ++i) {
            this._time += dt;
            this._emit(dt);
            this._assembler && this._assembler._updateParticles(dt);
        }
    }

    // internal function
    _emit (dt) {
        // emit particles.
        const startDelay = this.startDelay.evaluate(0, 1);
        if (this._time > startDelay) {
            if (this._time > (this.duration + startDelay)) {
                // this._time = startDelay; // delay will not be applied from the second loop.(Unity)
                // this._emitRateTimeCounter = 0.0;
                // this._emitRateDistanceCounter = 0.0;
                if (!this.loop) {
                    this._isEmitting = false;
                    return;
                }
            }

            // emit by rateOverTime
            this._emitRateTimeCounter += this.rateOverTime.evaluate(this._time / this.duration, 1) * dt;
            if (this._emitRateTimeCounter > 1 && this._isEmitting) {
                const emitNum = Math.floor(this._emitRateTimeCounter);
                this._emitRateTimeCounter -= emitNum;
                this.emit(emitNum, dt);
            }
            // emit by rateOverDistance
            this.node.getWorldPosition(this._curWPos);
            const distance = Vec3.distance(this._curWPos, this._oldWPos);
            Vec3.copy(this._oldWPos, this._curWPos);
            this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(this._time / this.duration, 1);
            if (this._emitRateDistanceCounter > 1 && this._isEmitting) {
                const emitNum = Math.floor(this._emitRateDistanceCounter);
                this._emitRateDistanceCounter -= emitNum;
                this.emit(emitNum, dt);
            }

            // bursts
            for (const burst of this.bursts) {
                burst.update(this, dt);
            }
        }
    }

    _activateMaterial () {
        
    }

    _resetPosition () {
        this.node.getWorldPosition(this._oldWPos);
        Vec3.copy(this._curWPos, this._oldWPos);
    }

    addSubEmitter (subEmitter) {
        this._subEmitters.push(subEmitter);
    }

    removeSubEmitter (idx) {
        this._subEmitters.splice(this._subEmitters.indexOf(idx), 1);
    }

    addBurst (burst) {
        this.bursts.push(burst);
    }

    removeBurst (idx) {
        this.bursts.splice(this.bursts.indexOf(idx), 1);
    }

    _checkBacth () {
        
    }

    get isPlaying () {
        return this._isPlaying;
    }

    get isPaused () {
        return this._isPaused;
    }

    get isStopped () {
        return this._isStopped;
    }

    get isEmitting () {
        return this._isEmitting;
    }

    get time () {
        return this._time;
    }
}

CC_EDITOR && (ParticleSystem3D.prototype._onBeforeSerialize = function(props){return props.filter(p => !_module_props.includes(p) || this[p].enable);});

cc.ParticleSystem3D = ParticleSystem3D;
