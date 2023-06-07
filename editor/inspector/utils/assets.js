// 处理属性是否显示只读样式的判断
exports.updateElementReadonly = function(element, readonly) {
    if (readonly === undefined) {
        readonly = this.asset.readonly;
    }

    if (readonly) {
        element.setAttribute('readonly', true);
    } else {
        element.removeAttribute('readonly');
    }

    const parentElement = element.parentElement;
    if (parentElement && parentElement.tagName === 'UI-PROP') {
        if (readonly) {
            parentElement.setAttribute('disabled', true);
            parentElement.setAttribute('readonly', true);
        } else {
            parentElement.removeAttribute('disabled');
            parentElement.removeAttribute('readonly');
        }
    } else {
        if (readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    }
};

// 处理多选资源后同一属性是否可编辑的逻辑判断
exports.updateElementInvalid = function(element, prop) {
    const propNames = prop.split('.');
    let thisPropValue = this.meta.userData;

    const invalid = this.metaList.some((meta) => {
        let target = meta.userData;
        const lastIndex = propNames.length - 1;
        const lastPropName = propNames[lastIndex];

        if (propNames.length > 1) {
            for (let i = 0; i < lastIndex; i++) {
                const propName = propNames[i];
                if (target[propName] !== undefined) {
                    target = target[propName];
                }

                if (thisPropValue[propName] !== undefined) {
                    thisPropValue = thisPropValue[propName];
                }
            }
        }

        return target[lastPropName] !== thisPropValue[lastPropName];
    });
    element.invalid = invalid;
};

// 从 value 对象里取 prop 的值，没有的话，defaultValue 为保底值
exports.getPropValue = function(value, defaultValue, prop) {
    let target = value;

    if (prop) {
        const propNames = prop.split('.');

        for (let i = 0; i < propNames.length; i++) {
            const propName = propNames[i];

            if (target === undefined || typeof target !== 'object') {
                return defaultValue;
            }

            target = target[propName];
        }
    }

    if (target === undefined) {
        return defaultValue;
    }

    return target;
};

// 给属性 prop 赋值，支持 prop 为 a.b.c 格式，给属性 c 赋值，event 是 ui 组件交互的事件
exports.setPropValue = function(prop, type, event) {
    const propNames = prop.split('.');

    this.metaList.forEach((meta) => {
        let target = meta.userData;
        const lastIndex = propNames.length - 1;
        const lastPropName = propNames[lastIndex];

        if (propNames.length > 1) {
            for (let i = 0; i < lastIndex; i++) {
                const propName = propNames[i];
                if (!target[propName] || typeof target[propName] !== 'object') {
                    target[propName] = {};
                }
                target = target[propName];
            }
        }

        let value = event.target.value;
        if (type === 'number') {
            value = Number(value);
        } else if (type === 'boolean') {
            value = Boolean(value);
        }

        target[lastPropName] = value;
    });
};
