
/**
 * @category particle
 */

import { ccclass, tooltip, displayOrder, type, serializable } from 'cc.decorator';
import { pseudoRandom, Vec3 } from '../../core/math';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';
import { ModuleRandSeed } from '../enum';

// tslint:disable: max-line-length
const SIZE_OVERTIME_RAND_OFFSET = ModuleRandSeed.SIZE;

@ccclass('cc.SizeOvertimeModule')
export default class SizeOvertimeModule extends ParticleModuleBase {
    @serializable
    _enable: Boolean = false;
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
     * @zh 决定是否在每个轴上独立控制粒子大小。
     */
    @serializable
    @displayOrder(1)
    @tooltip('决定是否在每个轴上独立控制粒子大小')
    public separateAxes = false;

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(2)
    @tooltip('定义一条曲线来决定粒子在其生命周期中的大小变化')
    public size = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(3)
    @tooltip('定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化')
    public x = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(4)
    @tooltip('定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化')
    public y = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。
     */
    @type(CurveRange)
    @serializable
    @displayOrder(5)
    @tooltip('定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化')
    public z = new CurveRange();

    public name = PARTICLE_MODULE_NAME.SIZE;

    public animate (particle: Particle, dt: number) {
        if (!this.separateAxes) {
            Vec3.multiplyScalar(particle.size, particle.startSize, this.size.evaluate(1 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET))!);
        } else {
            const currLifetime = 1 - particle.remainingLifetime / particle.startLifetime;
            const sizeRand = pseudoRandom(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET);
            particle.size.x = particle.startSize.x * this.x.evaluate(currLifetime, sizeRand)!;
            particle.size.y = particle.startSize.y * this.y.evaluate(currLifetime, sizeRand)!;
            particle.size.z = particle.startSize.z * this.z.evaluate(currLifetime, sizeRand)!;
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
