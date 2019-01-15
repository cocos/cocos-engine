import { UI } from './ui';

export enum UIWidgetType {
    LABEL,
    SPRITE,
}

export abstract class UIWidget {

    protected _ui: UI;
    protected _type: UIWidgetType;
    protected _vertices: Float32Array | null = null;
    protected _indices: Uint16Array | null = null;

    constructor (ui: UI, type: UIWidgetType) {
        this._ui = ui;
        this._type = type;
    }

    public type (): UIWidgetType {
        return this._type;
    }

    public abstract update ();
}
