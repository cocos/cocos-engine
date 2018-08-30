/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * @module cc
 */

/**
 * !#en
 * Creates the action easing object with the rate parameter. <br />
 * From slow to fast.
 * !#zh 创建 easeIn 缓动对象，由慢到快。
 * @method easeIn
 * @param {Number} rate
 * @return {Object}
 * @example
 * action.easing(cc.easeIn(3.0));
 */
cc.easeIn = function (rate) {
    return {
        _rate: rate,
        easing: function (dt) {
            return Math.pow(dt, this._rate);
        },
        reverse: function(){
            return cc.easeIn(1 / this._rate);
        }
    };
};

/**
 * !#en
 * Creates the action easing object with the rate parameter. <br />
 * From fast to slow.
 * !#zh 创建 easeOut 缓动对象，由快到慢。
 * @method easeOut
 * @param {Number} rate
 * @return {Object}
 * @example
 * action.easing(cc.easeOut(3.0));
 */
cc.easeOut = function (rate) {
    return {
        _rate: rate,
        easing: function (dt) {
            return Math.pow(dt, 1 / this._rate);
        },
        reverse: function(){
            return cc.easeOut(1 / this._rate);
        }
    };
};

/**
 * !#en
 * Creates the action easing object with the rate parameter. <br />
 * Slow to fast then to slow.
 * !#zh 创建 easeInOut 缓动对象，慢到快，然后慢。
 * @method easeInOut
 * @param {Number} rate
 * @return {Object}
 *
 * @example
 * action.easing(cc.easeInOut(3.0));
 */
cc.easeInOut = function (rate) {
    return {
        _rate: rate,
        easing: function (dt) {
            dt *= 2;
            if (dt < 1)
                return 0.5 * Math.pow(dt, this._rate);
            else
                return 1.0 - 0.5 * Math.pow(2 - dt, this._rate);
        },
        reverse: function(){
            return cc.easeInOut(this._rate);
        }
    };
};

/**
 * !#en
 * Creates the action easing object with the rate parameter. <br />
 * Reference easeInExpo: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeExponentialIn 缓动对象。<br />
 * EaseExponentialIn 是按指数函数缓动进入的动作。<br />
 * 参考 easeInExpo：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeExponentialIn
 * @return {Object}
 * @example
 * action.easing(cc.easeExponentialIn());
 */
var _easeExponentialInObj = {
    easing: function(dt){
        return dt === 0 ? 0 : Math.pow(2, 10 * (dt - 1));
    },
    reverse: function(){
        return _easeExponentialOutObj;
    }
};
cc.easeExponentialIn = function(){
    return _easeExponentialInObj;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeOutExpo: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeExponentialOut 缓动对象。<br />
 * EaseExponentialOut 是按指数函数缓动退出的动作。<br />
 * 参考 easeOutExpo：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeExponentialOut
 * @return {Object}
 * @example
 * action.easing(cc.easeExponentialOut());
 */
var _easeExponentialOutObj = {
    easing: function(dt){
        return dt === 1 ? 1 : (-(Math.pow(2, -10 * dt)) + 1);
    },
    reverse: function(){
        return _easeExponentialInObj;
    }
};
cc.easeExponentialOut = function(){
    return _easeExponentialOutObj;
};

/**
 * !#en
 * Creates an EaseExponentialInOut action easing object. <br />
 * Reference easeInOutExpo: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeExponentialInOut 缓动对象。<br />
 * EaseExponentialInOut 是按指数函数缓动进入并退出的动作。<br />
 * 参考 easeInOutExpo：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeExponentialInOut
 * @return {Object}
 * @example
 * action.easing(cc.easeExponentialInOut());
 */
var _easeExponentialInOutObj = {
    easing: function(dt){
        if( dt !== 1 && dt !== 0) {
            dt *= 2;
            if (dt < 1)
                return 0.5 * Math.pow(2, 10 * (dt - 1));
            else
                return 0.5 * (-Math.pow(2, -10 * (dt - 1)) + 2);
        }
        return dt;
    },
    reverse: function(){
        return _easeExponentialInOutObj;
    }
};
cc.easeExponentialInOut = function(){
    return _easeExponentialInOutObj;
};

/**
 * !#en
 * Creates an EaseSineIn action. <br />
 * Reference easeInSine: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 EaseSineIn 缓动对象。<br />
 * EaseSineIn 是按正弦函数缓动进入的动作。<br />
 * 参考 easeInSine：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeSineIn
 * @return {Object}
 * @example
 * action.easing(cc.easeSineIn());
 */
var _easeSineInObj = {
    easing: function(dt){
        return (dt===0 || dt===1) ? dt : -1 * Math.cos(dt * Math.PI / 2) + 1;
    },
    reverse: function(){
        return _easeSineOutObj;
    }
};
cc.easeSineIn = function(){
    return _easeSineInObj;
};

/**
 * !#en
 * Creates an EaseSineOut action easing object. <br />
 * Reference easeOutSine: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 EaseSineOut 缓动对象。<br />
 * EaseSineIn 是按正弦函数缓动退出的动作。<br />
 * 参考 easeOutSine：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeSineOut
 * @return {Object}
 * @example
 * action.easing(cc.easeSineOut());
 */
var _easeSineOutObj = {
    easing: function(dt){
        return (dt===0 || dt===1) ? dt : Math.sin(dt * Math.PI / 2);
    },
    reverse: function(){
        return _easeSineInObj;
    }
};
cc.easeSineOut = function(){
    return _easeSineOutObj;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeInOutSine: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeSineInOut 缓动对象。<br />
 * EaseSineIn 是按正弦函数缓动进入并退出的动作。<br />
 * 参考 easeInOutSine：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeSineInOut
 * @return {Object}
 * @example
 * action.easing(cc.easeSineInOut());
 */
var _easeSineInOutObj = {
    easing: function(dt){
        return (dt === 0 || dt === 1) ? dt : -0.5 * (Math.cos(Math.PI * dt) - 1);
    },
    reverse: function(){
        return _easeSineInOutObj;
    }
};
cc.easeSineInOut = function(){
    return _easeSineInOutObj;
};

/**
 * @module cc
 */

/**
 * !#en
 * Creates the action easing object with the period in radians (default is 0.3). <br />
 * Reference easeInElastic: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeElasticIn 缓动对象。<br />
 * EaseElasticIn 是按弹性曲线缓动进入的动作。<br />
 * 参数 easeInElastic：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeElasticIn
 * @param {Number} period
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeElasticIn(3.0));
 */
//default ease elastic in object (period = 0.3)
var _easeElasticInObj = {
    easing:function(dt){
        if (dt === 0 || dt === 1)
            return dt;
        dt = dt - 1;
        return -Math.pow(2, 10 * dt) * Math.sin((dt - (0.3 / 4)) * Math.PI * 2 / 0.3);
    },
     reverse:function(){
         return _easeElasticOutObj;
     }
 };
cc.easeElasticIn = function (period) {
    if(period && period !== 0.3){
        return {
            _period: period,
            easing: function (dt) {
                if (dt === 0 || dt === 1)
                    return dt;
                dt = dt - 1;
                return -Math.pow(2, 10 * dt) * Math.sin((dt - (this._period / 4)) * Math.PI * 2 / this._period);
            },
            reverse:function () {
                return cc.easeElasticOut(this._period);
            }
        };
    }
    return _easeElasticInObj;
};

/**
 * !#en
 * Creates the action easing object with the period in radians (default is 0.3). <br />
 * Reference easeOutElastic: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeElasticOut 缓动对象。<br />
 * EaseElasticOut 是按弹性曲线缓动退出的动作。<br />
 * 参考 easeOutElastic：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeElasticOut
 * @param {Number} period
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeElasticOut(3.0));
 */
//default ease elastic out object (period = 0.3)
var _easeElasticOutObj = {
    easing: function (dt) {
        return (dt === 0 || dt === 1) ? dt : Math.pow(2, -10 * dt) * Math.sin((dt - (0.3 / 4)) * Math.PI * 2 / 0.3) + 1;
    },
    reverse:function(){
        return _easeElasticInObj;
    }
};
cc.easeElasticOut = function (period) {
    if(period && period !== 0.3){
        return {
            _period: period,
            easing: function (dt) {
                return (dt === 0 || dt === 1) ? dt : Math.pow(2, -10 * dt) * Math.sin((dt - (this._period / 4)) * Math.PI * 2 / this._period) + 1;
            },
            reverse:function(){
                return cc.easeElasticIn(this._period);
            }
        };
    }
    return _easeElasticOutObj;
};

/**
 * !#en
 * Creates the action easing object with the period in radians (default is 0.3). <br />
 * Reference easeInOutElastic: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeElasticInOut 缓动对象。<br />
 * EaseElasticInOut 是按弹性曲线缓动进入并退出的动作。<br />
 * 参考 easeInOutElastic：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeElasticInOut
 * @param {Number} period
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeElasticInOut(3.0));
 */
cc.easeElasticInOut = function (period) {
    period = period || 0.3;
    return {
        _period: period,
        easing: function (dt) {
            var newT = 0;
            var locPeriod = this._period;
            if (dt === 0 || dt === 1) {
                newT = dt;
            } else {
                dt = dt * 2;
                if (!locPeriod)
                    locPeriod = this._period = 0.3 * 1.5;
                var s = locPeriod / 4;
                dt = dt - 1;
                if (dt < 0)
                    newT = -0.5 * Math.pow(2, 10 * dt) * Math.sin((dt - s) * Math.PI * 2 / locPeriod);
                else
                    newT = Math.pow(2, -10 * dt) * Math.sin((dt - s) * Math.PI * 2 / locPeriod) * 0.5 + 1;
            }
            return newT;
        },
        reverse: function(){
            return cc.easeElasticInOut(this._period);
        }
    };
};

/**
 * @module cc
 */

function _bounceTime (time1) {
    if (time1 < 1 / 2.75) {
        return 7.5625 * time1 * time1;
    } else if (time1 < 2 / 2.75) {
        time1 -= 1.5 / 2.75;
        return 7.5625 * time1 * time1 + 0.75;
    } else if (time1 < 2.5 / 2.75) {
        time1 -= 2.25 / 2.75;
        return 7.5625 * time1 * time1 + 0.9375;
    }

    time1 -= 2.625 / 2.75;
    return 7.5625 * time1 * time1 + 0.984375;
};

var _easeBounceInObj = {
    easing: function(dt){
        return 1 - _bounceTime(1 - dt);
    },
    reverse: function(){
        return _easeBounceOutObj;
    }
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Eased bounce effect at the beginning.
 * !#zh
 * 创建 easeBounceIn 缓动对象。<br />
 * EaseBounceIn 是按弹跳动作缓动进入的动作。
 * @method easeBounceIn
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBounceIn());
 */
cc.easeBounceIn = function(){
    return _easeBounceInObj;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Eased bounce effect at the ending.
 * !#zh
 * 创建 easeBounceOut 缓动对象。<br />
 * EaseBounceOut 是按弹跳动作缓动退出的动作。
 * @method easeBounceOut
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBounceOut());
 */
var _easeBounceOutObj = {
    easing: function(dt){
        return _bounceTime(dt);
    },
    reverse:function () {
        return _easeBounceInObj;
    }
};
cc.easeBounceOut = function(){
    return _easeBounceOutObj;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Eased bounce effect at the begining and ending.
 * !#zh
 * 创建 easeBounceInOut 缓动对象。<br />
 * EaseBounceInOut 是按弹跳动作缓动进入并退出的动作。
 * @method easeBounceInOut
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBounceInOut());
 */
var _easeBounceInOutObj = {
    easing: function (time1) {
        var newT;
        if (time1 < 0.5) {
            time1 = time1 * 2;
            newT = (1 - _bounceTime(1 - time1)) * 0.5;
        } else {
            newT = _bounceTime(time1 * 2 - 1) * 0.5 + 0.5;
        }
        return newT;
    },
    reverse: function(){
        return _easeBounceInOutObj;
    }
};
cc.easeBounceInOut = function(){
    return _easeBounceInOutObj;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * In the opposite direction to move slowly, and then accelerated to the right direction.
 * !#zh
 * 创建 easeBackIn 缓动对象。<br />
 * easeBackIn 是在相反的方向缓慢移动，然后加速到正确的方向。<br />
 * @method easeBackIn
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBackIn());
 */
var _easeBackInObj = {
    easing: function (time1) {
        var overshoot = 1.70158;
        return (time1===0 || time1===1) ? time1 : time1 * time1 * ((overshoot + 1) * time1 - overshoot);
    },
    reverse: function(){
        return _easeBackOutObj;
    }
};
cc.easeBackIn = function(){
    return _easeBackInObj;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Fast moving more than the finish, and then slowly back to the finish.
 * !#zh
 * 创建 easeBackOut 缓动对象。<br />
 * easeBackOut 快速移动超出目标，然后慢慢回到目标点。
 * @method easeBackOut
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBackOut());
 */
var _easeBackOutObj = {
    easing: function (time1) {
        var overshoot = 1.70158;
        time1 = time1 - 1;
        return time1 * time1 * ((overshoot + 1) * time1 + overshoot) + 1;
    },
    reverse: function(){
        return _easeBackInObj;
    }
};
cc.easeBackOut = function(){
    return _easeBackOutObj;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Begining of cc.EaseBackIn. Ending of cc.EaseBackOut.
 * !#zh
 * 创建 easeBackInOut 缓动对象。<br />
 * @method easeBackInOut
 * @return {Object}
 * @example
 * // example
 * action.easing(cc.easeBackInOut());
 */
var _easeBackInOutObj = {
    easing: function (time1) {
        var overshoot = 1.70158 * 1.525;
        time1 = time1 * 2;
        if (time1 < 1) {
            return (time1 * time1 * ((overshoot + 1) * time1 - overshoot)) / 2;
        } else {
            time1 = time1 - 2;
            return (time1 * time1 * ((overshoot + 1) * time1 + overshoot)) / 2 + 1;
        }
    },
    reverse: function(){
        return _easeBackInOutObj;
    }
};
cc.easeBackInOut = function(){
    return _easeBackInOutObj;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Into the 4 reference point. <br />
 * To calculate the motion curve.
 * !#zh
 * 创建 easeBezierAction 缓动对象。<br />
 * EaseBezierAction 是按贝塞尔曲线缓动的动作。
 * @method easeBezierAction
 * @param {Number} p0 The first bezier parameter
 * @param {Number} p1 The second bezier parameter
 * @param {Number} p2 The third bezier parameter
 * @param {Number} p3 The fourth bezier parameter
 * @returns {Object}
 * @example
 * // example
 * action.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0));
 */
cc.easeBezierAction = function(a, b, c, d){
    return {
        easing: function(t){
            return (Math.pow(1-t,3) * a + 3*t*(Math.pow(1-t,2))*b + 3*Math.pow(t,2)*(1-t)*c + Math.pow(t,3)*d);
        },
        reverse: function(){
            return cc.easeBezierAction(d, c, b, a);
        }
    };
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeInQuad: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeQuadraticActionIn 缓动对象。<br />
 * EaseQuadraticIn是按二次函数缓动进入的动作。<br />
 * 参考 easeInQuad：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeQuadraticActionIn
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuadraticActionIn());
 */
var _easeQuadraticActionIn = {
    easing: function(time){
        return Math.pow(time, 2);
    },
    reverse: function(){
        return _easeQuadraticActionIn;
    }
};
cc.easeQuadraticActionIn = function(){
    return _easeQuadraticActionIn;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeOutQuad: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeQuadraticActionOut 缓动对象。<br />
 * EaseQuadraticOut 是按二次函数缓动退出的动作。<br />
 * 参考 easeOutQuad：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeQuadraticActionOut
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuadraticActionOut());
 */
var _easeQuadraticActionOut = {
    easing: function(time){
        return -time*(time-2);
    },
    reverse: function(){
        return _easeQuadraticActionOut;
    }
};
cc.easeQuadraticActionOut = function(){
    return _easeQuadraticActionOut;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeInOutQuad: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeQuadraticActionInOut 缓动对象。<br />
 * EaseQuadraticInOut 是按二次函数缓动进入并退出的动作。<br />
 * 参考 easeInOutQuad：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeQuadraticActionInOut
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuadraticActionInOut());
 */
var _easeQuadraticActionInOut = {
    easing: function(time){
        var resultTime = time;
        time *= 2;
        if(time < 1){
            resultTime = time * time * 0.5;
        }else{
            --time;
            resultTime = -0.5 * ( time * ( time - 2 ) - 1)
        }
        return resultTime;
    },
    reverse: function(){
        return _easeQuadraticActionInOut;
    }
};
cc.easeQuadraticActionInOut = function(){
    return _easeQuadraticActionInOut;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeIntQuart: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeQuarticActionIn 缓动对象。<br />
 * EaseQuarticIn 是按四次函数缓动进入的动作。<br />
 * 参考 easeIntQuart：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeQuarticActionIn
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuarticActionIn());
 */
var _easeQuarticActionIn = {
    easing: function(time){
        return time * time * time * time;
    },
    reverse: function(){
        return _easeQuarticActionIn;
    }
};
cc.easeQuarticActionIn = function(){
    return _easeQuarticActionIn;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeOutQuart: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeQuarticActionOut 缓动对象。<br />
 * EaseQuarticOut 是按四次函数缓动退出的动作。<br />
 * 参考 easeOutQuart：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeQuarticActionOut
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.QuarticActionOut());
 */
var _easeQuarticActionOut = {
    easing: function(time){
        time -= 1;
        return -(time * time * time * time - 1);
    },
    reverse: function(){
        return _easeQuarticActionOut;
    }
};
cc.easeQuarticActionOut = function(){
    return _easeQuarticActionOut;
};

/**
 * !#en
 * Creates the action easing object.  <br />
 * Reference easeInOutQuart: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeQuarticActionInOut 缓动对象。<br />
 * EaseQuarticInOut 是按四次函数缓动进入并退出的动作。<br />
 * 参考 easeInOutQuart：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeQuarticActionInOut
 * @returns {Object}
 */
var _easeQuarticActionInOut = {
    easing: function(time){
        time = time*2;
        if (time < 1)
            return 0.5 * time * time * time * time;
        time -= 2;
        return -0.5 * (time * time * time * time - 2);
    },
    reverse: function(){
        return _easeQuarticActionInOut;
    }
};
cc.easeQuarticActionInOut = function(){
    return _easeQuarticActionInOut;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeInQuint: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeQuinticActionIn 缓动对象。<br />
 * EaseQuinticIn 是按五次函数缓动进的动作。<br />
 * 参考 easeInQuint：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeQuinticActionIn
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuinticActionIn());
 */
var _easeQuinticActionIn = {
    easing: function(time){
        return time * time * time * time * time;
    },
    reverse: function(){
        return _easeQuinticActionIn;
    }
};
cc.easeQuinticActionIn = function(){
    return _easeQuinticActionIn;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeOutQuint: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeQuinticActionOut 缓动对象。<br />
 * EaseQuinticOut 是按五次函数缓动退出的动作
 * 参考 easeOutQuint：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeQuinticActionOut
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuadraticActionOut());
 */
var _easeQuinticActionOut = {
    easing: function(time){
        time -=1;
        return (time * time * time * time * time + 1);
    },
    reverse: function(){
        return _easeQuinticActionOut;
    }
};
cc.easeQuinticActionOut = function(){
    return _easeQuinticActionOut;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeInOutQuint: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeQuinticActionInOut 缓动对象。<br />
 * EaseQuinticInOut是按五次函数缓动进入并退出的动作。<br />
 * 参考 easeInOutQuint：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeQuinticActionInOut
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeQuinticActionInOut());
 */
var _easeQuinticActionInOut = {
    easing: function(time){
        time = time*2;
        if (time < 1)
            return 0.5 * time * time * time * time * time;
        time -= 2;
        return 0.5 * (time * time * time * time * time + 2);
    },
    reverse: function(){
        return _easeQuinticActionInOut;
    }
};
cc.easeQuinticActionInOut = function(){
    return _easeQuinticActionInOut;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeInCirc: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeCircleActionIn 缓动对象。<br />
 * EaseCircleIn是按圆形曲线缓动进入的动作。<br />
 * 参考 easeInCirc：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeCircleActionIn
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeCircleActionIn());
 */
var _easeCircleActionIn = {
    easing: function(time){
        return -1 * (Math.sqrt(1 - time * time) - 1);
    },
    reverse: function(){
        return _easeCircleActionIn;
    }
};
cc.easeCircleActionIn = function(){
    return _easeCircleActionIn;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeOutCirc: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeCircleActionOut 缓动对象。<br />
 * EaseCircleOut是按圆形曲线缓动退出的动作。<br />
 * 参考 easeOutCirc：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeCircleActionOut
 * @returns {Object}
 * @example
 * //example
 * actioneasing(cc.easeCircleActionOut());
 */
var _easeCircleActionOut = {
    easing: function(time){
        time = time - 1;
        return Math.sqrt(1 - time * time);
    },
    reverse: function(){
        return _easeCircleActionOut;
    }
};
cc.easeCircleActionOut = function(){
    return _easeCircleActionOut;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeInOutCirc: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeCircleActionInOut 缓动对象。<br />
 * EaseCircleInOut 是按圆形曲线缓动进入并退出的动作。<br />
 * 参考 easeInOutCirc：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeCircleActionInOut
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeCircleActionInOut());
 */
var _easeCircleActionInOut = {
    easing: function(time){
        time = time * 2;
        if (time < 1)
            return -0.5 * (Math.sqrt(1 - time * time) - 1);
        time -= 2;
        return 0.5 * (Math.sqrt(1 - time * time) + 1);
    },
    reverse: function(){
        return _easeCircleActionInOut;
    }
};
cc.easeCircleActionInOut = function(){
    return _easeCircleActionInOut;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeInCubic: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeCubicActionIn 缓动对象。<br />
 * EaseCubicIn 是按三次函数缓动进入的动作。<br />
 * 参考 easeInCubic：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeCubicActionIn
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeCubicActionIn());
 */
var _easeCubicActionIn = {
    easing: function(time){
        return time * time * time;
    },
    reverse: function(){
        return _easeCubicActionIn;
    }
};
cc.easeCubicActionIn = function(){
    return _easeCubicActionIn;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeOutCubic: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeCubicActionOut 缓动对象。<br />
 * EaseCubicOut 是按三次函数缓动退出的动作。<br />
 * 参考 easeOutCubic：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeCubicActionOut
 * @returns {Object}
 * @example
 * //example
 * action.easing(cc.easeCubicActionOut());
 */
var _easeCubicActionOut = {
    easing: function(time){
        time -= 1;
        return (time * time * time + 1);
    },
    reverse: function(){
        return _easeCubicActionOut;
    }
};
cc.easeCubicActionOut = function(){
    return _easeCubicActionOut;
};

/**
 * !#en
 * Creates the action easing object. <br />
 * Reference easeInOutCubic: <br />
 * http://www.zhihu.com/question/21981571/answer/19925418
 * !#zh
 * 创建 easeCubicActionInOut 缓动对象。<br />
 * EaseCubicInOut是按三次函数缓动进入并退出的动作。<br />
 * 参考 easeInOutCubic：http://www.zhihu.com/question/21981571/answer/19925418
 * @method easeCubicActionInOut
 * @returns {Object}
 */
var _easeCubicActionInOut = {
    easing: function(time){
        time = time*2;
        if (time < 1)
            return 0.5 * time * time * time;
        time -= 2;
        return 0.5 * (time * time * time + 2);
    },
    reverse: function(){
        return _easeCubicActionInOut;
    }
};
cc.easeCubicActionInOut = function(){
    return _easeCubicActionInOut;
};

