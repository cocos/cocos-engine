import { ccclass, property } from '../../../platform/CCClassDecorator';
import { pseudoRandom, Quat, Vec3 } from '../../../value-types';
import { Space } from '../enum';
import { calculateTransform } from '../particle-general-function';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const VELOCITY_OVERTIME_RAND_OFFSET = 197866;

const _temp_v3 = cc.v3();

/**
 * !#en The velocity module of 3d particle.
 * !#zh 3D 粒子的速度模块
 * @class VelocityOvertimeModule
 */
@ccclass('cc.VelocityOvertimeModule')
export default class VelocityOvertimeModule {

    /**
     * !#en The enable of VelocityOvertimeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    @property
    enable = false;

    /**
     * !#en Coordinate system used in speed calculation.
     * !#zh 速度计算时采用的坐标系。
     * @property {Space} space
     */
    @property({
        type: Space,
    })
    space = Space.Local;

    /**
     * !#en Velocity component in X axis direction
     * !#zh X 轴方向上的速度分量。
     * @property {CurveRange} x
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    x = new CurveRange();

    /**
     * !#en Velocity component in Y axis direction
     * !#zh Y 轴方向上的速度分量。
     * @property {CurveRange} y
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    y = new CurveRange();

    /**
     * !#en Velocity component in Z axis direction
     * !#zh Z 轴方向上的速度分量。
     * @property {CurveRange} z
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    z = new CurveRange();

    /**
     * !#en Speed correction factor (only supports CPU particles).
     * !#zh 速度修正系数（只支持 CPU 粒子）。
     * @property {CurveRange} speedModifier
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    speedModifier = new CurveRange();

    rotation = null;
    needTransform = false;

    constructor () {
        this.rotation = new Quat();
        this.speedModifier.constant = 1;
        this.needTransform = false;
    }

    update (space, worldTransform) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    animate (p) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const vel = Vec3.set(_temp_v3, this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)));
        if (this.needTransform) {
            Vec3.transformQuat(vel, vel, this.rotation);
        }
        Vec3.add(p.animatedVelocity, p.animatedVelocity, vel);
        Vec3.add(p.ultimateVelocity, p.velocity, p.animatedVelocity);
        Vec3.scale(p.ultimateVelocity, p.ultimateVelocity, this.speedModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)));
    }

}
