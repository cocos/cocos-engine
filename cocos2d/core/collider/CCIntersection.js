/**
 * !#en Intersection helper class
 * !#zh 辅助类，用于测试形状与形状是否相交
 * @class Intersection
 * @static
 */
var Intersection = {};

/**
 * @method lineLine
 * @param {Vec2} a1
 * @param {Vec2} a2
 * @param {Vec2} b1
 * @param {Vec2} b2
 * @return {boolean}
 */
function lineLine ( a1, a2, b1, b2 ) {
    // jshint camelcase:false

    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b !== 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            return true;
        }
    }

    return false;
}

Intersection.lineLine = lineLine;

/**
 * @method lineRect
 * @param {Vec2} a1
 * @param {Vec2} a2
 * @param {Vec2} b
 * @return {boolean}
 */
function lineRect ( a1, a2, b ) {
    var r0 = new cc.Vec2( b.x, b.y );
    var r1 = new cc.Vec2( b.x, b.yMax );
    var r2 = new cc.Vec2( b.xMax, b.yMax );
    var r3 = new cc.Vec2( b.xMax, b.y );

    if ( lineLine( a1, a2, r0, r1 ) )
        return true;

    if ( lineLine( a1, a2, r1, r2 ) )
        return true;

    if ( lineLine( a1, a2, r2, r3 ) )
        return true;

    if ( lineLine( a1, a2, r3, r0 ) )
        return true;

    return false;
}

Intersection.lineRect = lineRect;

/**
 * @method linePolygon
 * @param {Vec2} a1
 * @param {Vec2} a2
 * @param {[Vec2]} b
 * @return {boolean}
 */
function linePolygon ( a1, a2, b ) {
    var length = b.length;

    for ( var i = 0; i < length; ++i ) {
        var b1 = b[i];
        var b2 = b[(i+1)%length];

        if ( lineLine( a1, a2, b1, b2 ) )
            return true;
    }

    return false;
}

Intersection.linePolygon = linePolygon;

/**
 * @method rectRect
 * @param {Rect} a
 * @param {Rect} b
 * @return {boolean}
 */
function rectRect ( a, b ) {
    // jshint camelcase:false

    var a_min_x = a.x;
    var a_min_y = a.y;
    var a_max_x = a.x + a.width;
    var a_max_y = a.y + a.height;

    var b_min_x = b.x;
    var b_min_y = b.y;
    var b_max_x = b.x + b.width;
    var b_max_y = b.y + b.height;

    return a_min_x <= b_max_x &&
           a_max_x >= b_min_x &&
           a_min_y <= b_max_y &&
           a_max_y >= b_min_y
           ;
}

Intersection.rectRect = rectRect;

/**
 * @method rectPolygon
 * @param {Rect} a
 * @param {[Vec2]} b
 * @return {boolean}
 */
function rectPolygon ( a, b ) {
    var i, l;
    var r0 = new cc.Vec2( a.x, a.y );
    var r1 = new cc.Vec2( a.x, a.yMax );
    var r2 = new cc.Vec2( a.xMax, a.yMax );
    var r3 = new cc.Vec2( a.xMax, a.y );

    // intersection check
    if ( linePolygon( r0, r1, b ) )
        return true;

    if ( linePolygon( r1, r2, b ) )
        return true;

    if ( linePolygon( r2, r3, b ) )
        return true;

    if ( linePolygon( r3, r0, b ) )
        return true;

    // check if a contains b
    for ( i = 0, l = b.length; i < l; ++i ) {
        if ( pointInPolygon(b[i], a) )
            return true;
    }

    // check if b contains a
    if ( pointInPolygon(r0, b) )
        return true;

    if ( pointInPolygon(r1, b) )
        return true;

    if ( pointInPolygon(r2, b) )
        return true;

    if ( pointInPolygon(r3, b) )
        return true;

    return false;
}

Intersection.rectPolygon = rectPolygon;

/**
 * @method polygonPolygon
 * @param {[Vec2]} a
 * @param {[Vec2]} b
 * @return {boolean}
 */
function polygonPolygon ( a, b ) {
    var i, l;

    // check if a intersects b
    for ( i = 0, l = a.length; i < l; ++i ) {
        var a1 = a[i];
        var a2 = a[(i+1)%l];

        if ( linePolygon( a1, a2, b ) )
            return true;
    }

    // check if a contains b
    for ( i = 0, l = b.length; i < l; ++i ) {
        if ( pointInPolygon(b[i], a) )
            return true;
    }

    // check if b contains a
    for ( i = 0, l = a.length; i < l; ++i ) {
        if ( pointInPolygon( a[i], b ) )
            return true;
    }

    return false;
}

Intersection.polygonPolygon = polygonPolygon;


/**
 * @method pointInPolygon
 * @param {Vec2} point
 * @param {[Vec2]} polygon
 * @return {boolean}
 */
function pointInPolygon (point, polygon) {
    var inside = false;
    var x = point.x;
    var y = point.y;

    // use some raycasting to test hits
    // https://github.com/substack/point-in-polygon/blob/master/index.js
    var length = polygon.length;

    for ( var i = 0, j = length-1; i < length; j = i++ ) {
        var xi = polygon[i].x, yi = polygon[i].y,
            xj = polygon[j].x, yj = polygon[j].y,
            intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if ( intersect ) inside = !inside;
    }

    return inside;
}

Intersection.pointInPolygon = pointInPolygon;


/**
 * @method circleCircle
 * @param {Object} a - Object contains position and radius
 * @param {Object} b - Object contains position and radius
 * @return {boolean}
 */
function circleCircle (a, b) {
    var distance = a.position.sub(b.position).mag();
    return distance < (a.radius + b.radius);
}

Intersection.circleCircle = circleCircle;


/**
 * @method polygonCircle
 * @param {[Vec2]} polygon
 * @param {Object} circle - Object contains position and radius
 * @return {boolean}
 */
function polygonCircle (polygon, circle) {
    var position = circle.position;
    if (pointInPolygon(position, polygon)) {
        return true;
    }

    for (var i = 0, l = polygon.length; i < l; i++) {
        var start = i === 0 ? polygon[polygon.length - 1] : polygon[i- 1];
        var end = polygon[i];

        if (pointLineDistance(position, start, end, true) < circle.radius) {
            return true;
        }
    }

    return false;
}

Intersection.polygonCircle = polygonCircle;

/**
 * !#en Calculate the distance of point to line.
 * !#zh 计算点到直线的距离。如果这是一条线段并且垂足不在线段内，则会计算点到线段端点的距离。
 * @method pointLineDistance
 * @param {Vec2} point
 * @param {Vec2} start - start point of line
 * @param {Vec2} end - end point of line
 * @param {boolean} isSegment - whether this line is a segment
 * @return {boolean}
 */
function pointLineDistance(point, start, end, isSegment) {
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var d = dx*dx + dy*dy;
    var t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / d;
    var p;

    if (!isSegment) {
        p = cc.v2(start.x + t * dx, start.y + t * dy);
    }
    else {
        if (d) {
            if (t < 0) p = start;
            else if (t > 1) p = end;
            else p = cc.v2(start.x + t * dx, start.y + t * dy);
        }
        else {
            p = start;
        }
    }
        
    dx = point.x - p.x;
    dy = point.y - p.y;
    return Math.sqrt(dx*dx + dy*dy);
}

Intersection.pointLineDistance = pointLineDistance;


cc.Intersection = module.exports = Intersection;
