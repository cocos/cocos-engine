
/**
 * @category particle
 */

import { ccclass, property } from '../../../../core/data/class-decorator';
import { lerp, pseudoRandom, Vec3 } from '../../../../core/math';
import { Space } from '../enum';
import Particle from '../particle';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const LIMIT_VELOCITY_RAND_OFFSET = 23541;

const _temp_v3 = cc.v3();

@ccclass('cc.LimitVelocityOvertimeModule')
export default class LimitVelocityOvertimeModule {

    /**
     * @zh 是否启用。
     */
    @property({
        displayOrder: 0,
    })
    public enable = false;

    /**
     * @zh X 轴方向上的速度下限。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 4,
    })
    public limitX = new CurveRange();

    /**
     * @zh Y 轴方向上的速度下限。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 5,
    })
    public limitY = new CurveRange();

    /**
     * @zh Z 轴方向上的速度下限。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 6,
    })
    public limitZ = new CurveRange();

    /**
     * @zh 速度下限。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 3,
    })
    public limit = new CurveRange();

    /**
     * @zh 当前速度与速度下限的插值。
     */
    @property({
        displayOrder: 7,
    })
    public dampen = 3;

    /**
     * @zh 是否三个轴分开限制。
     */
    @property({
        displayOrder: 2,
    })
    public separateAxes = false;

    /**
     * @zh 计算速度下限时采用的坐标系 [[Space]]。
     */
    @property({
        type: Space,
        displayOrder: 1,
    })
    public space = Space.Local;

    // TODO:functions related to drag are temporarily not supported
    public drag = null;

    public multiplyDragByParticleSize = false;

    public multiplyDragByParticleVelocity = false;

    constructor () {
    }

    public animate (p: Particle) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const dampedVel = _temp_v3;
        if (this.separateAxes) {
            Vec3.set(dampedVel,
                dampenBeyondLimit(p.ultimateVelocity.x, this.limitX.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!, this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.y, this.limitY.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!, this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.z, this.limitZ.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!, this.dampen));
        }
        else {
            Vec3.normalize(dampedVel, p.ultimateVelocity);
            Vec3.multiplyScalar(dampedVel, dampedVel, dampenBeyondLimit(p.ultimateVelocity.length(), this.limit.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!, this.dampen));
        }
        Vec3.copy(p.ultimateVelocity, dampedVel);
    }

}

function dampenBeyondLimit (vel: number, limit: number, dampen: number) {
    const sgn = Math.sign(vel);
    let abs = Math.abs(vel);
    if (abs > limit) {
        abs = lerp(abs, limit, dampen);
    }
    return abs * sgn;
}

// CCClass.fastDefine('cc.LimitVelocityOvertimeModule', LimitVelocityOvertimeModule, {
//     enable: false,
//     limitX: null,
//     limitY: null,
//     limitZ: null,
//     limit: null,
//     dampen: null,
//     separateAxes: false,
//     space: Space.Local,
//     // TODO:functions related to drag are temporarily not supported
//     drag: null,
//     multiplyDragByParticleSize: false,
//     multiplyDragByParticleVelocity: false
// });
