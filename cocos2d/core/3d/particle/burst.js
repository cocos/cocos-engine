import { ccclass, property } from '../../platform/CCClassDecorator';
import { repeat } from '../../vmath';
import CurveRange from './animator/curve-range';

@ccclass('cc.Burst')
export default class Burst {

    _time = 0;

    /**
     * @zh 粒子系统开始运行到触发此次 Brust 的时间
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
     * @zh 发射粒子的最小数量
     */
    @property
    minCount = 30;

    /**
     * @zh 发射粒子的最大数量
     */
    @property
    maxCount = 30;

    _repeatCount = 1;

    /**
     * @zh Burst 的触发次数
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
     * @zh 每次触发的间隔时间
     */
    @property
    repeatInterval = 1;

    /**
     * @zh 发射的粒子的数量
     */
    @property({
        type: CurveRange,
    })
    count = new CurveRange();

    _remainingCount = 0;
    _curTime = 0;

    constructor () {
        this._remainingCount = 1;
        this._curTime = 0.0;
    }

    update (psys, dt) {
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

    getMaxCount (psys) {
        return this.count.getMax() * Math.min(Math.ceil(psys.duration / this.repeatInterval), this.repeatCount);
    }
}
