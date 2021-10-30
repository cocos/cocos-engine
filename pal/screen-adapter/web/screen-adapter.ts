import { EDITOR, TEST } from 'internal:constants';
import { SafeAreaEdge } from 'pal/screen-adapter';
import { systemInfo } from 'pal/system-info';
import { warnID } from '../../../cocos/core/platform/debug';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { OS } from '../../system-info/enum-type';
import { Orientation } from '../enum-type';

const orientationMap = {
    'auto': Orientation.AUTO,
    'landscape': Orientation.LANDSCAPE,
    'portrait': Orientation.PORTRAIT,
};

/**
 * On Web platform, the game window may points to defferent type of window.
 */
enum WindowType {
    /**
     * Uknown window type.
     */
    Unknown,
    /**
     * A SubFrame in BrowserWindow.
     * Need to set the frame size from an external editor option.
     * Should only dispatch 'resize' event when the frame size chanaged.
     * Setting window size is supported.
     */
    SubFrame,
    /**
     * The window size is determined by the size of BrowserWindow.
     * Should dispatch 'resize' event when the BrowserWindow size changed.
     * Setting window size is NOT supported.
     */
    BrowserWindow,
    /**
     * The window size is equal to the size of screen.
     * Should dispatch 'resize' event when enter / exit fullscreen or screen resize.
     * Setting window size is NOT supported.
     */
    Fullscreen,
}

interface IScreenFunctionName {
    requestFullscreen: string,
    exitFullscreen: string,
    fullscreenchange: string,
    fullscreenEnabled: string,
    fullscreenElement: string,
    fullscreenerror: string,
}

class ScreenAdapter extends EventTarget {
    public isFrameRotated = false;
    public handleResizeEvent = true;

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
        const result = this._windowSizeInCssPixels;
        const dpr = this.devicePixelRatio;
        result.width *= dpr;
        result.height *= dpr;
        return result;
    }
    public set windowSize (size: Size) {
        if (this._windowType !== WindowType.SubFrame) {
            warnID(9202);
            return;
        }
        this._resizeFrame(this._convertToSizeInCssPixels(size));
        this.emit('window-resize');
        this._updateResolution();
    }

    public get resolution () {
        return this._resolution;
    }
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

    private _gameFrame?: HTMLDivElement;
    private _gameContainer?: HTMLDivElement;
    private _gameCanvas?: HTMLCanvasElement;
    private _cbToUpdateFrameBuffer?: () => void;
    private _supportFullScreen = false;
    private _touchEventName: string;
    private _onFullscreenChange?: () => void;
    private _onFullscreenError?: () => void;
    private _cachedFrameSize = new Size(0, 0); // cache before enter fullscreen.
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
    private get _windowSizeInCssPixels () {
        if (TEST) {
            return new Size(window.innerWidth, window.innerHeight);
        }
        switch (this._windowType) {
            case WindowType.SubFrame:
                if (!this._gameFrame) {
                    warnID(9201);
                    return new Size(0, 0);
                }
                return new Size(this._gameFrame.clientWidth, this._gameFrame.clientHeight);
            case WindowType.Fullscreen:
                const fullscreenTarget = this._getFullscreenTarget()!;
                const fullscreenTargetWidth = this.isFrameRotated ? fullscreenTarget.clientHeight : fullscreenTarget.clientWidth;
                const fullscreenTargetHeight = this.isFrameRotated ? fullscreenTarget.clientWidth : fullscreenTarget.clientHeight;
                return new Size(fullscreenTargetWidth, fullscreenTargetHeight);
            case WindowType.BrowserWindow:
                const winWidth = this.isFrameRotated ? window.innerHeight : window.innerWidth;
                const winHeight = this.isFrameRotated ? window.innerWidth : window.innerHeight; 
                return new Size(winWidth, winHeight);
            case WindowType.Unknown:
                return new Size(0, 0);
        }
    }
    private get _windowType (): WindowType {
        if (this.isFullScreen) {
            return WindowType.Fullscreen;
        }
        if (!this._gameFrame) {
            warnID(9201);
            return WindowType.Unknown;
        }
        if (this._gameFrame.attributes['cc_exact_fit_screen']?.value === 'true') {
            // Note: It doesn't work well to determine whether the frame exact fits the screen.
            // Need to specify the attribute from Editor.
            return WindowType.BrowserWindow;
        } else {
            // A fallback case when the 'cc_exact_fit_screen' attribute is not specified.
            const body = document.body;
            const frame = this._gameFrame;
            const bodyWidth = body.clientWidth, bodyHeight = body.clientHeight;
            const frameWidth = frame.clientWidth, frameHeight = frame.clientHeight;
            if ((bodyWidth === frameWidth && bodyHeight === frameHeight)
                || (this.isFrameRotated && bodyWidth === frameHeight && bodyHeight === frameWidth)) {
                return WindowType.BrowserWindow;
            }
        }
        return WindowType.SubFrame;
    }
    private _resolution: Size = new Size(0, 0);
    private _resolutionScale = 1;
    private _orientation = Orientation.AUTO;

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

    public init (configOrientation: number, cbToRebuildFrameBuffer: () => void) {
        this._cbToUpdateFrameBuffer = cbToRebuildFrameBuffer;
        this._resizeFrame(this._windowSizeInCssPixels);
        this.orientation = orientationMap[configOrientation];
    }

    public requestFullScreen (): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isFullScreen) {
                resolve();
                return;
            }
            this._cachedFrameSize = this.windowSize;
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
                requestPromise.then(() => {
                    this.windowSize = this._cachedFrameSize;
                    resolve();
                }).catch(reject);
                return;
            }
            this.windowSize = this._cachedFrameSize;
            resolve();
        });
    }

    private _registerEvent () {
        document.addEventListener(this._fn.fullscreenerror, () => {
            this._onFullscreenError?.();
        });

        window.addEventListener('resize', () => {
            if (!this.handleResizeEvent) {
                return;
            }
            this._resizeFrame(this._windowSizeInCssPixels);
        });
        if (typeof window.matchMedia === 'function') {
            const updateDPRChangeListener = () => {
                const dpr = window.devicePixelRatio;
                // NOTE: some browsers especially on iPhone doesn't support MediaQueryList
                window.matchMedia(`(resolution: ${dpr}dppx)`)?.addEventListener?.('change', () => {
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
            this._resizeFrame(this._windowSizeInCssPixels);
            this.emit('orientation-change');
        });
        document.addEventListener(this._fn.fullscreenchange, () => {
            this._resizeFrame(this._windowSizeInCssPixels);
            this._onFullscreenChange?.();
            this.emit('fullscreen-change');
        });
    }
    private _convertToSizeInCssPixels (size: Size) {
        const clonedSize = size.clone();
        const dpr = this.devicePixelRatio;
        clonedSize.width /= dpr;
        clonedSize.height /= dpr;
        return clonedSize;
    }

    private _resizeFrame (sizeInCssPixels: Size) {
        if (this._gameFrame) {
            this._gameFrame.style.width = `${sizeInCssPixels.width}px`;
            this._gameFrame.style.height = `${sizeInCssPixels.height}px`;
            this.emit('window-resize');
        }
        this._updateResolution();
    }

    private _updateResolution () {
        const windowSize = this.windowSize;
        // update resolution
        this._resolution.width = windowSize.width * this.resolutionScale;
        this._resolution.height = windowSize.height * this.resolutionScale;
        this._cbToUpdateFrameBuffer?.();
        this.emit('resolution-change');
    }

    private _getFullscreenTarget () {
        const windowType = this._windowType;
        if (windowType === WindowType.Fullscreen) {
            return document[this._fn.fullscreenElement];
        }
        if (windowType === WindowType.SubFrame) {
            return this._gameFrame;
        }
        // On web mobile, the transform of game frame doesn't work when it's on fullscreen.
        // So we need to make the body fullscreen.
        return document.body;
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
}

export const screenAdapter = new ScreenAdapter();
