/*
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */

import { AudioOperationResult, IAudioPlayer, Playable } from './playable';
import { AudioClip } from './audio-clip';

import { AudioState } from './type';
import { enqueueOperation, OperationInfo, OperationQueueable } from './pal/operation-queue';

export class AudioPlayer implements Playable, IAudioPlayer, OperationQueueable {
    _operationQueue: OperationInfo[] = [];
    _eventTarget: EventTarget = new EventTarget();
    set clip (clip: AudioClip) {
        throw new Error('Method not implemented.');
    }
    get clip (): AudioClip {
        throw new Error('Method not implemented.');
    }
    set loop (loop: boolean) {
        throw new Error('Method not implemented.');
    }
    get loop (): boolean {
        throw new Error('Method not implemented.');
    }
    set currentTime (time: number) {
        throw new Error('Method not implemented.');
    }
    get currentTime (): number {
        throw new Error('Method not implemented.');
    }
    set playbackRate (rate: number) {
        throw new Error('Method not implemented.');
    }
    get playbackRate (): number {
        throw new Error('Method not implemented.');
    }
    set pan (pan: number) {
        throw new Error('Method not implemented.');
    }
    get pan (): number {
        throw new Error('Method not implemented.');
    }
    get state (): AudioState {
        throw new Error('Method not implemented.');
    }
    play (): Promise<AudioOperationResult> {
        throw new Error('Method not implemented.');
    }
    pause (): Promise<AudioOperationResult> {
        throw new Error('Method not implemented.');
    }
    resume (): Promise<AudioOperationResult> {
        throw new Error('Method not implemented.');
    }
    stop (): Promise<AudioOperationResult> {
        throw new Error('Method not implemented.');
    }
}
