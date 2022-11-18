import { AudioInfo } from '../../type';

interface DomAudioMap {
    [url: string]: HTMLAudioElement[]
}

interface InfoMap {
    [url: string]: AudioInfo
}

class AudioPool {
    _infoMap: InfoMap = {};
    _domPool: DomAudioMap = {};
    public loadDom (url: string): Promise<AudioInfo> {
        return new Promise((resolve, reject) => {
            try {
                const info = this.loadDomSync(url);
                resolve(info);
            } catch {
                reject();
            }
        });
    }
    public loadDomSync (url: string): AudioInfo {
        const domAudioInfo = this._infoMap[url];
        if (domAudioInfo) {
            return domAudioInfo;
        }
        try {
            const domAudio: HTMLAudioElement = new Audio(url);
            this._domPool[url] = [];
            this._domPool[url].push(domAudio);
            this._infoMap[url] = {
                duration: domAudio.duration,
                pcmHeader: null,
            };
            return this._infoMap[url];
        } catch {
            throw new Error(`fail to initialize a dom audio`);
        }
    }

    public alloc (url: string): HTMLAudioElement {
        console.log(`url is ${url}`);
        if (!this._infoMap[url]) {
            const domAudio: HTMLAudioElement = new Audio(url);
            this._domPool[url] = [];
            this._infoMap[url] = {
                duration: domAudio.duration,
                pcmHeader: null,
            };
            return domAudio;
        }
        const ret = this._domPool[url].pop();
        if (ret !== undefined) {
            return ret;
        } else {
            return new Audio(url);
        }
    }
    public dealloc (url: string, domAudio: HTMLAudioElement) {
        if (!this._domPool[url]) {
            this._domPool[url] = [];
            this._infoMap[url] = {
                duration: domAudio.duration,
                pcmHeader: null,
            };
        }
        this._domPool[url].push(domAudio);
    }
}
export const domAudioPool = new AudioPool();
