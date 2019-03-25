// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { Model } from './model';

export type CustomCallback = (m: Model) => void;
export interface ICustomization {
    onAttach?: CustomCallback;
    onDetach?: CustomCallback;
}

class Customization {
    protected _onAttach?: CustomCallback;
    protected _onDetach?: CustomCallback;
    protected _models: Record<number, number> = {};

    constructor (info: ICustomization) {
        this._onAttach = info.onAttach;
        this._onDetach = info.onDetach;
    }

    public attach (model: Model) {
        const models = this._models;
        const id = model.id;
        if (models[id]) { models[id]++; return; }
        if (this._onAttach) { this._onAttach(model); }
        models[id] = 1;
    }

    public detach (model: Model) {
        const models = this._models;
        const id = model.id;
        if (!models[id] || --models[id] > 0) { return; }
        if (this._onDetach) { this._onDetach(model); }
    }
}

class CustomizationManager {
    protected _customs: Record<string, Customization> = {};

    public register (name: string, info: ICustomization) {
        this._customs[name] = new Customization(info);
    }

    public attach (name: string, model: Model) {
        const cus = this._customs[name];
        if (!cus) { console.warn(`no customization named '${name}'`); return; }
        cus.attach(model);
    }

    public detach (name: string, model: Model) {
        const cus = this._customs[name];
        if (!cus) { console.warn(`no customization named '${name}'`); return; }
        cus.detach(model);
    }
}

export const customizationManager = new CustomizationManager();
cc.customizationManager = customizationManager;
