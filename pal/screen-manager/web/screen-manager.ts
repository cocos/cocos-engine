import { SafeAreaEdge } from 'pal/screenManager';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { ScreenEvent, Orientation } from '../enum-type';

interface IScreenFunctionName {
    requestFullscreen: string,
    exitFullscreen: string,
    fullscreenchange: string,
    fullscreenEnabled: string,
    fullscreenElement: string,
    fullscreenerror: string,
}

class ScreenManager {
    private _eventTarget: EventTarget = new EventTarget();
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
            this._eventTarget.emit(ScreenEvent.SCREEN_RESIZE);
        });
        window.addEventListener('orientationchange', () => {
            this._eventTarget.emit(ScreenEvent.ORIENTATION_CHANGE);
        });
        document.addEventListener(this._fn.fullscreenchange, () => {
            this._eventTarget.emit(ScreenEvent.FULLSCREEN_CHANGE);
        });
    }

    public get supportFullScreen (): boolean {
        return this._supportFullScreen;
    }
    public get isOnFullScreen (): boolean {
        if (!this._supportFullScreen) {
            return false;
        }
        return !!document[this._fn.fullscreenElement];
    }
    public get screenSize (): Size {
        if (this._gameFrame) {
            return new Size(this._gameFrame.clientWidth, this._gameFrame.clientHeight);
        } else {
            return new Size(window.innerWidth, window.innerHeight);
        }
    }
    public get orientation (): Orientation {
        // TODO
        throw new Error('Method not implemented.');
    }
    public get safeAreaEdge (): SafeAreaEdge {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
    }
    public resizeScreen (size: Size): Promise<void> {
        throw new Error('Method not implemented.');
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

    public onFullScreenChange (cb: () => void) {
        this._eventTarget.on(ScreenEvent.FULLSCREEN_CHANGE, cb);
    }
    public onScreenResize (cb: () => void) {
        this._eventTarget.on(ScreenEvent.SCREEN_RESIZE, cb);
    }
    public onOrientationChange (cb: () => void) {
        this._eventTarget.on(ScreenEvent.ORIENTATION_CHANGE, cb);
    }
    public offFullScreenChange (cb?: () => void) {
        this._eventTarget.off(ScreenEvent.FULLSCREEN_CHANGE, cb);
    }
    public offScreenResize (cb?: () => void) {
        this._eventTarget.off(ScreenEvent.SCREEN_RESIZE, cb);
    }
    public offOrientationChange (cb?: () => void) {
        this._eventTarget.off(ScreenEvent.ORIENTATION_CHANGE, cb);
    }
}

export const screenManager = new ScreenManager();
