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

import { EDITOR } from 'internal:constants';

/**
 * This method clones methods in minigame environment, sub as `wx`, `swan` etc. to a module called minigame.
 * @param targetObject Usually it's specified as the minigame module.
 * @param originObj Original minigame environment such as `wx`, `swan` etc.
 */
export function cloneObject (targetObject: any, originObj: any): void {
    Object.keys(originObj).forEach((key) => {
        if (typeof originObj[key] === 'function') {
            targetObject[key] = originObj[key].bind(originObj);
            return;
        }
        targetObject[key] = originObj[key];
    });
}

type MiningameAudioCallbackName = 'onPlay' | 'onPause' | 'onStop' | 'onSeek';
type InnerAudioContextPolyfillConfig = {
    [CallbackName in MiningameAudioCallbackName]: boolean;
};
/**
 * This method is to create a polyfill on minigame platform when the innerAudioContext callback doesn't work.
 * @param minigameEnv Specify the minigame enviroment such as `wx`, `swan` etc.
 * @param polyfillConfig Specify the field, if it's true, the polyfill callback will be applied.
 * @param isAsynchronous Specify whether the callback is called asynchronous.
 * @returns A polyfilled createInnerAudioContext method.
 */
export function createInnerAudioContextPolyfill (minigameEnv: any, polyfillConfig: InnerAudioContextPolyfillConfig, isAsynchronous = false) {
    return (): InnerAudioContext => {
        const audioContext: InnerAudioContext = minigameEnv.createInnerAudioContext();

        // add polyfill if onPlay method doesn't work this platform
        if (polyfillConfig.onPlay) {
            const originalPlay = audioContext.play;
            let _onPlayCB: (() => void) | null = null;
            Object.defineProperty(audioContext, 'onPlay', {
                configurable: true,
                value (cb: () => void) {
                    _onPlayCB = cb;
                },
            });
            Object.defineProperty(audioContext, 'play', {
                configurable: true,
                value () {
                    originalPlay.call(audioContext);
                    if (_onPlayCB) {
                        if (isAsynchronous) {
                            setTimeout(_onPlayCB, 0);
                        } else {
                            _onPlayCB();
                        }
                    }
                },
            });
        }

        // add polyfill if onPause method doesn't work this platform
        if (polyfillConfig.onPause) {
            const originalPause = audioContext.pause;
            let _onPauseCB: (() => void) | null = null;
            Object.defineProperty(audioContext, 'onPause', {
                configurable: true,
                value (cb: () => void) {
                    _onPauseCB = cb;
                },
            });
            Object.defineProperty(audioContext, 'pause', {
                configurable: true,
                value () {
                    originalPause.call(audioContext);
                    if (_onPauseCB) {
                        if (isAsynchronous) {
                            setTimeout(_onPauseCB, 0);
                        } else {
                            _onPauseCB();
                        }
                    }
                },
            });
        }

        // add polyfill if onStop method doesn't work on this platform
        if (polyfillConfig.onStop) {
            const originalStop = audioContext.stop;
            let _onStopCB: (() => void) | null = null;
            Object.defineProperty(audioContext, 'onStop', {
                configurable: true,
                value (cb: () => void) {
                    _onStopCB = cb;
                },
            });
            Object.defineProperty(audioContext, 'stop', {
                configurable: true,
                value () {
                    originalStop.call(audioContext);
                    if (_onStopCB) {
                        if (isAsynchronous) {
                            setTimeout(_onStopCB, 0);
                        } else {
                            _onStopCB();
                        }
                    }
                },
            });
        }

        // add polyfill if onSeeked method doesn't work on this platform
        if (polyfillConfig.onSeek) {
            const originalSeek = audioContext.seek;
            let _onSeekCB: (() => void) | null = null;
            Object.defineProperty(audioContext, 'onSeeked', {
                configurable: true,
                value (cb: () => void) {
                    _onSeekCB = cb;
                },
            });
            Object.defineProperty(audioContext, 'seek', {
                configurable: true,
                value (time: number) {
                    originalSeek.call(audioContext, time);
                    if (_onSeekCB) {
                        if (isAsynchronous) {
                            setTimeout(_onSeekCB, 0);
                        } else {
                            _onSeekCB();
                        }
                    }
                },
            });
        }

        return audioContext;
    };
}

/**
 * Compare two version, version should in pattern like 3.0.0.
 * If versionA > versionB, return number larger than 0.
 * If versionA = versionB, return number euqal to 0.
 * If versionA < versionB, return number smaller than 0.
 * @param versionA
 * @param versionB
 */
export function versionCompare (versionA: string, versionB: string): number {
    const versionRegExp = /\d+\.\d+\.\d+/;
    if (!(versionRegExp.test(versionA) && versionRegExp.test(versionB))) {
        console.warn('wrong format of version when compare version');
        return 0;
    }
    const versionNumbersA = versionA.split('.').map((num: string) => Number.parseInt(num));
    const versionNumbersB = versionB.split('.').map((num: string) => Number.parseInt(num));
    for (let i = 0; i < 3; ++i) {
        const numberA = versionNumbersA[i];
        const numberB = versionNumbersB[i];
        if (numberA !== numberB) {
            return numberA - numberB;
        }
    }
    return 0;
}

/**
 * A custom implementation of setTimeout that uses requestAnimationFrame.
 * @param callback The function to be executed after a delay.
 * @param delay The delay time in milliseconds.
 * @param args The arguments to be passed to the callback function.
 * @returns A unique identifier for the timer.
 */
export function setTimeoutRAF (callback: (...args: any[]) => void, delay: number, ...args: any[]): number {
    const start = performance.now();

    const raf = requestAnimationFrame
    || window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame;

    if (EDITOR || raf === undefined || globalThis.__globalXR?.isWebXR) {
        return setTimeout(callback, delay, ...args);
    }

    const handleRAF = (): void => {
        if (performance.now() - start < delay) {
            raf(handleRAF);
        } else {
            callback(...args);
        }
    };

    return raf(handleRAF);
}

/**
 * Cancels a timer that was created using the rafTimeout function.
 * @param id A numeric ID that represents the timer to be canceled.
 * @returns Nothing.
 */
export function clearTimeoutRAF (id): void {
    const caf = cancelAnimationFrame
        || window.cancelAnimationFrame
        || window.cancelRequestAnimationFrame
        || window.msCancelRequestAnimationFrame
        || window.mozCancelRequestAnimationFrame
        || window.oCancelRequestAnimationFrame
        || window.webkitCancelRequestAnimationFrame
        || window.msCancelAnimationFrame
        || window.mozCancelAnimationFrame
        || window.webkitCancelAnimationFrame
        || window.ocancelAnimationFrame;
    if (EDITOR || caf === undefined || globalThis.__globalXR?.isWebXR) {
        clearTimeout(id);
    } else {
        caf(id);
    }
}
