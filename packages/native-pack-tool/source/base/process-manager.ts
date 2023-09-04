export class ProcessManager {

    private _addChild: Function | null = null;

    private _removeChild: Function | null = null;

    setAddChild(addChild: Function) {
        if (!this._addChild) {
            this._addChild = addChild;
        }
    }

    setRemoveChild(removeChild: Function) {
        if (!this._removeChild) {
            this._removeChild = removeChild;
        }
    }

    getAddChild(): Function | null {
        return this._addChild;
    }

    getRemoveChild(): Function | null {
        return this._removeChild;
    }
}

export const processMg = new ProcessManager();