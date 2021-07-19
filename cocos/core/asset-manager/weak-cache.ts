import { js } from '../utils/js';
import Cache from './cache';

declare class WeakRef<T> {
    constructor (obj: T);
    deref (): T | null;
}

export default class WeakCache<T> extends Cache<T> {
    protected _weakMap: Record<string, WeakRef<T>> = {};

    constructor (map?: Record<string, T>) {
        super();
        this._map = null;
        if (map) {
            for (const key in map) {
                this._weakMap[key] = new WeakRef(map[key]);
            }
        }
    }

    public add (key: string, val: T): T {
        this._weakMap[key] = new WeakRef(val);
        return val;
    }

    public has (key: string): boolean {
        return key in this._weakMap && !!this._weakMap[key].deref();
    }

    public get (key: string): T | undefined | null {
        return this._weakMap[key] && this._weakMap[key].deref();
    }

    public remove (key: string): T | undefined | null {
        const out = this._weakMap[key];
        delete this._weakMap[key];
        return out && out.deref();
    }

    public clear (): void {
        this._weakMap = js.createMap(true);
    }

    public forEach (func: (val: T, key: string) => void): void {
        for (const key in this._weakMap) {
            const val = this.get(key);
            if (val) {
                func(val, key);
            }
        }
    }

    public find (predicate: (val: T, key: string) => boolean): T | null {
        for (const key in this._weakMap) {
            const val = this.get(key);
            if (val && predicate(val, key)) {
                return this._weakMap[key].deref();
            }
        }
        return null;
    }

    get count (): number {
        return Object.values(this._weakMap).filter((weakRef) => weakRef.deref()).length;
    }

    public destroy (): void {
        this._weakMap = {};
    }
}