import { vec3, pseudoRandom } from '../../../../core/vmath';
import CurveRange from './curve-range';
import { CCClass } from '../../../../core/data';
import { property, ccclass } from '../../../../core/data/class-decorator';
import Particle from '../particle';

// tslint:disable: max-line-length
const SIZE_OVERTIME_RAND_OFFSET = 39825;

@ccclass('cc.SizeOvertimeModule')
export default class SizeOvertimeModule {

    @property({
        displayOrder: 0,
    })
    public enable = false;

    @property({
        displayOrder: 1,
    })
    public separateAxes = false;

    @property({
        type: CurveRange,
        displayOrder: 2,
    })
    public size = new CurveRange();

    @property({
        type: CurveRange,
        displayOrder: 3,
    })
    public x = new CurveRange();

    @property({
        type: CurveRange,
        displayOrder: 4,
    })
    public y = new CurveRange();

    @property({
        type: CurveRange,
        displayOrder: 5,
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
