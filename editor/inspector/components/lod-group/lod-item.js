'use strict';

const { trackEventWithTimer } = require('../../utils/metrics');
const { getMessageProtocolScene } = require('../../utils/prop');

exports.template = `
<ui-section :cache-expand="cacheExpandId">
    <header class="header" slot="header">
        <div class="left">
            <span>LOD {{ index }}</span>
        </div>
        <div class="right">
            <div class="info">
                <span> {{ totalTriangles }} Triangles - </span>
                <span>{{ data.value.renderers.value.length }} Sub Mesh(es)</span>
            </div>
            <div class="operator">
                <ui-icon value="add" @click.stop="updateLODs('insert')" tooltip="insert after this LOD"></ui-icon>
                <ui-icon value="reduce" @click.stop="updateLODs('delete')" tooltip="delete this LOD"></ui-icon>
            </div>
        </div>
    </header>

    <div class="content">
        <ui-prop>
            <ui-label slot="label" value="Screen Ratio (%)"></ui-label>
            <div class="screen-size-content" slot="content">
                <ui-num-input
                    :ref="screenUsagePercentageRef"
                    :min="minScreenUsagePercentage"
                    :max="maxScreenUsagePercentage"
                    :value="Editor.Utils.Math.multi(data.value.screenUsagePercentage.value, 100)"
                    @confirm="onScreenSizeConfirm($event)">
                </ui-num-input>
                <ui-button @confirm="applyCameraSize" tooltip="i18n:ENGINE.components.lod.applyCameraSizeTip">
                    <ui-label value="Apply Current Screen Ratio"></ui-label>
                </ui-button>
            </div>
        </ui-prop>

        <ui-prop ref="lod-item-dump" type="dump"></ui-prop>
        <ui-section whole class="mesh-renderers config" header="Mesh Renderers">
            <template v-for="(mesh, meshIndex) in data.value.renderers.value">
                <div class="mesh"
                    :key="meshIndex"
                >
                    <ui-component class="component" droppable="cc.MeshRenderer" placeholder="cc.MeshRenderer"
                        :value="mesh.value.uuid"
                        @change="onMeshConfirm($event, meshIndex)">
                    </ui-component>
                    <ui-label class="label"
                        :value="handleTriangleLabel(meshIndex)"
                    ></ui-label>
                </div>
            </template>

            <footer>
                <ui-button @confirm="updateRenderers('insert')">
                    <ui-icon value="add"></ui-icon>
                </ui-button>
                <ui-button @confirm="updateRenderers('delete')">
                    <ui-icon value="reduce"></ui-icon>
                </ui-button>
            </footer>
        </ui-section>
    </div>
</ui-section>
`;

exports.props = ['dump', 'index'];

exports.data = function() {
    const that = this;
    return {
        totalTriangles: 0,
        data: that.dump.value.LODs.value[that.index],
        minScreenUsagePercentage: null,
        maxScreenUsagePercentage: null,
        enableUpdateScreenUsagePercentage: false,
    };
};

exports.watch = {
    'data.value.triangleCount': {
        immediate: true,
        handler(triangleCount) {
            const that = this;
            const res = triangleCount.value.reduce((sum, item) => {
                return sum += item.value;
            }, 0);
            that.totalTriangles = res;
        },
    },
    dump:{
        immediate: true,
        deep: true,
        handler(obj) {
            const that = this;
            that.enableUpdateScreenUsagePercentage = false;
            if (obj.value.LODs.value[that.index].value.screenUsagePercentage.value) {
                const LODs = obj.value.LODs.value;
                const min = LODs[that.index + 1] ? LODs[that.index + 1].value.screenUsagePercentage.value : 0;
                const max = LODs[that.index - 1] ? LODs[that.index - 1].value.screenUsagePercentage.value : null;
                // The minimum value is 0, and there is no restriction on the maximum value
                that.minScreenUsagePercentage = Editor.Utils.Math.multi(min, 100);
                that.maxScreenUsagePercentage = max ? Editor.Utils.Math.multi(max, 100) : null;
            }
            that.$nextTick(() => {
                that.data = obj.value.LODs.value[that.index];
                that.enableUpdateScreenUsagePercentage = true;
            });
        },
    },
};

exports.computed = {
    cacheExpandId() {
        const that = this;
        return `${that.dump.value.uuid.value}-lod-${that.index}`;
    },
    screenUsagePercentageRef() {
        const that = this;
        return `screenUsagePercentage-${that.index}`;
    },
};

exports.methods = {
    onScreenSizeConfirm(event) {
        const that = this;
        if (!that.enableUpdateScreenUsagePercentage) {
            return;
        }
        that.data.value.screenUsagePercentage.value = Editor.Utils.Math.divide(event.target.value, 100);
        that.updateDump(that.data.value.screenUsagePercentage);
        trackEventWithTimer('LOD', 'A100009');
    },
    onMeshConfirm(event, meshIndex) {
        const that = this;
        that.data.value.renderers.value[meshIndex].value.uuid = event.target.value;
        that.updateDump(that.data.value.renderers);
    },
    updateRenderers(operator) {
        const that = this;
        if (operator === 'insert') {
            that.data.value.renderers.value.push(that.data.value.renderers.elementTypeData);
            trackEventWithTimer('LOD', 'A100007');
        } else if (operator === 'delete') {
            that.data.value.renderers.value.pop();
            trackEventWithTimer('LOD', 'A100008');
        }
        that.updateDump(that.data.value.renderers);
    },
    updateDump(dump) {
        const that = this;
        that.$refs['lod-item-dump'].dump = dump;
        that.$refs['lod-item-dump'].dispatch('change-dump');
        that.$refs['lod-item-dump'].dispatch('confirm-dump');
    },
    updateLODs(operator) {
        const that = this;
        // emit method is recommended to all lowercase, camel case may be automatically converted to lowercase resulting in failure to match
        that.$emit('update-lods', operator, that.index);
    },
    async applyCameraSize() {
        const that = this;
        let size = await Editor.Message.request(getMessageProtocolScene(that.$el), 'lod-apply-current-camera-size', that.dump.value.uuid.value);
        if (that.$refs[that.screenUsagePercentageRef]) {
            const min = Editor.Utils.Math.divide(that.$refs[that.screenUsagePercentageRef].min, 100) || 0;
            let max = null;
            if (that.$refs[that.screenUsagePercentageRef].max && that.$refs[that.screenUsagePercentageRef].max !== Infinity) {
                max = Editor.Utils.Math.divide(that.$refs[that.screenUsagePercentageRef].max, 100);
            }

            if (size < min) {
                size = min;
                console.log(Editor.I18n.t('ENGINE.components.lod.applyCameraSizeLessThanMinimum'));
            } else if (max && size > max) {
                size = max;
                console.log(Editor.I18n.t('ENGINE.components.lod.applyCameraSizeGreaterThanMaximum'));
            }
        }
        that.data.value.screenUsagePercentage.value = size;
        that.updateDump(that.data.value.screenUsagePercentage);
        trackEventWithTimer('LOD', 'A100004');
    },
    handleTriangleLabel(meshIndex) {
        const that = this;
        return `${ that.data.value.triangleCount.value[meshIndex] ? that.data.value.triangleCount.value[meshIndex].value : 0 } Triangles`;
    },
};
