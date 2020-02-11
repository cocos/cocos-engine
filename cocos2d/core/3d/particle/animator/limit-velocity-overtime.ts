import { ccclass, property } from '../../../platform/CCClassDecorator';
import { lerp, pseudoRandom, Vec3 } from '../../../value-types';
import { Space } from '../enum';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const LIMIT_VELOCITY_RAND_OFFSET = 23541;

const _temp_v3 = cc.v3();

function dampenBeyondLimit (vel, limit, dampen) {
    const sgn = Math.sign(vel);
    let abs = Math.abs(vel);
    if (abs > limit) {
        abs = lerp(abs, limit, dampen);
    }
    return abs * sgn;
}

@ccclass('cc.LimitVelocityOvertimeModule')
export default class LimitVelocityOvertimeModule {

    /**
     * !#en The enable of LimitVelocityOvertimeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    @property
    enable = false;

    /**
     * !#en The coordinate system used when calculating the lower speed limit.
     * !#zh 计算速度下限时采用的坐标系。
     * @property {Space} space
     */
    @property({
        type: Space,
    })
    space = Space.Local;

    /**
     * !#en Whether to limit the three axes separately.
     * !#zh 是否三个轴分开限制。
     * @property {Boolean} separateAxes
     */
    @property
    separateAxes = false;

    /**
     * !#en Lower speed limit
     * !#zh 速度下限。
     * @property {CurveRange} limit
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    limit = new CurveRange();

    /**
     * !#en Lower speed limit in X direction.
     * !#zh X 轴方向上的速度下限。
     * @property {CurveRange} limitX
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    limitX = new CurveRange();

    /**
     * !#en Lower speed limit in Y direction.
     * !#zh Y 轴方向上的速度下限。
     * @property {CurveRange} limitY
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    limitY = new CurveRange();

    /**
     * !#en Lower speed limit in Z direction.
     * !#zh Z 轴方向上的速度下限。
     * @property {CurveRange} limitZ
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
    })
    limitZ = new CurveRange();

    /**
     * !#en Interpolation of current speed and lower speed limit.
     * !#zh 当前速度与速度下限的插值。
     * @property {Number} dampen
     */
    @property
    dampen = 3;

    // TODO:functions related to drag are temporarily not supported
    drag = null;

    multiplyDragByParticleSize = false;

    multiplyDragByParticleVelocity = false;

    constructor () {
    }

    animate (p) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const dampedVel = _temp_v3;
        if (this.separateAxes) {
            Vec3.set(dampedVel,
                dampenBeyondLimit(p.ultimateVelocity.x, this.limitX.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.y, this.limitY.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.z, this.limitZ.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen));
        }
        else {
            Vec3.normalize(dampedVel, p.ultimateVelocity);
            Vec3.scale(dampedVel, dampedVel, dampenBeyondLimit(p.ultimateVelocity.len(), this.limit.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen));
        }
        Vec3.copy(p.ultimateVelocity, dampedVel);
    }

}

