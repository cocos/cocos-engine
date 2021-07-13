/**
 * This method clones methods in minigame enviroment, sucb as `wx`, `swan` etc. to a module called minigame.
 * @param targetObject Usually it's specified as the minigame module.
 * @param originObj Original minigame environment such as `wx`, `swan` etc.
 */
export function cloneObject (targetObject: any, originObj: any) {
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
    return () => {
        const audioContext: InnerAudioContext = minigameEnv.createInnerAudioContext();

        // add polyfill if onPlay method doesn't work this platform
        if (polyfillConfig.onPlay) {
            const originalPlay = audioContext.play;
            let _onPlayCB: (()=> void) | null = null;
            Object.defineProperty(audioContext, 'onPlay', {
                configurable: true,
                value (cb: ()=> void) {
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
            let _onPauseCB: (()=> void) | null = null;
            Object.defineProperty(audioContext, 'onPause', {
                configurable: true,
                value (cb: ()=> void) {
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
            let _onStopCB: (()=> void) | null = null;
            Object.defineProperty(audioContext, 'onStop', {
                configurable: true,
                value (cb: ()=> void) {
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
            let _onSeekCB: (()=> void) | null = null;
            Object.defineProperty(audioContext, 'onSeeked', {
                configurable: true,
                value (cb: ()=> void) {
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
