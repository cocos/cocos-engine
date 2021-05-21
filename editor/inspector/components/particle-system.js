/* eslint-disable @typescript-eslint/no-unsafe-return */

const propUtils = require('../utils/prop');

exports.template = `
<div class="particle-system-component">
    <div class="content">
        <ui-prop type="dump" key="duration"></ui-prop>
        <ui-prop type="dump" key="capacity"></ui-prop>
        <ui-prop type="dump" key="loop"></ui-prop>
        <ui-prop type="dump" key="playOnAwake"></ui-prop>
        <ui-prop type="dump" key="prewarm"></ui-prop>
        <ui-prop type="dump" key="simulationSpace"></ui-prop>
        <ui-prop type="dump" key="simulationSpeed"></ui-prop>
        <ui-prop type="dump" key="startDelay"></ui-prop>
        <ui-prop type="dump" key="startLifetime"></ui-prop>
        <ui-prop type="dump" key="startColor"></ui-prop>
        <ui-prop type="dump" key="scaleSpace"></ui-prop>
        <ui-prop type="dump" key="startSize3D"></ui-prop>
        <!-- hack changeName if startSize3D change -->
        <ui-prop type="dump" key="startSizeX" displayName="startSize" showflag="!startSize3D"></ui-prop>
        <ui-prop type="dump" key="startSizeX" displayName="startSizeX" showflag="startSize3D"></ui-prop>
        <ui-prop type="dump" showflag="startSize3D" key="startSizeY"></ui-prop>
        <ui-prop type="dump" showflag="startSize3D" key="startSizeZ"></ui-prop>
        <ui-prop type="dump" key="startSpeed"></ui-prop>
        <ui-prop type="dump" key="startRotation3D"></ui-prop>
        <ui-prop type="dump" key="startRotationX" showflag="startRotation3D"></ui-prop>
        <ui-prop type="dump" key="startRotationY" showflag="startRotation3D"></ui-prop>
        <!-- hack changeName if startRotation3D change -->
        <ui-prop type="dump" showflag="startRotation3D" key="startRotationZ"></ui-prop>
        <ui-prop type="dump" showflag="!startRotation3D" displayName="StartRotation" key="startRotationZ">
        </ui-prop>
        <ui-prop type="dump" key="gravityModifier"></ui-prop>
        <ui-prop type="dump" key="rateOverTime"></ui-prop>
        <ui-prop type="dump" key="rateOverDistance"></ui-prop>
        <ui-prop type="dump" key="bursts"></ui-prop>
        <ui-prop type="dump" key="enableCulling"></ui-prop>
        <ui-section class="config" key="shapeModule" cache-expand="particle-system-shapeModule">
            <ui-prop slot="header" class="header" type="dump" key="shapeModule.value.enable" labelflag="shapeModule"
                empty="true">
                <ui-checkbox></ui-checkbox>
                <ui-label></ui-label>
            </ui-prop>
            <ui-prop type="dump" key="shapeModule.value.shapeType"></ui-prop>
            <ui-prop showflag="checkEnumInSubset,shapeModule.value.shapeType,Box,Cone,Sphere,Hemisphere" empty="true"
                labelflag="shapeModule.value.emitFrom" type="dump" key="shapeModule.value.emitFrom">
                <ui-label slot="label"></ui-label>
                <ui-select slot="content" id="emitFromSelect"></ui-select>
            </ui-prop>

            <ui-prop type="dump" showflag="checkEnumInSubset,shapeModule.value.shapeType,Circle,Cone,Sphere,Hemisphere"
                key="shapeModule.value.radius"></ui-prop>

            <ui-prop type="dump" showflag="checkEnumInSubset,shapeModule.value.shapeType,Circle,Cone,Sphere,Hemisphere"
                key="shapeModule.value.radiusThickness"></ui-prop>

            <ui-prop type="dump" showflag="checkEnumInSubset,shapeModule.value.shapeType,Cone"
                key="shapeModule.value.angle"></ui-prop>

            <ui-prop type="dump" showflag="checkEnumInSubset,shapeModule.value.shapeType,Circle,Cone"
                key="shapeModule.value.arc"></ui-prop>

            <ui-prop type="dump" showflag="checkEnumInSubset,shapeModule.value.shapeType,Circle,Cone"
                key="shapeModule.value.arcMode"></ui-prop>

            <ui-prop type="dump" showflag="checkEnumInSubset,shapeModule.value.shapeType,Circle,Cone"
                key="shapeModule.value.arcSpread"></ui-prop>

            <ui-prop type="dump" showflag="checkEnumInSubset,shapeModule.value.shapeType,Circle,Cone"
                key="shapeModule.value.arcSpeed"></ui-prop>

            <ui-prop type="dump" showflag="checkEnumInSubset,shapeModule.value.shapeType,Cone"
                key="shapeModule.value.length"></ui-prop>

            <ui-prop type="dump" showflag="checkEnumInSubset,shapeModule.value.shapeType,Box"
                key="shapeModule.value.boxThickness"></ui-prop>

            <ui-prop type="dump" key="shapeModule.value.position"></ui-prop>

            <ui-prop type="dump" key="shapeModule.value.rotation"></ui-prop>

            <ui-prop type="dump" key="shapeModule.value.scale"></ui-prop>

            <ui-prop type="dump" key="shapeModule.value.alignToDirection"></ui-prop>

            <ui-prop type="dump" key="shapeModule.value.randomDirectionAmount"></ui-prop>

            <ui-prop type="dump" key="shapeModule.value.sphericalDirectionAmount"></ui-prop>

            <ui-prop type="dump" key="shapeModule.value.randomPositionAmount"></ui-prop>

        </ui-section>
        <ui-section class="config" key="velocityOvertimeModule" autoflag="true" cache-expand="particle-system-velocityOvertimeModule"></ui-section>
        <ui-section class="config" key="forceOvertimeModule" autoflag="true" cache-expand="particle-system-forceOvertimeModule"></ui-section>

        <ui-section empty="true" class="config" key="sizeOvertimeModule" cache-expand="particle-system-sizeOvertimeModule">
            <ui-prop slot="header" class="header" type="dump" key="sizeOvertimeModule.value.enable"
                labelflag="sizeOvertimeModule" empty="true">
                <ui-checkbox></ui-checkbox>
                <ui-label></ui-label>
            </ui-prop>
            <ui-prop type="dump" key="sizeOvertimeModule.value.separateAxes"></ui-prop>
            <ui-prop type="dump" showflag="!sizeOvertimeModule.value.separateAxes"
                key="sizeOvertimeModule.value.size">
            </ui-prop>
            <ui-prop type="dump" showflag="sizeOvertimeModule.value.separateAxes"
                key="sizeOvertimeModule.value.x">
            </ui-prop>
            <ui-prop type="dump" showflag="sizeOvertimeModule.value.separateAxes"
                key="sizeOvertimeModule.value.y">
            </ui-prop>
            <ui-prop type="dump" showflag="sizeOvertimeModule.value.separateAxes"
                key="sizeOvertimeModule.value.z"></ui-prop>

        </ui-section>

        <ui-section empty="true" class="config" key="rotationOvertimeModule" cache-expand="particle-system-rotationOvertimeModule">

            <ui-prop slot="header" class="header" type="dump" key="rotationOvertimeModule.value.enable"
                labelflag="rotationOvertimeModule" empty="true">
                <ui-checkbox></ui-checkbox>
                <ui-label></ui-label>
            </ui-prop>
            <ui-prop type="dump" key="rotationOvertimeModule.value.separateAxes">
            </ui-prop>
            <ui-prop type="dump" showflag="rotationOvertimeModule.value.separateAxes"
                key="rotationOvertimeModule.value.x"></ui-prop>
            <ui-prop type="dump" showflag="rotationOvertimeModule.value.separateAxes"
                key="rotationOvertimeModule.value.y"></ui-prop>
            <ui-prop type="dump" key="rotationOvertimeModule.value.z"></ui-prop>

        </ui-section>
        <ui-section class="config" key="colorOverLifetimeModule" autoflag="true" cache-expand="particle-system-colorOverLifetimeModule"></ui-section>
        <ui-section class="config" key="textureAnimationModule" autoflag="true" cache-expand="particle-system-textureAnimationModule"></ui-section>
        <ui-section type="dump" showflag="!renderer.value.useGPU" key="limitVelocityOvertimeModule" class="config" cache-expand="particle-system-limitVelocityOvertimeModule">
            <ui-prop slot="header" class="header" type="dump" key="limitVelocityOvertimeModule.value.enable" labelflag="limitVelocityOvertimeModule"
                empty="true">
                <ui-checkbox></ui-checkbox>
                <ui-label></ui-label>
            </ui-prop>
            <ui-prop type="dump" key="limitVelocityOvertimeModule.value.space"></ui-prop>
            <ui-prop type="dump" key="limitVelocityOvertimeModule.value.dampen"></ui-prop>
            <ui-prop type="dump" key="limitVelocityOvertimeModule.value.separateAxes"></ui-prop>
            <ui-prop type="dump" key="limitVelocityOvertimeModule.value.limit" showflag="!limitVelocityOvertimeModule.value.separateAxes"></ui-prop>
            <ui-prop type="dump" key="limitVelocityOvertimeModule.value.limitX" showflag="limitVelocityOvertimeModule.value.separateAxes"></ui-prop>
            <ui-prop type="dump" key="limitVelocityOvertimeModule.value.limitY" showflag="limitVelocityOvertimeModule.value.separateAxes"></ui-prop>
            <ui-prop type="dump" key="limitVelocityOvertimeModule.value.limitZ" showflag="limitVelocityOvertimeModule.value.separateAxes"></ui-prop>
        </ui-section>
        <ui-section empty="true" class="config" showflag="!renderer.value.useGPU" key="trailModule" cache-expand="particle-system-trailModule">
            <ui-prop slot="header" class="header" type="dump" key="trailModule.value.enable" labelflag="trailModule"
                empty="true">
                <ui-checkbox></ui-checkbox>
                <ui-label></ui-label>
            </ui-prop>
            <ui-prop type="dump" key="trailModule.value.mode"></ui-prop>
            <ui-prop type="dump" key="trailModule.value.lifeTime"></ui-prop>
            <ui-prop type="dump" key="trailModule.value.minParticleDistance"></ui-prop>
            <ui-prop type="dump" key="trailModule.value.space"></ui-prop>
            <ui-prop type="dump" key="trailModule.value.textureMode"></ui-prop>
            <ui-prop type="dump" key="trailModule.value.widthFromParticle"></ui-prop>
            <ui-prop type="dump" key="trailModule.value.widthRatio"></ui-prop>
            <ui-prop type="dump" key="trailModule.value.colorFromParticle"></ui-prop>
            <ui-prop type="dump" key="trailModule.value.colorOverTrail"></ui-prop>
            <ui-prop type="dump" key="trailModule.value.colorOvertime"></ui-prop>

        </ui-section>
        <ui-prop type="dump" key="renderer"></ui-prop>
    </div>

    <!-- Render other data that has not taken over -->
    <div id="customProps">
    </div>
</div>
`;
const excludeList = [
    'duration', 'capacity', 'loop', 'playOnAwake', 'prewarm',
    'simulationSpace', 'simulationSpeed', 'startDelay',
    'startLifetime', 'startColor', 'scaleSpace', 'startSize3D',
    'startSizeX', 'startSizeY', 'startSizeZ', 'startSpeed',
    'startRotation3D', 'startRotationX', 'startRotationY',
    'startRotationZ', 'gravityModifier', 'rateOverTime',
    'rateOverDistance', 'bursts', 'shapeModule',
    'velocityOvertimeModule', 'forceOvertimeModule', 'sizeOvertimeModule',
    'rotationOvertimeModule', 'colorOverLifetimeModule', 'textureAnimationModule',
    'trailModule', 'renderer', 'enableCulling', 'limitVelocityOvertimeModule',
];

exports.methods = {
    getObjectByKey(target, key) {
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
    /**
     * Get the name based on the dump data
     */
    getName(value) {
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
     * Get tooltip based on dump data
     * @param value
     */
    getTitle(value) {
        if (value.tooltip) {
            if (!value.tooltip.startsWith('i18n:')) {
                return value.tooltip;
            }
            return Editor.I18n.t(`ENGINE.${value.tooltip.substr(5)}`) || value.tooltip;
        }

        return this.getName(value);
    },

    getEnumName(type, value) {
        for (const opt of type.enumList) {
            if (opt.value === value) {
                return opt.name;
            }
        }
        return String();
    },

    getEnumObjFromName(type, ...name) {
        const enumMap = {};
        for (const opt of type.enumList) {
            enumMap[opt.name] = {
                name: opt.name,
                value: opt.value,
            };
        }
        return name.map((value) => enumMap[value]);
    },

    getShapeTypeEmitFrom(shapeType) {
        const shapeTypeName = this.getEnumName(this.dump.value.shapeModule.value.shapeType, shapeType);
        let emitEnum = null;
        switch (shapeTypeName) {
            case 'Box':
                emitEnum = this.getEnumObjFromName(this.dump.value.shapeModule.value.emitFrom, 'Volume', 'Shell', 'Edge');
                break;
            case 'Cone':
                emitEnum = this.getEnumObjFromName(this.dump.value.shapeModule.value.emitFrom, 'Base', 'Shell', 'Volume');
                break;
            case 'Sphere':
                emitEnum = this.getEnumObjFromName(this.dump.value.shapeModule.value.emitFrom, 'Volume', 'Shell');
                break;
            case 'Hemisphere':
                emitEnum = this.getEnumObjFromName(this.dump.value.shapeModule.value.emitFrom, 'Volume', 'Shell');
                break;
            default:
                emitEnum = [];
        }
        return emitEnum;
    },

    checkEnumInSubset(enumValue, ...subset) {
        const optName = this.getEnumName(enumValue, enumValue.value);
        for (const name of subset) {
            if (name === optName) {
                return true;
            }
        }
        return false;
    },
};

const uiElements = {
    uiSections: {
        ready() {
            this.$.uiSections = this.$this.shadowRoot.querySelectorAll('ui-section');
        },
        update() {
            this.$.uiSections.forEach((element) => {
                const key = element.getAttribute('key');
                const showflag = element.getAttribute('showflag');
                const autoflag = element.getAttribute('autoflag');
                if (showflag) {
                    if (typeof showflag === 'string') {
                        if (showflag.startsWith('!')) {
                            const dump = this.getObjectByKey(this.dump.value, showflag.slice(1));
                            const isInvalid = propUtils.isMultipleInvalid(dump);
                            if (dump.value || isInvalid) {
                                // continue when don't show
                                element.style = 'display: none;';
                                return true;
                            }
                        } else {
                            const dump = this.getObjectByKey(this.dump.value, showflag);
                            const isInvalid = propUtils.isMultipleInvalid(dump);
                            if (!dump.value || isInvalid) {
                                // continue when don't show
                                element.style = 'display: none;';
                                return true;
                            }
                        }
                    }
                }
                element.style = '';
                if (autoflag) {
                    const oldChildren = Array.from(element.children);
                    const children = [];
                    const header = document.createElement('ui-prop');
                    header.setAttribute('slot', 'header');
                    header.setAttribute('type', 'dump');
                    header.setAttribute('empty', 'true');
                    header.className = 'header';
                    header.dump = this.getObjectByKey(this.dump.value, key);
                    const checkbox = document.createElement('ui-checkbox');
                    checkbox.addEventListener('change', (event) => {
                        this.getObjectByKey(this.dump.value, key).value.enable.value = event.target.value;
                        header.dispatch('change-dump');
                    });
                    checkbox.setAttribute('value', this.getObjectByKey(this.dump.value, key).value.enable.value);
                    const label = document.createElement('ui-label');
                    label.setAttribute('value', this.getName(this.getObjectByKey(this.dump.value, key)));
                    label.setAttribute('tooltip', this.getTitle(this.getObjectByKey(this.dump.value, key)));
                    header.replaceChildren(...[checkbox, label]);
                    children.push(header);
                    const propMap = this.getObjectByKey(this.dump.value, key).value;

                    for (const propKey in propMap) {
                        const dump = propMap[propKey];
                        if (propKey === 'enable') {
                            continue;
                        }
                        const oldProp = oldChildren.find((child) => child.getAttribute('key') === propKey);
                        const uiProp = oldProp || document.createElement('ui-prop');
                        uiProp.setAttribute('type', 'dump');
                        uiProp.setAttribute('key', propKey);
                        const isShow = dump.visible;
                        if (isShow) {
                            uiProp.render(dump);
                            children.push(uiProp);
                        }
                    }
                    children.sort((a, b) => (a.dump.displayOrder ? a.dump.displayOrder : 0 - b.dump.displayOrder ? b.dump.displayOrder : 0));
                    children.forEach((newChild, index) => {
                        const oldChild = oldChildren[index];
                        if (oldChild === newChild) {
                            return true;
                        }
                        if (oldChild) {
                            oldChild.replaceWith(newChild);
                        } else {
                            element.appendChild(newChild);
                        }
                    });
                    while (oldChildren.length > children.length) {
                        const oldChild = oldChildren.pop();
                        oldChild.remove();
                    }
                }
            });
        },
    },
    emitFromSelect: {
        ready() {
            this.$.emitFromSelect.addEventListener('change', (event) => {
                this.dump.value.shapeModule.value.emitFrom.value = event.target.value;
                this.$.emitFromSelect.parentNode.dispatch('change-dump');
            });
        },
        update() {
            this.$.emitFromSelect.setAttribute('value', this.dump.value.shapeModule.value.emitFrom.value);
            const datas = this.getShapeTypeEmitFrom(this.dump.value.shapeModule.value.shapeType.value);
            const children = datas.map((data) => {
                const child = document.createElement('option');
                child.innerHTML = data.name;
                child.setAttribute('value', data.value);
                return child;
            });
            this.$.emitFromSelect.replaceChildren(...children);
        },
    },
    baseProps: {
        ready() {
            this.$.baseProps = this.$this.shadowRoot.querySelectorAll('ui-prop:not(.customProp)');
            this.$.baseProps.forEach((element) => {
                const key = element.getAttribute('key');
                const isEmpty = element.getAttribute('empty');
                const isInput = element.getAttribute('inputflag');
                const isHeader = element.getAttribute('slot') === 'header';
                element.addEventListener('change-dump', () => {
                    uiElements.baseProps.update.call(this);
                });
                if (isEmpty) {
                    if (isHeader) {
                        const checkbox = element.querySelector('ui-checkbox');
                        if (checkbox) {
                            checkbox.addEventListener('change', (event) => {
                                this.getObjectByKey(this.dump.value, key).value = event.target.value;
                                element.dispatch('change-dump');
                            });
                        }
                    }
                    if (isInput) {
                        const input = element.querySelector('ui-input');
                        if (input) {
                            input.addEventListener('change', (event) => {
                                this.getObjectByKey(this.dump.value, key).value = event.target.value;
                                element.dispatch('change-dump');
                            });
                        }
                    }
                }
            });
        },
        update() {
            this.$.baseProps.forEach((element) => {
                const key = element.getAttribute('key');
                const isEmpty = element.getAttribute('empty');
                let isShow = this.getObjectByKey(this.dump.value, key).visible;
                const isHeader = element.getAttribute('slot') === 'header';
                const isInput = element.getAttribute('inputflag');
                const displayName = element.getAttribute('displayName');
                const dump = this.getObjectByKey(this.dump.value, key);
                const showflag = element.getAttribute('showflag');
                if (showflag) {
                    if (typeof showflag === 'string') {
                        if (showflag.startsWith('checkEnumInSubset')) {
                            const params = showflag.split(',');
                            const enumValue = this.getObjectByKey(this.dump.value, params[1]);
                            const subset = params.slice(2);
                            isShow = isShow && this.checkEnumInSubset(enumValue, ...subset);
                        } else if (showflag.startsWith('!')) {
                            const dump = this.getObjectByKey(this.dump.value, showflag.slice(1));
                            const isInvalid = propUtils.isMultipleInvalid(dump);
                            isShow = isShow && !isInvalid && !dump.value;
                        } else {
                            const dump = this.getObjectByKey(this.dump.value, showflag);
                            const isInvalid = propUtils.isMultipleInvalid(dump);
                            isShow = isShow && !isInvalid && dump.value;
                        }
                    }
                }
                dump.displayName = displayName;
                if (!isEmpty) {
                    if (isShow) {
                        element.render(dump);
                    }
                } else {
                    const label = element.querySelector('ui-label');
                    if (label) {
                        const labelflag = element.getAttribute('labelflag');
                        if (labelflag) {
                            label.setAttribute('value', this.getName(this.getObjectByKey(this.dump.value, labelflag)));
                            label.setAttribute('tooltip', this.getTitle(this.getObjectByKey(this.dump.value, labelflag)));
                        }
                    }
                    if (isInput) {
                        const input = element.querySelector('ui-input');
                        input.setAttribute('value', dump.value);
                    }
                    if (isHeader) {
                        const checkbox = element.querySelector('ui-checkbox');
                        if (checkbox) {
                            checkbox.setAttribute('value', dump.value);
                        }
                    }

                    element.dump = dump;
                }
                element.style = isShow ? '' : 'display: none;';
            });
        },
    },
    customProps: {
        update() {
            this.$.customProps.replaceChildren(...propUtils.getCustomPropElements(excludeList, this.dump, (element, prop) => {
                element.className = 'customProp';
                if (prop.dump.visible) {
                    element.render(prop.dump);
                }
            }));
        },
    },
};
exports.$ = {
    customProps: '#customProps',
    emitFromSelect: '#emitFromSelect',
};
exports.ready = function() {
    for (const key in uiElements) {
        const element = uiElements[key];
        if (typeof element.ready === 'function') {
            element.ready.call(this);
        }
    }
};
exports.update = function(dump) {
    this.dump = dump;
    for (const key in uiElements) {
        const element = uiElements[key];
        if (typeof element.update === 'function') {
            element.update.call(this);
        }
    }
};
