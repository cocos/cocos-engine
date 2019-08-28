/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

const misc = require('../utils/misc');
const NodeEvent = require('../CCNode').EventType;
const RenderComponent = require('./CCRenderComponent');
const BlendFunc = require('../utils/blend-func');
const RenderFlow = require('../renderer/render-flow');

const Material = require('../assets/material/CCMaterial');

/**
 * !#en Enum for sprite type.
 * !#zh Sprite 类型
 * @enum Sprite.Type
 */
var SpriteType = cc.Enum({
    /**
     * !#en The simple type.
     * !#zh 普通类型
     * @property {Number} SIMPLE
     */
    SIMPLE: 0,
    /**
     * !#en The sliced type.
     * !#zh 切片（九宫格）类型
     * @property {Number} SLICED
     */
    SLICED: 1,
    /**
     * !#en The tiled type.
     * !#zh 平铺类型
     * @property {Number} TILED
     */
    TILED: 2,
    /**
     * !#en The filled type.
     * !#zh 填充类型
     * @property {Number} FILLED
     */
    FILLED: 3,
    /**
     * !#en The mesh type.
     * !#zh 以 Mesh 三角形组成的类型
     * @property {Number} MESH
     */
    MESH: 4
});

/**
 * !#en Enum for fill type.
 * !#zh 填充类型
 * @enum Sprite.FillType
 */
var FillType = cc.Enum({
    /**
     * !#en The horizontal fill.
     * !#zh 水平方向填充
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 0,
    /**
     * !#en The vertical fill.
     * !#zh 垂直方向填充
     * @property {Number} VERTICAL
     */
    VERTICAL: 1,
    /**
     * !#en The radial fill.
     * !#zh 径向填充
     * @property {Number} RADIAL
     */
    RADIAL:2,
});

/**
 * !#en Sprite Size can track trimmed size, raw size or none.
 * !#zh 精灵尺寸调整模式
 * @enum Sprite.SizeMode
 */
var SizeMode = cc.Enum({
    /**
     * !#en Use the customized node size.
     * !#zh 使用节点预设的尺寸
     * @property {Number} CUSTOM
     */
    CUSTOM: 0,
    /**
     * !#en Match the trimmed size of the sprite frame automatically.
     * !#zh 自动适配为精灵裁剪后的尺寸
     * @property {Number} TRIMMED
     */
    TRIMMED: 1,
    /**
     * !#en Match the raw size of the sprite frame automatically.
     * !#zh 自动适配为精灵原图尺寸
     * @property {Number} RAW
     */
    RAW: 2
});
/**
 * !#en Sprite state can choice the normal or grayscale.
 * !#zh 精灵颜色通道模式。
 * @enum Sprite.State
 * @deprecated
 */
var State = cc.Enum({
    /**
     * !#en The normal state
     * !#zh 正常状态
     * @property {Number} NORMAL
     */
    NORMAL: 0,
    /**
     * !#en The gray state, all color will be modified to grayscale value.
     * !#zh 灰色状态，所有颜色会被转换成灰度值
     * @property {Number} GRAY
     */
    GRAY: 1
});

/**
 * !#en Renders a sprite in the scene.
 * !#zh 该组件用于在场景中渲染精灵。
 * @class Sprite
 * @extends RenderComponent
 * @example
 *  // Create a new node and add sprite components.
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  node.parent = this.node;
 */
var Sprite = cc.Class({
    name: 'cc.Sprite',
    extends: RenderComponent,
    mixins: [BlendFunc],

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Sprite',
        help: 'i18n:COMPONENT.help_url.sprite',
        inspector: 'packages://inspector/inspectors/comps/sprite.js',
    },

    ctor () {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            this._activateMaterial = this._activateMaterialCanvas;
        }
        else {
            this._activateMaterial = this._activateMaterialWebgl;
        }
    },

    properties: {
        _spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        _type: SpriteType.SIMPLE,
        _sizeMode: SizeMode.TRIMMED,
        _fillType: 0,
        _fillCenter: cc.v2(0,0),
        _fillStart: 0,
        _fillRange: 0,
        _isTrimmedMode: true,
        _atlas: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.atlas',
            editorOnly: true,
            visible: true,
            animatable: false
        },

        /**
         * !#en The sprite frame of the sprite.
         * !#zh 精灵的精灵帧
         * @property spriteFrame
         * @type {SpriteFrame}
         * @example
         * sprite.spriteFrame = newSpriteFrame;
         */
        spriteFrame: {
            get: function () {
                return this._spriteFrame;
            },
            set: function (value, force) {
                var lastSprite = this._spriteFrame;
                if (CC_EDITOR) {
                    if (!force && ((lastSprite && lastSprite._uuid) === (value && value._uuid))) {
                        return;
                    }
                }
                else {
                    if (lastSprite === value) {
                        return;
                    }
                }
                this._spriteFrame = value;
                // render & update render data flag will be triggered while applying new sprite frame
                this.markForUpdateRenderData(false);
                this._applySpriteFrame(lastSprite);
                if (CC_EDITOR) {
                    this.node.emit('spriteframe-changed', this);
                }
            },
            type: cc.SpriteFrame,
        },

        /**
         * !#en The sprite render type.
         * !#zh 精灵渲染类型
         * @property type
         * @type {Sprite.Type}
         * @example
         * sprite.type = cc.Sprite.Type.SIMPLE;
         */
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                if (this._type !== value) {
                    this._type = value;
                    this._resetAssembler();
                }
            },
            type: SpriteType,
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.type',
        },

        /**
         * !#en
         * The fill type, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
         * !#zh
         * 精灵填充类型，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
         * @property fillType
         * @type {Sprite.FillType}
         * @example
         * sprite.fillType = cc.Sprite.FillType.HORIZONTAL;
         */
        fillType : {
            get: function () {
                return this._fillType;
            },
            set: function(value) {
                if (value !== this._fillType) {
                    this._fillType = value;
                    this._resetAssembler();
                }
            },
            type: FillType,
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_type'
        },

        /**
         * !#en
         * The fill Center, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
         * !#zh
         * 填充中心点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
         * @property fillCenter
         * @type {Vec2}
         * @example
         * sprite.fillCenter = new cc.Vec2(0, 0);
         */
        fillCenter: {
            get: function() {
                return this._fillCenter;
            },
            set: function(value) {
                this._fillCenter.x = value.x;
                this._fillCenter.y = value.y;
                if (this._type === SpriteType.FILLED) {
                    this.setVertsDirty();
                }
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_center',
        },

        /**
         * !#en
         * The fill Start, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
         * !#zh
         * 填充起始点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
         * @property fillStart
         * @type {Number}
         * @example
         * // -1 To 1 between the numbers
         * sprite.fillStart = 0.5;
         */
        fillStart: {
            get: function() {
                return this._fillStart;
            },
            set: function(value) {
                this._fillStart = misc.clampf(value, -1, 1);
                if (this._type === SpriteType.FILLED) {
                    this.setVertsDirty();
                }
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_start'
        },

        /**
         * !#en
         * The fill Range, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
         * !#zh
         * 填充范围，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
         * @property fillRange
         * @type {Number}
         * @example
         * // -1 To 1 between the numbers
         * sprite.fillRange = 1;
         */
        fillRange: {
            get: function() {
                return this._fillRange;
            },
            set: function(value) {
                this._fillRange = misc.clampf(value, -1, 1);
                if (this._type === SpriteType.FILLED) {
                    this.setVertsDirty();
                }
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_range'
        },
        /**
         * !#en specify the frame is trimmed or not.
         * !#zh 是否使用裁剪模式
         * @property trim
         * @type {Boolean}
         * @example
         * sprite.trim = true;
         */
        trim: {
            get: function () {
                return this._isTrimmedMode;
            },
            set: function (value) {
                if (this._isTrimmedMode !== value) {
                    this._isTrimmedMode = value;
                    if (this._type === SpriteType.SIMPLE || this._type === SpriteType.MESH) {
                        this.setVertsDirty();
                    }
                }
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.trim'
        },

      
        /**
         * !#en specify the size tracing mode.
         * !#zh 精灵尺寸调整模式
         * @property sizeMode
         * @type {Sprite.SizeMode}
         * @example
         * sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
         */
        sizeMode: {
            get: function () {
                return this._sizeMode;
            },
            set: function (value) {
                this._sizeMode = value;
                if (value !== SizeMode.CUSTOM) {
                    this._applySpriteSize();
                }
            },
            animatable: false,
            type: SizeMode,
            tooltip: CC_DEV && 'i18n:COMPONENT.sprite.size_mode'
        }
    },

    statics: {
        FillType: FillType,
        Type: SpriteType,
        SizeMode: SizeMode,
        State: State,
    },

    setVisible: function (visible) {
        this.enabled = visible;
    },

    /**
     * Change the state of sprite.
     * @method setState
     * @see `Sprite.State`
     * @param state {Sprite.State} NORMAL or GRAY State.
     * @deprecated
     */
    setState () {},

    /**
     * Gets the current state.
     * @method getState
     * @see `Sprite.State`
     * @return {Sprite.State}
     * @deprecated
     */
    getState () {},

    onEnable: function () {
        this._super();

        if (!this._spriteFrame || !this._spriteFrame.textureLoaded()) {
            // Do not render when sprite frame is not ready
            this.disableRender();
            if (this._spriteFrame) {
                this._spriteFrame.once('load', this._onTextureLoaded, this);
                this._spriteFrame.ensureLoadTexture();
            }
        }
        else {
            this._activateMaterial();
        }
    },

    _on3DNodeChanged () {
        this._resetAssembler();
    },

    _activateMaterialCanvas () {
        this.markForUpdateRenderData(true);
        this.markForRender(true);
    },

    _activateMaterialWebgl () {
        let spriteFrame = this._spriteFrame;
        // If spriteframe not loaded, disable render and return.
        if (!spriteFrame || !spriteFrame.textureLoaded()) {
            this.disableRender();
            return;
        }
        
        // make sure material is belong to self.
        let material = this.sharedMaterials[0];
        if (!material) {
            material = Material.getInstantiatedBuiltinMaterial('2d-sprite', this);
        }
        else {
            material = Material.getInstantiatedMaterial(material, this);
        }
        
        material.setProperty('texture', spriteFrame.getTexture());

        this.setMaterial(0, material);
        this.markForRender(true);
    },

    _applyAtlas: CC_EDITOR && function (spriteFrame) {
        // Set atlas
        if (spriteFrame && spriteFrame._atlasUuid) {
            var self = this;
            cc.assetManager.load(spriteFrame._atlasUuid, function (err, asset) {
                self._atlas = asset;
            });
        } else {
            this._atlas = null;
        }
    },

    _canRender () {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            if (!this._enabled) return false;
        }
        else {
            if (!this._enabled || !this.sharedMaterials[0] || !this.node._activeInHierarchy) return false;
        }

        let spriteFrame = this._spriteFrame;
        if (!spriteFrame || !spriteFrame.textureLoaded()) {
            return false;
        }
        return true;
    },

    _applySpriteSize: function () {
        if (this._spriteFrame) {
            if (SizeMode.RAW === this._sizeMode) {
                var size = this._spriteFrame._originalSize;
                this.node.setContentSize(size);
            } else if (SizeMode.TRIMMED === this._sizeMode) {
                var rect = this._spriteFrame._rect;
                this.node.setContentSize(rect.width, rect.height);
            }
            
            this.setVertsDirty();
            this._activateMaterial();
        }
    },

    _onTextureLoaded: function () {
        if (!this.isValid) {
            return;
        }

        this._applySpriteSize();
    },

    _applySpriteFrame: function (oldFrame) {
        if (oldFrame && !oldFrame.textureLoaded()) {
            oldFrame.off('load', this._onTextureLoaded, this);
        }

        let spriteFrame = this._spriteFrame;
        if (spriteFrame) {
            if (spriteFrame.textureLoaded()) {
                this._applySpriteSize();
            }
            else {
                this.markForRender(false);
                spriteFrame.once('load', this._onTextureLoaded, this);
                spriteFrame.ensureLoadTexture();
            }
        }
        else {
            this.markForRender(false);
        }

        if (CC_EDITOR) {
            // Set atlas
            this._applyAtlas(spriteFrame);
        }
    },

    _resized: CC_EDITOR && function () {
        if (this._spriteFrame) {
            var actualSize = this.node.getContentSize();
            var expectedW = actualSize.width;
            var expectedH = actualSize.height;
            if (this._sizeMode === SizeMode.RAW) {
                var size = this._spriteFrame.getOriginalSize();
                expectedW = size.width;
                expectedH = size.height;
            } else if (this._sizeMode === SizeMode.TRIMMED) {
                var rect = this._spriteFrame.getRect();
                expectedW = rect.width;
                expectedH = rect.height;

            }

            if (expectedW !== actualSize.width || expectedH !== actualSize.height) {
                this._sizeMode = SizeMode.CUSTOM;
            }
        }
    },
});

if (CC_EDITOR) {
    // override __preload
    Sprite.prototype.__superPreload = cc.RenderComponent.prototype.__preload;
    Sprite.prototype.__preload = function () {
        if (this.__superPreload) this.__superPreload();
        this.node.on(NodeEvent.SIZE_CHANGED, this._resized, this);
    };
    // override onDestroy
    Sprite.prototype.__superOnDestroy = cc.Component.prototype.onDestroy;
    Sprite.prototype.onDestroy = function () {
        if (this.__superOnDestroy) this.__superOnDestroy();
        this.node.off(NodeEvent.SIZE_CHANGED, this._resized, this);
    };
}

cc.Sprite = module.exports = Sprite;
