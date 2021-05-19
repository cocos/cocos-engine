/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
import { DEBUG } from 'internal:constants';
import { Asset } from '../assets/asset';
import { Component } from '../components';
import { CCClass } from '../data/class';
import { assets, fetchPipeline, pipeline, singleAssetLoadPipeline } from './shared';

export class GarbageCollectorContext {
    public gcVersion = 0;
    public reset () {
        this.gcVersion++;
    }

    public markCCClassObject (obj: any) {
        if (this.isMarked(obj)) return;
        this._mark(obj);
        if (obj.markDependencies) { obj.markDependencies(this); }
    }

    public markAsset (asset: Asset) {
        if (this.isMarked(asset)) return;
        this._mark(asset);
        if (asset.markDependencies) { asset.markDependencies(this); }
    }

    private _mark (obj: any) {
        if (obj.__gcVersion__) {
            obj.__gcVersion__ = this.gcVersion;
        } else {
            Object.defineProperty(obj, '__gcVersion__', { enumerable: false, value: this.gcVersion, writable: true });
        }
    }

    public isMarked (obj: any) {
        return obj.__gcVersion__ === this.gcVersion;
    }

    public markAny (obj: any) {
        if (CCClass._isCCClass(obj.constructor)) {
            this.markCCClassObject(obj);
            return;
        }

        if (this.isMarked(obj)) { return; }
        this._mark(obj);
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                if (obj[i] && typeof obj[i] === 'object') {
                    this.markAny(obj[i]);
                }
            }
        } else if (obj.constructor === Object) {
            for (const key in obj) {
                if (obj[key] && typeof obj[key] === 'object') {
                    this.markAny(obj[key]);
                }
            }
        } else if (obj instanceof Map || obj instanceof Set) {
            obj.forEach(this.markAny.bind(this));
        }
    }

    public markObjectWithReferenceType (obj: any, referenceType: ReferenceType) {
        switch (referenceType) {
        case ReferenceType.ASSET:
        case ReferenceType.CCCLASS_OBJECT:
            this.markCCClassObject(obj);
            break;
        case ReferenceType.ANY:
            this.markAny(obj);
            break;
        case ReferenceType.ASSET_ARRAY:
        case ReferenceType.CCCLASS_OBJECT_ARRAY:
            for (let i = 0; i < obj.length; i++) {
                if (obj[i]) { this.markCCClassObject(obj[i]); }
            }
            break;
        case ReferenceType.ANY_ARRAY:
            for (let i = 0; i < obj.length; i++) {
                if (obj[i]) { this.markAny(obj[i]); }
            }
            break;
        case ReferenceType.ASSET_MAP:
        case ReferenceType.ASSET_SET:
        case ReferenceType.CCCLASS_OBJECT_MAP:
        case ReferenceType.CCCLASS_OBJECT_SET:
            (obj as Map<any, any> | Set<any>).forEach((val) => { if (val) { this.markCCClassObject(val); } });
            break;
        case ReferenceType.ANY_MAP:
        case ReferenceType.ANY_SET:
            (obj as Map<any, any> | Set<any>).forEach((val) => { if (val) { this.markAny(val); } });
            break;
        case ReferenceType.ASSET_RECORD:
        case ReferenceType.CCCLASS_OBJECT_RECORD:
            for (const key in obj) {
                if (obj[key]) { this.markCCClassObject(obj[key]); }
            }
            break;
        case ReferenceType.ANY_RECORD:
            for (const key in obj) {
                if (obj[key]) { this.markAny(obj[key]); }
            }
            break;
        default: break;
        }
    }
}

export enum ReferenceType {
    ASSET,
    CCCLASS_OBJECT,
    ANY,
    ASSET_ARRAY,
    ASSET_RECORD,
    ASSET_MAP,
    ASSET_SET,
    CCCLASS_OBJECT_ARRAY,
    CCCLASS_OBJECT_RECORD,
    CCCLASS_OBJECT_MAP,
    CCCLASS_OBJECT_SET,
    ANY_ARRAY,
    ANY_RECORD,
    ANY_MAP,
    ANY_SET,
}

export function referenced (target: any, propertyName: string, descriptor?: any): void;
export function referenced (referenceType: ReferenceType): (target: any, propertyName: string, descriptor?: any) => void;
export function referenced (target?: any, propertyName?: string, descriptor?: any): void | ((target: any, propertyName: string, descriptor?: any) => void) {
    if (propertyName) {
        garbageCollectionManager.registerGarbageCollectableProperty(target.constructor as Constructor, propertyName, ReferenceType.ASSET);
    } else {
        return (proto: any, propertyName: string, descriptor?: any) => {
            garbageCollectionManager.registerGarbageCollectableProperty(proto.constructor as Constructor, propertyName, target);
        };
    }
}

class GarbageCollectableClassInfo {
    public properties: string[] = [];
    public referenceTypes: ReferenceType[] = [];
}

class GarbageCollectionManager {
    private _garbageCollectableClassInfos: Map<Constructor, GarbageCollectableClassInfo> = new Map();
    private _ccclassRoots: Set<any> = new Set();
    private _normalRoots: Map<any, ReferenceType> = new Map();
    private _garbageCollectionContext: GarbageCollectorContext = new GarbageCollectorContext();
    private _classCreatedCallback: ((ctor: Constructor) => void) | null = null;

    public init () {
        this._ccclassRoots.clear();
        this._normalRoots.clear();
        this._garbageCollectionContext.reset();
        this._garbageCollectableClassInfos.forEach((classInfo, ctor) => {
            this.generateMarkDependenciesFunctionForCCClass(ctor);
        });
        this._classCreatedCallback = this.generateMarkDependenciesFunctionForCCClass.bind(this);
        CCClass.onClassCreated(this._classCreatedCallback);
    }

    public registerGarbageCollectableProperty (ctor: Constructor, propertyName: string, referenceType: ReferenceType) {
        if (this._garbageCollectableClassInfos.has(ctor)) {
            const classInfo = this._garbageCollectableClassInfos.get(ctor);
            classInfo!.properties.push(propertyName);
            classInfo!.referenceTypes.push(referenceType);
        } else {
            const classInfo = new GarbageCollectableClassInfo();
            classInfo.properties.push(propertyName);
            classInfo.referenceTypes.push(referenceType);
            this._garbageCollectableClassInfos.set(ctor, classInfo);
        }
    }

    public getGarbageCollectableClassInfo (ctor: Constructor) {
        return this._garbageCollectableClassInfos.get(ctor);
    }

    public isGarbageCollectableCCClass (ctor: Constructor): boolean {
        return !!ctor.prototype.markDependencies;
    }

    public addComponentToRoot (component: Component) {
        this._ccclassRoots.add(component);
    }

    public removeComponentFromRoot (component: Component) {
        this._ccclassRoots.delete(component);
    }

    public addManagerToRoot (mgr: any) {
        this._ccclassRoots.add(mgr);
    }

    public removeManagerFromRoot (mgr: any) {
        this._ccclassRoots.delete(mgr);
    }

    public addAssetToRoot (asset: Asset) {
        this._ccclassRoots.add(asset);
    }

    public removeAssetFromRoot (asset: Asset) {
        this._ccclassRoots.delete(asset);
    }

    public addToRoot (obj: any, referenceType: ReferenceType = ReferenceType.ANY) {
        this._normalRoots.set(obj, referenceType);
    }

    public removeFromRoot (obj: any) {
        this._normalRoots.delete(obj);
    }

    public collectGarbage (assetArea: readonly Asset[]) {
        this.markPhase();
        this.sweepPhase(assetArea);
    }

    private markPhase () {
        this.markAllPendLoadingAsset();
        this._ccclassRoots.forEach((root) => {
            this._garbageCollectionContext.markCCClassObject(root);
        });
        this._normalRoots.forEach((referenceType, root) => {
            this._garbageCollectionContext.markObjectWithReferenceType(root, referenceType);
        });
    }

    public generateMarkDependenciesFunctionForCCClass (ctor: Constructor) {
        const classInfo = this.getGarbageCollectableClassInfo(ctor);
        if (!classInfo) return;
        const { properties, referenceTypes } = classInfo;
        const prototype = ctor.prototype;
        const parenMarkDependencies = prototype.markDependencies;
        prototype.markDependencies = parenMarkDependencies ? function markDependenciesWithParent (context: GarbageCollectorContext) {
            parenMarkDependencies.call(this, context);
            for (let i = 0; i < properties.length; i++) {
                const property = this[properties[i]];
                if (property) { context.markObjectWithReferenceType(property, referenceTypes[i]); }
            }
        } : function markDependenciesWithoutParent (context: GarbageCollectorContext) {
            for (let i = 0; i < properties.length; i++) {
                const property = this[properties[i]];
                if (property) { context.markObjectWithReferenceType(property, referenceTypes[i]); }
            }
        };
    }

    private sweepPhase (assetArea: readonly Asset[]) {
        for (let i = assetArea.length - 1; i >= 0; i--) {
            const asset = assetArea[i];
            if (!this._garbageCollectionContext.isMarked(asset)) {
                if (DEBUG) { console.log(asset); }
                assets.remove(asset._uuid);
                asset.destroy();
            }
        }
        this._garbageCollectionContext.reset();
    }

    private markAllPendLoadingAsset () {
        const singleAssetTasks = singleAssetLoadPipeline.allTasks;
        for (let i = 0; i < singleAssetTasks.length; i++) {
            const task = singleAssetTasks[i];
            if (task.input.content) { this._garbageCollectionContext.markAsset(task.input.content); }
        }
        const loadTasks = pipeline.allTasks;
        for (let i = 0; i < loadTasks.length; i++) {
            const task = loadTasks[i];
            for (let j = 0; j < task.output.length; j++) {
                if (task.output[i].content) this._garbageCollectionContext.markAsset(task.output[i].content);
            }
        }
        const preloadTasks = fetchPipeline.allTasks;
        for (let i = 0; i < preloadTasks.length; i++) {
            const task = preloadTasks[i];
            for (let j = 0; j < task.output.length; j++) {
                if (task.output[i].content) this._garbageCollectionContext.markAsset(task.output[i].content);
            }
        }
    }

    public destroy () {
        this._ccclassRoots.clear();
        this._normalRoots.clear();
        this._garbageCollectionContext.reset();
        CCClass.offClassCreated(this._classCreatedCallback!);
    }
}

const garbageCollectionManager = new GarbageCollectionManager();
export { garbageCollectionManager };
