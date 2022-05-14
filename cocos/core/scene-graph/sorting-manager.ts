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

import { legacyCC } from '../global-exports';

export class SortingManager {
    public static getSortingPriority (layer = 0, order = 0): number {
        return (((layer + (1 << 15)) << 16) | (order + (1 << 15))) >>> 0;
    }

    public static getSortingLayerIndex (layerID = 0): number {
        let index = 0;
        if (this.indexMap.has(layerID)) {
            index = this.indexMap.get(layerID)!;
        } else {
            console.error('invalid ID');
        }
        return index;
    }

    public static getSortingIndexFromName (name: string): number {
        const id = this.getSortingIDFromName(name);
        return this.getSortingLayerIndex(id);
    }

    // ID To Name
    public static getSortingLayerName (layerID = 0): string {
        let name = '';
        if (this.nameMap.has(layerID)) {
            name = this.nameMap.get(layerID)!;
        } else {
            console.error('invalid ID');
        }
        return name;
    }

    // Name To ID
    public static getSortingIDFromName (name: string): number {
        const count = this.nameMap.size;
        const keyIterator = this.nameMap.keys();
        let key = 0;
        for (let i = 0; i < count; i++) {
            key = keyIterator.next().value;
            if (this.nameMap.get(key) === name) return key;
        }
        console.warn('invalid name');
        return 0;
    }

    public static idIsValid (id: number): boolean {
        // check valid
        if (this.indexMap.has(id)) {
            return true;
        } else {
            console.error('invalid ID');
            return false;
        }
    }

    // Editor Function

    public static addSortingLayer () {
        this.ID++;
        if (this.ID > 65535) {
            console.error('too many layers');
        }
        this.nameMap.set(this.ID, `New Layer${this.ID}`);
        this.indexMap.set(this.ID, this.ID);
    }

    public static removeSortingLayer (layerID: number) {
        if (!this.idIsValid(layerID)) return;

        if (this.nameMap.has(layerID) && this.indexMap.has(layerID)) {
            // Todo: need update all component used this layer
            // set the value to 0
            this.nameMap.delete(layerID);
            this.indexMap.delete(layerID);
        }
    }

    public static renameSortingLayer (layerID, layerName) {
        if (this.nameMap.has(layerID)) {
            console.warn('Invalid layer id.');
        } else {
            this.nameMap.set(layerID, layerName);
        }
    }

    public static changeIndex () {
        // Todo: need update index map
        // Todo: need update all component sorting priority in active scene
    }

    private static defaultIndex = 0;
    private static defaultName = 'default';
    private static nameMap = new Map<number, string>();
    private static indexMap = new Map<number, number>();
    private static ID = 0;

    public static initLayerFromSettings (layerID, layerName, layerIndex) {
        this.nameMap.set(layerID, layerName);
        this.indexMap.set(layerID, layerIndex);
    }

    public static initLayerIDFromSettings (ID) {
        // Error check
        if (ID > 65535) {
            console.error('Invalid layer id.');
        }
        this.ID = ID;
    }
}

legacyCC.sortingManager = SortingManager;
