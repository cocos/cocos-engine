
/**
 * Checks whether the vertices in <code>verticesArray</code> can be properly distributed into the new fixtures (more specifically, it makes sure there are no overlapping segments and the vertices are in anticlockwise order). 
 * It is recommended that you use this method for debugging only, because it may cost more CPU usage.
 * <p/>
 * @param verticesArray The vertices to be validated.
 * @return An integer which can have the following values:
 * <ul>
 * <li>0 if the vertices can be properly processed.</li>
 * <li>1 If there are overlapping lines.</li>
 * <li>2 if the points are <b>not</b> in anticlockwise order.</li>
 * <li>3 if there are overlapping lines <b>and</b> the points are <b>not</b> in anticlockwise order.</li>
 * </ul> 
 * */
var validate = function(verticesArray) {
    var i, n = verticesArray.length,
    j, j2, i2, i3, d, ret = 0;
    var fl, fl2 = false;

    for (i = 0; i < n; i++) {
        i2 = (i < n - 1) ? i + 1 : 0;
        i3 = (i > 0) ? i - 1 : n - 1;

        fl = false;
        for (j = 0; j < n; j++) {
            if (((j != i) && j != i2)) {
                if (!fl) {
                    d = det(verticesArray[i].x, verticesArray[i].y, verticesArray[i2].x, verticesArray[i2].y, verticesArray[j].x, verticesArray[j].y);
                    if ((d > 0)) {
                        fl = true;
                    }
                }

                if ((j != i3)) {
                    j2 = (j < n - 1) ? j + 1 : 0;
                    if (hitSegment(verticesArray[i].x, verticesArray[i].y, verticesArray[i2].x, verticesArray[i2].y, verticesArray[j].x, verticesArray[j].y, verticesArray[j2].x, verticesArray[j2].y)) {
                        ret = 1;
                    }
                }
            }
        }

        if (!fl) {
            fl2 = true;
        }
    }

    if (fl2) {
        if ((ret == 1)) {
            ret = 3;
        } else {
            ret = 2;
        }

    }
    return ret;
}

function calcShapes(verticesArray) {
    var vec;
    var i, n, j;
    var d, t, dx, dy, minLen;
    var i1, i2, i3, p1, p2, p3;
    var j1, j2, v1, v2, k, h;
    var vec1, vec2;
    var v, hitV;
    var isConvex;
    var figsVec = [],
    queue = [];

    queue.push(verticesArray);

    while (queue.length) {
        vec = queue[0];
        n = vec.length;
        isConvex = true;

        for (i = 0; i < n; i++) {
            i1 = i;
            i2 = (i < n - 1) ? i + 1 : i + 1 - n;
            i3 = (i < n - 2) ? i + 2 : i + 2 - n;

            p1 = vec[i1];
            p2 = vec[i2];
            p3 = vec[i3];

            d = det(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
            if ((d < 0)) {
                isConvex = false;
                minLen = Number.MAX_VALUE;

                for (j = 0; j < n; j++) {
                    if (((j != i1) && j != i2)) {
                        j1 = j;
                        j2 = (j < n - 1) ? j + 1 : 0;

                        v1 = vec[j1];
                        v2 = vec[j2];

                        v = hitRay(p1.x, p1.y, p2.x, p2.y, v1.x, v1.y, v2.x, v2.y);

                        if (v) {
                            dx = p2.x - v.x;
                            dy = p2.y - v.y;
                            t = dx * dx + dy * dy;

                            if ((t < minLen)) {
                                h = j1;
                                k = j2;
                                hitV = v;
                                minLen = t;
                            }
                        }
                    }
                }

                if ((minLen == Number.MAX_VALUE)) {
                    err();
                }

                vec1 = new Array;
                vec2 = new Array;

                j1 = h;
                j2 = k;
                v1 = vec[j1];
                v2 = vec[j2];

                if (!pointsMatch(hitV.x, hitV.y, v2.x, v2.y)) {
                    vec1.push(hitV);
                }
                if (!pointsMatch(hitV.x, hitV.y, v1.x, v1.y)) {
                    vec2.push(hitV);
                }

                h = -1;
                k = i1;
                while (true) {
                    if ((k != j2)) {
                        vec1.push(vec[k]);
                    } else {
                        if (((h < 0) || h >= n)) {
                            err();
                        }
                        if (!isOnSegment(v2.x, v2.y, vec[h].x, vec[h].y, p1.x, p1.y)) {
                            vec1.push(vec[k]);
                        }
                        break;
                    }

                    h = k;
                    if (((k - 1) < 0)) {
                        k = n - 1;
                    } else {
                        k--;
                    }
                }

                vec1 = vec1.reverse();

                h = -1;
                k = i2;
                while (true) {
                    if ((k != j1)) {
                        vec2.push(vec[k]);
                    } else {
                        if (((h < 0) || h >= n)) {
                            err();
                        }
                        if (((k == j1) && !isOnSegment(v1.x, v1.y, vec[h].x, vec[h].y, p2.x, p2.y))) {
                            vec2.push(vec[k]);
                        }
                        break;
                    }

                    h = k;
                    if (((k + 1) > n - 1)) {
                        k = 0;
                    } else {
                        k++;
                    }
                }

                queue.push(vec1, vec2);
                queue.shift();

                break;
            }
        }

        if (isConvex) {
            figsVec.push(queue.shift());
        }
    }

    return figsVec;
}

function hitRay(x1, y1, x2, y2, x3, y3, x4, y4) {
    var t1 = x3 - x1,
    t2 = y3 - y1,
    t3 = x2 - x1,
    t4 = y2 - y1,
    t5 = x4 - x3,
    t6 = y4 - y3,
    t7 = t4 * t5 - t3 * t6,
    a;

    a = (((t5 * t2) - t6 * t1) / t7);
    var px = x1 + a * t3,
    py = y1 + a * t4;
    var b1 = isOnSegment(x2, y2, x1, y1, px, py);
    var b2 = isOnSegment(px, py, x3, y3, x4, y4);

    if ((b1 && b2)) {
        return cc.v2(px, py);
    }

    return null;
}

function hitSegment(x1, y1, x2, y2, x3, y3, x4, y4) {
    var t1 = x3 - x1,
    t2 = y3 - y1,
    t3 = x2 - x1,
    t4 = y2 - y1,
    t5 = x4 - x3,
    t6 = y4 - y3,
    t7 = t4 * t5 - t3 * t6,
    a;

    a = (((t5 * t2) - t6 * t1) / t7);
    var px = x1 + a * t3,
    py = y1 + a * t4;
    var b1 = isOnSegment(px, py, x1, y1, x2, y2);
    var b2 = isOnSegment(px, py, x3, y3, x4, y4);

    if ((b1 && b2)) {
        return cc.v2(px, py);
    }

    return null;
}

function isOnSegment(px, py, x1, y1, x2, y2) {
    var b1 = ((((x1 + 0.1) >= px) && px >= x2 - 0.1) || (((x1 - 0.1) <= px) && px <= x2 + 0.1));
    var b2 = ((((y1 + 0.1) >= py) && py >= y2 - 0.1) || (((y1 - 0.1) <= py) && py <= y2 + 0.1));
    return ((b1 && b2) && isOnLine(px, py, x1, y1, x2, y2));
}

function pointsMatch(x1, y1, x2, y2) {
    var dx = (x2 >= x1) ? x2 - x1: x1 - x2,
    dy = (y2 >= y1) ? y2 - y1: y1 - y2;
    return ((dx < 0.1) && dy < 0.1);
}

function isOnLine(px, py, x1, y1, x2, y2) {
    if ((((x2 - x1) > 0.1) || x1 - x2 > 0.1)) {
        var a = (y2 - y1) / (x2 - x1),
        possibleY = a * (px - x1) + y1,
        diff = (possibleY > py) ? possibleY - py: py - possibleY;
        return (diff < 0.1);
    }

    return (((px - x1) < 0.1) || x1 - px < 0.1);
}

function det(x1, y1, x2, y2, x3, y3) {
    return x1 * y2 + x2 * y3 + x3 * y1 - y1 * x2 - y2 * x3 - y3 * x1;
}

function err() {
    throw new Error("A problem has occurred. Use the Validate() method to see where the problem is.");
}

exports.calcShapes = calcShapes;
exports.validate = validate;