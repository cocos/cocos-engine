/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

/**
 * @class js.array.MutableForwardIterator
 * @example
 * var array = [0, 1, 2, 3, 4];
 * var iterator = new cc.js.array.MutableForwardIterator(array);
 * for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
 *     var item = array[iterator.i];
 *     ...
 * }
 */
export default class MutableForwardIterator {
    constructor (array) {
        this.i = 0;
        this.array = array;
    }

    remove (value) {
        var index = this.array.indexOf(value);
        if (index >= 0) {
            this.removeAt(index);
        }
    }
    removeAt (i) {
        this.array.splice(i, 1);

        if (i <= this.i) {
            --this.i;
        }
    }
    fastRemove (value) {
        var index = this.array.indexOf(value);
        if (index >= 0) {
            this.fastRemoveAt(index);
        }
    }
    fastRemoveAt (i) {
        var array = this.array;
        array[i] = array[array.length - 1];
        --array.length;

        if (i <= this.i) {
            --this.i;
        }
    }
    push (item) {
        this.array.push(item);
    }
}

//js.getset(proto, 'length',
//    function () {
//        return this.array.length;
//    },
//    function (len) {
//        this.array.length = len;
//        if (this.i >= len) {
//            this.i = len - 1;
//        }
//    }
//);