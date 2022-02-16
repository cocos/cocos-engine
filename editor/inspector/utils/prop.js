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
        if (item != null) {
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
        }
    });

    orderList.sort((a, b) => a.dump.displayOrder - b.dump.displayOrder);

    return orderList.concat(normalList);
};

/**
 *
 * This method is used to update the custom node
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

    if (!panel.$props) {
        panel.$props = {};
    }

    if (!panel.$groups) {
        panel.$groups = {};
    }

    const oldPropKeys = Object.keys(panel.$props);
    const newPropKeys = [];

    Object.keys(dump.value).forEach((key) => {
        const info = dump.value[key];
        if (!info.visible) {
            return;
        }

        const element = panel.elements[key];
        let $prop = panel.$props[key];

        newPropKeys.push(key);

        if (!$prop) {
            if (element && element.create) {
                // when it need to go custom initialize
                $prop = panel.$props[key] = panel.$[key] = element.create.call(panel, info);
            } else {
                $prop = panel.$props[key] = panel.$[key] = document.createElement('ui-prop');
                $prop.setAttribute('type', 'dump');
                $prop.render(info);
            }

            if (element && element.displayOrder !== undefined) {
                info.displayOrder = element.displayOrder;
            }

            if (!element || !element.isAppendToParent || element.isAppendToParent.call(panel)) {
                if (info.group && dump.groups) {
                    const id = info.group.id || 'default';
                    const name = info.group.name;

                    if (!panel.$groups[id] && dump.groups[id]) {
                        if (dump.groups[id].style === 'tab') {
                            panel.$groups[id] = exports.createTabGroup(dump.groups[id], panel);
                        }
                    }

                    if (panel.$groups[id]) {
                        if (!panel.$groups[id].isConnected) {
                            exports.appendChildByDisplayOrder(panel.$.componentContainer, panel.$groups[id], dump.groups[id].displayOrder);
                        }

                        if (dump.groups[id].style === 'tab') {
                            exports.appendToTabGroup(panel.$groups[id], name);
                        }
                    }

                    exports.appendChildByDisplayOrder(panel.$groups[id].tabs[name], $prop, info.displayOrder);
                } else {
                    exports.appendChildByDisplayOrder(panel.$.componentContainer, $prop, info.displayOrder);
                }
            }
        } else if (!$prop.isConnected || !$prop.parentElement) {
            if (!element || !element.isAppendToParent || element.isAppendToParent.call(panel)) {
                exports.appendChildByDisplayOrder(panel.$.componentContainer, $prop, info.displayOrder);
            }
        }
        $prop.render(info);
    });

    for (const id of oldPropKeys) {
        if (!newPropKeys.includes(id)) {
            const $prop = panel.$props[id];
            if ($prop && $prop.parentElement) {
                $prop.parentElement.removeChild($prop);
            }
        }
    }

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
            // If ENGINE doesn't translate, use extension's translation data and try to translate directly
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

exports.createTabGroup = function(dump, panel) {
    const $group = document.createElement('div');
    $group.setAttribute('class', 'tab-group');

    $group.dump = dump;
    $group.tabs = {};

    $group.$header = document.createElement('ui-tab');
    $group.$header.setAttribute('class', 'tab-header');
    $group.appendChild($group.$header);

    $group.$header.addEventListener('change', (e) => {
        const tabNames = Object.keys($group.tabs);
        const tabName = tabNames[e.target.value || 0];
        $group.querySelectorAll('.tab-content').forEach((child) => {
            if (child.getAttribute('name') === tabName) {
                child.style.display = 'block';
            } else {
                child.style.display = 'none';
            }
        });
    });

    // check style
    if (!panel.$this.shadowRoot.querySelector('style#group-style')) {
        const style = document.createElement('style');
        style.innerText = `
            .tab-group {
                margin-top: 10px;
                margin-bottom: 10px;
            }
            .tab-content {
                display: none;
                border: 1px dashed var(--color-normal-border);
                padding: 10px;
                margin-top: -9px;
                border-top-right-radius: calc(var(--size-normal-radius) * 1px);
                border-bottom-left-radius: calc(var(--size-normal-radius) * 1px);
                border-bottom-right-radius: calc(var(--size-normal-radius) * 1px);
            }`;

        panel.$.componentContainer.before(style);
    }

    setTimeout(() => {
        const $firstTab = $group.$header.shadowRoot.querySelector('ui-button');
        if ($firstTab) {
            $firstTab.dispatch('confirm');
        }
    });

    return $group;
};

exports.appendToTabGroup = function($group, tabName) {
    if ($group.tabs[tabName]) {
        return;
    }

    const $content = document.createElement('div');

    $group.tabs[tabName] = $content;

    $content.setAttribute('class', 'tab-content');
    $content.setAttribute('name', tabName);
    $group.appendChild($content);

    const $label = document.createElement('ui-label');
    $label.value = tabName;

    const $button = document.createElement('ui-button');
    $button.setAttribute('name', tabName);
    $button.appendChild($label);
    $group.$header.appendChild($button);
};

exports.appendChildByDisplayOrder = function(parent, newChild, displayOrder = 0) {
    const children = Array.from(parent.children);

    const child = children.find((child) => {
        if (child.dump && child.dump.displayOrder > displayOrder) {
            return child;
        }

        return null;
    });

    if (child) {
        child.before(newChild);
    } else {
        parent.appendChild(newChild);
    }
};
