/**
 * @hidden
 */

import { CCClass } from '../../../core/data';
import { ccclass, property } from '../../../core/data/class-decorator';
import { repeat } from '../../../core/value-types';
import CurveRange from './animator/curve-range';

@ccclass('cc.Burst')
export default class Burst {

    @property
    private _time: number = 0;

    /**
     * @zh 粒子系统开始运行到触发此次 Brust 的时间。
     */
    @property
    get time () {
        return this._time;
    }

    set time (val) {
        this._time = val;
        this._curTime = val;
    }

    /**
     * @zh 发射粒子的最小数量。
     */
    @property
    public minCount: number = 30;

    /**
     * @zh 发射粒子的最大数量。
     */
    @property
    public maxCount: number = 30;

    @property
    private _repeatCount: number = 1;

    /**
     * @zh Burst 的触发次数。
     */
    @property
    get repeatCount () {
        return this._repeatCount;
    }

    set repeatCount (val) {
        this._repeatCount = val;
        this._remainingCount = val;
    }

    /**
     * @zh 每次触发的间隔时间。
     */
    @property
    public repeatInterval: number = 1;

    /**
     * @zh 发射的粒子的数量。
     */
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
            let preFrameTime = repeat(psys._time - psys.startDelay.evaluate(0, 1), psys.duration) - dt;
            preFrameTime = (preFrameTime > 0.0) ? preFrameTime : 0.0;
            const curFrameTime = repeat(psys.time - psys.startDelay.evaluate(0, 1), psys.duration);
            if (this._curTime >= preFrameTime && this._curTime < curFrameTime) {
                psys.emit(this.count.evaluate(this._curTime / psys.duration, 1), dt - (curFrameTime - this._curTime));
                this._curTime += this.repeatInterval;
                --this._remainingCount;
            }
        }
    }

    public getMaxCount (psys) {
        return this.count.getMax() * Math.min(Math.ceil(psys.duration / this.repeatInterval), this.repeatCount);
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
