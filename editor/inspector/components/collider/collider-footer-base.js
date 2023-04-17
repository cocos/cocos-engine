"use strict";
const panelDataMap = new WeakMap();
/**
 * 
 * @param {string} className 
 */
exports.createPanel = (className) => {
    return Editor.Panel.define({
        ready() {
            this.$.box.addEventListener('confirm', () => {
                const dump = panelDataMap.get(this).dump;
                const componentUUIDs = dump.value.uuid.values ? dump.value.uuid.values : [dump.value.uuid.value];
                const value = !this.$.box.classList.contains('red');
                if (value) {
                    Editor.Message.send('scene', 'enter-components-edit-mode', componentUUIDs);
                } else {
                    Editor.Message.send('scene', 'exit-components-edit-mode', componentUUIDs);
                }
            });
            /**
             * 
             * @param {string[]} names the name of component's class
             */
            const onEditingGizmosChanged = (names) => {
                this.updateBox(names.includes(className));
            };
            /**
             * 
             * @param {string} toolName the name of transform tool
             */
            const onGizmoToolChanged = (toolName) => {
                if (toolName !== 'none') {
                    this.stopEdit();
                }
            }
            panelDataMap.set(this, {
                onEditingGizmosChanged,
                onGizmoToolChanged,
            });

            Editor.Message.addBroadcastListener('scene:editing-gizmos-changed', onEditingGizmosChanged);
            Editor.Message.addBroadcastListener('scene:gizmo-tool-changed', onGizmoToolChanged);
        },
        methods: {
            stopEdit() {
                const data = panelDataMap.get(this);
                if (data) {
                    const dump = data.dump;
                    const componentUUIDs = dump.value.uuid.values ? dump.value.uuid.values : [dump.value.uuid.value];
                    Editor.Message.send('scene', 'exit-components-edit-mode', componentUUIDs);
                }
            },
            enterEdit() {
                const data = panelDataMap.get(this);
                if (data) {
                    const dump = data.dump;
                    const componentUUIDs = dump.value.uuid.values ? dump.value.uuid.values : [dump.value.uuid.value];
                    Editor.Message.send('scene', 'enter-components-edit-mode', componentUUIDs);
                }
            },
            updateBox(isEdit) {
                if (isEdit) {
                    this.$.box.classList.add('red');
                    this.$.boxLabel.value = 'i18n:ENGINE.components.gizmo.exit_collider_edit';
                }
                else {
                    this.$.box.classList.remove('red');
                    this.$.boxLabel.value = 'i18n:ENGINE.components.gizmo.enter_collider_edit';
                }
            }
        },
        update(dump) {
            if (dump) {
                const data = panelDataMap.get(this);
                data.dump = dump;

            }
        },
        $: {
            box: '.box',
            boxLabel: '#boxLabel'
        },
        style: /* css */ `
         .collider-footer {
             display: flex;
             flex-wrap: wrap;
             margin-top: 6px;
         }

         ui-button[hidden] {
             display: none;
         }

         .flex {
             flex: 1;
         }

         ui-button {
             margin: 4px;
         }

        `,
        template: /* html */ `
            <div class="collider-footer">
                <ui-button class="box flex">
                    <ui-label id="boxLabel" value="i18n:ENGINE.components.gizmo.enter_collider_edit"></ui-label>
                </ui-button>
            </div>
        `,
        close() {
            const data = panelDataMap.get(this);
            if (data) {
                this.stopEdit();
                Editor.Message.removeBroadcastListener('scene:gizmo-tool-changed', data.onGizmoToolChanged);
                Editor.Message.removeBroadcastListener('scene:editing-gizmos-changed', data.onEditingGizmosChanged);

            }
        },
    });
} 