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

var CallbacksInvoker = require('../platform/callbacks-invoker');
var JS = require('../platform/js');
var Path = require('../utils/CCPath');

function createItem (url) {
    var result;
    if (typeof url === 'object' && url.src) {
        if (!url.type) {
            url.type = Path.extname(url.src).toLowerCase().substr(1);
        }
        result = {
            error: null,
            content: null,
            complete: false,
            states: {}
        };
        JS.mixin(result, url);
    }
    else if (typeof url === 'string') {
        result = {
            src: url,
            type: Path.extname(url).toLowerCase().substr(1),
            error: null,
            content: null,
            complete: false,
            states: {}
        };
    }

    return result;
}

var LoadingItems = function () {
    CallbacksInvoker.call(this);

    this.map = {};
    this.completed = {};
    this.totalCount = 0;
    this.completeCount = 0;
    // this.list = [];
};

JS.mixin(LoadingItems.prototype, CallbacksInvoker.prototype, {
    append: function (urlList) {
        var list = [];
        for (var i = 0; i < urlList.length; ++i) {
            var url = urlList[i];
            // No duplicated url
            if (!this.map[url]) {
                var item = createItem(url);
                if (item) {
                    this.map[item.src] = item;
                    list.push(item.src);
                }
            }
        }
        this.totalCount += list.length;
        return list;
    },

    getCompletedCount: function () {
        return this.completeCount;
    },
    getTotalCount: function () {
        return this.totalCount;
    },

    isCompleted: function () {
        return this.completeCount >= this.totalCount;
    },

    itemDone: function (url) {
        // Not exist or already completed
        if (!this.map[url] || this.completed[url]) {
            return;
        }

        var item = this.map[url];
        item.complete = true;
        this.completed[url] = item;

        this.invoke(url, item);
        this.completeCount++;
    }
});

module.exports = LoadingItems;