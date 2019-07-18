
/**
 * @category particle
 */

import { CCClass } from '../../../../core/data';
import { ccclass, property } from '../../../../core/data/class-decorator';
import { pseudoRandom, Quat, Vec3 } from '../../../../core/value-types';
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
    @property({
        displayOrder: 0,
    })
    public enable = false;

    /**
     * @zh X 轴方向上的加速度分量。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 2,
    })
    public x = new CurveRange();

    /**
     * @zh Y 轴方向上的加速度分量。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 3,
    })
    public y = new CurveRange();

    /**
     * @zh Z 轴方向上的加速度分量。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 4,
    })
    public z = new CurveRange();

    /**
     * @zh 加速度计算时采用的坐标系 [[Space]]。
     */
    @property({
        type: Space,
        displayOrder: 1,
    })
    public space = Space.Local;

    // TODO:currently not supported
    public randomized = false;

    private rotation: Quat;
    private needTransform: boolean;

    constructor () {
        this.rotation = Quat.create();
        this.needTransform = false;
    }

    public update (space, worldTransform) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    public animate (p, dt) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const force = Vec3.set(_temp_v3, this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET))!, this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET))!, this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET))!);
        if (this.needTransform) {
            Vec3.transformQuat(force, force, this.rotation);
        }
        Vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);
    }
}

// CCClass.fastDefine('cc.ForceOvertimeModule',ForceOvertimeModule,{
//     enable : false,
//     x : new CurveRange(),
//     y : new CurveRange(),
//     z : new CurveRange(),
//     space : Space.Local,
//     randomized : false
// });
