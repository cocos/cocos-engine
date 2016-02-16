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

var CallbacksInvoker = require('../event/callbacks-invoker');
var JS = require('../platform/js');
var Path = require('../utils/CCPath');

function createItem (url) {
    var result;
    if (typeof url === 'object' && url.src) {
        if (!url.type) {
            url.type = Path.extname(url.src).toLowerCase();
        }
        result = {
            error: null,
            content: null,
            complete: false
        };
        JS.mixin(result, url);
    }
    else if (typeof url === 'string') {
        result = {
            src: url,
            type: Path.extname(url),
            error: null,
            content: null,
            complete: false
        };
    }

    return result;
}

var LoadingItems = function () {
    CallbacksInvoker.call(this);

    this.map = {};
    this.completed = {};
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
                    this.map[url] = item;
                    list.push(url);
                }
            }
        }
        return list;
    },
    isCompleted: function () {
        for (var any in this.map) {
            return false;
        }
        return true;
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