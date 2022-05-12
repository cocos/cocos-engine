'use strict';
exports.template = `
<section></section>
`;
exports.$ = {
    section: 'section',
};
exports.style = `
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
    }
`;
exports.methods = {
    createTabGroup(dump) {
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
        setTimeout(() => {
            const $firstTab = $group.$header.shadowRoot.querySelector('ui-button');
            if ($firstTab) {
                $firstTab.dispatch('confirm');
            }
        });
        return $group;
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
        $label.value = this.getName(tabName);

        const $button = document.createElement('ui-button');
        $button.setAttribute('name', tabName);
        $button.appendChild($label);
        $group.$header.appendChild($button);
    },
    appendChildByDisplayOrder(parent, newChild, displayOrder = 0) {
        const children = Array.from(parent.children);
        const child = children.find(child => child.dump && child.displayOrder > displayOrder);
        if (child) {
            child.before(newChild);
        } else {
            parent.appendChild(newChild);
        }
    },
    getName(name) {
        name = name.trim().replace(/^\S/, (str) => str.toUpperCase());
        name = name.replace(/_/g, ' ');
        name = name.replace(/ \S/g, (str) => ` ${str.toUpperCase()}`);
        // 驼峰转中间空格
        name = name.replace(/([a-z])([A-Z])/g, '$1 $2');

        return name.trim();
    },
};
/**
 * 自动渲染组件的方法
 * @param dumps
 */
async function update(dump) {
    const $panel = this;
    const $section = $panel.$.section;
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

            const _displayOrder = info.displayOrder || info.group?.displayOrder;
            $prop.displayOrder = _displayOrder === undefined ? index : Number(_displayOrder);

            if (info.group && dump.groups) {
                const key = info.group.id || 'default';
                const name = info.group.name;
                if (!$panel.$groups[key] && dump.groups[key]) {
                    if (dump.groups[key].style === 'tab') {
                        $panel.$groups[key] = $panel.createTabGroup(dump.groups[key]);
                    }
                }
                if ($panel.$groups[key]) {
                    if (!$panel.$groups[key].isConnected) {
                        $panel.appendChildByDisplayOrder($section, $panel.$groups[key], dump.groups[key].displayOrder);
                    }
                    if (dump.groups[key].style === 'tab') {
                        $panel.appendToTabGroup($panel.$groups[key], name);
                    }
                }
                $panel.appendChildByDisplayOrder($panel.$groups[key].tabs[name], $prop, $prop.displayOrder);
            } else {
                $panel.appendChildByDisplayOrder($section, $prop, $prop.displayOrder);
            }
        } else if (!$prop.isConnected || !$prop.parentElement) {
            if (info.group && dump.groups) {
                const key = info.group.id || 'default';
                const name = info.group.name;
                $panel.appendChildByDisplayOrder($panel.$groups[key].tabs[name], $prop, $prop.displayOrder);
            } else {
                $panel.appendChildByDisplayOrder($section, $prop, $prop.displayOrder);
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
    $panel.$groups = undefined;
}
exports.close = close;
