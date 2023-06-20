/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

// Easing functions specify the speed at which an animation progresses at different points within the animation.

/**
 * @en Not any easing effect.
 * @zh 没有任何缓动效果。
 */
export function constant (): number {
    return 0;
}

/**
 * @en A linear function, `f(k) = k`. Result correlates to input value one to one.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 线性函数，`f(k) = k`。返回值和输入值一一对应。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function linear (k: number): number {
    return k;
}

/**
 * @en A quadratic function, f(k) = k * k. The interpolation starts slowly, then progressively speeds up until the end,
 * at which point it stops abruptly. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 一个二次方的函数，f(k) = k * k。插值开始时很慢，然后逐渐加快，直到结束，并突然停止。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function quadIn (k: number): number {
    return k * k;
}

/**
 * @en A quadratic function, f(k) = k * (2-k). The interpolation starts abruptly and then progressively slows down towards the end. Refer to
 * [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 一个二次方的函数，f(k) = k * (2-k)。插值开始时很突然，然后在接近尾声时逐渐减慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function quadOut (k: number): number {
    return k * (2 - k);
}

/**
 * @en The interpolation starts slowly, speeds up, and then slows down towards the end. Refer to
 * [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) graphic feature.
 * @zh 插值开始时很慢，接着加快，然后在接近尾声时减慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function quadInOut (k: number): number {
    k *= 2;
    if (k < 1) {
        return 0.5 * k * k;
    }
    return -0.5 * (--k * (k - 2) - 1);
}

/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function cubicIn (k: number): number {
    return k * k * k;
}

/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function cubicOut (k: number): number {
    return --k * k * k + 1;
}

/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function cubicInOut (k: number): number {
    k *= 2;
    if (k < 1) {
        return 0.5 * k * k * k;
    }
    return 0.5 * ((k -= 2) * k * k + 2);
}

/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function quartIn (k: number): number {
    return k * k * k * k;
}

/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function quartOut (k: number): number {
    return 1 - (--k * k * k * k);
}

/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function quartInOut (k: number): number {
    k *= 2;
    if (k < 1) {
        return 0.5 * k * k * k * k;
    }
    return -0.5 * ((k -= 2) * k * k * k - 2);
}

/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function quintIn (k: number): number {
    return k * k * k * k * k;
}

/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function quintOut (k: number): number {
    return --k * k * k * k * k + 1;
}

/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function quintInOut (k: number): number {
    k *= 2;
    if (k < 1) {
        return 0.5 * k * k * k * k * k;
    }
    return 0.5 * ((k -= 2) * k * k * k * k + 2);
}

/**
 * @en Smoothly accelerates the animation.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 平滑地加速动画。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function sineIn (k: number): number {
    if (k === 1) {
        return 1;
    }
    return 1 - Math.cos(k * Math.PI / 2);
}

/**
 * @en Smoothly decelerates the animation.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 平滑地使动画降速。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function sineOut (k: number): number {
    return Math.sin(k * Math.PI / 2);
}

/**
 * @en Smoothly accelerates the animation at the beginning, and smoothly decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时平滑地加速动画，在结束时平滑地减速动画。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function sineInOut (k: number): number {
    return 0.5 * (1 - Math.cos(Math.PI * k));
}

/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function expoIn (k: number): number {
    return k === 0 ? 0 : Math.pow(1024, k - 1);
}

/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function expoOut (k: number): number {
    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
}

/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function expoInOut (k: number): number {
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    k *= 2;
    if (k < 1) {
        return 0.5 * Math.pow(1024, k - 1);
    }
    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
}

/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function circIn (k: number): number {
    return 1 - Math.sqrt(1 - k * k);
}

/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function circOut (k: number): number {
    return Math.sqrt(1 - (--k * k));
}

/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function circInOut (k: number): number {
    k *= 2;
    if (k < 1) {
        return -0.5 * (Math.sqrt(1 - k * k) - 1);
    }
    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function elasticIn (k: number): number {
    let s;
    let a = 0.1;
    const p = 0.4;
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = p * Math.asin(1 / a) / (2 * Math.PI);
    }
    return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function elasticOut (k: number): number {
    let s;
    let a = 0.1;
    const p = 0.4;
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = p * Math.asin(1 / a) / (2 * Math.PI);
    }
    return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function elasticInOut (k: number): number {
    let s;
    let a = 0.1;
    const p = 0.4;
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = p * Math.asin(1 / a) / (2 * Math.PI);
    }
    k *= 2;
    if (k < 1) {
        return -0.5
            * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    }
    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function backIn (k: number): number {
    if (k === 1) {
        return 1;
    }
    const s = 1.70158;
    return k * k * ((s + 1) * k - s);
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function backOut (k: number): number {
    if (k === 0) {
        return 0;
    }
    const s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function backInOut (k: number): number {
    const s = 1.70158 * 1.525;
    k *= 2;
    if (k < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
    }
    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
}

export function bounceIn (k: number): number {
    return 1 - bounceOut(1 - k);
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function bounceOut (k: number): number {
    if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
    } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
    } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
    } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
    }
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function bounceInOut (k: number): number {
    if (k < 0.5) {
        return bounceIn(k * 2) * 0.5;
    }
    return bounceOut(k * 2 - 1) * 0.5 + 0.5;
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function smooth (k: number): number {
    if (k <= 0) {
        return 0;
    }
    if (k >= 1) {
        return 1;
    }
    return k * k * (3 - 2 * k);
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export function fade (k: number): number {
    if (k <= 0) {
        return 0;
    }
    if (k >= 1) {
        return 1;
    }
    return k * k * k * (k * (k * 6 - 15) + 10);
}

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const quadOutIn = _makeOutIn(quadIn, quadOut);

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const cubicOutIn = _makeOutIn(cubicIn, cubicOut);

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const quartOutIn = _makeOutIn(quartIn, quartOut);

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const quintOutIn = _makeOutIn(quintIn, quintOut);

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const sineOutIn = _makeOutIn(sineIn, sineOut);

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const expoOutIn = _makeOutIn(expoIn, expoOut);

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const circOutIn = _makeOutIn(circIn, circOut);

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const elasticOutIn = _makeOutIn(elasticIn, elasticOut);

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const backOutIn = _makeOutIn(backIn, backOut);

/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export const bounceOutIn = _makeOutIn(bounceIn, bounceOut);

function _makeOutIn (fnIn: (k: number) => number, fnOut: (k: number) => number) {
    return (k: number): number => {
        if (k < 0.5) {
            return fnOut(k * 2) / 2;
        }
        return fnIn(2 * k - 1) / 2 + 0.5;
    };
}
