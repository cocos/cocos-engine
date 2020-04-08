import { ccclass, property } from '../../../platform/CCClassDecorator';
import { pseudoRandom, Quat, Vec3 } from '../../../value-types';
import { Space } from '../enum';
import { calculateTransform } from '../particle-general-function';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const FORCE_OVERTIME_RAND_OFFSET = 212165;

const _temp_v3 = cc.v3();

/**
 * !#en The force over time module of 3d particle.
 * !#zh 3D 粒子的加速度模块
 * @class ForceOvertimeModule
 */
@ccclass('cc.ForceOvertimeModule')
export default class ForceOvertimeModule {

    /**
     * !#en The enable of ColorOvertimeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    @property
    enable = false;

    /**
     * !#en Coordinate system used in acceleration calculation.
     * !#zh 加速度计算时采用的坐标系。
     * @property {Space} space
     */
    @property({
        type: Space,
    })
    space = Space.Local;

    /**
     * !#en X-axis acceleration component.
     * !#zh X 轴方向上的加速度分量。
     * @property {CurveRange} x
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    x = new CurveRange();

    /**
     * !#en Y-axis acceleration component.
     * !#zh Y 轴方向上的加速度分量。
     * @property {CurveRange} y
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    y = new CurveRange();

    /**
     * !#en Z-axis acceleration component.
     * !#zh Z 轴方向上的加速度分量。
     * @property {CurveRange} z
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 4,
    })
    z = new CurveRange();

    // TODO:currently not supported
    randomized = false;

    rotation = null;
    needTransform = false;

    constructor () {
        this.rotation = new Quat();
        this.needTransform = false;
    }

    update (space, worldTransform) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    animate (p, dt) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const force = Vec3.set(_temp_v3, this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)));
        if (this.needTransform) {
            Vec3.transformQuat(force, force, this.rotation);
        }
        Vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);
    }
}

