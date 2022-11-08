import { minigame } from 'pal/minigame';
import { AudioInfo } from '../../type';

interface AudioContextPool {
    [url: string]: InnerAudioContext[]
}

interface InfoMap {
    [url: string]: AudioInfo
}

export class AudioPool {
    _infoMap: InfoMap = {};
    _ctxPool: AudioContextPool = {};
    public loadCtx (url: string): Promise<AudioInfo> {
        return new Promise((resolve, reject) => {
            const audioInfo = this._infoMap[url];
            if (audioInfo) {
                resolve(audioInfo);
            }
            try {
                const ctx: InnerAudioContext = minigame.createInnerAudioContext();
                ctx.src = url;
                this._ctxPool[url] = [];
                this._ctxPool[url].push(ctx);
                this._infoMap[url] = {
                    duration: ctx.duration,
                    pcmHeader: null,
                };
                resolve(this._infoMap[url]);
            } catch {
                console.error(`fail to initialize a dom audio`);
                reject();
            }
        });
    }

    public alloc (url: string): InnerAudioContext {
        console.log(`url is ${url}`);
        if (!this._infoMap[url]) {
            const ctx: InnerAudioContext = minigame.createInnerAudioContext();
            ctx.src = url;
            this._ctxPool[url] = [];
            this._infoMap[url] = {
                duration: ctx.duration,
                pcmHeader: null,
            };
            return ctx;
        }
        const ret = this._ctxPool[url].pop();
        if (ret !== undefined) {
            return ret;
        } else {
            const ctx: InnerAudioContext = minigame.createInnerAudioContext();
            ctx.src = url;
            return ctx;
        }
    }
    public dealloc (url: string, ctx: InnerAudioContext) {
        if (!this._ctxPool[url]) {
            this._ctxPool[url] = [];
            this._infoMap[url] = {
                duration: ctx.duration,
                pcmHeader: null,
            };
        }
        this._ctxPool[url].push(ctx);
    }
}
export const audioPool = new AudioPool();
