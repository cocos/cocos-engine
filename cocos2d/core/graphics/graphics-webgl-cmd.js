/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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
 
var Shader      = require('./shader');

var LineCap     = require('./types').LineCap;
var LineJoin    = require('./types').LineJoin;

var Earcut = require('./earcut');

var Helper = require('./helper');

var Vec2  = cc.Vec2;
var Js    = cc.js;

// Math
var INIT_VERTS_SIZE = 32;

var VERTS_FLOAT_LENGTH = 2;
var VERTS_BYTE_LENGTH  = 8;

var PI      = Math.PI;
var min     = Math.min;
var max     = Math.max;
var ceil    = Math.ceil;
var acos    = Math.acos;
var cos     = Math.cos;
var sin     = Math.sin;
var atan2   = Math.atan2;
var abs     = Math.abs;

function clamp (v, min, max) {
    if (v < min) {
        return min;
    }
    else if (v > max) {
        return max;
    }
    return v;
}

// PointFlags
var PointFlags =  cc.Enum({
    PT_CORNER: 0x01,
    PT_LEFT: 0x02,
    PT_BEVEL: 0x04,
    PT_INNERBEVEL: 0x08,
});

// Point
function Point (x, y) {
    Vec2.call(this, x, y);
    this.reset();
}
Js.extend(Point, Vec2);

Js.mixin(Point.prototype, {
    reset: function () {
        this.dx = 0;
        this.dy = 0;
        this.dmx = 0;
        this.dmy = 0;
        this.flags = 0;
        this.len = 0;
    }
});

// Path
function Path () {
    this.reset();
}
Path.prototype.reset = function () {
    this.closed = false;
    this.nbevel = 0;
    this.complex = true;

    if (this.points) {
        this.points.length = 0;
    }
    else {
        this.points = [];
    }
};

// webgl render command
function WebGLRenderCmd (renderable) {
    this._rootCtor(renderable);
    this._needDraw = true;

    var gl = cc._renderContext;

    this._vertsOffset = 0;
    this._vertsVBO = gl.createBuffer();
    this._vertsBuffer = null;
    this._vertsDirty = false;

    this._indicesOffset = 0;
    this._indicesVBO = gl.createBuffer();
    this._indicesBuffer = null;
    this._indicesDirty = false;

    this._matrix = new cc.math.Matrix4();
    this._matrix.identity();

    this._paths = [];
    this._points = [];

    this._cmds = [];

    this._blendFunc = new cc.BlendFunc(cc.macro.BLEND_SRC, cc.macro.BLEND_DST);

    // init shader
    this._shader = new cc.GLProgram();
    this._shader.initWithVertexShaderByteArray(Shader.vert, Shader.frag);
    this._shader.retain();
    this._shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
    this._shader.link();
    this._shader.updateUniforms();

    this._allocVerts(INIT_VERTS_SIZE);
}

WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
WebGLRenderCmd.prototype.constructor = WebGLRenderCmd;

var _p = WebGLRenderCmd.prototype;

// draw api
Js.mixin(_p, {
    _tessTol: 0.25, // Tessellation Tolerance
    _distTol: 0.01,

    lineWidth: 1,

    lineCap: LineCap.BUTT,
    lineJoin: LineJoin.MITER,

    miterLimit: 10,

    beginPath: function () {
        this._pathOffset = this._pathLength;
    },

    moveTo: function (x, y) {
        if (this._updatePathOffset) {
            this._pathOffset = this._pathLength;
            this._updatePathOffset = false;
        }

        this._addPath();
        this._addPoint(x, y, PointFlags.PT_CORNER);

        this._commandx = x;
        this._commandy = y;
    },

    lineTo: function (x, y) {
        this._addPoint(x, y, PointFlags.PT_CORNER);

        this._commandx = x;
        this._commandy = y;
    },

    bezierCurveTo: function (c1x, c1y, c2x, c2y, x, y) {
        var path = this._curPath;
        var last = path.points[path.points.length - 1];

        if (last.x === c1x && last.y === c1y && c2x === x && c2y === y) {
            this.lineTo(x, y);
            return;
        }

        this._tesselateBezier(last.x, last.y, c1x, c1y, c2x, c2y, x, y, 0, PointFlags.PT_CORNER);

        this._commandx = x;
        this._commandy = y;
    },

    quadraticCurveTo: function (cx, cy, x, y) {
        var x0 = this._commandx;
        var y0 = this._commandy;
        this.bezierCurveTo(x0 + 2.0 / 3.0 * (cx - x0), y0 + 2.0 / 3.0 * (cy - y0), x + 2.0 / 3.0 * (cx - x), y + 2.0 / 3.0 * (cy - y), x, y);
    },

    //
    arc: function (cx, cy, r, startAngle, endAngle, counterclockwise) {
        Helper.arc(this, cx, cy, r, startAngle, endAngle, counterclockwise);
    },

    ellipse: function (cx, cy, rx, ry) {
        Helper.ellipse(this, cx, cy, rx, ry);
        this._curPath.complex = false;
    },

    circle: function (cx, cy, r) {
        Helper.ellipse(this, cx, cy, r, r);
        this._curPath.complex = false;
    },

    rect: function (x, y, w, h) {
        this.moveTo(x, y);
        this.lineTo(x, y + h);
        this.lineTo(x + w, y + h);
        this.lineTo(x + w, y);
        this.close();
        this._curPath.complex = false;
    },

    roundRect: function (x, y, w, h, r) {
        Helper.roundRect(this, x, y, w, h, r);
        this._curPath.complex = false;
    },

    fillRect: function (x, y, w, h) {
        this.rect(x, y, w, h);

        this.fill();
    },

    close: function () {
        this._curPath.closed = true;
    },

    stroke: function () {
        this._flattenPaths();

        this._expandStroke();

        this._vertsDirty = true;
        this._updatePathOffset = true;
    },

    fill: function () {
        // this._flattenPaths();

        this._expandFill();

        this._vertsDirty = true;
        this._updatePathOffset = true;
        this._filling = false;
    }
});


// inner properties
Js.mixin(_p, {
    _strokeColor: null,
    _fillColor: null,

    setStrokeColor: function (c) {
        this._strokeColor = c;
    },

    getStrokeColor: function () {
        return this._strokeColor;
    },

    setFillColor: function (c) {
        this._fillColor = c;
    },

    getFillColor: function () {
        return this._fillColor;
    },

    setLineWidth: function (v) {
        this.lineWidth = v;
    },

    setLineJoin: function (v) {
        this.lineJoin = v;
    },

    setLineCap: function (v) {
        this.lineCap = v;
    },

    setMiterLimit: function (v) {
        this.miterLimit = v;
    }
});

cc.defineGetterSetter(_p, 'strokeColor', _p.getStrokeColor, _p.setStrokeColor);
cc.defineGetterSetter(_p, 'fillColor', _p.getFillColor, _p.setFillColor);

Js.mixin(_p, {
    _render: function () {
        var vertsBuffer = this._vertsBuffer;
        if (!vertsBuffer || vertsBuffer.length === 0 || this._cmds.length === 0) return;

        var gl = cc._renderContext;

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertsVBO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indicesVBO);

        if (this._vertsDirty) {
            gl.bufferData(gl.ARRAY_BUFFER, vertsBuffer, gl.STREAM_DRAW);
            this._vertsDirty = false;
        }

        if (this._indicesDirty && this._indicesBuffer) {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indicesBuffer, gl.STREAM_DRAW);
            this._indicesDirty = false;
        }

        if (this._vertsOffset > 65536) {
            cc.warnID(2401);
        }

        gl.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_POSITION);
        gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, VERTS_BYTE_LENGTH, 0);

        var shader = this._shader;
        var colorLocation = shader.getUniformLocationForName('color');

        // draw paths
        var cmds = this._cmds;
        for (var i = 0, l = cmds.length; i < l; i++) {
            var cmd = cmds[i];

            if (cmd.nIndices) {
                var color = cmd.color;
                gl.uniform4f(colorLocation, color.r / 255, color.g / 255, color.b / 255, color.a / 255);
                gl.drawElements(gl.TRIANGLES, cmd.nIndices, gl.UNSIGNED_SHORT, cmd.indicesOffset * 2);

                cc.incrementGLDraws(cmd.nverts);
            }
        }

        cc.checkGLErrorDebug();
    },

    rendering: function () {
        cc.gl.blendFunc(this._blendFunc.src, this._blendFunc.dst);

        var wt = this._worldTransform, mat = this._matrix.mat;
        mat[0] = wt.a;
        mat[4] = wt.c;
        mat[12] = wt.tx;
        mat[1] = wt.b;
        mat[5] = wt.d;
        mat[13] = wt.ty;

        var shader = this._shader;
        shader.use();
        shader._setUniformForMVPMatrixWithMat4(this._matrix);

        this._render();
    },

    // clear
    clear: function (clean) {
        this._vertsOffset = 0;
        this._indicesOffset = 0;

        this._pathLength = 0;
        this._pathOffset = 0;
        this._pointsOffset = 0;

        this._curPath = null;

        this._cmds.length = 0;

        if (clean) {
            this._paths.length = 0;
            this._points.length = 0;

            this._vertsBuffer = null;
            this._indicesBuffer = null;
        }
    },
});

// inner function
Js.mixin(_p, {
    _updatePathOffset: false,

    _paths: null,
    _pathLength: 0,
    _pathOffset: 0,

    _points: null,
    _pointsOffset: 0,

    _commandx: 0,
    _commandy: 0,

    _addPath: function () {
        var offset = this._pathLength;
        var path = this._paths[offset];

        if (!path) {
            path = new Path();

            this._paths.push(path);
        } else {
            path.reset();
        }

        this._pathLength++;
        this._curPath = path;

        return path;
    },

    _addPoint: function (x, y, flags) {
        var path = this._curPath;
        if (!path) return;

        var pt;
        var points = this._points;
        var pathPoints = path.points;

        var offset = this._pointsOffset++;
        pt = points[offset];

        if (!pt) {
            pt = new Point(x, y);
            points.push(pt);
        } else {
            pt.x = x;
            pt.y = y;
        }

        pt.flags = flags;
        pathPoints.push(pt);
    },

    _flattenPaths: function () {
        var paths = this._paths;
        for (var i = this._pathOffset, l = this._pathLength; i < l; i++) {
            var path = paths[i];
            var pts = path.points;

            var p0 = pts[pts.length - 1];
            var p1 = pts[0];

            if (p0.equals(p1)) {
                path.closed = true;
                pts.pop();
                p0 = pts[pts.length - 1];
            }

            for (var j = 0, size = pts.length; j < size; j++) {
                // Calculate segment direction and length
                var dPos = p1.sub(p0);
                p0.len = dPos.mag();
                if (dPos.x || dPos.y)
                    dPos.normalizeSelf();
                p0.dx = dPos.x;
                p0.dy = dPos.y;
                // Advance
                p0 = p1;
                p1 = pts[j + 1];
            }
        }
    },

    _allocVerts: function (cverts) {
        var dnverts = this._vertsOffset + cverts;
        var buffer = this._vertsBuffer;
        var nverts = buffer ? buffer.length / VERTS_FLOAT_LENGTH : 0;

        if (dnverts > nverts) {
            if (nverts === 0) {
                nverts = INIT_VERTS_SIZE;
            }

            while (dnverts > nverts) {
                nverts *= 2;
            }

            var newBuffer = new Float32Array(nverts * VERTS_FLOAT_LENGTH);

            if (buffer) {
                for (var i = 0, l = buffer.length; i < l; i++) {
                    newBuffer[i] = buffer[i];
                }
            }

            this._vertsBuffer = newBuffer;
        }
    },

    _allocIndices: function (cindices) {
        var indices = this._indicesBuffer;
        var dnindices = this._indicesOffset + cindices;
        var nindices = indices ? indices.length : 0;

        if (dnindices > nindices) {
            if (nindices === 0) {
                nindices = INIT_VERTS_SIZE * 3;
            }

            while (dnindices > nindices) {
                nindices *= 2;
            }

            var newIndices = new Uint16Array(nindices);

            if (indices) {
                for (var i = 0, l = indices.length; i < l; i++) {
                    newIndices[i] = indices[i];
                }
            }
            this._indicesBuffer = newIndices;
        }
    },

    _pushCmd: function (cmd) {
        var cmds = this._cmds;
        var lastCmd = cmds[cmds.length - 1];

        if (lastCmd) {
            var lastColor = lastCmd.color;
            var color = cmd.color;

            if (lastColor.r === color.r &&
                lastColor.g === color.g &&
                lastColor.b === color.b &&
                lastColor.a === color.a &&
                (lastCmd.indicesOffset + lastCmd.nIndices === cmd.indicesOffset)) {
                lastCmd.nIndices += cmd.nIndices;
                lastCmd.nverts += cmd.nverts;
            }
            else {
                cmds.push(cmd);
            }
        }
        else {
            cmds.push(cmd);
        }
    },

    _expandStroke: function () {
        var w = this.lineWidth * 0.5,
            lineCap = this.lineCap,
            lineJoin = this.lineJoin,
            miterLimit = this.miterLimit;

        var ncap = this._curveDivs(w, PI, this._tessTol);
        var paths = this._paths;

        this._calculateJoins(w, lineJoin, miterLimit);

        // Calculate max vertex usage.
        var cverts = 0;
        for (var i = this._pathOffset, l = this._pathLength; i < l; i++) {
            var path = paths[i];
            var pointsLength = path.points.length;

            if (lineJoin === LineJoin.ROUND) cverts += (pointsLength + path.nbevel * (ncap + 2) + 1) * 2; // plus one for loop
            else cverts += (pointsLength + path.nbevel * 5 + 1) * 2; // plus one for loop

            if (!path.closed) {
                // space for caps
                if (lineCap === LineCap.ROUND) {
                    cverts += (ncap * 2 + 2) * 2;
                } else {
                    cverts += (3 + 3) * 2;
                }
            }
        }

        this._allocVerts(cverts);
        this._allocIndices((cverts - 2*(this._pathLength-this._pathOffset)) * 3);

        for (var i = this._pathOffset, l = this._pathLength; i < l; i++) {
            var path = paths[i];
            var pts = path.points;
            var pointsLength = path.points.length;

            var p0, p1;
            var s, e, loop;

            loop = path.closed;
            var offset = this._vertsOffset;

            if (loop) {
                // Looping
                p0 = pts[pointsLength - 1];
                p1 = pts[0];
                s = 0;
                e = pointsLength;
            } else {
                // Add cap
                p0 = pts[0];
                p1 = pts[1];
                s = 1;
                e = pointsLength - 1;
            }

            if (!loop) {
                // Add cap
                var dPos = p1.sub(p0);
                dPos.normalizeSelf();

                var dx = dPos.x;
                var dy = dPos.y;

                if (lineCap === LineCap.BUTT) 
                    this._buttCap(p0, dx, dy, w, 0);
                else if (lineCap === LineCap.SQUARE) 
                    this._buttCap(p0, dx, dy, w, w);
                else if (lineCap === LineCap.ROUND) 
                    this._roundCapStart(p0, dx, dy, w, ncap);
            }

            for (var j = s; j < e; ++j) {
                if (lineJoin === LineJoin.ROUND) {
                    this._roundJoin(p0, p1, w, w, ncap);
                }
                else if ((p1.flags & (PointFlags.PT_BEVEL | PointFlags.PT_INNERBEVEL)) !== 0) {
                    this._bevelJoin(p0, p1, w, w);
                }
                else {
                    this._vset(p1.x + p1.dmx * w, p1.y + p1.dmy * w);
                    this._vset(p1.x - p1.dmx * w, p1.y - p1.dmy * w);
                }

                p0 = p1;
                p1 = pts[j + 1];
            }

            if (loop) {
                var v0 = this._vget(offset);
                var v1 = this._vget(offset + 1);
                // Loop it
                this._vset(v0.x, v0.y);
                this._vset(v1.x, v1.y);
            } else {
                // Add cap
                var dPos = p1.sub(p0);
                dPos.normalizeSelf();

                var dx = dPos.x;
                var dy = dPos.y;

                if (lineCap === LineCap.BUTT) 
                    this._buttCap(p1, dx, dy, w, 0);
                else if (lineCap === LineCap.BUTT || lineCap === LineCap.SQUARE) 
                    this._buttCap(p1, dx, dy, w, w);
                else if (lineCap === LineCap.ROUND) 
                    this._roundCapEnd(p1, dx, dy, w, ncap);
            }

            // stroke indices
            var indicesOffset = this._indicesOffset;
            var indicesBuffer = this._indicesBuffer;

            for (var start = offset+2, end = this._vertsOffset; start < end; start++) {
                indicesBuffer[indicesOffset++] = start - 2;
                indicesBuffer[indicesOffset++] = start - 1;
                indicesBuffer[indicesOffset++] = start;
            }

            this._pushCmd({
                color: this._strokeColor,
                indicesOffset: this._indicesOffset,
                nIndices: indicesOffset - this._indicesOffset,
                vertsOffset: offset,
                nverts: this._vertsOffset - offset
            });

            this._indicesOffset = indicesOffset;
            this._indicesDirty = true;
        }
    },

    _expandFill: function () {
        // this._calculateJoins(0, LineJoin.MITER, 2.4);

        var paths = this._paths;

        // Calculate max vertex usage.
        var cverts = 0;
        for (var i = this._pathOffset, l = this._pathLength; i < l; i++) {
            var path = paths[i];
            var pointsLength = path.points.length;

            cverts += pointsLength;
        }

        this._allocVerts(cverts);
        this._allocIndices((cverts - 2*(this._pathLength-this._pathOffset)) * 3);

        for (var i = this._pathOffset, l = this._pathLength; i < l; i++) {
            var path = paths[i];
            var pts = path.points;
            var pointsLength = pts.length;

            if (pointsLength === 0) {
                continue;
            }

            // Calculate shape vertices.
            var offset = this._vertsOffset;

            for (var j = 0; j < pointsLength; ++j) {
                this._vset(pts[j].x, pts[j].y, 0.5, 1);
            }

            var indicesOffset = path.indicesOffset = this._indicesOffset;
            var indicesBuffer = this._indicesBuffer;
            var nIndices = 0;

            if (path.complex) {
                var data = new Float32Array(this._vertsBuffer.buffer, offset * 8, (this._vertsOffset - offset) * 2); 
                var newIndices = Earcut(data, null, 2);

                if (!newIndices || newIndices.length === 0) {
                    continue;
                }

                nIndices = newIndices.length;

                for (var j = 0, l3 = nIndices; j < l3; j++) {
                    indicesBuffer[indicesOffset + j] = newIndices[j] + offset;
                }
            }
            else {
                var first = offset;
                for (var start = offset+2, end = this._vertsOffset; start < end; start++) {
                    indicesBuffer[indicesOffset++] = first;
                    indicesBuffer[indicesOffset++] = start - 1;
                    indicesBuffer[indicesOffset++] = start;
                }

                nIndices = indicesOffset - this._indicesOffset;
            }

            this._pushCmd({
                color: this._fillColor,
                indicesOffset: this._indicesOffset,
                nIndices: nIndices,
                vertsOffset: offset,
                nverts: this._vertsOffset - offset
            });

            this._indicesOffset += nIndices;
            this._indicesDirty = true;
        }
    },

    _curveDivs: function (r, arc, tol) {
        var da = acos(r / (r + tol)) * 2.0;
        return max(2, ceil(arc / da));
    },

    _calculateJoins: function (w, lineJoin, miterLimit) {
        var iw = 0.0;

        if (w > 0.0) {
            iw = 1 / w;
        }

        // Calculate which joins needs extra vertices to append, and gather vertex count.
        var paths = this._paths;

        for (var i = this._pathOffset, l = this._pathLength; i < l; i++) {
            var path = paths[i];

            var pts = path.points;
            var ptsLength = pts.length;
            var p0 = pts[ptsLength - 1];
            var p1 = pts[0];
            var nleft = 0;

            path.nbevel = 0;

            for (var j = 0; j < ptsLength; j++) {
                var dmr2, cross, limit;

                // perp normals
                var dlx0 = p0.dy;
                var dly0 = -p0.dx;
                var dlx1 = p1.dy;
                var dly1 = -p1.dx;

                // Calculate extrusions
                p1.dmx = (dlx0 + dlx1) * 0.5;
                p1.dmy = (dly0 + dly1) * 0.5;
                dmr2 = p1.dmx * p1.dmx + p1.dmy * p1.dmy;
                if (dmr2 > 0.000001) {
                    var scale = 1 / dmr2;
                    if (scale > 600) {
                        scale = 600;
                    }
                    p1.dmx *= scale;
                    p1.dmy *= scale;
                }

                // Keep track of left turns.
                cross = p1.dx * p0.dy - p0.dx * p1.dy;
                if (cross > 0) {
                    nleft++;
                    p1.flags |= PointFlags.PT_LEFT;
                }

                // Calculate if we should use bevel or miter for inner join.
                limit = max(11, min(p0.len, p1.len) * iw);
                if (dmr2 * limit * limit < 1) {
                    p1.flags |= PointFlags.PT_INNERBEVEL;
                }

                // Check to see if the corner needs to be beveled.
                if (p1.flags & PointFlags.PT_CORNER) {
                    if (dmr2 * miterLimit * miterLimit < 1 || lineJoin === LineJoin.BEVEL || lineJoin === LineJoin.ROUND) {
                        p1.flags |= PointFlags.PT_BEVEL;
                    }
                }

                if ((p1.flags & (PointFlags.PT_BEVEL | PointFlags.PT_INNERBEVEL)) !== 0) {
                    path.nbevel++;
                }

                p0 = p1;
                p1 = pts[j + 1];
            }
        }
    },

    _vset: function (x, y) {
        var offset = this._vertsOffset * VERTS_FLOAT_LENGTH;
        var buffer = this._vertsBuffer;

        buffer[offset] = x;
        buffer[offset + 1] = y;

        this._vertsOffset++;
    },

    _vget: function (index) {
        var buffer = this._vertsBuffer;
        var offset = index * VERTS_FLOAT_LENGTH;
        return {
            x: buffer[offset],
            y: buffer[offset + 1]
        };
    },

    //
    _chooseBevel: function (bevel, p0, p1, w) {
        var x = p1.x;
        var y = p1.y;
        var x0, y0, x1, y1;

        if (bevel !== 0) {
            x0 = x + p0.dy * w;
            y0 = y - p0.dx * w;
            x1 = x + p1.dy * w;
            y1 = y - p1.dx * w;
        } else {
            x0 = x1 = x + p1.dmx * w;
            y0 = y1 = y + p1.dmy * w;
        }

        return [x0, y0, x1, y1];
    },

    _buttCap: function (p, dx, dy, w, d) {
        var px = p.x - dx * d;
        var py = p.y - dy * d;
        var dlx = dy;
        var dly = -dx;

        this._vset(px + dlx * w, py + dly * w);
        this._vset(px - dlx * w, py - dly * w);
    },

    _roundCapStart: function (p, dx, dy, w, ncap) {
        var px = p.x;
        var py = p.y;
        var dlx = dy;
        var dly = -dx;

        for (var i = 0; i < ncap; i++) {
            var a = i / (ncap - 1) * PI;
            var ax = cos(a) * w,
                ay = sin(a) * w;
            this._vset(px - dlx * ax - dx * ay, py - dly * ax - dy * ay);
            this._vset(px, py);
        }
        this._vset(px + dlx * w, py + dly * w);
        this._vset(px - dlx * w, py - dly * w);
    },

    _roundCapEnd: function (p, dx, dy, w, ncap) {
        var px = p.x;
        var py = p.y;
        var dlx = dy;
        var dly = -dx;

        this._vset(px + dlx * w, py + dly * w);
        this._vset(px - dlx * w, py - dly * w);
        for (var i = 0; i < ncap; i++) {
            var a = i / (ncap - 1) * PI;
            var ax = cos(a) * w,
                ay = sin(a) * w;
            this._vset(px, py);
            this._vset(px - dlx * ax + dx * ay, py - dly * ax + dy * ay);
        }
    },

    _roundJoin: function (p0, p1, lw, rw, ncap) {
        var dlx0 = p0.dy;
        var dly0 = -p0.dx;
        var dlx1 = p1.dy;
        var dly1 = -p1.dx;

        var p1x = p1.x;
        var p1y = p1.y;

        if ((p1.flags & PointFlags.PT_LEFT) !== 0) {
            var out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, lw);
            var lx0 = out[0];
            var ly0 = out[1];
            var lx1 = out[2];
            var ly1 = out[3];

            var a0 = atan2(-dly0, -dlx0);
            var a1 = atan2(-dly1, -dlx1);
            if (a1 > a0) a1 -= PI * 2;

            this._vset(lx0, ly0);
            this._vset(p1x - dlx0 * rw, p1.y - dly0 * rw);

            var n = clamp(ceil((a0 - a1) / PI) * ncap, 2, ncap);
            for (var i = 0; i < n; i++) {
                var u = i / (n - 1);
                var a = a0 + u * (a1 - a0);
                var rx = p1x + cos(a) * rw;
                var ry = p1y + sin(a) * rw;
                this._vset(p1x, p1y);
                this._vset(rx, ry);
            }

            this._vset(lx1, ly1);
            this._vset(p1x - dlx1 * rw, p1y - dly1 * rw);
        } else {
            var out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, -rw);
            var rx0 = out[0];
            var ry0 = out[1];
            var rx1 = out[2];
            var ry1 = out[3];

            var a0 = atan2(dly0, dlx0);
            var a1 = atan2(dly1, dlx1);
            if (a1 < a0) a1 += PI * 2;

            this._vset(p1x + dlx0 * rw, p1y + dly0 * rw);
            this._vset(rx0, ry0);

            var n = clamp(ceil((a1 - a0) / PI) * ncap, 2, ncap);
            for (var i = 0; i < n; i++) {
                var u = i / (n - 1);
                var a = a0 + u * (a1 - a0);
                var lx = p1x + cos(a) * lw;
                var ly = p1y + sin(a) * lw;
                this._vset(lx, ly);
                this._vset(p1x, p1y);
            }

            this._vset(p1x + dlx1 * rw, p1y + dly1 * rw);
            this._vset(rx1, ry1);
        }
    },

    _bevelJoin: function (p0, p1, lw, rw) {
        var rx0, ry0, rx1, ry1;
        var lx0, ly0, lx1, ly1;
        var dlx0 = p0.dy;
        var dly0 = -p0.dx;
        var dlx1 = p1.dy;
        var dly1 = -p1.dx;

        if (p1.flags & PointFlags.PT_LEFT) {
            var out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, lw);
            lx0 = out[0];
            ly0 = out[1];
            lx1 = out[2];
            ly1 = out[3];

            this._vset(lx0, ly0);
            this._vset(p1.x - dlx0 * rw, p1.y - dly0 * rw);

            this._vset(lx1, ly1);
            this._vset(p1.x - dlx1 * rw, p1.y - dly1 * rw);
        } else {
            var out = this._chooseBevel(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, -rw);
            rx0 = out[0];
            ry0 = out[1];
            rx1 = out[2];
            ry1 = out[3];

            this._vset(p1.x + dlx0 * lw, p1.y + dly0 * lw);
            this._vset(rx0, ry0);

            this._vset(p1.x + dlx1 * lw, p1.y + dly1 * lw);
            this._vset(rx1, ry1);
        }
    },

    _tesselateBezier: function (x1, y1, x2, y2, x3, y3, x4, y4, level, type) {
        var x12, y12, x23, y23, x34, y34, x123, y123, x234, y234, x1234, y1234;
        var dx, dy, d2, d3;

        if (level > 10) return;

        x12 = (x1 + x2) * 0.5;
        y12 = (y1 + y2) * 0.5;
        x23 = (x2 + x3) * 0.5;
        y23 = (y2 + y3) * 0.5;
        x34 = (x3 + x4) * 0.5;
        y34 = (y3 + y4) * 0.5;
        x123 = (x12 + x23) * 0.5;
        y123 = (y12 + y23) * 0.5;

        dx = x4 - x1;
        dy = y4 - y1;
        d2 = abs((x2 - x4) * dy - (y2 - y4) * dx);
        d3 = abs((x3 - x4) * dy - (y3 - y4) * dx);

        if ((d2 + d3) * (d2 + d3) < this._tessTol * (dx * dx + dy * dy)) {
            this._addPoint(x4, y4, type === 0 ? type | PointFlags.PT_BEVEL : type);
            return;
        }

        x234 = (x23 + x34) * 0.5;
        y234 = (y23 + y34) * 0.5;
        x1234 = (x123 + x234) * 0.5;
        y1234 = (y123 + y234) * 0.5;

        this._tesselateBezier(x1, y1, x12, y12, x123, y123, x1234, y1234, level + 1, 0);
        this._tesselateBezier(x1234, y1234, x234, y234, x34, y34, x4, y4, level + 1, type);
    }
});


module.exports = WebGLRenderCmd;
