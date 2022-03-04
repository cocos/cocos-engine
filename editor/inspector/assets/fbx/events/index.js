'use strict';

const { join } = require('path');
module.paths.push(join(Editor.App.path, 'node_modules'));
const Vue = require('vue/dist/vue.min.js');

const events = require('./events');
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
        this.eventEditorVm.events = this.eventVm.events;
        this.eventEditorVm.frame = eventInfo.frame;
        this.eventEditorVm.RealFrame = Math.round(eventInfo && eventInfo.frame * this.curEditClipInfo.fps || 0);
        this.eventEditorVm.refresh();
        this.eventEditorVm.show = true;
    });
    this.eventVm.$on('del', (eventInfo) => {
        if (this.checkDisabledEditEvent()) {
            return;
        }
        this.events.delEvent.call(this, eventInfo.frame);
    });
};

exports.update = function(eventInfo) {
    this.eventVm.events = eventInfo;
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

exports.addNewEvent = function(time) {
    const newInfo = {
        frame: time,
        func: '',
        params: [],
    };
    const userData = this.curEditClipInfo.userData;
    if (!userData.events) {
        userData.events = [newInfo];
    } else {
        userData.events.push(newInfo);
        userData.events.sort((a, b) => a.frame - b.frame);
    }
    this.events.eventsMap[this.curEditClipInfo.clipUUID] = userData.events;
    this.updateEventInfo();
    this.dispatch('change');
};

exports.delEvent = function(time) {
    const userData = this.curEditClipInfo.userData;
    userData.events = userData.events.filter((item) => item.frame !== time);
    this.events.eventsMap[this.curEditClipInfo.clipUUID] = userData.events;
    this.updateEventInfo();
    this.dispatch('change');
};

exports.updateEventInfo = function(time, eventInfos) {
    const userData = this.curEditClipInfo.userData;
    const newEvents = userData.events.filter((item) => item.frame !== time);
    newEvents.push(...eventInfos);
    userData.events = newEvents;
    this.events.eventsMap[this.curEditClipInfo.clipUUID] = newEvents;
    this.updateEventInfo();
    this.dispatch('update');
};
