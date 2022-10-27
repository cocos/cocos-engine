'use strict';

const { join } = require('path');

const lodItem = require('./lod-item');
const multiLodGroup = require('./multi-lod-group');

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
.lod-group .lod-item .mesh-list {
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
    min-width: 44px;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 0;
    display: flex;
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

.lod-item .mesh-list > .mesh {
    margin-top: 12px;
}

.lod-item .mesh-list > footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
}

.lod-item .mesh-list > footer > ui-button + ui-button {
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
                <ui-button slot="content" @confirm="recalculateBounds">Recalculate Bounds</ui-button>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="Object Size"></ui-label>
                <div class="object-size-content" slot="content">
                    <ui-num-input min="0" step="0.01"
                        :value="dump.value && dump.value.objectSize && dump.value.objectSize.value"
                        @confirm="onObjectSizeConfirm($event)"
                    >
                    </ui-num-input>
                    <ui-button @confirm="resetObjectSize">Reset Object Size</ui-button>
                </div>
            </ui-prop>
            <ui-prop ref="lod-dump" type="dump"></ui-prop>
            <template v-if="dump.value">
                <lod-item class="lod-item"
                    v-for="(data, index) in dump.value.LODs.value"
                    :data="data"
                    :index="index"
                    :key="index"
                    :lod-group-id="dump.value.uuid.value"
                    :min="calculateRange('min', index)"
                    :max="calculateRange('max', index)"
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
            },
            recalculateBounds() {
                const that = this;
                Editor.Message.send('scene', 'execute-component-method', {
                    uuid: that.dump.value.uuid.value,
                    name: 'recalculateBounds',
                    args: [],
                });
            },
            resetObjectSize() {
                const that = this;
                Editor.Message.send('scene', 'execute-component-method', {
                    uuid: that.dump.value.uuid.value,
                    name: 'resetObjectSize',
                    args: [],
                });
            },
            updateLODs(operator, index) {
                const that = this;
                const LODs = that.dump.value.LODs.value;
                if (operator === 'insert') {
                    // insert after
                    if (LODs.length >= 8) {
                        console.warn('Maximum 8 LOD, Can\'t add more LOD');
                        return;
                    }
                    const preValue = LODs[index].value.screenUsagePercentage.value;
                    const nextValue = LODs[index + 1] ? LODs[index + 1].value.screenUsagePercentage.value : 0;
                    Editor.Message.request('scene', 'lod:insert-lod', that.dump.value.uuid.value, index + 1, (preValue + nextValue) / 2, null);
                } else if (operator === 'delete') {
                    if (LODs.length === 1) {
                        console.warn('At least one LOD, Can\'t delete any more');
                        return;
                    }
                    Editor.Message.request('scene', 'lod:delete-lod', that.dump.value.uuid.value, index);
                }
            },
            calculateRange(range, index) {
                const that = this;
                const LODs = that.dump.value.LODs.value;
                if (range === 'min') {
                    const min = LODs[index + 1] ? LODs[index + 1].value.screenUsagePercentage.value : 0;
                    // If value < min, set the value to min, avoid affecting other lod
                    if (LODs[index].value.screenUsagePercentage.value < min) {
                        LODs[index].value.screenUsagePercentage.value = min;
                        that.updateDump(LODs[index].value.screenUsagePercentage);
                    }
                    return min * 100;
                } else if (range === 'max') {
                    const max = LODs[index - 1] ? LODs[index - 1].value.screenUsagePercentage.values : 1;
                    // If value > max, set the value to max, avoid affecting other lod
                    if (LODs[index].value.screenUsagePercentage.value > max) {
                        LODs[index].value.screenUsagePercentage.value = max;
                        that.updateDump(LODs[index].value.screenUsagePercentage);
                    }
                    return max * 100;
                }
                return null;
            },
        },
    });
};

exports.close = function() {
    vm = null;
};
