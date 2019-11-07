import { ccclass, property } from '../../../platform/CCClassDecorator';
import { pseudoRandom, quat, vec3 } from '../../../vmath';
import { Space } from '../enum';
import { calculateTransform } from '../particle-general-function';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const FORCE_OVERTIME_RAND_OFFSET = 212165;

const _temp_v3 = cc.v3();

@ccclass('cc.ForceOvertimeModule')
export default class ForceOvertimeModule {

    /**
     * @zh 是否启用。
     */
    @property
    enable = false;

    /**
     * @zh 加速度计算时采用的坐标系 [[Space]]。
     */
    @property({
        type: Space,
    })
    space = Space.Local;

    /**
     * @zh X 轴方向上的加速度分量。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    x = new CurveRange();

    /**
     * @zh Y 轴方向上的加速度分量。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    y = new CurveRange();

    /**
     * @zh Z 轴方向上的加速度分量。
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
        this.rotation = quat.create();
        this.needTransform = false;
    }

    update (space, worldTransform) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    animate (p, dt) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const force = vec3.set(_temp_v3, this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)));
        if (this.needTransform) {
            vec3.transformQuat(force, force, this.rotation);
        }
        vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);
    }
}

