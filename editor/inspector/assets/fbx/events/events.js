'use strict';

exports.template = /* html */`
<div class="events" :style="'transform: translateX(' + offset + 'px)'">
    <template
        v-if="events"
        v-for="(event, index) in events"
    >
        <ui-icon value="event"
            :style="queryKeyStyle(event.x)"
            :active="frame===event.info.frame"
            :index="index"
            name="event"
            @mousedown.left="onMouseDown($event, event)"
            @click.right="onPopMenu($event, event.info)"
            @dblclick="openEventEditor(event.info)"
        ></ui-icon>
    </template>
</div>
`;

exports.data = {
    events: [],
    offset: 0,
    frame: -1,
};

exports.methods = {
    display(x) {
        return x >= 0;
    },

    onPopMenu(event, eventInfo) {
        const that = this;
        const menu = [{
            label: Editor.I18n.t(`animator.event.delete`),
            click() {
                that.$emit('del', eventInfo);
            },
        }];
        Editor.Menu.popup({
            menu,
        });
    },

    onMouseDown(event, item) {
        const that = this;
        event.stopPropagation();
        this.frame = item.info.frame;

        const clientX = event.clientX;
        const startX = item.x;
        function mousemove(event) {
            const timelineX = startX + (event.clientX - clientX);
            that.$emit('move', item, timelineX);
        }

        function mouseup() {
            that.$emit('moveEnd', item);
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        }
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    },

    openEventEditor(eventInfo) {
        // 目前的事件帧会有重复关键帧重叠的情况
        this.frame = eventInfo.frame;
        this.$emit('edit', eventInfo);
    },

    queryKeyStyle(x) {
        return `transform: translateX(${x || 0}px);`;
    },

    refresh(eventInfos) {
        this.events = eventInfos;
        if (!eventInfos.some((item) => item.info.frame === this.frame)) {
            this.unselect();
        }
    },

    unselect() {
        this.frame = -1;
    },
};

