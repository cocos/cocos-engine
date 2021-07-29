'use strict';

exports.template = `
<div class="events" :style="'transform: translateX(' + offset + 'px)'">
    <template
        v-if="events"
        v-for="(info, index) in events"
    >
        <ui-icon value="event"
            :style="queryKeyStyle(info.x)"
            :active="selectInfo.frames.includes(info.frame)"
            :index="index"
            name="event"
            @mousedown="onMouseDown($event, info)"
            @mousemove="onMouseMove($event, info)"
            @click.right="onPopMenu($event, info)"
            @dblclick="openEventEditor(info)"
        ></ui-icon>
    </template>
    <template
        v-if="selectEvent"
        v-for="(info, index) in selectEvent"
    >
        <ui-icon value="event" class="preview" color="true"
            name="event"
            :style="queryKeyStyle(info.x)"
        ></ui-icon>
    </template>
</div>
`;

exports.data = {
    events: [],
    offset: 0,
    selectEvent: [],
    eventEditorInfo: {
        frame: 0,
        events: [{
            functionName: '',
            parameters: [],
            frame: 0,
        }],
    },
    selectInfo: {
        frames: [],
    },
};

exports.methods = {
    display(x) {
        return x >= 0;
    },

    onPopMenu(event, eventInfo) {
        const that = this;
        const menu = [{
            label: Editor.I18n.t(`animator.event.edit`),
            click() {
                that.openEventEditor(eventInfo);
            },
        }, {
            label: Editor.I18n.t(`animator.event.delete`),
            click() {
                that.$emit('del', eventInfo);
            },
            accelerator: 'Delete',
        },
        ];
        Editor.Menu.popup({
            x: event.pageX,
            y: event.pageY,
            menu,
        });
    },

    onMouseMove(event, info) {

    },

    onMouseDown(event, info) {
        const that = this;
        event.stopPropagation();
        const data = JSON.parse(JSON.stringify(info));
        let selectIndex = that.selectInfo && that.selectInfo.frames.indexOf(info.frame);
        if (typeof selectIndex !== 'number' || selectIndex === -1) {
            that.selectInfo = {
                startX: event.x,
                data: [data],
                offset: 0,
                offsetFrame: 0,
                frames: [info.frame],
            };
        } else {
            that.selectInfo.startX = event.x;
        }
    },

    openEventEditor(eventInfo) {
        // HACK 目前的事件帧会有重复关键帧重叠的情况
        this.selectInfo.frames = [eventInfo.frame];
        this.$emit('edit', eventInfo);
    },

    queryKeyStyle(x) {
        return `transform: translateX(${x | 0 + 3}px);`;
    },
};

exports.mounted = function() {

};

// exports.
