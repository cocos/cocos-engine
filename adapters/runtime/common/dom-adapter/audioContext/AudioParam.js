class AudioParam {
    constructor(options = {}) {
        this.automationRate = options.automationRate || "a-rate";
        this._defaultValue = options.defaultValue || 1;
        this._maxValue  = options.maxValue || Number.MAX_VALUE;
        this._minValue = options.minValue || -Number.MAX_VALUE;
        this.value = options.value || 1;
    }

    get defaultValue() {
        return this._defaultValue;
    }

    get maxValue() {
        return this._maxValue;
    }

    get minValue() {
        return this._minValue;
    }

    set value(value) {
        value = Math.min(this._maxValue, value);
        this._value = Math.max(this._minValue, value);
    }

    get value() {
        return this._value;
    }

    /**
     * 计划AudioParam在一个精确的时间瞬间改变到的值，如下所示AudioContext.currentTime。新值由value参数给出。
     * @param value 一个浮点数，表示AudioParam在给定时间将更改为的值。
     * @param startTime 开始时间 一个double，表示AudioContext首次创建后将发生值更改的时间（以秒为单位）。TypeError如果此值为负，则抛出A.
     */
    setValueAtTime(value, startTime) {
        this.value = value;
    }

    /**
     * 计划的价值逐渐线性变化AudioParam。更改从上一个事件指定的时间开始，遵循线性斜坡到value参数中给出的新值，并在endTime参数中给定的时间达到新值。
     * @param value 一个浮点数，表示AudioParam将按给定时间斜坡变化的值。
     * @param endTime 一个双精度表示斜坡开始后的确切时间（以秒为单位），将停止更改值
     */
    linearRampToValueAtTime(value, endTime) {
        if(endTime < 0) {
            return;
        }
        let k = value / endTime;
        let self = this;

        let func = function(dt) {
            dt = dt/1000;
            if(dt > endTime) {
                dt = endTime;
            }
            if(dt < 0) {
                dt = 0;
            }
            endTime -= dt;
            self.value += dt * k;

            if(endTime > 0) {
                requestAnimationFrame(func);
            }
        };
        requestAnimationFrame(func);
    }
    // 计划的价值逐渐呈指数变化AudioParam。更改从上一个事件指定的时间开始，遵循指数斜坡到value参数中给出的新值，并在endTime参数中给定的时间达到新值。
    exponentialRampToValueAtTime() {

    }

    /**
     * TODO 安排更改开始的时间AudioParam。更改从指定的时间开始，startTime并以指数方式移向target参数给定的值。指数衰减率由timeConstant参数定义，该参数是以秒为单位测量的时间。
     * @param target
     * @param startTime
     * @param timeConstant
     */
    setTargetAtTime(target, startTime, timeConstant) {
        this.value = target;
    }
    // 计划值的值AudioParam遵循一组值，这些值由缩放以适合给定间隔的浮点数数组定义，从给定的开始时间开始并跨越给定的持续时间。
    setValueCurveAtTime() {

    }
    // 取消所有预定的未来更改AudioParam。
    cancelScheduledValues() {

    }
    // 取消所有计划的未来更改，AudioParam 但在给定时间保持其值，直到使用其他方法进行进一步更改。
    cancelAndHoldAtTime() {

    }
}

export default AudioParam;