import { vec3, lerp, pseudoRandom } from '../../../../core/vmath';
import { CCClass } from '../../../../core/data';
import { Space } from '../particle-general-function';
import { property, ccclass } from '../../../../core/data/class-decorator';
import CurveRange from './curve-range';
import Particle from '../particle';

// tslint:disable: max-line-length
const LIMIT_VELOCITY_RAND_OFFSET = 23541;

@ccclass('cc.LimitVelocityOvertimeModule')
export default class LimitVelocityOvertimeModule {

    @property({
        displayOrder: 0,
    })
    public enable = false;

    @property({
        type: CurveRange,
        displayOrder: 4,
    })
    public limitX = new CurveRange();

    @property({
        type: CurveRange,
        displayOrder: 5,
    })
    public limitY = new CurveRange();

    @property({
        type: CurveRange,
        displayOrder: 6,
    })
    public limitZ = new CurveRange();

    @property({
        type: CurveRange,
        displayOrder: 3,
    })
    public limit = new CurveRange();

    @property({
        displayOrder: 7,
    })
    public dampen = 3;

    @property({
        displayOrder: 2,
    })
    public separateAxes = false;

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
