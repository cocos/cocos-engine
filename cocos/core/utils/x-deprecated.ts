/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @hidden
 * Note, naming this file with prefix `x-` exclude it from regular deprecated modules.
 */

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-const */

import { error, warn } from '../platform/debug';

let defaultLogTimes = 10;

export function setDefaultLogTimes (times: number): void {
    if (times > 0) {
        defaultLogTimes = times;
    }
}

interface IReplacement {
    /** 废弃属性的名称 */
    name: string;
    /** 警告的次数 */
    logTimes?: number;
    /** 替换属性的名称 */
    newName?: string;
    /** 废弃属性的所属对象 */
    target?: object;
    /** 废弃属性的所属对象的名称 */
    targetName?: string;
    /** 自定义替换属性（函数） */
    customFunction?: Function;
    /** 自定义替换属性的 setter */
    customSetter?: (v: any) => void;
    /** 自定义替换属性的 getter */
    customGetter?: () => any;
    /** 额外建议 */
    suggest?: string;
}

interface IRemoveItem {
    /** 废弃属性的名称 */
    name: string;
    /** 警告的次数 */
    logTimes?: number;
    /** 额外建议 */
    suggest?: string;
}

interface IMarkItem {
    /** 废弃属性的名称 */
    name: string;
    /** 警告的次数 */
    logTimes?: number;
    /** 额外建议 */
    suggest?: string;
}

export let replaceProperty: (owner: object, ownerName: string, properties: IReplacement[]) => void;

export let removeProperty: (owner: object, ownerName: string, properties: IRemoveItem[]) => void;

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
