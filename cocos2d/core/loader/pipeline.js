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

var JS = require('../platform/js');
var LoadingItems = require('loading-items');

var ItemState = {
    WORKING: 1,
    COMPLETE: 2,
    ERROR: 3
};

function asyncFlow (item) {
    var pipeId = this.id;
    var itemState = item[pipeId];
    
    if (itemState === ItemState.COMPLETE) {
        if (this.next) {
            this.next.flow(item);
        }
        else {
            this.pipeline.flowOut(item);
        }
    }
    else if (itemState === ItemState.WORKING) {
        return;
    }
    else {
        item[pipeId] = ItemState.WORKING;
        this.handle(item, function (err) {
            if (err) {
                item[pipeId] = ItemState.ERROR;
                item.error = err;
                this.pipeline.flowOut(item);
            }
            else {
                item[pipeId] = ItemState.COMPLETE;
                if (this.next) {
                    this.next.flow(item);
                }
                else {
                    this.pipeline.flowOut(item);
                }
            }
        });
    }
}
function syncFlow (item) {
    var pipeId = this.id;
    var itemState = item[pipeId];
    
    if (itemState === ItemState.COMPLETE) {
        if (this.next) {
            this.next.flow(item);
        }
        else {
            this.pipeline.flowOut(item);
        }
    }
    else if (itemState === ItemState.WORKING) {
        return;
    }
    else {
        item[pipeId] = ItemState.WORKING;
        this.handle(item);
        item[pipeId] = ItemState.COMPLETE;
        if (this.next) {
            this.next.flow(item);
        }
        else {
            this.pipeline.flowOut(item);
        }
    }
}

var Pipeline = function (pipes) {
    this._pipes = pipes;
    this._items = new LoadingItems();
    this._flowing = false;

    for (var i = 0; i < pipes.length; ++i) {
        var pipe = pipes[i];
        // Must have handle and id, handle for flow, id for state flag
        if (!pipe.handle || !pipe.id) {
            continue;
        }

        pipe.pipeline = this;
        pipe.next = i < pipes.length - 1 ? pipes[i+1] : null;

        if (pipe.isAsync) {
            pipe.flow = asyncFlow;
        }
        else {
            pipe.flow = syncFlow;
        }
    }
};

Pipeline.ItemState = new cc.Enum(ItemState);

JS.mixin(Pipeline.prototype, {
    flow: function (urlList) {
        if (!this._flowing) {
            this._flowing = true;
        }
        
        var appendedUrls = this._items.append(urlList);
        var items = this._items.map;

        if (this._pipes.length > 0) {
            for (var i = 0; i < appendedUrls.length; i++) {
                var url = appendedUrls[i];
                this._pipes[0].flow(items[url]);
            }
        }
    },
    flowOut: function (item) {
        this._items.itemDone(item.src);
        // All completed
        if (this._items.isCompleted) {
            // this.onComplete(this._items);
        }
    }
});

module.exports = Pipeline;