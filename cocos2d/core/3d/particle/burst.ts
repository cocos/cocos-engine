import { ccclass, property } from '../../platform/CCClassDecorator';
import { repeat } from '../../value-types';
import CurveRange from './animator/curve-range';

/**
 * !#en The burst of 3d particle.
 * !#zh 3D 粒子发射时的爆发个数
 * @class Burst
 */
@ccclass('cc.Burst')
export default class Burst {

    @property
    _time = 0;

    /**
     * !#en Time between the start of the particle system and the trigger of this Brust
     * !#zh 粒子系统开始运行到触发此次 Brust 的时间
     * @property {Number} time
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
     * !#en Minimum number of emitted particles
     * !#zh 发射粒子的最小数量
     * @property {Number} minCount
     */
    @property
    minCount = 30;

    /**
     * !#en Maximum number of emitted particles
     * !#zh 发射粒子的最大数量
     * @property {Number} maxCount
     */
    @property
    maxCount = 30;

    @property
    _repeatCount = 1;

    /**
     * !#en The number of times Burst was triggered.
     * !#zh Burst 的触发次数
     * @property {Number} repeatCount
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
     * !#en Interval of each trigger
     * !#zh 每次触发的间隔时间
     * @property {Number} repeatInterval
     */
    @property
    repeatInterval = 1;

    /**
     * !#en Number of particles emitted
     * !#zh 发射的粒子的数量
     * @property {CurveRange} count
     */
    @property({
        type: CurveRange,
    })
    count = new CurveRange();

    _remainingCount = 0;
    _curTime = 0;

    constructor () {
        this._remainingCount = 0;
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
