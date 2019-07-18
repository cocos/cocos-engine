
/**
 * @category particle
 */

import { CCClass } from '../../../../core/data';
import { ccclass, property } from '../../../../core/data/class-decorator';
import { Color, pseudoRandom } from '../../../../core/value-types';
import Particle from '../particle';
import GradientRange from './gradient-range';

// tslint:disable: max-line-length

const COLOR_OVERTIME_RAND_OFFSET = 91041;

@ccclass('cc.ColorOvertimeModule')
export default class ColorOvertimeModule {

    /**
     * @zh 是否启用。
     */
    @property({
        displayOrder: 0,
    })
    public enable = false;

    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     */
    @property({
        type: GradientRange,
        displayOrder: 1,
    })
    public color = new GradientRange();

    public animate (particle: Particle) {
        if (this.enable) {
            particle.color.set(particle.startColor);
            particle.color.multiply(this.color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + COLOR_OVERTIME_RAND_OFFSET)));
        }
    }
}

// CCClass.fastDefine('cc.ColorOvertimeModule', ColorOvertimeModule, {
//     enable: false,
//     color: null
// });
