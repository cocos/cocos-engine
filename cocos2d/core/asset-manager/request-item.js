/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

var MAX_DEAD_NUM = 50;
var _deadPool = [];

/**
 * !#en
 * A collection of information about a request
 * 
 * !#zh
 * 请求的相关信息集合
 * 
 * @class RequestItem
 */
function RequestItem () {
    this._id = '';
    this.uuid = '';
    this.url = '';
    this.ext = '.json';
    this.content = null;
    this.file = null;
    this.info = null;
    this.config = null;
    this.isNative = false;
    this.options = Object.create(null);
    this.onError = null;
    this.onLoad = null;
}

RequestItem.prototype = {

    constructor: RequestItem,

    /**
     * !#en
     * The id of request, combined from uuid and isNative
     * 
     * !#zh
     * 请求的id, 由uuid和isNative组合而成
     * 
     * @property id
     */
    get id () {
        if (!this._id) {
            this._id = this.uuid + '@' + (this.isNative ? 'native' : 'import');
        }
        return this._id;
    },

    /**
     * !#en
     * Dispatch event
     * 
     * !#zh
     * 发布事件
     * 
     * @method dispatch
     * @param {string} event - The event name
     * @param {*} param1 - Parameter 1
     * @param {*} param2 - Parameter 2
     * @param {*} param3 - Parameter 3
     * @param {*} param4 - Parameter 4
     * 
     * @example
     * var requestItem = RequestItem.create();
     * requestItem.onLoad = (msg) => console.log(msg);
     * requestItem.dispatch('load', 'hello world');
     * 
     * @typescript
     * dispatch(event: string, param1?: any, param2?: any, param3?: any, param4?: any)
     */
    dispatch (event, param1, param2, param3, param4) {
        switch (event) {
            case 'load' :
                this.onLoad && this.onLoad(param1, param2, param3, param4);
                break; 
            case 'error': 
                this.onError && this.onError(param1, param2, param3, param4);
                break;
            default:
                var str = 'on' + event[0].toUpperCase() + event.substr(1);
                if (typeof this[str] === 'function') {
                    this[str](param1, param2, param3, param4);
                }
                break;
        }
    },

    /**
     * !#en
     * Recycle this for reuse
     * 
     * !#zh
     * 回收requestItem用于复用
     * 
     * @method recycle
     * 
     * @typescript
     * recycle(): void
     */
    recycle () {
        this._id = '';
        this.uuid = '';
        this.url = '';
        this.ext = '.json';
        this.content = null;
        this.file = null;
        this.info = null;
        this.config = null;
        this.isNative = false;
        this.options = Object.create(null);
        this.onError = null;
        this.onLoad = null;
        _deadPool.length < MAX_DEAD_NUM && _deadPool.push(this);
    }
};

/**
 * !#en
 * Create a new request item from pool
 * 
 * !#zh
 * 从对象池中创建requestItem
 * 
 * @function create
 * @returns {RequestItem} requestItem
 * 
 * @typescript 
 * create(): RequestItem
 */
RequestItem.create = function () {
    var out = null;
    if (_deadPool.length !== 0) {
        out = _deadPool.pop();
    }
    else {
        out = new RequestItem();
    }

    return out;
};

module.exports = RequestItem;