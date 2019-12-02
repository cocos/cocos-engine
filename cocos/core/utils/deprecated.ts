/**
 * @hidden
 */

import { error, warn } from '../platform/debug';

// TODO: will redefined in ALIPAY and runtime

let defaultLogTimes = 10;

export function setDefaultLogTimes (times: number): void {
    if (times > 0) {
        defaultLogTimes = times;
    }
};

export interface IWrapOptions {
    oldTarget: Function | {};
    oldPrefix: string;
    pairs: string[][];
    newTarget?: Function | {};
    newPrefix?: string;
    custom?: Function;
    compatible?: boolean;
}


interface IDeprecatedItem {
    name: string;
    logTimes?: number; // use default if absent
}

interface IReplacement extends IDeprecatedItem {
    newName?: string; // use original if absent
    target?: object; // use original if absent
    targetName?: string; // use original if absent
    customFunction?: Function; // use default if absent
    customSetter?: (v: any) => void;
    customGetter?: () => any;
}

interface IRemoveItem extends IDeprecatedItem {
    // custom?: Function; //use default if absent
}

interface IMarkItem extends IDeprecatedItem {
    // custom?: Function; //use default if absent
}

export let replaceProperty: (owner: object, ownerName: string, properties: IReplacement[]) => void;

export let removeProperty: (owner: object, ownerName: string, properties: IRemoveItem[]) => void;

export let markAsWarning: (owner: object, ownerName: string, properties: IMarkItem[]) => void;

let replacePropertyLog: (n: string, dp: string, n2: string, newp: string, f: Function, id: number) => void;

let markAsWarningLog: (n: string, dp: string, f: Function, id: number) => void;

let removePropertyLog: (n: string, dp: string, f: Function, id: number) => void;

// if (CC_DEBUG) {

interface IMeessageItem {
    id: Readonly<number>;
    logTimes: Readonly<number>;
    count: number;
}

let messageID = 0;
let messageMap: Map<number, IMeessageItem> = new Map<number, IMeessageItem>();

replacePropertyLog = function (n: string, dp: string, n2: string, newp: string, f: Function, id: number) {
    let item = messageMap.get(id);
    if (item && item.logTimes > item.count) {
        f("'%s' is deprecated, please use '%s' instead.", `${n}.${dp}`, `${n2}.${newp}`);
        item.count++;
    }
};

replaceProperty = (owner: object, ownerName: string, properties: IReplacement[]) => {
    if (owner == null) return;

    properties.forEach(function (item: IReplacement) {

        let id = messageID++;
        messageMap.set(id, { id: id, count: 0, logTimes: item.logTimes !== undefined ? item.logTimes : defaultLogTimes, });

        let target = item.target != null ? item.target : owner;
        let newName = item.newName != null ? item.newName : item.name;
        let targetName = item.targetName != null ? item.targetName : ownerName;

        if (item.customFunction != null) {
            /* eslint-disable-next-line */
            owner[item.name] = function (this: any, ...args: any) {
                replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                /* eslint-disable-next-line */
                return item.customFunction!.call(this,
                    args[0], args[1], args[2],
                    args[3], args[4], args[5],
                    args[6], args[7], args[8],
                    args[9], args[10], args[11]);
            };
        } else if (item.customSetter != null || item.customGetter != null) {
            let hasSetter = item.customSetter != null;
            let hasGetter = item.customGetter != null;

            if (hasSetter && hasGetter) {

                Object.defineProperty(owner, item.name, {
                    /* eslint-disable-next-line */
                    get: function (this) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                        return item.customGetter!.call(this);
                    },
                    set: function (this, v: any) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                        item.customSetter!.call(this, v);
                    }
                });

            } else if (hasSetter) {

                Object.defineProperty(owner, item.name, {
                    set: function (this, v: any) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                        item.customSetter!.call(this, v);
                    }
                });

            } else if (hasGetter) {

                Object.defineProperty(owner, item.name, {
                    /* eslint-disable-next-line */
                    get: function (this) {
                        replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                        return item.customGetter!.call(this);
                    }
                });

            }
        } else {
            Object.defineProperty(owner, item.name, {
                /* eslint-disable-next-line */
                get: function (this) {
                    replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                    return target[newName];
                },
                set: function (this, v: any) {
                    replacePropertyLog(ownerName, item.name, targetName, newName, warn, id);
                    target[newName] = v;
                }
            });
        }
    });

};

removePropertyLog = function (n: string, dp: string, f: Function, id: number) {
    let item = messageMap.get(id);
    if (item && item.logTimes > item.count) {
        f("'%s' has been removed.", `${n}.${dp}`);
        item.count++;
    }
};

removeProperty = (owner: object, ownerName: string, properties: IRemoveItem[]) => {
    if (owner == null) return;

    properties.forEach(function (item: IRemoveItem) {

        let id = messageID++;
        messageMap.set(id, { id: id, count: 0, logTimes: item.logTimes !== undefined ? item.logTimes : defaultLogTimes, });

        Object.defineProperty(owner, item.name, {
            get: function (this) {
                return removePropertyLog(ownerName, item.name, error, id);
            },
            set: function (this) {
                removePropertyLog(ownerName, item.name, error, id);
            }
        });
    });
};

markAsWarningLog = function (n: string, dp: string, f: Function, id: number) {
    let item = messageMap.get(id);
    if (item && item.logTimes > item.count) {
        f("'%s' is deprecated.", `${n}.${dp}`);
        item.count++;
    }
};

markAsWarning = (owner: object, ownerName: string, properties: IMarkItem[]) => {
    if (owner == null) return;

    let _defaultGetSet = function (o: {}, p: string, d: PropertyDescriptor, n: string, dp: string, f: Function, id: number) {
        if (d.get) {
            let oldGet = d.get();
            /* eslint-disable-next-line */
            d.get = function (this) {
                markAsWarningLog(n, dp, f, id);
                return oldGet.call(this);
            };
        }

        if (d.set) {
            let oldSet = Object.create(d.set);
            d.set = function (this, v: any) {
                markAsWarningLog(n, dp, f, id);
                oldSet.call(this, v);
            };
        }

    };

    properties.forEach(function (item: IMarkItem) {
        let deprecatedProp = item.name;
        let descriptor = Object.getOwnPropertyDescriptor(owner, deprecatedProp);

        if (!descriptor) {
            return;
        }

        let id = messageID++;
        messageMap.set(id, { id: id, count: 0, logTimes: item.logTimes !== undefined ? item.logTimes : defaultLogTimes, });

        if (descriptor.value != null) {
            if (typeof descriptor.value == 'function') {
                /* eslint-disable-next-line */
                let oldValue = descriptor!.value;
                /* eslint-disable-next-line */
                owner[deprecatedProp] = function (this) {
                    markAsWarningLog(ownerName, deprecatedProp, warn, id);
                    /* eslint-disable-next-line */
                    return oldValue.call(this);
                };
            } else {
                _defaultGetSet(owner, deprecatedProp, descriptor, ownerName, deprecatedProp, warn, id);
            }
        } else {
            _defaultGetSet(owner, deprecatedProp, descriptor, ownerName, deprecatedProp, warn, id);
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
