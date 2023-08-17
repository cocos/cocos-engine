/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import * as easing from '../algorithm/easing';
import { assertIsTrue } from '../data/utils/asserts';

/**
 * @engineInternal
 */
export enum EasingMethod {
    LINEAR,
    CONSTANT,
    QUAD_IN,
    QUAD_OUT,
    QUAD_IN_OUT,
    QUAD_OUT_IN,
    CUBIC_IN,
    CUBIC_OUT,
    CUBIC_IN_OUT,
    CUBIC_OUT_IN,
    QUART_IN,
    QUART_OUT,
    QUART_IN_OUT,
    QUART_OUT_IN,
    QUINT_IN,
    QUINT_OUT,
    QUINT_IN_OUT,
    QUINT_OUT_IN,
    SINE_IN,
    SINE_OUT,
    SINE_IN_OUT,
    SINE_OUT_IN,
    EXPO_IN,
    EXPO_OUT,
    EXPO_IN_OUT,
    EXPO_OUT_IN,
    CIRC_IN,
    CIRC_OUT,
    CIRC_IN_OUT,
    CIRC_OUT_IN,
    ELASTIC_IN,
    ELASTIC_OUT,
    ELASTIC_IN_OUT,
    ELASTIC_OUT_IN,
    BACK_IN,
    BACK_OUT,
    BACK_IN_OUT,
    BACK_OUT_IN,
    BOUNCE_IN,
    BOUNCE_OUT,
    BOUNCE_IN_OUT,
    BOUNCE_OUT_IN,
    SMOOTH,
    FADE,
}

type EasingMethodFn = (k: number) => number;

const easingMethodFnMap: Record<EasingMethod, EasingMethodFn> = {
    [EasingMethod.CONSTANT]: easing.constant,
    [EasingMethod.LINEAR]: easing.linear,

    [EasingMethod.QUAD_IN]: easing.quadIn,
    [EasingMethod.QUAD_OUT]: easing.quadOut,
    [EasingMethod.QUAD_IN_OUT]: easing.quadInOut,
    [EasingMethod.QUAD_OUT_IN]: easing.quadOutIn,
    [EasingMethod.CUBIC_IN]: easing.cubicIn,
    [EasingMethod.CUBIC_OUT]: easing.cubicOut,
    [EasingMethod.CUBIC_IN_OUT]: easing.cubicInOut,
    [EasingMethod.CUBIC_OUT_IN]: easing.cubicOutIn,
    [EasingMethod.QUART_IN]: easing.quartIn,
    [EasingMethod.QUART_OUT]: easing.quartOut,
    [EasingMethod.QUART_IN_OUT]: easing.quartInOut,
    [EasingMethod.QUART_OUT_IN]: easing.quartOutIn,
    [EasingMethod.QUINT_IN]: easing.quintIn,
    [EasingMethod.QUINT_OUT]: easing.quintOut,
    [EasingMethod.QUINT_IN_OUT]: easing.quintInOut,
    [EasingMethod.QUINT_OUT_IN]: easing.quintOutIn,
    [EasingMethod.SINE_IN]: easing.sineIn,
    [EasingMethod.SINE_OUT]: easing.sineOut,
    [EasingMethod.SINE_IN_OUT]: easing.sineInOut,
    [EasingMethod.SINE_OUT_IN]: easing.sineOutIn,
    [EasingMethod.EXPO_IN]: easing.expoIn,
    [EasingMethod.EXPO_OUT]: easing.expoOut,
    [EasingMethod.EXPO_IN_OUT]: easing.expoInOut,
    [EasingMethod.EXPO_OUT_IN]: easing.expoOutIn,
    [EasingMethod.CIRC_IN]: easing.circIn,
    [EasingMethod.CIRC_OUT]: easing.circOut,
    [EasingMethod.CIRC_IN_OUT]: easing.circInOut,
    [EasingMethod.CIRC_OUT_IN]: easing.circOutIn,
    [EasingMethod.ELASTIC_IN]: easing.elasticIn,
    [EasingMethod.ELASTIC_OUT]: easing.elasticOut,
    [EasingMethod.ELASTIC_IN_OUT]: easing.elasticInOut,
    [EasingMethod.ELASTIC_OUT_IN]: easing.elasticOutIn,
    [EasingMethod.BACK_IN]: easing.backIn,
    [EasingMethod.BACK_OUT]: easing.backOut,
    [EasingMethod.BACK_IN_OUT]: easing.backInOut,
    [EasingMethod.BACK_OUT_IN]: easing.backOutIn,
    [EasingMethod.BOUNCE_IN]: easing.bounceIn,
    [EasingMethod.BOUNCE_OUT]: easing.bounceOut,
    [EasingMethod.BOUNCE_IN_OUT]: easing.bounceInOut,
    [EasingMethod.BOUNCE_OUT_IN]: easing.bounceOutIn,
    [EasingMethod.SMOOTH]: easing.smooth,
    [EasingMethod.FADE]: easing.fade,
};

export function getEasingFn (easingMethod: EasingMethod): EasingMethodFn {
    assertIsTrue(easingMethod in easingMethodFnMap);
    return easingMethodFnMap[easingMethod];
}
