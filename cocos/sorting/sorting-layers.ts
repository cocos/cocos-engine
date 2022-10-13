/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.
 http://www.cocos.com
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.
 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { EDITOR } from 'internal:constants';
import { director } from '../game/director';
import { Game, game } from '../game';
import { errorID } from '../core/platform/debug';
import { Settings, settings } from '../core/settings';
import { Enum } from '../core/value-types';

interface SortingItem {
    id: number;
    name: string;
    value: number;
}

const SortingLayer = {
    default: 0,
};

game.on(Game.EVENT_POST_SUBSYSTEM_INIT, () => {
    SortingLayers.init();
});

/**
 * @zh 排序层管理器，用于在 sorting 组件中帮助用户进行对象分组并进行层级排序。
 * 在sorting组件中，layer 的排序优先级高于 sortingOrder。
 * @en Sorting layers manager, Used in the sorting component to help the user group objects and perform layer sorting.
 * In the sorting component, layer has higher sorting priority than sortingOrder.
 * */
export class SortingLayers {
    private static nameMap = new Map<number, string>();
    private static indexMap = new Map<number, number>();

    /**
     * @en All sortinglayers in an Enum
     * @zh 以 Enum 形式存在的所有排序层列表
     */
    public static Enum = Enum(SortingLayer);

    /**
     * @zh 计算排序优先级
     * @en Calculate sorting priority
     */
    public static getSortingPriority (layer = 0, order = 0): number {
        return (((layer + (1 << 15)) << 16) | (order + (1 << 15))) >>> 0;
    }

    /**
     * @zh 获取 Layer 顺序索引
     * @en Get Layer index by id
     */
    public static getLayerIndex (layer = 0): number {
        let index = 0;
        if (this.indexMap.has(layer)) {
            index = this.indexMap.get(layer)!;
        } else {
            errorID(2105);
        }
        return index;
    }

    /**
     * @zh 通过 Layer 名字获取 Layer 顺序索引值
     * @en Get Layer index by name
     */
    public static getLayerIndexByName (name: string): number {
        const id = this.getLayerByName(name);
        return this.getLayerIndex(id);
    }

    /**
     * @zh 获取 Layer 名字
     * @en Get Layer name by id
     */
    public static getLayerName (layer = 0): string {
        let name = '';
        if (this.nameMap.has(layer)) {
            name = this.nameMap.get(layer)!;
        } else {
            errorID(2105);
        }
        return name;
    }

    /**
     * @zh 通过 Layer 名字获取 Layer id 值
     * @en Get Layer id by name
     */
    public static getLayerByName (name: string): number {
        const count = this.nameMap.size;
        const keyIterator = this.nameMap.keys();
        let key = 0;
        for (let i = 0; i < count; i++) {
            key = keyIterator.next().value;
            if (this.nameMap.get(key) === name) return key;
        }
        errorID(2106);
        return 0;
    }

    /**
     * @zh 检查 Layer id 有效性
     * @en Check Layer id validity
     */
    public static isLayerValid (id: number): boolean {
        // check valid
        if (this.indexMap.has(id)) {
            return true;
        } else {
            errorID(2105);
            return false;
        }
    }

    /**
     * @engineInternal
     */
    public static init () {
        const sortingLayers = settings.querySettings<SortingItem[]>(Settings.Category.ENGINE, 'sortingLayers');
        if (!sortingLayers) return;
        SortingLayers.resetState();
        for (let i = 0; i < sortingLayers.length; i++) {
            const layer = sortingLayers[i];
            SortingLayers.setLayer(layer.id, layer.name, layer.value);
            SortingLayers.Enum[layer.name] = layer.id;
        }
        Enum.update(SortingLayers.Enum);
        Enum.sortList(SortingLayers.Enum, (a, b) => SortingLayers.getLayerIndex(a.value) - SortingLayers.getLayerIndex(b.value));

        if (EDITOR) {
            const scene = director.getScene();
            if (!scene) {
                return;
            }
            scene.walk((node) => {
                const sort = node.getComponent('cc.Sorting');
                if (sort) {
                    // @ts-expect-error private method
                    sort._updateSortingPriority();
                }
            });
        }
    }

    /**
     * @engineInternal
     */
    public static setLayer (layer, layerName, layerIndex) {
        this.nameMap.set(layer, layerName);
        this.indexMap.set(layer, layerIndex);
    }

    /**
     * @engineInternal
     */
    private static resetState () {
        const oldItem = Object.keys(SortingLayers.Enum);
        for (let i = 0; i < oldItem.length; i++) {
            delete SortingLayers.Enum[SortingLayers.Enum[oldItem[i]]];
            delete SortingLayers.Enum[oldItem[i]];
        }
        SortingLayers.indexMap.clear();
        SortingLayers.nameMap.clear();
    }
}
