/****************************************************************************
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
 ****************************************************************************/

//Region is used to label a rect which world axis aligned.
var Region = function () {
    this._minX = 0;
    this._minY = 0;
    this._maxX = 0;
    this._maxY = 0;

    this._width = 0;
    this._height = 0;
    this._area = 0;
    //this.moved = false;
};

var regionProto = Region.prototype;

var regionPool = [];

function regionCreate() {
    var region = regionPool.pop();
    if (!region) {
        region = new Region();
    }
    return region;
}

function regionRelease(region) {
    regionPool.push(region);
}

regionProto.setTo = function (minX, minY, maxX, maxY) {
    this._minX = minX;
    this._minY = minY;
    this._maxX = maxX;
    this._maxY = maxY;
    this.updateArea();
    return this;
};

//convert region to int values which is fast for clipping
regionProto.intValues = function () {
    this._minX = Math.floor(this._minX);
    this._minY = Math.floor(this._minY);
    this._maxX = Math.ceil(this._maxX);
    this._maxY = Math.ceil(this._maxY);
    this.updateArea();
};

//update the area of region
regionProto.updateArea = function () {
    this._width = this._maxX - this._minX;
    this._height = this._maxY - this._minY;
    this._area = this._width * this._height;
};

//merge two region into one
regionProto.union = function (target) {
    if(this.isEmpty()) {
        this.setTo(target._minX, target._minY, target._maxX, target._maxY);
        return;
    }
    if (this._minX > target._minX) {
        this._minX = target._minX;
    }
    if (this._minY > target._minY) {
        this._minY = target._minY;
    }
    if (this._maxX < target._maxX) {
        this._maxX = target._maxX;
    }
    if (this._maxY < target._maxY) {
        this._maxY = target._maxY;
    }
    this.updateArea();
};

//regionProto.intersect = function (target) {
//    if (this._minX < target._minX) {
//        this._minX = target._minX;
//    }
//    if (this._maxX > target._maxX) {
//        this._maxX = target._maxX;
//    }
//    if (this._minX >= this._maxX) {
//        this.setEmpty();
//        return;
//    }
//    if (this._minY < target._minY) {
//        this._minY = target._minY;
//    }
//
//    if (this._maxY > target._maxY) {
//        this._maxY = target._maxY;
//    }
//    if (this._minY >= this._maxY) {
//        this.setEmpty();
//        return;
//    }
//    this.updateArea();
//};

//set region to empty
regionProto.setEmpty = function () {
    this._minX = 0;
    this._minY = 0;
    this._maxX = 0;
    this._maxY = 0;
    this._width = 0;
    this._height = 0;
    this._area = 0;
};

regionProto.isEmpty = function () {
    return this._width <= 0 || this._height <= 0;
};

//check whether two region is intersects or not
regionProto.intersects = function (target) {
    if (this.isEmpty() || target.isEmpty()) {
        return false;
    }
    var max = this._minX > target._minX ? this._minX : target._minX;
    var min = this._maxX < target._maxX ? this._maxX : target._maxX;
    if (max > min) {
        return false;
    }

    max = this._minY > target._minY ? this._minY : target._minY;
    min = this._maxY < target._maxY ? this._maxY : target._maxY;
    return max <= min;
};

//update region by a rotated bounds
regionProto.updateRegion = function (bounds, matrix) {
    if (bounds.width === 0 || bounds.height === 0) {
        this.setEmpty();
        return;
    }
    var m = matrix;
    var a = m.a;
    var b = m.b;
    var c = m.c;
    var d = m.d;
    var tx = m.tx;
    var ty = m.ty;
    var x = bounds.x;
    var y = bounds.y;
    var xMax = x + bounds.width;
    var yMax = y + bounds.height;
    var minX, minY, maxX, maxY;
    if (a === 1 && b === 0 && c === 0 && d === 1) {
        minX = x + tx - 1;
        minY = y + ty - 1;
        maxX = xMax + tx + 1;
        maxY = yMax + ty + 1;
    }
    else {
        var x0 = a * x + c * y + tx;
        var y0 = b * x + d * y + ty;
        var x1 = a * xMax + c * y + tx;
        var y1 = b * xMax + d * y + ty;
        var x2 = a * xMax + c * yMax + tx;
        var y2 = b * xMax + d * yMax + ty;
        var x3 = a * x + c * yMax + tx;
        var y3 = b * x + d * yMax + ty;

        var tmp = 0;

        if (x0 > x1) {
            tmp = x0;
            x0 = x1;
            x1 = tmp;
        }
        if (x2 > x3) {
            tmp = x2;
            x2 = x3;
            x3 = tmp;
        }

        minX = (x0 < x2 ? x0 : x2) - 1;
        maxX = (x1 > x3 ? x1 : x3) + 1;

        if (y0 > y1) {
            tmp = y0;
            y0 = y1;
            y1 = tmp;
        }
        if (y2 > y3) {
            tmp = y2;
            y2 = y3;
            y3 = tmp;
        }

        minY = (y0 < y2 ? y0 : y2) - 1;
        maxY = (y1 > y3 ? y1 : y3) + 1;
    }
    this._minX = minX;
    this._minY = minY;
    this._maxX = maxX;
    this._maxY = maxY;
    this._width = maxX - minX;
    this._height = maxY - minY;
    this._area = this._width * this._height;
};

//get the area of the unioned region of r1 and r2
function unionArea(r1, r2) {
    var minX = r1._minX < r2._minX ? r1._minX : r2._minX;
    var minY = r1._minY < r2._minY ? r1._minY : r2._minY;
    var maxX = r1._maxX > r2._maxX ? r1._maxX : r2._maxX;
    var maxY = r1._maxY > r2._maxY ? r1._maxY : r2._maxY;
    return (maxX - minX) * (maxY - minY);
}

//DirtyRegion is used to collect the dirty area which need to be rerendered in canvas
//there may be many small regions which is dirty, the dirty region will merge it into several big one to optimise performance
var DirtyRegion = function() {
    this.dirtyList = [];
    this.hasClipRect = false;
    this.clipWidth = 0;
    this.clipHeight = 0;
    this.clipArea = 0;
    this.clipRectChanged = false;
};
var dirtyRegionProto = DirtyRegion.prototype;

//clip rect, regions will not be considered if it is outside
dirtyRegionProto.setClipRect = function(width, height) {
    this.hasClipRect = true;
    this.clipRectChanged = true;
    this.clipWidth = Math.ceil(width);
    this.clipHeight = Math.ceil(height);
    this.clipArea = this.clipWidth * this.clipHeight;
};

//add a new region which is dirty (need to be rendered)
dirtyRegionProto.addRegion = function(target) {
    var minX = target._minX, minY = target._minY, maxX = target._maxX, maxY = target._maxY;

    if (this.hasClipRect) {
        if (minX < 0) {
            minX = 0;
        }
        if (minY < 0) {
            minY = 0;
        }
        if (maxX > this.clipWidth) {
            maxX = this.clipWidth;
        }
        if (maxY > this.clipHeight) {
            maxY = this.clipHeight;
        }
    }
    if (minX >= maxX || minY >= maxY) {
        return false;
    }
    if (this.clipRectChanged) {
        return true;
    }
    var dirtyList = this.dirtyList;
    var region = regionCreate();
    dirtyList.push(region.setTo(minX, minY, maxX, maxY));
    this.mergeDirtyList(dirtyList);
    return true;
};

//clear all the dirty regions
dirtyRegionProto.clear = function() {
    var dirtyList = this.dirtyList;
    var length = dirtyList.length;
    for (var i = 0; i < length; i++) {
        regionRelease(dirtyList[i]);
    }
    dirtyList.length = 0;
};

//get the merged dirty regions
dirtyRegionProto.getDirtyRegions = function() {
    var dirtyList = this.dirtyList;
    if (this.clipRectChanged) {
        this.clipRectChanged = false;
        this.clear();
        var region = regionCreate();
        dirtyList.push(region.setTo(0, 0, this.clipWidth, this.clipHeight));
    }
    else {
        while (this.mergeDirtyList(dirtyList)) {
        }
    }
    var numDirty = this.dirtyList.length;
    if (numDirty > 0) {
        for (var i = 0; i < numDirty; i++) {
            this.dirtyList[i].intValues();
        }
    }
    return this.dirtyList;
};

//merge the small dirty regions into bigger region, to improve the performance of dirty regions
dirtyRegionProto.mergeDirtyList = function(dirtyList) {
    var length = dirtyList.length;
    if (length < 2) {
        return false;
    }
    var hasClipRect = this.hasClipRect;
    var bestDelta = length > 3 ? Number.POSITIVE_INFINITY : 0;
    var mergeA = 0;
    var mergeB = 0;
    var totalArea = 0;
    for (var i = 0; i < length - 1; i++) {
        var regionA = dirtyList[i];
        hasClipRect && (totalArea += regionA.area);
        for (var j = i + 1; j < length; j++) {
            var regionB = dirtyList[j];
            var delta = unionArea(regionA, regionB) - regionA.area - regionB.area;
            if (bestDelta > delta) {
                mergeA = i;
                mergeB = j;
                bestDelta = delta;
            }
        }
    }
    //if the area of dirty region exceed 95% of the screen, skip the following dirty regions merge
    if (hasClipRect && (totalArea / this.clipArea) > 0.95) {
        this.clipRectChanged = true;
    }
    if (mergeA !== mergeB) {
        var region = dirtyList[mergeB];
        dirtyList[mergeA].union(region);
        regionRelease(region);
        dirtyList.splice(mergeB, 1);
        return true;
    }
    return false;
};

cc.Region = Region;
cc.DirtyRegion = DirtyRegion;
