import { ccclass, property } from '../../../platform/CCClassDecorator'
import { pseudoRandom, Color } from '../../../value-types';
import GradientRange from './gradient-range';

const COLOR_OVERTIME_RAND_OFFSET = 91041;

/**
 * !#en The color over time module of 3d particle.
 * !#zh 3D 粒子颜色变化模块
 * @class ColorOvertimeModule
 */
@ccclass('cc.ColorOvertimeModule')
export default class ColorOvertimeModule {

    /**
     * !#en The enable of ColorOvertimeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    @property
    enable = false;

    /**
     * !#en The parameter of color change over time, the linear difference between each key changes.
     * !#zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     * @type {GradientRange} color
     */
    @property({
        type: GradientRange,
    })
    color = new GradientRange();

    animate (particle) {
        if (this.enable) {
            particle.color.set(particle.startColor);
            particle.color.multiply(this.color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + COLOR_OVERTIME_RAND_OFFSET)));
        }
    }
}
