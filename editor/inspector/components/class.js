'use strict';
const { getName } = require('../utils/prop');

exports.template = `
<div class="container"></div>
`;
exports.$ = {
    container: '.container',
};
exports.style = `
    .tab-group {
        margin-top: 4px;
        margin-bottom: 4px;
    }
    .tab-content {
        display: none;
        border: 1px dashed var(--color-normal-border);
        padding: 8px;
        margin-top: -10px;
        border-top-right-radius: calc(var(--size-normal-radius) * 1px);
        border-bottom-left-radius: calc(var(--size-normal-radius) * 1px);
        border-bottom-right-radius: calc(var(--size-normal-radius) * 1px);
    }
`;
exports.methods = {
    createTabGroup(dump) {
        const $group = document.createElement('div');
        $group.setAttribute('class', 'tab-group');
        $group.dump = dump;
        $group.tabs = {};
        $group.displayOrder = dump.displayOrder;

        $group.$header = document.createElement('ui-tab');
        $group.$header.setAttribute('class', 'tab-header');
        $group.appendChild($group.$header);
        $group.$header.addEventListener('change', (e) => {
            active(e.target.value);
        });
        function active(index) {
            const tabNames = Object.keys($group.tabs);
            const tabName = tabNames[index];
            $group.childNodes.forEach((child) => {
                if (!child.classList.contains('tab-content')) {
                    return;
                }
                if (child.getAttribute('name') === tabName) {
                    child.style.display = 'block';
                } else {
                    child.style.display = 'none';
                }
            });
        }
        setTimeout(() => {
            active(0);
        });
        return $group;
    },
    toggleGroups($groups) {
        for (const key in $groups) {
            const $props = Array.from($groups[key].querySelectorAll('.tab-content > ui-prop'));
            const show = $props.some($prop => getComputedStyle($prop).display !== 'none');
            if (show) {
                $groups[key].removeAttribute('hidden');
            } else {
                $groups[key].setAttribute('hidden', '');
            }
        }
    },
    appendToTabGroup($group, tabName) {
        if ($group.tabs[tabName]) {
            return;
        }
        const $content = document.createElement('div');
        $group.tabs[tabName] = $content;
        $content.setAttribute('class', 'tab-content');
        $content.setAttribute('name', tabName);
        $group.appendChild($content);

        const $label = document.createElement('ui-label');
        $label.value = getName({ name: tabName });

        const $button = document.createElement('ui-button');
        $button.setAttribute('name', tabName);
        $button.appendChild($label);
        $group.$header.appendChild($button);
    },
    appendChildByDisplayOrder(parent, newChild) {
        const displayOrder = newChild.displayOrder || 0;
        const children = Array.from(parent.children);
        const child = children.find(child => child.dump && child.displayOrder > displayOrder);
        if (child) {
            child.before(newChild);
        } else {
            parent.appendChild(newChild);
        }
    },
};
/**
 * 自动渲染组件的方法
 * @param dumps
 */
async function update(dump) {
    const $panel = this;

    if (!$panel.$this.isConnected) {
        return;
    }

    const $container = $panel.$.container;
    const oldPropList = Object.keys($panel.$propList);
    const newPropList = [];

    Object.keys(dump.value).forEach((key, index) => {
        const info = dump.value[key];
        if (!info.visible) {
            return;
        }

        if (dump.values) {
            info.values = dump.values.map((value) => {
                return value[key].value;
            });
        }
        const id = `${info.type || info.name}:${info.path}`;
        newPropList.push(id);
        let $prop = $panel.$propList[id];
        if (!$prop) {
            $prop = document.createElement('ui-prop');
            $prop.setAttribute('type', 'dump');
            $panel.$propList[id] = $prop;

            const _displayOrder = info.group?.displayOrder ?? info.displayOrder;
            $prop.displayOrder = _displayOrder === undefined ? index : Number(_displayOrder);

            if (info.group && dump.groups) {
                const { id = 'default', name } = info.group;
                if (!$panel.$groups[id] && dump.groups[id]) {
                    if (dump.groups[id].style === 'tab') {
                        $panel.$groups[id] = $panel.createTabGroup(dump.groups[id]);
                    }
                }
                if ($panel.$groups[id]) {
                    if (!$panel.$groups[id].isConnected) {
                        $panel.appendChildByDisplayOrder($container, $panel.$groups[id]);
                    }
                    if (dump.groups[id].style === 'tab') {
                        $panel.appendToTabGroup($panel.$groups[id], name);
                    }
                }
                $panel.appendChildByDisplayOrder($panel.$groups[id].tabs[name], $prop);
            } else {
                $panel.appendChildByDisplayOrder($container, $prop);
            }
        } else if (!$prop.isConnected || !$prop.parentElement) {
            if (info.group && dump.groups) {
                const { id = 'default', name } = info.group;
                $panel.appendChildByDisplayOrder($panel.$groups[id].tabs[name], $prop);
            } else {
                $panel.appendChildByDisplayOrder($container, $prop);
            }
        }
        $prop.render(info);
    });

    for (const id of oldPropList) {
        if (!newPropList.includes(id)) {
            const $prop = $panel.$propList[id];
            if ($prop && $prop.parentElement) {
                $prop.parentElement.removeChild($prop);
            }
        }
    }

    $panel.toggleGroups($panel.$groups);
}
exports.update = update;
async function ready() {
    const $panel = this;
    $panel.$propList = {};
    $panel.$groups = {};
}
exports.ready = ready;
async function close() {
    const $panel = this;
    for (const key in $panel.$groups) {
        $panel.$groups[key].remove();
    }

    $panel.$groups = {};
}
exports.close = close;
