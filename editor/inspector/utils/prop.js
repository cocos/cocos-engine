/* eslint-disable @typescript-eslint/no-unsafe-return */
/*
 * Returns the ordered PropMap
 * @param {*} value of dump
 * @returns {key:string dump:object}[]
 */
exports.sortProp = function(propMap) {
    const orderList = [];
    const normalList = [];

    Object.keys(propMap).forEach((key) => {
        const item = propMap[key];
        if ('displayOrder' in item) {
            orderList.push({
                key,
                dump: item,
            });
        } else {
            normalList.push({
                key,
                dump: item,
            });
        }
    });

    orderList.sort((a, b) => a.dump.displayOrder - b.dump.displayOrder);

    return orderList.concat(normalList);
};

/**
 *
 * This function can filter the contents of the dump and is mainly used to get the user's dump data
 * @param {HTMLElement} container
 * @param {string[]} excludeList
 * @param {object} dump
 * @param {(element,prop)=>void} update
 */
exports.updateCustomPropElements = function(container, excludeList, dump, update) {
    const sortedProp = exports.sortProp(dump.value);
    container.$ = container.$ || {};
    /**
     * @type {Array<HTMLElement>}
     */
    const children = [];
    sortedProp.forEach((prop) => {
        if (!excludeList.includes(prop.key)) {
            if (!prop.dump.visible) {
                return;
            }
            let node = container.$[prop.key];
            if (!node) {
                node = document.createElement('ui-prop');
                node.setAttribute('type', 'dump');
                prop.dump.displayOrder = prop.dump.displayOrder === undefined ? 0 : Number(prop.dump.displayOrder);
                node.dump = prop.dump;
                node.key = prop.key;
                container.$[prop.key] = node;
            }

            if (typeof update === 'function') {
                update(node, prop);
            }

            children.push(node);
        }
    });
    children.sort((a, b) => a.dump.displayOrder - b.dump.displayOrder);
    const currentChildren = Array.from(container.children);
    children.forEach((child, i) => {
        if (child === currentChildren[i]) {
            return;
        }

        container.appendChild(child);
    });

    // delete extra children
    currentChildren.forEach(($child) => {
        if (!children.includes($child)) {
            $child.remove();
        }
    });
};

/**
 * Tool function: recursively set readonly in resource data
 */
exports.loopSetAssetDumpDataReadonly = function(dump) {
    if (typeof dump !== 'object') {
        return;
    }

    if (dump.readonly === undefined) {
        return;
    }

    dump.readonly = true;

    if (dump.isArray) {
        for (let i = 0; i < dump.value.length; i++) {
            exports.loopSetAssetDumpDataReadonly(dump.value[i]);
        }
        return;
    }

    for (const key in dump.value) {
        exports.loopSetAssetDumpDataReadonly(dump.value[key]);
    }
};

/**
 * Tool functions: set to unavailable
 * @param {object} data  dump | function
 * @param element
 */
exports.setDisabled = function(data, element) {
    if (!element) {
        return;
    }

    let disabled = data;

    if (typeof data === 'function') {
        disabled = data();
    }

    if (disabled === true) {
        element.setAttribute('disabled', 'true');
    } else {
        element.removeAttribute('disabled');
    }
};

/**
 * Tool function: Set read-only status
 * @param {object} data  dump | function
 * @param element
 */
exports.setReadonly = function(data, element) {
    if (!element) {
        return;
    }

    let readonly = data;

    if (typeof data === 'function') {
        readonly = data();
    }

    if (readonly === true) {
        element.setAttribute('readonly', 'true');
    } else {
        element.removeAttribute('readonly');
    }

    if (element.render && element.dump) {
        element.dump.readonly = readonly;
        element.render();
    }
};

/**
 * Tool function: Set the display status
 * @param {Function | boolean} data  dump | function
 * @param {HTMLElement} element
 */
exports.setHidden = function(data, element) {
    if (!element) {
        return;
    }

    let hidden = data;

    if (typeof data === 'function') {
        hidden = data();
    }

    if (hidden === true) {
        element.setAttribute('hidden', '');
    } else {
        element.removeAttribute('hidden');
    }
};

exports.updatePropByDump = function(panel, dump) {
    panel.dump = dump;

    if (!panel.elements) {
        panel.elements = {};
    }

    const children = [];

    Object.keys(dump.value).forEach((key) => {
        const dumpdata = dump.value[key];
        const element = panel.elements[key];

        if (!panel.$[key]) {
            // element does not exist and the data tells that it does not need to be displayed, terminate rendering
            if (!dumpdata.visible) {
                return;
            }

            if (element && element.create) {
                // when it need to go custom initialize
                panel.$[key] = element.create.call(panel, dumpdata);
            } else {
                panel.$[key] = document.createElement('ui-prop');
                panel.$[key].setAttribute('type', 'dump');
                panel.$[key].render(dumpdata);
            }

            /**
             * Defined in the ascending engine, while the custom order ranges from 0 - 100;
             * If displayOrder is defined in the engine as a negative number, less than -100, it will take precedence over the custom ordering
             */
            panel.$[key].displayOrder = dumpdata.displayOrder === undefined ? 0 : Number(dumpdata.displayOrder);
            panel.$[key].displayOrder += 100;

            if (element && element.displayOrder !== undefined) {
                panel.$[key].displayOrder = element.displayOrder;
            }
        } else {
            // The element exists, but at this point the data informs that it does not need to be displayed and terminates
            if (!dumpdata.visible) {
                return;
            }

            if (panel.$[key].tagName === 'UI-PROP' && panel.$[key].getAttribute('type') === 'dump') {
                panel.$[key].render(dumpdata);
            }
        }

        if (panel.$[key]) {
            if (!element || !element.isAppendToParent || element.isAppendToParent.call(panel)) {
                children.push(panel.$[key]);
            }
        }
    });

    // Reorder
    children.sort((a, b) => a.displayOrder - b.displayOrder);

    let $children = Array.from(panel.$.componentContainer.children);
    children.forEach((child, i) => {
        if (child === $children[i]) {
            return;
        }

        panel.$.componentContainer.appendChild(child);
    });

    // delete extra children
    $children.forEach(($child) => {
        if (!children.includes($child)) {
            $child.remove();
        }
    });

    for (const key in panel.elements) {
        const element = panel.elements[key];
        if (element && element.ready) {
            element.ready.call(panel, panel.$[key], dump.value);
            element.ready = undefined; // ready needs to be executed only once
        }
    }

    for (const key in panel.elements) {
        const element = panel.elements[key];
        if (element && element.update) {
            element.update.call(panel, panel.$[key], dump.value);
        }
    }
};

/**
 * Tool function: check whether the value of the attribute is consistent after multi-selection
 */
exports.isMultipleInvalid = function(dump) {
    let invalid = false;

    if (dump.values && dump.values.some((ds) => ds !== dump.value)) {
        invalid = true;
    }

    return invalid;
};
/**
 * Get the name based on the dump data
 */
/**
 * 
 * @param {string} dump 
 * @returns 
 */
exports.getName = function(dump) {
    if (!dump) {
        return '';
    }

    if (dump.displayName) {
        return dump.displayName;
    }

    let name = dump.name || '';

    name = name.replace(/^\S/, (str) => str.toUpperCase());
    name = name.replace(/_/g, (str) => ' ');
    name = name.replace(/ \S/g, (str) => ` ${str.toUpperCase()}`);

    return name.trim();
};

exports.setTooltip = function(element, dump) {
    if (dump.tooltip) {
        let tooltip = dump.tooltip;
        if (tooltip.startsWith('i18n:')) {
            tooltip = Editor.I18n.t('ENGINE.' + tooltip.substr(5));
            // 如果 ENGINE 翻译不出来，就当成插件的翻译数据，尝试直接翻译
            if (!tooltip || tooltip === dump.tooltip) {
                tooltip = Editor.I18n.t(dump.tooltip.substr(5)) || dump.tooltip;
            }
        }
        element.setAttribute('tooltip', tooltip);
    } else {
        element.removeAttribute('tooltip');
    }
};

/**
* Sets the generic property Label in prop
* name and tooltip
*/
exports.setLabel = function($label, dump) {
    if (!dump) {
        dump = this.dump;
    }

    if (!$label || !dump) {
        return;
    }

    $label.innerHTML = exports.getName(dump);
    exports.setTooltip($label, dump);
};
