/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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

var EventTarget = require('../event/event-target');
var JS = require('../platform/js');

function createItem (url) {
    return {
        src: url,
        error: null,
        content: null,
        complete: false
    };
}

var LoadingItems = function () {
    EventTarget.call(this);

    this.map = {};
    this.completed = {};
    // this.list = [];
};

JS.mixin(LoadingItems.prototype, EventTarget.prototype, {
    append: function (urlList) {
        var list = [];
        for (var i = 0; i < urlList.length; ++i) {
            var url = urlList[i];
            // No duplicated url
            if (!this.map[url]) {
                this.map[url] = createItem(url);
                list.push(url);
            }
        }
        return list;
    },
    isCompleted: function () {
        return Object.keys(this.map).length === 0;
    },
    itemDone: function (url) {
        if (!this.map[url]) {
            return;
        }

        var item = this.map[url];
        item.complete = true;
        this.completed[url] = item;
        delete this.map[url];

        this.emit(url, item);
    }
});

module.exports = LoadingItems;