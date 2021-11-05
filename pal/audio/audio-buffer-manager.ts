interface CachedAudioBufferData {
    usedCount: number,
    audioBuffer: AudioBuffer,
}

interface AudioBufferDataMap {
    [url: string]: CachedAudioBufferData;
}

/**
 * This is a manager to manage the cache of audio buffer for web audio.
 */
class AudioBufferManager {
    private _audioBufferDataMap: AudioBufferDataMap = {};

    public addCache (url: string, audioBuffer: AudioBuffer) {
        const audioBufferData = this._audioBufferDataMap[url];
        if (audioBufferData) {
            console.warn(`Audio buffer ${url} has been cached`);
            return;
        }
        this._audioBufferDataMap[url] = {
            usedCount: 1,
            audioBuffer,
        };
    }

    public retainCache (url: string) {
        const audioBufferData = this._audioBufferDataMap[url];
        if (!audioBufferData) {
            console.warn(`Audio buffer cache ${url} has not been added.`);
            return;
        }
        audioBufferData.usedCount++;
    }

    public getCache (url: string): AudioBuffer | null | undefined {
        const audioBufferData = this._audioBufferDataMap[url];
        return audioBufferData?.audioBuffer;
    }

    public tryReleasingCache (url: string) {
        const audioBufferData = this._audioBufferDataMap[url];
        if (!audioBufferData) {
            console.warn(`Audio buffer cache ${url} has not been added.`);
            return;
        }
        if (--audioBufferData.usedCount <= 0) {
            delete this._audioBufferDataMap[url];
        }
    }
}

export const audioBufferManager = new AudioBufferManager();
