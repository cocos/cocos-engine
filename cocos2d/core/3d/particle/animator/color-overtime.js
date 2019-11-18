import { ccclass, property } from '../../../platform/CCClassDecorator'
import { pseudoRandom, Color } from '../../../value-types';
import GradientRange from './gradient-range';

// tslint:disable: max-line-length

const COLOR_OVERTIME_RAND_OFFSET = 91041;

@ccclass('cc.ColorOvertimeModule')
export default class ColorOvertimeModule {

    /**
     * @zh 是否启用。
     */
    @property
    enable = false;

    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     * @type {GradientRange}
     */
    @property({
        type: GradientRange,
    })
    color = new GradientRange();

    animate (particle) {
        if (this._enable) {
            particle.color.set(particle.startColor);
            particle.color.multiply(this.color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + COLOR_OVERTIME_RAND_OFFSET)));
        }
    }
}
