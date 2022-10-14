'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

exports.template = readFileSync(join(__dirname, './multi-lod-group.html'), 'utf8');

exports.props = ['dump'];

exports.watch = {
    dump: {
        immediate: true,
        deep: true,
        handler() {
            const that = this;
            that.refresh();
        },
    },
};

exports.data = function() {
    return {
        multiLen: 0,
        multiObjectSizeInvalid: false,
        multiLODs: [],
    };
};

exports.methods = {
    refresh() {
        const that = this;
        if (that.dump.value) {
            that.multiObjectSizeInvalid = that.dump.value.size.values.some((val) => val !== that.dump.value.size.values[0]);
            const multiLodGroups = that.dump.value.LODs.values;
            that.multiLen = multiLodGroups.reduce((pre, next) => {
                return pre.length < next.length ? pre.length : next.length;
            });
            const multiLods = [];
            for (let i = 0; i < that.multiLen; i++) {
                let multiScreenSizeInvalid = false;
                for (let j = 1; j < multiLodGroups.length; j++) {
                    if (multiLodGroups[j][i].value.screenRelativeTransitionHeight.value !== multiLodGroups[0][i].value.screenRelativeTransitionHeight.value) {
                        multiScreenSizeInvalid = true;
                        break;
                    }
                }
                multiLods[i] = multiScreenSizeInvalid ? 'invalid' : multiLodGroups[0][i].value.screenRelativeTransitionHeight.value;
            }
            that.multiLODs = multiLods;
        }
    },
    onMultiObjectSizeConfirm(event) {
        const that = this;
        that.dump.value.size.values = that.dump.value.size.values.fill(event.target.value);
        that.multiObjectSizeInvalid = false;
        that.updateDump(that.dump.value.size);
    },
    onMultiScreenSizeConfirm(event, index) {
        const that = this;
        that.dump.value.LODs.values.forEach((lod) => {
            lod[index].value.screenRelativeTransitionHeight.value = event.target.value / 100;
        });
        that.updateDump(that.dump.value.LODs);
    },
    resetMultiObjectSize() {
        const that = this;
        that.dump.value.uuid.values.forEach((uuid) => {
            Editor.Message.send('scene', 'execute-component-method', {
                uuid: uuid,
                name: 'resetObjectSize',
                args: [],
            });
        });
    },
    updateDump(dump) {
        const that = this;
        that.$refs['multi-lod-dump'].dump = dump;
        that.$refs['multi-lod-dump'].dispatch('change-dump');
    },
    calculateMultiRange(range, index) {
        const that = this;
        if (range === 'min') {
            let min = that.dump.value.LODs.values[0][index + 1] ? that.dump.value.LODs.values[0][index + 1].value.screenRelativeTransitionHeight.value : 0;
            for (let i = 1; i < that.dump.value.LODs.values.length; i++) {
                const multiLods = that.dump.value.LODs.values[i];
                if (multiLods[index + 1] && multiLods[index + 1].value.screenRelativeTransitionHeight.value > min) {
                    min = multiLods[index + 1].value.screenRelativeTransitionHeight.value;
                }
            }
            return min * 100;
        } else if (range === 'max') {
            let max = that.dump.value.LODs.values[0][index - 1] ? that.dump.value.LODs.values[0][index - 1].value.screenRelativeTransitionHeight.value : 1;
            for (let i = 1; i < that.dump.value.LODs.values.length; i++) {
                const multiLods = that.dump.value.LODs.values[i];
                if (multiLods[index - 1] && multiLods[index - 1].value.screenRelativeTransitionHeight.value < max) {
                    max = multiLods[index - 1].value.screenRelativeTransitionHeight.value;
                }
            }
            return max * 100;
        }
        return null;
    },
};

exports.mounted = function() {
    const that = this;
};
