import { color4, pseudoRandom } from '../../../../core/vmath';
import { CCClass } from '../../../../core/data';
import GradientRange from './gradient-range';
import { property, ccclass } from '../../../../core/data/class-decorator';
import Particle from '../particle';

// tslint:disable: max-line-length

const COLOR_OVERTIME_RAND_OFFSET = 91041;

@ccclass('cc.ColorOvertimeModule')
export default class ColorOvertimeModule {

    @property({
        displayOrder: 0,
    })
    public enable = false;

    @property({
        type: GradientRange,
        displayOrder: 1,
    })
    public color = new GradientRange();

    public animate (particle: Particle) {
        if (this.enable) {
            particle.startColor.mul(this.color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + COLOR_OVERTIME_RAND_OFFSET)), particle.color);
        }
    }
}

// CCClass.fastDefine('cc.ColorOvertimeModule', ColorOvertimeModule, {
//     enable: false,
//     color: null
// });
