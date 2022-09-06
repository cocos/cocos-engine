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
import { legacyCC } from '../core/global-exports';
import { errorID } from '../core/platform/debug';
import { Settings, settings } from '../core/settings';
import { Enum } from '../core/value-types';

interface SortingItem {
    id: number;
    name: string;
    index: number;
}

const SortingLayer = {
    default: 0,
};

export class SortingLayers {
    private static nameMap = new Map<number, string>();
    private static indexMap = new Map<number, number>();

    public static Enum = Enum(SortingLayer);

    public static getSortingPriority (layer = 0, order = 0): number {
        return (((layer + (1 << 15)) << 16) | (order + (1 << 15))) >>> 0;
    }

    public static getLayerIndex (layer = 0): number {
        let index = 0;
        if (this.indexMap.has(layer)) {
            index = this.indexMap.get(layer)!;
        } else {
            errorID(2105);
        }
        return index;
    }

    public static getLayerIndexByName (name: string): number {
        const id = this.getLayerByName(name);
        return this.getLayerIndex(id);
    }

    // ID To Name
    public static getLayerName (layer = 0): string {
        let name = '';
        if (this.nameMap.has(layer)) {
            name = this.nameMap.get(layer)!;
        } else {
            errorID(2105);
        }
        return name;
    }

    // Name To ID
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

    public static isLayerValid (id: number): boolean {
        // check valid
        if (this.indexMap.has(id)) {
            return true;
        } else {
            errorID(2105);
            return false;
        }
    }

    public static init () {
        const sortingLayers = settings.querySettings<SortingItem[]>(Settings.Category.ENGINE, 'sortingLayers');
        if (!sortingLayers) return;
        const LayerEnum: any = {};
        for (let i = 0; i < sortingLayers.length; i++) {
            const layer = sortingLayers[i];
            SortingLayers.setLayer(layer.id, layer.name, layer.index);
            if (SortingLayers.Enum[layer.name]) {
                delete SortingLayers.Enum[layer.name];
            }
            LayerEnum[layer.name] = layer.id;
        }
        Object.assign(SortingLayers.Enum, LayerEnum);
        Enum.update(SortingLayers.Enum);
    }

    // Editor Function to init config
    public static setLayer (layer, layerName, layerIndex) {
        this.nameMap.set(layer, layerName);
        this.indexMap.set(layer, layerIndex);
    }
}

legacyCC.sortingLayers = SortingLayers;
