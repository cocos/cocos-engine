'use strict';

const { join } = require('path');
const events = require('./events');

module.paths.push(join(Editor.App.path, 'node_modules'));
const Vue = require('vue/dist/vue.min.js');

exports.ready = function() {
    this.eventVm = new Vue({
        el: this.$.events,
        template: events.template,
        data: events.data,
        methods: events.methods,
        components: events.components,
        mounted: events.mounted,
        beforeDestroy: events.beforeDestroy,
    });
    this.eventVm.$on('edit', (eventInfo) => {
        if (this.checkDisabledEditEvent()) {
            return;
        }
        this.eventEditorVm.frame = eventInfo.frame;
        this.eventEditorVm.RealFrame = Math.round(eventInfo && eventInfo.frame * this.curEditClipInfo.fps || 0);
        this.eventEditorVm.refresh(this.eventVm.events);
    });
    this.eventVm.$on('del', (eventInfo) => {
        if (this.checkDisabledEditEvent()) {
            return;
        }
        this.events.delEvent.call(this, eventInfo.frame);
    });

    this.eventVm.$on('move', (eventItem, timelineX) => {
        if (this.checkDisabledEditEvent()) {
            return;
        }
        this.events.moveEvent.call(this, eventItem, timelineX);
    });

    this.eventVm.$on('moveEnd', (eventItem) => {
        if (this.checkDisabledEditEvent()) {
            return;
        }
        this.eventVm.openEventEditor(eventItem.info);
        this.dispatch('snapshot');
    });
};

exports.update = function(eventInfos) {
    this.eventVm.refresh(eventInfos);
    this.eventEditorVm.refresh(eventInfos);
};

exports.apply = async function() {
    const clips = Object.keys(this.events.eventsMap);
    const meta = this.meta;
    for (let i = 0; i < clips.length; i++) {
        const uuid = clips[i];
        const metaData = meta.subMetas[uuid];
        if (metaData && metaData.userData) {
            const eventData = this.events.eventsMap[uuid];
            metaData.userData.events = eventData;
        }
    }
    this.events.eventsMap = {};
};

exports.addEvent = function(time, newFuncName = '') {
    const newInfo = {
        // 注意: frame 是时间
        frame: time,
        func: newFuncName,
        params: [],
    };

    const userData = this.curEditClipInfo.userData;
    if (!userData.events) {
        userData.events = [newInfo];
    } else {
        // 已经存在空记录
        if (!newFuncName && userData.events.some(event => event.frame === time && event.func === newFuncName)) {
            return;
        }

        let exist = false;
        for (const event of userData.events) {
            if (event.frame === time && event.func === '') {
                event.func = newFuncName;
                exist = true;
                break;
            }
        }

        if (!exist) {
            userData.events.push(newInfo);
            userData.events.sort((a, b) => a.frame - b.frame);
        }
    }

    this.updateEventInfo();
    this.dispatch('change');
    this.dispatch('snapshot');

    this.eventVm.openEventEditor(newInfo);
};

exports.delEvent = function(frame, info) {
    const userData = this.curEditClipInfo.userData;
    if (info) {
        userData.events = userData.events.filter((item) => item !== info);
    } else {
        // 删除多个
        userData.events = userData.events.filter((item) => item.frame !== frame);
    }

    this.updateEventInfo();
    this.dispatch('change');
    this.dispatch('snapshot');
};

exports.moveEvent = function(eventItem, timelineX) {
    const frame = Math.min(this.$.animationTime._config.max, Math.max(0, Math.round(this.$.animationTime.pixelToValue(timelineX))));

    eventItem.info.frame = frame / this.curEditClipInfo.fps;
    eventItem.x = this.$.animationTime.valueToPixel(frame);

    this.dispatch('change');
};

exports.unselect = function() {
    this.eventVm.unselect();
    this.eventEditorVm.unselect();
};

exports.updateEventInfo = function(eventInfos) {
    const userData = this.curEditClipInfo.userData;
    if (userData && userData.events && Array.isArray(eventInfos)) {
        eventInfos.forEach((eventInfo) => {
            if (!userData.events.includes(eventInfo)) {
                userData.events.push(eventInfo);
            }
        });
    }

    this.updateEventInfo();
    this.dispatch('change');
    this.dispatch('snapshot');
};
