
/**
 * @category particle
 */

import { ccclass, property } from '../../../../core/data/class-decorator';
import { pseudoRandom, Vec3 } from '../../../../core/math';
import Particle from '../particle';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const SIZE_OVERTIME_RAND_OFFSET = 39825;

@ccclass('cc.SizeOvertimeModule')
export default class SizeOvertimeModule {

    /**
     * @zh 是否启用。
     */
    @property({
        displayOrder: 0,
    })
    public enable = false;

    /**
     * @zh 决定是否在每个轴上独立控制粒子大小。
     */
    @property({
        displayOrder: 1,
    })
    public separateAxes = false;

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
     */
    @property({
        type: CurveRange,
        displayOrder: 2,
    })
    public size = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。
     */
    @property({
        type: CurveRange,
        displayOrder: 3,
    })
    public x = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
     */
    @property({
        type: CurveRange,
        displayOrder: 4,
    })
    public y = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。
     */
    @property({
        type: CurveRange,
        displayOrder: 5,
    })
    public z = new CurveRange();

    public animate (particle: Particle) {
        if (!this.separateAxes) {
            Vec3.multiplyScalar(particle.size, particle.startSize, this.size.evaluate(1 - particle.remainingLifetime / particle.startLifetime, pseudoRandom(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET))!);
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
