import { Size } from '../../../cocos/core/math';

interface IScreenFunctionName {
    requestFullscreen: string,
    exitFullscreen: string,
    fullscreenchange: string,
    fullscreenEnabled: string,
    fullscreenElement: string,
    fullscreenerror: string,
}

class ScreenUtils {
    private _gameFrame?: HTMLDivElement;
    private _supportFullScreen = false;
    private _touchEventName: string;
    private _onFullscreenChange?: () => void;
    private _onFullscreenError?: () => void;
    private _fn = {} as IScreenFunctionName;
    // Function mapping for cross browser support
    private _fnGroup = [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenchange',
            'fullscreenEnabled',
            'fullscreenElement',
            'fullscreenerror',
        ],
        [
            'requestFullScreen',
            'exitFullScreen',
            'fullScreenchange',
            'fullScreenEnabled',
            'fullScreenElement',
            'fullscreenerror',
        ],
        [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitIsFullScreen',
            'webkitCurrentFullScreenElement',
            'webkitfullscreenerror',
        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozfullscreenchange',
            'mozFullScreen',
            'mozFullScreenElement',
            'mozfullscreenerror',
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'MSFullscreenChange',
            'msFullscreenEnabled',
            'msFullscreenElement',
            'msfullscreenerror',
        ],
    ];

    /**
     * Setting the fullscreen change callback
     */
    public fullScreenChangeCallback?: () => void;

    constructor () {
        // TODO: need to access frame from 'pal/launcher' module
        this._gameFrame = document.getElementById('GameDiv') as HTMLDivElement;

        let fnList: Array<string>;
        const fnGroup = this._fnGroup;
        for (let i = 0; i < fnGroup.length; i++) {
            fnList = fnGroup[i];
            // detect event support
            if (typeof document[fnList[1]] !== 'undefined') {
                for (let i = 0; i < fnList.length; i++) {
                    this._fn[fnGroup[0][i]] = fnList[i];
                }
                break;
            }
        }

        this._supportFullScreen = (this._fn.requestFullscreen !== undefined);
        this._touchEventName = ('ontouchstart' in window) ? 'touchstart' : 'mousedown';
        document.addEventListener(this._fn.fullscreenerror, () => {
            this._onFullscreenError?.();
        });
        document.addEventListener(this._fn.fullscreenchange, () => {
            this._onFullscreenChange?.();
        });
        document.addEventListener(this._fn.fullscreenchange, () => {
            this.fullScreenChangeCallback?.();
        });
    }

    public get supportsFullScreen () {
        return this._supportFullScreen;
    }

    public get isOnFullscreen () {
        if (!this._supportFullScreen) {
            return false;
        }
        return !!document[this._fn.fullscreenElement];
    }

    public getScreenSize (): Size {
        if (this._gameFrame) {
            return new Size(this._gameFrame.clientWidth, this._gameFrame.clientHeight);
        } else {
            return new Size(window.innerWidth, window.innerHeight);
        }
    }

    private _doRequestFullScreen (): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this._gameFrame) {
                reject(new Error('Cannot access game frame'));
                return;
            }
            if (!this._supportFullScreen) {
                reject(new Error('fullscreen is not supported'));
                return;
            }
            this._onFullscreenChange = undefined;
            this._onFullscreenError = undefined;
            const requestPromise = this._gameFrame[this._fn.requestFullscreen]() as Promise<void> | undefined;
            if (window.Promise && requestPromise instanceof Promise) {
                requestPromise.then(resolve).catch(reject);
            } else {
                this._onFullscreenChange = resolve;
                this._onFullscreenError = reject;
            }
        });
    }

    public requestFullScreen (): Promise<void> {
        return new Promise((resolve, reject) => {
            this._doRequestFullScreen().then(() => {
                resolve();
            }).catch(() => {
                if (!this._gameFrame) {
                    reject(new Error('Cannot access game frame'));
                    return;
                }
                this._gameFrame.addEventListener(this._touchEventName, () => {
                    this._doRequestFullScreen().then(() => {
                        resolve();
                    }).catch(reject);
                }, { once: true });
            });
        });
    }

    public exitFullScreen (): Promise<void> {
        return new Promise((resolve, reject) => {
            const requestPromise = document[this._fn.exitFullscreen]();
            if (window.Promise && requestPromise instanceof Promise) {
                requestPromise.then(resolve).catch(reject);
                return;
            }
            resolve();
        });
    }
}

export const screenUtils = new ScreenUtils();
