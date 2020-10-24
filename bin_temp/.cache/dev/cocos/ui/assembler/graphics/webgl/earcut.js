(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.earcut = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
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
  'use strict';

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.earcut = earcut;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Aim = // vertex index in coordinates array
  // vertex coordinates
  // previous and next vertex nodes in a polygon ring
  // z-order curve value
  // public z = null;
  // previous and next nodes in z-order
  // indicates whether this is a steiner point
  function Aim(i, x, y) {
    _classCallCheck(this, Aim);

    this.i = void 0;
    this.x = void 0;
    this.y = void 0;
    this.prev = null;
    this.next = null;
    this.z = 0;
    this.prevZ = null;
    this.nextZ = null;
    this.steiner = false;
    this.i = i;
    this.x = x;
    this.y = y;
  }; // create a circular doubly linked list from polygon points in the specified winding order


  function linkedList(datas, start, end, dim, clockwise) {
    var i = 0;
    var last = null;

    if (clockwise === signedArea(datas, start, end, dim) > 0) {
      for (i = start; i < end; i += dim) {
        last = insertNode(i, datas[i], datas[i + 1], last);
      }
    } else {
      for (i = end - dim; i >= start; i -= dim) {
        last = insertNode(i, datas[i], datas[i + 1], last);
      }
    }

    if (last && equals(last, last.next)) {
      removeNode(last);
      last = last.next;
    }

    return last;
  } // eliminate colinear or duplicate points


  function filterPoints(start) {
    var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (!start) {
      return start;
    }

    if (!end) {
      end = start;
    }

    var p = start;
    var again = false;

    do {
      again = false;

      if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
        removeNode(p);
        p = end = p.prev;

        if (p === p.next) {
          return null;
        }

        again = true;
      } else {
        p = p.next;
      }
    } while (again || p !== end);

    return end;
  } // main ear slicing loop which triangulates a polygon (given as a linked list)


  function earcutLinked(ear, triangles, dim, minX, minY, size) {
    var pass = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

    if (!ear) {
      return;
    } // interlink polygon nodes in z-order


    if (!pass && size) {
      indexCurve(ear, minX, minY, size);
    }

    var stop = ear;
    var prev = null;
    var next = null; // iterate through ears, slicing them one by one

    while (ear.prev !== ear.next) {
      prev = ear.prev;
      next = ear.next;

      if (size ? isEarHashed(ear, minX, minY, size) : isEar(ear)) {
        // cut off the triangle
        triangles.push(prev.i / dim);
        triangles.push(ear.i / dim);
        triangles.push(next.i / dim);
        removeNode(ear); // skipping the next vertices leads to less sliver triangles

        ear = next.next;
        stop = next.next;
        continue;
      }

      ear = next; // if we looped through the whole remaining polygon and can't find any more ears

      if (ear === stop) {
        // try filtering points and slicing again
        if (!pass) {
          earcutLinked(filterPoints(ear), triangles, dim, minX, minY, size, 1); // if this didn't work, try curing all small self-intersections locally
        } else if (pass === 1) {
          ear = cureLocalIntersections(ear, triangles, dim);
          earcutLinked(ear, triangles, dim, minX, minY, size, 2); // as a last resort, try splitting the remaining polygon into two
        } else if (pass === 2) {
          splitEarcut(ear, triangles, dim, minX, minY, size);
        }

        break;
      }
    }
  } // check whether a polygon node forms a valid ear with adjacent nodes


  function isEar(ear) {
    var a = ear.prev;
    var b = ear;
    var c = ear.next;

    if (area(a, b, c) >= 0) {
      return false;
    } // reflex, can't be an ear
    // now make sure we don't have other points inside the potential ear


    var p = ear.next.next;

    while (p !== ear.prev) {
      if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) {
        return false;
      }

      p = p.next;
    }

    return true;
  }

  function isEarHashed(ear, minX, minY, size) {
    var a = ear.prev;
    var b = ear;
    var c = ear.next;

    if (area(a, b, c) >= 0) {
      return false;
    } // reflex, can't be an ear
    // triangle bbox; min & max are calculated like this for speed


    var minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x;
    var minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y;
    var maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x;
    var maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y; // z-order range for the current triangle bbox;

    var minZ = zOrder(minTX, minTY, minX, minY, size);
    var maxZ = zOrder(maxTX, maxTY, minX, minY, size); // first look for points inside the triangle in increasing z-order

    var p = ear.nextZ;

    while (p && p.z <= maxZ) {
      if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) {
        return false;
      }

      p = p.nextZ;
    } // then look for points in decreasing z-order


    p = ear.prevZ;

    while (p && p.z >= minZ) {
      if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) {
        return false;
      }

      p = p.prevZ;
    }

    return true;
  } // go through all polygon nodes and cure small local self-intersections


  function cureLocalIntersections(start, triangles, dim) {
    var p = start;

    do {
      var a = p.prev;
      var b = p.next.next;

      if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
        triangles.push(a.i / dim);
        triangles.push(p.i / dim);
        triangles.push(b.i / dim); // remove two nodes involved

        removeNode(p);
        removeNode(p.next);
        p = start = b;
      }

      p = p.next;
    } while (p !== start);

    return p;
  } // try splitting polygon into two and triangulate them independently


  function splitEarcut(start, triangles, dim, minX, minY, size) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;

    do {
      var b = a.next.next;

      while (b !== a.prev) {
        if (a.i !== b.i && isValidDiagonal(a, b)) {
          // split the polygon in two by the diagonal
          var c = splitPolygon(a, b); // filter colinear points around the cuts

          a = filterPoints(a, a.next);
          c = filterPoints(c, c.next); // run earcut on each half

          earcutLinked(a, triangles, dim, minX, minY, size);
          earcutLinked(c, triangles, dim, minX, minY, size);
          return;
        }

        b = b.next;
      }

      a = a.next;
    } while (a !== start);
  } // link every hole into the outer loop, producing a single-ring polygon without holes


  function eliminateHoles(datas, holeIndices, outerNode, dim) {
    var queue = [];
    var i = 0;
    var len = 0;
    var start = 0;
    var end = 0;
    var list = null;

    for (i = 0, len = holeIndices.length; i < len; i++) {
      start = holeIndices[i] * dim;
      end = i < len - 1 ? holeIndices[i + 1] * dim : datas.length;
      list = linkedList(datas, start, end, dim, false);

      if (!list) {
        continue;
      }

      if (list === list.next) {
        list.steiner = true;
      }

      queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    if (!outerNode) {
      return outerNode;
    } // process holes from left to right


    for (i = 0; i < queue.length; i++) {
      eliminateHole(queue[i], outerNode);
      outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
  }

  function compareX(a, b) {
    return a.x - b.x;
  } // find a bridge between vertices that connects hole with an outer ring and and link it


  function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);

    if (outerNode) {
      var b = splitPolygon(outerNode, hole);
      filterPoints(b, b.next);
    }
  } // David Eberly's algorithm for finding a bridge between hole and outer polygon


  function findHoleBridge(hole, outerNode) {
    var p = outerNode;
    var hx = hole.x;
    var hy = hole.y;
    var qx = -Infinity;
    var m = null; // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point

    do {
      if (hy <= p.y && hy >= p.next.y) {
        var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);

        if (x <= hx && x > qx) {
          qx = x;

          if (x === hx) {
            if (hy === p.y) {
              return p;
            }

            if (hy === p.next.y) {
              return p.next;
            }
          }

          m = p.x < p.next.x ? p : p.next;
        }
      }

      p = p.next;
    } while (p !== outerNode);

    if (!m) {
      return null;
    }

    if (hx === qx) {
      return m.prev;
    } // hole touches outer segment; pick lower endpoint
    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point


    var stop = m;
    var mx = m.x;
    var my = m.y;
    var tanMin = Infinity;
    var tan;
    p = m.next;

    while (p !== stop) {
      if (hx >= p.x && p.x >= mx && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
        tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

        if ((tan < tanMin || tan === tanMin && p.x > m.x) && locallyInside(p, hole)) {
          m = p;
          tanMin = tan;
        }
      }

      p = p.next;
    }

    return m;
  } // interlink polygon nodes in z-order


  function indexCurve(start, minX, minY, size) {
    var p = start;

    do {
      if (p.z === null) {
        p.z = zOrder(p.x, p.y, minX, minY, size);
      }

      p.prevZ = p.prev;
      p.nextZ = p.next;
      p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;
    sortLinked(p);
  } // Simon Tatham's linked list merge sort algorithm
  // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html


  function sortLinked(list) {
    var i = 0;
    var p = null;
    var q = null;
    var e = null;
    var tail = null;
    var numMerges = 0;
    var pSize = 0;
    var qSize = 0;
    var inSize = 1;

    do {
      p = list;
      list = null;
      tail = null;
      numMerges = 0;

      while (p) {
        numMerges++;
        q = p;
        pSize = 0;

        for (i = 0; i < inSize; i++) {
          pSize++;
          q = q.nextZ;

          if (!q) {
            break;
          }
        }

        qSize = inSize;

        while (pSize > 0 || qSize > 0 && q) {
          if (pSize === 0) {
            e = q;
            q = q.nextZ;
            qSize--;
          } else if (qSize === 0 || !q) {
            e = p;
            p = p.nextZ;
            pSize--;
          } else if (p.z <= q.z) {
            e = p;
            p = p.nextZ;
            pSize--;
          } else {
            e = q;
            q = q.nextZ;
            qSize--;
          }

          if (tail) {
            tail.nextZ = e;
          } else {
            list = e;
          }

          e.prevZ = tail;
          tail = e;
        }

        p = q;
      }

      tail.nextZ = null;
      inSize *= 2;
    } while (numMerges > 1);

    return list;
  } // z-order of a point given coords and size of the data bounding box


  function zOrder(x, y, minX, minY, size) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) / size;
    y = 32767 * (y - minY) / size;
    x = (x | x << 8) & 0x00FF00FF;
    x = (x | x << 4) & 0x0F0F0F0F;
    x = (x | x << 2) & 0x33333333;
    x = (x | x << 1) & 0x55555555;
    y = (y | y << 8) & 0x00FF00FF;
    y = (y | y << 4) & 0x0F0F0F0F;
    y = (y | y << 2) & 0x33333333;
    y = (y | y << 1) & 0x55555555;
    return x | y << 1;
  } // find the leftmost node of a polygon ring


  function getLeftmost(start) {
    var p = start;
    var leftmost = start;

    do {
      if (p.x < leftmost.x) {
        leftmost = p;
      }

      p = p.next;
    } while (p !== start);

    return leftmost;
  } // check if a point lies within a convex triangle


  function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
  } // check if a diagonal between two polygon nodes is valid (lies in polygon interior)


  function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
  } // signed area of a triangle


  function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  } // check if two points are equal


  function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
  } // check if two segments intersect


  function intersects(p1, q1, p2, q2) {
    if (equals(p1, q1) && equals(p2, q2) || equals(p1, q2) && equals(p2, q1)) {
      return true;
    }

    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 && area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
  } // check if a polygon diagonal intersects any polygon segments


  function intersectsPolygon(a, b) {
    var p = a;

    do {
      if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) {
        return true;
      }

      p = p.next;
    } while (p !== a);

    return false;
  } // check if a polygon diagonal is locally inside the polygon


  function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
  } // check if the middle point of a polygon diagonal is inside the polygon


  function middleInside(a, b) {
    var p = a;
    var inside = false;
    var px = (a.x + b.x) / 2;
    var py = (a.y + b.y) / 2;

    do {
      if (p.y > py !== p.next.y > py && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) {
        inside = !inside;
      }

      p = p.next;
    } while (p !== a);

    return inside;
  } // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
  // if one belongs to the outer ring and another to a hole, it merges it into a single ring


  function splitPolygon(a, b) {
    var a2 = new Aim(a.i, a.x, a.y);
    var b2 = new Aim(b.i, b.x, b.y);
    var an = a.next;
    var bp = b.prev;
    a.next = b;
    b.prev = a;
    a2.next = an;
    an.prev = a2;
    b2.next = a2;
    a2.prev = b2;
    bp.next = b2;
    b2.prev = bp;
    return b2;
  } // create a node and optionally link it with previous one (in a circular doubly linked list)


  function insertNode(i, x, y, last) {
    var p = new Aim(i, x, y);

    if (!last) {
      p.prev = p;
      p.next = p;
    } else {
      p.next = last.next;
      p.prev = last;
      last.next.prev = p;
      last.next = p;
    }

    return p;
  }

  function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) {
      p.prevZ.nextZ = p.nextZ;
    }

    if (p.nextZ) {
      p.nextZ.prevZ = p.prevZ;
    }
  }

  function signedArea(datas, start, end, dim) {
    var sum = 0;

    for (var i = start, j = end - dim; i < end; i += dim) {
      sum += (datas[j] - datas[i]) * (datas[i + 1] + datas[j + 1]);
      j = i;
    }

    return sum;
  }

  function earcut(datas, holeIndices, dim) {
    dim = dim || 3;
    var hasHoles = holeIndices ? holeIndices.length : 0;
    var outerLen = hasHoles ? holeIndices[0] * dim : datas.length;
    var outerNode = linkedList(datas, 0, outerLen, dim, true);
    var triangles = [];

    if (!outerNode) {
      return triangles;
    }

    var minX = 0;
    var minY = 0;
    var maxX = 0;
    var maxY = 0;
    var x = 0;
    var y = 0;
    var size = 0;

    if (hasHoles) {
      outerNode = eliminateHoles(datas, holeIndices, outerNode, dim);
    } // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox


    if (datas.length > 80 * dim) {
      minX = maxX = datas[0];
      minY = maxY = datas[1];

      for (var i = dim; i < outerLen; i += dim) {
        x = datas[i];
        y = datas[i + 1];

        if (x < minX) {
          minX = x;
        }

        if (y < minY) {
          minY = y;
        }

        if (x > maxX) {
          maxX = x;
        }

        if (y > maxY) {
          maxY = y;
        }
      } // minX, minY and size are later used to transform coords into integers for z-order calculation


      size = Math.max(maxX - minX, maxY - minY);
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, size);
    return triangles;
  } // // return a percentage difference between the polygon area and its triangulation area;
  // // used to verify correctness of triangulation
  // earcut.deviation = function (data, holeIndices, dim, triangles) {
  //     const hasHoles = holeIndices && holeIndices.length;
  //     const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
  //     let polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
  //     if (hasHoles) {
  //         for (let i = 0, len = holeIndices.length; i < len; i++) {
  //             const start = holeIndices[i] * dim;
  //             const end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
  //             polygonArea -= Math.abs(signedArea(data, start, end, dim));
  //         }
  //     }
  //     let trianglesArea = 0;
  //     for (i = 0; i < triangles.length; i += 3) {
  //         const a = triangles[i] * dim;
  //         const b = triangles[i + 1] * dim;
  //         const c = triangles[i + 2] * dim;
  //         trianglesArea += Math.abs(
  //             (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
  //             (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
  //     }
  //     return polygonArea === 0 && trianglesArea === 0 ? 0 :
  //         Math.abs((trianglesArea - polygonArea) / polygonArea);
  // };
  // // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
  // earcut.flatten = function (data) {
  //     let dim = data[0][0].length,
  //         result = {vertices: [], holes: [], dimensions: dim},
  //         holeIndex = 0;
  //     for (let i = 0; i < data.length; i++) {
  //         for (let j = 0; j < data[i].length; j++) {
  //             for (let d = 0; d < dim; d++) { result.vertices.push(data[i][j][d]); }
  //         }
  //         if (i > 0) {
  //             holeIndex += data[i - 1].length;
  //             result.holes.push(holeIndex);
  //         }
  //     }
  //     return result;
  // };

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9ncmFwaGljcy93ZWJnbC9lYXJjdXQudHMiXSwibmFtZXMiOlsiQWltIiwiaSIsIngiLCJ5IiwicHJldiIsIm5leHQiLCJ6IiwicHJldloiLCJuZXh0WiIsInN0ZWluZXIiLCJsaW5rZWRMaXN0IiwiZGF0YXMiLCJzdGFydCIsImVuZCIsImRpbSIsImNsb2Nrd2lzZSIsImxhc3QiLCJzaWduZWRBcmVhIiwiaW5zZXJ0Tm9kZSIsImVxdWFscyIsInJlbW92ZU5vZGUiLCJmaWx0ZXJQb2ludHMiLCJwIiwiYWdhaW4iLCJhcmVhIiwiZWFyY3V0TGlua2VkIiwiZWFyIiwidHJpYW5nbGVzIiwibWluWCIsIm1pblkiLCJzaXplIiwicGFzcyIsImluZGV4Q3VydmUiLCJzdG9wIiwiaXNFYXJIYXNoZWQiLCJpc0VhciIsInB1c2giLCJjdXJlTG9jYWxJbnRlcnNlY3Rpb25zIiwic3BsaXRFYXJjdXQiLCJhIiwiYiIsImMiLCJwb2ludEluVHJpYW5nbGUiLCJtaW5UWCIsIm1pblRZIiwibWF4VFgiLCJtYXhUWSIsIm1pbloiLCJ6T3JkZXIiLCJtYXhaIiwiaW50ZXJzZWN0cyIsImxvY2FsbHlJbnNpZGUiLCJpc1ZhbGlkRGlhZ29uYWwiLCJzcGxpdFBvbHlnb24iLCJlbGltaW5hdGVIb2xlcyIsImhvbGVJbmRpY2VzIiwib3V0ZXJOb2RlIiwicXVldWUiLCJsZW4iLCJsaXN0IiwibGVuZ3RoIiwiZ2V0TGVmdG1vc3QiLCJzb3J0IiwiY29tcGFyZVgiLCJlbGltaW5hdGVIb2xlIiwiaG9sZSIsImZpbmRIb2xlQnJpZGdlIiwiaHgiLCJoeSIsInF4IiwiSW5maW5pdHkiLCJtIiwibXgiLCJteSIsInRhbk1pbiIsInRhbiIsIk1hdGgiLCJhYnMiLCJzb3J0TGlua2VkIiwicSIsImUiLCJ0YWlsIiwibnVtTWVyZ2VzIiwicFNpemUiLCJxU2l6ZSIsImluU2l6ZSIsImxlZnRtb3N0IiwiYXgiLCJheSIsImJ4IiwiYnkiLCJjeCIsImN5IiwicHgiLCJweSIsImludGVyc2VjdHNQb2x5Z29uIiwibWlkZGxlSW5zaWRlIiwiciIsInAxIiwicDIiLCJxMSIsInEyIiwiaW5zaWRlIiwiYTIiLCJiMiIsImFuIiwiYnAiLCJzdW0iLCJqIiwiZWFyY3V0IiwiaGFzSG9sZXMiLCJvdXRlckxlbiIsIm1heFgiLCJtYXhZIiwibWF4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7O01BRU1BLEcsR0FDRjtBQUdBO0FBSUE7QUFJQTtBQUNBO0FBR0E7QUFJQTtBQUdBLGVBQWFDLENBQWIsRUFBd0JDLENBQXhCLEVBQW1DQyxDQUFuQyxFQUE4QztBQUFBOztBQUFBLFNBckJ2Q0YsQ0FxQnVDO0FBQUEsU0FsQnZDQyxDQWtCdUM7QUFBQSxTQWpCdkNDLENBaUJ1QztBQUFBLFNBZHZDQyxJQWN1QyxHQWRwQixJQWNvQjtBQUFBLFNBYnZDQyxJQWF1QyxHQWJwQixJQWFvQjtBQUFBLFNBVHZDQyxDQVN1QyxHQVRuQyxDQVNtQztBQUFBLFNBTnZDQyxLQU11QyxHQU5uQixJQU1tQjtBQUFBLFNBTHZDQyxLQUt1QyxHQUxuQixJQUttQjtBQUFBLFNBRnZDQyxPQUV1QyxHQUY3QixLQUU2QjtBQUMxQyxTQUFLUixDQUFMLEdBQVNBLENBQVQ7QUFDQSxTQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDQSxTQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDSCxHLEVBR0w7OztBQUNBLFdBQVNPLFVBQVQsQ0FBcUJDLEtBQXJCLEVBQXNDQyxLQUF0QyxFQUFxREMsR0FBckQsRUFBa0VDLEdBQWxFLEVBQStFQyxTQUEvRSxFQUFtRztBQUMvRixRQUFJZCxDQUFDLEdBQUcsQ0FBUjtBQUNBLFFBQUllLElBQWdCLEdBQUcsSUFBdkI7O0FBRUEsUUFBSUQsU0FBUyxLQUFNRSxVQUFVLENBQUNOLEtBQUQsRUFBUUMsS0FBUixFQUFlQyxHQUFmLEVBQW9CQyxHQUFw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cEYsSUFBN0IsQ0FBUDtBQUNIOztBQUVESixJQUFBQSxZQUFZLENBQUMrQixTQUFELEVBQVk3QixTQUFaLEVBQXVCYixHQUF2QixFQUE0QmMsSUFBNUIsRUFBa0NDLElBQWxDLEVBQXdDQyxJQUF4QyxDQUFaO0FBRUEsV0FBT0gsU0FBUDtBQUNILEcsQ0FFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5jbGFzcyBBaW0ge1xyXG4gICAgLy8gdmVydGV4IGluZGV4IGluIGNvb3JkaW5hdGVzIGFycmF5XHJcbiAgICBwdWJsaWMgaTogbnVtYmVyO1xyXG5cclxuICAgIC8vIHZlcnRleCBjb29yZGluYXRlc1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcblxyXG4gICAgLy8gcHJldmlvdXMgYW5kIG5leHQgdmVydGV4IG5vZGVzIGluIGEgcG9seWdvbiByaW5nXHJcbiAgICBwdWJsaWMgcHJldjogQWltIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbmV4dDogQWltIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLy8gei1vcmRlciBjdXJ2ZSB2YWx1ZVxyXG4gICAgLy8gcHVibGljIHogPSBudWxsO1xyXG4gICAgcHVibGljIHogPSAwO1xyXG5cclxuICAgIC8vIHByZXZpb3VzIGFuZCBuZXh0IG5vZGVzIGluIHotb3JkZXJcclxuICAgIHB1YmxpYyBwcmV2WjogQWltIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbmV4dFo6IEFpbSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8vIGluZGljYXRlcyB3aGV0aGVyIHRoaXMgaXMgYSBzdGVpbmVyIHBvaW50XHJcbiAgICBwdWJsaWMgc3RlaW5lciA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChpOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5pID0gaTtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGNyZWF0ZSBhIGNpcmN1bGFyIGRvdWJseSBsaW5rZWQgbGlzdCBmcm9tIHBvbHlnb24gcG9pbnRzIGluIHRoZSBzcGVjaWZpZWQgd2luZGluZyBvcmRlclxyXG5mdW5jdGlvbiBsaW5rZWRMaXN0IChkYXRhczogbnVtYmVyW10sIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBkaW06IG51bWJlciwgY2xvY2t3aXNlOiBib29sZWFuKSB7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBsZXQgbGFzdDogQWltIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgaWYgKGNsb2Nrd2lzZSA9PT0gKHNpZ25lZEFyZWEoZGF0YXMsIHN0YXJ0LCBlbmQsIGRpbSkgPiAwKSkge1xyXG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IGRpbSkge1xyXG4gICAgICAgICAgICBsYXN0ID0gaW5zZXJ0Tm9kZShpLCBkYXRhc1tpXSwgZGF0YXNbaSArIDFdLCBsYXN0KTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAoaSA9IGVuZCAtIGRpbTsgaSA+PSBzdGFydDsgaSAtPSBkaW0pIHtcclxuICAgICAgICAgICAgbGFzdCA9IGluc2VydE5vZGUoaSwgZGF0YXNbaV0sIGRhdGFzW2kgKyAxXSwgbGFzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChsYXN0ICYmIGVxdWFscyhsYXN0LCBsYXN0Lm5leHQhKSkge1xyXG4gICAgICAgIHJlbW92ZU5vZGUobGFzdCk7XHJcbiAgICAgICAgbGFzdCA9IGxhc3QubmV4dDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGFzdDtcclxufVxyXG5cclxuLy8gZWxpbWluYXRlIGNvbGluZWFyIG9yIGR1cGxpY2F0ZSBwb2ludHNcclxuZnVuY3Rpb24gZmlsdGVyUG9pbnRzIChzdGFydDogQWltIHwgbnVsbCwgZW5kOiBBaW0gfCBudWxsID0gbnVsbCkge1xyXG4gICAgaWYgKCFzdGFydCkge1xyXG4gICAgICAgIHJldHVybiBzdGFydDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWVuZCkge1xyXG4gICAgICAgIGVuZCA9IHN0YXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwID0gc3RhcnQ7XHJcbiAgICBsZXQgYWdhaW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGRvIHtcclxuICAgICAgICBhZ2FpbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIXAuc3RlaW5lciAmJiAoZXF1YWxzKHAsIHAubmV4dCEpIHx8IGFyZWEocC5wcmV2ISwgcCwgcC5uZXh0ISkgPT09IDApKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZU5vZGUocCk7XHJcbiAgICAgICAgICAgIHAgPSBlbmQgPSBwLnByZXYhO1xyXG4gICAgICAgICAgICBpZiAocCA9PT0gcC5uZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhZ2FpbiA9IHRydWU7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHAgPSBwLm5leHQhO1xyXG4gICAgICAgIH1cclxuICAgIH0gd2hpbGUgKGFnYWluIHx8IHAgIT09IGVuZCk7XHJcblxyXG4gICAgcmV0dXJuIGVuZDtcclxufVxyXG5cclxuLy8gbWFpbiBlYXIgc2xpY2luZyBsb29wIHdoaWNoIHRyaWFuZ3VsYXRlcyBhIHBvbHlnb24gKGdpdmVuIGFzIGEgbGlua2VkIGxpc3QpXHJcbmZ1bmN0aW9uIGVhcmN1dExpbmtlZCAoZWFyOiBBaW0gfCBudWxsLCB0cmlhbmdsZXM6IG51bWJlcltdLCBkaW06IG51bWJlciwgbWluWDogbnVtYmVyLCBtaW5ZOiBudW1iZXIsIHNpemU6IG51bWJlciwgcGFzczogbnVtYmVyID0gMCkge1xyXG4gICAgaWYgKCFlYXIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW50ZXJsaW5rIHBvbHlnb24gbm9kZXMgaW4gei1vcmRlclxyXG4gICAgaWYgKCFwYXNzICYmIHNpemUpIHtcclxuICAgICAgICBpbmRleEN1cnZlKGVhciwgbWluWCwgbWluWSwgc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHN0b3A6IEFpbSB8IG51bGwgPSBlYXI7XHJcbiAgICBsZXQgcHJldjogQWltIHwgbnVsbCA9IG51bGw7XHJcbiAgICBsZXQgbmV4dDogQWltIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLy8gaXRlcmF0ZSB0aHJvdWdoIGVhcnMsIHNsaWNpbmcgdGhlbSBvbmUgYnkgb25lXHJcbiAgICB3aGlsZSAoZWFyIS5wcmV2ICE9PSBlYXIhLm5leHQpIHtcclxuICAgICAgICBwcmV2ID0gZWFyIS5wcmV2ITtcclxuICAgICAgICBuZXh0ID0gZWFyIS5uZXh0ITtcclxuXHJcbiAgICAgICAgaWYgKHNpemUgPyBpc0Vhckhhc2hlZChlYXIhLCBtaW5YLCBtaW5ZLCBzaXplKSA6IGlzRWFyKGVhciEpKSB7XHJcbiAgICAgICAgICAgIC8vIGN1dCBvZmYgdGhlIHRyaWFuZ2xlXHJcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKHByZXYuaSAvIGRpbSk7XHJcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKGVhciEuaSAvIGRpbSk7XHJcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKG5leHQuaSAvIGRpbSk7XHJcblxyXG4gICAgICAgICAgICByZW1vdmVOb2RlKGVhciEpO1xyXG5cclxuICAgICAgICAgICAgLy8gc2tpcHBpbmcgdGhlIG5leHQgdmVydGljZXMgbGVhZHMgdG8gbGVzcyBzbGl2ZXIgdHJpYW5nbGVzXHJcbiAgICAgICAgICAgIGVhciA9IG5leHQubmV4dDtcclxuICAgICAgICAgICAgc3RvcCA9IG5leHQubmV4dDtcclxuXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWFyID0gbmV4dDtcclxuXHJcbiAgICAgICAgLy8gaWYgd2UgbG9vcGVkIHRocm91Z2ggdGhlIHdob2xlIHJlbWFpbmluZyBwb2x5Z29uIGFuZCBjYW4ndCBmaW5kIGFueSBtb3JlIGVhcnNcclxuICAgICAgICBpZiAoZWFyID09PSBzdG9wKSB7XHJcbiAgICAgICAgICAgIC8vIHRyeSBmaWx0ZXJpbmcgcG9pbnRzIGFuZCBzbGljaW5nIGFnYWluXHJcbiAgICAgICAgICAgIGlmICghcGFzcykge1xyXG4gICAgICAgICAgICAgICAgZWFyY3V0TGlua2VkKGZpbHRlclBvaW50cyhlYXIpLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgc2l6ZSwgMSk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGlzIGRpZG4ndCB3b3JrLCB0cnkgY3VyaW5nIGFsbCBzbWFsbCBzZWxmLWludGVyc2VjdGlvbnMgbG9jYWxseVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhc3MgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIGVhciA9IGN1cmVMb2NhbEludGVyc2VjdGlvbnMoZWFyLCB0cmlhbmdsZXMsIGRpbSk7XHJcbiAgICAgICAgICAgICAgICBlYXJjdXRMaW5rZWQoZWFyLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgc2l6ZSwgMik7XHJcblxyXG4gICAgICAgICAgICAvLyBhcyBhIGxhc3QgcmVzb3J0LCB0cnkgc3BsaXR0aW5nIHRoZSByZW1haW5pbmcgcG9seWdvbiBpbnRvIHR3b1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhc3MgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHNwbGl0RWFyY3V0KGVhciwgdHJpYW5nbGVzLCBkaW0sIG1pblgsIG1pblksIHNpemUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGNoZWNrIHdoZXRoZXIgYSBwb2x5Z29uIG5vZGUgZm9ybXMgYSB2YWxpZCBlYXIgd2l0aCBhZGphY2VudCBub2Rlc1xyXG5mdW5jdGlvbiBpc0VhciAoZWFyOiBBaW0pIHtcclxuICAgIGNvbnN0IGEgPSBlYXIucHJldiE7XHJcbiAgICBjb25zdCBiID0gZWFyO1xyXG4gICAgY29uc3QgYyA9IGVhci5uZXh0ITtcclxuXHJcbiAgICBpZiAoYXJlYShhLCBiLCBjKSA+PSAwKSB7IHJldHVybiBmYWxzZTsgfSAvLyByZWZsZXgsIGNhbid0IGJlIGFuIGVhclxyXG5cclxuICAgIC8vIG5vdyBtYWtlIHN1cmUgd2UgZG9uJ3QgaGF2ZSBvdGhlciBwb2ludHMgaW5zaWRlIHRoZSBwb3RlbnRpYWwgZWFyXHJcbiAgICBsZXQgcCA9IGVhci5uZXh0IS5uZXh0ITtcclxuXHJcbiAgICB3aGlsZSAocCAhPT0gZWFyLnByZXYpIHtcclxuICAgICAgICBpZiAocG9pbnRJblRyaWFuZ2xlKGEueCwgYS55LCBiLngsIGIueSwgYy54LCBjLnksIHAueCwgcC55KSAmJlxyXG4gICAgICAgICAgICBhcmVhKHAucHJldiEsIHAsIHAubmV4dCEpID49IDApIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcCA9IHAubmV4dCE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRWFySGFzaGVkIChlYXI6IEFpbSwgbWluWDogbnVtYmVyLCBtaW5ZOiBudW1iZXIsIHNpemUpIHtcclxuICAgIGNvbnN0IGEgPSBlYXIucHJldiE7XHJcbiAgICBjb25zdCBiID0gZWFyO1xyXG4gICAgY29uc3QgYyA9IGVhci5uZXh0ITtcclxuXHJcbiAgICBpZiAoYXJlYShhLCBiLCBjKSA+PSAwKSB7IHJldHVybiBmYWxzZTsgfSAvLyByZWZsZXgsIGNhbid0IGJlIGFuIGVhclxyXG5cclxuICAgIC8vIHRyaWFuZ2xlIGJib3g7IG1pbiAmIG1heCBhcmUgY2FsY3VsYXRlZCBsaWtlIHRoaXMgZm9yIHNwZWVkXHJcbiAgICBjb25zdCBtaW5UWCA9IGEueCA8IGIueCA/IChhLnggPCBjLnggPyBhLnggOiBjLngpIDogKGIueCA8IGMueCA/IGIueCA6IGMueCk7XHJcbiAgICBjb25zdCBtaW5UWSA9IGEueSA8IGIueSA/IChhLnkgPCBjLnkgPyBhLnkgOiBjLnkpIDogKGIueSA8IGMueSA/IGIueSA6IGMueSk7XHJcbiAgICBjb25zdCBtYXhUWCA9IGEueCA+IGIueCA/IChhLnggPiBjLnggPyBhLnggOiBjLngpIDogKGIueCA+IGMueCA/IGIueCA6IGMueCk7XHJcbiAgICBjb25zdCBtYXhUWSA9IGEueSA+IGIueSA/IChhLnkgPiBjLnkgPyBhLnkgOiBjLnkpIDogKGIueSA+IGMueSA/IGIueSA6IGMueSk7XHJcblxyXG4gICAgLy8gei1vcmRlciByYW5nZSBmb3IgdGhlIGN1cnJlbnQgdHJpYW5nbGUgYmJveDtcclxuICAgIGNvbnN0IG1pblogPSB6T3JkZXIobWluVFgsIG1pblRZLCBtaW5YLCBtaW5ZLCBzaXplKTtcclxuICAgIGNvbnN0IG1heFogPSB6T3JkZXIobWF4VFgsIG1heFRZLCBtaW5YLCBtaW5ZLCBzaXplKTtcclxuXHJcbiAgICAvLyBmaXJzdCBsb29rIGZvciBwb2ludHMgaW5zaWRlIHRoZSB0cmlhbmdsZSBpbiBpbmNyZWFzaW5nIHotb3JkZXJcclxuICAgIGxldCBwID0gZWFyLm5leHRaO1xyXG5cclxuICAgIHdoaWxlIChwICYmIHAueiA8PSBtYXhaKSB7XHJcbiAgICAgICAgaWYgKHAgIT09IGVhci5wcmV2ICYmIHAgIT09IGVhci5uZXh0ICYmXHJcbiAgICAgICAgICAgIHBvaW50SW5UcmlhbmdsZShhLngsIGEueSwgYi54LCBiLnksIGMueCwgYy55LCBwLngsIHAueSkgJiZcclxuICAgICAgICAgICAgYXJlYShwLnByZXYhLCBwLCBwLm5leHQhKSA+PSAwKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHAgPSBwLm5leHRaO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoZW4gbG9vayBmb3IgcG9pbnRzIGluIGRlY3JlYXNpbmcgei1vcmRlclxyXG4gICAgcCA9IGVhci5wcmV2WjtcclxuXHJcbiAgICB3aGlsZSAocCAmJiBwLnogPj0gbWluWikge1xyXG4gICAgICAgIGlmIChwICE9PSBlYXIucHJldiAmJiBwICE9PSBlYXIubmV4dCAmJlxyXG4gICAgICAgICAgICBwb2ludEluVHJpYW5nbGUoYS54LCBhLnksIGIueCwgYi55LCBjLngsIGMueSwgcC54LCBwLnkpICYmXHJcbiAgICAgICAgICAgIGFyZWEocC5wcmV2ISwgcCwgcC5uZXh0ISkgPj0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwID0gcC5wcmV2WjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLy8gZ28gdGhyb3VnaCBhbGwgcG9seWdvbiBub2RlcyBhbmQgY3VyZSBzbWFsbCBsb2NhbCBzZWxmLWludGVyc2VjdGlvbnNcclxuZnVuY3Rpb24gY3VyZUxvY2FsSW50ZXJzZWN0aW9ucyAoc3RhcnQ6IEFpbSwgdHJpYW5nbGVzOiBudW1iZXJbXSwgZGltOiBudW1iZXIpIHtcclxuICAgIGxldCBwID0gc3RhcnQ7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgY29uc3QgYSA9IHAucHJldiE7XHJcbiAgICAgICAgY29uc3QgYiA9IHAubmV4dCEubmV4dCE7XHJcblxyXG4gICAgICAgIGlmICghZXF1YWxzKGEsIGIpICYmIGludGVyc2VjdHMoYSwgcCwgcC5uZXh0ISwgYikgJiYgbG9jYWxseUluc2lkZShhLCBiKSAmJiBsb2NhbGx5SW5zaWRlKGIsIGEpKSB7XHJcblxyXG4gICAgICAgICAgICB0cmlhbmdsZXMucHVzaChhLmkgLyBkaW0pO1xyXG4gICAgICAgICAgICB0cmlhbmdsZXMucHVzaChwLmkgLyBkaW0pO1xyXG4gICAgICAgICAgICB0cmlhbmdsZXMucHVzaChiLmkgLyBkaW0pO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIHR3byBub2RlcyBpbnZvbHZlZFxyXG4gICAgICAgICAgICByZW1vdmVOb2RlKHApO1xyXG4gICAgICAgICAgICByZW1vdmVOb2RlKHAubmV4dCEpO1xyXG5cclxuICAgICAgICAgICAgcCA9IHN0YXJ0ID0gYjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9IHAubmV4dCE7XHJcbiAgICB9IHdoaWxlIChwICE9PSBzdGFydCk7XHJcblxyXG4gICAgcmV0dXJuIHA7XHJcbn1cclxuXHJcbi8vIHRyeSBzcGxpdHRpbmcgcG9seWdvbiBpbnRvIHR3byBhbmQgdHJpYW5ndWxhdGUgdGhlbSBpbmRlcGVuZGVudGx5XHJcbmZ1bmN0aW9uIHNwbGl0RWFyY3V0IChzdGFydDogQWltIHwgbnVsbCwgdHJpYW5nbGVzOiBudW1iZXJbXSwgZGltOiBudW1iZXIsIG1pblg6IG51bWJlciwgbWluWTogbnVtYmVyLCBzaXplOiBudW1iZXIpIHtcclxuICAgIC8vIGxvb2sgZm9yIGEgdmFsaWQgZGlhZ29uYWwgdGhhdCBkaXZpZGVzIHRoZSBwb2x5Z29uIGludG8gdHdvXHJcbiAgICBsZXQgYSA9IHN0YXJ0ITtcclxuICAgIGRvIHtcclxuICAgICAgICBsZXQgYiA9IGEubmV4dCEubmV4dDtcclxuICAgICAgICB3aGlsZSAoYiAhPT0gYS5wcmV2KSB7XHJcbiAgICAgICAgICAgIGlmIChhLmkgIT09IGIhLmkgJiYgaXNWYWxpZERpYWdvbmFsKGEsIGIhKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gc3BsaXQgdGhlIHBvbHlnb24gaW4gdHdvIGJ5IHRoZSBkaWFnb25hbFxyXG4gICAgICAgICAgICAgICAgbGV0IGMgPSBzcGxpdFBvbHlnb24oYSwgYiEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGZpbHRlciBjb2xpbmVhciBwb2ludHMgYXJvdW5kIHRoZSBjdXRzXHJcbiAgICAgICAgICAgICAgICBhID0gZmlsdGVyUG9pbnRzKGEsIGEubmV4dCkhO1xyXG4gICAgICAgICAgICAgICAgYyA9IGZpbHRlclBvaW50cyhjLCBjLm5leHQhKSE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcnVuIGVhcmN1dCBvbiBlYWNoIGhhbGZcclxuICAgICAgICAgICAgICAgIGVhcmN1dExpbmtlZChhLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBlYXJjdXRMaW5rZWQoYywgdHJpYW5nbGVzLCBkaW0sIG1pblgsIG1pblksIHNpemUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGIgPSBiIS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBhID0gYSEubmV4dCE7XHJcbiAgICB9IHdoaWxlIChhICE9PSBzdGFydCk7XHJcbn1cclxuXHJcbi8vIGxpbmsgZXZlcnkgaG9sZSBpbnRvIHRoZSBvdXRlciBsb29wLCBwcm9kdWNpbmcgYSBzaW5nbGUtcmluZyBwb2x5Z29uIHdpdGhvdXQgaG9sZXNcclxuZnVuY3Rpb24gZWxpbWluYXRlSG9sZXMgKGRhdGFzOiBudW1iZXJbXSwgaG9sZUluZGljZXM6IG51bWJlcltdLCBvdXRlck5vZGU6IEFpbSB8IG51bGwsIGRpbTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBxdWV1ZTogQWltW10gPSBbXTtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGxldCBsZW4gPSAwO1xyXG4gICAgbGV0IHN0YXJ0ID0gMDtcclxuICAgIGxldCBlbmQgPSAwO1xyXG4gICAgbGV0IGxpc3Q6IEFpbSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGZvciAoaSA9IDAsIGxlbiA9IGhvbGVJbmRpY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgc3RhcnQgPSBob2xlSW5kaWNlc1tpXSAqIGRpbTtcclxuICAgICAgICBlbmQgPSBpIDwgbGVuIC0gMSA/IGhvbGVJbmRpY2VzW2kgKyAxXSAqIGRpbSA6IGRhdGFzLmxlbmd0aDtcclxuICAgICAgICBsaXN0ID0gbGlua2VkTGlzdChkYXRhcywgc3RhcnQsIGVuZCwgZGltLCBmYWxzZSk7XHJcbiAgICAgICAgaWYgKCFsaXN0KXtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsaXN0ID09PSBsaXN0Lm5leHQpIHtcclxuICAgICAgICAgICAgbGlzdC5zdGVpbmVyID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHF1ZXVlLnB1c2goZ2V0TGVmdG1vc3QobGlzdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHF1ZXVlLnNvcnQoY29tcGFyZVgpO1xyXG5cclxuICAgIGlmICghb3V0ZXJOb2RlKXtcclxuICAgICAgICByZXR1cm4gb3V0ZXJOb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByb2Nlc3MgaG9sZXMgZnJvbSBsZWZ0IHRvIHJpZ2h0XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBlbGltaW5hdGVIb2xlKHF1ZXVlW2ldLCBvdXRlck5vZGUpO1xyXG4gICAgICAgIG91dGVyTm9kZSA9IGZpbHRlclBvaW50cyhvdXRlck5vZGUsIG91dGVyTm9kZSEubmV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dGVyTm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29tcGFyZVggKGEsIGIpIHtcclxuICAgIHJldHVybiBhLnggLSBiLng7XHJcbn1cclxuXHJcbi8vIGZpbmQgYSBicmlkZ2UgYmV0d2VlbiB2ZXJ0aWNlcyB0aGF0IGNvbm5lY3RzIGhvbGUgd2l0aCBhbiBvdXRlciByaW5nIGFuZCBhbmQgbGluayBpdFxyXG5mdW5jdGlvbiBlbGltaW5hdGVIb2xlIChob2xlOiBBaW0sIG91dGVyTm9kZTogQWltIHwgbnVsbCkge1xyXG4gICAgb3V0ZXJOb2RlID0gZmluZEhvbGVCcmlkZ2UoaG9sZSwgb3V0ZXJOb2RlISk7XHJcbiAgICBpZiAob3V0ZXJOb2RlKSB7XHJcbiAgICAgICAgY29uc3QgYiA9IHNwbGl0UG9seWdvbihvdXRlck5vZGUsIGhvbGUpO1xyXG4gICAgICAgIGZpbHRlclBvaW50cyhiLCBiLm5leHQhKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gRGF2aWQgRWJlcmx5J3MgYWxnb3JpdGhtIGZvciBmaW5kaW5nIGEgYnJpZGdlIGJldHdlZW4gaG9sZSBhbmQgb3V0ZXIgcG9seWdvblxyXG5mdW5jdGlvbiBmaW5kSG9sZUJyaWRnZSAoaG9sZTogQWltLCBvdXRlck5vZGU6IEFpbSkge1xyXG4gICAgbGV0IHAgPSBvdXRlck5vZGU7XHJcbiAgICBjb25zdCBoeCA9IGhvbGUueDtcclxuICAgIGNvbnN0IGh5ID0gaG9sZS55O1xyXG4gICAgbGV0IHF4ID0gLUluZmluaXR5O1xyXG4gICAgbGV0IG06IEFpbSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8vIGZpbmQgYSBzZWdtZW50IGludGVyc2VjdGVkIGJ5IGEgcmF5IGZyb20gdGhlIGhvbGUncyBsZWZ0bW9zdCBwb2ludCB0byB0aGUgbGVmdDtcclxuICAgIC8vIHNlZ21lbnQncyBlbmRwb2ludCB3aXRoIGxlc3NlciB4IHdpbGwgYmUgcG90ZW50aWFsIGNvbm5lY3Rpb24gcG9pbnRcclxuICAgIGRvIHtcclxuICAgICAgICBpZiAoaHkgPD0gcC55ICYmIGh5ID49IHAubmV4dCEueSkge1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gcC54ICsgKGh5IC0gcC55KSAqIChwLm5leHQhLnggLSBwLngpIC8gKHAubmV4dCEueSAtIHAueSk7XHJcbiAgICAgICAgICAgIGlmICh4IDw9IGh4ICYmIHggPiBxeCkge1xyXG4gICAgICAgICAgICAgICAgcXggPSB4O1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPT09IGh4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGh5ID09PSBwLnkpIHsgcmV0dXJuIHA7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaHkgPT09IHAubmV4dCEueSkgeyByZXR1cm4gcC5uZXh0OyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtID0gcC54IDwgcC5uZXh0IS54ID8gcCA6IHAubmV4dCE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9IHAubmV4dCE7XHJcbiAgICB9IHdoaWxlIChwICE9PSBvdXRlck5vZGUpO1xyXG5cclxuICAgIGlmICghbSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChoeCA9PT0gcXgpIHtcclxuICAgICAgICByZXR1cm4gbS5wcmV2O1xyXG4gICAgfSAvLyBob2xlIHRvdWNoZXMgb3V0ZXIgc2VnbWVudDsgcGljayBsb3dlciBlbmRwb2ludFxyXG5cclxuICAgIC8vIGxvb2sgZm9yIHBvaW50cyBpbnNpZGUgdGhlIHRyaWFuZ2xlIG9mIGhvbGUgcG9pbnQsIHNlZ21lbnQgaW50ZXJzZWN0aW9uIGFuZCBlbmRwb2ludDtcclxuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBwb2ludHMgZm91bmQsIHdlIGhhdmUgYSB2YWxpZCBjb25uZWN0aW9uO1xyXG4gICAgLy8gb3RoZXJ3aXNlIGNob29zZSB0aGUgcG9pbnQgb2YgdGhlIG1pbmltdW0gYW5nbGUgd2l0aCB0aGUgcmF5IGFzIGNvbm5lY3Rpb24gcG9pbnRcclxuXHJcbiAgICBjb25zdCBzdG9wID0gbTtcclxuICAgIGNvbnN0IG14ID0gbS54O1xyXG4gICAgY29uc3QgbXkgPSBtLnk7XHJcbiAgICBsZXQgdGFuTWluID0gSW5maW5pdHk7XHJcbiAgICBsZXQgdGFuO1xyXG5cclxuICAgIHAgPSBtLm5leHQhO1xyXG5cclxuICAgIHdoaWxlIChwICE9PSBzdG9wKSB7XHJcbiAgICAgICAgaWYgKGh4ID49IHAueCAmJiBwLnggPj0gbXggJiZcclxuICAgICAgICAgICAgICAgIHBvaW50SW5UcmlhbmdsZShoeSA8IG15ID8gaHggOiBxeCwgaHksIG14LCBteSwgaHkgPCBteSA/IHF4IDogaHgsIGh5LCBwLngsIHAueSkpIHtcclxuXHJcbiAgICAgICAgICAgIHRhbiA9IE1hdGguYWJzKGh5IC0gcC55KSAvIChoeCAtIHAueCk7IC8vIHRhbmdlbnRpYWxcclxuXHJcbiAgICAgICAgICAgIGlmICgodGFuIDwgdGFuTWluIHx8ICh0YW4gPT09IHRhbk1pbiAmJiBwLnggPiBtLngpKSAmJiBsb2NhbGx5SW5zaWRlKHAsIGhvbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBtID0gcDtcclxuICAgICAgICAgICAgICAgIHRhbk1pbiA9IHRhbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcCA9IHAubmV4dCE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG07XHJcbn1cclxuXHJcbi8vIGludGVybGluayBwb2x5Z29uIG5vZGVzIGluIHotb3JkZXJcclxuZnVuY3Rpb24gaW5kZXhDdXJ2ZSAoc3RhcnQ6IEFpbSwgbWluWDogbnVtYmVyLCBtaW5ZOiBudW1iZXIsIHNpemU6IG51bWJlcikge1xyXG4gICAgbGV0IHAgPSBzdGFydDtcclxuICAgIGRvIHtcclxuICAgICAgICBpZiAocC56ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHAueiA9IHpPcmRlcihwLngsIHAueSwgbWluWCwgbWluWSwgc2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwLnByZXZaID0gcC5wcmV2O1xyXG4gICAgICAgIHAubmV4dFogPSBwLm5leHQ7XHJcbiAgICAgICAgcCA9IHAubmV4dCE7XHJcbiAgICB9IHdoaWxlIChwICE9PSBzdGFydCk7XHJcblxyXG4gICAgcC5wcmV2WiEubmV4dFogPSBudWxsO1xyXG4gICAgcC5wcmV2WiA9IG51bGw7XHJcblxyXG4gICAgc29ydExpbmtlZChwKTtcclxufVxyXG5cclxuLy8gU2ltb24gVGF0aGFtJ3MgbGlua2VkIGxpc3QgbWVyZ2Ugc29ydCBhbGdvcml0aG1cclxuLy8gaHR0cDovL3d3dy5jaGlhcmsuZ3JlZW5lbmQub3JnLnVrL35zZ3RhdGhhbS9hbGdvcml0aG1zL2xpc3Rzb3J0Lmh0bWxcclxuZnVuY3Rpb24gc29ydExpbmtlZCAobGlzdDogQWltIHwgbnVsbCkge1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgbGV0IHA6IEFpbSB8IG51bGwgPSBudWxsO1xyXG4gICAgbGV0IHE6IEFpbSB8IG51bGwgPSBudWxsO1xyXG4gICAgbGV0IGU6IEFpbSB8IG51bGwgPSBudWxsO1xyXG4gICAgbGV0IHRhaWw6IEFpbSB8IG51bGwgPSBudWxsO1xyXG4gICAgbGV0IG51bU1lcmdlcyA9IDA7XHJcbiAgICBsZXQgcFNpemUgPSAwO1xyXG4gICAgbGV0IHFTaXplID0gMDtcclxuICAgIGxldCBpblNpemUgPSAxO1xyXG5cclxuICAgIGRvIHtcclxuICAgICAgICBwID0gbGlzdDtcclxuICAgICAgICBsaXN0ID0gbnVsbDtcclxuICAgICAgICB0YWlsID0gbnVsbDtcclxuICAgICAgICBudW1NZXJnZXMgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAocCkge1xyXG4gICAgICAgICAgICBudW1NZXJnZXMrKztcclxuICAgICAgICAgICAgcSA9IHA7XHJcbiAgICAgICAgICAgIHBTaXplID0gMDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGluU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwU2l6ZSsrO1xyXG4gICAgICAgICAgICAgICAgcSA9IHEubmV4dFo7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXEpIHsgYnJlYWs7IH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcVNpemUgPSBpblNpemU7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAocFNpemUgPiAwIHx8IChxU2l6ZSA+IDAgJiYgcSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocFNpemUgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBlID0gcTtcclxuICAgICAgICAgICAgICAgICAgICBxID0gcSEubmV4dFo7XHJcbiAgICAgICAgICAgICAgICAgICAgcVNpemUtLTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocVNpemUgPT09IDAgfHwgIXEpIHtcclxuICAgICAgICAgICAgICAgICAgICBlID0gcDtcclxuICAgICAgICAgICAgICAgICAgICBwID0gcCEubmV4dFo7XHJcbiAgICAgICAgICAgICAgICAgICAgcFNpemUtLTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocCEueiA8PSBxLnopIHtcclxuICAgICAgICAgICAgICAgICAgICBlID0gcDtcclxuICAgICAgICAgICAgICAgICAgICBwID0gcCEubmV4dFo7XHJcbiAgICAgICAgICAgICAgICAgICAgcFNpemUtLTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZSA9IHE7XHJcbiAgICAgICAgICAgICAgICAgICAgcSA9IHEubmV4dFo7XHJcbiAgICAgICAgICAgICAgICAgICAgcVNpemUtLTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGFpbCkgeyB0YWlsLm5leHRaID0gZTsgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7IGxpc3QgPSBlOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgZSEucHJldlogPSB0YWlsO1xyXG4gICAgICAgICAgICAgICAgdGFpbCA9IGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHAgPSBxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGFpbCEubmV4dFogPSBudWxsO1xyXG4gICAgICAgIGluU2l6ZSAqPSAyO1xyXG5cclxuICAgIH0gd2hpbGUgKG51bU1lcmdlcyA+IDEpO1xyXG5cclxuICAgIHJldHVybiBsaXN0O1xyXG59XHJcblxyXG4vLyB6LW9yZGVyIG9mIGEgcG9pbnQgZ2l2ZW4gY29vcmRzIGFuZCBzaXplIG9mIHRoZSBkYXRhIGJvdW5kaW5nIGJveFxyXG5mdW5jdGlvbiB6T3JkZXIgKHg6IG51bWJlciwgeTogbnVtYmVyLCBtaW5YOiBudW1iZXIsIG1pblk6IG51bWJlciwgc2l6ZTogbnVtYmVyKSB7XHJcbiAgICAvLyBjb29yZHMgYXJlIHRyYW5zZm9ybWVkIGludG8gbm9uLW5lZ2F0aXZlIDE1LWJpdCBpbnRlZ2VyIHJhbmdlXHJcbiAgICB4ID0gMzI3NjcgKiAoeCAtIG1pblgpIC8gc2l6ZTtcclxuICAgIHkgPSAzMjc2NyAqICh5IC0gbWluWSkgLyBzaXplO1xyXG5cclxuICAgIHggPSAoeCB8ICh4IDw8IDgpKSAmIDB4MDBGRjAwRkY7XHJcbiAgICB4ID0gKHggfCAoeCA8PCA0KSkgJiAweDBGMEYwRjBGO1xyXG4gICAgeCA9ICh4IHwgKHggPDwgMikpICYgMHgzMzMzMzMzMztcclxuICAgIHggPSAoeCB8ICh4IDw8IDEpKSAmIDB4NTU1NTU1NTU7XHJcblxyXG4gICAgeSA9ICh5IHwgKHkgPDwgOCkpICYgMHgwMEZGMDBGRjtcclxuICAgIHkgPSAoeSB8ICh5IDw8IDQpKSAmIDB4MEYwRjBGMEY7XHJcbiAgICB5ID0gKHkgfCAoeSA8PCAyKSkgJiAweDMzMzMzMzMzO1xyXG4gICAgeSA9ICh5IHwgKHkgPDwgMSkpICYgMHg1NTU1NTU1NTtcclxuXHJcbiAgICByZXR1cm4geCB8ICh5IDw8IDEpO1xyXG59XHJcblxyXG4vLyBmaW5kIHRoZSBsZWZ0bW9zdCBub2RlIG9mIGEgcG9seWdvbiByaW5nXHJcbmZ1bmN0aW9uIGdldExlZnRtb3N0IChzdGFydDogQWltKSB7XHJcbiAgICBsZXQgcCA9IHN0YXJ0O1xyXG4gICAgbGV0IGxlZnRtb3N0ID0gc3RhcnQ7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgaWYgKHAueCA8IGxlZnRtb3N0LngpIHtcclxuICAgICAgICAgICAgbGVmdG1vc3QgPSBwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcCA9IHAubmV4dCE7XHJcbiAgICB9IHdoaWxlIChwICE9PSBzdGFydCk7XHJcblxyXG4gICAgcmV0dXJuIGxlZnRtb3N0O1xyXG59XHJcblxyXG4vLyBjaGVjayBpZiBhIHBvaW50IGxpZXMgd2l0aGluIGEgY29udmV4IHRyaWFuZ2xlXHJcbmZ1bmN0aW9uIHBvaW50SW5UcmlhbmdsZSAoYXg6IG51bWJlciwgYXk6IG51bWJlciwgYng6IG51bWJlciwgYnk6IG51bWJlciwgY3g6IG51bWJlciwgY3k6IG51bWJlciwgcHg6IG51bWJlciwgcHk6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIChjeCAtIHB4KSAqIChheSAtIHB5KSAtIChheCAtIHB4KSAqIChjeSAtIHB5KSA+PSAwICYmXHJcbiAgICAgICAgICAgKGF4IC0gcHgpICogKGJ5IC0gcHkpIC0gKGJ4IC0gcHgpICogKGF5IC0gcHkpID49IDAgJiZcclxuICAgICAgICAgICAoYnggLSBweCkgKiAoY3kgLSBweSkgLSAoY3ggLSBweCkgKiAoYnkgLSBweSkgPj0gMDtcclxufVxyXG5cclxuLy8gY2hlY2sgaWYgYSBkaWFnb25hbCBiZXR3ZWVuIHR3byBwb2x5Z29uIG5vZGVzIGlzIHZhbGlkIChsaWVzIGluIHBvbHlnb24gaW50ZXJpb3IpXHJcbmZ1bmN0aW9uIGlzVmFsaWREaWFnb25hbCAoYTogQWltLCBiOiBBaW0pIHtcclxuICAgIHJldHVybiBhLm5leHQhLmkgIT09IGIuaSAmJiBhLnByZXYhLmkgIT09IGIuaSAmJiAhaW50ZXJzZWN0c1BvbHlnb24oYSwgYikgJiZcclxuICAgICAgICAgICBsb2NhbGx5SW5zaWRlKGEsIGIpICYmIGxvY2FsbHlJbnNpZGUoYiwgYSkgJiYgbWlkZGxlSW5zaWRlKGEsIGIpO1xyXG59XHJcblxyXG4vLyBzaWduZWQgYXJlYSBvZiBhIHRyaWFuZ2xlXHJcbmZ1bmN0aW9uIGFyZWEgKHA6IEFpbSwgcTogQWltLCByOiBBaW0pIHtcclxuICAgIHJldHVybiAocS55IC0gcC55KSAqIChyLnggLSBxLngpIC0gKHEueCAtIHAueCkgKiAoci55IC0gcS55KTtcclxufVxyXG5cclxuLy8gY2hlY2sgaWYgdHdvIHBvaW50cyBhcmUgZXF1YWxcclxuZnVuY3Rpb24gZXF1YWxzIChwMTogQWltLCBwMjogQWltKSB7XHJcbiAgICByZXR1cm4gcDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55O1xyXG59XHJcblxyXG4vLyBjaGVjayBpZiB0d28gc2VnbWVudHMgaW50ZXJzZWN0XHJcbmZ1bmN0aW9uIGludGVyc2VjdHMgKHAxOiBBaW0sIHExOiBBaW0sIHAyOiBBaW0sIHEyOiBBaW0pIHtcclxuICAgIGlmICgoZXF1YWxzKHAxLCBxMSkgJiYgZXF1YWxzKHAyLCBxMikpIHx8XHJcbiAgICAgICAgKGVxdWFscyhwMSwgcTIpICYmIGVxdWFscyhwMiwgcTEpKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhcmVhKHAxLCBxMSwgcDIpID4gMCAhPT0gYXJlYShwMSwgcTEsIHEyKSA+IDAgJiZcclxuICAgICAgICAgICBhcmVhKHAyLCBxMiwgcDEpID4gMCAhPT0gYXJlYShwMiwgcTIsIHExKSA+IDA7XHJcbn1cclxuXHJcbi8vIGNoZWNrIGlmIGEgcG9seWdvbiBkaWFnb25hbCBpbnRlcnNlY3RzIGFueSBwb2x5Z29uIHNlZ21lbnRzXHJcbmZ1bmN0aW9uIGludGVyc2VjdHNQb2x5Z29uIChhOiBBaW0sIGI6IEFpbSkge1xyXG4gICAgbGV0IHAgPSBhO1xyXG4gICAgZG8ge1xyXG4gICAgICAgIGlmIChwLmkgIT09IGEuaSAmJiBwLm5leHQhLmkgIT09IGEuaSAmJiBwLmkgIT09IGIuaSAmJiBwLm5leHQhLmkgIT09IGIuaSAmJlxyXG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0cyhwLCBwLm5leHQhLCBhLCBiKSkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHAgPSBwLm5leHQhO1xyXG4gICAgfSB3aGlsZSAocCAhPT0gYSk7XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vLyBjaGVjayBpZiBhIHBvbHlnb24gZGlhZ29uYWwgaXMgbG9jYWxseSBpbnNpZGUgdGhlIHBvbHlnb25cclxuZnVuY3Rpb24gbG9jYWxseUluc2lkZSAoYTogQWltLCBiOiBBaW0pIHtcclxuICAgIHJldHVybiBhcmVhKGEucHJldiEsIGEsIGEubmV4dCEpIDwgMCA/XHJcbiAgICAgICAgYXJlYShhLCBiLCBhLm5leHQhKSA+PSAwICYmIGFyZWEoYSwgYS5wcmV2ISwgYikgPj0gMCA6XHJcbiAgICAgICAgYXJlYShhLCBiLCBhLnByZXYhKSA8IDAgfHwgYXJlYShhLCBhLm5leHQhLCBiKSA8IDA7XHJcbn1cclxuXHJcbi8vIGNoZWNrIGlmIHRoZSBtaWRkbGUgcG9pbnQgb2YgYSBwb2x5Z29uIGRpYWdvbmFsIGlzIGluc2lkZSB0aGUgcG9seWdvblxyXG5mdW5jdGlvbiBtaWRkbGVJbnNpZGUgKGE6IEFpbSwgYjogQWltKSB7XHJcbiAgICBsZXQgcCA9IGE7XHJcbiAgICBsZXQgaW5zaWRlID0gZmFsc2U7XHJcbiAgICBjb25zdCBweCA9IChhLnggKyBiLngpIC8gMjtcclxuICAgIGNvbnN0IHB5ID0gKGEueSArIGIueSkgLyAyO1xyXG4gICAgZG8ge1xyXG4gICAgICAgIGlmICgoKHAueSA+IHB5KSAhPT0gKHAubmV4dCEueSA+IHB5KSkgJiYgKHB4IDwgKHAubmV4dCEueCAtIHAueCkgKiAocHkgLSBwLnkpIC8gKHAubmV4dCEueSAtIHAueSkgKyBwLngpKSB7XHJcbiAgICAgICAgICAgIGluc2lkZSA9ICFpbnNpZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHAgPSBwLm5leHQhO1xyXG4gICAgfSB3aGlsZSAocCAhPT0gYSk7XHJcblxyXG4gICAgcmV0dXJuIGluc2lkZTtcclxufVxyXG5cclxuLy8gbGluayB0d28gcG9seWdvbiB2ZXJ0aWNlcyB3aXRoIGEgYnJpZGdlOyBpZiB0aGUgdmVydGljZXMgYmVsb25nIHRvIHRoZSBzYW1lIHJpbmcsIGl0IHNwbGl0cyBwb2x5Z29uIGludG8gdHdvO1xyXG4vLyBpZiBvbmUgYmVsb25ncyB0byB0aGUgb3V0ZXIgcmluZyBhbmQgYW5vdGhlciB0byBhIGhvbGUsIGl0IG1lcmdlcyBpdCBpbnRvIGEgc2luZ2xlIHJpbmdcclxuZnVuY3Rpb24gc3BsaXRQb2x5Z29uIChhOiBBaW0sIGI6IEFpbSkge1xyXG4gICAgY29uc3QgYTIgPSBuZXcgQWltKGEuaSwgYS54LCBhLnkpO1xyXG4gICAgY29uc3QgYjIgPSBuZXcgQWltKGIuaSwgYi54LCBiLnkpO1xyXG4gICAgY29uc3QgYW4gPSBhLm5leHQhO1xyXG4gICAgY29uc3QgYnAgPSBiLnByZXYhO1xyXG5cclxuICAgIGEubmV4dCA9IGI7XHJcbiAgICBiLnByZXYgPSBhO1xyXG5cclxuICAgIGEyLm5leHQgPSBhbjtcclxuICAgIGFuLnByZXYgPSBhMjtcclxuXHJcbiAgICBiMi5uZXh0ID0gYTI7XHJcbiAgICBhMi5wcmV2ID0gYjI7XHJcblxyXG4gICAgYnAubmV4dCA9IGIyO1xyXG4gICAgYjIucHJldiA9IGJwO1xyXG5cclxuICAgIHJldHVybiBiMjtcclxufVxyXG5cclxuLy8gY3JlYXRlIGEgbm9kZSBhbmQgb3B0aW9uYWxseSBsaW5rIGl0IHdpdGggcHJldmlvdXMgb25lIChpbiBhIGNpcmN1bGFyIGRvdWJseSBsaW5rZWQgbGlzdClcclxuZnVuY3Rpb24gaW5zZXJ0Tm9kZSAoaTogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgbGFzdDogQWltIHwgbnVsbCkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBBaW0oaSwgeCwgeSk7XHJcblxyXG4gICAgaWYgKCFsYXN0KSB7XHJcbiAgICAgICAgcC5wcmV2ID0gcDtcclxuICAgICAgICBwLm5leHQgPSBwO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcC5uZXh0ID0gbGFzdC5uZXh0O1xyXG4gICAgICAgIHAucHJldiA9IGxhc3Q7XHJcbiAgICAgICAgbGFzdC5uZXh0IS5wcmV2ID0gcDtcclxuICAgICAgICBsYXN0Lm5leHQgPSBwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVOb2RlIChwOiBBaW0pIHtcclxuICAgIHAubmV4dCEucHJldiA9IHAucHJldjtcclxuICAgIHAucHJldiEubmV4dCA9IHAubmV4dDtcclxuXHJcbiAgICBpZiAocC5wcmV2Wikge1xyXG4gICAgICAgIHAucHJldloubmV4dFogPSBwLm5leHRaO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwLm5leHRaKSB7XHJcbiAgICAgICAgcC5uZXh0Wi5wcmV2WiA9IHAucHJldlo7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNpZ25lZEFyZWEgKGRhdGFzOiBudW1iZXJbXSwgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGRpbTogbnVtYmVyKSB7XHJcbiAgICBsZXQgc3VtID0gMDtcclxuICAgIGZvciAobGV0IGkgPSBzdGFydCwgaiA9IGVuZCAtIGRpbTsgaSA8IGVuZDsgaSArPSBkaW0pIHtcclxuICAgICAgICBzdW0gKz0gKGRhdGFzW2pdIC0gZGF0YXNbaV0pICogKGRhdGFzW2kgKyAxXSArIGRhdGFzW2ogKyAxXSk7XHJcbiAgICAgICAgaiA9IGk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3VtO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZWFyY3V0IChkYXRhczogbnVtYmVyW10sIGhvbGVJbmRpY2VzOiBudW1iZXJbXSB8IG51bGwsIGRpbTogbnVtYmVyKSB7XHJcbiAgICBkaW0gPSBkaW0gfHwgMztcclxuXHJcbiAgICBjb25zdCBoYXNIb2xlcyA9IGhvbGVJbmRpY2VzID8gaG9sZUluZGljZXMubGVuZ3RoIDogMDtcclxuICAgIGNvbnN0IG91dGVyTGVuID0gaGFzSG9sZXMgPyBob2xlSW5kaWNlcyFbMF0gKiBkaW0gOiBkYXRhcy5sZW5ndGg7XHJcbiAgICBsZXQgb3V0ZXJOb2RlID0gbGlua2VkTGlzdChkYXRhcywgMCwgb3V0ZXJMZW4sIGRpbSwgdHJ1ZSk7XHJcbiAgICBjb25zdCB0cmlhbmdsZXMgPSBbXTtcclxuXHJcbiAgICBpZiAoIW91dGVyTm9kZSkge1xyXG4gICAgICAgIHJldHVybiB0cmlhbmdsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG1pblggPSAwO1xyXG4gICAgbGV0IG1pblkgPSAwO1xyXG4gICAgbGV0IG1heFggPSAwO1xyXG4gICAgbGV0IG1heFkgPSAwO1xyXG4gICAgbGV0IHggPSAwO1xyXG4gICAgbGV0IHkgPSAwO1xyXG4gICAgbGV0IHNpemUgPSAwO1xyXG5cclxuICAgIGlmIChoYXNIb2xlcykge1xyXG4gICAgICAgIG91dGVyTm9kZSA9IGVsaW1pbmF0ZUhvbGVzKGRhdGFzLCBob2xlSW5kaWNlcyEsIG91dGVyTm9kZSwgZGltKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiB0aGUgc2hhcGUgaXMgbm90IHRvbyBzaW1wbGUsIHdlJ2xsIHVzZSB6LW9yZGVyIGN1cnZlIGhhc2ggbGF0ZXI7IGNhbGN1bGF0ZSBwb2x5Z29uIGJib3hcclxuICAgIGlmIChkYXRhcy5sZW5ndGggPiA4MCAqIGRpbSkge1xyXG4gICAgICAgIG1pblggPSBtYXhYID0gZGF0YXNbMF07XHJcbiAgICAgICAgbWluWSA9IG1heFkgPSBkYXRhc1sxXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGRpbTsgaSA8IG91dGVyTGVuOyBpICs9IGRpbSkge1xyXG4gICAgICAgICAgICB4ID0gZGF0YXNbaV07XHJcbiAgICAgICAgICAgIHkgPSBkYXRhc1tpICsgMV07XHJcbiAgICAgICAgICAgIGlmICh4IDwgbWluWCkgeyBtaW5YID0geDsgfVxyXG4gICAgICAgICAgICBpZiAoeSA8IG1pblkpIHsgbWluWSA9IHk7IH1cclxuICAgICAgICAgICAgaWYgKHggPiBtYXhYKSB7IG1heFggPSB4OyB9XHJcbiAgICAgICAgICAgIGlmICh5ID4gbWF4WSkgeyBtYXhZID0geTsgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWluWCwgbWluWSBhbmQgc2l6ZSBhcmUgbGF0ZXIgdXNlZCB0byB0cmFuc2Zvcm0gY29vcmRzIGludG8gaW50ZWdlcnMgZm9yIHotb3JkZXIgY2FsY3VsYXRpb25cclxuICAgICAgICBzaXplID0gTWF0aC5tYXgobWF4WCAtIG1pblgsIG1heFkgLSBtaW5ZKTtcclxuICAgIH1cclxuXHJcbiAgICBlYXJjdXRMaW5rZWQob3V0ZXJOb2RlLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgc2l6ZSk7XHJcblxyXG4gICAgcmV0dXJuIHRyaWFuZ2xlcztcclxufVxyXG5cclxuLy8gLy8gcmV0dXJuIGEgcGVyY2VudGFnZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHBvbHlnb24gYXJlYSBhbmQgaXRzIHRyaWFuZ3VsYXRpb24gYXJlYTtcclxuLy8gLy8gdXNlZCB0byB2ZXJpZnkgY29ycmVjdG5lc3Mgb2YgdHJpYW5ndWxhdGlvblxyXG4vLyBlYXJjdXQuZGV2aWF0aW9uID0gZnVuY3Rpb24gKGRhdGEsIGhvbGVJbmRpY2VzLCBkaW0sIHRyaWFuZ2xlcykge1xyXG4vLyAgICAgY29uc3QgaGFzSG9sZXMgPSBob2xlSW5kaWNlcyAmJiBob2xlSW5kaWNlcy5sZW5ndGg7XHJcbi8vICAgICBjb25zdCBvdXRlckxlbiA9IGhhc0hvbGVzID8gaG9sZUluZGljZXNbMF0gKiBkaW0gOiBkYXRhLmxlbmd0aDtcclxuXHJcbi8vICAgICBsZXQgcG9seWdvbkFyZWEgPSBNYXRoLmFicyhzaWduZWRBcmVhKGRhdGEsIDAsIG91dGVyTGVuLCBkaW0pKTtcclxuLy8gICAgIGlmIChoYXNIb2xlcykge1xyXG4vLyAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBob2xlSW5kaWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4vLyAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGhvbGVJbmRpY2VzW2ldICogZGltO1xyXG4vLyAgICAgICAgICAgICBjb25zdCBlbmQgPSBpIDwgbGVuIC0gMSA/IGhvbGVJbmRpY2VzW2kgKyAxXSAqIGRpbSA6IGRhdGEubGVuZ3RoO1xyXG4vLyAgICAgICAgICAgICBwb2x5Z29uQXJlYSAtPSBNYXRoLmFicyhzaWduZWRBcmVhKGRhdGEsIHN0YXJ0LCBlbmQsIGRpbSkpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBsZXQgdHJpYW5nbGVzQXJlYSA9IDA7XHJcbi8vICAgICBmb3IgKGkgPSAwOyBpIDwgdHJpYW5nbGVzLmxlbmd0aDsgaSArPSAzKSB7XHJcbi8vICAgICAgICAgY29uc3QgYSA9IHRyaWFuZ2xlc1tpXSAqIGRpbTtcclxuLy8gICAgICAgICBjb25zdCBiID0gdHJpYW5nbGVzW2kgKyAxXSAqIGRpbTtcclxuLy8gICAgICAgICBjb25zdCBjID0gdHJpYW5nbGVzW2kgKyAyXSAqIGRpbTtcclxuLy8gICAgICAgICB0cmlhbmdsZXNBcmVhICs9IE1hdGguYWJzKFxyXG4vLyAgICAgICAgICAgICAoZGF0YVthXSAtIGRhdGFbY10pICogKGRhdGFbYiArIDFdIC0gZGF0YVthICsgMV0pIC1cclxuLy8gICAgICAgICAgICAgKGRhdGFbYV0gLSBkYXRhW2JdKSAqIChkYXRhW2MgKyAxXSAtIGRhdGFbYSArIDFdKSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcmV0dXJuIHBvbHlnb25BcmVhID09PSAwICYmIHRyaWFuZ2xlc0FyZWEgPT09IDAgPyAwIDpcclxuLy8gICAgICAgICBNYXRoLmFicygodHJpYW5nbGVzQXJlYSAtIHBvbHlnb25BcmVhKSAvIHBvbHlnb25BcmVhKTtcclxuLy8gfTtcclxuXHJcbi8vIC8vIHR1cm4gYSBwb2x5Z29uIGluIGEgbXVsdGktZGltZW5zaW9uYWwgYXJyYXkgZm9ybSAoZS5nLiBhcyBpbiBHZW9KU09OKSBpbnRvIGEgZm9ybSBFYXJjdXQgYWNjZXB0c1xyXG4vLyBlYXJjdXQuZmxhdHRlbiA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbi8vICAgICBsZXQgZGltID0gZGF0YVswXVswXS5sZW5ndGgsXHJcbi8vICAgICAgICAgcmVzdWx0ID0ge3ZlcnRpY2VzOiBbXSwgaG9sZXM6IFtdLCBkaW1lbnNpb25zOiBkaW19LFxyXG4vLyAgICAgICAgIGhvbGVJbmRleCA9IDA7XHJcblxyXG4vLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbi8vICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRhW2ldLmxlbmd0aDsgaisrKSB7XHJcbi8vICAgICAgICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgZGltOyBkKyspIHsgcmVzdWx0LnZlcnRpY2VzLnB1c2goZGF0YVtpXVtqXVtkXSk7IH1cclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgaWYgKGkgPiAwKSB7XHJcbi8vICAgICAgICAgICAgIGhvbGVJbmRleCArPSBkYXRhW2kgLSAxXS5sZW5ndGg7XHJcbi8vICAgICAgICAgICAgIHJlc3VsdC5ob2xlcy5wdXNoKGhvbGVJbmRleCk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyAgICAgcmV0dXJuIHJlc3VsdDtcclxuLy8gfTtcclxuIl19