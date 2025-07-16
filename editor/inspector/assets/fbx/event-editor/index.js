'use strict';

const { join } = require('path');
module.paths.push(join(Editor.App.path, 'node_modules'));
const Vue = require('vue/dist/vue.min.js');

const eventEditor = require('./editor');
exports.ready = function() {
    this.eventEditorVm = new Vue({
        el: this.$.eventEditor,
        template: eventEditor.template,
        data: eventEditor.data,
        methods: eventEditor.methods,
        components: eventEditor.components,
        mounted: eventEditor.mounted,
    });
    this.eventEditorVm.$on('update', (eventInfos) => {
        this.events.updateEventInfo.call(this, eventInfos);
    });

    this.eventEditorVm.$on('addFunc', (frame, newFuncName) => {
        this.events.addEvent.call(this, frame, newFuncName);
    });

    this.eventEditorVm.$on('delFunc', (frame, eventInfo) => {
        this.events.delEvent.call(this, frame, eventInfo);
    });
    this.eventEditorVm.$on('hide', (frame, eventInfo) => {
        this.events.unselect.call(this, frame, eventInfo);
    });
};

exports.update = function(editInfo) {
    this.eventEditorVm.events = editInfo && editInfo.events || [];
    this.eventEditorVm.frame = editInfo && editInfo.frame || 0;
};
