/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-const */

import { error, errorID, warn, warnID } from '../platform/debug';

let defaultLogTimes = 10;

/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 */
export function setDefaultLogTimes (times: number): void {
    if (times > 0) {
        defaultLogTimes = times;
    }
}

interface IReplacement {
    /** Deprecated property name. */
    name: string;
    /** Times to print log when accessing deprecated property. */
    logTimes?: number;
    /** New property name. */
    newName?: string;
    /** The object to deprecate this property. */
    target?: object;
    /** The name of the object to deprecate this property. */
    targetName?: string;
    /** New function to access the property. If it is valid, `customSetter` and `customGetter` will be ignored. */
    customFunction?: Function;
    /** New setter. */
    customSetter?: (v: any) => void;
    /** New getter. */
    customGetter?: () => any;
    /** Property description used in warning log. */
    suggest?: string;
}

interface IRemoveItem {
    /** Removed property name. */
    name: string;
    /** Times to print log when accessing removed property. */
    logTimes?: number;
    /** Property description used in warning log. */
    suggest?: string;
}

interface IMarkItem {
    /** Deprecated property name. */
    name: string;
    /** Times to print log when accessing deprecated property. */
    logTimes?: number;
    /** Property description used in warning log. */
    suggest?: string;
}

/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 */
export let replaceProperty: (owner: object, ownerName: string, properties: IReplacement[]) => void;

/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 */
export let removeProperty: (owner: object, ownerName: string, properties: IRemoveItem[]) => void;

/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 */
export let markAsWarning: (owner: object, ownerName: string, properties: IMarkItem[]) => void;

let replacePropertyLog: (n: string, dp: string, n2: string, newp: string, f: Function, id: number, s: string) => void;

let markAsWarningLog: (n: string, dp: string, f: Function, id: number, s: string) => void;

let removePropertyLog: (n: string, dp: string, f: Function, id: number, s: string) => void;

// if (DEBUG) {

interface IMeessageItem {
    id: Readonly<number>;
    logTimes: Readonly<number>;
    count: number;
}

let messageID = 0;
const messageMap: Map<number, IMeessageItem> = new Map<number, IMeessageItem>();

replacePropertyLog = (n: string, dp: string, n2: string, newp: string, f: Function, id: number, s: string) => {
    const item = messageMap.get(id);
    if (item && item.logTimes > item.count) {
        f(`'%s' is deprecated, please use '%s' instead. ${s}`, `${n}.${dp}`, `${n2}.${newp}`);
        item.count++;
    }
};

replaceProperty = (owner: object, ownerName: string, properties: IReplacement[]) => {
    if (owner == null) return;

    properties.forEach((item: IReplacement) => {
        const id = messageID++;
        messageMap.set(id, { id, count: 0, logTimes: item.logTimes !== undefined ? item.logTimes : defaultLogTimes });
        const target = item.target != null ? item.target : owner;
        const newName = item.newName != null ? item.newName : item.name;
        const targetName = item.targetName != null ? item.targetName : ownerName;
        const sameTarget = target === owner;
        const suggest = item.suggest ? `(${item.suggest})` : '';
        if (item.customFunction != null) {
            owner[item.name] = function (this: any) {
                replacePropertyLog(ownerName, item.name, targetName, newName, warn, id, suggest);
                return item.customFunction!.call(this, ...arguments);
            };
        } else if (item.customSetter != null || item.customGetter != null) {
            const hasSetter = item.customSetter != null;
            const hasGetter = item.customGetter != null;
            if (hasSetter && hasGetter) {
                Object.defineProperty(owner, item.name, {
                    get (this) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id, suggest);
                        return item.customGetter!.call(this);
                    },
                    set (this, v: any) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id, suggest);
                        item.customSetter!.call(this, v);
                    },
                    enumerable: false,
                });
            } else if (hasSetter) {
                Object.defineProperty(owner, item.name, {
                    set (this, v: any) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id, suggest);
                        item.customSetter!.call(this, v);
                    },
                    enumerable: false,
                });
            } else if (hasGetter) {
                Object.defineProperty(owner, item.name, {
                    get (this) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id, suggest);
                        return item.customGetter!.call(this);
                    },
                    enumerable: false,
                });
            }
        } else {
            Object.defineProperty(owner, item.name, {
                get (this) {
                    replacePropertyLog(ownerName, item.name, targetName, newName, warn, id, suggest);
                    return sameTarget ? this[newName] : target[newName];
                },
                set (this, v: any) {
                    replacePropertyLog(ownerName, item.name, targetName, newName, warn, id, suggest);
                    if (sameTarget) {
                        this[newName] = v;
                    } else {
                        target[newName] = v;
                    }
                },
                enumerable: false,
            });
        }
    });
};

removePropertyLog = (n: string, dp: string, f: Function, id: number, s: string) => {
    const item = messageMap.get(id);
    if (item && item.logTimes > item.count) {
        f(`'%s' has been removed. ${s}`, `${n}.${dp}`);
        item.count++;
    }
};

removeProperty = (owner: object, ownerName: string, properties: IRemoveItem[]) => {
    if (owner == null) return;

    properties.forEach((item: IRemoveItem) => {
        const id = messageID++;
        messageMap.set(id, { id, count: 0, logTimes: item.logTimes !== undefined ? item.logTimes : defaultLogTimes });
        const suggest = item.suggest ? `(${item.suggest})` : '';
        Object.defineProperty(owner, item.name, {
            get (this) {
                return removePropertyLog(ownerName, item.name, error, id, suggest);
            },
            set (this) {
                removePropertyLog(ownerName, item.name, error, id, suggest);
            },
            enumerable: false,
        });
    });
};

markAsWarningLog = (n: string, dp: string, f: Function, id: number, s: string) => {
    const item = messageMap.get(id);
    if (item && item.logTimes > item.count) {
        f(`'%s' is deprecated. ${s}`, `${n}.${dp}`);
        item.count++;
    }
};

markAsWarning = (owner: object, ownerName: string, properties: IMarkItem[]) => {
    if (owner == null) return;

    const _defaultGetSet = (d: PropertyDescriptor, n: string, dp: string, f: Function, id: number, s: string) => {
        if (d.get) {
            const oldGet = d.get;
            d.get = function (this) {
                markAsWarningLog(n, dp, f, id, s);
                return oldGet.call(this);
            };
        }
        if (d.set) {
            const oldSet = d.set;
            d.set = function (this, v: any) {
                markAsWarningLog(n, dp, f, id, s);
                oldSet.call(this, v);
            };
        }
        Object.defineProperty(owner, dp, d);
    };

    properties.forEach((item: IMarkItem) => {
        const deprecatedProp = item.name;
        const descriptor = Object.getOwnPropertyDescriptor(owner, deprecatedProp);
        if (!descriptor || !descriptor.configurable) { return; }
        const id = messageID++;
        messageMap.set(id, { id, count: 0, logTimes: item.logTimes !== undefined ? item.logTimes : defaultLogTimes });
        const suggest = item.suggest ? `(${item.suggest})` : '';
        if (typeof descriptor.value !== 'undefined') {
            if (typeof descriptor.value === 'function') {
                const oldValue = descriptor.value as Function;
                owner[deprecatedProp] = function (this) {
                    markAsWarningLog(ownerName, deprecatedProp, warn, id, suggest);
                    return oldValue.call(this, ...arguments);
                };
            } else {
                let oldValue = descriptor.value;
                Object.defineProperty(owner, deprecatedProp, {
                    configurable: true,
                    get () {
                        markAsWarningLog(ownerName, deprecatedProp, warn, id, suggest);
                        return oldValue;
                    },
                });
                if (descriptor.writable) {
                    Object.defineProperty(owner, deprecatedProp, {
                        set (value) {
                            markAsWarningLog(ownerName, deprecatedProp, warn, id, suggest);
                            oldValue = value;
                        },
                    });
                }
            }
        } else {
            _defaultGetSet(descriptor, ownerName, deprecatedProp, warn, id, suggest);
        }
        Object.defineProperty(owner, deprecatedProp, { enumerable: false });
    });
};

// } else {
//     // for compatible

//     replaceProperty = () => { };
//     removeProperty = () => { };
//     markAsWarning = () => { };

//     replacePropertyLog = () => { };
//     removePropertyLog = () => { };
//     markAsWarningLog = () => { };
// }

/**
 * @engineInternal
 */
interface IDeprecateInfo {
    newName?: string;
    since: string;
    removed: boolean,
}

/**
 * @engineInternal
 */
interface TopLevelDeprecateList {
    [name: string]: IDeprecateInfo | undefined;
}

const topLevelDeprecateList: TopLevelDeprecateList = {
};

/**
 * This is an internal method to register the deprecate info of module exported binding name.
 * DO NOT USE THIS INTERFACE.
 *
 * @example
 * ```ts
 * deprecateModuleExportedName({
 *     ButtonComponent: {
 *         newName: 'Button',
 *         since: '1.2.0',
 *         removed: false,
 *     },
 * });
 * ```
 * @engineInternal
 */
export function deprecateModuleExportedName (deprecateList: TopLevelDeprecateList) {
    for (let deprecateName in deprecateList) {
        const deprecateInfo = deprecateList[deprecateName];
        topLevelDeprecateList[deprecateName] = deprecateInfo;
    }
}

function _checkObsoleteByName (checkName: string) {
    const deprecateInfo = topLevelDeprecateList[checkName];
    if (!deprecateInfo) {
        return;
    }
    const { newName, since, removed } = deprecateInfo;
    if (removed) {
        if (newName) {
            errorID(16003, checkName, since, newName);
        } else {
            errorID(16002, checkName, since);
        }
    } else if (newName) {
        warnID(16001, checkName, since, newName);
    } else {
        warnID(16000, checkName, since);
    }
}

/**
 * An internal method to check whether the top level interface is deprecated.
 * DO NOT USE THIS INTERFACE.
 *
 * @example
 * ```ts
 * // print deprecate info of ButtonComponent and ToggleComponent
 * import { ButtonComponent, ToggleComponent } from 'cc';
 * ```
 * @engineInternal
 */
export function __checkObsolete__ (checkList: string[]) {
    for (let checkName of checkList) {
        _checkObsoleteByName(checkName);
    }
}

let _cachedProxy;
/**
 * An internal method to check whether the top level interface is deprecated in namespace.
 * DO NOT USE THIS INTERFACE.
 *
 * @example
 * ```ts
 * import * as cc from 'cc';
 * console.log(cc.ButtonComponent);  // print deprecate info of ButtonComponent
 * ```
 * @engineInternal
 */
export function __checkObsoleteInNamespace__ (ccNamespace: object) {
    if (!_cachedProxy) {
        if (typeof Proxy === 'undefined') {
            _cachedProxy = {};
        } else {
            _cachedProxy = new Proxy(ccNamespace, {
                get (target, name, receiver) {
                    // @ts-expect-error name could be a symbol
                    _checkObsoleteByName(name);
                    return Reflect.get(target, name, receiver);
                },
            });
        }
    }
    return _cachedProxy;
}
