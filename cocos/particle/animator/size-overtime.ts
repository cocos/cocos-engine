
/**
 * @category particle
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { pseudoRandom, Vec3 } from '../../core/math';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';
import { ModuleRandSeed } from '../enum';

// tslint:disable: max-line-length
const SIZE_OVERTIME_RAND_OFFSET = ModuleRandSeed.SIZE;
/**
 * @en The size module of 3d particle.
 * @zh 3D 粒子的大小模块
 * @class SizeOvertimeModule
 */
@ccclass('cc.SizeOvertimeModule')
export default class SizeOvertimeModule extends ParticleModuleBase {
    @property
    _enable: Boolean = false;
    /**
     * @en The enable of SizeOvertimeModule.
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
     * @en Decide whether to control particle size independently on each axis.
     * @zh 决定是否在每个轴上独立控制粒子大小。
     * @property {Boolean} separateAxes
     */
    @property({
        displayOrder: 1,
        tooltip:'i18n:particle.size_separate',
    })
    public separateAxes = false;

    /**
     * @en Define a curve to determine the size change of particles during their life cycle.
     * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
     * @property {CurveRange} size
     */
    @property({
        type: CurveRange,
        displayOrder: 2,
        tooltip:'i18n:particle.size_v',
    })
    public size = new CurveRange();

    /**
     * @en Defines a curve to determine the size change of particles in the X-axis direction during their life cycle.
     * @zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。
     * @property {CurveRange} x
     */
    @property({
        type: CurveRange,
        displayOrder: 3,
        tooltip:'i18n:particle.size_x',
    })
    public x = new CurveRange();

    /**
     * @en Defines a curve to determine the size change of particles in the Y-axis direction during their life cycle.
     * @zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
     * @property {CurveRange} y
     */
    @property({
        type: CurveRange,
        displayOrder: 4,
        tooltip:'i18n:particle.size_y',
    })
    public y = new CurveRange();

    /**
     * @en Defines a curve to determine the size change of particles in the Z-axis direction during their life cycle.
     * @zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。
     * @property {CurveRange} z
     */
    @property({
        type: CurveRange,
        displayOrder: 5,
        tooltip:'i18n:particle.size_z',
    })
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
