'use strict';

exports.template = `
<div class="events" :style="'transform: translateX(' + offset + 'px)'">
    <template
        v-if="events"
        v-for="(info, index) in events"
    >
        <ui-icon value="event"
            :style="queryKeyStyle(info.x)"
            :index="index"
            name="event"
            @mousedown="onMouseDown($event, info)"
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
}

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

    onMouseDown(event, info) {
        const that = this;
        event.stopPropagation();
        let dragInfo = {};
        const data = JSON.parse(JSON.stringify(info));
        let selectIndex = that.selectInfo && that.selectInfo.frames.indexOf(info.frame);
        if (typeof selectIndex !== 'number' || selectIndex === -1) {
            dragInfo = {
                startX: event.x,
                data: [data],
                offset: 0,
                offsetFrame: 0,
                frames: [info.frame],
            };
        } else {
            that.selectInfo.startX = event.x;
            dragInfo = that.selectInfo;
        }
        // animationEditor.startDragEvent(dragInfo, hasCtrl);
    },

    openEventEditor(eventInfo) {
        this.$emit('edit', eventInfo);
    },

    queryKeyStyle(x) {
        return `transform: translateX(${x | 0 + 3}px);`;
    },
};
