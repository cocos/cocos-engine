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

import { ccclass, displayOrder, formerlySerializedAs, radian, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ParticleModule } from '../particle';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';
import { CurveRange } from '../curve-range';
import { GradientRange } from '../gradient-range';
import { Vec3 } from '../../core/math';

@ccclass('cc.InitializationModule')
export class InitializationModule extends ParticleModule {
    public get name (): string {
        return 'initializationModule';
    }

    public get enable (): boolean {
        return this._enabled;
    }

    public set enable (val: boolean) {
        this._enabled = val;
    }

    /**
     * @zh 粒子初始颜色。
     */
    @type(GradientRange)
    @serializable
    @displayOrder(8)
    @tooltip('i18n:particle_system.startColor')
    public startColor = new GradientRange();

    @serializable
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSize3D')
    public startSize3D = false;

    /**
     * @zh 粒子初始大小。
     */
    @formerlySerializedAs('startSize')
    @range([0, 1])
    @type(CurveRange)
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeX')
    public startSizeX = new CurveRange();

    /**
     * @zh 粒子初始大小。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeY')
    @visible(function (this: InitializationModule): boolean { return this.startSize3D; })
    public startSizeY = new CurveRange();

    /**
     * @zh 粒子初始大小。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeZ')
    @visible(function (this: InitializationModule): boolean { return this.startSize3D; })
    public startSizeZ = new CurveRange();

    /**
     * @zh 粒子初始速度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(11)
    @tooltip('i18n:particle_system.startSpeed')
    public startSpeed = new CurveRange();

    @serializable
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotation3D')
    public startRotation3D = false;

    /**
     * @zh 粒子初始旋转角度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotationX')
    @visible(function (this: InitializationModule): boolean { return this.startRotation3D; })
    public startRotationX = new CurveRange();

    /**
     * @zh 粒子初始旋转角度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotationY')
    @visible(function (this: InitializationModule): boolean { return this.startRotation3D; })
    public startRotationY = new CurveRange();

    /**
     * @zh 粒子初始旋转角度。
     */
    @type(CurveRange)
    @formerlySerializedAs('startRotation')
    @range([-1, 1])
    @radian
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotationZ')
    @visible(function (this: InitializationModule): boolean { return this.startRotation3D; })
    public startRotationZ = new CurveRange();

    /**
     * @zh 粒子生命周期。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(7)
    @tooltip('i18n:particle_system.startLifetime')
    public startLifetime = new CurveRange();

    @serializable
    private _enabled = false;

    constructor () {
        super();
        this.startLifetime.constant = 5;
        this.startSizeX.constant = 1;
        this.startSpeed.constant = 5;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        for (let i = 0; i < count; ++i) {
            const particle = this.getFreeParticle();
            if (particle === INVALID_HANDLE) {
                return;
            }

            const rand = pseudoRandom(randomRangeInt(0, INT_MAX));

            if (this._shapeModule && this._shapeModule.enable) {
                this._shapeModule.emit(particle);
            } else {
                Vec3.set(particle.position, 0, 0, 0);
                Vec3.copy(particle.velocity, particleEmitZAxis);
            }

            if (this._textureAnimationModule && this._textureAnimationModule.enable) {
                this._textureAnimationModule.init(particle);
            }

            const curveStartSpeed = this.startSpeed.evaluate(loopDelta, rand)!;
            Vec3.multiplyScalar(particle.velocity, particle.velocity, curveStartSpeed);

            if (this._simulationSpace === Space.World) {
                Vec3.transformMat4(particle.position, particle.position, _world_mat);
                Vec3.transformQuat(particle.velocity, particle.velocity, _world_rol);
            }

            Vec3.copy(particle.ultimateVelocity, particle.velocity);
            // apply startRotation.
            if (this.startRotation3D) {
                // eslint-disable-next-line max-len
                particle.startEuler.set(this.startRotationX.evaluate(loopDelta, rand), this.startRotationY.evaluate(loopDelta, rand), this.startRotationZ.evaluate(loopDelta, rand));
            } else {
                particle.startEuler.set(0, 0, this.startRotationZ.evaluate(loopDelta, rand));
            }
            particle.rotation.set(particle.startEuler);

            // apply startSize.
            if (this.startSize3D) {
                Vec3.set(particle.startSize, this.startSizeX.evaluate(loopDelta, rand)!,
                    this.startSizeY.evaluate(loopDelta, rand)!,
                    this.startSizeZ.evaluate(loopDelta, rand)!);
            } else {
                Vec3.set(particle.startSize, this.startSizeX.evaluate(loopDelta, rand)!, 1, 1);
                particle.startSize.y = particle.startSize.x;
            }
            Vec3.copy(particle.size, particle.startSize);

            // apply startColor.
            particle.startColor.set(this.startColor.evaluate(loopDelta, rand));
            particle.color.set(particle.startColor);

            // apply startLifetime.
            particle.startLifetime = this.startLifetime.evaluate(loopDelta, rand)! + dt;
            particle.remainingLifetime = particle.startLifetime;

            particle.randomSeed = randomRangeInt(0, 233280);
            particle.loopCount++;

            this._processor.setNewParticle(particle);
        } // end of particles forLoop.
    }
}
