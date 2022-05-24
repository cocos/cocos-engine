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
import { legacyCC } from '../global-exports';
import { errorID } from '../platform';

export class SortingManager {
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

    // Editor Function

    public static addLayer () {
        if (EDITOR) {
            this.ID++;
            if (this.ID > 65535) {
                errorID(2107);
            }
            this.nameMap.set(this.ID, `New Layer${this.ID}`);
            this.indexMap.set(this.ID, this.ID);
        }
    }

    public static removeSortingLayer (layer: number) {
        if (EDITOR) {
            if (!this.isLayerValid(layer)) return;

            if (this.nameMap.has(layer) && this.indexMap.has(layer)) {
            // Todo: need update all component used this layer
            // set the value to 0
                this.nameMap.delete(layer);
                this.indexMap.delete(layer);
            }
        }
    }

    public static renameLayer (layer: number, layerName: string) {
        if (EDITOR) {
            if (this.nameMap.has(layer)) {
                errorID(2105);
            } else {
                this.nameMap.set(layer, layerName);
            }
        }
    }

    public static changeIndex () {
        if (EDITOR) {
            // Todo: need update index map
            // Todo: need update all component sorting priority in active scene
        }
    }

    private static defaultIndex = 0;
    private static defaultName = 'default';
    private static nameMap = new Map<number, string>();
    private static indexMap = new Map<number, number>();
    private static ID = 0;

    public static initLayerFromSettings (layer, layerName, layerIndex) {
        this.nameMap.set(layer, layerName);
        this.indexMap.set(layer, layerIndex);
    }

    public static initLayerIDFromSettings (ID) {
        // Error check
        if (ID > 65535) {
            errorID(2105);
        }
        this.ID = ID;
    }
}

legacyCC.sortingManager = SortingManager;
