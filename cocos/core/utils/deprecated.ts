/**
 * @hidden
 */

import { error, warn } from '../platform/debug';

let defaultLogTimes = 10;

export function setDefaultLogTimes (times: number): void {
    if (times > 0) {
        defaultLogTimes = times;
    }
};

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

let replacePropertyLog: (n: string, dp: string, n2: string, newp: string, f: Function, id: number) => void;

let markAsWarningLog: (n: string, dp: string, f: Function, id: number, s?: string) => void;

let removePropertyLog: (n: string, dp: string, f: Function, id: number, s?: string) => void;

// if (DEBUG) {

interface IMeessageItem {
    id: Readonly<number>;
    logTimes: Readonly<number>;
    count: number;
}

let messageID = 0;
const messageMap: Map<number, IMeessageItem> = new Map<number, IMeessageItem>();

replacePropertyLog = (n: string, dp: string, n2: string, newp: string, f: Function, id: number) => {
    const item = messageMap.get(id);
    if (item && item.logTimes > item.count) {
        f('\'%s\' is deprecated, please use \'%s\' instead.', `${n}.${dp}`, `${n2}.${newp}`);
        item.count++;
    }
};

replaceProperty = (owner: object, ownerName: string, properties: IReplacement[]) => {
    if (owner == null) return;

    properties.forEach((item: IReplacement) => {

        const id = messageID++;
        messageMap.set(id, { id, count: 0, logTimes: item.logTimes !== undefined ? item.logTimes : defaultLogTimes, });

        const target = item.target != null ? item.target : owner;
        const newName = item.newName != null ? item.newName : item.name;
        const targetName = item.targetName != null ? item.targetName : ownerName;
        const sameTarget = target == owner;

        if (item.customFunction != null) {
            owner[item.name] = function (this: any) {
                replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                return item.customFunction!.call(this, ...arguments);
            };
        } else if (item.customSetter != null || item.customGetter != null) {
            const hasSetter = item.customSetter != null;
            const hasGetter = item.customGetter != null;
            if (hasSetter && hasGetter) {
                Object.defineProperty(owner, item.name, {
                    get (this) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                        return item.customGetter!.call(this);
                    },
                    set (this, v: any) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                        item.customSetter!.call(this, v);
                    }
                });
            } else if (hasSetter) {
                Object.defineProperty(owner, item.name, {
                    set (this, v: any) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                        item.customSetter!.call(this, v);
                    }
                });
            } else if (hasGetter) {
                Object.defineProperty(owner, item.name, {
                    get (this) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                        return item.customGetter!.call(this);
                    }
                });
            }
        } else {
            Object.defineProperty(owner, item.name, {
                get (this) {
                    replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                    return sameTarget ? this[newName] : target[newName];
                },
                set (this, v: any) {
                    replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                    if (sameTarget) {
                        this[newName] = v;
                    } else {
                        target[newName] = v;
                    }
                }
            });
        }
    });

};

removePropertyLog = (n: string, dp: string, f: Function, id: number, s?: string) => {
    const item = messageMap.get(id);
    const ss = s === undefined ? '' : '(' + s + ')';
    if (item && item.logTimes > item.count) {
        f('\'%s\' has been removed. ' + ss, `${n}.${dp}`);
        item.count++;
    }
};

removeProperty = (owner: object, ownerName: string, properties: IRemoveItem[]) => {
    if (owner == null) return;

    properties.forEach((item: IRemoveItem) => {
        const id = messageID++;
        messageMap.set(id, { id, count: 0, logTimes: item.logTimes !== undefined ? item.logTimes : defaultLogTimes, });

        Object.defineProperty(owner, item.name, {
            get (this) {
                return removePropertyLog(ownerName, item.name, error, id, item.suggest);
            },
            set (this) {
                removePropertyLog(ownerName, item.name, error, id, item.suggest);
            }
        });
    });
};

markAsWarningLog = (n: string, dp: string, f: Function, id: number, s?: string) => {
    const item = messageMap.get(id);
    const ss = s === undefined ? '' : '(' + s + ')';
    if (item && item.logTimes > item.count) {
        f('\'%s\' is deprecated. ' + ss, `${n}.${dp}`);
        item.count++;
    }
};

markAsWarning = (owner: object, ownerName: string, properties: IMarkItem[]) => {
    if (owner == null) return;

    const _defaultGetSet = (d: PropertyDescriptor, n: string, dp: string, f: Function, id: number, s?: string) => {
        if (d.get) {
            const oldGet = d.get();
            d.get = function (this) {
                markAsWarningLog(n, dp, f, id, s);
                return oldGet.call(this);
            };
        }
        if (d.set) {
            const oldSet = Object.create(d.set);
            d.set = function (this, v: any) {
                markAsWarningLog(n, dp, f, id, s);
                oldSet.call(this, v);
            };
        }
    };

    properties.forEach((item: IMarkItem) => {
        const deprecatedProp = item.name;
        const descriptor = Object.getOwnPropertyDescriptor(owner, deprecatedProp);
        if (!descriptor) { return; }

        const id = messageID++;
        messageMap.set(id, { id, count: 0, logTimes: item.logTimes !== undefined ? item.logTimes : defaultLogTimes, });

        if (descriptor.value != null) {
            if (typeof descriptor.value === 'function') {
                const oldValue = descriptor.value as Function;
                owner[deprecatedProp] = function (this) {
                    markAsWarningLog(ownerName, deprecatedProp, warn, id, item.suggest);
                    return oldValue.call(this, ...arguments);
                };
            } else {
                _defaultGetSet(descriptor, ownerName, deprecatedProp, warn, id, item.suggest);
            }
        } else {
            _defaultGetSet(descriptor, ownerName, deprecatedProp, warn, id, item.suggest);
        }
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
