/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import { AudioPlayer, OneShotAudio } from 'pal/audio';

type ManagedAudio = AudioPlayer | OneShotAudio;

export class AudioManager {
    private _playingAudios: Array<ManagedAudio> = [];

    public addPlaying (audio: ManagedAudio) {
        const index = this._playingAudios.indexOf(audio);
        if (index > -1) {
            // need to update to the newest player
            this._playingAudios.splice(index, 1);
        }
        this._playingAudios.push(audio);
    }

    public removePlaying (audio: ManagedAudio) {
        const index = this._playingAudios.indexOf(audio);
        if (index > -1) {
            this._playingAudios.splice(index, 1);
        }
    }

    public discardOnePlayingIfNeeded () {
        if (this._playingAudios.length < AudioPlayer.maxAudioChannel) {
            return;
        }

        // TODO: support discard policy for audio source
        // a played audio has a higher priority than a played shot
        let audioToDiscard: ManagedAudio | undefined;
        const oldestOneShotIndex = this._playingAudios.findIndex((audio) => !(audio instanceof AudioPlayer));
        if (oldestOneShotIndex > -1) {
            audioToDiscard = this._playingAudios[oldestOneShotIndex];
            this._playingAudios.splice(oldestOneShotIndex, 1);
            audioToDiscard.stop();
        } else {
            audioToDiscard = this._playingAudios.shift();
            audioToDiscard?.stop();
        }
    }
}

export const audioManager = new AudioManager();
