'use strict';
const { join } = require('path');
module.paths.push(join(Editor.App.path, 'node_modules'));

const eventItem = require('./event-item');

exports.template = `<section v-if="show" id="event-editor" @mousedown.stop>
    <header class="flex">
        <ui-label class="title" :value="'Current Animation Frame: ' + RealFrame"></ui-label>
        <ui-icon value="close" @click="hide" tooltip="Close"></ui-icon>
    </header>
    <div class="functions">
        <div class="tools flex">
            <ui-input class="f1" placeholder="i18n:animator.event.func_placeholder"
                tooltip="i18n:animator.event.func_placeholder"
                :value="newFuncName"
                @change.stop="newFuncName = $event.target.value.trim()"
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
                @delete="deleteValue"
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
        frame: -1,
        RealFrame: -1,
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
        that.$emit('addFunc', that.frame, that.newFuncName);
        setTimeout(() => {
            that.newFuncName = '';
        });
    },

    updateValue(eventInfo, index) {
        const that = this;
        that.value[index] = eventInfo;
        that.dirty = true;
        that.debounceSave();
    },

    deleteValue(index) {
        const that = this;
        const eventInfo = that.value[index];
        if (eventInfo) {
            that.$emit('delFunc', eventInfo.frame, eventInfo);
        }
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

    saveData() {
        const that = this;
        that.$emit('update', that.value);
        that.dirty = false;
    },

    refresh(events) {
        const that = this;
        const infos = [];

        if (Array.isArray(events)) {
            if (!events.length) {
                this.frame = -1;
            }

            events.forEach((item) => {
                if (item.info.frame === that.frame) {
                    infos.push(item.info);
                }
            });
        }

        that.value = infos;
        that.show = !!infos.length;

    },
    hide() {
        this.$emit('hide');
    },
    unselect() {
        this.show = false;
    },
};

exports.mounted = function() {
    // @ts-ignore
    const that = this;
    that.debounceSave = require('lodash').debounce(that.saveData, 300);
};
