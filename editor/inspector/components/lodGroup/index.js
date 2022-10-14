'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

const lodItem = require('./components/lod-item/lod-item');
const multiLodGroup = require('./components/multi-lod-group/multi-lod-group');

module.paths.push(join(Editor.App.path, 'node_modules'));
const Vue = require('vue/dist/vue.min.js');
let vm;

exports.style = readFileSync(join(__dirname, './index.css'), 'utf8');

exports.template = '<div id="app"></div>';

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
        template: readFileSync(join(__dirname, './index.html'), 'utf8'),
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
                that.dump.value.size.value = event.target.value;
                that.updateDump(that.dump.value.size);
            },
            updateDump(dump) {
                const that = this;
                that.$refs['lod-dump'].dump = dump;
                that.$refs['lod-dump'].dispatch('change-dump');
            },
            recalculateBounds() {
                const that = this;
                Editor.Message.send('scene', 'execute-component-method', {
                    uuid: that.dump.value.uuid && that.dump.value.uuid.value,
                    name: 'recalculateBounds',
                    args: [],
                });
            },
            resetObjectSize() {
                const that = this;
                Editor.Message.send('scene', 'execute-component-method', {
                    uuid: that.dump.value.uuid && that.dump.value.uuid.value,
                    name: 'resetObjectSize',
                    args: [],
                });
            },
            updateLODs(operator, index) {
                const that = this;
                const LODs = that.dump.value.LODs.value;
                if (operator === 'insert') {
                    if (LODs.length >= 8) {
                        console.warn('Maximum 8 LOD, Can\'t add more LOD');
                        return;
                    }
                    const lodItemData = Object.assign({}, that.dump.value.LODs.elementTypeData);
                    const preValue = LODs[index].value.screenRelativeTransitionHeight.value;
                    const nextValue = LODs[index + 1] ? LODs[index + 1].value.screenRelativeTransitionHeight.value : 0;
                    lodItemData.value.screenRelativeTransitionHeight.value = (preValue + nextValue) / 2;
                    LODs.splice(index + 1, 0, lodItemData);
                } else if (operator === 'delete') {
                    if (LODs.length === 1) {
                        console.warn('At least one LOD, Can\'t delete any more');
                        return;
                    }
                    LODs.splice(index, 1);
                }
                that.updateDump(that.dump.value.LODs);
            },
            calculateRange(range, index) {
                const that = this;
                const LODs = that.dump.value.LODs.value;
                if (range === 'min') {
                    return LODs[index + 1] ? LODs[index + 1].value.screenRelativeTransitionHeight.value * 100 : 0;
                } else if (range === 'max') {
                    return LODs[index - 1] ? LODs[index - 1].value.screenRelativeTransitionHeight.value * 100 : 100;
                }
                return null;
            },
        },
    });
};

exports.close = function() {
    vm = null;
};
