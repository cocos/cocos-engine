/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2008-2009 Jason Booth

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
 * converts a line to a polygon
 * @param {Float32Array} points
 * @param {Number} stroke
 * @param {Float32Array} vertices
 * @param {Number} offset
 * @param {Number} nuPoints
 */
function vertexLineToPolygon (points, stroke, vertices, offset, nuPoints) {
    nuPoints += offset;
    if (nuPoints <= 1)
        return;

    stroke *= 0.5;
    var idx;
    var nuPointsMinus = nuPoints - 1;
    for (var i = offset; i < nuPoints; i++) {
        idx = i * 2;
        var p1 = cc.p(points[i * 2], points[i * 2 + 1]);
        var perpVector;

        if (i === 0)
            perpVector = cc.pPerp(cc.pNormalize(cc.pSub(p1, cc.p(points[(i + 1) * 2], points[(i + 1) * 2 + 1]))));
        else if (i === nuPointsMinus)
            perpVector = cc.pPerp(cc.pNormalize(cc.pSub(cc.p(points[(i - 1) * 2], points[(i - 1) * 2 + 1]), p1)));
        else {
            var p0 = cc.p(points[(i - 1) * 2], points[(i - 1) * 2 + 1]);
            var p2 = cc.p(points[(i + 1) * 2], points[(i + 1) * 2 + 1]);

            var p2p1 = cc.pNormalize(cc.pSub(p2, p1));
            var p0p1 = cc.pNormalize(cc.pSub(p0, p1));

            // Calculate angle between vectors
            var angle = Math.acos(cc.pDot(p2p1, p0p1));

            if (angle < cc.degreesToRadians(70))
                perpVector = cc.pPerp(cc.pNormalize(cc.pMidpoint(p2p1, p0p1)));
            else if (angle < cc.degreesToRadians(170))
                perpVector = cc.pNormalize(cc.pMidpoint(p2p1, p0p1));
            else
                perpVector = cc.pPerp(cc.pNormalize(cc.pSub(p2, p0)));
        }
        perpVector = cc.pMult(perpVector, stroke);

        vertices[idx * 2] = p1.x + perpVector.x;
        vertices[idx * 2 + 1] = p1.y + perpVector.y;
        vertices[(idx + 1) * 2] = p1.x - perpVector.x;
        vertices[(idx + 1) * 2 + 1] = p1.y - perpVector.y;
    }

    // Validate vertexes
    offset = (offset === 0) ? 0 : offset - 1;
    for (i = offset; i < nuPointsMinus; i++) {
        idx = i * 2;
        var idx1 = idx + 2;

        var v1 = cc.v2(vertices[idx * 2], vertices[idx * 2 + 1]);
        var v2 = cc.v2(vertices[(idx + 1) * 2], vertices[(idx + 1) * 2 + 1]);
        var v3 = cc.v2(vertices[idx1 * 2], vertices[idx1 * 2 + 1]);
        var v4 = cc.v2(vertices[(idx1 + 1) * 2], vertices[(idx1 + 1) * 2 + 1]);

        //BOOL fixVertex = !ccpLineIntersect(ccp(p1.x, p1.y), ccp(p4.x, p4.y), ccp(p2.x, p2.y), ccp(p3.x, p3.y), &s, &t);
        var fixVertexResult = vertexLineIntersect(v1.x, v1.y, v4.x, v4.y, v2.x, v2.y, v3.x, v3.y);
        var isSuccess = !fixVertexResult.isSuccess;
        if (!isSuccess)
            if (fixVertexResult.value < 0.0 || fixVertexResult.value > 1.0)
                isSuccess = true;

        if (isSuccess) {
            vertices[idx1 * 2] = v4.x;
            vertices[idx1 * 2 + 1] = v4.y;
            vertices[(idx1 + 1) * 2] = v3.x;
            vertices[(idx1 + 1) * 2 + 1] = v3.y;
        }
    }
}

/**
 * returns whether or not the line intersects
 * @param {Number} Ax
 * @param {Number} Ay
 * @param {Number} Bx
 * @param {Number} By
 * @param {Number} Cx
 * @param {Number} Cy
 * @param {Number} Dx
 * @param {Number} Dy
 * @return {Object}
 */
function vertexLineIntersect (Ax, Ay, Bx, By, Cx, Cy, Dx, Dy) {
    var distAB, theCos, theSin, newX;

    // FAIL: Line undefined
    if ((Ax === Bx && Ay === By) || (Cx === Dx && Cy === Dy))
        return {isSuccess:false, value:0};

    //  Translate system to make A the origin
    Bx -= Ax;
    By -= Ay;
    Cx -= Ax;
    Cy -= Ay;
    Dx -= Ax;
    Dy -= Ay;

    // Length of segment AB
    distAB = Math.sqrt(Bx * Bx + By * By);

    // Rotate the system so that point B is on the positive X axis.
    theCos = Bx / distAB;
    theSin = By / distAB;
    newX = Cx * theCos + Cy * theSin;
    Cy = Cy * theCos - Cx * theSin;
    Cx = newX;
    newX = Dx * theCos + Dy * theSin;
    Dy = Dy * theCos - Dx * theSin;
    Dx = newX;

    // FAIL: Lines are parallel.
    if (Cy === Dy) return {isSuccess:false, value:0};

    // Discover the relative position of the intersection in the line AB
    var t = (Dx + (Cx - Dx) * Dy / (Dy - Cy)) / distAB;

    // Success.
    return {isSuccess:true, value:t};
}

/**
 * returns wheter or not polygon defined by vertex list is clockwise
 * @param {Array} verts
 * @return {Boolean}
 */
function vertexListIsClockwise (verts) {
    for (var i = 0, len = verts.length; i < len; i++) {
        var a = verts[i];
        var b = verts[(i + 1) % len];
        var c = verts[(i + 2) % len];

        if (cc.pCross(cc.pSub(b, a), cc.pSub(c, b)) > 0)
            return false;
    }

    return true;
}

/**
 * cc.MotionStreak manages a Ribbon based on it's motion in absolute space.                 <br/>
 * You construct it with a fadeTime, minimum segment size, texture path, texture            <br/>
 * length and color. The fadeTime controls how long it takes each vertex in                 <br/>
 * the streak to fade out, the minimum segment size it how many pixels the                  <br/>
 * streak will move before adding a new ribbon segment, and the texture                     <br/>
 * length is the how many pixels the texture is stretched across. The texture               <br/>
 * is vertically aligned along the streak segment.
 * @class
 * @extends _ccsg.Node
 *
 * @property {Texture2D} texture                         - Texture used for the motion streak.
 * @property {Boolean}      fastMode                        - Indicate whether use fast mode.
 * @property {Boolean}      startingPositionInitialized     - Indicate whether starting position initialized.
 * @example
 * //example
 * new _ccsg.MotionStreak(2, 3, 32, cc.Color.GREEN, s_streak);
 */
_ccsg.MotionStreak = _ccsg.Node.extend({
    texture: null,
    fastMode: false,
    startingPositionInitialized: false,

    _blendFunc: null,

    _stroke: 0,
    _fadeDelta: 0,
    _minSeg: 0,

    _maxPoints: 0,
    _nuPoints: 0,
    _previousNuPoints: 0,

    /* Pointers */
    _pointVertexes: null,
    _pointState: null,

    // webgl
    _vertices: null,
    _colorPointer: null,
    _texCoords: null,

    _verticesBuffer: null,
    _colorPointerBuffer: null,
    _texCoordsBuffer: null,
    _className: "MotionStreak",

    /**
     * creates and initializes a motion streak with fade in seconds, minimum segments, stroke's width, color, texture filename or texture   <br/>
     * Constructor of cc.MotionStreak
     * @param {Number} fade time to fade
     * @param {Number} minSeg minimum segment size
     * @param {Number} stroke stroke's width
     * @param {Number} color
     * @param {string|cc.Texture2D} texture texture filename or texture
     */
    ctor: function (fade, minSeg, stroke, color, texture) {
        _ccsg.Node.prototype.ctor.call(this);
        this._positionR = cc.p(0, 0);
        this._blendFunc = new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);

        this.fastMode = false;
        this.startingPositionInitialized = false;

        this.texture = null;

        this._stroke = 0;
        this._fadeDelta = 0;
        this._minSeg = 0;

        this._maxPoints = 0;
        this._nuPoints = 0;
        this._previousNuPoints = 0;

        /** Pointers */
        this._pointVertexes = null;
        this._pointState = null;

        // webgl
        this._vertices = null;
        this._colorPointer = null;
        this._texCoords = null;

        this._verticesBuffer = null;
        this._colorPointerBuffer = null;
        this._texCoordsBuffer = null;

        if(texture !== undefined)
            this.initWithFade(fade, minSeg, stroke, color, texture);
    },

    /**
     * initializes a motion streak with fade in seconds, minimum segments, stroke's width, color and texture filename or texture
     * @param {Number} fade time to fade
     * @param {Number} minSeg minimum segment size
     * @param {Number} stroke stroke's width
     * @param {Number} color
     * @param {string|cc.Texture2D} texture texture filename or texture
     * @return {Boolean}
     */
    initWithFade:function (fade, minSeg, stroke, color, texture) {

        if (cc.js.isString(texture))
            texture = cc.textureUtil.loadImage(texture);

        this.anchorX = 0;
        this.anchorY = 0;
        this.ignoreAnchor = true;
        this.startingPositionInitialized = false;

        this.fastMode = true;
        this._stroke = stroke;
        this.setMinSeg(minSeg);
        this.setFadeTime(fade);

        // Set blend mode
        this._blendFunc.src = gl.SRC_ALPHA;
        this._blendFunc.dst = gl.ONE_MINUS_SRC_ALPHA;

        this.setTexture(texture);
        this.color = color;
        this.scheduleUpdate();

        return true;
    },

    /**
     * Gets the texture.
     * @return {Texture2D}
     */
    getTexture:function () {
        return this.texture;
    },

    /**
     * Set the texture.
     * @param {Texture2D} texture
     */
    setTexture:function (texture) {
        if (this.texture !== texture)
            this.texture = texture;
    },

    /**
     * Gets the blend func.
     * @return {cc.BlendFunc}
     */
    getBlendFunc:function () {
        return this._blendFunc;
    },

    /**
     * Set the blend func.
     * @param {Number} src
     * @param {Number} dst
     */
    setBlendFunc:function (src, dst) {
        if (dst === undefined) {
            this._blendFunc = src;
        } else {
            this._blendFunc.src = src;
            this._blendFunc.dst = dst;
        }
    },

    /**
     * Gets opacity.
     * @warning cc.MotionStreak.getOpacity has not been supported.
     * @returns {number}
     */
    getOpacity:function () {
        cc.logID(5901);
        return 0;
    },

    /**
     * Set opacity.
     * @warning cc.MotionStreak.setOpacity has not been supported.
     * @param opacity
     */
    setOpacity:function (opacity) {
        cc.logID(5902);
    },

    /**
     * Set opacity modify RGB.
     * @warning cc.MotionStreak.setOpacityModifyRGB has not been supported.
     * @param value
     */
    setOpacityModifyRGB:function (value) {
    },

    /**
     * Checking OpacityModifyRGB.
     * @returns {boolean}
     */
    isOpacityModifyRGB:function () {
        return false;
    },

    /**
     * Get Fade Time.
     * @returns {Number}
     */
    getFadeTime: function () {
        return 1.0 / this._fadeDelta;
    },

    /**
     * Set Fade Time.
     * @param {Number} fade
     */
    setFadeTime: function (fade) {
        this._fadeDelta = 1.0 / fade;

        var locMaxPoints = (0 | (fade * 60)) + 2;
        this._maxPoints = locMaxPoints;
        this._nuPoints = 0;
        this._pointState = new Float32Array(locMaxPoints);
        this._pointVertexes = new Float32Array(locMaxPoints * 2);

        this._vertices = new Float32Array(locMaxPoints * 4);
        this._texCoords = new Float32Array(locMaxPoints * 4);
        this._colorPointer = new Uint8Array(locMaxPoints * 8);

        this._verticesBuffer = gl.createBuffer();
        this._texCoordsBuffer = gl.createBuffer();
        this._colorPointerBuffer = gl.createBuffer();

        //bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this._verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._texCoords, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._colorPointerBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._colorPointer, gl.DYNAMIC_DRAW);
    },

    /**
     * Get Minimum Segment Size.
     * @return {Number}
     */
    getMinSeg: function () {
        return this._minSeg;
    },

    /**
     * Set Minimum Segment Size.
     * @param {Number} minSeg
     */
    setMinSeg: function (minSeg) {
        this._minSeg = (minSeg === -1.0) ? (this._stroke / 5.0) : minSeg;
        this._minSeg *= this._minSeg;
    },

    /**
     * Checking fast mode.
     * @returns {boolean}
     */
    isFastMode:function () {
        return this.fastMode;
    },

    /**
     * set fast mode
     * @param {Boolean} fastMode
     */
    setFastMode:function (fastMode) {
        this.fastMode = fastMode;
    },

    /**
     * Checking starting position initialized.
     * @returns {boolean}
     */
    isStartingPositionInitialized:function () {
        return this.startingPositionInitialized;
    },

    /**
     * Set Starting Position Initialized.
     * @param {Boolean} startingPositionInitialized
     */
    setStartingPositionInitialized:function (startingPositionInitialized) {
        this.startingPositionInitialized = startingPositionInitialized;
    },

    /**
     * Get stroke.
     * @returns {Number} stroke
     */
    getStroke:function () {
        return this._stroke;
    },

    /**
     * Set stroke.
     * @param {Number} stroke
     */
    setStroke:function (stroke) {
        this._stroke = stroke;
    },

    /**
     * color used for the tint
     * @param {cc.Color} color
     */
    tintWithColor:function (color) {
        this.color = color;

        // Fast assignation
        var locColorPointer = this._colorPointer;
        for (var i = 0, len = this._nuPoints * 2; i < len; i++) {
            locColorPointer[i * 4] = color.r;
            locColorPointer[i * 4 + 1] = color.g;
            locColorPointer[i * 4 + 2] = color.b;
        }
    },

    /**
     * Remove all living segments of the ribbon
     */
    reset:function () {
        this._nuPoints = 0;
    },

    /**
     * Set the position. <br />
     *
     * @param {cc.Point|Number} position
     * @param {Number} [yValue=undefined] If not exists, the first parameter must be cc.Point.
     */
    setPosition:function (position, yValue) {
        this.startingPositionInitialized = true;
        if(yValue === undefined){
            this._positionR.x = position.x;
            this._positionR.y = position.y;
        } else {
            this._positionR.x = position;
            this._positionR.y = yValue;
        }
    },

    /**
     * Gets the position.x
     * @return {Number}
     */
    getPositionX:function () {
        return this._positionR.x;
    },

    /**
     * Set the position.x
     * @param {Number} x
     */
    setPositionX:function (x) {
        this._positionR.x = x;
        if(!this.startingPositionInitialized)
            this.startingPositionInitialized = true;
    },

    /**
     * Gets the position.y
     * @return {Number}
     */
    getPositionY:function () {
        return  this._positionR.y;
    },

    /**
     * Set the position.y
     * @param {Number} y
     */
    setPositionY:function (y) {
        this._positionR.y = y;
        if(!this.startingPositionInitialized)
            this.startingPositionInitialized = true;
    },

    /**
     * <p>schedules the "update" method.                                                                           <br/>
     * It will use the order number 0. This method will be called every frame.                                  <br/>
     * Scheduled methods with a lower order value will be called before the ones that have a higher order value.<br/>
     * Only one "update" method could be scheduled per node.</p>
     * @param {Number} delta
     */
    update:function (delta) {
        if (!this.startingPositionInitialized)
            return;

        delta *= this._fadeDelta;

        var newIdx, newIdx2, i, i2;
        var mov = 0;

        // Update current points
        var locNuPoints = this._nuPoints;
        var locPointState = this._pointState, locPointVertexes = this._pointVertexes, locVertices = this._vertices;
        var locColorPointer = this._colorPointer;

        for (i = 0; i < locNuPoints; i++) {
            locPointState[i] -= delta;

            if (locPointState[i] <= 0)
                mov++;
            else {
                newIdx = i - mov;
                if (mov > 0) {
                    // Move data
                    locPointState[newIdx] = locPointState[i];
                    // Move point
                    locPointVertexes[newIdx * 2] = locPointVertexes[i * 2];
                    locPointVertexes[newIdx * 2 + 1] = locPointVertexes[i * 2 + 1];

                    // Move vertices
                    i2 = i * 2;
                    newIdx2 = newIdx * 2;
                    locVertices[newIdx2 * 2] = locVertices[i2 * 2];
                    locVertices[newIdx2 * 2 + 1] = locVertices[i2 * 2 + 1];
                    locVertices[(newIdx2 + 1) * 2] = locVertices[(i2 + 1) * 2];
                    locVertices[(newIdx2 + 1) * 2 + 1] = locVertices[(i2 + 1) * 2 + 1];

                    // Move color
                    i2 *= 4;
                    newIdx2 *= 4;
                    locColorPointer[newIdx2 + 0] = locColorPointer[i2 + 0];
                    locColorPointer[newIdx2 + 1] = locColorPointer[i2 + 1];
                    locColorPointer[newIdx2 + 2] = locColorPointer[i2 + 2];
                    locColorPointer[newIdx2 + 4] = locColorPointer[i2 + 4];
                    locColorPointer[newIdx2 + 5] = locColorPointer[i2 + 5];
                    locColorPointer[newIdx2 + 6] = locColorPointer[i2 + 6];
                } else
                    newIdx2 = newIdx * 8;

                var op = locPointState[newIdx] * 255.0;
                locColorPointer[newIdx2 + 3] = op;
                locColorPointer[newIdx2 + 7] = op;
            }
        }
        locNuPoints -= mov;

        // Append new point
        var appendNewPoint = true;
        if (locNuPoints >= this._maxPoints)
            appendNewPoint = false;
        else if (locNuPoints > 0) {
            var locPoint1 = cc.p(locPointVertexes[(locNuPoints - 1) * 2], locPointVertexes[(locNuPoints - 1) * 2 + 1]);
            var a1 = cc.pDistanceSQ(locPoint1, this._positionR) < this._minSeg;
            var locPoint2 = cc.p(locPointVertexes[(locNuPoints - 2) * 2], locPointVertexes[(locNuPoints - 2) * 2 + 1]);
            var a2 = (locNuPoints === 1) ? false : (cc.pDistanceSQ(locPoint2, this._positionR) < (this._minSeg * 2.0));
            if (a1 || a2)
                appendNewPoint = false;
        }

        if (appendNewPoint) {
            locPointVertexes[locNuPoints * 2] = this._positionR.x;
            locPointVertexes[locNuPoints * 2 + 1] = this._positionR.y;
            locPointState[locNuPoints] = 1.0;

            // Color assignment
            var offset = locNuPoints * 8;

            var locDisplayedColor = this.getDisplayedColor();
            locColorPointer[offset] = locDisplayedColor.r;
            locColorPointer[offset + 1] = locDisplayedColor.g;
            locColorPointer[offset + 2] = locDisplayedColor.b;
            //*((ccColor3B*)(m_pColorPointer + offset+4)) = this._color;
            locColorPointer[offset + 4] = locDisplayedColor.r;
            locColorPointer[offset + 5] = locDisplayedColor.g;
            locColorPointer[offset + 6] = locDisplayedColor.b;

            // Opacity
            locColorPointer[offset + 3] = 255;
            locColorPointer[offset + 7] = 255;

            // Generate polygon
            if (locNuPoints > 0 && this.fastMode) {
                if (locNuPoints > 1)
                    vertexLineToPolygon(locPointVertexes, this._stroke, this._vertices, locNuPoints, 1);
                else
                    vertexLineToPolygon(locPointVertexes, this._stroke, this._vertices, 0, 2);
            }
            locNuPoints++;
        }

        if (!this.fastMode)
            vertexLineToPolygon(locPointVertexes, this._stroke, this._vertices, 0, locNuPoints);

        // Updated Tex Coords only if they are different than previous step
        if (locNuPoints && this._previousNuPoints !== locNuPoints) {
            var texDelta = 1.0 / locNuPoints;
            var locTexCoords = this._texCoords;
            for (i = 0; i < locNuPoints; i++) {
                locTexCoords[i * 4] = 0;
                locTexCoords[i * 4 + 1] = texDelta * i;

                locTexCoords[(i * 2 + 1) * 2] = 1;
                locTexCoords[(i * 2 + 1) * 2 + 1] = texDelta * i;
            }

            this._previousNuPoints = locNuPoints;
        }

        this._nuPoints = locNuPoints;
    },

    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            return new _ccsg.MotionStreak.WebGLRenderCmd(this);
        else
            return null;  //MotionStreak doesn't support Canvas mode
    }
});

// fireball#2856

var motionStreakPro = _ccsg.MotionStreak.prototype;
Object.defineProperty(motionStreakPro, 'x', {
    get: motionStreakPro.getPositionX,
    set: motionStreakPro.setPositionX
});

Object.defineProperty(motionStreakPro, 'y', {
    get: motionStreakPro.getPositionY,
    set: motionStreakPro.setPositionY
});
