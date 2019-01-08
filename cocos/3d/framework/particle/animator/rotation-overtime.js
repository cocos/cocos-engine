import { pseudoRandom } from "../../../../core/vmath";
import { CCClass } from "../../../../core/data";
import CurveRange from "./curve-range";
import { property, ccclass } from "../../../../core/data/class-decorator";

const ROTATION_OVERTIME_RAND_OFFSET = 125292;

@ccclass('cc.RotationOvertimeModule')
export default class RotationOvertimeModule {

    @property
    enable = false;

    @property
    _separateAxes = false;

    get separateAxes() {
        return this._separateAxes;
    }

    set separateAxes(val) {
        if (!val) {
            this._separateAxes = val;
        }
        else {
            console.error('rotation overtime separateAxes is not supported!');
        }
    }

    @property({
        type: CurveRange
    })
    x = new CurveRange();

    @property({
        type: CurveRange
    })
    y = new CurveRange();

    @property({
        type: CurveRange
    })
    z = new CurveRange();

    constructor() {

    }

    animate(p, dt) {
        let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        if (!this._separateAxes) {
            p.rotation.x += this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET)) * dt;
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
