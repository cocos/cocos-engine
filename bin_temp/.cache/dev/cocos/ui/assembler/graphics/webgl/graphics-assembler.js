(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/gfx/index.js", "../../../../core/math/index.js", "../../../../core/renderer/ui/ui-vertex-format.js", "../types.js", "./earcut.js", "./impl.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/gfx/index.js"), require("../../../../core/math/index.js"), require("../../../../core/renderer/ui/ui-vertex-format.js"), require("../types.js"), require("./earcut.js"), require("./impl.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.uiVertexFormat, global.types, global.earcut, global.impl);
    global.graphicsAssembler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _uiVertexFormat, _types, _earcut, _impl2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.graphicsAssembler = void 0;

  /*
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
   http://www.cocos.com
  
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
  */

  /**
   * @category ui-assembler
   */
  var MAX_VERTEX = 65535;
  var MAX_INDICES = MAX_VERTEX * 2;
  var PI = Math.PI;
  var min = Math.min;
  var max = Math.max;
  var ceil = Math.ceil;
  var acos = Math.acos;
  var cos = Math.cos;
  var sin = Math.sin;
  var atan2 = Math.atan2;
  var attrBytes = 8;

  var attributes = _uiVertexFormat.vfmt.concat([new _index.GFXAttribute('a_dist', _index.GFXFormat.R32F)]);

  var formatBytes = (0, _uiVertexFormat.getAttributeFormatBytes)(attributes);
  var _renderData = null;
  var _impl = null;

  var _curColor = new _index2.Color();

  var vec3_temps = [];

  for (var i = 0; i < 4; i++) {
    vec3_temps.push(new _index2.Vec3());
  }

  function curveDivs(r, arc, tol) {
    var da = acos(r / (r + tol)) * 2.0;
    return max(2, ceil(arc / da));
  }

  function clamp(v, minNum, maxNum) {
    if (v < minNum) {
      return minNum;
    } else if (v > maxNum) {
      return maxNum;
    }

    return v;
  }
  /**
   * graphics 组装器
   * 可通过 `UI.graphicsAssembler` 获取该组装器。
   */


  var graphicsAssembler = {
    useModel: true,
    createImpl: function createImpl(graphics) {
      return new _impl2.Impl();
    },
    updateRenderData: function updateRenderData(graphics) {
      var dataList = graphics.impl ? graphics.impl.getRenderData() : [];

      for (var _i = 0, l = dataList.length; _i < l; _i++) {
        dataList[_i].material = graphics.getUIMaterialInstance();
      }
    },
    fillBuffers: function fillBuffers(graphics, renderer) {// this.renderIA!(graphics, renderer);
    },
    renderIA: function renderIA(graphics, renderer) {},
    getRenderData: function getRenderData(graphics, vertexCount) {
      if (!_impl) {
        return null;
      }

      var renderDataList = _impl.getRenderData();

      var renderData = renderDataList[_impl.dataOffset];

      if (!renderData) {
        return null;
      }

      var meshBuffer = renderData;
      var maxVertexCount = meshBuffer ? meshBuffer.vertexCount + vertexCount : 0;

      if (maxVertexCount > MAX_VERTEX || maxVertexCount * 3 > MAX_INDICES) {
        ++_impl.dataOffset;

        if (_impl.dataOffset < renderDataList.length) {
          renderData = renderDataList[_impl.dataOffset];
        } else {
          renderData = _impl.requestRenderData();
          renderDataList[_impl.dataOffset] = renderData;
        }

        meshBuffer = renderData;
      }

      if (meshBuffer && meshBuffer.vertexCount < maxVertexCount) {
        meshBuffer.request(vertexCount, vertexCount * 3);
      }

      return renderData;
    },
    stroke: function stroke(graphics) {
      _index2.Color.copy(_curColor, graphics.strokeColor); // graphics.node.getWorldMatrix(_currMatrix);


      if (!graphics.impl) {
        return;
      }

      this._flattenPaths(graphics.impl);

      this._expandStroke(graphics);

      graphics.impl.updatePathOffset = true;
      this.end(graphics);
    },
    fill: function fill(graphics) {
      _index2.Color.copy(_curColor, graphics.fillColor); // graphics.node.getWorldMatrix(_currMatrix);


      this._expandFill(graphics);

      if (graphics.impl) {
        graphics.impl.updatePathOffset = true;
      }

      this.end(graphics);
    },
    end: function end(graphics) {
      var impl = graphics.impl;
      var renderDataList = impl && impl.getRenderData();

      if (!renderDataList || !graphics.model) {
        return;
      }

      var subModelCount = graphics.model.subModels.length;
      var listLength = renderDataList.length;
      var delta = listLength - subModelCount;

      if (delta > 0) {
        for (var k = subModelCount; k < listLength; k++) {
          graphics.activeSubModel(k);
        }
      }

      var subModelList = graphics.model.subModels;

      for (var _i2 = 0; _i2 < renderDataList.length; _i2++) {
        var renderData = renderDataList[_i2];
        var ia = subModelList[_i2].inputAssembler;
        var vertexFormatBytes = Float32Array.BYTES_PER_ELEMENT * formatBytes;
        var byteOffset = renderData.vertexStart * vertexFormatBytes;
        var verticesData = new Float32Array(renderData.vData.buffer, 0, byteOffset >> 2);
        ia.vertexCount = renderData.vertexStart;
        ia.vertexBuffers[0].update(verticesData);
        var indicesData = new Uint16Array(renderData.iData.buffer, 0, renderData.indicesStart);
        ia.indexCount = renderData.indicesStart;
        ia.indexBuffer.update(indicesData);
      }

      graphics.markForUpdateRenderData();
    },
    _expandStroke: function _expandStroke(graphics) {
      var w = graphics.lineWidth * 0.5;
      var lineCap = graphics.lineCap;
      var lineJoin = graphics.lineJoin;
      var miterLimit = graphics.miterLimit;
      _impl = graphics.impl;

      if (!_impl) {
        return;
      }

      var nCap = curveDivs(w, PI, _impl.tessTol);

      this._calculateJoins(_impl, w, lineJoin, miterLimit);

      var paths = _impl.paths; // Calculate max vertex usage.

      var vertexCount = 0;

      for (var _i3 = _impl.pathOffset, l = _impl.pathLength; _i3 < l; _i3++) {
        var path = paths[_i3];
        var pointsLength = path.points.length;

        if (lineJoin === _types.LineJoin.ROUND) {
          vertexCount += (pointsLength + path.bevel * (nCap + 2) + 1) * 2;
        } // plus one for loop
        else {
            vertexCount += (pointsLength + path.bevel * 5 + 1) * 2;
          } // plus one for loop


        if (!path.closed) {
          // space for caps
          if (lineCap === _types.LineCap.ROUND) {
            vertexCount += (nCap * 2 + 2) * 2;
          } else {
            vertexCount += (3 + 3) * 2;
          }
        }
      }

      var meshBuffer = _renderData = this.getRenderData(graphics, vertexCount);

      if (!meshBuffer) {
        return;
      }

      var vData = meshBuffer.vData;
      var iData = meshBuffer.iData;

      for (var _i4 = _impl.pathOffset, _l = _impl.pathLength; _i4 < _l; _i4++) {
        var _path = paths[_i4];
        var pts = _path.points;
        var _pointsLength = pts.length;
        var offset = meshBuffer.vertexStart;
        var p0 = void 0;
        var p1 = void 0;
        var start = 0;
        var end = 0;
        var loop = _path.closed;

        if (loop) {
          // Looping
          p0 = pts[_pointsLength - 1];
          p1 = pts[0];
          start = 0;
          end = _pointsLength;
        } else {
          // Add cap
          p0 = pts[0];
          p1 = pts[1];
          start = 1;
          end = _pointsLength - 1;
        }

        if (!loop) {
          // Add cap
          var dPos = new _impl2.Point(p1.x, p1.y);
          dPos.subtract(p0);
          dPos.normalize();
          var dx = dPos.x;
          var dy = dPos.y;

          if (lineCap === _types.LineCap.BUTT) {
            this._buttCapStart(p0, dx, dy, w, 0);
          } else if (lineCap === _types.LineCap.SQUARE) {
            this._buttCapStart(p0, dx, dy, w, w);
          } else if (lineCap === _types.LineCap.ROUND) {
            this._roundCapStart(p0, dx, dy, w, nCap);
          }
        }

        for (var j = start; j < end; ++j) {
          if (lineJoin === _types.LineJoin.ROUND) {
            this._roundJoin(p0, p1, w, w, nCap);
          } else if ((p1.flags & (_types.PointFlags.PT_BEVEL | _types.PointFlags.PT_INNERBEVEL)) !== 0) {
            this._bevelJoin(p0, p1, w, w);
          } else {
            this._vSet(p1.x + p1.dmx * w, p1.y + p1.dmy * w, 1);

            this._vSet(p1.x - p1.dmx * w, p1.y - p1.dmy * w, -1);
          }

          p0 = p1;
          p1 = pts[j + 1];
        }

        if (loop) {
          // Loop it
          var vDataOffset = offset * attrBytes;

          this._vSet(vData[vDataOffset], vData[vDataOffset + 1], 1);

          this._vSet(vData[vDataOffset + attrBytes], vData[vDataOffset + attrBytes + 1], -1);
        } else {
          // Add cap
          var _dPos = new _impl2.Point(p1.x, p1.y);

          _dPos.subtract(p0);

          _dPos.normalize();

          var _dx = _dPos.x;
          var _dy = _dPos.y;

          if (lineCap === _types.LineCap.BUTT) {
            this._buttCapEnd(p1, _dx, _dy, w, 0);
          } else if (lineCap === _types.LineCap.SQUARE) {
            this._buttCapEnd(p1, _dx, _dy, w, w);
          } else if (lineCap === _types.LineCap.ROUND) {
            this._roundCapEnd(p1, _dx, _dy, w, nCap);
          }
        } // stroke indices


        var indicesOffset = meshBuffer.indicesStart;

        for (var begin = offset + 2, over = meshBuffer.vertexStart; begin < over; begin++) {
          iData[indicesOffset++] = begin - 2;
          iData[indicesOffset++] = begin - 1;
          iData[indicesOffset++] = begin;
        }

        meshBuffer.indicesStart = indicesOffset;

        if (indicesOffset !== meshBuffer.indicesCount) {
          var arr = new Array(meshBuffer.indicesCount - indicesOffset);
          meshBuffer.iData.set(arr, indicesOffset);
        }
      }

      _renderData = null;
      _impl = null;
    },
    _expandFill: function _expandFill(graphics) {
      _impl = graphics.impl;

      if (!_impl) {
        return;
      }

      var paths = _impl.paths; // Calculate max vertex usage.

      var vertexCount = 0;

      for (var _i5 = _impl.pathOffset, l = _impl.pathLength; _i5 < l; _i5++) {
        var path = paths[_i5];
        var pointsLength = path.points.length;
        vertexCount += pointsLength;
      }

      var renderData = _renderData = this.getRenderData(graphics, vertexCount);

      if (!renderData) {
        return;
      }

      var meshBuffer = renderData;
      var vData = meshBuffer.vData;
      var iData = meshBuffer.iData;

      for (var _i6 = _impl.pathOffset, _l2 = _impl.pathLength; _i6 < _l2; _i6++) {
        var _path2 = paths[_i6];
        var pts = _path2.points;
        var _pointsLength2 = pts.length;

        if (_pointsLength2 === 0) {
          continue;
        } // Calculate shape vertices.


        var vertexOffset = renderData.vertexStart;

        for (var j = 0; j < _pointsLength2; ++j) {
          this._vSet(pts[j].x, pts[j].y);
        }

        var indicesOffset = renderData.indicesStart;

        if (_path2.complex) {
          var earcutData = [];

          for (var _j = vertexOffset, end = renderData.vertexStart; _j < end; _j++) {
            var vDataOffset = _j * attrBytes;
            earcutData.push(vData[vDataOffset++]);
            earcutData.push(vData[vDataOffset++]);
            earcutData.push(vData[vDataOffset++]);
          }

          var newIndices = (0, _earcut.earcut)(earcutData, null, 3);

          if (!newIndices || newIndices.length === 0) {
            continue;
          }

          for (var _j2 = 0, nIndices = newIndices.length; _j2 < nIndices; _j2++) {
            iData[indicesOffset++] = newIndices[_j2] + vertexOffset;
          }
        } else {
          var first = vertexOffset;

          for (var start = vertexOffset + 2, _end = meshBuffer.vertexStart; start < _end; start++) {
            iData[indicesOffset++] = first;
            iData[indicesOffset++] = start - 1;
            iData[indicesOffset++] = start;
          }
        }

        meshBuffer.indicesStart = indicesOffset;

        if (indicesOffset !== meshBuffer.indicesCount) {
          var arr = new Array(meshBuffer.indicesCount - indicesOffset);
          meshBuffer.iData.set(arr, indicesOffset);
        }
      }

      _renderData = null;
      _impl = null;
    },
    _calculateJoins: function _calculateJoins(impl, w, lineJoin, miterLimit) {
      var iw = 0.0;

      if (w > 0.0) {
        iw = 1 / w;
      } // Calculate which joins needs extra vertices to append, and gather vertex count.


      var paths = impl.paths;

      for (var _i7 = impl.pathOffset, l = impl.pathLength; _i7 < l; _i7++) {
        var path = paths[_i7];
        var pts = path.points;
        var ptsLength = pts.length;
        var p0 = pts[ptsLength - 1];
        var p1 = pts[0];
        var nLeft = 0;
        path.bevel = 0;

        for (var j = 0; j < ptsLength; j++) {
          var dmr2 = 0;
          var cross = 0;
          var limit = 0; // perp normals

          var dlx0 = p0.dy;
          var dly0 = -p0.dx;
          var dlx1 = p1.dy;
          var dly1 = -p1.dx; // Calculate extrusions

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
          } // Keep track of left turns.


          cross = p1.dx * p0.dy - p0.dx * p1.dy;

          if (cross > 0) {
            nLeft++;
            p1.flags |= _types.PointFlags.PT_LEFT;
          } // Calculate if we should use bevel or miter for inner join.


          limit = max(11, min(p0.len, p1.len) * iw);

          if (dmr2 * limit * limit < 1) {
            p1.flags |= _types.PointFlags.PT_INNERBEVEL;
          } // Check to see if the corner needs to be beveled.


          if (p1.flags & _types.PointFlags.PT_CORNER) {
            if (dmr2 * miterLimit * miterLimit < 1 || lineJoin === _types.LineJoin.BEVEL || lineJoin === _types.LineJoin.ROUND) {
              p1.flags |= _types.PointFlags.PT_BEVEL;
            }
          }

          if ((p1.flags & (_types.PointFlags.PT_BEVEL | _types.PointFlags.PT_INNERBEVEL)) !== 0) {
            path.bevel++;
          }

          p0 = p1;
          p1 = pts[j + 1];
        }
      }
    },
    _flattenPaths: function _flattenPaths(impl) {
      var paths = impl.paths;

      for (var _i8 = impl.pathOffset, l = impl.pathLength; _i8 < l; _i8++) {
        var path = paths[_i8];
        var pts = path.points;
        var p0 = pts[pts.length - 1];
        var p1 = pts[0];

        if (pts.length > 2 && p0.equals(p1)) {
          path.closed = true;
          pts.pop();
          p0 = pts[pts.length - 1];
        }

        for (var j = 0, size = pts.length; j < size; j++) {
          // Calculate segment direction and length
          var dPos = new _impl2.Point(p1.x, p1.y);
          dPos.subtract(p0);
          p0.len = dPos.length();

          if (dPos.x || dPos.y) {
            dPos.normalize();
          }

          p0.dx = dPos.x;
          p0.dy = dPos.y; // Advance

          p0 = p1;
          p1 = pts[j + 1];
        }
      }
    },
    _chooseBevel: function _chooseBevel(bevel, p0, p1, w) {
      var x = p1.x;
      var y = p1.y;
      var x0 = 0;
      var y0 = 0;
      var x1 = 0;
      var y1 = 0;

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
    _buttCapStart: function _buttCapStart(p, dx, dy, w, d) {
      var px = p.x - dx * d;
      var py = p.y - dy * d;
      var dlx = dy;
      var dly = -dx;

      this._vSet(px + dlx * w, py + dly * w, 1);

      this._vSet(px - dlx * w, py - dly * w, -1);
    },
    _buttCapEnd: function _buttCapEnd(p, dx, dy, w, d) {
      var px = p.x + dx * d;
      var py = p.y + dy * d;
      var dlx = dy;
      var dly = -dx;

      this._vSet(px + dlx * w, py + dly * w, 1);

      this._vSet(px - dlx * w, py - dly * w, -1);
    },
    _roundCapStart: function _roundCapStart(p, dx, dy, w, nCap) {
      var px = p.x;
      var py = p.y;
      var dlx = dy;
      var dly = -dx;

      for (var _i9 = 0; _i9 < nCap; _i9++) {
        var a = _i9 / (nCap - 1) * PI;
        var ax = cos(a) * w;
        var ay = sin(a) * w;

        this._vSet(px - dlx * ax - dx * ay, py - dly * ax - dy * ay, 1);

        this._vSet(px, py, 0);
      }

      this._vSet(px + dlx * w, py + dly * w, 1);

      this._vSet(px - dlx * w, py - dly * w, -1);
    },
    _roundCapEnd: function _roundCapEnd(p, dx, dy, w, nCap) {
      var px = p.x;
      var py = p.y;
      var dlx = dy;
      var dly = -dx;

      this._vSet(px + dlx * w, py + dly * w, 1);

      this._vSet(px - dlx * w, py - dly * w, -1);

      for (var _i10 = 0; _i10 < nCap; _i10++) {
        var a = _i10 / (nCap - 1) * PI;
        var ax = cos(a) * w;
        var ay = sin(a) * w;

        this._vSet(px, py, 0);

        this._vSet(px - dlx * ax + dx * ay, py - dly * ax + dy * ay, 1);
      }
    },
    _roundJoin: function _roundJoin(p0, p1, lw, rw, nCap) {
      var dlx0 = p0.dy;
      var dly0 = -p0.dx;
      var dlx1 = p1.dy;
      var dly1 = -p1.dx;
      var p1x = p1.x;
      var p1y = p1.y;

      if ((p1.flags & _types.PointFlags.PT_LEFT) !== 0) {
        var out = this._chooseBevel(p1.flags & _types.PointFlags.PT_INNERBEVEL, p0, p1, lw);

        var lx0 = out[0];
        var ly0 = out[1];
        var lx1 = out[2];
        var ly1 = out[3];
        var a0 = atan2(-dly0, -dlx0);
        var a1 = atan2(-dly1, -dlx1);

        if (a1 > a0) {
          a1 -= PI * 2;
        }

        this._vSet(lx0, ly0, 1);

        this._vSet(p1x - dlx0 * rw, p1.y - dly0 * rw, -1);

        var n = clamp(ceil((a0 - a1) / PI) * nCap, 2, nCap);

        for (var _i11 = 0; _i11 < n; _i11++) {
          var u = _i11 / (n - 1);
          var a = a0 + u * (a1 - a0);
          var rx = p1x + cos(a) * rw;
          var ry = p1y + sin(a) * rw;

          this._vSet(p1x, p1y, 0);

          this._vSet(rx, ry, -1);
        }

        this._vSet(lx1, ly1, 1);

        this._vSet(p1x - dlx1 * rw, p1y - dly1 * rw, -1);
      } else {
        var _out = this._chooseBevel(p1.flags & _types.PointFlags.PT_INNERBEVEL, p0, p1, -rw);

        var rx0 = _out[0];
        var ry0 = _out[1];
        var rx1 = _out[2];
        var ry1 = _out[3];

        var _a = atan2(dly0, dlx0);

        var _a2 = atan2(dly1, dlx1);

        if (_a2 < _a) {
          _a2 += PI * 2;
        }

        this._vSet(p1x + dlx0 * rw, p1y + dly0 * rw, 1);

        this._vSet(rx0, ry0, -1);

        var _n = clamp(ceil((_a2 - _a) / PI) * nCap, 2, nCap);

        for (var _i12 = 0; _i12 < _n; _i12++) {
          var _u = _i12 / (_n - 1);

          var _a3 = _a + _u * (_a2 - _a);

          var lx = p1x + cos(_a3) * lw;
          var ly = p1y + sin(_a3) * lw;

          this._vSet(lx, ly, 1);

          this._vSet(p1x, p1y, 0);
        }

        this._vSet(p1x + dlx1 * rw, p1y + dly1 * rw, 1);

        this._vSet(rx1, ry1, -1);
      }
    },
    _bevelJoin: function _bevelJoin(p0, p1, lw, rw) {
      var rx0 = 0;
      var ry0 = 0;
      var rx1 = 0;
      var ry1 = 0;
      var lx0 = 0;
      var ly0 = 0;
      var lx1 = 0;
      var ly1 = 0;
      var dlx0 = p0.dy;
      var dly0 = -p0.dx;
      var dlx1 = p1.dy;
      var dly1 = -p1.dx;

      if (p1.flags & _types.PointFlags.PT_LEFT) {
        var out = this._chooseBevel(p1.flags & _types.PointFlags.PT_INNERBEVEL, p0, p1, lw);

        lx0 = out[0];
        ly0 = out[1];
        lx1 = out[2];
        ly1 = out[3];

        this._vSet(lx0, ly0, 1);

        this._vSet(p1.x - dlx0 * rw, p1.y - dly0 * rw, -1);

        this._vSet(lx1, ly1, 1);

        this._vSet(p1.x - dlx1 * rw, p1.y - dly1 * rw, -1);
      } else {
        var _out2 = this._chooseBevel(p1.flags & _types.PointFlags.PT_INNERBEVEL, p0, p1, -rw);

        rx0 = _out2[0];
        ry0 = _out2[1];
        rx1 = _out2[2];
        ry1 = _out2[3];

        this._vSet(p1.x + dlx0 * lw, p1.y + dly0 * lw, 1);

        this._vSet(rx0, ry0, -1);

        this._vSet(p1.x + dlx1 * lw, p1.y + dly1 * lw, 1);

        this._vSet(rx1, ry1, -1);
      }
    },
    _vSet: function _vSet(x, y) {
      var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (!_renderData) {
        return;
      }

      var meshBuffer = _renderData;
      var dataOffset = meshBuffer.vertexStart * attrBytes;
      var vData = meshBuffer.vData; // vec3.set(_tempVec3, x, y, 0);
      // vec3.transformMat4(_tempVec3, _tempVec3, _currMatrix);

      vData[dataOffset++] = x;
      vData[dataOffset++] = y;
      vData[dataOffset++] = 0;

      _index2.Color.toArray(vData, _curColor, dataOffset);

      dataOffset += 4;
      vData[dataOffset++] = distance;
      meshBuffer.vertexStart++;
    }
  };
  _exports.graphicsAssembler = graphicsAssembler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9ncmFwaGljcy93ZWJnbC9ncmFwaGljcy1hc3NlbWJsZXIudHMiXSwibmFtZXMiOlsiTUFYX1ZFUlRFWCIsIk1BWF9JTkRJQ0VTIiwiUEkiLCJNYXRoIiwibWluIiwibWF4IiwiY2VpbCIsImFjb3MiLCJjb3MiLCJzaW4iLCJhdGFuMiIsImF0dHJCeXRlcyIsImF0dHJpYnV0ZXMiLCJ2Zm10IiwiY29uY2F0IiwiR0ZYQXR0cmlidXRlIiwiR0ZYRm9ybWF0IiwiUjMyRiIsImZvcm1hdEJ5dGVzIiwiX3JlbmRlckRhdGEiLCJfaW1wbCIsIl9jdXJDb2xvciIsIkNvbG9yIiwidmVjM190ZW1wcyIsImkiLCJwdXNoIiwiVmVjMyIsImN1cnZlRGl2cyIsInIiLCJhcmMiLCJ0b2wiLCJkYSIsImNsYW1wIiwidiIsIm1pbk51bSIsIm1heE51bSIsImdyYXBoaWNzQXNzZW1ibGVyIiwidXNlTW9kZWwiLCJjcmVhdGVJbXBsIiwiZ3JhcGhpY3MiLCJJbXBsIiwidXBkYXRlUmVuZGVyRGF0YSIsImRhdGFMaXN0IiwiaW1wbCIsImdldFJlbmRlckRhdGEiLCJsIiwibGVuZ3RoIiwibWF0ZXJpYWwiLCJnZXRVSU1hdGVyaWFsSW5zdGFuY2UiLCJmaWxsQnVmZmVycyIsInJlbmRlcmVyIiwicmVuZGVySUEiLCJ2ZXJ0ZXhDb3VudCIsInJlbmRlckRhdGFMaXN0IiwicmVuZGVyRGF0YSIsImRhdGFPZmZzZXQiLCJtZXNoQnVmZmVyIiwibWF4VmVydGV4Q291bnQiLCJyZXF1ZXN0UmVuZGVyRGF0YSIsInJlcXVlc3QiLCJzdHJva2UiLCJjb3B5Iiwic3Ryb2tlQ29sb3IiLCJfZmxhdHRlblBhdGhzIiwiX2V4cGFuZFN0cm9rZSIsInVwZGF0ZVBhdGhPZmZzZXQiLCJlbmQiLCJmaWxsIiwiZmlsbENvbG9yIiwiX2V4cGFuZEZpbGwiLCJtb2RlbCIsInN1Yk1vZGVsQ291bnQiLCJzdWJNb2RlbHMiLCJsaXN0TGVuZ3RoIiwiZGVsdGEiLCJrIiwiYWN0aXZlU3ViTW9kZWwiLCJzdWJNb2RlbExpc3QiLCJpYSIsImlucHV0QXNzZW1ibGVyIiwidmVydGV4Rm9ybWF0Qnl0ZXMiLCJGbG9hdDMyQXJyYXkiLCJCWVRFU19QRVJfRUxFTUVOVCIsImJ5dGVPZmZzZXQiLCJ2ZXJ0ZXhTdGFydCIsInZlcnRpY2VzRGF0YSIsInZEYXRhIiwiYnVmZmVyIiwidmVydGV4QnVmZmVycyIsInVwZGF0ZSIsImluZGljZXNEYXRhIiwiVWludDE2QXJyYXkiLCJpRGF0YSIsImluZGljZXNTdGFydCIsImluZGV4Q291bnQiLCJpbmRleEJ1ZmZlciIsIm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhIiwidyIsImxpbmVXaWR0aCIsImxpbmVDYXAiLCJsaW5lSm9pbiIsIm1pdGVyTGltaXQiLCJuQ2FwIiwidGVzc1RvbCIsIl9jYWxjdWxhdGVKb2lucyIsInBhdGhzIiwicGF0aE9mZnNldCIsInBhdGhMZW5ndGgiLCJwYXRoIiwicG9pbnRzTGVuZ3RoIiwicG9pbnRzIiwiTGluZUpvaW4iLCJST1VORCIsImJldmVsIiwiY2xvc2VkIiwiTGluZUNhcCIsInB0cyIsIm9mZnNldCIsInAwIiwicDEiLCJzdGFydCIsImxvb3AiLCJkUG9zIiwiUG9pbnQiLCJ4IiwieSIsInN1YnRyYWN0Iiwibm9ybWFsaXplIiwiZHgiLCJkeSIsIkJVVFQiLCJfYnV0dENhcFN0YXJ0IiwiU1FVQVJFIiwiX3JvdW5kQ2FwU3RhcnQiLCJqIiwiX3JvdW5kSm9pbiIsImZsYWdzIiwiUG9pbnRGbGFncyIsIlBUX0JFVkVMIiwiUFRfSU5ORVJCRVZFTCIsIl9iZXZlbEpvaW4iLCJfdlNldCIsImRteCIsImRteSIsInZEYXRhT2Zmc2V0IiwiX2J1dHRDYXBFbmQiLCJfcm91bmRDYXBFbmQiLCJpbmRpY2VzT2Zmc2V0IiwiYmVnaW4iLCJvdmVyIiwiaW5kaWNlc0NvdW50IiwiYXJyIiwiQXJyYXkiLCJzZXQiLCJ2ZXJ0ZXhPZmZzZXQiLCJjb21wbGV4IiwiZWFyY3V0RGF0YSIsIm5ld0luZGljZXMiLCJuSW5kaWNlcyIsImZpcnN0IiwiaXciLCJwdHNMZW5ndGgiLCJuTGVmdCIsImRtcjIiLCJjcm9zcyIsImxpbWl0IiwiZGx4MCIsImRseTAiLCJkbHgxIiwiZGx5MSIsInNjYWxlIiwiUFRfTEVGVCIsImxlbiIsIlBUX0NPUk5FUiIsIkJFVkVMIiwiZXF1YWxzIiwicG9wIiwic2l6ZSIsIl9jaG9vc2VCZXZlbCIsIngwIiwieTAiLCJ4MSIsInkxIiwicCIsImQiLCJweCIsInB5IiwiZGx4IiwiZGx5IiwiYSIsImF4IiwiYXkiLCJsdyIsInJ3IiwicDF4IiwicDF5Iiwib3V0IiwibHgwIiwibHkwIiwibHgxIiwibHkxIiwiYTAiLCJhMSIsIm4iLCJ1IiwicngiLCJyeSIsInJ4MCIsInJ5MCIsInJ4MSIsInJ5MSIsImx4IiwibHkiLCJkaXN0YW5jZSIsInRvQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7OztBQWVBLE1BQU1BLFVBQVUsR0FBRyxLQUFuQjtBQUNBLE1BQU1DLFdBQVcsR0FBR0QsVUFBVSxHQUFHLENBQWpDO0FBRUEsTUFBTUUsRUFBRSxHQUFHQyxJQUFJLENBQUNELEVBQWhCO0FBQ0EsTUFBTUUsR0FBRyxHQUFHRCxJQUFJLENBQUNDLEdBQWpCO0FBQ0EsTUFBTUMsR0FBRyxHQUFHRixJQUFJLENBQUNFLEdBQWpCO0FBQ0EsTUFBTUMsSUFBSSxHQUFHSCxJQUFJLENBQUNHLElBQWxCO0FBQ0EsTUFBTUMsSUFBSSxHQUFHSixJQUFJLENBQUNJLElBQWxCO0FBQ0EsTUFBTUMsR0FBRyxHQUFHTCxJQUFJLENBQUNLLEdBQWpCO0FBQ0EsTUFBTUMsR0FBRyxHQUFHTixJQUFJLENBQUNNLEdBQWpCO0FBQ0EsTUFBTUMsS0FBSyxHQUFHUCxJQUFJLENBQUNPLEtBQW5CO0FBRUEsTUFBTUMsU0FBUyxHQUFHLENBQWxCOztBQUVBLE1BQU1DLFVBQVUsR0FBR0MscUJBQUtD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RSxHQUFaLEVBQWlCQyxHQUFqQixFQUFzQixDQUFDLENBQXZCO0FBQ0g7QUFDSixLQTduQndDO0FBK25CekNyRSxJQUFBQSxLQS9uQnlDLGlCQStuQmxDakIsQ0EvbkJrQyxFQStuQnZCQyxDQS9uQnVCLEVBK25CRTtBQUFBLFVBQWR3RixRQUFjLHVFQUFILENBQUc7O0FBQ3ZDLFVBQUksQ0FBQ2xNLFdBQUwsRUFBa0I7QUFDZDtBQUNIOztBQUVELFVBQU1xQyxVQUFVLEdBQUdyQyxXQUFuQjtBQUNBLFVBQUlvQyxVQUFVLEdBQUdDLFVBQVUsQ0FBQzRCLFdBQVgsR0FBeUJ6RSxTQUExQztBQUNBLFVBQU0yRSxLQUFLLEdBQUc5QixVQUFVLENBQUM4QixLQUF6QixDQVB1QyxDQVF2QztBQUNBOztBQUVBQSxNQUFBQSxLQUFLLENBQUMvQixVQUFVLEVBQVgsQ0FBTCxHQUFzQnFFLENBQXRCO0FBQ0F0QyxNQUFBQSxLQUFLLENBQUMvQixVQUFVLEVBQVgsQ0FBTCxHQUFzQnNFLENBQXRCO0FBQ0F2QyxNQUFBQSxLQUFLLENBQUMvQixVQUFVLEVBQVgsQ0FBTCxHQUFzQixDQUF0Qjs7QUFDQWpDLG9CQUFNZ00sT0FBTixDQUFjaEksS0FBZCxFQUFzQmpFLFNBQXRCLEVBQWlDa0MsVUFBakM7O0FBQ0FBLE1BQUFBLFVBQVUsSUFBSSxDQUFkO0FBQ0ErQixNQUFBQSxLQUFLLENBQUMvQixVQUFVLEVBQVgsQ0FBTCxHQUFzQjhKLFFBQXRCO0FBQ0E3SixNQUFBQSxVQUFVLENBQUM0QixXQUFYO0FBQ0g7QUFqcEJ3QyxHQUF0QyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aS1hc3NlbWJsZXJcclxuICovXHJcblxyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGUsIEdGWEZvcm1hdCB9IGZyb20gJy4uLy4uLy4uLy4uL2NvcmUvZ2Z4JztcclxuaW1wb3J0IHsgQ29sb3IsIFZlYzMgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBJQXNzZW1ibGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29yZS9yZW5kZXJlci91aS9iYXNlJztcclxuaW1wb3J0IHsgTWVzaFJlbmRlckRhdGEgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlL3JlbmRlcmVyL3VpL3JlbmRlci1kYXRhJztcclxuaW1wb3J0IHsgVUkgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlL3JlbmRlcmVyL3VpL3VpJztcclxuaW1wb3J0IHsgdmZtdCwgZ2V0QXR0cmlidXRlRm9ybWF0Qnl0ZXMgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlL3JlbmRlcmVyL3VpL3VpLXZlcnRleC1mb3JtYXQnO1xyXG5pbXBvcnQgeyBHcmFwaGljcyB9IGZyb20gJy4uLy4uLy4uL2NvbXBvbmVudHMnO1xyXG5pbXBvcnQgeyBMaW5lQ2FwLCBMaW5lSm9pbiwgUG9pbnRGbGFncyB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgZWFyY3V0IGFzIEVhcmN1dCB9IGZyb20gJy4vZWFyY3V0JztcclxuaW1wb3J0IHsgSW1wbCwgUG9pbnQgfSBmcm9tICcuL2ltcGwnO1xyXG5cclxuY29uc3QgTUFYX1ZFUlRFWCA9IDY1NTM1O1xyXG5jb25zdCBNQVhfSU5ESUNFUyA9IE1BWF9WRVJURVggKiAyO1xyXG5cclxuY29uc3QgUEkgPSBNYXRoLlBJO1xyXG5jb25zdCBtaW4gPSBNYXRoLm1pbjtcclxuY29uc3QgbWF4ID0gTWF0aC5tYXg7XHJcbmNvbnN0IGNlaWwgPSBNYXRoLmNlaWw7XHJcbmNvbnN0IGFjb3MgPSBNYXRoLmFjb3M7XHJcbmNvbnN0IGNvcyA9IE1hdGguY29zO1xyXG5jb25zdCBzaW4gPSBNYXRoLnNpbjtcclxuY29uc3QgYXRhbjIgPSBNYXRoLmF0YW4yO1xyXG5cclxuY29uc3QgYXR0ckJ5dGVzID0gODtcclxuXHJcbmNvbnN0IGF0dHJpYnV0ZXMgPSB2Zm10LmNvbmNhdChbXHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKCdhX2Rpc3QnLCBHRlhGb3JtYXQuUjMyRiksXHJcbl0pO1xyXG5cclxuY29uc3QgZm9ybWF0Qnl0ZXMgPSBnZXRBdHRyaWJ1dGVGb3JtYXRCeXRlcyhhdHRyaWJ1dGVzKTtcclxuXHJcbmxldCBfcmVuZGVyRGF0YTogTWVzaFJlbmRlckRhdGEgfCBudWxsID0gbnVsbDtcclxubGV0IF9pbXBsOiBJbXBsIHwgbnVsbCA9IG51bGw7XHJcbmNvbnN0IF9jdXJDb2xvciA9IG5ldyBDb2xvcigpO1xyXG5cclxuY29uc3QgdmVjM190ZW1wczogVmVjM1tdID0gW107XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICB2ZWMzX3RlbXBzLnB1c2gobmV3IFZlYzMoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGN1cnZlRGl2cyAocjogbnVtYmVyLCBhcmM6IG51bWJlciwgdG9sOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGRhID0gYWNvcyhyIC8gKHIgKyB0b2wpKSAqIDIuMDtcclxuICAgIHJldHVybiBtYXgoMiwgY2VpbChhcmMgLyBkYSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGFtcCAodjogbnVtYmVyLCBtaW5OdW06IG51bWJlciwgbWF4TnVtOiBudW1iZXIpIHtcclxuICAgIGlmICh2IDwgbWluTnVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG1pbk51bTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHYgPiBtYXhOdW0pIHtcclxuICAgICAgICByZXR1cm4gbWF4TnVtO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBncmFwaGljcyDnu4Too4XlmahcclxuICog5Y+v6YCa6L+HIGBVSS5ncmFwaGljc0Fzc2VtYmxlcmAg6I635Y+W6K+l57uE6KOF5Zmo44CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ3JhcGhpY3NBc3NlbWJsZXI6IElBc3NlbWJsZXIgPSB7XHJcbiAgICB1c2VNb2RlbDogdHJ1ZSxcclxuICAgIGNyZWF0ZUltcGwgKGdyYXBoaWNzOiBHcmFwaGljcykge1xyXG4gICAgICAgIHJldHVybiBuZXcgSW1wbCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVSZW5kZXJEYXRhIChncmFwaGljczogR3JhcGhpY3MpIHtcclxuICAgICAgICBjb25zdCBkYXRhTGlzdCA9IGdyYXBoaWNzLmltcGwgPyBncmFwaGljcy5pbXBsLmdldFJlbmRlckRhdGEoKSA6IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZGF0YUxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRhdGFMaXN0W2ldLm1hdGVyaWFsID0gZ3JhcGhpY3MuZ2V0VUlNYXRlcmlhbEluc3RhbmNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBmaWxsQnVmZmVycyAoZ3JhcGhpY3M6IEdyYXBoaWNzLCByZW5kZXJlcjogVUkpIHtcclxuICAgICAgICAvLyB0aGlzLnJlbmRlcklBIShncmFwaGljcywgcmVuZGVyZXIpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXJJQSAoZ3JhcGhpY3M6IEdyYXBoaWNzLCByZW5kZXJlcjogVUkpIHtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0UmVuZGVyRGF0YSAoZ3JhcGhpY3M6IEdyYXBoaWNzLCB2ZXJ0ZXhDb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCFfaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbmRlckRhdGFMaXN0ID0gX2ltcGwuZ2V0UmVuZGVyRGF0YSgpO1xyXG4gICAgICAgIGxldCByZW5kZXJEYXRhID0gcmVuZGVyRGF0YUxpc3RbX2ltcGwuZGF0YU9mZnNldF07XHJcbiAgICAgICAgaWYgKCFyZW5kZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1lc2hCdWZmZXIgPSByZW5kZXJEYXRhO1xyXG5cclxuICAgICAgICBjb25zdCBtYXhWZXJ0ZXhDb3VudCA9IG1lc2hCdWZmZXIgPyBtZXNoQnVmZmVyLnZlcnRleENvdW50ICsgdmVydGV4Q291bnQgOiAwO1xyXG4gICAgICAgIGlmIChtYXhWZXJ0ZXhDb3VudCA+IE1BWF9WRVJURVggfHwgbWF4VmVydGV4Q291bnQgKiAzID4gTUFYX0lORElDRVMpIHtcclxuICAgICAgICAgICAgKytfaW1wbC5kYXRhT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgaWYgKF9pbXBsLmRhdGFPZmZzZXQgPCByZW5kZXJEYXRhTGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlckRhdGEgPSByZW5kZXJEYXRhTGlzdFtfaW1wbC5kYXRhT2Zmc2V0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlckRhdGEgPSBfaW1wbC5yZXF1ZXN0UmVuZGVyRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyRGF0YUxpc3RbX2ltcGwuZGF0YU9mZnNldF0gPSByZW5kZXJEYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXNoQnVmZmVyID0gcmVuZGVyRGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtZXNoQnVmZmVyICYmIG1lc2hCdWZmZXIudmVydGV4Q291bnQgPCBtYXhWZXJ0ZXhDb3VudCkge1xyXG4gICAgICAgICAgICBtZXNoQnVmZmVyLnJlcXVlc3QodmVydGV4Q291bnQsIHZlcnRleENvdW50ICogMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyRGF0YTtcclxuICAgIH0sXHJcblxyXG4gICAgc3Ryb2tlIChncmFwaGljczogR3JhcGhpY3MpIHtcclxuICAgICAgICBDb2xvci5jb3B5KF9jdXJDb2xvciwgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IpO1xyXG4gICAgICAgIC8vIGdyYXBoaWNzLm5vZGUuZ2V0V29ybGRNYXRyaXgoX2N1cnJNYXRyaXgpO1xyXG4gICAgICAgIGlmICghZ3JhcGhpY3MuaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9mbGF0dGVuUGF0aHMhKGdyYXBoaWNzLmltcGwpO1xyXG4gICAgICAgIHRoaXMuX2V4cGFuZFN0cm9rZSEoZ3JhcGhpY3MpO1xyXG5cclxuICAgICAgICBncmFwaGljcy5pbXBsLnVwZGF0ZVBhdGhPZmZzZXQgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmVuZChncmFwaGljcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbGwgKGdyYXBoaWNzOiBHcmFwaGljcykge1xyXG4gICAgICAgIENvbG9yLmNvcHkoX2N1ckNvbG9yLCBncmFwaGljcy5maWxsQ29sb3IpO1xyXG4gICAgICAgIC8vIGdyYXBoaWNzLm5vZGUuZ2V0V29ybGRNYXRyaXgoX2N1cnJNYXRyaXgpO1xyXG5cclxuICAgICAgICB0aGlzLl9leHBhbmRGaWxsIShncmFwaGljcyk7XHJcbiAgICAgICAgaWYgKGdyYXBoaWNzLmltcGwpIHtcclxuICAgICAgICAgICAgZ3JhcGhpY3MuaW1wbC51cGRhdGVQYXRoT2Zmc2V0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZW5kKGdyYXBoaWNzKTtcclxuICAgIH0sXHJcblxyXG4gICAgZW5kIChncmFwaGljczogR3JhcGhpY3MpIHtcclxuICAgICAgICBjb25zdCBpbXBsID0gZ3JhcGhpY3MuaW1wbDtcclxuICAgICAgICBjb25zdCByZW5kZXJEYXRhTGlzdCA9IGltcGwgJiYgaW1wbC5nZXRSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgaWYgKCFyZW5kZXJEYXRhTGlzdCB8fCAhZ3JhcGhpY3MubW9kZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc3ViTW9kZWxDb3VudCA9IGdyYXBoaWNzLm1vZGVsLnN1Yk1vZGVscy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgbGlzdExlbmd0aCA9IHJlbmRlckRhdGFMaXN0Lmxlbmd0aDtcclxuICAgICAgICBjb25zdCBkZWx0YSA9IGxpc3RMZW5ndGggLSBzdWJNb2RlbENvdW50O1xyXG4gICAgICAgIGlmIChkZWx0YSA+IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgayA9IHN1Yk1vZGVsQ291bnQ7IGsgPCBsaXN0TGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgIGdyYXBoaWNzLmFjdGl2ZVN1Yk1vZGVsKGspO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzdWJNb2RlbExpc3QgPSBncmFwaGljcy5tb2RlbC5zdWJNb2RlbHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJEYXRhTGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlckRhdGEgPSByZW5kZXJEYXRhTGlzdFtpXTtcclxuICAgICAgICAgICAgY29uc3QgaWEgPSBzdWJNb2RlbExpc3RbaV0uaW5wdXRBc3NlbWJsZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleEZvcm1hdEJ5dGVzID0gRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UICogZm9ybWF0Qnl0ZXM7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVPZmZzZXQgPSByZW5kZXJEYXRhLnZlcnRleFN0YXJ0ICogdmVydGV4Rm9ybWF0Qnl0ZXM7XHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRpY2VzRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkocmVuZGVyRGF0YS52RGF0YSEuYnVmZmVyLCAwLCBieXRlT2Zmc2V0ID4+IDIpO1xyXG4gICAgICAgICAgICBpYS52ZXJ0ZXhDb3VudCA9IHJlbmRlckRhdGEudmVydGV4U3RhcnQ7XHJcbiAgICAgICAgICAgIGlhLnZlcnRleEJ1ZmZlcnNbMF0udXBkYXRlKHZlcnRpY2VzRGF0YSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VzRGF0YSA9IG5ldyBVaW50MTZBcnJheShyZW5kZXJEYXRhLmlEYXRhIS5idWZmZXIsIDAsIHJlbmRlckRhdGEuaW5kaWNlc1N0YXJ0KTtcclxuICAgICAgICAgICAgaWEuaW5kZXhDb3VudCA9IHJlbmRlckRhdGEuaW5kaWNlc1N0YXJ0O1xyXG4gICAgICAgICAgICBpYS5pbmRleEJ1ZmZlciEudXBkYXRlKGluZGljZXNEYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdyYXBoaWNzLm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9leHBhbmRTdHJva2UgKGdyYXBoaWNzOiBHcmFwaGljcykge1xyXG4gICAgICAgIGNvbnN0IHcgPSBncmFwaGljcy5saW5lV2lkdGggKiAwLjU7XHJcbiAgICAgICAgY29uc3QgbGluZUNhcCA9IGdyYXBoaWNzLmxpbmVDYXA7XHJcbiAgICAgICAgY29uc3QgbGluZUpvaW4gPSBncmFwaGljcy5saW5lSm9pbjtcclxuICAgICAgICBjb25zdCBtaXRlckxpbWl0ID0gZ3JhcGhpY3MubWl0ZXJMaW1pdDtcclxuXHJcbiAgICAgICAgX2ltcGwgPSBncmFwaGljcy5pbXBsO1xyXG5cclxuICAgICAgICBpZiAoIV9pbXBsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5DYXAgPSBjdXJ2ZURpdnModywgUEksIF9pbXBsLnRlc3NUb2wpO1xyXG5cclxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVKb2lucyhfaW1wbCwgdywgbGluZUpvaW4sIG1pdGVyTGltaXQpO1xyXG5cclxuICAgICAgICBjb25zdCBwYXRocyA9IF9pbXBsLnBhdGhzO1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgbWF4IHZlcnRleCB1c2FnZS5cclxuICAgICAgICBsZXQgdmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBfaW1wbC5wYXRoT2Zmc2V0LCBsID0gX2ltcGwucGF0aExlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gcGF0aHNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50c0xlbmd0aCA9IHBhdGgucG9pbnRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGlmIChsaW5lSm9pbiA9PT0gTGluZUpvaW4uUk9VTkQpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleENvdW50ICs9IChwb2ludHNMZW5ndGggKyBwYXRoLmJldmVsICogKG5DYXAgKyAyKSArIDEpICogMjtcclxuICAgICAgICAgICAgfSAvLyBwbHVzIG9uZSBmb3IgbG9vcFxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleENvdW50ICs9IChwb2ludHNMZW5ndGggKyBwYXRoLmJldmVsICogNSArIDEpICogMjtcclxuICAgICAgICAgICAgfSAvLyBwbHVzIG9uZSBmb3IgbG9vcFxyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXRoLmNsb3NlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc3BhY2UgZm9yIGNhcHNcclxuICAgICAgICAgICAgICAgIGlmIChsaW5lQ2FwID09PSBMaW5lQ2FwLlJPVU5EKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGV4Q291bnQgKz0gKG5DYXAgKiAyICsgMikgKiAyO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhDb3VudCArPSAoMyArIDMpICogMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWVzaEJ1ZmZlcjogTWVzaFJlbmRlckRhdGEgfCBudWxsID0gX3JlbmRlckRhdGEgPSB0aGlzLmdldFJlbmRlckRhdGEhKGdyYXBoaWNzLCB2ZXJ0ZXhDb3VudCk7XHJcbiAgICAgICAgaWYgKCFtZXNoQnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdkRhdGEgPSBtZXNoQnVmZmVyLnZEYXRhITtcclxuICAgICAgICBjb25zdCBpRGF0YSA9IG1lc2hCdWZmZXIuaURhdGEhO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gX2ltcGwucGF0aE9mZnNldCwgbCA9IF9pbXBsLnBhdGhMZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHBhdGhzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBwdHMgPSBwYXRoLnBvaW50cztcclxuICAgICAgICAgICAgY29uc3QgcG9pbnRzTGVuZ3RoID0gcHRzLmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gbWVzaEJ1ZmZlci52ZXJ0ZXhTdGFydDtcclxuXHJcbiAgICAgICAgICAgIGxldCBwMDogUG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBwMTogUG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBzdGFydCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBlbmQgPSAwO1xyXG4gICAgICAgICAgICBjb25zdCBsb29wID0gcGF0aC5jbG9zZWQ7XHJcbiAgICAgICAgICAgIGlmIChsb29wKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBMb29waW5nXHJcbiAgICAgICAgICAgICAgICBwMCA9IHB0c1twb2ludHNMZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIHAxID0gcHRzWzBdO1xyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgZW5kID0gcG9pbnRzTGVuZ3RoO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQWRkIGNhcFxyXG4gICAgICAgICAgICAgICAgcDAgPSBwdHNbMF07XHJcbiAgICAgICAgICAgICAgICBwMSA9IHB0c1sxXTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IHBvaW50c0xlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghbG9vcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gQWRkIGNhcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgZFBvcyA9IG5ldyBQb2ludChwMS54LCBwMS55KTtcclxuICAgICAgICAgICAgICAgIGRQb3Muc3VidHJhY3QocDApO1xyXG4gICAgICAgICAgICAgICAgZFBvcy5ub3JtYWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkeCA9IGRQb3MueDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGR5ID0gZFBvcy55O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsaW5lQ2FwID09PSBMaW5lQ2FwLkJVVFQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9idXR0Q2FwU3RhcnQhKHAwLCBkeCwgZHksIHcsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZUNhcCA9PT0gTGluZUNhcC5TUVVBUkUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9idXR0Q2FwU3RhcnQhKHAwLCBkeCwgZHksIHcsIHcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGluZUNhcCA9PT0gTGluZUNhcC5ST1VORCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JvdW5kQ2FwU3RhcnQhKHAwLCBkeCwgZHksIHcsIG5DYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gc3RhcnQ7IGogPCBlbmQ7ICsraikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpbmVKb2luID09PSBMaW5lSm9pbi5ST1VORCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JvdW5kSm9pbihwMCwgcDEsIHcsIHcsIG5DYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKHAxLmZsYWdzICYgKFBvaW50RmxhZ3MuUFRfQkVWRUwgfCBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwpKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JldmVsSm9pbihwMCwgcDEsIHcsIHcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdlNldCEocDEueCArIHAxLmRteCAqIHcsIHAxLnkgKyBwMS5kbXkgKiB3LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92U2V0IShwMS54IC0gcDEuZG14ICogdywgcDEueSAtIHAxLmRteSAqIHcsIC0xKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwMCA9IHAxO1xyXG4gICAgICAgICAgICAgICAgcDEgPSBwdHNbaiArIDFdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobG9vcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gTG9vcCBpdFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdkRhdGFPZmZzZXQgPSBvZmZzZXQgKiBhdHRyQnl0ZXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92U2V0KHZEYXRhW3ZEYXRhT2Zmc2V0XSwgdkRhdGFbdkRhdGFPZmZzZXQgKyAxXSwgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92U2V0KHZEYXRhW3ZEYXRhT2Zmc2V0ICsgYXR0ckJ5dGVzXSwgdkRhdGFbdkRhdGFPZmZzZXQgKyBhdHRyQnl0ZXMgKyAxXSwgLTEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQWRkIGNhcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgZFBvcyA9IG5ldyBQb2ludChwMS54LCBwMS55KTtcclxuICAgICAgICAgICAgICAgIGRQb3Muc3VidHJhY3QocDApO1xyXG4gICAgICAgICAgICAgICAgZFBvcy5ub3JtYWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkeCA9IGRQb3MueDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGR5ID0gZFBvcy55O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsaW5lQ2FwID09PSBMaW5lQ2FwLkJVVFQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9idXR0Q2FwRW5kIShwMSwgZHgsIGR5LCB3LCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxpbmVDYXAgPT09IExpbmVDYXAuU1FVQVJFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnV0dENhcEVuZCEocDEsIGR4LCBkeSwgdywgdyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsaW5lQ2FwID09PSBMaW5lQ2FwLlJPVU5EKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm91bmRDYXBFbmQhKHAxLCBkeCwgZHksIHcsIG5DYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzdHJva2UgaW5kaWNlc1xyXG4gICAgICAgICAgICBsZXQgaW5kaWNlc09mZnNldCA9IG1lc2hCdWZmZXIuaW5kaWNlc1N0YXJ0O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBiZWdpbiA9IG9mZnNldCArIDIsIG92ZXIgPSBtZXNoQnVmZmVyLnZlcnRleFN0YXJ0OyBiZWdpbiA8IG92ZXI7IGJlZ2luKyspIHtcclxuICAgICAgICAgICAgICAgIGlEYXRhW2luZGljZXNPZmZzZXQrK10gPSBiZWdpbiAtIDI7XHJcbiAgICAgICAgICAgICAgICBpRGF0YVtpbmRpY2VzT2Zmc2V0KytdID0gYmVnaW4gLSAxO1xyXG4gICAgICAgICAgICAgICAgaURhdGFbaW5kaWNlc09mZnNldCsrXSA9IGJlZ2luO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXNoQnVmZmVyLmluZGljZXNTdGFydCA9IGluZGljZXNPZmZzZXQ7XHJcbiAgICAgICAgICAgIGlmIChpbmRpY2VzT2Zmc2V0ICE9PSBtZXNoQnVmZmVyLmluZGljZXNDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXJyID0gbmV3IEFycmF5KG1lc2hCdWZmZXIuaW5kaWNlc0NvdW50IC0gaW5kaWNlc09mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBtZXNoQnVmZmVyLmlEYXRhLnNldChhcnIsIGluZGljZXNPZmZzZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9yZW5kZXJEYXRhID0gbnVsbDtcclxuICAgICAgICBfaW1wbCA9IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIF9leHBhbmRGaWxsIChncmFwaGljczogR3JhcGhpY3MpIHtcclxuICAgICAgICBfaW1wbCA9IGdyYXBoaWNzLmltcGw7XHJcbiAgICAgICAgaWYgKCFfaW1wbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXRocyA9IF9pbXBsLnBhdGhzO1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgbWF4IHZlcnRleCB1c2FnZS5cclxuICAgICAgICBsZXQgdmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBfaW1wbC5wYXRoT2Zmc2V0LCBsID0gX2ltcGwucGF0aExlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gcGF0aHNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50c0xlbmd0aCA9IHBhdGgucG9pbnRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIHZlcnRleENvdW50ICs9IHBvaW50c0xlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbmRlckRhdGEgPSBfcmVuZGVyRGF0YSA9IHRoaXMuZ2V0UmVuZGVyRGF0YSEoZ3JhcGhpY3MsIHZlcnRleENvdW50KTtcclxuICAgICAgICBpZiAoIXJlbmRlckRhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWVzaEJ1ZmZlciA9IHJlbmRlckRhdGE7XHJcbiAgICAgICAgY29uc3QgdkRhdGEgPSBtZXNoQnVmZmVyLnZEYXRhITtcclxuICAgICAgICBjb25zdCBpRGF0YSA9IG1lc2hCdWZmZXIuaURhdGEhO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gX2ltcGwucGF0aE9mZnNldCwgbCA9IF9pbXBsLnBhdGhMZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHBhdGhzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBwdHMgPSBwYXRoLnBvaW50cztcclxuICAgICAgICAgICAgY29uc3QgcG9pbnRzTGVuZ3RoID0gcHRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwb2ludHNMZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgc2hhcGUgdmVydGljZXMuXHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleE9mZnNldCA9IHJlbmRlckRhdGEudmVydGV4U3RhcnQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBvaW50c0xlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92U2V0IShwdHNbal0ueCwgcHRzW2pdLnkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kaWNlc09mZnNldCA9IHJlbmRlckRhdGEuaW5kaWNlc1N0YXJ0O1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhdGguY29tcGxleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWFyY3V0RGF0YTogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSB2ZXJ0ZXhPZmZzZXQsIGVuZCA9IHJlbmRlckRhdGEudmVydGV4U3RhcnQ7IGogPCBlbmQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2RGF0YU9mZnNldCA9IGogKiBhdHRyQnl0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgZWFyY3V0RGF0YS5wdXNoKHZEYXRhW3ZEYXRhT2Zmc2V0KytdKTtcclxuICAgICAgICAgICAgICAgICAgICBlYXJjdXREYXRhLnB1c2godkRhdGFbdkRhdGFPZmZzZXQrK10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVhcmN1dERhdGEucHVzaCh2RGF0YVt2RGF0YU9mZnNldCsrXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3SW5kaWNlcyA9IEVhcmN1dChlYXJjdXREYXRhLCBudWxsLCAzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW5ld0luZGljZXMgfHwgbmV3SW5kaWNlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbkluZGljZXMgPSBuZXdJbmRpY2VzLmxlbmd0aDsgaiA8IG5JbmRpY2VzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpRGF0YVtpbmRpY2VzT2Zmc2V0KytdID0gbmV3SW5kaWNlc1tqXSArIHZlcnRleE9mZnNldDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0ID0gdmVydGV4T2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgc3RhcnQgPSB2ZXJ0ZXhPZmZzZXQgKyAyLCBlbmQgPSBtZXNoQnVmZmVyLnZlcnRleFN0YXJ0OyBzdGFydCA8IGVuZDsgc3RhcnQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlEYXRhW2luZGljZXNPZmZzZXQrK10gPSBmaXJzdDtcclxuICAgICAgICAgICAgICAgICAgICBpRGF0YVtpbmRpY2VzT2Zmc2V0KytdID0gc3RhcnQgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGlEYXRhW2luZGljZXNPZmZzZXQrK10gPSBzdGFydDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbWVzaEJ1ZmZlci5pbmRpY2VzU3RhcnQgPSBpbmRpY2VzT2Zmc2V0O1xyXG4gICAgICAgICAgICBpZiAoaW5kaWNlc09mZnNldCAhPT0gbWVzaEJ1ZmZlci5pbmRpY2VzQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFyciA9IG5ldyBBcnJheShtZXNoQnVmZmVyLmluZGljZXNDb3VudCAtIGluZGljZXNPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgbWVzaEJ1ZmZlci5pRGF0YS5zZXQoYXJyLCBpbmRpY2VzT2Zmc2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX3JlbmRlckRhdGEgPSBudWxsO1xyXG4gICAgICAgIF9pbXBsID0gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgX2NhbGN1bGF0ZUpvaW5zIChpbXBsOiBJbXBsLCB3OiBudW1iZXIsIGxpbmVKb2luOiBMaW5lSm9pbiwgbWl0ZXJMaW1pdDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGl3ID0gMC4wO1xyXG5cclxuICAgICAgICBpZiAodyA+IDAuMCkge1xyXG4gICAgICAgICAgICBpdyA9IDEgLyB3O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHdoaWNoIGpvaW5zIG5lZWRzIGV4dHJhIHZlcnRpY2VzIHRvIGFwcGVuZCwgYW5kIGdhdGhlciB2ZXJ0ZXggY291bnQuXHJcbiAgICAgICAgY29uc3QgcGF0aHMgPSBpbXBsLnBhdGhzO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBpbXBsLnBhdGhPZmZzZXQsIGwgPSBpbXBsLnBhdGhMZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHBhdGhzW2ldO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcHRzID0gcGF0aC5wb2ludHM7XHJcbiAgICAgICAgICAgIGNvbnN0IHB0c0xlbmd0aCA9IHB0cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBwMCA9IHB0c1twdHNMZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgbGV0IHAxID0gcHRzWzBdO1xyXG4gICAgICAgICAgICBsZXQgbkxlZnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgcGF0aC5iZXZlbCA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHB0c0xlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZG1yMiA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3Jvc3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpbWl0ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwZXJwIG5vcm1hbHNcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRseDAgPSBwMC5keTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRseTAgPSAtcDAuZHg7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkbHgxID0gcDEuZHk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkbHkxID0gLXAxLmR4O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBleHRydXNpb25zXHJcbiAgICAgICAgICAgICAgICBwMS5kbXggPSAoZGx4MCArIGRseDEpICogMC41O1xyXG4gICAgICAgICAgICAgICAgcDEuZG15ID0gKGRseTAgKyBkbHkxKSAqIDAuNTtcclxuICAgICAgICAgICAgICAgIGRtcjIgPSBwMS5kbXggKiBwMS5kbXggKyBwMS5kbXkgKiBwMS5kbXk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG1yMiA+IDAuMDAwMDAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjYWxlID0gMSAvIGRtcjI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjYWxlID4gNjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlID0gNjAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwMS5kbXggKj0gc2NhbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcDEuZG15ICo9IHNjYWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgbGVmdCB0dXJucy5cclxuICAgICAgICAgICAgICAgIGNyb3NzID0gcDEuZHggKiBwMC5keSAtIHAwLmR4ICogcDEuZHk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3Jvc3MgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbkxlZnQrKztcclxuICAgICAgICAgICAgICAgICAgICBwMS5mbGFncyB8PSBQb2ludEZsYWdzLlBUX0xFRlQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGlmIHdlIHNob3VsZCB1c2UgYmV2ZWwgb3IgbWl0ZXIgZm9yIGlubmVyIGpvaW4uXHJcbiAgICAgICAgICAgICAgICBsaW1pdCA9IG1heCgxMSwgbWluKHAwLmxlbiwgcDEubGVuKSAqIGl3KTtcclxuICAgICAgICAgICAgICAgIGlmIChkbXIyICogbGltaXQgKiBsaW1pdCA8IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwMS5mbGFncyB8PSBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBjb3JuZXIgbmVlZHMgdG8gYmUgYmV2ZWxlZC5cclxuICAgICAgICAgICAgICAgIGlmIChwMS5mbGFncyAmIFBvaW50RmxhZ3MuUFRfQ09STkVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRtcjIgKiBtaXRlckxpbWl0ICogbWl0ZXJMaW1pdCA8IDEgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZUpvaW4gPT09IExpbmVKb2luLkJFVkVMIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVKb2luID09PSBMaW5lSm9pbi5ST1VORCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwMS5mbGFncyB8PSBQb2ludEZsYWdzLlBUX0JFVkVMO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHAxLmZsYWdzICYgKFBvaW50RmxhZ3MuUFRfQkVWRUwgfCBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwpKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGguYmV2ZWwrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwMCA9IHAxO1xyXG4gICAgICAgICAgICAgICAgcDEgPSBwdHNbaiArIDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfZmxhdHRlblBhdGhzIChpbXBsOiBJbXBsKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aHMgPSBpbXBsLnBhdGhzO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBpbXBsLnBhdGhPZmZzZXQsIGwgPSBpbXBsLnBhdGhMZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHBhdGhzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBwdHMgPSBwYXRoLnBvaW50cztcclxuXHJcbiAgICAgICAgICAgIGxldCBwMCA9IHB0c1twdHMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGxldCBwMSA9IHB0c1swXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwdHMubGVuZ3RoID4gMiAmJiBwMC5lcXVhbHMocDEpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoLmNsb3NlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBwdHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICBwMCA9IHB0c1twdHMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBzaXplID0gcHRzLmxlbmd0aDsgaiA8IHNpemU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHNlZ21lbnQgZGlyZWN0aW9uIGFuZCBsZW5ndGhcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRQb3MgPSBuZXcgUG9pbnQocDEueCwgcDEueSk7XHJcbiAgICAgICAgICAgICAgICBkUG9zLnN1YnRyYWN0KHAwKTtcclxuICAgICAgICAgICAgICAgIHAwLmxlbiA9IGRQb3MubGVuZ3RoKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZFBvcy54IHx8IGRQb3MueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRQb3Mubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwMC5keCA9IGRQb3MueDtcclxuICAgICAgICAgICAgICAgIHAwLmR5ID0gZFBvcy55O1xyXG4gICAgICAgICAgICAgICAgLy8gQWR2YW5jZVxyXG4gICAgICAgICAgICAgICAgcDAgPSBwMTtcclxuICAgICAgICAgICAgICAgIHAxID0gcHRzW2ogKyAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2Nob29zZUJldmVsIChiZXZlbDogbnVtYmVyLCBwMDogUG9pbnQsIHAxOiBQb2ludCwgdzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IHAxLng7XHJcbiAgICAgICAgY29uc3QgeSA9IHAxLnk7XHJcbiAgICAgICAgbGV0IHgwID0gMDtcclxuICAgICAgICBsZXQgeTAgPSAwO1xyXG4gICAgICAgIGxldCB4MSA9IDA7XHJcbiAgICAgICAgbGV0IHkxID0gMDtcclxuXHJcbiAgICAgICAgaWYgKGJldmVsICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHgwID0geCArIHAwLmR5ICogdztcclxuICAgICAgICAgICAgeTAgPSB5IC0gcDAuZHggKiB3O1xyXG4gICAgICAgICAgICB4MSA9IHggKyBwMS5keSAqIHc7XHJcbiAgICAgICAgICAgIHkxID0geSAtIHAxLmR4ICogdztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4MCA9IHgxID0geCArIHAxLmRteCAqIHc7XHJcbiAgICAgICAgICAgIHkwID0geTEgPSB5ICsgcDEuZG15ICogdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbeDAsIHkwLCB4MSwgeTFdO1xyXG4gICAgfSxcclxuXHJcbiAgICBfYnV0dENhcFN0YXJ0IChwOiBQb2ludCwgZHg6IG51bWJlciwgZHk6IG51bWJlciwgdzogbnVtYmVyLCBkOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBweCA9IHAueCAtIGR4ICogZDtcclxuICAgICAgICBjb25zdCBweSA9IHAueSAtIGR5ICogZDtcclxuICAgICAgICBjb25zdCBkbHggPSBkeTtcclxuICAgICAgICBjb25zdCBkbHkgPSAtZHg7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZTZXQhKHB4ICsgZGx4ICogdywgcHkgKyBkbHkgKiB3LCAxKTtcclxuICAgICAgICB0aGlzLl92U2V0IShweCAtIGRseCAqIHcsIHB5IC0gZGx5ICogdywgLTEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfYnV0dENhcEVuZCAocDogUG9pbnQsIGR4OiBudW1iZXIsIGR5OiBudW1iZXIsIHc6IG51bWJlciwgZDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcHggPSBwLnggKyBkeCAqIGQ7XHJcbiAgICAgICAgY29uc3QgcHkgPSBwLnkgKyBkeSAqIGQ7XHJcbiAgICAgICAgY29uc3QgZGx4ID0gZHk7XHJcbiAgICAgICAgY29uc3QgZGx5ID0gLWR4O1xyXG5cclxuICAgICAgICB0aGlzLl92U2V0IShweCArIGRseCAqIHcsIHB5ICsgZGx5ICogdywgMSk7XHJcbiAgICAgICAgdGhpcy5fdlNldCEocHggLSBkbHggKiB3LCBweSAtIGRseSAqIHcsIC0xKTtcclxuICAgIH0sXHJcblxyXG4gICAgX3JvdW5kQ2FwU3RhcnQgKHA6IFBvaW50LCBkeDogbnVtYmVyLCBkeTogbnVtYmVyLCB3OiBudW1iZXIsIG5DYXA6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHB4ID0gcC54O1xyXG4gICAgICAgIGNvbnN0IHB5ID0gcC55O1xyXG4gICAgICAgIGNvbnN0IGRseCA9IGR5O1xyXG4gICAgICAgIGNvbnN0IGRseSA9IC1keDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuQ2FwOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IGkgLyAobkNhcCAtIDEpICogUEk7XHJcbiAgICAgICAgICAgIGNvbnN0IGF4ID0gY29zKGEpICogdztcclxuICAgICAgICAgICAgY29uc3QgYXkgPSBzaW4oYSkgKiB3O1xyXG4gICAgICAgICAgICB0aGlzLl92U2V0IShweCAtIGRseCAqIGF4IC0gZHggKiBheSwgcHkgLSBkbHkgKiBheCAtIGR5ICogYXksIDEpO1xyXG4gICAgICAgICAgICB0aGlzLl92U2V0IShweCwgcHksIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl92U2V0IShweCArIGRseCAqIHcsIHB5ICsgZGx5ICogdywgMSk7XHJcbiAgICAgICAgdGhpcy5fdlNldCEocHggLSBkbHggKiB3LCBweSAtIGRseSAqIHcsIC0xKTtcclxuICAgIH0sXHJcblxyXG4gICAgX3JvdW5kQ2FwRW5kIChwOiBQb2ludCwgZHg6IG51bWJlciwgZHk6IG51bWJlciwgdzogbnVtYmVyLCBuQ2FwOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBweCA9IHAueDtcclxuICAgICAgICBjb25zdCBweSA9IHAueTtcclxuICAgICAgICBjb25zdCBkbHggPSBkeTtcclxuICAgICAgICBjb25zdCBkbHkgPSAtZHg7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZTZXQhKHB4ICsgZGx4ICogdywgcHkgKyBkbHkgKiB3LCAxKTtcclxuICAgICAgICB0aGlzLl92U2V0IShweCAtIGRseCAqIHcsIHB5IC0gZGx5ICogdywgLTEpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbkNhcDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBpIC8gKG5DYXAgLSAxKSAqIFBJO1xyXG4gICAgICAgICAgICBjb25zdCBheCA9IGNvcyhhKSAqIHc7XHJcbiAgICAgICAgICAgIGNvbnN0IGF5ID0gc2luKGEpICogdztcclxuICAgICAgICAgICAgdGhpcy5fdlNldCEocHgsIHB5LCAwKTtcclxuICAgICAgICAgICAgdGhpcy5fdlNldCEocHggLSBkbHggKiBheCArIGR4ICogYXksIHB5IC0gZGx5ICogYXggKyBkeSAqIGF5LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9yb3VuZEpvaW4gKHAwOiBQb2ludCwgcDE6IFBvaW50LCBsdzogbnVtYmVyLCBydzogbnVtYmVyLCBuQ2FwOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkbHgwID0gcDAuZHk7XHJcbiAgICAgICAgY29uc3QgZGx5MCA9IC1wMC5keDtcclxuICAgICAgICBjb25zdCBkbHgxID0gcDEuZHk7XHJcbiAgICAgICAgY29uc3QgZGx5MSA9IC1wMS5keDtcclxuXHJcbiAgICAgICAgY29uc3QgcDF4ID0gcDEueDtcclxuICAgICAgICBjb25zdCBwMXkgPSBwMS55O1xyXG5cclxuICAgICAgICBpZiAoKHAxLmZsYWdzICYgUG9pbnRGbGFncy5QVF9MRUZUKSAhPT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBvdXQgPSB0aGlzLl9jaG9vc2VCZXZlbCEocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwsIHAwLCBwMSwgbHcpO1xyXG4gICAgICAgICAgICBjb25zdCBseDAgPSBvdXRbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IGx5MCA9IG91dFsxXTtcclxuICAgICAgICAgICAgY29uc3QgbHgxID0gb3V0WzJdO1xyXG4gICAgICAgICAgICBjb25zdCBseTEgPSBvdXRbM107XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhMCA9IGF0YW4yKC1kbHkwLCAtZGx4MCk7XHJcbiAgICAgICAgICAgIGxldCBhMSA9IGF0YW4yKC1kbHkxLCAtZGx4MSk7XHJcbiAgICAgICAgICAgIGlmIChhMSA+IGEwKSB7IGExIC09IFBJICogMjsgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fdlNldCEobHgwLCBseTAsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLl92U2V0IShwMXggLSBkbHgwICogcncsIHAxLnkgLSBkbHkwICogcncsIC0xKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG4gPSBjbGFtcChjZWlsKChhMCAtIGExKSAvIFBJKSAqIG5DYXAsIDIsIG5DYXApO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdSA9IGkgLyAobiAtIDEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IGEwICsgdSAqIChhMSAtIGEwKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJ4ID0gcDF4ICsgY29zKGEpICogcnc7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByeSA9IHAxeSArIHNpbihhKSAqIHJ3O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdlNldCEocDF4LCBwMXksIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdlNldCEocngsIHJ5LCAtMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3ZTZXQhKGx4MSwgbHkxLCAxKTtcclxuICAgICAgICAgICAgdGhpcy5fdlNldCEocDF4IC0gZGx4MSAqIHJ3LCBwMXkgLSBkbHkxICogcncsIC0xKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBvdXQgPSB0aGlzLl9jaG9vc2VCZXZlbCEocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwsIHAwLCBwMSwgLXJ3KTtcclxuICAgICAgICAgICAgY29uc3QgcngwID0gb3V0WzBdO1xyXG4gICAgICAgICAgICBjb25zdCByeTAgPSBvdXRbMV07XHJcbiAgICAgICAgICAgIGNvbnN0IHJ4MSA9IG91dFsyXTtcclxuICAgICAgICAgICAgY29uc3QgcnkxID0gb3V0WzNdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYTAgPSBhdGFuMihkbHkwLCBkbHgwKTtcclxuICAgICAgICAgICAgbGV0IGExID0gYXRhbjIoZGx5MSwgZGx4MSk7XHJcbiAgICAgICAgICAgIGlmIChhMSA8IGEwKSB7IGExICs9IFBJICogMjsgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fdlNldCEocDF4ICsgZGx4MCAqIHJ3LCBwMXkgKyBkbHkwICogcncsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLl92U2V0IShyeDAsIHJ5MCwgLTEpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbiA9IGNsYW1wKGNlaWwoKGExIC0gYTApIC8gUEkpICogbkNhcCwgMiwgbkNhcCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1ID0gaSAvIChuIC0gMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gYTAgKyB1ICogKGExIC0gYTApO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbHggPSBwMXggKyBjb3MoYSkgKiBsdztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGx5ID0gcDF5ICsgc2luKGEpICogbHc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92U2V0IShseCwgbHksIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdlNldCEocDF4LCBwMXksIDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl92U2V0IShwMXggKyBkbHgxICogcncsIHAxeSArIGRseTEgKiBydywgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZTZXQhKHJ4MSwgcnkxLCAtMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfYmV2ZWxKb2luIChwMDogUG9pbnQsIHAxOiBQb2ludCwgbHc6IG51bWJlciwgcnc6IG51bWJlcikge1xyXG4gICAgICAgIGxldCByeDAgPSAwO1xyXG4gICAgICAgIGxldCByeTAgPSAwO1xyXG4gICAgICAgIGxldCByeDEgPSAwO1xyXG4gICAgICAgIGxldCByeTEgPSAwO1xyXG4gICAgICAgIGxldCBseDAgPSAwO1xyXG4gICAgICAgIGxldCBseTAgPSAwO1xyXG4gICAgICAgIGxldCBseDEgPSAwO1xyXG4gICAgICAgIGxldCBseTEgPSAwO1xyXG4gICAgICAgIGNvbnN0IGRseDAgPSBwMC5keTtcclxuICAgICAgICBjb25zdCBkbHkwID0gLXAwLmR4O1xyXG4gICAgICAgIGNvbnN0IGRseDEgPSBwMS5keTtcclxuICAgICAgICBjb25zdCBkbHkxID0gLXAxLmR4O1xyXG5cclxuICAgICAgICBpZiAocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0xFRlQpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ID0gdGhpcy5fY2hvb3NlQmV2ZWwhKHAxLmZsYWdzICYgUG9pbnRGbGFncy5QVF9JTk5FUkJFVkVMLCBwMCwgcDEsIGx3KTtcclxuICAgICAgICAgICAgbHgwID0gb3V0WzBdO1xyXG4gICAgICAgICAgICBseTAgPSBvdXRbMV07XHJcbiAgICAgICAgICAgIGx4MSA9IG91dFsyXTtcclxuICAgICAgICAgICAgbHkxID0gb3V0WzNdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdlNldCEobHgwLCBseTAsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLl92U2V0IShwMS54IC0gZGx4MCAqIHJ3LCBwMS55IC0gZGx5MCAqIHJ3LCAtMSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl92U2V0IShseDEsIGx5MSwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZTZXQhKHAxLnggLSBkbHgxICogcncsIHAxLnkgLSBkbHkxICogcncsIC0xKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBvdXQgPSB0aGlzLl9jaG9vc2VCZXZlbCEocDEuZmxhZ3MgJiBQb2ludEZsYWdzLlBUX0lOTkVSQkVWRUwsIHAwLCBwMSwgLXJ3KTtcclxuICAgICAgICAgICAgcngwID0gb3V0WzBdO1xyXG4gICAgICAgICAgICByeTAgPSBvdXRbMV07XHJcbiAgICAgICAgICAgIHJ4MSA9IG91dFsyXTtcclxuICAgICAgICAgICAgcnkxID0gb3V0WzNdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdlNldCEocDEueCArIGRseDAgKiBsdywgcDEueSArIGRseTAgKiBsdywgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZTZXQhKHJ4MCwgcnkwLCAtMSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl92U2V0IShwMS54ICsgZGx4MSAqIGx3LCBwMS55ICsgZGx5MSAqIGx3LCAxKTtcclxuICAgICAgICAgICAgdGhpcy5fdlNldCEocngxLCByeTEsIC0xKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF92U2V0ICh4OiBudW1iZXIsIHk6IG51bWJlciwgZGlzdGFuY2UgPSAwKSB7XHJcbiAgICAgICAgaWYgKCFfcmVuZGVyRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtZXNoQnVmZmVyID0gX3JlbmRlckRhdGE7XHJcbiAgICAgICAgbGV0IGRhdGFPZmZzZXQgPSBtZXNoQnVmZmVyLnZlcnRleFN0YXJ0ICogYXR0ckJ5dGVzO1xyXG4gICAgICAgIGNvbnN0IHZEYXRhID0gbWVzaEJ1ZmZlci52RGF0YSE7XHJcbiAgICAgICAgLy8gdmVjMy5zZXQoX3RlbXBWZWMzLCB4LCB5LCAwKTtcclxuICAgICAgICAvLyB2ZWMzLnRyYW5zZm9ybU1hdDQoX3RlbXBWZWMzLCBfdGVtcFZlYzMsIF9jdXJyTWF0cml4KTtcclxuXHJcbiAgICAgICAgdkRhdGFbZGF0YU9mZnNldCsrXSA9IHg7XHJcbiAgICAgICAgdkRhdGFbZGF0YU9mZnNldCsrXSA9IHk7XHJcbiAgICAgICAgdkRhdGFbZGF0YU9mZnNldCsrXSA9IDA7XHJcbiAgICAgICAgQ29sb3IudG9BcnJheSh2RGF0YSEsIF9jdXJDb2xvciwgZGF0YU9mZnNldCk7XHJcbiAgICAgICAgZGF0YU9mZnNldCArPSA0O1xyXG4gICAgICAgIHZEYXRhW2RhdGFPZmZzZXQrK10gPSBkaXN0YW5jZTtcclxuICAgICAgICBtZXNoQnVmZmVyLnZlcnRleFN0YXJ0Kys7XHJcbiAgICB9LFxyXG59O1xyXG4iXX0=