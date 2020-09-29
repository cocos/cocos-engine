
/**
 * @category particle
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { pseudoRandom } from '../../core/math';
import { Particle, PARTICLE_MODULE_NAME } from '../particle';
import GradientRange from './gradient-range';
import { ModuleRandSeed } from '../enum';
import { ParticleModuleBase } from '../particle';

// tslint:disable: max-line-length

const COLOR_OVERTIME_RAND_OFFSET = ModuleRandSeed.COLOR;

@ccclass('cc.ColorOvertimeModule')
export default class ColorOvertimeModule extends ParticleModuleBase {
    @serializable
    _enable = false;
    /**
     * @zh 是否启用。
     */
    @displayOrder(0)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        if (this._enable === val) return;
        this._enable = val;
        if (!this.target) return;
        this.target.enableModule(this.name, val, this);
    }

    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     */
    @type(GradientRange)
    @serializable
    @displayOrder(1)
    public color = new GradientRange();
    public name = PARTICLE_MODULE_NAME.COLOR;

    public animate (particle: Particle) {
        particle.color.set(particle.startColor);
        particle.color.multiply(this.color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + COLOR_OVERTIME_RAND_OFFSET)));
    }
}

// CCClass.fastDefine('cc.ColorOvertimeModule', ColorOvertimeModule, {
//     enable: false,
//     color: null
// });
