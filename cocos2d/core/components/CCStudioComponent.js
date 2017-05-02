
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
        inspector: 'unpack://engine/extensions/cocostudio/editor/studio-component.js'
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
            type: 'Float',
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

cc.StudioComponent = module.exports = StudioComponent;
