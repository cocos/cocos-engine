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

/**
 * @zh
 * 材质在挂载到模型时的定制回调，一般用于显示相关的特殊逻辑，<br>
 * 作为渲染管线的定制不够灵活时的最后备用路线，或初期快速实现思路原型的小工具。<br>
 * 因为书写回调函数时不可避免地会对内部渲染流程做一部分 assumption，不建议作为商业项目的正式依赖。
 * @example
 * ```typescript
 * cc.customizationManager.register('no-frustum-culling', {
 *     onAttach: (m) => {
 *         m.worldBoundsBak = m.worldBounds;
 *         m.modelBoundsBak = m.modelBounds;
 *         m._modelBounds = m._worldBounds = null;
 *     },
 *     onDetach: (m) => {
 *         m._worldBounds = m.worldBoundsBak;
 *         m._modelBounds = m.modelBoundsBak;
 *         delete m.modelBoundsBak; delete m.worldBoundsBak;
 *     },
 * });
 * ```
 */
class CustomizationManager {
    protected _customs: Record<string, Customization> = {};

    /**
     * @zh 注册新的定制回调
     * @param name 此定制回调名
     * @param info 具体定制回调函数
     */
    public register (name: string, info: ICustomization) {
        this._customs[name] = new Customization(info);
    }

    /**
     * @zh 材质挂载到 model 时，会根据 pass 内信息调用此函数
     * @param name 目标定制回调
     * @param model 源模型
     */
    public attach (name: string, model: Model) {
        const cus = this._customs[name];
        if (!cus) { console.warn(`no customization named '${name}'`); return; }
        cus.attach(model);
    }

    /**
     * @zh 在材质与 model 分离时，会根据 pass 内信息调用此函数
     * @param name 目标定制回调
     * @param model 源模型
     */
    public detach (name: string, model: Model) {
        const cus = this._customs[name];
        if (!cus) { console.warn(`no customization named '${name}'`); return; }
        cus.detach(model);
    }
}

export const customizationManager = new CustomizationManager();
cc.customizationManager = customizationManager;
