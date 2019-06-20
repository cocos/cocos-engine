import { LoadCompleteCallback } from './callback-params';

type IScriptPackData = Record<string, () => void>;

class ScripPack {
    constructor (public data: IScriptPackData) {

    }

    public loadEntry (name: string, callback: LoadCompleteCallback<any>) {
        if (name in this.data) {
            this.data[name](); // Execute it.
            callback(null, null);
        } else {
            callback(new Error(`No such entry: ${name}`));
        }
    }
}

enum LoadStatus {
    Pending,
    Cached,
    Failed,
}

interface IBaseScriptPackState {
    status: LoadStatus;
}

interface IScriptPackPendingState extends IBaseScriptPackState {
    status: LoadStatus.Pending;
    callbacks: Array<LoadCompleteCallback<ScripPack>>;
}

interface IScriptPackCachedState extends IBaseScriptPackState {
    status: LoadStatus.Cached;
    cached: ScripPack;
}

interface IScriptPackFailedState extends IBaseScriptPackState {
    status: LoadStatus.Failed;
    error: any;
}

type ScriptPackState = IScriptPackPendingState | IScriptPackCachedState | IScriptPackFailedState;

function isPending (state: ScriptPackState): state is IScriptPackPendingState {
    return state.status === LoadStatus.Pending;
}

function isCached (state: ScriptPackState): state is IScriptPackCachedState {
    return state.status === LoadStatus.Cached;
}

function isFailed (state: ScriptPackState): state is IScriptPackFailedState {
    return state.status === LoadStatus.Failed;
}

class ScriptPackManager {
    private _packStates = new Map<string, ScriptPackState>();

    public load (url: string, callback: LoadCompleteCallback<ScripPack>) {
        let state = this._packStates.get(url);
        if (!state) {
            state = {
                status: LoadStatus.Pending,
                callbacks: [],
            };
            this._packStates.set(url, state);
        }

        if (isFailed(state)) {
            callback(state.error);
        } else if (isCached(state)) {
            callback(null, state.cached);
        } else {
            state.callbacks.push(callback);
            if (state.callbacks.length === 1) {
                this._doLoad(url, state);
            }
        }
    }

    private _doLoad (url: string, state: IScriptPackPendingState) {
        cc.loader.load(url, (_1, _2, item) => {
            if (item.error) {
                return;
            }  else if (scriptPackStack.length === 0) {
                if (CC_DEV) {
                    throw new Error(`Unreachable`);
                } else {
                    this._onLoadFailed(state, new Error(`Logic error.`));
                }
            }  else {
                const scriptPack = scriptPackStack.pop();
                this._onLoadSuccessed(state, scriptPack!);
            }
        }, (error) => {
            if (error) {
                this._onLoadFailed(state, error);
            }
        });
    }

    private _onLoadSuccessed (state: IScriptPackPendingState, scriptPack: ScripPack) {
        for (const callback of state.callbacks) {
            callback(null, scriptPack);
        }
        const asCached = state as unknown as IScriptPackCachedState;
        asCached.status = LoadStatus.Cached;
        asCached.cached = scriptPack;
    }

    private _onLoadFailed (state: IScriptPackPendingState, error: any) {
        for (const callback of state.callbacks) {
            callback(error);
        }
        const asFailed = state as unknown as IScriptPackFailedState;
        asFailed.status = LoadStatus.Failed;
        asFailed.error = error;
    }
}

const scriptPackManager = new ScriptPackManager();

const scriptPackStack = new Array<ScripPack>();

cc.pushScriptPack = (data: IScriptPackData) => {
    scriptPackStack.push(new ScripPack(data));
};

export function loadPackedScript (item, callback) {
    const url: string = item.url;
    const lastIndexOfSlash = url.lastIndexOf('/');
    if (lastIndexOfSlash < 0) {
        callback(new Error(`Bad url format.`));
        return;
    }

    const packUrl = url.substr(0, lastIndexOfSlash);
    let entryName = url.substr(lastIndexOfSlash + 1);
    entryName = entryName.substr(0, entryName.length - 5);
    scriptPackManager.load(packUrl, (error, asset) => {
        if (error) {
            callback(error);
        } else {
            asset!.loadEntry(entryName, callback);
        }
    });
}
