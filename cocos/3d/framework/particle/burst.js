import { repeat } from "../../../core/vmath";
import CurveRange from "./animator/curve-range";
import { CCClass } from "../../../core/data";


export default class Burst {

    _time = 0;

    get time() {
        return this._time;
    }

    set time(val) {
        this._time = val;
        this._curTime = val;
    }

    minCount = 30;

    maxCount = 30;

    _repeatCount = 1;

    get repeatCount() {
        return this._repeatCount;
    }

    set repeatCount(val) {
        this._repeatCount = val;
        this._remainingCount = val;
    }

    repeatInterval = 1;

    count = null;

    constructor() {
        this._remainingCount = 1;
        this._curTime = 0.0;
    }

    update(psys, dt) {
        if (psys.loop && this._remainingCount === 0) {
            this._remainingCount = this._repeatCount;
            this._curTime = this._time;
        }
        if (this._remainingCount > 0) {
            let preFrameTime = repeat(psys._time - psys.startDelay.evaluate(), psys.duration) - dt;
            preFrameTime = (preFrameTime > 0.0) ? preFrameTime : 0.0;
            let curFrameTime = repeat(psys.time - psys.startDelay.evaluate(), psys.duration);
            if (this._curTime >= preFrameTime && this._curTime < curFrameTime) {
                psys.emit(this.count.evaluate(this._curTime / psys.duration));
                this._curTime += this.repeatInterval;
                --this._remainingCount;
            }
        }
    }
}

CCClass.fastDefine('cc.Burst', Burst, {
    _time: 0,
    minCount: 30,
    maxCount: 30,
    _repeatCount: 1,
    repeatInterval: 1,
    count: new CurveRange
});
