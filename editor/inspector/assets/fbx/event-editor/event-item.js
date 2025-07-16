'use strict';

const defaultParams = {
    string: 'param',
    number: 0,
    boolean: false,
};

exports.template = /* html */`
<div @change.stop="onConfirm" v-if="event">
    <ui-section expand>
        <div slot="header" class="header" @click.stop>
            <ui-input name="funcName" placeholder="function Name"
                :value="event.func"
                :index="index"
            ></ui-input>
            <span @mousedown="onMouseDown">
                <ui-icon value="del"
                    name="delFunc"
                    tooltip="i18n:animator.event.del_func"
                    :index="index"
                ></ui-icon>
            </span>
        </div>
        <div class="params">
            <div class="line">
                <span>params</span>
                <span @mousedown="onMouseDown">
                    <ui-icon value="add"
                        name="addParams"
                        tooltip="i18n:animator.event.add_params"
                        :index="index"
                    ></ui-icon>
                    <ui-icon value="clear"
                        name="clearParams"
                        tooltip="i18n:animator.event.clear_params"
                        :index="index"
                    ></ui-icon>
                </span>
            </div>
            <div class="line" v-for="(val, paramIndex) in event.params">
                <span class="name">{{paramIndex + 1}}</span>
                <ui-select :value="typeof(val)" name="changeParamType"
                    :index="paramIndex"
                >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                </ui-select>
                <ui-input v-if="typeof(val) === 'string'"
                    name="param"
                    :value="val"
                    :index="paramIndex"
                ></ui-input>
                <ui-num-input v-if="typeof(val) === 'number'"
                    name="param"
                    :value="val"
                    :index="paramIndex"
                ></ui-num-input>
                <ui-checkbox v-if="typeof(val) === 'boolean'"
                    name="param"
                    :value="val"
                    :index="paramIndex"
                ></ui-checkbox>
                <span class="operate" @mousedown="onMouseDown">
                    <ui-icon value="del"
                        name="delParams"
                        tooltip="i18n:animator.event.del_params"
                        :index="paramIndex"
                    ></ui-icon>
                </span>
            </div>
        </div>
    </ui-section>
</div>
`;

exports.props = [
    'event',
    'index',
];

exports.methods = {
    onConfirm(event) {
        const that = this;
        const name = event.target.getAttribute('name');
        if (!name) {
            return;
        }
        let index = event.target.getAttribute('index');
        const value = event.target.value;
        const eventInfo = that.event;
        let params = [];
        switch (name) {
            case 'funcName':
                if (value === event.func) {
                    return;
                }
                eventInfo.func = value;
                break;
            case 'changeParamType':
                params = eventInfo.params;
                params.splice(index, 1, defaultParams[value]);
                break;
            case 'param':
                params = eventInfo.params;
                if (params[index] === value) {
                    return;
                }
                params.splice(index, 1, value);
                break;
        }
        that.$emit('update', that.event, that.index);
    },
    async onMouseDown(event) {
        const that = this;
        const name = event.target.getAttribute('name');
        let index = event.target.getAttribute('index');
        switch (name) {
            case 'delFunc':
                that.$emit('delete', that.index);
                return;
            case 'addParams':
                that.event.params.splice(that.event.params.length - 1, 0, 'param');
                break;
            case 'delParams':
                that.event.params.splice(index, 1);
                break;
            case 'clearParams':
                that.event.params = [];
                break;
        }
        that.$emit('update', that.event, that.index);
    },
};
