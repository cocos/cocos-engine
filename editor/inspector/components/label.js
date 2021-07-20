const { getNameFromDump, setHidden, isMultipleInvalid } = require('../utils/prop');
const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.style = /* css */`
ui-tab {
    flex: none;
}

div.fontStyleParent {
    display:flex
}

div.fontStyle:nth-child(2) {
    margin-left: 5px;
    margin-right: 5px;
}

div.fontStyle {
    height: 20px;
    width: 42px;
    text-align: center;
    border: calc(var(--size-normal-border) * 1px) solid var(--color-normal-border);
    background: var(--color-default-fill);
    border-radius: calc(var(--size-normal-radius) * 1px);
}

div.fontStyle.invalid {
    background: var(--color-default-fill);
}

div.fontStyle.select {
    background: var(--color-default-fill-emphasis);
}

`;

exports.ready = function() {
    this.elements = {
        horizontalAlign: {
            create(dump) {
                const prop = document.createElement('ui-prop');
                prop.dump = dump;
                const label = document.createElement('ui-label');
                label.setAttribute('slot', 'label');
                label.setAttribute('value', getNameFromDump(dump));
                const content = document.createElement('ui-tab');
                content.setAttribute('slot', 'content');
                content.addEventListener('change', (event) => {
                    if (event.target.value !== -1) {
                        dump.value = event.target.value;
                        if (dump.values) {
                            dump.values = dump.values.map(() => dump.value);
                        }
                        prop.dispatch('change-dump');
                    }
                });

                for (let index = 0; index < dump.enumList.length; index++) {
                    const element = dump.enumList[index];
                    const image = document.createElement('ui-image');
                    const button = document.createElement('ui-button');
                    const iconName = element.name.toLocaleLowerCase();
                    if (iconName !== 'center') {
                        image.setAttribute('value', `packages://scene/static/icons/align-${iconName}.png`);
                    } else {
                        image.setAttribute('value', `packages://scene/static/icons/align-h-${iconName}.png`);
                    }
                    image.style.height = '20px';
                    image.style.width = '22px';
                    image.style.verticalAlign = 'middle';
                    image.setAttribute('fill', true);
                    image.setAttribute('tooltip', Editor.I18n.t(dump.tooltip.replace('i18n:', '')));
                    image.setAttribute('readonly', true);
                    button.appendChild(image);
                    content.appendChild(button);
                }
                prop.appendChild(label);
                prop.appendChild(content);
                return prop;
            },
            update(element, dump) {
                const tab = element.querySelector('ui-tab');
                if (isMultipleInvalid(dump.horizontalAlign)) {
                    tab.value = -1;
                } else {
                    tab.value = dump.horizontalAlign.value;
                }
            },
        },
        verticalAlign: {
            create(dump) {
                const prop = document.createElement('ui-prop');
                prop.dump = dump;
                const label = document.createElement('ui-label');
                label.setAttribute('slot', 'label');
                label.setAttribute('value', getNameFromDump(dump));
                const content = document.createElement('ui-tab');
                content.setAttribute('slot', 'content');
                content.addEventListener('change', (event) => {
                    if (event.target.value !== -1) {
                        dump.value = event.target.value;
                        if (dump.values) {
                            dump.values = dump.values.map(() => dump.value);
                        }
                        prop.dispatch('change-dump');
                    }
                });

                for (let index = 0; index < dump.enumList.length; index++) {
                    const element = dump.enumList[index];
                    const image = document.createElement('ui-image');
                    const button = document.createElement('ui-button');
                    const iconName = element.name.toLocaleLowerCase();
                    if (iconName !== 'center') {
                        image.setAttribute('value', `packages://scene/static/icons/align-${iconName}.png`);
                    } else {
                        image.setAttribute('value', `packages://scene/static/icons/align-v-${iconName}.png`);
                    }
                    image.style.height = '20px';
                    image.style.width = '22px';
                    image.style.verticalAlign = 'middle';
                    image.setAttribute('fill', true);
                    image.setAttribute('tooltip', dump.tooltip);
                    image.setAttribute('readonly', true);
                    button.appendChild(image);
                    content.appendChild(button);
                }
                prop.appendChild(label);
                prop.appendChild(content);
                return prop;
            },
            update(element, dump) {
                const tab = element.querySelector('ui-tab');
                if (isMultipleInvalid(dump.verticalAlign)) {
                    tab.value = -1;
                } else {
                    tab.value = dump.verticalAlign.value;
                }
            },
        },
        isBold: {
            create() {
                const prop = document.createElement('ui-prop');
                const label = document.createElement('ui-label');
                label.setAttribute('slot', 'label');
                label.value = 'FontStyle';
                prop.appendChild(label);
                const content = document.createElement('div');
                content.setAttribute('slot', 'content');
                content.classList.add('fontStyleParent');
                const styles = ['isBold', 'isItalic', 'isUnderline'];
                const styleDisplayNames = ['B', 'I', 'U'];
                for (let index = 0; index < styles.length; index++) {
                    const style = styles[index];
                    const div = document.createElement('div');
                    div.innerHTML = styleDisplayNames[index];
                    div.setAttribute('key', style);
                    div.classList.add('fontStyle');
                    div.addEventListener('mouseup', () => {
                        prop.dump = this.dump.value[style];
                        prop.dump.value = !prop.dump.value;
                        if (prop.dump.values) {
                            prop.dump.values = prop.dump.values.map(() => prop.dump.value);
                        }
                        prop.dispatch('change-dump');
                        this.dump.value[style].value ? div.classList.add('select') : div.classList.remove('select');
                    });
                    content.appendChild(div);
                }
                prop.appendChild(content);
                return prop;
            },
            update(element, dump) {
                const parent = element.querySelector('[slot="content"]');
                for (let index = 0; index < parent.childNodes.length; index++) {
                    const div = parent.childNodes[index];
                    const key = div.getAttribute('key');
                    const multipleInvalid = isMultipleInvalid(this.dump.value[key]);
                    if (multipleInvalid) {
                        div.classList.remove('select');
                        div.classList.add('invalid');
                    } else {
                        div.classList.remove('invalid');
                        this.dump.value[key].value ? div.classList.add('select') : div.classList.remove('select');
                    }
                }
            },
        },
        isItalic: {
            update(element, dump) {
                setHidden(true, element);
            },
        },
        isUnderline: {
            update(element, dump) {
                setHidden(true, element);
            },
        },

    };
};
