import { vec3, lerp, pseudoRandom } from '../../../../core/vmath';
import { CCClass } from '../../../../core/data';
import { Space } from '../particle-general-function';

const LIMIT_VELOCITY_RAND_OFFSET = 23541;

export default class LimitVelocityOvertimeModule {

    enable = false;

    limitX = null;

    limitY = null;

    limitZ = null;

    limit = null;

    dampen = null;

    separateAxes = false;

    space = Space.Local;

    // TODO:functions related to drag are temporarily not supported
    drag = null;

    multiplyDragByParticleSize = false;

    multiplyDragByParticleVelocity = false;

    constructor() {
    }

    animate(p) {
        let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        let dampedVel = vec3.create(0, 0, 0);
        if (this.separateAxes) {
            vec3.set(dampedVel,
                dampenBeyondLimit(p.ultimateVelocity.x, this.limitX.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.y, this.limitY.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.z, this.limitZ.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen));
        }
        else {
            vec3.normalize(dampedVel, p.ultimateVelocity);
            vec3.scale(dampedVel, dampedVel, dampenBeyondLimit(vec3.magnitude(p.ultimateVelocity), this.limit.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen));
        }
        vec3.copy(p.ultimateVelocity, dampedVel);
    }

}

function dampenBeyondLimit(vel, limit, dampen) {
    let sgn = Math.sign(vel);
    let abs = Math.abs(vel);
    if (abs > limit) {
        abs = lerp(abs, limit, dampen);
    }
    return abs * sgn;
}

CCClass.fastDefine('cc.LimitVelocityOvertimeModule',LimitVelocityOvertimeModule,{
    enable : false,
    limitX : null,
    limitY : null,
    limitZ : null,
    limit : null,
    dampen : null,
    separateAxes : false,
    space : Space.Local,
    // TODO:functions related to drag are temporarily not supported
    drag : null,
    multiplyDragByParticleSize : false,
    multiplyDragByParticleVelocity : false
});
