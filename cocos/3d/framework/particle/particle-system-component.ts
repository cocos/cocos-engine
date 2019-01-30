// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// tslint:disable: max-line-length

import { Component } from '../../../components/component';
import { vec3, vec2, mat4, quat, randomRangeInt, pseudoRandom } from '../../../core/vmath';
import CurveRange from './animator/curve-range';
import GradientRange from './animator/gradient-range';
import ParticleSystemRenderer from './renderer/particle-system-renderer';
import SizeOvertimeModule from './animator/size-overtime';
import ColorOverLifetimeModule from './animator/color-overtime';
import VelocityOvertimeModule from './animator/velocity-overtime';
import ForceOvertimeModule from './animator/force-overtime';
import LimitVelocityOvertimeModule from './animator/limit-velocity-overtime';
import RotationOvertimeModule from './animator/rotation-overtime';
import TextureAnimationModule from './animator/texture-animation';
import ShapeModule from './emitter/shape-module';
import Burst from './burst';
import { particleEmitZAxis, Space } from './particle-general-function';
import { INT_MAX } from '../../../core/vmath/bits';
import { ccclass, executionOrder, executeInEditMode, property, requireComponent, menu } from '../../../core/data/class-decorator';

const _world_mat = mat4.create();

@ccclass('cc.ParticleSystemComponent')
@menu('Components/ParticleSystemComponent')
@requireComponent(ParticleSystemRenderer)
@executionOrder(99)
@executeInEditMode
export default class ParticleSystemComponent extends Component {

    @property
    public capacity = 2000;

    @property({
        type: GradientRange,
    })
    public startColor = new GradientRange();

    @property({
        type: CurveRange,
    })
    public startSize = new CurveRange();

    @property({
        type: CurveRange,
    })
    public startSpeed = new CurveRange();

    @property({
        type: CurveRange,
    })
    public startRotation = new CurveRange();

    @property({
        type: CurveRange,
    })
    public startDelay = new CurveRange();

    @property({
        type: CurveRange,
    })
    public startLifetime = new CurveRange();

    @property
    public duration = 5.0;

    @property
    public loop = true;

    @property
    private _prewarm = false;

    @property
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
    private _simulationSpace = Space.Local;

    @property({
        type: Space,
    })
    get simulationSpace () {
        return this._simulationSpace;
    }

    set simulationSpace (val) {
        if (val !== this._simulationSpace) {
            this._simulationSpace = val;
            this.renderer!._updateMaterialParams();
        }
    }

    @property
    public simulationSpeed = 1.0;

    @property
    public playOnAwake = true;

    @property({
        type: CurveRange,
    })
    public gravityModifier = new CurveRange();

    // emission module
    @property({
        type: CurveRange,
    })
    public rateOverTime = new CurveRange();

    @property({
        type: CurveRange,
    })
    public rateOverDistance = new CurveRange();

    @property({
        type: [Burst],
    })
    public bursts = new Array();

    // color over lifetime module
    @property({
        type: ColorOverLifetimeModule,
    })
    public colorOverLifetimeModule = new ColorOverLifetimeModule();

    // shpae module
    @property({
        type: ShapeModule,
    })
    public shapeModule = new ShapeModule();

    // size over lifetime module
    @property({
        type: SizeOvertimeModule,
    })
    public sizeOvertimeModule = new SizeOvertimeModule();

    @property({
        type: VelocityOvertimeModule,
    })
    public velocityOvertimeModule = new VelocityOvertimeModule();

    @property({
        type: ForceOvertimeModule,
    })
    public forceOvertimeModule = new ForceOvertimeModule();

    @property({
        type: LimitVelocityOvertimeModule,
    })
    public limitVelocityOvertimeModule = new LimitVelocityOvertimeModule();

    @property({
        type: RotationOvertimeModule,
    })
    public rotationOvertimeModule = new RotationOvertimeModule();

    @property({
        type: TextureAnimationModule,
    })
    public textureAnimationModule = new TextureAnimationModule();

    // particle system renderer
    private renderer: ParticleSystemRenderer | null;
    private _isPlaying: boolean;
    private _isPaused: boolean;
    private _isStopped: boolean;
    private _isEmitting: boolean;

    private _time: number;  // playback position in seconds.
    private _emitRateTimeCounter: number;
    private _emitRateDistanceCounter: number;
    private _oldWPos: vec3;
    private _curWPos: vec3;

    private _customData1: vec2;
    private _customData2: vec2;

    private _subEmitters: any[]; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}

    constructor () {
        super();

        this.rateOverTime.constant = 10;
        this.startLifetime.constant = 5;
        this.startSize.constant = 1;
        this.startSpeed.constant = 1;

        // internal status
        this._isPlaying = false;
        this._isPaused = false;
        this._isStopped = true;
        this._isEmitting = false;

        this._time = 0.0;  // playback position in seconds.
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
        this._oldWPos = vec3.create(0, 0, 0);
        this._curWPos = vec3.create(0, 0, 0);

        this._customData1 = vec2.create(0, 0);
        this._customData2 = vec2.create(0, 0);

        this._subEmitters = []; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}
        this.renderer = null;
    }

    private onLoad () {
        // HACK, TODO
        this.renderer = this.getComponent(ParticleSystemRenderer);
        this.renderer.onInit();
        this.shapeModule.onInit(this);
        this.textureAnimationModule.onInit(this);

        this.node.getWorldPosition(this._oldWPos);
        vec3.copy(this._curWPos, this._oldWPos);

        // this._system.add(this);
    }

    private onDestroy () {
        // this._system.remove(this);
    }

    private onEnable () {
        if (this.playOnAwake) {
            this.play();
        }
    }

    private onDisable () {

    }

    // TODO: fastforward current particle system by simulating particles over given period of time, then pause it.
    // simulate(time, withChildren, restart, fixedTimeStep) {

    // }

    public play () {
        if (this._isPaused) {
            this._isPaused = false;
        }
        if (this._isStopped) {
            this._isStopped = false;
        }

        this._time = 0.0;
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;

        this._isPlaying = true;

        // prewarm
        if (this._prewarm) {
            this._prewarmSystem();
        }
    }

    public pause () {
        if (this._isStopped) {
            console.warn('pause(): particle system is already stopped.');
            return;
        }
        if (this._isPlaying) {
            this._isPlaying = false;
        }

        this._isPaused = true;
    }

    public stop () {
        if (this._isPlaying) {
            this._isPlaying = false;
        }
        if (this._isPaused) {
            this._isPaused = false;
        }

        this.clear();
        this._time = 0.0;
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;

        this._isStopped = true;
    }

    // remove all particles from current particle system.
    public clear () {
        this.renderer!.clear();
    }

    private emit (count, emitParams = null) {
        if (emitParams !== null) {
            // TODO:
        }

        for (let i = 0; i < count; ++i) {
            const particle = this.renderer!._getFreeParticle();
            if (particle === null) {
                return;
            }
            const rand = pseudoRandom(randomRangeInt(0, INT_MAX));

            if (this.shapeModule.enable) {
                this.shapeModule.emit(particle);
            }
            else {
                vec3.set(particle.position, 0, 0, 0);
                vec3.copy(particle.velocity, particleEmitZAxis);
            }

            vec3.scale(particle.velocity, particle.velocity, this.startSpeed.evaluate(this._time / this.duration, rand)!);

            switch (this._simulationSpace) {
                case Space.Local:
                    break;
                case Space.World:
                    this.node.getWorldMatrix(_world_mat);
                    vec3.transformMat4(particle.position, particle.position, _world_mat);
                    const worldRot = quat.create();
                    this.node.getWorldRotation(worldRot);
                    vec3.transformQuat(particle.velocity, particle.velocity, worldRot);
                    break;
                case Space.Custom:
                    // TODO:
                    break;
            }
            // apply startRotation. now 2D only.
            vec3.set(particle.rotation, this.startRotation.evaluate(this._time / this.duration, rand)!, 0, 0);

            // apply startSize. now 2D only.
            vec3.set(particle.startSize, this.startSize.evaluate(this._time / this.duration, rand)!, 0, 0);
            vec3.copy(particle.size, particle.startSize);

            // apply startColor.
            particle.startColor.set(this.startColor.evaluate(this._time / this.duration, rand));
            particle.startColor.to01(particle.startColor01);
            particle.color.set(particle.startColor);

            // apply startLifetime.
            particle.startLifetime = this.startLifetime.evaluate(this._time / this.duration, rand)!;
            particle.remainingLifetime = particle.startLifetime;

            particle.randomSeed = randomRangeInt(0, 233280);

            this.renderer!._setNewParticle(particle);

        } // end of particles forLoop.
    }

    // initialize particle system as though it had already completed a full cycle.
    private _prewarmSystem () {
        this.startDelay.mode = 'constant'; // clear startDelay.
        this.startDelay.constant = 0;
        const dt = 1.0; // should use varying value?
        const cnt = this.duration / dt;
        for (let i = 0; i < cnt; ++i) {
            this._time += dt;
            this._emit(dt);
            this.renderer!._updateParticles(dt);
        }
    }

    // internal function
    private _emit (dt) {
        // emit particles.
        const startDelay = this.startDelay.evaluate(0, 1)!;
        if (this._time > startDelay) {
            if (!this._isStopped) {
                this._isEmitting = true;
            }
            if (this._time > (this.duration + startDelay)) {
                // this._time = startDelay; // delay will not be applied from the second loop.(Unity)
                // this._emitRateTimeCounter = 0.0;
                // this._emitRateDistanceCounter = 0.0;
                if (!this.loop) {
                    this._isEmitting = false;
                    this._isStopped = true;
                }
            }

            // emit by rateOverTime
            this._emitRateTimeCounter += this.rateOverTime.evaluate(this._time / this.duration, 1)! * dt;
            if (this._emitRateTimeCounter > 1 && this._isEmitting) {
                const emitNum = Math.floor(this._emitRateTimeCounter);
                this._emitRateTimeCounter -= emitNum;
                this.emit(emitNum);
            }
            // emit by rateOverDistance
            this.node.getWorldPosition(this._curWPos);
            const distance = vec3.distance(this._curWPos, this._oldWPos);
            vec3.copy(this._oldWPos, this._curWPos);
            this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(this._time / this.duration, 1)!;
            if (this._emitRateDistanceCounter > 1 && this._isEmitting) {
                const emitNum = Math.floor(this._emitRateDistanceCounter);
                this._emitRateDistanceCounter -= emitNum;
                this.emit(emitNum);
            }

            // bursts
            for (const burst of this.bursts) {
                burst.update(this, dt);
            }
        }
    }

    private update (dt) {
        const scaledDeltaTime = dt * this.simulationSpeed;
        if (this._isPlaying) {
            this._time += scaledDeltaTime;

            // excute emission
            this._emit(scaledDeltaTime);

            // simulation, update particles.
            this.renderer!._updateParticles(scaledDeltaTime);

            // update render data
            this.renderer!._updateRenderData();
        }
    }

    private addSubEmitter (subEmitter) {
        this._subEmitters.push(subEmitter);
    }

    private removeSubEmitter (idx) {
        this._subEmitters.splice(this._subEmitters.indexOf(idx), 1);
    }

    private addBurst (burst) {
        this.bursts.push(burst);
    }

    private removeBurst (idx) {
        this.bursts.splice(this.bursts.indexOf(idx), 1);
    }

    public getParticleCount () {
        return this.renderer!.getParticleCount();
    }

    public setCustomData1 (x, y) {
        vec2.set(this._customData1, x, y);
    }

    public setCustomData2 (x, y) {
        vec2.set(this._customData2, x, y);
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
