/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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


var ComponentType = cc.Enum({
    NONE : 0,
    CHECKBOX : 1,
    TEXT_ATLAS : 2,
    SLIDER_BAR : 3,
    LIST_VIEW : 4,
    PAGE_VIEW : 5
});

var ListDirection = cc.Enum({
    VERTICAL : 0,
    HORIZONTAL: 1
});

var VerticalAlign = cc.Enum({
    TOP : 0,
    CENTER: 1,
    BOTTOM: 2
});

var HorizontalAlign = cc.Enum({
    LEFT : 0,
    CENTER: 1,
    RIGHT: 2
});

var StudioComponent = cc.Class({
    name: 'cc.StudioComponent',
    extends: cc.Component,

    editor: CC_EDITOR && {
        inspector: 'unpack://engine-dev/extensions/cocostudio/editor/studio-component.js'
    },

    properties: CC_EDITOR && {
        _type : ComponentType.NONE,
        type : {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
            },
            readonly: true,
            type: ComponentType
        },

        // props for checkbox
        _checkNormalBackFrame: null,
        checkNormalBackFrame: {
            get: function () {
                return this._checkNormalBackFrame;
            },
            set: function (value) {
                this._checkNormalBackFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        _checkPressedBackFrame: null,
        checkPressedBackFrame: {
            get: function () {
                return this._checkPressedBackFrame;
            },
            set: function (value) {
                this._checkPressedBackFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        _checkDisableBackFrame: null,
        checkDisableBackFrame: {
            get: function () {
                return this._checkDisableBackFrame;
            },
            set: function (value) {
                this._checkDisableBackFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        _checkNormalFrame: null,
        checkNormalFrame: {
            get: function () {
                return this._checkNormalFrame;
            },
            set: function (value) {
                this._checkNormalFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        _checkDisableFrame: null,
        checkDisableFrame: {
            get: function () {
                return this._checkDisableFrame;
            },
            set: function (value) {
                this._checkDisableFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        checkInteractable : {
            readonly: true,
            default: true
        },

        isChecked : {
            readonly: true,
            default: true
        },

        // props for TextAtlas
        _atlasFrame: null,
        atlasFrame: {
            get: function () {
                return this._atlasFrame;
            },
            set: function (value) {
                this._atlasFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        firstChar: {
            readonly: true,
            default: '.'
        },

        charWidth: {
            readonly: true,
            default: 0
        },

        charHeight: {
            readonly: true,
            default: 0
        },

        string: {
            readonly: true,
            default: ''
        },

        // props for SliderBar
        _sliderBackFrame: null,
        sliderBackFrame : {
            get: function () {
                return this._sliderBackFrame;
            },
            set: function (value) {
                this._sliderBackFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        _sliderBarFrame: null,
        sliderBarFrame : {
            get: function () {
                return this._sliderBarFrame;
            },
            set: function (value) {
                this._sliderBarFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        _sliderBtnNormalFrame: null,
        sliderBtnNormalFrame : {
            get: function () {
                return this._sliderBtnNormalFrame;
            },
            set: function (value) {
                this._sliderBtnNormalFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        _sliderBtnPressedFrame: null,
        sliderBtnPressedFrame : {
            get: function () {
                return this._sliderBtnPressedFrame;
            },
            set: function (value) {
                this._sliderBtnPressedFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        _sliderBtnDisabledFrame: null,
        sliderBtnDisabledFrame : {
            get: function () {
                return this._sliderBtnDisabledFrame;
            },
            set: function (value) {
                this._sliderBtnDisabledFrame = value;
            },
            readonly: true,
            type: cc.SpriteFrame
        },

        sliderInteractable : {
            readonly: true,
            default: true
        },

        sliderProgress: {
            default: 0.5,
            readonly: true,
            type: cc.Float,
            range: [0, 1, 0.1]
        },

        // props for ListView
        listInertia:  {
            readonly: true,
            default: true,
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.inertia',
        },

        listDirection: {
            readonly: true,
            default: ListDirection.VERTICAL,
            type: ListDirection
        },

        listHorizontalAlign: {
            readonly: true,
            default: HorizontalAlign.LEFT,
            type: HorizontalAlign
        },

        listVerticalAlign: {
            readonly: true,
            default: VerticalAlign.TOP,
            type: VerticalAlign
        },

        listPadding: {
            readonly: true,
            default: 0
        }
    },

    statics : {
        ComponentType : ComponentType,
        ListDirection : ListDirection,
        VerticalAlign : VerticalAlign,
        HorizontalAlign : HorizontalAlign
    },
});

var PrefabHelper = require('../utils/prefab-helper');
StudioComponent.PlaceHolder = cc.Class({
    name: 'cc.StudioComponent.PlaceHolder',
    extends: cc.Component,
    properties: {
        _baseUrl: '',
        nestedPrefab: cc.Prefab,
    },
    onLoad: function () {
        if (!this.nestedPrefab) {
            if (CC_DEV) {
                cc.warn('Unable to find %s resource.', this._baseUrl);
            }
            return;
        }
        this._replaceWithNestedPrefab();
    },
    _replaceWithNestedPrefab: function () {
        var node = this.node;
        var _prefab = node._prefab;
        _prefab.root = node;
        _prefab.asset = this.nestedPrefab;
        PrefabHelper.syncWithPrefab(node);
    }
});

cc.StudioComponent = module.exports = StudioComponent;


var StudioWidget = cc.Class({
    name: 'cc.StudioWidget',
    extends: cc.Widget,
    editor: CC_EDITOR && {
        inspector: 'packages://inspector/inspectors/comps/ccwidget.js',
    },
    _validateTargetInDEV () {}
});

cc.StudioWidget = module.exports = StudioWidget;


