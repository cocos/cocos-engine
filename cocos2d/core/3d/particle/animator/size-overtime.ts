import { ccclass, property } from '../../../platform/CCClassDecorator';
import { pseudoRandom, Vec3 } from '../../../value-types';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const SIZE_OVERTIME_RAND_OFFSET = 39825;

/**
 * !#en The size module of 3d particle.
 * !#zh 3D 粒子的大小模块
 * @class SizeOvertimeModule
 */
@ccclass('cc.SizeOvertimeModule')
export default class SizeOvertimeModule {

    /**
     * !#en The enable of SizeOvertimeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    @property
    enable = false;

    /**
     * !#en Decide whether to control particle size independently on each axis.
     * !#zh 决定是否在每个轴上独立控制粒子大小。
     * @property {Boolean} separateAxes
     */
    @property
    separateAxes = false;

    /**
     * !#en Define a curve to determine the size change of particles during their life cycle.
     * !#zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
     * @property {CurveRange} size
     */
    @property({
        type: CurveRange,
        visible: function (this) {
            return !this.separateAxes;
        }
    })
    size = new CurveRange();

    /**
     * !#en Defines a curve to determine the size change of particles in the X-axis direction during their life cycle.
     * !#zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。
     * @property {CurveRange} x
     */
    @property({
        type: CurveRange,
        visible: function (this) {
            return this.separateAxes;
        }
    })
    x = new CurveRange();

    /**
     * !#en Defines a curve to determine the size change of particles in the Y-axis direction during their life cycle.
     * !#zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
     * @property {CurveRange} y
     */
    @property({
        type: CurveRange,
        visible: function (this) {
            return this.separateAxes;
        }
    })
    y = new CurveRange();

    /**
     * !#en Defines a curve to determine the size change of particles in the Z-axis direction during their life cycle.
     * !#zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。
     * @property {CurveRange} z
     */
    @property({
        type: CurveRange,
        visible: function (this) {
            return this.separateAxes;
        }
    })
    z = new CurveRange();

    animate (particle) {
        if (!this.separateAxes) {
            Vec3.scale(particle.size, particle.startSize, this.size.evaluate(1 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET)));
        } else {
            const currLifetime = 1 - particle.remainingLifetime / particle.startLifetime;
            const sizeRand = pseudoRandom(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET);
            particle.size.x = particle.startSize.x * this.x.evaluate(currLifetime, sizeRand);
            particle.size.y = particle.startSize.y * this.y.evaluate(currLifetime, sizeRand);
            particle.size.z = particle.startSize.z * this.z.evaluate(currLifetime, sizeRand);
        }
    }
}
