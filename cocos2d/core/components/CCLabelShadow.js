/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en Shadow effect for Label component, only for system fonts or TTF fonts
 * !#zh 用于给 Label 组件添加阴影效果，只能用于系统字体或 ttf 字体
 * @class LabelShadow
 * @extends Component
 * @example
 *  // Create a new node and add label components.
 *  var node = new cc.Node("New Label");
 *  var label = node.addComponent(cc.Label);
 *  label.string = "hello world";
 *  var labelShadow = node.addComponent(cc.LabelShadow);
 *  node.parent = this.node;
 */

let LabelShadow = cc.Class({
    name: 'cc.LabelShadow',
    extends: require('./CCComponent'),
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/LabelShadow',
        executeInEditMode: true,
        requireComponent: cc.Label,
    },

    properties: {
        _color: cc.Color.WHITE,
        _offset: cc.v2(2, 2),
        _blur: 2,

        /**
         * !#en The shadow color
         * !#zh 阴影的颜色
         * @property color
         * @type {Color}
         * @example
         * labelShadow.color = cc.Color.YELLOW;
         */
        color: {
            tooltip: CC_DEV && 'i18n:COMPONENT.shadow.color',
            get: function () {
                return this._color.clone();
            },
            set: function (value) {
                if (!this._color.equals(value)) {
                    this._color.set(value);
                }
                this._updateRenderData();
            }
        },

        /**
         * !#en Offset between font and shadow
         * !#zh 字体与阴影的偏移
         * @property offset
         * @type {Vec2}
         * @example
         * labelShadow.offset = new cc.Vec2(2, 2);
         */
        offset: {
            tooltip: CC_DEV && 'i18n:COMPONENT.shadow.offset',
            get: function () {
                return this._offset;
            },
            set: function (value) {
                this._offset = value;
                this._updateRenderData();
            }
        },

        /**
         * !#en A non-negative float specifying the level of shadow blur
         * !#zh 阴影的模糊程度
         * @property blur
         * @type {Number}
         * @example
         * labelShadow.blur = 2;
         */
        blur: {
            tooltip: CC_DEV && 'i18n:COMPONENT.shadow.blur',
            get: function () {
                return this._blur;
            },
            set: function (value) {
                this._blur = value;
                this._updateRenderData();
            },
            range: [0, 1024],
        },
    },

    onEnable () {
        this._updateRenderData();
    },

    onDisable () {
        this._updateRenderData();
    },

    _updateRenderData () {
        let label = this.node.getComponent(cc.Label);
        if (label) {
            label.setVertsDirty();
        }
    }

});

cc.LabelShadow = module.exports = LabelShadow;
