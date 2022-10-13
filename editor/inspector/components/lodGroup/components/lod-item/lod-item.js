'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

exports.template = readFileSync(join(__dirname, './lod-item.html'), 'utf8');;

exports.props = ['data', 'index', 'min', 'max', 'lodGroupId'];

exports.data = function() {
    return {
        totalTriangles: 0,
    }
}

exports.watch = {
    'data.value.triangles': {
        immediate: true,
        handler(triangles) {
            const that = this;
            const res = triangles.value.reduce((sum, item) => {
                return sum += item.value;
            }, 0);
            that.totalTriangles = res;
        }
    },
}

exports.methods = {
    onScreenSizeConfirm(event) {
        const that = this;
        that.data.value.screenRelativeTransitionHeight.value = event.target.value / 100;
        that.updateDump(that.data.value.screenRelativeTransitionHeight);
    },
    onMeshConfirm(event, meshIndex) {
        const that = this;
        that.data.value.renderers.value[meshIndex].value.uuid = event.target.value;
        that.updateDump(that.data.value.renderers.value[meshIndex]);
    },
    updateRenderers(operator) {
        const that = this;
        if (operator === 'insert') {
            that.data.value.renderers.value.push(that.data.value.renderers.elementTypeData);
        } else if (operator === 'delete') {
            that.data.value.renderers.value.pop();
        }
        that.updateDump(that.data.value.renderers);
    },
    updateDump(dump) {
        const that = this;
        that.$refs['lod-item-dump'].dump = dump;
        that.$refs['lod-item-dump'].dispatch('change-dump');
    },
    updateLODs(operator) {
        const that = this;
        that.$emit('updateLODs', operator, that.index);
    },
    applyCameraSize() {
        const that = this;
        // TODO: 
    },
};

exports.mounted = function() {
    const that = this;
};
