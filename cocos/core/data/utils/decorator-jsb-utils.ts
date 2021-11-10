export function _assertThisInitialized(self) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
}

export function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : undefined,
    });
}

export function _applyDecoratedDescriptor(target, property, decorators, descriptor, context?: any) {
    let desc: any = {};
    Object.keys(descriptor).forEach((key) => {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce((desc, decorator) => {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== undefined) {
        desc.value = desc.initializer ? desc.initializer.call(context) : undefined;
        desc.initializer = undefined;
    }

    if (desc.initializer === undefined) {
        Object.defineProperty(target, property, desc);
        desc = null;
    }

    return desc;
}

export function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
}

export function _getPrototypeOf(o) {
    const getPrototypeOf: any = Object.getPrototypeOf ? Object.getPrototypeOf : (o) => {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return getPrototypeOf(o);
}

export function _setPrototypeOf(o, p) {
    const setPrototypeOf = Object.setPrototypeOf ||  function (o, p) {
        o.__proto__ = p;
        return o;
    };
    return setPrototypeOf(o, p);
}
