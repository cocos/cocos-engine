/* eslint-disable @typescript-eslint/no-unsafe-return */
const { readFileSync } = require('fs-extra');
const { join } = require('path');
const propUtils = require('../utils/prop');

const excludeList = [
    'customMaterial', '_srcBlendFactor', '_dstBlendFactor',
    'color', 'preview', 'playOnLoad', 'autoRemoveOnFinish',
    'file', 'custom', 'spriteFrame', 'duration', 'emissionRate',
    'life', 'lifeVar', 'totalParticles', 'startColor', 'startColorVar',
    'endColor', 'endColorVar', 'angle', 'angleVar', 'startSize',
    'startSizeVar', 'endSize', 'endSizeVar', 'startSpin', 'startSpinVar',
    'endSpin', 'endSpinVar', 'sourcePos', 'posVar', 'positionType',
    'emitterMode', 'gravity', 'speed', 'speedVar', 'tangentialAccel',
    'tangentialAccelVar', 'radialAccel', 'radialAccelVar', 'rotationIsDir',
    'startRadius', 'startRadiusVar', 'endRadius', 'endRadiusVar',
    'rotatePerS', 'rotatePerSVar',
];

exports.template = `
<div class="particle-system-2d-component">
    <style>
        div.content[slot="content"] {
            display: flex;
            flex: 1;
        }

        div.content[slot="content"]>ui-prop {
            flex: 1;
        }

        div.content[slot="content"]>ui-prop>* {
            flex: 1;
            display: flex;
        }
    </style>
    <ui-prop type="dump" key="customMaterial"></ui-prop>

    <ui-prop type="dump" key="_srcBlendFactor"></ui-prop>
    <ui-prop type="dump" key="_dstBlendFactor"></ui-prop>

    <ui-prop type="dump" key="color"></ui-prop>

    <ui-prop type="dump" key="preview"></ui-prop>

    <ui-prop type="dump" key="playOnLoad"></ui-prop>

    <ui-prop type="dump" key="autoRemoveOnFinish"></ui-prop>

    <ui-prop type="dump" id="file" key="file"></ui-prop>

    <ui-prop id="custom" key="custom" type="dump" empty="true">

        <ui-label slot="label" key="custom"></ui-label>

        <div slot="content" class="content">
            <ui-checkbox key="custom"></ui-checkbox>
            <ui-button confirmflag="onSync" showflag="custom.value" disabledflag="!file.value.uuid"
                tooltip="i18n:engine.components.particle_system_2d.sync_tips">
                <ui-label value="i18n:engine.components.particle_system_2d.sync"></ui-label>
            </ui-button>
            <ui-button showflag="custom.value" confirmflag="onExport"
                tooltip="i18n:engine.components.particle_system_2d.export_tips">
                <ui-label value="i18n:engine.components.particle_system_2d.export"></ui-label>
            </ui-button>
        </div>
    </ui-prop>



    <!-- custom prop-->


    <ui-prop type="dump" showflag="custom.value" key="spriteFrame"></ui-prop>

    <ui-prop type="dump" showflag="custom.value" key="duration"></ui-prop>

    <ui-prop type="dump" showflag="custom.value" key="emissionRate"></ui-prop>

    <ui-prop key="life" showflag="custom.value" empty="true">

        <ui-label key="life" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="life" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="lifeVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop type="dump" showflag="custom.value" key="totalParticles"></ui-prop>

    <ui-prop empty="true" showflag="custom.value">

        <ui-label key="startColor" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="startColor" colorflag="true">
                <ui-color></ui-color>
            </ui-prop>
            <ui-prop empty="true" key="startColorVar" colorflag="true">
                <ui-color></ui-color>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop empty="true" showflag="custom.value">

        <ui-label key="endColor" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="endColor" colorflag="true">
                <ui-color></ui-color>
            </ui-prop>
            <ui-prop empty="true" key="endColorVar" colorflag="true">
                <ui-color></ui-color>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop empty="true" showflag="custom.value">

        <ui-label key="angle" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="angle" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="angleVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop empty="true" showflag="custom.value">

        <ui-label key="startSize" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="startSize" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="startSizeVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop empty="true" showflag="custom.value">

        <ui-label key="endSize" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="endSize" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="endSizeVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop empty="true" showflag="custom.value">

        <ui-label key="startSpin" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="startSpin" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="startSpinVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop empty="true" showflag="custom.value">

        <ui-label key="endSpin" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="endSpin" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="endSpinVar" inputflag="true">
                <ui-input key="endSpinVar"></ui-input>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop type="dump" key="sourcePos" showflag="custom.value"></ui-prop>

    <ui-prop type="dump" key="posVar" showflag="custom.value"></ui-prop>

    <ui-prop type="dump" key="positionType" showflag="custom.value"></ui-prop>

    <ui-prop type="dump" key="emitterMode" showflag="custom.value"></ui-prop>

    <ui-prop type="dump" showflag="emitterMode0" key="gravity"></ui-prop>

    <ui-prop empty="true" showflag="emitterMode0">

        <ui-label key="speed" slot="label"></ui-label>


        <div slot="content" class="content">
            <ui-prop empty="true" key="speed" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="speedVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>
    <ui-prop empty="true" showflag="emitterMode0">

        <ui-label key="tangentialAccel" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="tangentialAccel" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="tangentialAccelVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>
    <ui-prop empty="true" showflag="emitterMode0">

        <ui-label key="radialAccel" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="radialAccel" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="radialAccelVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>
    <ui-prop type="dump" showflag="emitterMode0" key="rotationIsDir"></ui-prop>


    <ui-prop empty="true" showflag="emitterMode1">

        <ui-label key="startRadius" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="startRadius" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="startRadiusVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop empty="true" showflag="emitterMode1">

        <ui-label slot="label" key="endRadius"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="endRadius" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="endRadiusVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>

    <ui-prop empty="true" showflag="emitterMode1">

        <ui-label key="rotatePerS" slot="label"></ui-label>

        <div slot="content" class="content">
            <ui-prop empty="true" key="rotatePerS" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
            <ui-prop empty="true" key="rotatePerSVar" inputflag="true">
                <ui-input></ui-input>
            </ui-prop>
        </div>
    </ui-prop>


    <!-- 渲染其他没有接管的数据 -->
    <div id="customProps"></div>
</div>
`;

exports.methods = {
    objectToColor (colorObj) {
        return JSON.stringify([colorObj.r, colorObj.g, colorObj.b, colorObj.a]);
    },
    colorToObject (color) {
        if (typeof color === 'string') {
            color = JSON.parse(color);
        }
        return { r: color[0], g: color[1], b: color[2], a: color[3] };
    },
    async onSync (event) {
        event.stopPropagation();
        const fileInfo = await Editor.Message.request('asset-db', 'query-asset-meta', this.dump.value.file.value.uuid);
        if (fileInfo) {
            const isCustom = this.dump.value.custom.value;
            for (const key in fileInfo.userData) {
                const value = fileInfo.userData[key];
                if (key === 'spriteFrameUuid') {
                    this.dump.value.spriteFrame.value.uuid = value;
                    // this.$root.$emit('set-property', { path: this.dump.value.spriteFrame.path });
                } else if (this.dump.value[key] !== undefined) {
                    this.dump.value[key].value = value;
                    // this.$root.$emit('set-property', { path: this.dump.value[key].path });
                }
            }
            // Prevent modifying the values of Custom
            this.dump.value.custom.value = isCustom;
            this.dispatch('change-dump');
        }
    },

    async onExport (event) {
        event.stopPropagation();
        // Assigns a value to the target dump and sends an event
        const assetInfo = await Editor.Message.request('scene', 'export-particle-plist', this.dump.value.uuid.value);
        if (assetInfo) {
            this.dump.value.file.value.uuid = assetInfo.uuid;
            this.dump.value.custom.value = false;
        }
        this.$.file.dispatch('change-dump');
        this.$.custom.dispatch('change-dump');
    },
    /**
 * Retrieve the name from the dump data
 */
    getName (value) {
        if (!value) {
            return '';
        }

        if (value.displayName) {
            return value.displayName;
        }

        let name = value.name || '';

        name = name.replace(/^\S/, (str) => str.toUpperCase());
        name = name.replace(/_/g, (str) => ' ');
        name = name.replace(/ \S/g, (str) => ` ${str.toUpperCase()}`);

        return name.trim();
    },

    /**
     * Get the tooltip from the dump data
     * @param value
     */
    getTitle (value) {
        if (value.tooltip) {
            if (!value.tooltip.startsWith('i18n:')) {
                return value.tooltip;
            }
            return Editor.I18n.t(`ENGINE.${value.tooltip.substr(5)}`) || value.tooltip;
        }

        return this.getName(value);
    },
    getObjectByKey (target, key) {
        let params = [];
        if (typeof key === 'string') {
            params = key.split('.');
        } else if (key instanceof Array) {
            params = key;
        }
        if (params.length > 0) {
            const value = params.shift();
            return this.getObjectByKey(target[value], params);
        } else {
            return target;
        }
    },
};
exports.$ = {
    customProps: '#customProps',
    custom: '#custom',
    file: '#file',
};
const uiElements = {
    checkboxs: {
        ready () {
            this.$.checkboxs = this.$this.querySelectorAll('ui-checkbox');
            this.$.checkboxs.forEach((checkbox) => {
                const key = checkbox.getAttribute('key');
                if (key) {
                    checkbox.addEventListener('change', (event) => {
                        const dump = this.getObjectByKey(this.dump.value, key);
                        dump.value = event.target.value;
                    });
                }
            });
        },
        update () {
            this.$.checkboxs.forEach((checkbox) => {
                const key = checkbox.getAttribute('key');
                const dump = this.getObjectByKey(this.dump.value, key);
                if (dump) {
                    checkbox.setAttribute('value', dump.value);
                }
            });
        },
    },
    labels: {
        ready () {
            this.$.labels = this.$this.querySelectorAll('ui-label');
        },
        update () {
            this.$.labels.forEach((label) => {
                const key = label.getAttribute('key');
                if (key) {
                    const dump = this.getObjectByKey(this.dump.value, key);
                    label.setAttribute('value', this.getName(dump));
                    label.setAttribute('tooltip', this.getTitle(dump));
                }
            });
        },
    },
    buttons: {
        ready () {
            this.$.buttons = this.$this.querySelectorAll('ui-button');
            this.$.buttons.forEach((button) => {
                const confirmCallback = button.getAttribute('confirmflag');
                if (confirmCallback && typeof this[confirmCallback] === 'function') {
                    button.addEventListener('confirm', async (event) => {
                        await this[confirmCallback](event);
                    });
                }
            });
        },
        update () {
            this.$.buttons.forEach((button) => {
                const showflag = button.getAttribute('showflag');
                const disabledflag = button.getAttribute('disabledflag');
                if (disabledflag) {
                    let isDisabled;
                    if (disabledflag.startsWith('!')) {
                        isDisabled = !this.getObjectByKey(this.dump.value, disabledflag.slice(1));
                    } else {
                        isDisabled = this.getObjectByKey(this.dump.value, disabledflag);
                    }
                    button.setAttribute('disabled', isDisabled);
                }
                if (showflag) {
                    const isShow = this.getObjectByKey(this.dump.value, showflag);
                    button.style = isShow ? '' : 'display: none;';
                }
            });
        },
    },
    baseProps: {
        ready () {
            this.$.baseProps = this.$this.querySelectorAll('ui-prop:not(.customProp)');
            this.$.baseProps.forEach((element) => {
                const key = element.getAttribute('key');
                const isEmpty = element.getAttribute('empty');
                const isInput = element.getAttribute('inputflag');
                const isColor = element.getAttribute('colorflag');

                element.addEventListener('change-dump', () => {
                    uiElements.baseProps.update.call(this);
                });
                if (isEmpty) {
                    element.addEventListener('change', (event) => {
                        element.dispatch('change-dump');
                    });
                    if (isInput) {
                        const input = element.querySelector('ui-input');
                        if (input) {
                            input.addEventListener('change', (event) => {
                                this.getObjectByKey(this.dump.value, key).value = event.target.value;
                            });
                        }
                    }
                    if (isColor) {
                        const color = element.querySelector('ui-color');
                        if (color) {
                            color.addEventListener('change', (event) => {
                                this.getObjectByKey(this.dump.value, key).value = this.colorToObject(event.target.value);
                            });
                        }
                    }
                }
            });
        },
        update () {
            this.$.baseProps.forEach((element) => {
                const key = element.getAttribute('key');
                const isEmpty = element.getAttribute('empty');
                let isShow = !key || this.getObjectByKey(this.dump.value, key).visible;
                const isInput = element.getAttribute('inputflag');
                const isColor = element.getAttribute('colorflag');
                const showflag = element.getAttribute('showflag');
                if (showflag) {
                    if (typeof showflag === 'string') {
                        if (showflag.startsWith('emitterMode')) {
                            const mode = showflag.split('emitterMode')[1];
                            isShow = isShow && this.dump.value.custom.value && this.dump.value.emitterMode.value == mode;
                        } else if (showflag.startsWith('!')) {
                            isShow = isShow && !this.getObjectByKey(this.dump.value, showflag.slice(1));
                        } else {
                            isShow = isShow && this.getObjectByKey(this.dump.value, showflag);
                        }
                    }
                }
                if (!isEmpty) {
                    if (isShow) {
                        element.render(this.getObjectByKey(this.dump.value, key));
                    }
                } else {
                    const dump = this.getObjectByKey(this.dump.value, key);
                    if (isInput) {
                        const input = element.querySelector('ui-input');
                        input.setAttribute('value', dump.value);
                    }
                    if (isColor) {
                        const color = element.querySelector('ui-color');
                        color.setAttribute('value', this.objectToColor(dump.value));
                    }
                    element.dump = dump;
                }
                element.style = isShow ? '' : 'display: none;';
            });
        },
    },
    customProps: {
        update () {
            this.$.customProps.replaceChildren(...propUtils.getCustomPropElements(excludeList, this.dump, (element, prop) => {
                element.className = 'customProp';
                if (prop.dump.visible) {
                    element.render(prop.dump);
                }
            }));
        },
    },
};
exports.ready = function () {
    for (const key in uiElements) {
        const element = uiElements[key];
        if (typeof element.ready === 'function') {
            element.ready.call(this);
        }
    }
};
exports.update = function (dump) {
    for (const key in dump.value) {
        const info = dump.value[key];
        if (dump.values) {
            info.values = dump.values.map((value) => value[key].value);
        }
    }
    this.dump = dump;
    for (const key in uiElements) {
        const element = uiElements[key];
        if (typeof element.update === 'function') {
            element.update.call(this);
        }
    }
};
