export class AsyncDelegate<T extends (...args: any) => (Promise<void> | void) = () => (Promise<void> | void)> {
    private _delegates: T[] = [];

    public add (callback: T) {
        if (this._delegates.indexOf(callback) === -1) {
            this._delegates.push(callback);
        }
    }

    public hasListener (callback: T) {
        if (this._delegates.indexOf(callback) !== -1) {
            return true;
        }
        return false;
    }

    public remove (callback: T) {
        const index = this._delegates.indexOf(callback);
        if (index !== -1) {
            this._delegates.splice(index, 1);
        }
    }

    public dispatch (...args: Parameters<T>) {
        return Promise.all(this._delegates.map((func) => func(...arguments)).filter(Boolean));
    }
}
