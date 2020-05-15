
/**
 * @category particle
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { pseudoRandom } from '../../core/math';
import { Particle, PARTICLE_MODULE_NAME } from '../particle';
import GradientRange from './gradient-range';
import { ModuleRandSeed } from '../enum';
import { ParticleModuleBase } from '../particle';

// tslint:disable: max-line-length

const COLOR_OVERTIME_RAND_OFFSET = ModuleRandSeed.COLOR;

/**
 * @en The color over time module of 3d particle.
 * @zh 3D 粒子颜色变化模块
 * @class ColorOvertimeModule
 */
@ccclass('cc.ColorOvertimeModule')
export default class ColorOvertimeModule extends ParticleModuleBase {
    @property
    _enable = false;
    /**
     * @en The enable of ColorOvertimeModule.
     * @zh 是否启用
     * @property {Boolean} enable
     */
    @property({
        displayOrder: 0,
    })
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
     * @en The parameter of color change over time, the linear difference between each key changes.
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     * @type {GradientRange} color
     */
    @property({
        type: GradientRange,
        displayOrder: 1,
    })
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
