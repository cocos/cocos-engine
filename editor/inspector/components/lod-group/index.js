'use strict';

const { join } = require('path');

const lodItem = require('./lod-item');
const multiLodGroup = require('./multi-lod-group');
const { trackEventWithTimer } = require('../../utils/metrics');
const { getMessageProtocolScene } = require('../../utils/prop');

module.paths.push(join(Editor.App.path, 'node_modules'));
const Vue = require('vue/dist/vue.min.js');
let vm;

exports.style = `
.lod-group {
    position: relative;
    width: 100%;
    margin: 6px 0;
}

.lod-group > .generate-lods {
    display: flex;
    justify-content: center;
    margin-top: 12px;
}

.lod-group ui-prop,
.lod-group .lod-item .mesh-renderers {
    margin-bottom: 6px;
}

.lod-group .object-size-content,
.lod-group .lod-item .screen-size-content,
.multi-lod-group .object-size-content {
    display: flex;
}

.lod-group .object-size-content > ui-num-input,
.multi-lod-group .object-size-content > ui-num-input,
.lod-item .screen-size-content > ui-num-input {
    flex: 1;
    margin-right: 4px;
    min-width: 70px;
}

.lod-group .lod-item .screen-size-content {
    flex-direction: column;
}

.lod-item .screen-size-content > ui-num-input {
    margin-bottom: 4px;
}

.lod-item .header {
    flex: 1;
    display: flex;
    align-items: center;
}

.lod-item .header:hover > .right > .operator {
    display: flex;
}

.lod-item .header > .left {
    display: flex;
    align-items: center;
    margin-right: 4px;
}

.lod-item .header > .right {
    flex: 1;
    text-align: right;
    display: flex;
}

.lod-item .header > .right > .info {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 0;
    justify-content: flex-end;
    align-items: center;
}

.header > .right > .operator {
    display: none;
    margin-left: 8px;
    background: var(--color-default-fill);
    border-color: var(--color-default-border);
    border-radius: calc(var(--size-normal-radius) * 1px);
}

.header .operator > ui-icon {
    padding: 0 5px;
    transition: color 0.15s;
    color: var(--color-default-contrast-emphasis);
    position: relative;
}

.header .operator > ui-icon + ui-icon {
    margin-left: 1px;
}

.header .operator > ui-icon + ui-icon::after {
    content: '';
    display: block;
    width: 1px;
    height: 12px;
    position: absolute;
    top: 6px;
    left: -1px;
    background: var(--color-normal-fill-normal);
}

.header .operator > ui-icon:hover {
    background: var(--color-hover-fill-weaker);
    color: var(--color-focus-contrast-emphasis);
}

.lod-group .object-size-content > ui-button > ui-label,
.multi-lod-group .object-size-content > ui-button > ui-label,
.lod-item .screen-size-content > ui-button > ui-label {
    white-space: nowrap;
}

.lod-item .mesh-renderers > .mesh {
    margin-top: 12px;
}

.lod-item .mesh-renderers > footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
}

.lod-item .mesh-renderers > footer > ui-button + ui-button {
    margin-left: 4px;
}

.lod-item .mesh {
    display: flex;
    position: relative;
    user-select: none;
}

.lod-item .mesh > .component {
    flex: 2;
}

.lod-item .mesh > .label {
    flex: 1;
    box-sizing: border-box;
    white-space: nowrap;
    user-select: text;
    overflow: hidden;
    text-align: right;
}
`;

exports.template = `
<div id="app">
    <div class="lod-group" v-if="!multi">
        <div>
            <ui-prop>
                <ui-button slot="content" @confirm="recalculateBounds">
                    <ui-label value="Recalculate Bounds"></ui-label>
                </ui-button>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="Object Size"></ui-label>
                <div class="object-size-content" slot="content">
                    <ui-num-input min="0" step="0.01"
                        :value="dump.value && dump.value.objectSize && dump.value.objectSize.value"
                        @confirm="onObjectSizeConfirm($event)"
                    >
                    </ui-num-input>
                    <!-- <ui-button @confirm="resetObjectSize">
                        <ui-label value="Reset Object Size"></ui-label>
                    </ui-button> -->
                </div>
            </ui-prop>
            <ui-prop ref="lod-dump" type="dump"></ui-prop>
            <template v-if="dump.value">
                <lod-item class="lod-item"
                    v-for="(data, index) in dump.value.LODs.value"
                    :dump="dump"
                    :index="index"
                    :key="index"
                    @update-lods="updateLODs"
                ></lod-item>
            </template>
        </div>   
    </div>
    <div class="multi-lod-group" v-else>
        <multi-lod-group
            :dump="dump"
        ></multi-lod-group>
    </div> 
</div>`;

exports.methods = {};

exports.$ = {
    app: '#app',
};

exports.update = function(dump) {
    vm.dump = dump;
    vm.multi = !!dump.value.LODs.values;
};

exports.ready = function() {
    vm = new Vue({
        el: this.$.app,
        components: {
            'lod-item': lodItem,
            'multi-lod-group': multiLodGroup,
        },
        data() {
            return {
                dump: {},
                multi: false,
            };
        },
        methods: {
            onObjectSizeConfirm(event) {
                const that = this;
                that.dump.value.objectSize.value = event.target.value;
                that.updateDump(that.dump.value.objectSize);
            },
            updateDump(dump) {
                const that = this;
                that.$refs['lod-dump'].dump = dump;
                that.$refs['lod-dump'].dispatch('change-dump');
                that.$refs['lod-dump'].dispatch('confirm-dump');
            },
            recalculateBounds() {
                const that = this;
                Editor.Message.send(getMessageProtocolScene(that.$el), 'execute-component-method', {
                    uuid: that.dump.value.uuid.value,
                    name: 'recalculateBounds',
                    args: [],
                });
                trackEventWithTimer('LOD', 'A100002');
            },
            resetObjectSize() {
                const that = this;
                Editor.Message.send(getMessageProtocolScene(that.$el), 'execute-component-method', {
                    uuid: that.dump.value.uuid.value,
                    name: 'resetObjectSize',
                    args: [],
                });
                trackEventWithTimer('LOD', 'A100003');
            },
            async updateLODs(operator, index) {
                const that = this;
                const LODs = that.dump.value.LODs.value;
                const uuid = that.dump.value.uuid.value;
                if (operator === 'insert') {
                    // insert after
                    if (LODs.length >= 8) {
                        console.warn('Maximum 8 LOD, Can\'t add more LOD');
                        return;
                    }
                    const preValue = LODs[index].value.screenUsagePercentage.value;
                    const nextValue = LODs[index + 1] ? LODs[index + 1].value.screenUsagePercentage.value : 0;
                    const undoID = await Editor.Message.request(getMessageProtocolScene(that.$el), 'begin-recording', uuid);
                    await Editor.Message.request(getMessageProtocolScene(that.$el), 'lod-insert', uuid, index + 1, (preValue + nextValue) / 2, null);
                    await Editor.Message.request(getMessageProtocolScene(that.$el), 'end-recording', undoID);
                    trackEventWithTimer('LOD', 'A100005');
                } else if (operator === 'delete') {
                    if (LODs.length === 1) {
                        console.warn('At least one LOD, Can\'t delete any more');
                        return;
                    }
                    const undoID = await Editor.Message.request(getMessageProtocolScene(that.$el), 'begin-recording', uuid);
                    await Editor.Message.request(getMessageProtocolScene(that.$el), 'lod-erase', uuid, index);
                    await Editor.Message.request(getMessageProtocolScene(that.$el), 'end-recording', undoID);
                    trackEventWithTimer('LOD', 'A100006');
                }
            },
        },
    });
};

exports.close = function() {
    vm = null;
};
