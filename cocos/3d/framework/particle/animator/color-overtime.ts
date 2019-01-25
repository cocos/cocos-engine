import { color4, pseudoRandom } from '../../../../core/vmath';
import { CCClass } from '../../../../core/data';
import GradientRange from './gradient-range';
import { property, ccclass } from '../../../../core/data/class-decorator';
import Particle from '../particle';

// tslint:disable: max-line-length

const COLOR_OVERTIME_RAND_OFFSET = 91041;

@ccclass('cc.ColorOvertimeModule')
export default class ColorOvertimeModule {

    @property
    public enable = false;

    @property({
        type: GradientRange,
    })
    public color = new GradientRange();

    public animate (particle: Particle) {
        if (this.enable) {
            color4.multiply(particle.color, particle.startColor01, this.color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + COLOR_OVERTIME_RAND_OFFSET)));
        }
    }
}

// CCClass.fastDefine('cc.ColorOvertimeModule', ColorOvertimeModule, {
//     enable: false,
//     color: null
// });
