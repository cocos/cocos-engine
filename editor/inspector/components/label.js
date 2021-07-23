const { getName, setHidden, isMultipleInvalid, setTooltip, setLabel } = require('../utils/prop');
const { template, $, update } = require('./base');
const fontStyles = ['isBold', 'isItalic', 'isUnderline'];
exports.template = template;
exports.$ = $;
exports.update = update;
exports.style = /* css */`
ui-tab {
    flex: none;
}

.fontStyleParent {
    display:flex
}

.fontStyle:nth-child(2) {
    margin-left: 5px;
    margin-right: 5px;
}

.fontStyle {
    height: 20px;
    width: 42px;
    text-align: center;
    line-height: 20px;
    border: calc(var(--size-normal-border) * 1px) solid var(--color-normal-border);
    background-color: var(--color-default-fill);
    border-radius: calc(var(--size-normal-radius) * 1px);
}

.fontStyle.invalid {
    background-color: var(--color-default-fill);
}

.fontStyle.select {
    background-color: var(--color-default-fill-emphasis);
}

.fontStyle.italic {
    font-style: italic;
}

.fontStyle.bold {
    font-weight: bold;
}

.fontStyle.underline {
    text-decoration-line: underline;
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
                setLabel(label, dump);
                const content = document.createElement('ui-tab');
                content.setAttribute('slot', 'content');
                content.addEventListener('change', (event) => {
                    if (event.target.value !== -1) {
                        dump.value = event.target.value;
                        if (dump.values) {
                            dump.values.forEach((_, index) => dump.values[index] = dump.value);
                        }
                        prop.dispatch('change-dump');
                    }
                });

                for (let index = 0; index < dump.enumList.length; index++) {
                    const element = dump.enumList[index];
                    const image = document.createElement('ui-image');
                    const button = document.createElement('ui-button');
                    const iconName = element.name.toLocaleLowerCase();
                    if (iconName === 'center') {
                        image.setAttribute('value', `packages://scene/static/icons/align-h-${iconName}.png`);
                    } else {
                        image.setAttribute('value', `packages://scene/static/icons/align-${iconName}.png`);
                    }
                    image.style.height = '20px';
                    image.style.width = '22px';
                    image.style.verticalAlign = 'middle';
                    image.setAttribute('fill', true);
                    setTooltip(image, dump);
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
                setLabel(label, dump);
                const content = document.createElement('ui-tab');
                content.setAttribute('slot', 'content');
                content.addEventListener('change', (event) => {
                    if (event.target.value !== -1) {
                        dump.value = event.target.value;
                        if (dump.values) {
                            dump.values.forEach((_, index) => dump.values[index] = dump.value);
                        }
                        prop.dispatch('change-dump');
                    }
                });

                for (let index = 0; index < dump.enumList.length; index++) {
                    const element = dump.enumList[index];
                    const image = document.createElement('ui-image');
                    const button = document.createElement('ui-button');
                    const iconName = element.name.toLocaleLowerCase();
                    if (iconName === 'center') {
                        image.setAttribute('value', `packages://scene/static/icons/align-v-${iconName}.png`);
                    } else {
                        image.setAttribute('value', `packages://scene/static/icons/align-${iconName}.png`);
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
                label.setAttribute('tooltip', Editor.I18n.t('ENGINE.components.label.font_style_tooltip'));
                prop.appendChild(label);
                const content = document.createElement('div');
                content.setAttribute('slot', 'content');
                content.classList.add('fontStyleParent');
                const styleDisplayNames = ['B', 'I', 'U'];
                const styleClassNames = ['bold', 'italic', 'underline'];
                for (let index = 0; index < fontStyles.length; index++) {
                    const style = fontStyles[index];
                    const label = document.createElement('ui-label');
                    label.innerHTML = styleDisplayNames[index];
                    setTooltip(label, this.dump.value[style]);
                    label.setAttribute('key', style);
                    label.classList.add('fontStyle', styleClassNames[index]);
                    label.addEventListener('mouseup', () => {
                        prop.dump = this.dump.value[style];
                        prop.dump.value = !prop.dump.value;
                        if (prop.dump.values) {
                            prop.dump.values.forEach((_, index) => prop.dump.values[index] = prop.dump.value);
                        }
                        prop.dispatch('change-dump');
                        this.dump.value[style].value ? label.classList.add('select') : label.classList.remove('select');
                    });
                    content.appendChild(label);
                }
                prop.appendChild(content);
                return prop;
            },
            update(element, dump) {
                const parent = element.querySelector('[slot="content"]');
                for (let index = 0; index < fontStyles.length; index++) {
                    const div = parent.querySelector(`[key="${fontStyles[index]}"]`);
                    const key = fontStyles[index];
                    if (div) {
                        const multipleInvalid = isMultipleInvalid(this.dump.value[key]);
                        if (multipleInvalid) {
                            div.classList.remove('select');
                            div.classList.add('invalid');
                        } else {
                            div.classList.remove('invalid');
                            this.dump.value[key].value ? div.classList.add('select') : div.classList.remove('select');
                        }
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
