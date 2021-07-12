const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

const { setHidden, setDisabled, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    // Handling in-line displayed attributes
    const needToInlines = [
        'life',
        'startColor',
        'endColor',
        'angle',
        'startSize',
        'endSize',
        'startSpin',
        'endSpin',
        'speed',
        'tangentialAccel',
        'radialAccel',
        'startRadius',
        'endRadius',
        'rotatePerS',
    ];

    this.elements = {
        customMaterial: {
            displayOrder: 0,
        },
        color: {
            displayOrder: 1,
        },
        preview: {
            displayOrder: 2,
        },
        playOnLoad: {
            displayOrder: 3,
        },
        autoRemoveOnFinish: {
            displayOrder: 4,
        },
        file: {
            displayOrder: 5,
            update(element, dump) {
                setDisabled(!dump.file.value.uuid, this.$.syncButton);
            },
        },
        custom: {
            displayOrder: 6,
            ready(element) {
                const $checkbox = element.querySelector('ui-checkbox[slot="content"]');

                const $sync = document.createElement('ui-button');
                $sync.setAttribute('slot', 'content');
                $sync.setAttribute('class', 'blue');
                $sync.setAttribute('tooltip', 'i18n:ENGINE.components.particle_system_2d.sync_tips');
                const $syncLabel = document.createElement('ui-label');
                $syncLabel.setAttribute('value', 'i18n:ENGINE.components.particle_system_2d.sync');
                $sync.appendChild($syncLabel);
                $checkbox.after($sync);

                // Hack: ui-button has extra events that are passed up to ui-prop ;
                $sync.addEventListener('change', (event) => {
                    event.stopPropagation();
                    Editor.Message.send('scene', 'snapshot');
                });

                $sync.addEventListener('confirm', async (event) => {
                    event.stopPropagation();

                    const fileUuid = this.dump.value.file.value.uuid;
                    const fileInfo = await Editor.Message.request('asset-db', 'query-asset-meta', fileUuid);
                    if (fileInfo) {
                        let values = [this.$this.dump.value];
                        if (this.$this.dump.values) {
                            values = this.$this.dump.values;
                        }

                        for (const item of values) {
                            item.file.value.uuid = fileUuid;
                            item.custom.value = true;

                            /**
                             * TODO Hack: a serious problem
                             * The data with underscores is also involved in setting in the engine.
                             * but it's visible = false, and it's impossible to assert the file and _file association from the name.
                             * easily ignored when data changes
                             * There is a place under the same
                             */

                            item._file.value.uuid = fileUuid;
                            item._custom.value = true;

                            for (const key in fileInfo.userData) {
                                const value = fileInfo.userData[key];
                                if (key === 'spriteFrameUuid') {
                                    item.spriteFrame.value.uuid = value;
                                } else if (item[key] !== undefined) {
                                    item[key].value = value;
                                }
                            }
                        }

                        this.$this.dispatch('change-dump');
                    }
                });

                const $export = document.createElement('ui-button');
                $export.setAttribute('slot', 'content');
                $export.setAttribute('class', 'blue');
                $export.setAttribute('tooltip', 'i18n:ENGINE.components.particle_system_2d.export_tips');
                const $exportLabel = document.createElement('ui-label');
                $exportLabel.setAttribute('value', 'i18n:ENGINE.components.particle_system_2d.export');
                $export.appendChild($exportLabel);
                $sync.after($export);

                $export.addEventListener('change', (event) => {
                    event.stopPropagation();
                    Editor.Message.send('scene', 'snapshot');
                });

                $export.addEventListener('confirm', async (event) => {
                    event.stopPropagation();

                    let assetInfo = await Editor.Message.request('scene', 'export-particle-plist', this.dump.value.uuid.value);
                    if (assetInfo) {
                        let values = [this.$this.dump.value];
                        if (this.$this.dump.values) {
                            values = this.$this.dump.values;
                        }

                        for (const item of values) {
                            item.file.value.uuid = assetInfo.uuid;
                            item.custom.value = false;

                            // Same instructions as above
                            item._file.value.uuid = assetInfo.uuid;
                            item._custom.value = false;
                        }

                        this.$this.dispatch('change-dump');
                    }
                });

                this.$.syncButton = $sync;
                this.$.exportButton = $export;
            },
            update(element, dump) {
                const existKeys = ['customMaterial', 'color', 'preview', 'playOnLoad', 'autoRemoveOnFinish', 'file', 'custom'];

                const toggleProps = [];
                for (const name in this.dump.value) {
                    if (this.dump.value[name].visible && !existKeys.includes(name)) {
                        toggleProps.push(name);
                    }
                }

                const toggleElements = ['syncButton', 'exportButton'];
                const toggleKeys = toggleProps.concat(toggleElements);

                const isMultiple = dump.custom && !!dump.custom.values;
                setDisabled(isMultiple, this.$.exportButton);

                const hidden = isMultipleInvalid(dump.custom) || !dump.custom.value;
                toggleKeys.forEach((key) => {
                    setHidden(hidden, this.$[key]);
                });

                needToInlines.forEach((key) => {
                    const $left = this.$[key];
                    const $right = this.$[`${key}Var`];

                    if ($right && $right.parentNode === $left) {
                        return;
                    }

                    $right.setAttribute('no-label', '');
                    $right.setAttribute('slot', 'content');
                    $right.setAttribute('style', 'margin: 0');
                    $left.appendChild($right);
                });

            },
        },
        emitterMode: {
            update(element, dump) {
                if (isMultipleInvalid(dump.custom) || !dump.custom.value) {
                    return;
                }

                // when dump.emitterMode.value === 0
                let shows = ['gravity', 'speed', 'tangentialAccel', 'radialAccel', 'rotationIsDir'];
                let hiddens = ['startRadius', 'endRadius', 'rotatePerS'];

                if (dump.emitterMode.value === 1) {
                    const temp = hiddens;
                    hiddens = shows;
                    shows = temp;
                }

                shows.forEach((key) => setHidden(false, this.$[key]));
                hiddens.forEach((key) => setHidden(true, this.$[key]));
            },
        },
    };

    needToInlines.forEach((key) => {
        const rightKey = `${key}Var`;
        this.elements[rightKey] = {
            isAppendToParent() {
                const $left = this.$[key];
                const $right = this.$[`${key}Var`];

                if ($left && $right && $right.parentNode === $left) {
                    return false;
                }

                return true;
            },
        };
    });
};
