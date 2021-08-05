'use strict';
const { join } = require('path');
module.paths.push(join(Editor.App.path, 'node_modules'));

const eventItem = require('./event-item');
const defaultFunc = [
    {
        func: '',
        params: [],
    },
];

exports.template = `<section v-if="show" id="event-editor" @mousedown.stop>
    <header class="flex">
        <ui-label class="f1" :value="'Animation Event (frame: ' + RealFrame + ' )'"></ui-label>
        <ui-icon value="close" @click="show = false"></ui-icon>
    </header>
    <div class="functions">
        <div class="tools flex">
            <ui-input class="f1" placeholder="i18n:animator.event.func_placeholder"
                tooltip="i18n:animator.event.func_placeholder"
                :value="newFuncName"
                @change.stop="newFuncName = $event.target.value"
                @keydown.enter="addFunc"
            ></ui-input>
            <ui-icon value="add"
                tooltip="i18n:animator.event.add_func"
                @mousedown="addFunc"
            ></ui-icon>
        </div>
        <div v-if="value.length">
            <event-item class="func"
                v-for="(event, index) in value"
                :event="event"
                :index="index"
                :key="index"
                @update="updateValue"
            ></event-item>
        </div>
        <div v-if="!value.length" class="empty">
            <ui-label value="i18n:animator.event.empty"></ui-label>
        </div>
    </div>
    <div class="toast" v-if="toast">
        {{toast}}
    </div>
</section>
`;

exports.data = function() {
    return {
        toast: '',
        toastTask: [],
        newFuncName: '',
        value: [],
        dirty: false,
        debounceSave: null,
        // time value
        frame: 0,
        RealFrame: 0,
        show: false,
    };
};

exports.components = {
    'event-item': eventItem,
};

exports.methods = {
    t(key, type = 'event.') {
        return Editor.I18n.t(`animator.${type}${key}`);
    },

    addFunc() {
        const that = this;
        if (!that.newFuncName) {
            that.showToast(Editor.I18n.t('animator.event.enter_func_name'));
            return;
        }
        that.value.push({
            func: that.newFuncName,
            params: [],
            frame: that.frame,
        });
        that.dirty = true;
        that.debounceSave();
    },

    updateValue(eventInfo, index) {
        const that = this;
        if (!eventInfo) {
            that.value.splice(index, 1);
        } else {
            that.value[index] = eventInfo;
        }
        that.dirty = true;
        that.debounceSave();
    },

    showToast(msg, time = 800) {
        const that = this;
        if (that.toast) {
            that.toastTask.push(msg);
            return;
        }
        that.toast = msg;
        setTimeout(() => {
            that.toast = null;
            if (that.toastTask.length > 0) {
                that.showToast(that.toastTask.shift());
            }
        }, time);
    },

    async saveData() {
        const that = this;
        that.$emit('update', that.frame, that.value);
        that.dirty = false;
    },

    refresh() {
        const that = this;
        let data = that.events.filter((item) => {
            return item.frame === that.frame;
        });
        if (data.length < 1) {
            that.value = [];
            return;
        }
        that.value = JSON.parse(JSON.stringify(data));
        that.newFuncName = '';
    },
};

exports.mounted = function() {
    // @ts-ignore
    const that = this;
    that.debounceSave = require('lodash').debounce(that.saveData, 300);
};
