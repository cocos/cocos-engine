/**
 * @hidden
 */

import { js } from './core/utils/js';
import { errorID, error, warnID, warn } from './core/platform/CCDebug';

export interface IWrapOptions {
    oldTarget: Function | {};
    oldPrefix: string;
    pairs: string[][];
    newTarget?: Function | {};
    newPrefix?: string;
    custom?: Function;
}

export let deprecatedWrapper: (option: IWrapOptions) => void;
if (CC_DEBUG) {
    deprecatedWrapper = (option: IWrapOptions) => {
        let oldTarget = option.oldTarget;
        let newTarget = option.newTarget;
        let oldPrefix = option.oldPrefix;
        let newPrefix = option.newPrefix;
        let deprecatedProps = option.pairs;
        let custom = option.custom;

        let _t0: {};
        if (typeof oldTarget == 'function') {
            _t0 = oldTarget.prototype;
        } else {
            _t0 = oldTarget;
        }

        let _t1: {};
        if (newTarget) {
            if (typeof newTarget == 'function') {
                _t1 = newTarget.prototype;
            } else {
                _t1 = newTarget;
            }
        }

        deprecatedProps.forEach(function (prop: string[]) {
            let deprecatedProp = prop[0];
            let newProp: string;
            if (prop.length > 1) {
                newProp = prop[1];
            }

            let _print = () => {
                if (custom != null) {
                    // custom message
                    custom();
                } else if (newProp != null && newPrefix != null) {
                    // remove but provide a new
                    warn("'%s' is deprecated, please use '%s' instead.", `${oldPrefix}.${deprecatedProp}`, `${newPrefix}.${newProp}`);
                } else {
                    // remove only
                    error("'%s.%s' is removed", oldPrefix, deprecatedProp);
                }
            };

            Object.defineProperty(_t0, deprecatedProp, {
                /* eslint-disable-next-line */
                get: function () {
                    _print();
                    if (newProp != null && _t1 != null && _t1[newProp] != null) {
                        return _t1[newProp];
                    }
                },
                set: function (v: any) {
                    _print();
                    if (newProp != null && _t1 != null && _t1[newProp] != null) {
                        if (typeof _t1[newProp] !== 'function') {
                            _t1[newProp] = v;
                        }
                    }
                }
            });
        });
    };
} else {
    // for compatible
    deprecatedWrapper = () => { };
}
