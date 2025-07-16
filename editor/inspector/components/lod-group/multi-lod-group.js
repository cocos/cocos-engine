'use strict';

const { trackEventWithTimer } = require('../../utils/metrics');
const { getMessageProtocolScene } = require('../../utils/prop');

exports.template = `
<div>
    <ui-prop ref="multi-lod-dump" type="dump"></ui-prop>
    <ui-prop>
        <ui-label slot="label" value="Object Size"></ui-label>
        <div class="object-size-content" slot="content">
            <ui-num-input min="0" step="0.01"
                :invalid="multiObjectSizeInvalid"
                :value="multiObjectSizeInvalid && dump.value && dump.value.objectSize ? null : dump.value.objectSize.values[0]"
                @confirm="onMultiObjectSizeConfirm($event)"
            ></ui-num-input>
            <!-- <ui-button @confirm="resetMultiObjectSize">
                <ui-label value="Reset Object Size"></ui-label>
            </ui-button> -->
        </div>
    </ui-prop>
    <template v-for="(screenSize, index) in multiLODs">
        <ui-prop resize resize-group="screen-size-group"
            :key="index"
            :message="multiLODsErr[index]"
            :class="multiLODsErr[index] ? 'warn' : ''"
        >
            <ui-label slot="label"
                :value="handleMultiScreenSize(index)"
            ></ui-label>
            <ui-num-input slot="content"
                :invalid="screenSize === 'invalid'"
                :value="screenSize === 'invalid' ? 0 : Editor.Utils.Math.multi(screenSize, 100)"
                @confirm.stop="onMultiScreenSizeConfirm($event, index)"
                @change.stop
            ></ui-num-input>
        </ui-prop>
    </template>
</div>
`;

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
        multiLODsErr: [],
    };
};

exports.methods = {
    refresh() {
        const that = this;
        that.multiLODs = [];
        that.multiLODsErr = [];
        if (that.dump.value) {
            that.multiObjectSizeInvalid = that.dump.value.objectSize.values.some((val) => val !== that.dump.value.objectSize.values[0]);
            const multiLodGroups = that.dump.value.LODs.values;
            that.multiLen = multiLodGroups.reduce((pre, current) => {
                return pre < current.length ? pre : current.length;
            }, multiLodGroups[0].length);
            const multiLods = [];
            for (let i = 0; i < that.multiLen; i++) {
                let multiScreenSizeInvalid = false;
                for (let j = 1; j < multiLodGroups.length; j++) {
                    if (
                        !multiLodGroups[0][i] || !multiLodGroups[j][i] ||
                        multiLodGroups[j][i].value.screenUsagePercentage.value !== multiLodGroups[0][i].value.screenUsagePercentage.value
                    ) {
                        multiScreenSizeInvalid = true;
                        break;
                    }
                }
                multiLods[i] = multiScreenSizeInvalid ? 'invalid' : multiLodGroups[0][i].value.screenUsagePercentage.value;
            }
            that.multiLODs = multiLods;
        }
    },
    onMultiObjectSizeConfirm(event) {
        const that = this;
        that.dump.value.objectSize.values = that.dump.value.objectSize.values.fill(event.target.value);
        that.multiObjectSizeInvalid = false;
        that.updateDump(that.dump.value.objectSize);
    },
    onMultiScreenSizeConfirm(event, index) {
        const that = this;
        const multiLODs = that.dump.value.LODs.values;
        const value = Editor.Utils.Math.divide(event.target.value, 100);
        if (checkMultiScreenSize(multiLODs, value, index)) {
            multiLODs.forEach((lod) => {
                if (lod[index]) {
                    lod[index].value.screenUsagePercentage.value = value;
                }
            });
            that.updateDump(that.dump.value.LODs);
            trackEventWithTimer('LOD', 'A100011');
            that.$set(that.multiLODsErr, index, '');
        } else {
            that.$set(that.multiLODsErr, index, 'Input out of range, please check and manually modify the value');
        }
    },
    resetMultiObjectSize() {
        const that = this;
        that.dump.value.uuid.values.forEach((uuid) => {
            Editor.Message.send(getMessageProtocolScene(that.$el), 'execute-component-method', {
                uuid: uuid,
                name: 'resetObjectSize',
                args: [],
            });
        });
        trackEventWithTimer('LOD', 'A100010');
    },
    updateDump(dump) {
        const that = this;
        that.$refs['multi-lod-dump'].dump = dump;
        that.$refs['multi-lod-dump'].dispatch('change-dump');
        that.$refs['multi-lod-dump'].dispatch('confirm-dump');
    },
    handleMultiScreenSize(index) {
        return `LOD ${index} Transition (% Screen Ratio)`;
    },
};

function checkMultiScreenSize(multiLODs, value, index) {
    for (let i = 0; i < multiLODs.length; i++) {
        const multiLods = multiLODs[i];
        if (multiLods[index + 1] && multiLods[index + 1].value.screenUsagePercentage.value >= value) {
            return false;
        }
        if (multiLods[index - 1] && multiLods[index - 1].value.screenUsagePercentage.value <= value) {
            return false;
        }
    }
    return true;
}
