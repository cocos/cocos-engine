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
 * @returns A polyfilled createInnerAudioContext method.
 */
export function createInnerAudioContextPolyfill (minigameEnv: any, polyfillConfig: InnerAudioContextPolyfillConfig) {
    return () => {
        const audioContext: InnerAudioContext = minigameEnv.createInnerAudioContext();

        // add polyfill if onPlay method doesn't work this platform
        if (polyfillConfig.onPlay) {
            const originalPlay = audioContext.play;
            let _onPlayCB: (()=> void) | null = null;
            Object.defineProperty(audioContext, 'onPlay', {
                value (cb: ()=> void) {
                    _onPlayCB = cb;
                },
            });
            Object.defineProperty(audioContext, 'play', {
                value () {
                    originalPlay.call(audioContext);
                    _onPlayCB?.();
                },
            });
        }

        // add polyfill if onPause method doesn't work this platform
        if (polyfillConfig.onPause) {
            const originalPause = audioContext.pause;
            let _onPauseCB: (()=> void) | null = null;
            Object.defineProperty(audioContext, 'onPause', {
                value (cb: ()=> void) {
                    _onPauseCB = cb;
                },
            });
            Object.defineProperty(audioContext, 'pause', {
                value () {
                    originalPause.call(audioContext);
                    _onPauseCB?.();
                },
            });
        }

        // add polyfill if onStop method doesn't work on this platform
        if (polyfillConfig.onStop) {
            const originalStop = audioContext.stop;
            let _onStopCB: (()=> void) | null = null;
            Object.defineProperty(audioContext, 'onStop', {
                value (cb: ()=> void) {
                    _onStopCB = cb;
                },
            });
            Object.defineProperty(audioContext, 'stop', {
                value () {
                    originalStop.call(audioContext);
                    _onStopCB?.();
                },
            });
        }

        // add polyfill if onSeeked method doesn't work on this platform
        if (polyfillConfig.onSeek) {
            const originalSeek = audioContext.seek;
            let _onSeekCB: (()=> void) | null = null;
            Object.defineProperty(audioContext, 'onSeeked', {
                value (cb: ()=> void) {
                    _onSeekCB = cb;
                },
            });
            Object.defineProperty(audioContext, 'seek', {
                value (time: number) {
                    originalSeek.call(audioContext, time);
                    _onSeekCB?.();
                },
            });
        }

        return audioContext;
    };
}
