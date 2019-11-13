import { ccclass, property } from '../../../platform/CCClassDecorator';
import { pseudoRandom, Vec3 } from '../../../value-types';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const SIZE_OVERTIME_RAND_OFFSET = 39825;

@ccclass('cc.SizeOvertimeModule')
export default class SizeOvertimeModule {

    /**
     * @zh 是否启用。
     */
    @property
    enable = false;

    /**
     * @zh 决定是否在每个轴上独立控制粒子大小。
     */
    @property
    separateAxes = false;

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
     */
    @property({
        type: CurveRange,
    })
    size = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。
     */
    @property({
        type: CurveRange,
    })
    x = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
     */
    @property({
        type: CurveRange,
    })
    y = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。
     */
    @property({
        type: CurveRange,
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
