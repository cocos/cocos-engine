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
import { DEBUG, EDITOR } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { ValueType } from '../value-types';
import { CCClass } from './class';
import { GCObject } from './gc-object';

declare class FinalizationRegistry {
    constructor (callback: (heldObj: any) => void);
    register (obj: any, heldObj: any, token?: any);
    unregister (token: any);
}

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

    public markGCObject (obj: GCObject) {
        if (this.isMarked(obj)) return;
        this._mark(obj);
        if (obj.markDependencies) { obj.markDependencies(this); }
    }

    private _mark (obj: any) {
        if (obj.__gcVersion__ !== undefined) {
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
        if (obj instanceof ValueType) return;
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
        case ReferenceType.GC_OBJECT:
        case ReferenceType.CCCLASS_OBJECT:
            this.markCCClassObject(obj);
            break;
        case ReferenceType.ANY:
            this.markAny(obj);
            break;
        case ReferenceType.GC_OBJECT_ARRAY:
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
        case ReferenceType.GC_OBJECT_MAP:
        case ReferenceType.GC_OBJECT_SET:
        case ReferenceType.CCCLASS_OBJECT_MAP:
        case ReferenceType.CCCLASS_OBJECT_SET:
            (obj as Map<any, any> | Set<any>).forEach((val) => { if (val) { this.markCCClassObject(val); } });
            break;
        case ReferenceType.ANY_MAP:
        case ReferenceType.ANY_SET:
            (obj as Map<any, any> | Set<any>).forEach((val) => { if (val) { this.markAny(val); } });
            break;
        case ReferenceType.GC_OBJECT_RECORD:
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
    GC_OBJECT,
    CCCLASS_OBJECT,
    ANY,
    GC_OBJECT_ARRAY,
    GC_OBJECT_RECORD,
    GC_OBJECT_MAP,
    GC_OBJECT_SET,
    CCCLASS_OBJECT_ARRAY,
    CCCLASS_OBJECT_RECORD,
    CCCLASS_OBJECT_MAP,
    CCCLASS_OBJECT_SET,
    ANY_ARRAY,
    ANY_RECORD,
    ANY_MAP,
    ANY_SET,
}

export function markAsGCRoot (target: any, propertyName: string): void;
export function markAsGCRoot (referenceType: ReferenceType): (target: any, propertyName: string) => void;
export function markAsGCRoot (target?: any, propertyName?: string): void | ((target: any, propertyName: string) => void) {
    if (propertyName) {
        return garbageCollectionManager.registerGarbageCollectableProperty(target.constructor as Constructor, propertyName, ReferenceType.GC_OBJECT);
    }
    return (proto: any, propertyName: string) => {
        garbageCollectionManager.registerGarbageCollectableProperty(proto.constructor as Constructor, propertyName, target);
    };
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
    private _allGCObjects: GCObject[] = [];
    private _ignoredGCObjects: GCObject[] = [];
    private _finalizationRegistry: FinalizationRegistry | null = null;

    public getAllGCObject (): readonly GCObject[] {
        return this._allGCObjects;
    }

    public getIgnoredGCObjects (): readonly GCObject[] {
        return this._ignoredGCObjects;
    }

    public registerGCObject (gcObject: GCObject): GCObject {
        if (EDITOR) {
            gcObject._finalizationToken = {};
            const proxy = new Proxy(gcObject, {});
            this._finalizationRegistry!.register(proxy, gcObject, gcObject._finalizationToken);
            return proxy;
        } else {
            const id = this._allGCObjects.length;
            this._allGCObjects.push(gcObject);
            gcObject._internalId = id;
            return gcObject;
        }
    }

    public unregisterGCObject (gcObject: GCObject) {
        if (EDITOR) {
            this._finalizationRegistry!.unregister(gcObject._finalizationToken);
        } else if (gcObject._internalId !== -1) {
            const tail = this._allGCObjects[this._allGCObjects.length - 1];
            tail._internalId = gcObject._internalId;
            this._allGCObjects[gcObject._internalId] = tail;
            this._allGCObjects.length -= 1;
            gcObject._internalId = -1;
        }
    }

    public registerIgnoredGCObject (gcObject: GCObject) {
        gcObject._ignoreId = this._ignoredGCObjects.length;
        this._ignoredGCObjects.push(gcObject);
    }

    public unregisterIgnoredGCObject (gcObject: GCObject) {
        if (gcObject._ignoreId !== -1) {
            const tail = this._ignoredGCObjects[this._ignoredGCObjects.length - 1];
            tail._ignoreId = gcObject._ignoreId;
            this._ignoredGCObjects[gcObject._ignoreId] = tail;
            this._ignoredGCObjects.length -= 1;
            gcObject._ignoreId = -1;
        }
    }

    public init () {
        this._ccclassRoots.clear();
        this._normalRoots.clear();
        this._allGCObjects.length = 0;
        this._ignoredGCObjects.length = 0;
        this._garbageCollectionContext.reset();
        this._garbageCollectableClassInfos.forEach((classInfo, ctor) => {
            this.generateMarkDependenciesFunctionForBuiltinCCClass(ctor);
        });
        if (EDITOR) { this._finalizationRegistry = new FinalizationRegistry(this.finalizationRegistryCallback.bind(this)); }
        this._classCreatedCallback = this.generateMarkDependenciesFunctionForCustomCCClass.bind(this);
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

    finalizationRegistryCallback (gcObject: GCObject) {
        gcObject.destroy();
    }

    public getGarbageCollectableClassInfo (ctor: Constructor) {
        return this._garbageCollectableClassInfos.get(ctor);
    }

    public isGarbageCollectableCCClass (ctor: Constructor): boolean {
        return !!ctor.prototype.markDependencies;
    }

    public addCCClassObjectToRoot (obj: any) {
        this._ccclassRoots.add(obj);
    }

    public removeCCClassObjectFromRoot (obj: any) {
        this._ccclassRoots.delete(obj);
    }

    public addGCObjectToRoot (gcObject: GCObject) {
        this._ccclassRoots.add(gcObject);
    }

    public removeGCObjectFromRoot (gcObject: GCObject) {
        this._ccclassRoots.delete(gcObject);
    }

    public addToRoot (obj: any, referenceType: ReferenceType = ReferenceType.ANY) {
        this._normalRoots.set(obj, referenceType);
    }

    public removeFromRoot (obj: any) {
        this._normalRoots.delete(obj);
    }

    public collectGarbage (gcObjects?: readonly GCObject[]) {
        if (EDITOR) {
            // todo: trigger electron gc
        } else {
            this.markPhase();
            this.sweepPhase(gcObjects || this.getAllGCObject());
        }
    }

    private markPhase () {
        legacyCC.director.emit(legacyCC.Director.EVENT_BEFORE_GC, this._garbageCollectionContext);
        const ignoreFromGCObjects = this.getIgnoredGCObjects();
        ignoreFromGCObjects.forEach((root) => {
            this._garbageCollectionContext.markCCClassObject(root);
        });
        this._ccclassRoots.forEach((root) => {
            this._garbageCollectionContext.markCCClassObject(root);
        });
        this._normalRoots.forEach((referenceType, root) => {
            this._garbageCollectionContext.markObjectWithReferenceType(root, referenceType);
        });
        legacyCC.director.emit(legacyCC.Director.EVENT_AFTER_GC);
    }

    public generateMarkDependenciesFunctionForBuiltinCCClass (ctor: Constructor) {
        const classInfo = this.getGarbageCollectableClassInfo(ctor);
        if (!classInfo) return;
        const { properties, referenceTypes } = classInfo;
        const prototype = ctor.prototype;
        const parenMarkDependencies = prototype.markDependencies;

        if (parenMarkDependencies) {
            prototype.markDependencies = function markDependenciesWithParent (context: GarbageCollectorContext) {
                parenMarkDependencies.call(this, context);
                for (let i = 0; i < properties.length; i++) {
                    const property = this[properties[i]];
                    if (property) { context.markObjectWithReferenceType(property, referenceTypes[i]); }
                }
            };
        } else {
            prototype.markDependencies = function markDependenciesWithoutParent (this: any, context: GarbageCollectorContext) {
                for (let i = 0; i < properties.length; i++) {
                    const property = this[properties[i]];
                    if (property) { context.markObjectWithReferenceType(property, referenceTypes[i]); }
                }
            };
        }
    }

    public generateMarkDependenciesFunctionForCustomCCClass (ctor: Constructor) {
        const prototype = ctor.prototype;
        const hasMarkDependencies = prototype.markDependencies;
        if (!hasMarkDependencies) {
            prototype.markDependencies = function markDependenciesWithParent (context: GarbageCollectorContext) {
                const properties = Object.getOwnPropertyNames(this);
                for (let i = 0; i < properties.length; i++) {
                    const property = this[properties[i]];
                    if (property) { context.markAny(property); }
                }
            };
        }
    }

    private sweepPhase (gcObjects: readonly GCObject[]) {
        for (let i = gcObjects.length - 1; i >= 0; i--) {
            const obj = gcObjects[i];
            if (!this._garbageCollectionContext.isMarked(obj)) {
                if (DEBUG) { console.log(obj); }
                obj.destroy();
            }
        }
        this._garbageCollectionContext.reset();
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
