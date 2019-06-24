
/**
<<<<<<< HEAD
 * @category particle
=======
 * @internal
 * @module ParticleSystem
 */
/**
 * @able
>>>>>>> fix ui particle error & add module api doc (#4684)
 */

import { CCClass } from '../../../../core/data';
import { ccclass, property } from '../../../../core/data/class-decorator';
import { mat4, pseudoRandom, quat, vec3 } from '../../../../core/vmath';
import { Space } from '../enum';
import Particle from '../particle';
import { calculateTransform } from '../particle-general-function';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const VELOCITY_OVERTIME_RAND_OFFSET = 197866;

const _temp_v3 = cc.v3();

@ccclass('cc.VelocityOvertimeModule')
export default class VelocityOvertimeModule {

    /**
     * @zh 是否启用。
     */
    @property({
        displayOrder: 0,
    })
    public enable = false;

    /**
     * @zh X 轴方向上的速度分量。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 2,
    })
    public x = new CurveRange();

    /**
     * @zh Y 轴方向上的速度分量。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 3,
    })
    public y = new CurveRange();

    /**
     * @zh Z 轴方向上的速度分量。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 4,
    })
    public z = new CurveRange();

    /**
     * @zh 速度修正系数（只支持 CPU 粒子）。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 5,
    })
    public speedModifier = new CurveRange();

    /**
     * @zh 速度计算时采用的坐标系[[Space]]。
     */
    @property({
        type: Space,
        displayOrder: 1,
    })
    public space = Space.Local;

    private rotation: quat;
    private needTransform: boolean;

    constructor () {
        this.rotation = quat.create();
        this.speedModifier.constant = 1;
        this.needTransform = false;
    }

    public update (space: number, worldTransform: mat4) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    public animate (p: Particle) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const vel = vec3.set(_temp_v3, this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET))!, this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET))!, this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET))!);
        if (this.needTransform) {
            vec3.transformQuat(vel, vel, this.rotation);
        }
        vec3.add(p.animatedVelocity, p.animatedVelocity, vel);
        vec3.add(p.ultimateVelocity, p.velocity, p.animatedVelocity);
        vec3.scale(p.ultimateVelocity, p.ultimateVelocity, this.speedModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET))!);
    }

}

// CCClass.fastDefine('cc.VelocityOvertimeModule', VelocityOvertimeModule, {
//     enable: false,
//     x: new CurveRange(),
//     y: new CurveRange(),
//     z: new CurveRange(),
//     speedModifier: new CurveRange(),
//     space: Space.Local
// });
