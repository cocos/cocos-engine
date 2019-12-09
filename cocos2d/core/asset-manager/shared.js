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
const Cache = require('./cache');
const Pipeline = require('./pipeline');

var assets = new Cache();
var files = new Cache();
var parsed = new Cache();
var bundles = new Cache();
var pipeline = new Pipeline('normal load', []);
var fetchPipeline = new Pipeline('fetch', []);
var initializePipeline = new Pipeline('initialize', []);
var transformPipeline = new Pipeline('transform url', []);

/**
 * @module cc.AssetManager
 */
/**
 * !#en
 * Strategies of loading
 * 
 * !#zh
 * 加载策略
 * 
 * @enum LoadStrategy
 */
var LoadStrategy = {
    /**
     * !#en
     * Normal loading strategy
     * 
     * !#zh
     * 正常加载策略
     * 
     * @property NORMAL
     * @readonly
     * @type {Number}
     */
    NORMAL: 0,

    /**
     * !#en
     * Preloading strategy
     * 
     * !#zh
     * 预加载策略
     * 
     * @property PRELOAD
     * @readonly
     * @type {Number}
     */
    PRELOAD: 1
};

/**
 * !#en
 * Types of request 
 * 
 * !#zh
 * 请求的类型
 * 
 * @enum RequestType
 */
var RequestType = {
    
    /**
     * !#en
     * Request asset with uuid
     * 
     * !#zh
     * 使用 uuid 请求资源
     * 
     * @property UUID
     * @readonly
     * @type {String}
     */
    UUID: 'uuid',

    /**
     * !#en
     * Request asset with relative path in project
     * 
     * !#zh
     * 使用在工程中的相对路径请求资源
     * 
     * @property PATH
     * @readonly
     * @type {String}
     */
    PATH: 'path',

    /**
     * !#en
     * Request asset with relative directory in project
     * 
     * !#zh
     * 使用在工程中的相对目录请求资源
     * 
     * @property DIR
     * @readonly
     * @type {String}
     */
    DIR: 'dir',

    /**
     * !#en
     * Request asset with url
     * 
     * !#zh
     * 使用真实 url 请求资源
     * 
     * @property URL
     * @readonly
     * @type {String}
     */
    URL: 'url',

    /**
     * !#en
     * Request asset with scene's name
     * 
     * !#zh
     * 使用场景名称请求资源
     * 
     * @property SCENE
     * @readonly
     * @type {String}
     */
    SCENE: 'scene'
};

module.exports = {assets, files, parsed, pipeline, fetchPipeline, initializePipeline, transformPipeline, LoadStrategy, RequestType, bundles};