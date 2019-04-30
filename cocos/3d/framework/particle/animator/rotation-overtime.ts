import { pseudoRandom } from "../../../../core/vmath";
import { CCClass } from "../../../../core/data";
import CurveRange from "./curve-range";
import { property, ccclass } from "../../../../core/data/class-decorator";
import Particle from "../particle";

// tslint:disable: max-line-length
const ROTATION_OVERTIME_RAND_OFFSET = 125292;

@ccclass('cc.RotationOvertimeModule')
export default class RotationOvertimeModule {

    /**
     * 是否启用
     */
    @property({
        displayOrder: 0,
    })
    public enable = false;

    @property
    private _separateAxes = false;

    /**
     * 是否三个轴分开设定旋转（暂不支持）
     */
    @property({
        displayOrder: 1,
    })
    get separateAxes () {
        return this._separateAxes;
    }

    set separateAxes (val) {
        if (!val) {
            this._separateAxes = val;
        }
        else {
            console.error('rotation overtime separateAxes is not supported!');
        }
    }

    /**
     * 绕 X 轴设定旋转
     */
    @property({
        type: CurveRange,
        displayOrder: 2,
    })
    public x = new CurveRange();

    /**
     * 绕 Y 轴设定旋转
     */
    @property({
        type: CurveRange,
        displayOrder: 3,
    })
    public y = new CurveRange();

    /**
     * 绕 X 轴设定旋转
     */
    @property({
        type: CurveRange,
        displayOrder: 4,
    })
    public z = new CurveRange();

    constructor () {

    }

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        if (!this._separateAxes) {
            p.rotation.x += this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET))! * dt;
        }
        else {
            // TODO: separateAxes is temporarily not supported!
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
