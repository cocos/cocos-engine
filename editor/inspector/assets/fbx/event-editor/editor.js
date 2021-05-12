'use strict';

const eventItem = require('./event-item');
const defaultFunc = [
    {
        func: '',
        params: [],
    },
];

exports.template = `<section v-if="show" id="event-editor">
    <header class="flex">
        <ui-label class="f1" value="Animation Event"></ui-label>
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
        frame: 0,
        show: false,
    };
}

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
        const result = that.value.map((item) => {
           // TODO Animation events recorded in meta need to be unified https://github.com/cocos-creator/3d-tasks/issues/7416
            return {
                functionName: item.func,
                parameters: item.params,
                frame: that.frame,
            };
        });
        that.$emit('update', that.frame, result);
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
        that.value = data.map((item) => {
            // TODO Animation events recorded in meta need to be unified
            return {
                frame: that.frame,
                func: item.functionName,
                params: item.parameters,
            };
        });
        that.newFuncName = '';
    },
};

exports.mounted = function() {
    // @ts-ignore
    const that = this;
    that.debounceSave = require('lodash').debounce(that.saveData, 300);
}
