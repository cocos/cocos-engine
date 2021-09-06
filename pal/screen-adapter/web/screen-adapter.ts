import { SafeAreaEdge } from 'pal/screen-adapter';
import { EventTarget } from '../../../cocos/core/event';
import { Size } from '../../../cocos/core/math';
import { Orientation } from '../enum-type';

interface IScreenFunctionName {
    requestFullscreen: string,
    exitFullscreen: string,
    fullscreenchange: string,
    fullscreenEnabled: string,
    fullscreenElement: string,
    fullscreenerror: string,
}

class ScreenAdapter extends EventTarget {
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

    constructor () {
        super();
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
        this._touchEventName = ('ontouchstart' in window) ? 'touchend' : 'mousedown';
        this._registerEvent();
    }

    private _registerEvent () {
        document.addEventListener(this._fn.fullscreenerror, () => {
            this._onFullscreenError?.();
        });
        document.addEventListener(this._fn.fullscreenchange, () => {
            this._onFullscreenChange?.();
        });

        window.addEventListener('resize', () => {
            this.emit('window-resize');
        });
        window.addEventListener('orientationchange', () => {
            this.emit('orientation-change');
        });
        document.addEventListener(this._fn.fullscreenchange, () => {
            this.emit('fullscreen-change');
        });
    }

    public get supportFullScreen (): boolean {
        return this._supportFullScreen;
    }
    public get isFullScreen (): boolean {
        if (!this._supportFullScreen) {
            return false;
        }
        return !!document[this._fn.fullscreenElement];
    }
    public get windowSize (): Size {
        if (this._gameFrame) {
            return new Size(this._gameFrame.clientWidth, this._gameFrame.clientHeight);
        } else {
            return new Size(window.innerWidth, window.innerHeight);
        }
    }
    public set windowSize (size: Size) {
        console.warn('Setting window size is not supported yet.');
    }

    public get orientation (): Orientation {
        return Orientation.PORTRAIT; // TO BE IMPLEMENTED
    }
    public get safeAreaEdge (): SafeAreaEdge {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
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
                }, { once: true, capture: true });
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

export const screenAdapter = new ScreenAdapter();
