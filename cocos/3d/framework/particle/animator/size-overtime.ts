import { vec3, pseudoRandom } from '../../../../core/vmath';
import CurveRange from './curve-range';
import { CCClass } from '../../../../core/data';
import { property, ccclass } from '../../../../core/data/class-decorator';
import Particle from '../particle';

// tslint:disable: max-line-length
const SIZE_OVERTIME_RAND_OFFSET = 39825;

@ccclass('cc.SizeOvertimeModule')
export default class SizeOvertimeModule {

    @property
    public enable = false;

    @property
    public separateAxes = false;

    @property({
        type: CurveRange,
    })
    public size = new CurveRange();

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

    public animate (particle: Particle) {
        if (!this.separateAxes) {
            vec3.scale(particle.size, particle.startSize, this.size.evaluate(1 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET))!);
        }
    }
}

// CCClass.fastDefine('cc.SizeOvertimeModule', SizeOvertimeModule, {
//     enable: false,
//     separateAxes: false,
//     size: new CurveRange(),
//     x: new CurveRange(),
//     y: new CurveRange(),
//     z: new CurveRange()
// });
