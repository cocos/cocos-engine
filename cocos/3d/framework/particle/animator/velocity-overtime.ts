import { vec3, quat, pseudoRandom, mat4 } from '../../../../core/vmath';
import { calculateTransform, Space } from '../particle-general-function';
import CurveRange from './curve-range';
import { CCClass } from '../../../../core/data';
import { property, ccclass } from '../../../../core/data/class-decorator';
import Particle from '../particle';

// tslint:disable: max-line-length
const VELOCITY_OVERTIME_RAND_OFFSET = 197866;

@ccclass('cc.VelocityOvertimeModule')
export default class VelocityOvertimeModule {

    @property
    public enable = false;

    @property({
        type: CurveRange,
    })
    public x = new CurveRange();

    @property({
        type: CurveRange,
    })
    public y = new CurveRange();

    @property({
        type: CurveRange,
    })
    public z = new CurveRange();

    @property({
        type: CurveRange,
    })
    public speedModifier = new CurveRange();

    @property({
        type: Space,
    })
    public space = Space.Local;

    private rotation: quat;
    private needTransform: boolean;

    constructor () {
        this.rotation = quat.create();
        this.speedModifier.constant = 1;
        this.needTransform = false;
    }

    public update (space: number, worldTransform: mat4) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    public animate (p: Particle) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const vel = vec3.create(this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)));
        if (this.needTransform) {
            vec3.transformQuat(vel, vel, this.rotation);
        }
        vec3.add(p.animatedVelocity, p.animatedVelocity, vel);
        vec3.add(p.ultimateVelocity, p.velocity, p.animatedVelocity);
        vec3.scale(p.ultimateVelocity, p.ultimateVelocity, this.speedModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET))!);
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
