import { EDITOR, TEST } from 'internal:constants';
import { SafeAreaEdge } from 'pal/screen-adapter';
import { systemInfo } from 'pal/system-info';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { OS } from '../../system-info/enum-type';
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
    private _gameContainer?: HTMLDivElement;
    private _gameCanvas?: HTMLCanvasElement;
    private _cbToUpdateFrameBuffer?: () => void;
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
    public isFrameRotated = false;
    public handleResizeEvent = true;

    constructor () {
        super();
        // TODO: need to access frame from 'pal/launcher' module
        this._gameFrame = document.getElementById('GameDiv') as HTMLDivElement;
        this._gameContainer = document.getElementById('Cocos3dGameContainer') as HTMLDivElement;
        this._gameCanvas = document.getElementById('GameCanvas') as HTMLCanvasElement;

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

    public init (cbToRebuildFrameBuffer: () => void) {
        this._cbToUpdateFrameBuffer = cbToRebuildFrameBuffer;
        this._resizeFrame(this.windowSize);
    }

    private _registerEvent () {
        document.addEventListener(this._fn.fullscreenerror, () => {
            this._onFullscreenError?.();
        });

        window.addEventListener('resize', () => {
            if (!this.handleResizeEvent) {
                return;
            }
            this._resizeFrame(this.windowSize);
        });
        if (typeof window.matchMedia === 'function') {
            const updateDPRChangeListener = () => {
                const dpr = window.devicePixelRatio;
                window.matchMedia(`(resolution: ${dpr}dppx)`).addEventListener('change', () => {
                    this.emit('window-resize');
                    updateDPRChangeListener();
                }, { once: true });
            };
            updateDPRChangeListener();
        }
        window.addEventListener('orientationchange', () => {
            if (!this.handleResizeEvent) {
                return;
            }
            this._resizeFrame(this.windowSize);
            this.emit('orientation-change');
        });
        document.addEventListener(this._fn.fullscreenchange, () => {
            this._resizeFrame(this.windowSize);
            this._onFullscreenChange?.();
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
    public get devicePixelRatio () {
        return window.devicePixelRatio || 1;
    }

    public get windowSize (): Size {
        if (systemInfo.isMobile || EDITOR || TEST) {
            if (this.isFrameRotated) {
                return new Size(window.innerHeight, window.innerWidth);
            }
            return new Size(window.innerWidth, window.innerHeight);
        } else {
            if (!this._gameFrame) {
                console.warn('Cannot access game frame');
                return new Size(0, 0);
            }
            return new Size(this._gameFrame.clientWidth, this._gameFrame.clientHeight);
        }
    }
    public set windowSize (size: Size) {
        if (systemInfo.isMobile || EDITOR) {
            // We say that on web mobile, the window size equals to the browser inner size.
            // The window size is readonly on web mobile.
            return;
        }
        this._resizeFrame(size);
    }
    private _resizeFrame (size: Size) {
        if (this._gameFrame) {
            this._gameFrame.style.width = `${size.width}px`;
            this._gameFrame.style.height = `${size.height}px`;
            this.emit('window-resize');
        }
        this._updateResolution();
    }

    private _resolution: Size = new Size(0, 0);
    public get resolution () {
        return this._resolution;
    }
    private _updateResolution () {
        const windowSize = this.windowSize;
        // update resolution
        this._resolution.width = windowSize.width * this.resolutionScale;
        this._resolution.height = windowSize.height * this.resolutionScale;
        this._cbToUpdateFrameBuffer?.();
        this.emit('resolution-change');
    }

    private _resolutionScale = 1;
    public get resolutionScale () {
        return this._resolutionScale;
    }
    public set resolutionScale (v: number) {
        if (v === this._resolutionScale) {
            return;
        }
        this._resolutionScale = v;
        this._updateResolution();
    }

    private _orientation = Orientation.AUTO;
    public get orientation (): Orientation {
        return this._orientation;
    }
    public set orientation (value: Orientation) {
        if (this._orientation === value) {
            return;
        }
        this._orientation = value;
        if (!this._gameFrame) {
            return;
        }
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isBrowserLandscape = width > height;
        const needToRotateDocument = systemInfo.isMobile && systemInfo.os === OS.ANDROID
            && ((isBrowserLandscape && value & Orientation.PORTRAIT) || (!isBrowserLandscape && value & Orientation.LANDSCAPE));
        if (needToRotateDocument) {
            this.isFrameRotated = true;
            this._gameFrame.style['-webkit-transform'] = 'rotate(90deg)';
            this._gameFrame.style.transform = 'rotate(90deg)';
            this._gameFrame.style['-webkit-transform-origin'] = '0px 0px 0px';
            this._gameFrame.style.transformOrigin = '0px 0px 0px';
            this._gameFrame.style.margin = `0 0 0 ${width}px`;
            this._gameFrame.style.width = `${height}px`;
            this._gameFrame.style.height = `${width}px`;
            this._resizeFrame(new Size(height, width));
        } else {
            this.isFrameRotated = false;
            this._gameFrame.style['-webkit-transform'] = 'rotate(0deg)';
            this._gameFrame.style.transform = 'rotate(0deg)';
            // TODO
            // this._gameFrame.style['-webkit-transform-origin'] = '0px 0px 0px';
            // this._gameFrame.style.transformOrigin = '0px 0px 0px';
            this._gameFrame.style.margin = '0px';
            this._gameFrame.style.width = `${width}px`;
            this._gameFrame.style.height = `${height}px`;
            this._resizeFrame(new Size(width, height));
        }
    }

    public get safeAreaEdge (): SafeAreaEdge {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
    }

    private _getFullscreenTarget () {
        // On web mobile, the transform of game frame doesn't work when it's on fullscreen.
        // So we need to make the body fullscreen.
        return systemInfo.isMobile ? document.body : this._gameFrame;
    }
    private _doRequestFullScreen (): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this._supportFullScreen) {
                reject(new Error('fullscreen is not supported'));
                return;
            }
            const fullscreenTarget = this._getFullscreenTarget();
            if (!fullscreenTarget) {
                reject(new Error('Cannot access fullscreen target'));
                return;
            }
            this._onFullscreenChange = undefined;
            this._onFullscreenError = undefined;
            const requestPromise = fullscreenTarget[this._fn.requestFullscreen]() as Promise<void> | undefined;
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
                const fullscreenTarget = this._getFullscreenTarget();
                if (!fullscreenTarget) {
                    reject(new Error('Cannot access fullscreen target'));
                    return;
                }
                fullscreenTarget.addEventListener(this._touchEventName, () => {
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
