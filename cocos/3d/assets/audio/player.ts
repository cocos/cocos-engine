/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

export const PlayingState = {
    INITIALIZING: 0,
    PLAYING: 1,
    STOPPED: 2,
};

export interface IAudioInfo {
    clip: any;
    duration: number;
    eventTarget: any;
}

export abstract class AudioPlayer {
    protected _state = PlayingState.STOPPED;
    protected _duration = 0;
    protected _eventTarget: any;

    constructor (info: IAudioInfo) {
        this._duration = info.duration;
        this._eventTarget = info.eventTarget;
    }

    public abstract play (): void;
    public abstract pause (): void;
    public abstract stop (): void;
    public abstract playOneShot (volume: number): void;
    public abstract setCurrentTime (val: number): void;
    public abstract getCurrentTime (): number;
    public abstract getDuration (): number;
    public abstract setVolume (val: number, immediate: boolean): void;
    public abstract getVolume (): number;
    public abstract setLoop (val: boolean): void;
    public abstract getLoop (): boolean;
    public getState () { return this._state; }
}
