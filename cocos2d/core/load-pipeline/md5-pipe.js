/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Pipeline = require('./pipeline');

var ID = 'MD5Pipe';
var FilePathRegex = /^(.+)*\.(.+)$/;

var MD5Pipe = function (md5AssetsMap) {
    this.id = ID;
    this.async = false;
    this.pipeline = null;
    this.md5AssetsMap = md5AssetsMap;
};
MD5Pipe.ID = ID;

MD5Pipe.prototype.handle = function(item) {
    let hashValue = this.md5AssetsMap[item.url];
    if (hashValue) {
        item.url  = item.url.replace(FilePathRegex, function(match, p1, p2) {
            return p1 + '.' + hashValue + '.' + p2;
        });
    }
    return item;
};


Pipeline.MD5Pipe = module.exports = MD5Pipe;
