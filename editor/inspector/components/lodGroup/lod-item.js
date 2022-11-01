'use strict';

exports.template = `
<ui-section :cache-expand="cacheExpandId">
    <header class="header" slot="header">
        <div class="left">
            <span>LOD {{ index }}</span>
        </div>
        <div class="right">
            <span> {{ totalTriangles }} Triangles - </span>
            <span>{{ data.value.renderers.value.length }} Sub Mesh(es)</span>
            <div class="operator">
                <ui-icon value="add" @click.stop="updateLODs('insert')" tooltip="insert after this LOD"></ui-icon>
                <ui-icon value="reduce" @click.stop="updateLODs('delete')" tooltip="delete this LOD"></ui-icon>
            </div>
        </div>
    </header>

    <div class="content">
        <ui-prop>
            <ui-label slot="label" value="Screen Size (%)"></ui-label>
            <div class="screen-size-content" slot="content">
                <ui-num-input
                    :value="data.value.screenUsagePercentage.value * 100"
                    :min="min"
                    :max="max"
                    @confirm="onScreenSizeConfirm($event)">
                </ui-num-input>
                <ui-button @confirm="applyCameraSize">Apply Current Camera Size</ui-button>
            </div>
        </ui-prop>

        <ui-prop ref="lod-item-dump" type="dump"></ui-prop>
        <ui-section whole class="mesh-list config" header="Mesh List">
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

exports.props = ['data', 'index', 'min', 'max', 'lodGroupId'];

exports.data = function() {
    return {
        totalTriangles: 0,
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
};

exports.computed = {
    cacheExpandId() {
        const that = this;
        return `${that.lodGroupId}-lod-${that.index}`;
    },
};

exports.methods = {
    onScreenSizeConfirm(event) {
        const that = this;
        that.data.value.screenUsagePercentage.value = event.target.value / 100;
        that.updateDump(that.data.value.screenUsagePercentage);
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
        // emit method is recommended to all lowercase, camel case may be automatically converted to lowercase resulting in failure to match
        that.$emit('update-lods', operator, that.index);
    },
    applyCameraSize() {
        const that = this;
        Editor.Message.send('scene', 'lod-apply-current-camera-size', that.lodGroupId, that.index);
    },
    handleTriangleLabel(meshIndex) {
        const that = this;
        return `${ that.data.value.triangleCount.value[meshIndex] ? that.data.value.triangleCount.value[meshIndex].value : 0 } Triangles`;
    },
};
