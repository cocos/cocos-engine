import type { error, errorID, warn, warnID } from "../../cocos/core";

abstract class LogWatcher<TArgs> {
    constructor(private _stop: () => void) {

    }

    get captured() {
        return this._logs;
    }

    public clear() {
        this._logs.length = 0;
    }

    public stop() {
        this.clear();
        this._stop();
    }

    /**
     * Do not call it from your code.
     */
    public feed(log: TArgs) {
        this._logs.push(log);
    }

    private _logs: TArgs[] = [];
}

class LogWatcherProvider<TArgs> {
    get current() {
        return this._current;
    }

    public create(): LogWatcher<TArgs> {
        if (this._current) {
            throw new Error(`There can be only one watcher of same log-level in the same time.`);
        }
        this._current = new LogWatcher(() => this._current = null);
        return this._current;
    }

    public beforeEach() {
        this._current?.clear();
        this._current = null;
    }

    public afterEach() {
        if (this._current) {
            if (this._current.captured.length !== 0) {
                throw new Error(
                    `There are still some logs emitted after your test has ended. ` +
                    `You should capture them or, ` +
                    `if they're not concerned by you, call 'watcher.stop()' before your test ends. ` +
                    `This restriction exists to prevent you from accidentally missing something.`
                );
            } else {
                this._current.clear();
                this._current = null;
            }
        }
    }

    private _current: LogWatcher<TArgs> | null = null;
}

const providers = {
    warn: new LogWatcherProvider<Parameters<typeof warn>>(),
    error: new LogWatcherProvider<Parameters<typeof error>>(),
    warnID: new LogWatcherProvider<Parameters<typeof warnID>>(),
    errorID: new LogWatcherProvider<Parameters<typeof errorID>>(),
};

type SupportedProviders = typeof providers;

type LogArgsOf<TProvider> = TProvider extends LogWatcherProvider<infer U> ? [U] : never;

//#region Our interactions with external world..

export function hookBeforeEach() {
    for (const [_, provider] of Object.entries(providers)) {
        provider.beforeEach();
    }
}

export function hookAfterEach() {
    for (const [_, provider] of Object.entries(providers)) {
        provider.afterEach();
    }
}

export function feed<T extends keyof SupportedProviders>(level: T, ...args: LogArgsOf<T>): boolean {
    const current = providers[level].current;
    if (current) {
        // @ts-expect-error TODO
        current.feed(args);
        return false;
    } else {
        return true; // Apply original warn
    }
}

/**
 * @zh 开始捕捉后续的警告信息，直到当前的测试结束。
 * @en Start capturing the following warning logs(produced by `warn()`), until current test ends.
 * @returns The log watcher.
 */
export function captureWarns() {
    return providers.warn.create();
}

/**
 * @zh 开始捕捉后续的错误信息，直到当前的测试结束。
 * @en Start capturing the following error logs(produced by `error()`), until current test ends.
 * @returns The log watcher.
 */
export function captureErrors() {
    return providers.error.create();
}

/**
 * @zh 开始捕捉后续的警告信息，直到当前的测试结束。
 * @en Start capturing the following warning logs(produced by `warnID()`), until current test ends.
 * @returns The log watcher.
 */
 export function captureWarnIDs() {
    return providers.warnID.create();
}

/**
 * @zh 开始捕捉后续的错误信息，直到当前的测试结束。
 * @en Start capturing the following error logs(produced by `errorID()`), until current test ends.
 * @returns The log watcher.
 */
export function captureErrorIDs() {
    return providers.errorID.create();
}

//#endregion