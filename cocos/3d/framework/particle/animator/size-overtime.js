import { vec3, pseudoRandom } from '../../../../core/vmath';
import CurveRange from './curve-range';
import { CCClass } from '../../../../core/data';

const SIZE_OVERTIME_RAND_OFFSET = 39825;

export default class SizeOvertimeModule {

    enable = false;

    separateAxes = false;

    size = null;

    x = null;

    y = null;

    z = null;

    animate(particle) {
        if (!this.separateAxes) {
            vec3.scale(particle.size, particle.startSize, this.size.evaluate(1 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET)));
        }
    }
}

CCClass.fastDefine('cc.SizeOvertimeModule', SizeOvertimeModule, {
    enable: false,
    separateAxes: false,
    size: new CurveRange(),
    x: new CurveRange(),
    y: new CurveRange(),
    z: new CurveRange()
});
