/**
 * @hidden
 */

import { error, warn } from './core/platform/CCDebug';

export interface IWrapOptions {
    oldTarget: Function | {};
    oldPrefix: string;
    pairs: string[][];
    newTarget?: Function | {};
    newPrefix?: string;
    custom?: Function;
    compatible?: boolean;
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
        let compatible = (option.compatible == null || option.compatible == true) ? true : false;

        let _t0 = oldTarget;
        let _t1 = newTarget;

        if (compatible) {
            deprecatedProps.forEach(function (prop: string[]) {
                let deprecatedProp = prop[0];
                let newProp: string;
                if (prop.length > 1) {
                    newProp = prop[1];
                }

                /**
                 * default log && return
                 */
                /* eslint-disable-next-line */
                let _default = () => {
                    if (newProp != null && newPrefix != null) {
                        // remove but provide a new
                        warn("'%s' is deprecated, please use '%s' instead.", `${oldPrefix}.${deprecatedProp}`, `${newPrefix}.${newProp}`);
                    } else if (newTarget != null) {
                        // remove but will provide a new
                        warn("'%s' is deprecated.", `${oldPrefix}.${deprecatedProp}`);
                    } else {
                        // remove only
                        error("'%s.%s' is removed", oldPrefix, deprecatedProp);
                    }

                    if (newProp != null && _t1 != null && _t1[newProp] != null) {
                        return _t1[newProp];
                    } else if (_t0[deprecatedProp] != null) {
                        return _t0[deprecatedProp];
                    }
                };

                Object.defineProperty(_t0, deprecatedProp, {
                    /* eslint-disable-next-line */
                    get: function (this) {
                        if (custom != null) {
                            return custom.call(this);
                        } else {
                            return _default();
                        }
                    },
                    set: function (this, v: any) {
                        if (custom != null) {
                            custom.call(this);
                        } else {
                            _default();
                        }
                        if (newProp != null && _t1 != null && _t1[newProp] != null) {
                            if (typeof _t1[newProp] !== 'function') {
                                _t1[newProp] = v;
                            }
                        } else if (_t0[deprecatedProp] != null) {
                            _t0[deprecatedProp] = v;
                        }
                    }
                });
            });
        } else {
            deprecatedProps.forEach(function (prop: string[]) {
                let deprecatedProp = prop[0];

                Object.defineProperty(_t0, deprecatedProp, {
                    /* eslint-disable-next-line */
                    value: function (this, ...args: any) {
                        if (custom != null) {
                            return custom.call(this,
                                args[0], args[1], args[2],
                                args[3], args[4], args[5],
                                args[6], args[7], args[8],
                                args[9], args[10], args[11]);
                        }
                    }
                });
            });
        }
    };
} else {
    // for compatible
    deprecatedWrapper = () => { };
}
