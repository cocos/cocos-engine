import { repeat } from "../../../core/vmath";
import CurveRange from "./animator/curve-range";
import { CCClass } from "../../../core/data";
import { property, ccclass } from "../../../core/data/class-decorator";

@ccclass('cc.Burst')
export default class Burst {

    @property
    private _time: number = 0;

    @property
    get time () {
        return this._time;
    }

    set time (val) {
        this._time = val;
        this._curTime = val;
    }

    @property
    public minCount: number = 30;

    @property
    public maxCount: number = 30;

    @property
    private _repeatCount: number = 1;

    @property
    get repeatCount () {
        return this._repeatCount;
    }

    set repeatCount (val) {
        this._repeatCount = val;
        this._remainingCount = val;
    }

    @property
    public repeatInterval: number = 1;

    @property({
        type: CurveRange,
    })
    public count: CurveRange = new CurveRange();

    private _remainingCount: number;
    private _curTime: number;

    constructor () {
        this._remainingCount = 1;
        this._curTime = 0.0;
    }

    public update (psys, dt: number) {
        if (this._remainingCount === 0) {
            this._remainingCount = this._repeatCount;
            this._curTime = this._time;
        }
        if (this._remainingCount > 0) {
            let preFrameTime = repeat(psys._time - psys.startDelay.evaluate(), psys.duration) - dt;
            preFrameTime = (preFrameTime > 0.0) ? preFrameTime : 0.0;
            const curFrameTime = repeat(psys.time - psys.startDelay.evaluate(), psys.duration);
            if (this._curTime >= preFrameTime && this._curTime < curFrameTime) {
                psys.emit(this.count.evaluate(this._curTime / psys.duration, 1));
                this._curTime += this.repeatInterval;
                --this._remainingCount;
            }
        }
    }
}

// CCClass.fastDefine('cc.Burst', Burst, {
//     _time: 0,
//     minCount: 30,
//     maxCount: 30,
//     _repeatCount: 1,
//     repeatInterval: 1,
//     count: new CurveRange
// });
