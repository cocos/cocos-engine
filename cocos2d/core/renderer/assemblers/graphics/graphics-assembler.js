const Graphics = require('../../../graphics/graphics');
const PointFlags = require('../../../graphics/types').PointFlags;
const LineJoin = Graphics.LineJoin;
const LineCap = Graphics.LineCap;
const Earcut = require('./earcut');

const renderEngine = require('../../render-engine');
const RenderData = renderEngine.RenderData;
const math = renderEngine.math;

const PI      = Math.PI;
const min     = Math.min;
const max     = Math.max;
const ceil    = Math.ceil;
const acos    = Math.acos;
const cos     = Math.cos;
const sin     = Math.sin;
const atan2   = Math.atan2;
const abs     = Math.abs;

let _matrix = math.mat4.create();

function curveDivs (r, arc, tol) {
    var da = acos(r / (r + tol)) * 2.0;
    return max(2, ceil(arc / da));
}

function clamp (v, min, max) {
    if (v < min) {
        return min;
    }
    else if (v > max) {
        return max;
    }
    return v;
}

let graphicsAssembler = {
    updateRenderData (graphics) {
        // Create render data if needed
        if (!graphics._renderData) {
            graphics._renderData = new RenderData();
        }

        let renderData = graphics._renderData;
        let size = graphics.node._contentSize;
        let anchor = graphics.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
    },

    fillVertexBuffer (graphics, index, vbuf, uintbuf) {
        let off = index * graphics._vertexFormat._bytes / 4;
        let node = graphics.node;
        let renderData = graphics._renderData;
        let data = renderData._data;
        let z = node._position.z;
        
        let color = node._color._val;
        
        node.getWorldMatrix(_matrix);
        let a = _matrix.m00,
            b = _matrix.m01,
            c = _matrix.m04,
            d = _matrix.m05,
            tx = _matrix.m12,
            ty = _matrix.m13;

        let colorBuffer = graphics._colorBuffer;
        for (let i = 0, l = data.length; i < l; i++) {
            vbuf[off++] = data[i].x * a + data[i].y * c + tx;
            vbuf[off++] = data[i].x * b + data[i].y * d + ty;
            vbuf[off++] = z;
            uintbuf[off++] = colorBuffer[i];
            off+=2;
        }
    },

    fillIndexBuffer (graphics, offset, vertexId, ibuf) {
        let indicesBuffer = graphics._indicesBuffer;
        for (let i = 0, l = indicesBuffer.length; i < l; i++) {
            ibuf[offset + i] = vertexId + indicesBuffer[i];
        }
    },

    stroke (graphics) {
        if (!graphics._renderData) {
            graphics._renderData = new RenderData();
        }

        this._curColor = graphics._strokeColor._val;

        this._flattenPaths(graphics);
        this._expandStroke(graphics);
    
        graphics._updatePathOffset = true;
    },

    fill (graphics) {
        if (!graphics._renderData) {
            graphics._renderData = new RenderData();
        }

        this._curColor = graphics._fillColor._val;

        this._expandFill(graphics);
        this._updatePathOffset = true;
    },

    _expandStroke (graphics) {
        var w = graphics.lineWidth * 0.5,
            lineCap = graphics.lineCap,
            lineJoin = graphics.lineJoin,
            miterLimit = graphics.miterLimit;
    
        var ncap = curveDivs(w, PI, graphics._tessTol);
    
        this._calculateJoins(graphics, w, lineJoin, miterLimit);
    
        let paths = graphics._paths,
            renderData = this._renderData = graphics._renderData,
            data = renderData._data,
            indicesBuffer = graphics._indicesBuffer;

        this._color = graphics._colorBuffer;
            
        for (var i = graphics._pathOffset, l = graphics._pathLength; i < l; i++) {
            var path = paths[i];
            var pts = path.points;
            var pointsLength = pts.length;
            var offset = data.length;

            var p0, p1;
            var start, end, loop;
            loop = path.closed;
            if (loop) {
                // Looping
                p0 = pts[pointsLength - 1];
                p1 = pts[0];
                start = 0;
                end = pointsLength;
            } else {
                // Add cap
                p0 = pts[0];
                p1 = pts[1];
                start = 1;
                end = pointsLength - 1;
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
    
            for (var j = start; j < end; ++j) {
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
                // Loop it
                this._vset(data[offset].x,   data[offset].y);
                this._vset(data[offset+1].x, data[offset+1].y);
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
            var indicesOffset = indicesBuffer.length;
            for (var start = offset+2, end = data.length; start < end; start++) {
                indicesBuffer[indicesOffset++] = start - 2;
                indicesBuffer[indicesOffset++] = start - 1;
                indicesBuffer[indicesOffset++] = start;
            }
        }

        renderData.vertexCount = data.length;
        renderData.indiceCount = indicesBuffer.length;
    },
    
    _expandFill (graphics) {
        let paths = graphics._paths,
            renderData = this._renderData = graphics._renderData,
            data = renderData._data,
            indicesBuffer = graphics._indicesBuffer;
        this._color = graphics._colorBuffer;

        for (var i = graphics._pathOffset, l = graphics._pathLength; i < l; i++) {
            var path = paths[i];
            var pts = path.points;
            var pointsLength = pts.length;
    
            if (pointsLength === 0) {
                continue;
            }
    
            // Calculate shape vertices.
            var offset = data.length;
    
            for (var j = 0; j < pointsLength; ++j) {
                this._vset(pts[j].x, pts[j].y);
            }
    
            var indicesOffset = indicesBuffer.length;
    
            if (path.complex) {
                var earcutData = [];
                for (var j = offset, end = data.length; j < end; j++) {
                    earcutData.push(data[j].x);
                    earcutData.push(data[j].y);
                }
    
                var newIndices = Earcut(earcutData, null, 2);
    
                if (!newIndices || newIndices.length === 0) {
                    continue;
                }
    
                for (var j = 0, nIndices = newIndices.length; j < nIndices; j++) {
                    indicesBuffer[indicesOffset + j] = newIndices[j] + offset;
                }
            }
            else {
                var first = offset;
                for (var start = offset+2, end = data.length; start < end; start++) {
                    indicesBuffer[indicesOffset++] = first;
                    indicesBuffer[indicesOffset++] = start - 1;
                    indicesBuffer[indicesOffset++] = start;
                }
            }
        }

        renderData.vertexCount = data.length;
        renderData.indiceCount = indicesBuffer.length;
    },

    _calculateJoins (graphics, w, lineJoin, miterLimit) {
        var iw = 0.0;
    
        if (w > 0.0) {
            iw = 1 / w;
        }
    
        // Calculate which joins needs extra vertices to append, and gather vertex count.
        var paths = graphics._paths;
        for (var i = graphics._pathOffset, l = graphics._pathLength; i < l; i++) {
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
    
    _flattenPaths (graphics) {
        let paths = graphics._paths;
        for (let i = graphics._pathOffset, l = graphics._pathLength; i < l; i++) {
            let path = paths[i];
            let pts = path.points;
    
            let p0 = pts[pts.length - 1];
            let p1 = pts[0];
    
            if (p0.equals(p1)) {
                path.closed = true;
                pts.pop();
                p0 = pts[pts.length - 1];
            }
    
            for (let j = 0, size = pts.length; j < size; j++) {
                // Calculate segment direction and length
                let dPos = p1.sub(p0);
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

    _chooseBevel (bevel, p0, p1, w) {
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
    
    _buttCap (p, dx, dy, w, d) {
        var px = p.x - dx * d;
        var py = p.y - dy * d;
        var dlx = dy;
        var dly = -dx;
    
        this._vset(px + dlx * w, py + dly * w);
        this._vset(px - dlx * w, py - dly * w);
    },
    
    _roundCapStart (p, dx, dy, w, ncap) {
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
    
    _roundCapEnd (p, dx, dy, w, ncap) {
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
    
    _roundJoin (p0, p1, lw, rw, ncap) {
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
    
    _bevelJoin (p0, p1, lw, rw) {
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
    
    _vset (x, y) {
        let renderData = this._renderData;
        let data = renderData._data;
        let _color = this._color;

        let offset = data.length;
        renderData.dataLength = offset + 1;

        data[offset].x = x;
        data[offset].y = y;
        _color[offset] = this._curColor;
    }
}

Graphics._assembler = graphicsAssembler;

module.exports = graphicsAssembler;