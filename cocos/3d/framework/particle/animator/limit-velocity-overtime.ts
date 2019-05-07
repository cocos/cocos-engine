import { CCClass } from '../../../../core/data';
import { ccclass, property } from '../../../../core/data/class-decorator';
import { lerp, pseudoRandom, vec3 } from '../../../../core/vmath';
import Particle from '../particle';
import { Space } from '../particle-general-function';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const LIMIT_VELOCITY_RAND_OFFSET = 23541;

@ccclass('cc.LimitVelocityOvertimeModule')
export default class LimitVelocityOvertimeModule {

    /**
     * 是否启用
     */
    @property({
        displayOrder: 0,
    })
    public enable = false;

    /**
     * X 轴方向上的速度下限
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 4,
    })
    public limitX = new CurveRange();

    /**
     * Y 轴方向上的速度下限
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 5,
    })
    public limitY = new CurveRange();

    /**
     * Z 轴方向上的速度下限
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 6,
    })
    public limitZ = new CurveRange();

    /**
     * 速度下限
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 3,
    })
    public limit = new CurveRange();

    /**
     * 当前速度与速度下限的插值
     */
    @property({
        displayOrder: 7,
    })
    public dampen = 3;

    /**
     * 是否三个轴分开限制
     */
    @property({
        displayOrder: 2,
    })
    public separateAxes = false;

    /**
     * 计算速度下限时采用的坐标系
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
        const dampedVel = vec3.create(0, 0, 0);
        if (this.separateAxes) {
            vec3.set(dampedVel,
                dampenBeyondLimit(p.ultimateVelocity.x, this.limitX.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!, this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.y, this.limitY.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!, this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.z, this.limitZ.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!, this.dampen));
        }
        else {
            vec3.normalize(dampedVel, p.ultimateVelocity);
            vec3.scale(dampedVel, dampedVel, dampenBeyondLimit(vec3.magnitude(p.ultimateVelocity), this.limit.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!, this.dampen));
        }
        vec3.copy(p.ultimateVelocity, dampedVel);
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
