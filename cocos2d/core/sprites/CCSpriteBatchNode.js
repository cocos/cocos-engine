
/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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


/**
 * <p>
 *     A cc.SpriteBatchNode can reference one and only one texture (one image file, one texture atlas).<br/>
 *     Only the cc.Sprites that are contained in that texture can be added to the cc.SpriteBatchNode.<br/>
 *     All cc.Sprites added to a cc.SpriteBatchNode are drawn in one WebGL draw call. <br/>
 *     If the cc.Sprites are not added to a cc.SpriteBatchNode then an WebGL draw call will be needed for each one, which is less efficient. <br/>
 *     <br/>
 *     Limitations:<br/>
 *       - The only object that is accepted as child (or grandchild, grand-grandchild, etc...) is _ccsg.Sprite or any subclass of _ccsg.Sprite. <br/>
 *          eg: particles, labels and layer can't be added to a cc.SpriteBatchNode. <br/>
 *       - Either all its children are Aliased or Antialiased. It can't be a mix. <br/>
 *          This is because "alias" is a property of the texture, and all the sprites share the same texture. </br>
 * </p>
 * @class
 * @extends _ccsg.Node
 *
 * @param {String|cc.Texture2D} fileImage
 * @param {Number} capacity
 * @example
 *
 * // 1. create a SpriteBatchNode with image path
 * var spriteBatchNode = new cc.SpriteBatchNode("res/animations/grossini.png", 50);
 *
 * // 2. create a SpriteBatchNode with texture
 * var texture = cc.textureCache.addImage("res/animations/grossini.png");
 * var spriteBatchNode = new cc.SpriteBatchNode(texture,50);
 *
 * @property {cc.TextureAtlas}  textureAtlas    - The texture atlas
 * @property {Array}            descendants     - <@readonly> Descendants of sprite batch node
 */
cc.SpriteBatchNode = _ccsg.Node.extend(/** @lends cc.SpriteBatchNode# */{
    _blendFunc: null,
    // all descendants: chlidren, gran children, etc...
    _texture: null,
    _className: "SpriteBatchNode",

    ctor: function (fileImage) {
        _ccsg.Node.prototype.ctor.call(this);
        this._blendFunc = new cc.BlendFunc(cc.macro.BLEND_SRC, cc.macro.BLEND_DST);

        var texture2D;
        if (cc.js.isString(fileImage)) {
            texture2D = cc.textureCache.getTextureForKey(fileImage);
            if (!texture2D)
                texture2D = cc.textureCache.addImage(fileImage);
        }else if (fileImage instanceof cc.Texture2D)
            texture2D = fileImage;

        texture2D && this.initWithTexture(texture2D);
    },

    /**
     * <p>
     *    Same as addChild
     * </p>
     * @param {_ccsg.Sprite} child
     * @param {Number} z zOrder
     * @param {Number} aTag
     * @return {cc.SpriteBatchNode}
     * @deprecated since v1.2
     */
    addSpriteWithoutQuad: function (child, z, aTag) {
        this.addChild(child, z, aTag);
        return this;
    },

    // property
    /**
     * Return null, no texture atlas is used any more
     * @return {cc.TextureAtlas}
     * @deprecated since v1.2
     */
    getTextureAtlas: function () {
        return null;
    },

    /**
     * TextureAtlas of cc.SpriteBatchNode setter
     * @param {cc.TextureAtlas} textureAtlas
     * @deprecated since v1.2
     */
    setTextureAtlas: function (textureAtlas) {},

    /**
     * Return Descendants of cc.SpriteBatchNode
     * @return {Array}
     * @deprecated since v1.2
     */
    getDescendants: function () {
        return this._children;
    },

    /**
     * <p>
     *    Initializes a cc.SpriteBatchNode with a file image (.png, .jpeg, .pvr, etc) and a capacity of children.<br/>
     *    The capacity will be increased in 33% in runtime if it run out of space.<br/>
     *    The file will be loaded using the TextureMgr.<br/>
     *    Please pass parameters to constructor to initialize the sprite batch node, do not call this function yourself.
     * </p>
     * @param {String} fileImage
     * @param {Number} capacity
     * @return {Boolean}
     */
    initWithFile: function (fileImage, capacity) {
        var texture2D = cc.textureCache.getTextureForKey(fileImage);
        if (!texture2D)
            texture2D = cc.textureCache.addImage(fileImage);
        return this.initWithTexture(texture2D, capacity);
    },

    /**
     * <p>
     *    initializes a cc.SpriteBatchNode with a file image (.png, .jpeg, .pvr, etc) and a capacity of children.<br/>
     *    The capacity will be increased in 33% in runtime if it run out of space.<br/>
     *    The file will be loaded using the TextureMgr.<br/>
     *    Please pass parameters to constructor to initialize the sprite batch node, do not call this function yourself.
     * </p>
     * @param {String} fileImage
     * @param {Number} capacity
     * @return {Boolean}
     */
    init: function (fileImage, capacity) {
        var texture2D = cc.textureCache.getTextureForKey(fileImage);
        if (!texture2D)
            texture2D = cc.textureCache.addImage(fileImage);
        return this.initWithTexture(texture2D, capacity);
    },

    /**
     * Do nothing
     * @deprecated since v1.2
     */
    increaseAtlasCapacity: function () {},

    /**
     * Removes a child given a certain index. It will also cleanup the running actions depending on the cleanup parameter.
     * @warning Removing a child from a cc.SpriteBatchNode is very slow
     * @param {Number} index
     * @param {Boolean} doCleanup
     */
    removeChildAtIndex: function (index, doCleanup) {
        this.removeChild(this._children[index], doCleanup);
    },

    /**
     * Do nothing
     * @param {_ccsg.Sprite} pobParent
     * @param {Number} index
     * @return {Number}
     * @deprecated since v1.2
     */
    rebuildIndexInOrder: function (pobParent, index) {
        return index;
    },


    /**
     * Sprites use this to start sortChildren, don't call this manually
     * @param {Boolean} reorder
     * @deprecated since v1.2
     */
    reorderBatch: function (reorder) {
        this._reorderChildDirty = reorder;
    },

    /**
     * Sets the source and destination blending function for the texture
     * @param {Number | cc.BlendFunc} src
     * @param {Number} dst
     */
    setBlendFunc: function (src, dst) {
        if (dst === undefined)
            this._blendFunc = src;
        else
            this._blendFunc = {src: src, dst: dst};
    },

    /**
     * Returns the blending function used for the texture
     * @return {cc.BlendFunc}
     */
    getBlendFunc: function () {
        return new cc.BlendFunc(this._blendFunc.src,this._blendFunc.dst);
    },

    /**
     * <p>
     *   Updates a quad at a certain index into the texture atlas. The CCSprite won't be added into the children array.                 <br/>
     *   This method should be called only when you are dealing with very big AtlasSrite and when most of the _ccsg.Sprite won't be updated.<br/>
     *   For example: a tile map (cc.TMXMap) or a label with lots of characters (BitmapFontAtlas)<br/>
     * </p>
     * @function
     * @param {_ccsg.Sprite} sprite
     * @param {Number} index
     */
    updateQuadFromSprite: function (sprite, index) {
        cc.assertID(sprite, 2623);
        if (!(sprite instanceof _ccsg.Sprite)) {
            cc.log(2616);
            return;
        }

        //
        // update the quad directly. Don't add the sprite to the scene graph
        //
        sprite.dirty = true;
        // UpdateTransform updates the textureAtlas quad
        sprite._renderCmd.transform(this._renderCmd, true);
    },

    /**
     * <p>
     *    Same as addChild(sprite, index)
     * </p>
     * @function
     * @param {_ccsg.Sprite} sprite
     * @param {Number} index
     * @deprecated since v1.2
     */
    insertQuadFromSprite: function (sprite, index) {
        this.addChild(sprite, index);
    },

    /**
     * Same as addChild(sprite, index)
     * @param {_ccsg.Sprite} sprite The child sprite
     * @param {Number} index The insert index
     * @deprecated since v1.2
     */
    insertChild: function (sprite, index) {
        this.addChild(sprite, index);
    },

    /**
     * Add child at the end
     * @function
     * @param {_ccsg.Sprite} sprite
     */
    appendChild: function (sprite) {
        this.sortAllChildren();
        var lastLocalZOrder = this._children[this._children.length-1]._localZOrder;
        this.addChild(sprite. lastLocalZOrder + 1);
    },

    /**
     * Same as removeChild
     * @function
     * @param {_ccsg.Sprite} sprite
     * @param {Boolean} [cleanup=true]  true if all running actions and callbacks on the child node will be cleanup, false otherwise.
     * @deprecated since v1.2
     */
    removeSpriteFromAtlas: function (sprite, cleanup) {
        this.removeChild(sprite, cleanup);
    },

    /**
     * Set the texture property
     * @function
     * @param {Texture2D} tex
     * @return {Boolean}
     */
    initWithTexture: function (tex) {
        this.setTexture(tex);
        return true;
    },

    // CCTextureProtocol
    /**
     * Returns texture of the sprite batch node
     * @function
     * @return {Texture2D}
     */
    getTexture: function () {
        return this._texture;
    },

    /**
     * Sets the texture of the sprite batch node.
     * @function
     * @param {Texture2D} texture
     */
    setTexture: function(texture){
        this._texture = texture;

        if (texture._textureLoaded) {
            var children = this._children, i, len = children.length;
            for (i = 0; i < len; ++i) {
                children[i].setTexture(texture);
            }
        }
        else {
            texture.addEventListener("load", function(){
                var children = this._children, i, len = children.length;
                for (i = 0; i < len; ++i) {
                    children[i].setTexture(texture);
                }
            }, this);
        }
    },

    setShaderProgram: function (newShaderProgram) {
        this._renderCmd.setShaderProgram(newShaderProgram);
        var children = this._children, i, len = children.length;
        for (i = 0; i < len; ++i) {
            children[i].setShaderProgram(newShaderProgram);
        }
    },

    /**
     * Add child to the sprite batch node (override addChild of ccsg.Node)
     * @function
     * @override
     * @param {_ccsg.Sprite} child
     * @param {Number} [zOrder]
     * @param {Number} [tag]
     */
    addChild: function (child, zOrder, tag) {
        cc.assertID(child !== undefined, 2614);

        if(!this._isValidChild(child))
            return;

        zOrder = (zOrder === undefined) ? child.zIndex : zOrder;
        tag = (tag === undefined) ? child.tag : tag;
        _ccsg.Node.prototype.addChild.call(this, child, zOrder, tag);

        // Apply shader
        if (this._renderCmd._shaderProgram) {
            child.shaderProgram = this._renderCmd._shaderProgram;
        }
    },

    _isValidChild: function (child) {
        if (!(child instanceof _ccsg.Sprite)) {
            cc.logID(2618);
            return false;
        }
        if (child.texture !== this._texture) {
            cc.logID(2619);
            return false;
        }
        return true;
    }
});

var _p = cc.SpriteBatchNode.prototype;

// Override properties
cc.defineGetterSetter(_p, "texture", _p.getTexture, _p.setTexture);
cc.defineGetterSetter(_p, "shaderProgram", _p.getShaderProgram, _p.setShaderProgram);
