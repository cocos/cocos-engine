/****************************************************************************
 Copyright (c) 2013-2017 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Class = require('../platform/_CCClass');
var JS = require('../platform/js');
var game = require('../CCGame');

/**
 * <p>A class that implements a Texture Atlas. <br />
 * Supported features: <br />
 * The atlas file can be a PNG, JPG. <br />
 * Quads can be updated in runtime <br />
 * Quads can be added in runtime <br />
 * Quads can be removed in runtime <br />
 * Quads can be re-ordered in runtime <br />
 * The TextureAtlas capacity can be increased or decreased in runtime.</p>
 * @class TextureAtlas
 *
 */

var TextureAtlas = Class.extend(/** @lends cc.TextureAtlas# */{  //WebGL only
    /**
     * <p>Creates a TextureAtlas with an filename and with an initial capacity for Quads. <br />
     * The TextureAtlas capacity can be increased in runtime. </p>
     * Constructor of cc.TextureAtlas
     * @method constructor
     * @param {String|Texture2D} fileName
     * @param {Number} capacity
     * @example {@link utils/api/engine/docs/cocos2d/core/textures/TextureAtlas.js}
     */
    ctor: function (fileName, capacity) {
        this.dirty = false;
        this.texture = null;

        this._indices = null;
        //0: vertex  1: indices
        this._buffersVBO = [];
        this._capacity = 0;

        this._quads = null;
        this._quadsArrayBuffer = null;
        this._quadsWebBuffer = null;
        this._quadsReader = null;

        if (cc.js.isString(fileName)) {
            this.initWithFile(fileName, capacity);
        } else if (fileName instanceof cc.Texture2D) {
            this.initWithTexture(fileName, capacity);
        }
    },

    /**
     * Quantity of quads that are going to be drawn.
     * @method getTotalQuads
     * @return {Number}
     */
    getTotalQuads: function () {
        //return this._quads.length;
        return this._totalQuads;
    },

    /**
     * Quantity of quads that can be stored with the current texture atlas size.
     * @method getCapacity
     * @return {Number}
     */
    getCapacity: function () {
        return this._capacity;
    },

    /**
     * Texture of the texture atlas.
     * @method getTexture
     * @return {Texture2D}
     */
    getTexture: function () {
        return this.texture;
    },

    /**
     * Set texture for texture atlas.
     * @method setTexture
     * @param {Texture2D} texture
     */
    setTexture: function (texture) {
        this.texture = texture;
    },

    /**
     * specify if the array buffer of the VBO needs to be updated.
     * @method setDirty
     * @param {Boolean} dirty
     */
    setDirty: function (dirty) {
        this.dirty = dirty;
    },

    /**
     * whether or not the array buffer of the VBO needs to be updated.
     * @method isDirty
     * @returns {Boolean}
     */
    isDirty: function () {
        return this.dirty;
    },

    /**
     * Quads that are going to be rendered.
     * @method getQuads
     * @return {Array}
     */
    getQuads: function () {
        return this._quads;
    },

    /**
     * @method setQuads
     * @param {Array} quads
     */
    setQuads: function (quads) {
        //TODO need re-binding
        this._quads = quads;
    },

    _copyQuadsToTextureAtlas: function (quads, index) {
        if (!quads)
            return;

        for (var i = 0; i < quads.length; i++)
            this._setQuadToArray(quads[i], index + i);
    },

    _setQuadToArray: function (quad, index) {
        var locQuads = this._quads;
        if (!locQuads[index]) {
            locQuads[index] = new cc.V3F_C4B_T2F_Quad(quad.tl, quad.bl, quad.tr, quad.br, this._quadsArrayBuffer, index * cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT);
            return;
        }
        locQuads[index].bl = quad.bl;
        locQuads[index].br = quad.br;
        locQuads[index].tl = quad.tl;
        locQuads[index].tr = quad.tr;
    },

    /**
     * Description
     * @return {String}
     */
    description: function () {
        return '<cc.TextureAtlas | totalQuads =' + this._totalQuads + '>';
    },

    _setupIndices: function () {
        if (this._capacity === 0)
            return;
        var locIndices = this._indices, locCapacity = this._capacity;
        for (var i = 0; i < locCapacity; i++) {
            if (cc.macro.TEXTURE_ATLAS_USE_TRIANGLE_STRIP) {
                locIndices[i * 6 + 0] = i * 4 + 0;
                locIndices[i * 6 + 1] = i * 4 + 0;
                locIndices[i * 6 + 2] = i * 4 + 2;
                locIndices[i * 6 + 3] = i * 4 + 1;
                locIndices[i * 6 + 4] = i * 4 + 3;
                locIndices[i * 6 + 5] = i * 4 + 3;
            } else {
                locIndices[i * 6 + 0] = i * 4 + 0;
                locIndices[i * 6 + 1] = i * 4 + 1;
                locIndices[i * 6 + 2] = i * 4 + 2;

                // inverted index. issue #179
                locIndices[i * 6 + 3] = i * 4 + 3;
                locIndices[i * 6 + 4] = i * 4 + 2;
                locIndices[i * 6 + 5] = i * 4 + 1;
            }
        }
    },

    /**
     * <p>Initializes a TextureAtlas with a filename and with a certain capacity for Quads.<br />
     * The TextureAtlas capacity can be increased in runtime.<br />
     * WARNING: Do not reinitialize the TextureAtlas because it will leak memory. </p>
     * @method initWithFile
     * @param {String} file
     * @param {Number} capacity
     * @return {Boolean}
     * @example {@link utils/api/engine/docs/cocos2d/core/textures/initWithFile.js}
     */
    initWithFile: function (file, capacity) {
        // retained in property
        var texture = cc.textureCache.addImage(file);
        if (texture)
            return this.initWithTexture(texture, capacity);
        else {
            cc.logID(2900, file);
            return false;
        }
    },

    /**
     * <p>Initializes a TextureAtlas with a previously initialized Texture2D object, and<br />
     * with an initial capacity for Quads.<br />
     * The TextureAtlas capacity can be increased in runtime.<br />
     * WARNING: Do not reinitialize the TextureAtlas because it will leak memory</p>
     * @method initWithTexture
     * @param {Texture2D} texture
     * @param {Number} capacity
     * @return {Boolean}
     * @example {@link utils/api/engine/docs/cocos2d/core/textures/initWithTexture.js}
     */
    initWithTexture: function (texture, capacity) {
        cc.assertID(texture, 2902);

        capacity = 0 | (capacity);
        this._capacity = capacity;
        this._totalQuads = 0;

        // retained in property
        this.texture = texture;

        // Re-initialization is not allowed
        this._quads = [];
        this._indices = new Uint16Array(capacity * 6);
        var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        this._quadsArrayBuffer = new ArrayBuffer(quadSize * capacity);
        this._quadsReader = new Uint8Array(this._quadsArrayBuffer);

        if (!( this._quads && this._indices) && capacity > 0)
            return false;

        var locQuads = this._quads;
        for (var i = 0; i < capacity; i++)
            locQuads[i] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, i * quadSize);

        this._setupIndices();
        this._setupVBO();
        this.dirty = true;
        return true;
    },

    /**
     * <p>Updates a Quad (texture, vertex and color) at a certain index <br />
     * index must be between 0 and the atlas capacity - 1 </p>
     * @method updateQuad
     * @param {V3F_C4B_T2F_Quad} quad
     * @param {Number} index
     */
    updateQuad: function (quad, index) {
        cc.assertID(quad, 2903);
        cc.assertID(index >= 0 && index < this._capacity, 2904);

        this._totalQuads = Math.max(index + 1, this._totalQuads);
        this._setQuadToArray(quad, index);
        this.dirty = true;
    },

    /**
     * <p>Inserts a Quad (texture, vertex and color) at a certain index<br />
     * index must be between 0 and the atlas capacity - 1 </p>
     * @method insertQuad
     * @param {V3F_C4B_T2F_Quad} quad
     * @param {Number} index
     */
    insertQuad: function (quad, index) {
        cc.assertID(index < this._capacity, 2905);

        this._totalQuads++;
        if (this._totalQuads > this._capacity) {
            cc.logID(2901);
            return;
        }
        var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        // issue #575. index can be > totalQuads
        var remaining = (this._totalQuads - 1) - index;
        var startOffset = index * quadSize;
        var moveLength = remaining * quadSize;
        this._quads[this._totalQuads - 1] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, (this._totalQuads - 1) * quadSize);
        this._quadsReader.set(this._quadsReader.subarray(startOffset, startOffset + moveLength), startOffset + quadSize);

        this._setQuadToArray(quad, index);
        this.dirty = true;
    },

    /**
     * <p>
     *      Inserts a c array of quads at a given index                                           <br />
     *      index must be between 0 and the atlas capacity - 1                                    <br />
     *      this method doesn't enlarge the array when amount + index > totalQuads                <br />
     * </p>
     *
     * @method insertQuads
     * @param {Array} quads
     * @param {Number} index
     * @param {Number} amount
     */
    insertQuads: function (quads, index, amount) {
        amount = amount || quads.length;

        cc.assertID((index + amount) <= this._capacity, 2906);

        var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        this._totalQuads += amount;
        if (this._totalQuads > this._capacity) {
            cc.logID(2901);
            return;
        }

        // issue #575. index can be > totalQuads
        var remaining = (this._totalQuads - 1) - index - amount;
        var startOffset = index * quadSize;
        var moveLength = remaining * quadSize;
        var lastIndex = (this._totalQuads - 1) - amount;

        var i;
        for (i = 0; i < amount; i++)
            this._quads[lastIndex + i] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, (this._totalQuads - 1) * quadSize);
        this._quadsReader.set(this._quadsReader.subarray(startOffset, startOffset + moveLength), startOffset + quadSize * amount);
        for (i = 0; i < amount; i++)
            this._setQuadToArray(quads[i], index + i);

        this.dirty = true;
    },

    /**
     * <p>Removes the quad that is located at a certain index and inserts it at a new index <br />
     * This operation is faster than removing and inserting in a quad in 2 different steps</p>
     * @method insertQuadFromIndex
     * @param {Number} fromIndex
     * @param {Number} newIndex
     */
    insertQuadFromIndex: function (fromIndex, newIndex) {
        if (fromIndex === newIndex)
            return;

        cc.assertID(newIndex >= 0 || newIndex < this._totalQuads, 2907);

        cc.assertID(fromIndex >= 0 || fromIndex < this._totalQuads, 2908);

        var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        var locQuadsReader = this._quadsReader;
        var sourceArr = locQuadsReader.subarray(fromIndex * quadSize, quadSize);
        var startOffset, moveLength;
        if (fromIndex > newIndex) {
            startOffset = newIndex * quadSize;
            moveLength = (fromIndex - newIndex) * quadSize;
            locQuadsReader.set(locQuadsReader.subarray(startOffset, startOffset + moveLength), startOffset + quadSize);
            locQuadsReader.set(sourceArr, startOffset);
        } else {
            startOffset = (fromIndex + 1) * quadSize;
            moveLength = (newIndex - fromIndex) * quadSize;
            locQuadsReader.set(locQuadsReader.subarray(startOffset, startOffset + moveLength), startOffset - quadSize);
            locQuadsReader.set(sourceArr, newIndex * quadSize);
        }
        this.dirty = true;
    },

    /**
     * <p>Removes a quad at a given index number.<br />
     * The capacity remains the same, but the total number of quads to be drawn is reduced in 1 </p>
     * @method removeQuadAtIndex
     * @param {Number} index
     */
    removeQuadAtIndex: function (index) {
        cc.assertID(index < this._totalQuads, 2909);

        var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        this._totalQuads--;
        this._quads.length = this._totalQuads;
        if (index !== this._totalQuads) {
            //move data
            var startOffset = (index + 1) * quadSize;
            var moveLength = (this._totalQuads - index) * quadSize;
            this._quadsReader.set(this._quadsReader.subarray(startOffset, startOffset + moveLength), startOffset - quadSize);
        }
        this.dirty = true;
    },

    /**
     * Removes a given number of quads at a given index.
     * @method removeQuadsAtIndex
     * @param {Number} index
     * @param {Number} amount
     */
    removeQuadsAtIndex: function (index, amount) {
        cc.assertID(index + amount <= this._totalQuads, 2910);

        this._totalQuads -= amount;

        if (index !== this._totalQuads) {
            //move data
            var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
            var srcOffset = (index + amount) * quadSize;
            var moveLength = (this._totalQuads - index) * quadSize;
            var dstOffset = index * quadSize;
            this._quadsReader.set(this._quadsReader.subarray(srcOffset, srcOffset + moveLength), dstOffset);
        }
        this.dirty = true;
    },

    /**
     * <p>Removes all Quads. <br />
     * The TextureAtlas capacity remains untouched. No memory is freed.<br />
     * The total number of quads to be drawn will be 0</p>
     * @method removeAllQuads
     */
    removeAllQuads: function () {
        this._quads.length = 0;
        this._totalQuads = 0;
    },

    _setDirty: function (dirty) {
        this.dirty = dirty;
    },

    /**
     * <p>Resize the capacity of the CCTextureAtlas.<br />
     * The new capacity can be lower or higher than the current one<br />
     * It returns YES if the resize was successful. <br />
     * If it fails to resize the capacity it will return NO with a new capacity of 0. <br />
     * no used for js</p>
     * @method resizeCapacity
     * @param {Number} newCapacity
     * @return {Boolean}
     */
    resizeCapacity: function (newCapacity) {
        if (newCapacity === this._capacity)
            return true;

        var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        var oldCapacity = this._capacity;
        // update capacity and totolQuads
        this._totalQuads = Math.min(this._totalQuads, newCapacity);
        this._capacity = 0 | newCapacity;
        var i, capacity = this._capacity, locTotalQuads = this._totalQuads;

        if (this._quads === null) {
            this._quads = [];
            this._quadsArrayBuffer = new ArrayBuffer(quadSize * capacity);
            this._quadsReader = new Uint8Array(this._quadsArrayBuffer);
            for (i = 0; i < capacity; i++)
                this._quads = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._quadsArrayBuffer, i * quadSize);
        } else {
            var newQuads, newArrayBuffer, quads = this._quads;
            if (capacity > oldCapacity) {
                newQuads = [];
                newArrayBuffer = new ArrayBuffer(quadSize * capacity);
                for (i = 0; i < locTotalQuads; i++) {
                    newQuads[i] = new cc.V3F_C4B_T2F_Quad(quads[i].tl, quads[i].bl, quads[i].tr, quads[i].br,
                        newArrayBuffer, i * quadSize);
                }
                for (; i < capacity; i++)
                    newQuads[i] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, newArrayBuffer, i * quadSize);

                this._quadsReader = new Uint8Array(newArrayBuffer);
                this._quads = newQuads;
                this._quadsArrayBuffer = newArrayBuffer;
            } else {
                var count = Math.max(locTotalQuads, capacity);
                newQuads = [];
                newArrayBuffer = new ArrayBuffer(quadSize * capacity);
                for (i = 0; i < count; i++) {
                    newQuads[i] = new cc.V3F_C4B_T2F_Quad(quads[i].tl, quads[i].bl, quads[i].tr, quads[i].br,
                        newArrayBuffer, i * quadSize);
                }
                this._quadsReader = new Uint8Array(newArrayBuffer);
                this._quads = newQuads;
                this._quadsArrayBuffer = newArrayBuffer;
            }
        }

        if (this._indices === null) {
            this._indices = new Uint16Array(capacity * 6);
        } else {
            if (capacity > oldCapacity) {
                var tempIndices = new Uint16Array(capacity * 6);
                tempIndices.set(this._indices, 0);
                this._indices = tempIndices;
            } else {
                this._indices = this._indices.subarray(0, capacity * 6);
            }
        }

        this._setupIndices();
        this._mapBuffers();
        this.dirty = true;
        return true;
    },

    /**
     * Used internally by CCParticleBatchNode                                    <br/>
     * don't use this unless you know what you're doing.
     * @method increaseTotalQuadsWith
     * @param {Number} amount
     */
    increaseTotalQuadsWith: function (amount) {
        this._totalQuads += amount;
    },

    /**
     * Moves an amount of quads from oldIndex at newIndex.
     * @method moveQuadsFromIndex
     * @param {Number} oldIndex
     * @param {Number} amount
     * @param {Number} newIndex
     */
    moveQuadsFromIndex: function (oldIndex, amount, newIndex) {
        if (newIndex === undefined) {
            newIndex = amount;
            amount = this._totalQuads - oldIndex;

            cc.assertID((newIndex + (this._totalQuads - oldIndex)) <= this._capacity, 2911);

            if (amount === 0)
                return;
        } else {
            cc.assertID((newIndex + amount) <= this._totalQuads, 2912);
            cc.assertID(oldIndex < this._totalQuads, 2913);

            if (oldIndex === newIndex)
                return;
        }

        var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        var srcOffset = oldIndex * quadSize;
        var srcLength = amount * quadSize;
        var locQuadsReader = this._quadsReader;
        var sourceArr = locQuadsReader.subarray(srcOffset, srcOffset + srcLength);
        var dstOffset = newIndex * quadSize;
        var moveLength, moveStart;
        if (newIndex < oldIndex) {
            moveLength = (oldIndex - newIndex) * quadSize;
            moveStart = newIndex * quadSize;
            locQuadsReader.set(locQuadsReader.subarray(moveStart, moveStart + moveLength), moveStart + srcLength)
        } else {
            moveLength = (newIndex - oldIndex) * quadSize;
            moveStart = (oldIndex + amount) * quadSize;
            locQuadsReader.set(locQuadsReader.subarray(moveStart, moveStart + moveLength), srcOffset);
        }
        locQuadsReader.set(sourceArr, dstOffset);
        this.dirty = true;
    },

    /**
     * Ensures that after a realloc quads are still empty                                <br/>
     * Used internally by CCParticleBatchNode.
     * @method fillWithEmptyQuadsFromIndex
     * @param {Number} index
     * @param {Number} amount
     */
    fillWithEmptyQuadsFromIndex: function (index, amount) {
        var count = amount * cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        var clearReader = new Uint8Array(this._quadsArrayBuffer, index * cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT, count);
        for (var i = 0; i < count; i++)
            clearReader[i] = 0;
    },

    _setupVBO: function () {},
    _mapBuffers: function () {},

    // TextureAtlas - Drawing

    /**
     * Draws all the Atlas's Quads
     */
    drawQuads: function () {},

    /**
     * <p>Draws n quads from an index (offset). <br />
     * n + start can't be greater than the capacity of the atlas</p>
     *
     * @method drawNumberOfQuads
     * @param {Number} n
     * @param {Number} start
     */
    drawNumberOfQuads: null,

    _releaseBuffer: function () {
        var gl = cc._renderContext;
        if (this._buffersVBO) {
            if (this._buffersVBO[0])
                gl.deleteBuffer(this._buffersVBO[0]);
            if (this._buffersVBO[1])
                gl.deleteBuffer(this._buffersVBO[1])
        }
        if (this._quadsWebBuffer)
            gl.deleteBuffer(this._quadsWebBuffer);
    }
});

var _p = TextureAtlas.prototype;

// Extended properties
/** @expose */
_p.totalQuads;
cc.defineGetterSetter(_p, "totalQuads", _p.getTotalQuads);
/** @expose */
_p.capacity;
cc.defineGetterSetter(_p, "capacity", _p.getCapacity);
/** @expose */
_p.quads;
cc.defineGetterSetter(_p, "quads", _p.getQuads, _p.setQuads);

game.once(game.EVENT_RENDERER_INITED, function () {
if (cc._renderType === game.RENDER_TYPE_WEBGL) {
    TextureAtlas.prototype._setupVBO = function () {
        var _t = this;
        var gl = cc._renderContext;
        //create WebGLBuffer
        _t._buffersVBO[0] = gl.createBuffer();
        _t._buffersVBO[1] = gl.createBuffer();

        _t._quadsWebBuffer = gl.createBuffer();
        _t._mapBuffers();
    };

    TextureAtlas.prototype._mapBuffers = function () {
        var _t = this;
        var gl = cc._renderContext;

        gl.bindBuffer(gl.ARRAY_BUFFER, _t._quadsWebBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, _t._quadsArrayBuffer, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _t._buffersVBO[1]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _t._indices, gl.STATIC_DRAW);

        //cc.checkGLErrorDebug();
    };

    TextureAtlas.prototype.drawQuads = function () {
        this.drawNumberOfQuads(this._totalQuads, 0);
    };

    TextureAtlas.prototype.drawNumberOfQuads = function (n, start) {
        var _t = this;
        start = start || 0;
        if (0 === n || !_t.texture || !_t.texture.isLoaded())
            return;

        var gl = cc._renderContext;
        cc.gl.bindTexture2D(_t.texture);

        //
        // Using VBO without VAO
        //
        //vertices
        //gl.bindBuffer(gl.ARRAY_BUFFER, _t._buffersVBO[0]);
        // XXX: update is done in draw... perhaps it should be done in a timer
        gl.bindBuffer(gl.ARRAY_BUFFER, _t._quadsWebBuffer);
        gl.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_POSITION);
        gl.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_COLOR);
        gl.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        if (_t.dirty){
            gl.bufferData(gl.ARRAY_BUFFER, _t._quadsArrayBuffer, gl.DYNAMIC_DRAW);
            _t.dirty = false;
        }

        gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);               // vertices
        gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);          // colors
        gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, 16);            // tex coords

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _t._buffersVBO[1]);

        if (cc.macro.TEXTURE_ATLAS_USE_TRIANGLE_STRIP)
            gl.drawElements(gl.TRIANGLE_STRIP, n * 6, gl.UNSIGNED_SHORT, start * 6 * _t._indices.BYTES_PER_ELEMENT);
        else
            gl.drawElements(gl.TRIANGLES, n * 6, gl.UNSIGNED_SHORT, start * 6 * _t._indices.BYTES_PER_ELEMENT);

        cc.g_NumberOfDraws++;
        //cc.checkGLErrorDebug();
    };
}
});

/**
 * Indicates whether or not the array buffer of the VBO needs to be updated.
 * @property dirty
 * @type {Boolean}
 */

/**
 * Image texture for cc.TextureAtlas.
 * @property texture
 * @type {Texture2D}
 */

/**
 * Quantity of quads that can be stored with the current texture atlas size.
 * @property capacity
 * @type {Number}
 * @readonly
 */

/**
 * Quantity of quads that are going to be drawn.
 * @property totalQuads
 * @type {Number}
 * @readonly
 */

/**
 * Quads that are going to be rendered.
 * @property quads
 * @type {Array}
 * @readonly
 */

cc.TextureAtlas = module.exports = TextureAtlas;
