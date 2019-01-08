import { vec3, quat, pseudoRandom } from '../../../../core/vmath';
import { calculateTransform, Space } from '../particle-general-function';
import CurveRange from './curve-range';
import { CCClass } from '../../../../core/data';
import { property, ccclass } from '../../../../core/data/class-decorator';

const VELOCITY_OVERTIME_RAND_OFFSET = 197866;

@ccclass('cc.VelocityOvertimeModule')
export default class VelocityOvertimeModule {

    @property
    enable = false;

    @property({
        type: CurveRange
    })
    x = new CurveRange();

    @property({
        type: CurveRange
    })
    y = new CurveRange();

    @property({
        type: CurveRange
    })
    z = new CurveRange();

    @property({
        type: CurveRange
    })
    speedModifier = new CurveRange();

    @property
    space = Space.Local;

    constructor() {
        this.rotation = quat.create();
    }

    update(space, worldTransform) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    animate(p) {
        let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        let vel = vec3.create(this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)));
        if (this.needTransform) {
            vec3.transformQuat(vel, vel, this.rotation);
        }
        vec3.add(p.animatedVelocity, p.animatedVelocity, vel);
        vec3.add(p.ultimateVelocity, p.velocity, p.animatedVelocity);
        vec3.scale(p.ultimateVelocity, p.ultimateVelocity, this.speedModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)));
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
