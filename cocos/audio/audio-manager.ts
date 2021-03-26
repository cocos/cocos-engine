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
interface AudioInfo {
    audio: ManagedAudio;
    playTime: number;
    isOneShotAudio: boolean;
}

export class AudioManager {
    private _audioInfoList: AudioInfo[] = [];

    private _findIndex (audio: ManagedAudio): number {
        return this._audioInfoList.findIndex(audioInfo => audioInfo.audio === audio);
    }

    public addPlaying (audio: ManagedAudio) {
        const idx = this._findIndex(audio);
        if (idx > -1) {
            let audioInfo = this._audioInfoList[idx];
            // update play time
            audioInfo.playTime = performance.now();
            return;
        }
        this._audioInfoList.push({
            audio,
            playTime: performance.now(),
            isOneShotAudio: !(audio instanceof AudioPlayer),
        });
    }

    public removePlaying (audio: ManagedAudio) {
        const idx = this._findIndex(audio);
        if (idx > -1) {
            let lastIdx = this._audioInfoList.length - 1;
            if (lastIdx !== idx) {
                this._audioInfoList[idx] = this._audioInfoList[lastIdx];
            }
            this._audioInfoList.length--;
        }
    }

    public discardOnePlayingIfNeeded () {
        if (this._audioInfoList.length < AudioPlayer.maxAudioChannel) {
            return;
        }

        // TODO: support discard policy for audio source
        let audioInfoToDiscard: AudioInfo | undefined;
        let foundOneShotAudio = false;
        this._audioInfoList.forEach(audioInfo => {
            // discard one shot audio as a priority
            if (foundOneShotAudio) {
                if (audioInfo.isOneShotAudio && audioInfo.playTime < audioInfoToDiscard!.playTime) {
                    audioInfoToDiscard = audioInfo;
                }
            }
            else {
                if (audioInfo.isOneShotAudio) {
                    audioInfoToDiscard = audioInfo;
                    foundOneShotAudio = true;
                }
                else if (!audioInfoToDiscard || audioInfo.playTime < audioInfoToDiscard.playTime) {
                    audioInfoToDiscard = audioInfo;
                }
            }
        });
        if (audioInfoToDiscard) {
            audioInfoToDiscard.audio.stop();
            this.removePlaying(audioInfoToDiscard.audio);
        }
    }
}

export const audioManager = new AudioManager();
