/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var SpriteType = cc.SpriteType;

/**
 * Renders a sprite in the scene.
 * @class Sprite
 * @extends _ComponentInSG
 */
var SpriteRenderer = cc.Class({
    name: 'cc.Sprite',
    extends: require('./CCComponentInSG'),

    editor: CC_EDITOR && {
        menu: 'Graphics/Sprite',
        inspector: 'app://editor/page/inspector/sprite.html'
    },

    properties: {
        _sprite: {
            default: null,
            type: cc.SpriteFrame
        },
        _type: SpriteType.SIMPLE,
        _isFlippedX: false,
        _isFlippedY: false,
        _useOriginalSize: true,

        /**
         * The Sprite Atlas.
         * @property _atlas
         * @type {SpriteAtlas}
         */
        _atlas: {
            default: '',
            url: cc.SpriteAtlas,
            editorOnly: true,
            visible: true
        },

        /**
         * The sprite frame of the sprite.
         * @property sprite
         * @type {SpriteFrame}
         */
        sprite: {
            get: function () {
                return this._sprite;
            },
            set: function (value, force) {
                var lastSprite = this._sprite;
                this._sprite = value;
                if (this._sgNode) {
                    if (CC_EDITOR && force) {
                        this._sgNode._scale9Image = null;
                    }
                    this._applySprite(this._sgNode, lastSprite);
                    // color cleared after reset texture, should reapply color
                    this._sgNode.setColor(this.node._color);
                    this._sgNode.setOpacity(this.node._opacity);
                }
            },
            type: cc.SpriteFrame
        },

        /**
         * The sprite type.
         * @property type
         * @type {SpriteType}
         */
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
                this._sgNode.setRenderingType(this._type);
                // manual settings inset top, bttom, right, left.
                this._applyCapInset();
            },
            type: SpriteType
        },

        useOriginalSize: {
            get: function () {
                return this._useOriginalSize;
            },
            set: function (value) {
                this._useOriginalSize = value;
                if (value) {
                    this._applySpriteSize();
                }
            }
        },

        /**
         * Only for editor to calculate bounding box.
         */
        localSize: {
            get: function () {
                var sgNode = this._sgNode;
                if (!sgNode) {
                    return cc.size(0, 0);
                }
                return cc.size(sgNode.width, sgNode.height);
            },
            visible: false
        }
    },

    /**
     * Sets whether the sprite is visible or not.
     * @method setVisible
     * @param {Boolean} visible
     * @override
     */
    setVisible: function (visible) {
        this.enabled = visible;
    },

    /**
     * Toggle 9-slice feature.
     * If Scale9Sprite is 9-slice disabled, the Scale9Sprite will rendered as a normal sprite.
     * @method setScale9Enabled
     * @param {Boolean} enabled - True to enable 9-slice, false otherwise.
     */
    setScale9Enabled: function(enabled) {
        this.type = enabled ? cc.SpriteType.SLICED : cc.SpriteType.SIMPLE;
    },

    /**
     * Query whether the Scale9Sprite is enable 9-slice or not.
     * @method isScale9Enabled
     * @return {Boolean} True if 9-slice is enabled, false otherwise.
     */
    isScale9Enabled: function(){
        return this.type === cc.SpriteType.SLICED
    },

    /**
     * Get the original no 9-sliced sprite.
     * @method getSprite
     * @return {SpriteFrame} A sprite instance.
     */
    getSprite : function(){
        return this._sprite;
    },

    /**
     * Initializes a 9-slice sprite with a texture file, a delimitation zone and
     * with the specified cap insets.
     * Once the sprite is created, you can then call its "setContentSize:" method
     * to resize the sprite will all it's 9-slice goodness intract.
     * It respects the anchorPoint too.
     *
     * @method initWithFile
     * @param {String} file - The name of the texture file.
     * @param {Rect} rect - The rectangle that describes the sub-part of the texture that
     * is the whole image. If the shape is the whole texture, set this to the texture's full rect.
     * @param {Rect} capInsets - The values to use for the cap insets.
     */
    initWithFile: function (file, rect, capInsets) {
        this._sgNode.initWithFile(file, rect, capInsets);
    },

    /**
     * Initializes a 9-slice sprite with an sprite frame and with the specified
     * cap insets.
     * Once the sprite is created, you can then call its "setContentSize:" method
     * to resize the sprite will all it's 9-slice goodness intract.
     * It respects the anchorPoint too.
     *
     * @method initWithSpriteFrame
     * @param {SpriteFrame} spriteFrame - The sprite frame object.
     * @param {Rect} capInsets - The values to use for the cap insets.
     */
    initWithSpriteFrame: function (spriteFrame, capInsets) {
        this._sprite = spriteFrame;
        this._sgNode.initWithSpriteFrame(spriteFrame, capInsets);
    },

    /**
     * Initializes a 9-slice sprite with an sprite frame name and with the specified
     * cap insets.
     * Once the sprite is created, you can then call its "setContentSize:" method
     * to resize the sprite will all it's 9-slice goodness intract.
     * It respects the anchorPoint too.
     *
     * @method initWithSpriteFrameName
     * @param {String} spriteFrameName - The sprite frame name.
     * @param {Rect} capInsets - The values to use for the cap insets.
     */
    initWithSpriteFrameName: function (spriteFrameName, capInsets) {
        var initialized = this._sgNode.initWithSpriteFrame(spriteFrameName, capInsets);
        if (initialized === false) {
            return;
        }
        this._sprite = this._sgNode._scale9Image;
    },

    /**
     * Creates and returns a new sprite object with the specified cap insets.
     * You use this method to add cap insets to a sprite or to change the existing
     * cap insets of a sprite. In both cases, you get back a new image and the
     * original sprite remains untouched.
     *
     * @method resizableSpriteWithCapInsets
     * @param {Rect} capInsets - The values to use for the cap insets.
     * @return {Scale9Sprite} A Scale9Sprite instance.
     */
    resizableSpriteWithCapInsets: function (capInsets) {
        return this._sgNode.resizableSpriteWithCapInsets(capInsets);
    },

    /**
     * Update Scale9Sprite with a specified sprite.
     *
     * @method updateWithSprite
     * @param {SpriteFrame} sprite - A sprite pointer.
     * @param {Rect} rect - A delimitation zone.
     * @param {Number} rotated - Whether the sprite is rotated or not.
     * @param {Size} offset - The offset when slice the sprite.
     * @param {Size} originalSize - The origial size of the sprite.
     * @param {Rect} capInsets - The Values to use for the cap insets.
     * @return {Boolean} True if update success, false otherwise.
     */
    updateWithSprite: function (sprite, textureRect, rotated, offset, originalSize, capInsets) {
        this._sprite = sprite;
        return this._sgNode.updateWithSprite(sprite, textureRect, rotated, offset, originalSize, capInsets);
    },

    /**
     * Sets a new sprite frame to the sprite.
     * @method setSpriteFrame
     * @param {SpriteFrame} spriteFrame
     * @param {Rect} capInsets
     */
    setSpriteFrame: function (spriteFrame, capInsets) {
        this.sprite = spriteFrame;
        this.setCapInsets(capInsets);
    },

    /**
     * Query the sprite's original size.
     * @method getOriginalSize
     * @return {Size} Sprite size.
     */
    getOriginalSize: function () {
        return this._sgNode.getOriginalSize();
    },

    /**
     * Change the preferred size of Scale9Sprite.
     * @method setPreferredSize
     * @param {Size} size - A delimitation zone.
     */
    setPreferredSize: function (size) {
        this.node.setContentSize(size);
    },

    /**
     * Query the Scale9Sprite's preferred size.
     * @method getPreferredSize
     * @return {Size} Scale9Sprite's preferred size.
     */
    getPreferredSize: function () {
        return this._sgNode.getPreferredSize();
    },

    /**
     * Change the cap inset size.
     * @method setCapInsets
     * @param {Rect} capInsets - A delimitation zone.
     */
    setCapInsets: function (capInsets) {
        this._sgNode.setCapInsets(capInsets);
    },
    /**
     * Query the Scale9Sprite's preferred size.
     * @method getCapInsets
     * @return {Rect} Scale9Sprite's cap inset.
     */
    getCapInsets: function () {
        return this._sgNode.getCapInsets();
    },

    /**
     * Change the left sprite's cap inset.
     * @method setInsetLeft
     * @param {Number} leftInset - The values to use for the cap inset.
     */
    setInsetLeft: function(insetLeft){
        this._sgNode.setInsetLeft(insetLeft);
    },

    /**
     * Query the left sprite's cap inset.
     * @method getInsetLeft
     * @return {Number} The left sprite's cap inset.
     */
    getInsetLeft: function(){
        return this._sgNode.getInsetLeft();
    },

    /**
     * Change the top sprite's cap inset.
     * @method setInsetTop
     * @param {Number} topInset - The values to use for the cap inset.
     */
    setInsetTop: function(insetTop){
        this._sgNode.setInsetTop(insetTop);
    },

    /**
     * Query the top sprite's cap inset.
     * @method getInsetTop
     * @return {Number} The top sprite's cap inset.
     */
    getInsetTop: function(){
        return this._sgNode.getInsetTop();
    },

    /**
     * Change the right sprite's cap inset.
     * @method setInsetRight
     * @param {Number} rightInset - The values to use for the cap inset.
     */
    setInsetRight: function(insetRight){
        this._sgNode.setInsetRight(insetRight);
    },

    /**
     * Query the right sprite's cap inset.
     * @method getInsetRight
     * @return {Number} The right sprite's cap inset.
     */
    getInsetRight: function(){
        return this._sgNode.getInsetRight();
    },

    /**
     * Change the bottom sprite's cap inset.
     * @method setInsetBottom
     * @param {Number} bottomInset - The values to use for the cap inset.
     */
    setInsetBottom: function(insetBottom) {
        this._sgNode.setInsetBottom(insetBottom);
    },

    /**
     * @brief Query the bottom sprite's cap inset.
     * @method getInsetBottom
     * @return {Number} The bottom sprite's cap inset.
     */
    getInsetBottom: function(){
        return this._sgNode.getInsetBottom();
    },

    /**
     * Sets whether the widget should be flipped horizontally or not.
     * @method setFlippedX
     * @param {Boolean} flippedX - true if the sprite should be flipped horizontally, false otherwise.
     */
    setFlippedX: function (flippedX) {
        this._isFlippedX = flippedX;
        this._sgNode.setFlippedX(flippedX);
    },

    /**
     * Returns the flag which indicates whether the widget is flipped horizontally or not.
     *
     * It only flips the texture of the widget, and not the texture of the widget's children.
     * Also, flipping the texture doesn't alter the anchorPoint.
     * If you want to flip the anchorPoint too, and/or to flip the children too use:
     * widget->setScaleX(sprite->getScaleX() * -1);
     *
     * @method isFlippedX
     * @return {Boolean} true if the sprite is flipped horizontally, false otherwise.
     */
    isFlippedX: function () {
        return this._isFlippedX;
    },

    /**
     * Sets whether the sprite should be flipped vertically or not.
     * @method setFlippedY
     * @param {Boolean} flippedY - true if the sprite should be flipped vertically, false otherwise.
     */
    setFlippedY: function (flippedY) {
        this._isFlippedY = flippedY;
        this._sgNode.setFlippedY(flippedY);
    },

    /**
     * Return the flag which indicates whether the widget is flipped vertically or not.
     *
     * It only flips the texture of the widget, and not the texture of the widget's children.
     * Also, flipping the texture doesn't alter the anchorPoint.
     * If you want to flip the anchorPoint too, and/or to flip the children too use:
     * widget->setScaleY(widget->getScaleY() * -1);
     *
     * @method isFlippedY
     * @return {Boolean} true if the sprite is flipped vertically, false otherwise.
     */
    isFlippedY: function () {
        return this._isFlippedY;
    },

    onLoad: function () {
        this._super();
        this.node.on('size-changed', this._resized, this);
    },

    onDestroy: function () {
        this._super();
        this.node.off('size-changed', this._resized, this);
    },

    _applyCapInset: function (node) {
        if (this._type === SpriteType.SLICED) {
            var node = node || this._sgNode;
            node.setInsetTop(this._sprite.insetTop);
            node.setInsetBottom(this._sprite.insetBottom);
            node.setInsetRight(this._sprite.insetRight);
            node.setInsetLeft(this._sprite.insetLeft);
        }
    },

    _applySpriteSize: function (node) {
        var node = node || this._sgNode;
        if (this._useOriginalSize) {
            var rect = this._sprite.getRect();
            node.setPreferredSize(rect.size);
        }
        else {
            node.setPreferredSize(this.node.getContentSize(true));
        }
    },

    _applySprite: function (node, oldSprite) {
        if (oldSprite) {
            oldSprite.off('load', this._applyCapInset, this);
        }
        if (!this._sprite) { return; }
        node._spriteRect = cc.rect(0, 0);
        node._originalSize = cc.size(0, 0);
        node.initWithSpriteFrame(this._sprite);
        var locLoaded = this._sprite.textureLoaded();
        if (!locLoaded) {
            if ( !this._useOriginalSize ) {
                node.setPreferredSize(this.node.getContentSize(true));
            }
            this._sprite.once('load', function () {
                this._applyCapInset();
                this._applySpriteSize();
            }, this);
        }
        else {
            this._applyCapInset(node);
            this._applySpriteSize(node);
        }
    },

    _createSgNode: function () {
        var sgNode = new cc.Scale9Sprite();
        sgNode.setRenderingType(this._type);
        this._applySprite(sgNode, null);
        return sgNode;
    },

    _resized: function () {
        this.useOriginalSize = false;
    },
});

var misc = require('../utils/misc');
var SameNameGetSets = ['atlas', 'capInsets', 'insetLeft', 'insetTop', 'insetRight', 'insetBottom'];
var DiffNameGetSets = {
    type: [ null, 'setRenderingType'],
    sprite: ['getSprite', null],
    flippedX: ['isFlippedX', 'setFlippedX'],
    flippedY: ['isFlippedY', 'setFlippedY'],
};
misc.propertyDefine(SpriteRenderer, SameNameGetSets, DiffNameGetSets);

cc.SpriteRenderer = module.exports = SpriteRenderer;
