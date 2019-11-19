
/**
 * @category particle
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { pseudoRandom } from '../../core/math';
import Particle from '../particle';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const ROTATION_OVERTIME_RAND_OFFSET = 125292;

@ccclass('cc.RotationOvertimeModule')
export default class RotationOvertimeModule {

    /**
     * @zh 是否启用。
     */
    @property({
        displayOrder: 0,
    })
    public enable = false;

    @property
    private _separateAxes = false;

    /**
     * @zh 是否三个轴分开设定旋转（暂不支持）。
     */
    @property({
        displayOrder: 1,
        tooltip:'是否三个轴分开设定旋转（暂不支持）',
    })
    get separateAxes () {
        return this._separateAxes;
    }

    set separateAxes (val) {
        this._separateAxes = val;
    }

    /**
     * @zh 绕 X 轴设定旋转。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 2,
        tooltip:'绕 X 轴设定旋转',
    })
    public x = new CurveRange();

    /**
     * @zh 绕 Y 轴设定旋转。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 3,
        tooltip:'绕 Y 轴设定旋转',
    })
    public y = new CurveRange();

    /**
     * @zh 绕 Z 轴设定旋转。
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 4,
        tooltip:'绕 Z 轴设定旋转',
    })
    public z = new CurveRange();

    constructor () {

    }

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        if (!this._separateAxes) {
            p.rotation.z += this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET))! * dt;
        }
        else {
            // TODO: separateAxes is temporarily not supported!
            const rotationRand = pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET);
            p.rotation.x += this.x.evaluate(normalizedTime, rotationRand)! * dt;
            p.rotation.y += this.y.evaluate(normalizedTime, rotationRand)! * dt;
            p.rotation.z += this.z.evaluate(normalizedTime, rotationRand)! * dt;
        }
    }
}

// CCClass.fastDefine('cc.RotationOvertimeModule', RotationOvertimeModule, {
//     enable: false,
//     _separateAxes: false,
//     x: new CurveRange(),
//     y: new CurveRange(),
//     z: new CurveRange()
// });
