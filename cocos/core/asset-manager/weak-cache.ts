import { js } from '../utils/js';
import Cache from './cache';

declare class WeakRef<T> {
    constructor (obj: T);
    deref (): T | null;
}

export default class WeakCache<T> extends Cache<T> {
    protected _weakMap: Record<string, WeakRef<T>> = {};

    constructor (map?: Record<string, T>) {
        super(map);
        if (map) {
            this._map = null;
            for (let key in map) {
                this._weakMap[key] = new WeakRef(map[key]);
            }
            this._count = Object.keys(map).length;
        } else {
            this._count = 0;
        }
    }

    public add (key: string, val: T): T {
        if (!this.has(key)) {
            this._count++;
        }
        this._weakMap[key] = new WeakRef(val);
        return val;
    }

    public has (key: string): boolean {
        return key in this._weakMap && !!this._weakMap[key].deref();
    }

    public get (key: string): T | undefined {
        return this._weakMap[key] && this._weakMap[key].deref();
    }

    public remove (key: string): T | undefined {
        const out = this._weakMap[key];
        if (this.has(key)) {
            this._count--;
        }
        delete this._weakMap[key];
        return out && out.deref();
    }

    public clear (): void {
        if (this._count !== 0) {
            this._weakMap = js.createMap(true);
            this._count = 0;
        }
    }

    public forEach (func: (val: T, key: string) => void): void {
        for (const key in this._weakMap) {
            if (this.has(key)) {
                func(this._weakMap[key].deref(), key);
            }
        }
    }

    public find (predicate: (val: T, key: string) => boolean): T | null {
        for (const key in this._weakMap) {
            if (this.has(key) && predicate(this._weakMap[key].deref(), key)) {
                return this._weakMap[key].deref();
            }
        }
        return null;
    }

    public destroy (): void {
        this._weakMap = null;
    }
}