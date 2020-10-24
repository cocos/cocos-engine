(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../event/callbacks-invoker.js", "../utils/path.js", "../utils/js.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../event/callbacks-invoker.js"), require("../utils/path.js"), require("../utils/js.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.callbacksInvoker, global.path, global.js, global.globalExports);
    global.loadingItems = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _callbacksInvoker, _path, _js, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.LoadingItems = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var _qid = 0 | Math.random() * 998;

  var _queues = (0, _js.createMap)(true);

  var _pool = [];
  var _POOL_MAX_LENGTH = 10;
  var ItemState;

  (function (ItemState) {
    ItemState[ItemState["WORKING"] = 0] = "WORKING";
    ItemState[ItemState["COMPLETE"] = 1] = "COMPLETE";
    ItemState[ItemState["ERROR"] = 2] = "ERROR";
  })(ItemState || (ItemState = {}));

  ;

  var _queueDeps = (0, _js.createMap)(true);

  function isIdValid(id) {
    var realId = id.url || id;
    return typeof realId === 'string';
  }

  function _parseUrlParam(url) {
    if (!url) return undefined;
    var split = url.split('?');

    if (!split || !split[0] || !split[1]) {
      return undefined;
    }

    var urlParam = {};
    var queries = split[1].split('&');
    queries.forEach(function (item) {
      var itemSplit = item.split('=');
      urlParam[itemSplit[0]] = itemSplit[1];
    });
    return urlParam;
  }

  function createItem(id, queueId) {
    var url = _typeof(id) === 'object' ? id.url : id;
    var result = {
      queueId: queueId,
      id: url,
      url: url,
      // real download url, maybe changed
      rawUrl: undefined,
      // url used in scripts
      urlParam: _parseUrlParam(url),
      type: "",
      error: null,
      content: null,
      complete: false,
      states: {},
      deps: null,
      isScene: id.uuid && _globalExports.legacyCC.game._sceneInfos.find(function (info) {
        return info.uuid === id.uuid;
      })
    };

    if (_typeof(id) === 'object') {
      (0, _js.mixin)(result, id);

      if (id.skips) {
        for (var i = 0; i < id.skips.length; i++) {
          var skip = id.skips[i];
          result.states[skip] = ItemState.COMPLETE;
        }
      }
    }

    result.rawUrl = result.url;

    if (url && !result.type) {
      result.type = (0, _path.extname)(url).toLowerCase().substr(1);
    }

    return result;
  }

  var _checkedIds = [];

  function checkCircleReference(owner, item, recursiveCall) {
    if (!owner || !item) {
      return false;
    }

    var result = false;

    _checkedIds.push(item.id);

    if (item.deps) {
      var i,
          deps = item.deps,
          subDep;

      for (i = 0; i < deps.length; i++) {
        subDep = deps[i];

        if (subDep.id === owner.id) {
          result = true;
          break;
        } else if (_checkedIds.indexOf(subDep.id) >= 0) {
          continue;
        } else if (subDep.deps && checkCircleReference(owner, subDep, true)) {
          result = true;
          break;
        }
      }
    }

    if (!recursiveCall) {
      _checkedIds.length = 0;
    }

    return result;
  }
  /**
   * @en
   * LoadingItems is the queue of items which can flow them into the loading pipeline.<br/>
   * Please don't construct it directly, use [[create]] instead, because we use an internal pool to recycle the queues.<br/>
   * It hold a map of items, each entry in the map is a url to object key value pair.<br/>
   * Each item always contains the following property:<br/>
   * - id: The identification of the item, usually it's identical to url<br/>
   * - url: The url <br/>
   * - type: The type, it's the extension name of the url by default, could be specified manually too.<br/>
   * - error: The error happened in pipeline will be stored in this property.<br/>
   * - content: The content processed by the pipeline, the final result will also be stored in this property.<br/>
   * - complete: The flag indicate whether the item is completed by the pipeline.<br/>
   * - states: An object stores the states of each pipe the item go through, the state can be: Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE<br/>
   * <br/>
   * Item can hold other custom properties.<br/>
   * Each LoadingItems object will be destroyed for recycle after onComplete callback<br/>
   * So please don't hold its reference for later usage, you can copy properties in it though.
   * @zh
   * LoadingItems 是一个加载对象队列，可以用来输送加载对象到加载管线中。<br/>
   * 请不要直接使用 new 构造这个类的对象，你可以使用 [[create]] 来创建一个新的加载队列，这样可以允许我们的内部对象池回收并重利用加载队列。
   * 它有一个 map 属性用来存放加载项，在 map 对象中已 url 为 key 值。<br/>
   * 每个对象都会包含下列属性：<br/>
   * - id：该对象的标识，通常与 url 相同。<br/>
   * - url：路径 <br/>
   * - type: 类型，它这是默认的 URL 的扩展名，可以手动指定赋值。<br/>
   * - error：pipeline 中发生的错误将被保存在这个属性中。<br/>
   * - content: pipeline 中处理的临时结果，最终的结果也将被存储在这个属性中。<br/>
   * - complete：该标志表明该对象是否通过 pipeline 完成。<br/>
   * - states：该对象存储每个管道中对象经历的状态，状态可以是 Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE<br/>
   * <br/>
   * 对象可容纳其他自定义属性。<br/>
   * 每个 LoadingItems 对象都会在 onComplete 回调之后被销毁，所以请不要持有它的引用并在结束回调之后依赖它的内容执行任何逻辑，有这种需求的话你可以提前复制它的内容。
   */


  var LoadingItems = /*#__PURE__*/function (_CallbacksInvoker) {
    _inherits(LoadingItems, _CallbacksInvoker);

    /**
     * @en The item states of the LoadingItems, its value could be {{ItemState.WORKING}} | {{ItemState.COMPLETE}} | {{ItemState.ERROR}}
     * @zh LoadingItems 队列中的加载项状态，状态的值可能是 {{ItemState.WORKING}} | {{ItemState.COMPLETE}} | {{ItemState.ERROR}}
     */

    /**
     * @en This is a callback which will be invoked while an item flow out the pipeline.
     * You can pass the callback function in LoadingItems.create or set it later.
     * @zh 这个回调函数将在 item 加载结束后被调用。你可以在构造时传递这个回调函数或者是在构造之后直接设置。
     * @param completedCount The number of the items that are already completed.
     * @param totalCount The total number of the items.
     * @param item The latest item which flow out the pipeline.
     * @example
     * ```
     * import { log } from 'cc';
     * loadingItems.onProgress (completedCount, totalCount, item) {
     *     let progress = (100 * completedCount / totalCount).toFixed(2);
     *     log(progress + '%');
     * }
     * ```
     */

    /**
     * @en This is a callback which will be invoked while all items is completed,
     * You can pass the callback function in LoadingItems.create or set it later.
     * @zh 该函数将在加载队列全部完成时被调用。你可以在构造时传递这个回调函数或者是在构造之后直接设置。
     * @param errors All errored urls will be stored in this array, if no error happened, then it will be null
     * @param items All items.
     * @example
     * ```
     * import { log } from 'cc';
     * loadingItems.onComplete (errors, items) {
     *     if (error) {
     *         log('Completed with ' + errors.length + ' errors');
     *     } else {
     *         log('Completed ' + items.totalCount + ' items');
     *     }
     * }
     * ```
     */

    /**
     * @en The map of all items.
     * @zh 存储所有加载项的对象。
     */

    /**
     * @en The map of completed items.
     * @zh 存储已经完成的加载项。
     */

    /**
     * @en Total count of all items.
     * @zh 所有加载项的总数。
     */

    /**
     * @en Total count of completed items.
     * @zh 所有完成加载项的总数。
     */

    /**
     * @en Activated or not.
     * @zh 是否启用。
     */
    function LoadingItems(pipeline, urlList, onProgress, onComplete) {
      var _this;

      _classCallCheck(this, LoadingItems);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LoadingItems).call(this));
      _this.onProgress = void 0;
      _this.onComplete = void 0;
      _this.map = (0, _js.createMap)(true);
      _this.completed = {};
      _this.totalCount = 0;
      _this.completedCount = 0;
      _this.active = void 0;
      _this._id = void 0;
      _this._pipeline = void 0;
      _this._errorUrls = [];
      _this._appending = false;
      _this._ownerQueue = null;
      _this._id = ++_qid;
      _queues[_this._id] = _assertThisInitialized(_this);
      _this._pipeline = pipeline;
      _this.onProgress = onProgress;
      _this.onComplete = onComplete;

      if (_this._pipeline) {
        _this.active = true;
      } else {
        _this.active = false;
      }

      if (urlList) {
        if (urlList.length > 0) {
          _this.append(urlList);
        } else {
          _this.allComplete();
        }
      }

      return _this;
    }
    /**
     * @en The constructor function of LoadingItems, this will use recycled LoadingItems in the internal pool if possible.
     * You can pass onProgress and onComplete callbacks to visualize the loading process.
     * @zh LoadingItems 的构造函数，这种构造方式会重用内部对象缓冲池中的 LoadingItems 队列，以尽量避免对象创建。
     * 你可以传递 onProgress 和 onComplete 回调函数来获知加载进度信息。
     * @param {Pipeline} pipeline The pipeline to process the queue.
     * @param {Array} urlList The items array.
     * @param {Function} [onProgress] The progression callback, refer to [[onProgress]]
     * @param {Function} [onComplete] The completion callback, refer to [[LoadingItems.onComplete]]
     * @return {LoadingItems} The LoadingItems queue object
     * @example
     * ```
     * import { log, LoadingItems } from 'cc';
     * LoadingItems.create(loader, ['a.png', 'b.plist'], function (completedCount, totalCount, item) {
     *     let progress = (100 * completedCount / totalCount).toFixed(2);
     *     log(progress + '%');
     * }, function (errors, items) {
     *     if (errors) {
     *         for (let i = 0; i < errors.length; ++i) {
     *             log('Error url: ' + errors[i] + ', error: ' + items.getError(errors[i]));
     *         }
     *     }
     *     else {
     *         let result_a = items.getContent('a.png');
     *         // ...
     *     }
     * })
     * ```
     */


    _createClass(LoadingItems, [{
      key: "append",

      /**
       * @en Add urls to the LoadingItems queue.
       * @zh 向一个 LoadingItems 队列添加加载项。
       * @param urlList 要追加的url列表，url可以是对象或字符串
       * @param owner
       * @return 在已接受的url列表中，可以拒绝某些无效项
       */
      value: function append(urlList, owner) {
        var _this2 = this;

        if (!this.active) {
          return [];
        }

        if (owner && !owner.deps) {
          owner.deps = [];
        }

        this._appending = true;
        var accepted = [],
            i,
            url,
            item;

        for (i = 0; i < urlList.length; ++i) {
          url = urlList[i]; // Already queued in another items queue, url is actually the item

          if (url.queueId && !this.map[url.id]) {
            this.map[url.id] = url; // Register item deps for circle reference check

            owner && owner.deps.push(url); // Queued and completed or Owner circle referenced by dependency

            if (url.complete || checkCircleReference(owner, url)) {
              this.totalCount++; // console.log('----- Completed already or circle referenced ' + url.id + ', rest: ' + (this.totalCount - this.completedCount-1));

              this.itemComplete(url.id);
              continue;
            } // Not completed yet, should wait it
            else {
                var _ret = function () {
                  var self = _this2;
                  var queue = _queues[url.queueId];

                  if (queue) {
                    _this2.totalCount++;
                    LoadingItems.registerQueueDep(owner || _this2._id, url.id); // console.log('+++++ Waited ' + url.id);

                    queue.addListener(url.id, function (item) {
                      // console.log('----- Completed by waiting ' + item.id + ', rest: ' + (self.totalCount - self.completedCount-1));
                      self.itemComplete(item.id);
                    });
                  }

                  return "continue";
                }();

                if (_ret === "continue") continue;
              }
          } // Queue new items


          if (isIdValid(url)) {
            item = createItem(url, this._id);
            var key = item.id; // No duplicated url

            if (!this.map[key]) {
              this.map[key] = item;
              this.totalCount++; // Register item deps for circle reference check

              owner && owner.deps.push(item);
              LoadingItems.registerQueueDep(owner || this._id, key);
              accepted.push(item); // console.log('+++++ Appended ' + item.id);
            }
          }
        }

        this._appending = false; // Manually complete

        if (this.completedCount === this.totalCount) {
          // console.log('===== All Completed ');
          this.allComplete();
        } else {
          this._pipeline.flowIn(accepted);
        }

        return accepted;
      }
    }, {
      key: "_childOnProgress",
      value: function _childOnProgress(item) {
        if (this.onProgress) {
          var dep = _queueDeps[this._id];
          this.onProgress(dep ? dep.completed.length : this.completedCount, dep ? dep.deps.length : this.totalCount, item);
        }
      }
      /**
       * @en Complete a LoadingItems queue, please do not call this method unless you know what's happening.
       * @zh 完成一个 LoadingItems 队列，请不要调用这个函数，除非你知道自己在做什么。
       */

    }, {
      key: "allComplete",
      value: function allComplete() {
        var errors = this._errorUrls.length === 0 ? null : this._errorUrls;

        if (this.onComplete) {
          this.onComplete(errors, this);
        }
      }
      /**
       * @en Check whether all items are completed.
       * @zh 检查是否所有加载项都已经完成。
       */

    }, {
      key: "isCompleted",
      value: function isCompleted() {
        return this.completedCount >= this.totalCount;
      }
      /**
       * @en Check whether an item is completed.
       * @zh 通过 id 检查指定加载项是否已经加载完成。
       * @param id The item's id.
       */

    }, {
      key: "isItemCompleted",
      value: function isItemCompleted(id) {
        return !!this.completed[id];
      }
      /**
       * @en Check whether an item exists.
       * @zh 通过 id 检查加载项是否存在。
       * @param id The item's id.
       */

    }, {
      key: "exists",
      value: function exists(id) {
        return !!this.map[id];
      }
      /**
       * @en Returns the content of an internal item.
       * @zh 通过 id 获取指定对象的内容。
       * @param id The item's id.
       */

    }, {
      key: "getContent",
      value: function getContent(id) {
        var item = this.map[id];
        var ret = null;

        if (item) {
          if (item.content) {
            ret = item.content;
          } else if (item.alias) {
            ret = item.alias.content;
          }
        }

        return ret;
      }
      /**
       * @en Returns the error of an internal item.
       * @zh 通过 id 获取指定对象的错误信息。
       * @param id The item's id.
       */

    }, {
      key: "getError",
      value: function getError(id) {
        var item = this.map[id];
        var ret = null;

        if (item) {
          if (item.error) {
            ret = item.error;
          } else if (item.alias) {
            ret = item.alias.error;
          }
        }

        return ret;
      }
      /**
       * @en Remove an item, can only remove completed item, ongoing item can not be removed.
       * @zh 移除加载项，这里只会移除已经完成的加载项，正在进行的加载项将不能被删除。
       * @param url
       */

    }, {
      key: "removeItem",
      value: function removeItem(url) {
        var item = this.map[url];
        if (!item) return;
        if (!this.completed[item.alias || url]) return;
        delete this.completed[url];
        delete this.map[url];

        if (item.alias) {
          delete this.completed[item.alias.id];
          delete this.map[item.alias.id];
        }

        this.completedCount--;
        this.totalCount--;
      }
      /**
       * @en Complete an item in the LoadingItems queue, please do not call this method unless you know what's happening.
       * @zh 通知 LoadingItems 队列一个 item 对象已完成，请不要调用这个函数，除非你知道自己在做什么。
       * @param id The item url
       */

    }, {
      key: "itemComplete",
      value: function itemComplete(id) {
        var item = this.map[id];

        if (!item) {
          return;
        } // Register or unregister errors


        var errorListId = this._errorUrls.indexOf(id);

        if (item.error && errorListId === -1) {
          this._errorUrls.push(id);
        } else if (!item.error && errorListId !== -1) {
          this._errorUrls.splice(errorListId, 1);
        }

        LoadingItems.finishDep(item.id);
        this.emit(id, item);
        this.removeAll(id);
        this.completed[id] = item;
        this.completedCount++;

        if (this.onProgress) {
          var dep = _queueDeps[this._id];
          this.onProgress(dep ? dep.completed.length : this.completedCount, dep ? dep.deps.length : this.totalCount, item);
        } // All completed


        if (!this._appending && this.completedCount >= this.totalCount) {
          // console.log('===== All Completed ');
          this.allComplete();
        }
      }
      /**
       * @en Destroy the LoadingItems queue, the queue object won't be garbage collected, it will be recycled, so every after destroy is not reliable.
       * @zh 销毁一个 LoadingItems 队列，这个队列对象会被内部缓冲池回收，所以销毁后的所有内部信息都是不可依赖的。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.active = false;
        this._appending = false;
        this._pipeline = null;
        this._ownerQueue = null;
        this._errorUrls.length = 0;
        this.onProgress = undefined;
        this.onComplete = undefined;
        this.map = (0, _js.createMap)(true);
        this.completed = {};
        this.totalCount = 0;
        this.completedCount = 0;
        this.clear();
        _queues[this._id] = null;

        if (_queueDeps[this._id]) {
          _queueDeps[this._id].completed.length = 0;
          _queueDeps[this._id].deps.length = 0;
        }

        if (_pool.indexOf(this) === -1 && _pool.length < _POOL_MAX_LENGTH) {
          _pool.push(this);
        }
      }
      /**
       * @en Add a listener for an item, the callback will be invoked when the item is completed.
       * @zh 监听加载项（通过 key 指定）的完成事件。
       * @param key - The item key
       * @param callback - Callback function when item loaded
       * @param target - Callback callee
       */

    }, {
      key: "addListener",
      value: function addListener(key, callback, target) {
        return _get(_getPrototypeOf(LoadingItems.prototype), "on", this).call(this, key, callback, target);
      }
      /**
       * @en
       * Check if the specified key has any registered callback.
       * If a callback is also specified, it will only return true if the callback is registered.
       * @zh
       * 检查指定的加载项是否有完成事件监听器。
       * 如果同时还指定了一个回调方法，并且回调有注册，它只会返回 true。
       * @param key - The item key
       * @param callback - Callback function when item loaded
       * @param target - Callback callee
       * @return Whether the corresponding listener for the item is registered
       */

    }, {
      key: "hasListener",
      value: function hasListener(key, callback, target) {
        return _get(_getPrototypeOf(LoadingItems.prototype), "hasEventListener", this).call(this, key, callback, target);
      }
      /**
       * @en
       * Removes a listener.
       * It will only remove when key, callback, target all match correctly.
       * @zh
       * 移除指定加载项已经注册的完成事件监听器。
       * 只会删除 key, callback, target 均匹配的监听器。
       * @param key - The item key
       * @param callback - Callback function when item loaded
       * @param target - Callback callee
       */

    }, {
      key: "removeListener",
      value: function removeListener(key, callback, target) {
        return _get(_getPrototypeOf(LoadingItems.prototype), "off", this).call(this, key, callback, target);
      }
      /**
       * @en Removes all callbacks registered in a certain event
       * type or all callbacks registered with a certain target.
       * @zh 删除指定目标的所有完成事件监听器。
       * @param {String|Object} key - The item key to be removed or the target to be removed
       */

    }, {
      key: "removeAllListeners",
      value: function removeAllListeners(key) {
        _get(_getPrototypeOf(LoadingItems.prototype), "removeAll", this).call(this, key);
      }
    }], [{
      key: "create",
      value: function create(pipeline, urlList, onProgress, onComplete) {
        if (onProgress === undefined) {
          if (typeof urlList === 'function') {
            onComplete = urlList;
            urlList = onProgress = null;
          }
        } else if (onComplete === undefined) {
          if (typeof urlList === 'function') {
            onComplete = onProgress;
            onProgress = urlList;
            urlList = null;
          } else {
            onComplete = onProgress;
            onProgress = null;
          }
        }

        var queue = _pool.pop();

        if (queue) {
          queue._pipeline = pipeline;
          queue.onProgress = onProgress;
          queue.onComplete = onComplete;
          _queues[queue._id] = queue;

          if (queue._pipeline) {
            queue.active = true;
          }

          if (urlList) {
            queue.append(urlList);
          }
        } else {
          queue = new LoadingItems(pipeline, urlList, onProgress, onComplete);
        }

        return queue;
      }
      /**
       * @en Retrieve the LoadingItems queue object for an item.
       * @zh 通过 item 对象获取它的 LoadingItems 队列。
       * @param item The item to query
       * @return The LoadingItems queue object
       */

    }, {
      key: "getQueue",
      value: function getQueue(item) {
        return item.queueId ? _queues[item.queueId] : null;
      }
      /**
       * @en Complete an item in the LoadingItems queue, please do not call this method unless you know what's happening.
       * @zh 通知 LoadingItems 队列一个 item 对象已完成，请不要调用这个函数，除非你知道自己在做什么。
       * @param item The item which has completed
       */

    }, {
      key: "itemComplete",
      value: function itemComplete(item) {
        var queue = _queues[item.queueId];

        if (queue) {
          // console.log('----- Completed by pipeline ' + item.id + ', rest: ' + (queue.totalCount - queue.completedCount-1));
          queue.itemComplete(item.id);
        }
      }
    }, {
      key: "initQueueDeps",
      value: function initQueueDeps(queue) {
        var dep = _queueDeps[queue._id];

        if (!dep) {
          dep = _queueDeps[queue._id] = {
            completed: [],
            deps: []
          };
        } else {
          dep.completed.length = 0;
          dep.deps.length = 0;
        }
      }
    }, {
      key: "registerQueueDep",
      value: function registerQueueDep(owner, depId) {
        var queueId = owner.queueId || owner;

        if (!queueId) {
          return false;
        }

        var queueDepList = _queueDeps[queueId]; // Owner is root queue

        if (queueDepList) {
          if (queueDepList.deps.indexOf(depId) === -1) {
            queueDepList.deps.push(depId);
          }
        } // Owner is an item in the intermediate queue
        else if (owner.id) {
            for (var id in _queueDeps) {
              var queue = _queueDeps[id]; // Found root queue

              if (queue.deps.indexOf(owner.id) !== -1) {
                if (queue.deps.indexOf(depId) === -1) {
                  queue.deps.push(depId);
                }
              }
            }
          }
      }
    }, {
      key: "finishDep",
      value: function finishDep(depId) {
        for (var id in _queueDeps) {
          var queue = _queueDeps[id]; // Found root queue

          if (queue.deps.indexOf(depId) !== -1 && queue.completed.indexOf(depId) === -1) {
            queue.completed.push(depId);
          }
        }
      }
    }]);

    return LoadingItems;
  }(_callbacksInvoker.CallbacksInvoker);

  _exports.LoadingItems = LoadingItems;
  LoadingItems.ItemState = new _globalExports.legacyCC.Enum(ItemState);
  _globalExports.legacyCC.LoadingItems = LoadingItems;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9sb2FkaW5nLWl0ZW1zLnRzIl0sIm5hbWVzIjpbIl9xaWQiLCJNYXRoIiwicmFuZG9tIiwiX3F1ZXVlcyIsIl9wb29sIiwiX1BPT0xfTUFYX0xFTkdUSCIsIkl0ZW1TdGF0ZSIsIl9xdWV1ZURlcHMiLCJpc0lkVmFsaWQiLCJpZCIsInJlYWxJZCIsInVybCIsIl9wYXJzZVVybFBhcmFtIiwidW5kZWZpbmVkIiwic3BsaXQiLCJ1cmxQYXJhbSIsInF1ZXJpZXMiLCJmb3JFYWNoIiwiaXRlbSIsIml0ZW1TcGxpdCIsImNyZWF0ZUl0ZW0iLCJxdWV1ZUlkIiwicmVzdWx0IiwicmF3VXJsIiwidHlwZSIsImVycm9yIiwiY29udGVudCIsImNvbXBsZXRlIiwic3RhdGVzIiwiZGVwcyIsImlzU2NlbmUiLCJ1dWlkIiwibGVnYWN5Q0MiLCJnYW1lIiwiX3NjZW5lSW5mb3MiLCJmaW5kIiwiaW5mbyIsInNraXBzIiwiaSIsImxlbmd0aCIsInNraXAiLCJDT01QTEVURSIsInRvTG93ZXJDYXNlIiwic3Vic3RyIiwiX2NoZWNrZWRJZHMiLCJjaGVja0NpcmNsZVJlZmVyZW5jZSIsIm93bmVyIiwicmVjdXJzaXZlQ2FsbCIsInB1c2giLCJzdWJEZXAiLCJpbmRleE9mIiwiTG9hZGluZ0l0ZW1zIiwicGlwZWxpbmUiLCJ1cmxMaXN0Iiwib25Qcm9ncmVzcyIsIm9uQ29tcGxldGUiLCJtYXAiLCJjb21wbGV0ZWQiLCJ0b3RhbENvdW50IiwiY29tcGxldGVkQ291bnQiLCJhY3RpdmUiLCJfaWQiLCJfcGlwZWxpbmUiLCJfZXJyb3JVcmxzIiwiX2FwcGVuZGluZyIsIl9vd25lclF1ZXVlIiwiYXBwZW5kIiwiYWxsQ29tcGxldGUiLCJhY2NlcHRlZCIsIml0ZW1Db21wbGV0ZSIsInNlbGYiLCJxdWV1ZSIsInJlZ2lzdGVyUXVldWVEZXAiLCJhZGRMaXN0ZW5lciIsImtleSIsImZsb3dJbiIsImRlcCIsImVycm9ycyIsInJldCIsImFsaWFzIiwiZXJyb3JMaXN0SWQiLCJzcGxpY2UiLCJmaW5pc2hEZXAiLCJlbWl0IiwicmVtb3ZlQWxsIiwiY2xlYXIiLCJjYWxsYmFjayIsInRhcmdldCIsInBvcCIsImRlcElkIiwicXVldWVEZXBMaXN0IiwiQ2FsbGJhY2tzSW52b2tlciIsIkVudW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DQSxNQUFJQSxJQUFJLEdBQUksSUFBR0MsSUFBSSxDQUFDQyxNQUFMLEtBQWMsR0FBN0I7O0FBQ0EsTUFBSUMsT0FBTyxHQUFHLG1CQUFVLElBQVYsQ0FBZDs7QUFDQSxNQUFJQyxLQUEwQixHQUFHLEVBQWpDO0FBQ0EsTUFBTUMsZ0JBQWdCLEdBQUcsRUFBekI7TUFpQktDLFM7O2FBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7S0FBQUEsUyxLQUFBQSxTOztBQUlKOztBQUVELE1BQUlDLFVBQVUsR0FBRyxtQkFBVSxJQUFWLENBQWpCOztBQUVBLFdBQVNDLFNBQVQsQ0FBb0JDLEVBQXBCLEVBQXdCO0FBQ3BCLFFBQUlDLE1BQU0sR0FBR0QsRUFBRSxDQUFDRSxHQUFILElBQVVGLEVBQXZCO0FBQ0EsV0FBUSxPQUFPQyxNQUFQLEtBQWtCLFFBQTFCO0FBQ0g7O0FBRUQsV0FBU0UsY0FBVCxDQUF5QkQsR0FBekIsRUFBOEI7QUFDMUIsUUFBSSxDQUFDQSxHQUFMLEVBQVUsT0FBT0UsU0FBUDtBQUNWLFFBQUlDLEtBQUssR0FBR0gsR0FBRyxDQUFDRyxLQUFKLENBQVUsR0FBVixDQUFaOztBQUNBLFFBQUksQ0FBQ0EsS0FBRCxJQUFVLENBQUNBLEtBQUssQ0FBQyxDQUFELENBQWhCLElBQXVCLENBQUNBLEtBQUssQ0FBQyxDQUFELENBQWpDLEVBQXNDO0FBQ2xDLGFBQU9ELFNBQVA7QUFDSDs7QUFDRCxRQUFJRSxR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LEVBQXNDO0FBQ2xDbEIsa0JBQUFBLEtBQUssQ0FBQzFDLElBQU4sQ0FBV21CLElBQVgsQ0FBZ0J5QyxLQUFoQjtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0o7OztnQ0FFaUJBLEssRUFBTztBQUNyQixhQUFLLElBQUloRixFQUFULElBQWVGLFVBQWYsRUFBMkI7QUFDdkIsY0FBSWdFLEtBQUssR0FBR2hFLFVBQVUsQ0FBQ0UsRUFBRCxDQUF0QixDQUR1QixDQUV2Qjs7QUFDQSxjQUFJOEQsS0FBSyxDQUFDMUMsSUFBTixDQUFXcUIsT0FBWCxDQUFtQnVDLEtBQW5CLE1BQThCLENBQUMsQ0FBL0IsSUFBb0NsQixLQUFLLENBQUNkLFNBQU4sQ0FBZ0JQLE9BQWhCLENBQXdCdUMsS0FBeEIsTUFBbUMsQ0FBQyxDQUE1RSxFQUErRTtBQUMzRWxCLFlBQUFBLEtBQUssQ0FBQ2QsU0FBTixDQUFnQlQsSUFBaEIsQ0FBcUJ5QyxLQUFyQjtBQUNIO0FBQ0o7QUFDSjs7OztJQXhQNkJFLGtDOzs7QUFBckJ4QyxFQUFBQSxZLENBS0Y3QyxTLEdBQVksSUFBSTBCLHdCQUFTNEQsSUFBYixDQUFrQnRGLFNBQWxCLEM7QUF1aUJ2QjBCLDBCQUFTbUIsWUFBVCxHQUF3QkEsWUFBeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBsb2FkZXJcclxuICovXHJcblxyXG5pbXBvcnQge0NhbGxiYWNrc0ludm9rZXJ9IGZyb20gJy4uL2V2ZW50L2NhbGxiYWNrcy1pbnZva2VyJztcclxuaW1wb3J0IHtleHRuYW1lfSBmcm9tICcuLi91dGlscy9wYXRoJztcclxuaW1wb3J0IHtjcmVhdGVNYXAsIG1peGlufSBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxubGV0IF9xaWQgPSAoMHwoTWF0aC5yYW5kb20oKSo5OTgpKTtcclxubGV0IF9xdWV1ZXMgPSBjcmVhdGVNYXAodHJ1ZSk7XHJcbmxldCBfcG9vbDogQXJyYXk8TG9hZGluZ0l0ZW1zPiA9IFtdO1xyXG5jb25zdCBfUE9PTF9NQVhfTEVOR1RIID0gMTA7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElJdGVtIHtcclxuICAgIHF1ZXVlSWQ7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgdXJsOyAvLyByZWFsIGRvd25sb2FkIHVybCwgbWF5YmUgY2hhbmdlZFxyXG4gICAgcmF3VXJsOyAvLyB1cmwgdXNlZCBpbiBzY3JpcHRzXHJcbiAgICB1cmxQYXJhbTtcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGVycm9yOiBFcnJvcnxudWxsO1xyXG4gICAgY29udGVudDogYW55O1xyXG4gICAgY29tcGxldGU6IGJvb2xlYW47XHJcbiAgICBzdGF0ZXM6IG9iamVjdDtcclxuICAgIGRlcHM7XHJcbiAgICBpc1NjZW5lOiBib29sZWFuO1xyXG59XHJcblxyXG5lbnVtIEl0ZW1TdGF0ZSB7XHJcbiAgICBXT1JLSU5HLFxyXG4gICAgQ09NUExFVEUsXHJcbiAgICBFUlJPUlxyXG59O1xyXG5cclxubGV0IF9xdWV1ZURlcHMgPSBjcmVhdGVNYXAodHJ1ZSk7XHJcblxyXG5mdW5jdGlvbiBpc0lkVmFsaWQgKGlkKSB7XHJcbiAgICBsZXQgcmVhbElkID0gaWQudXJsIHx8IGlkO1xyXG4gICAgcmV0dXJuICh0eXBlb2YgcmVhbElkID09PSAnc3RyaW5nJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9wYXJzZVVybFBhcmFtICh1cmwpIHtcclxuICAgIGlmICghdXJsKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgbGV0IHNwbGl0ID0gdXJsLnNwbGl0KCc/Jyk7XHJcbiAgICBpZiAoIXNwbGl0IHx8ICFzcGxpdFswXSB8fCAhc3BsaXRbMV0pIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgbGV0IHVybFBhcmFtID0ge307XHJcbiAgICBsZXQgcXVlcmllcyA9IHNwbGl0WzFdLnNwbGl0KCcmJyk7XHJcbiAgICBxdWVyaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBsZXQgaXRlbVNwbGl0ID0gaXRlbS5zcGxpdCgnPScpO1xyXG4gICAgICAgIHVybFBhcmFtW2l0ZW1TcGxpdFswXV0gPSBpdGVtU3BsaXRbMV07XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB1cmxQYXJhbTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVJdGVtIChpZCwgcXVldWVJZCkge1xyXG4gICAgbGV0IHVybCA9ICh0eXBlb2YgaWQgPT09ICdvYmplY3QnKSA/IGlkLnVybCA6IGlkO1xyXG4gICAgbGV0IHJlc3VsdCA9IHtcclxuICAgICAgICBxdWV1ZUlkOiBxdWV1ZUlkLFxyXG4gICAgICAgIGlkOiB1cmwsXHJcbiAgICAgICAgdXJsOiB1cmwsIC8vIHJlYWwgZG93bmxvYWQgdXJsLCBtYXliZSBjaGFuZ2VkXHJcbiAgICAgICAgcmF3VXJsOiB1bmRlZmluZWQsIC8vIHVybCB1c2VkIGluIHNjcmlwdHNcclxuICAgICAgICB1cmxQYXJhbTogX3BhcnNlVXJsUGFyYW0odXJsKSxcclxuICAgICAgICB0eXBlOiBcIlwiLFxyXG4gICAgICAgIGVycm9yOiBudWxsLFxyXG4gICAgICAgIGNvbnRlbnQ6IG51bGwsXHJcbiAgICAgICAgY29tcGxldGU6IGZhbHNlLFxyXG4gICAgICAgIHN0YXRlczoge30sXHJcbiAgICAgICAgZGVwczogbnVsbCxcclxuICAgICAgICBpc1NjZW5lOiBpZC51dWlkICYmIGxlZ2FjeUNDLmdhbWUuX3NjZW5lSW5mb3MuZmluZCgoaW5mbykgPT4gaW5mby51dWlkID09PSBpZC51dWlkKSxcclxuICAgIH07XHJcblxyXG4gICAgaWYgKHR5cGVvZiBpZCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBtaXhpbihyZXN1bHQsIGlkKTtcclxuICAgICAgICBpZiAoaWQuc2tpcHMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZC5za2lwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNraXAgPSBpZC5za2lwc1tpXTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5zdGF0ZXNbc2tpcF0gPSBJdGVtU3RhdGUuQ09NUExFVEU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXN1bHQucmF3VXJsID0gcmVzdWx0LnVybDtcclxuICAgIGlmICh1cmwgJiYgIXJlc3VsdC50eXBlKSB7XHJcbiAgICAgICAgcmVzdWx0LnR5cGUgPSBleHRuYW1lKHVybCkudG9Mb3dlckNhc2UoKS5zdWJzdHIoMSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5sZXQgX2NoZWNrZWRJZHM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuZnVuY3Rpb24gY2hlY2tDaXJjbGVSZWZlcmVuY2Uob3duZXIsIGl0ZW06IElJdGVtLCByZWN1cnNpdmVDYWxsPykge1xyXG4gICAgaWYgKCFvd25lciB8fCAhaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgIF9jaGVja2VkSWRzLnB1c2goaXRlbS5pZCk7XHJcbiAgICBpZiAoaXRlbS5kZXBzKSB7XHJcbiAgICAgICAgbGV0IGksIGRlcHMgPSBpdGVtLmRlcHMsIHN1YkRlcDtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGVwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzdWJEZXAgPSBkZXBzW2ldO1xyXG4gICAgICAgICAgICBpZiAoc3ViRGVwLmlkID09PSBvd25lci5pZCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKF9jaGVja2VkSWRzLmluZGV4T2Yoc3ViRGVwLmlkKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzdWJEZXAuZGVwcyAmJiBjaGVja0NpcmNsZVJlZmVyZW5jZShvd25lciwgc3ViRGVwLCB0cnVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFyZWN1cnNpdmVDYWxsKSB7XHJcbiAgICAgICAgX2NoZWNrZWRJZHMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogTG9hZGluZ0l0ZW1zIGlzIHRoZSBxdWV1ZSBvZiBpdGVtcyB3aGljaCBjYW4gZmxvdyB0aGVtIGludG8gdGhlIGxvYWRpbmcgcGlwZWxpbmUuPGJyLz5cclxuICogUGxlYXNlIGRvbid0IGNvbnN0cnVjdCBpdCBkaXJlY3RseSwgdXNlIFtbY3JlYXRlXV0gaW5zdGVhZCwgYmVjYXVzZSB3ZSB1c2UgYW4gaW50ZXJuYWwgcG9vbCB0byByZWN5Y2xlIHRoZSBxdWV1ZXMuPGJyLz5cclxuICogSXQgaG9sZCBhIG1hcCBvZiBpdGVtcywgZWFjaCBlbnRyeSBpbiB0aGUgbWFwIGlzIGEgdXJsIHRvIG9iamVjdCBrZXkgdmFsdWUgcGFpci48YnIvPlxyXG4gKiBFYWNoIGl0ZW0gYWx3YXlzIGNvbnRhaW5zIHRoZSBmb2xsb3dpbmcgcHJvcGVydHk6PGJyLz5cclxuICogLSBpZDogVGhlIGlkZW50aWZpY2F0aW9uIG9mIHRoZSBpdGVtLCB1c3VhbGx5IGl0J3MgaWRlbnRpY2FsIHRvIHVybDxici8+XHJcbiAqIC0gdXJsOiBUaGUgdXJsIDxici8+XHJcbiAqIC0gdHlwZTogVGhlIHR5cGUsIGl0J3MgdGhlIGV4dGVuc2lvbiBuYW1lIG9mIHRoZSB1cmwgYnkgZGVmYXVsdCwgY291bGQgYmUgc3BlY2lmaWVkIG1hbnVhbGx5IHRvby48YnIvPlxyXG4gKiAtIGVycm9yOiBUaGUgZXJyb3IgaGFwcGVuZWQgaW4gcGlwZWxpbmUgd2lsbCBiZSBzdG9yZWQgaW4gdGhpcyBwcm9wZXJ0eS48YnIvPlxyXG4gKiAtIGNvbnRlbnQ6IFRoZSBjb250ZW50IHByb2Nlc3NlZCBieSB0aGUgcGlwZWxpbmUsIHRoZSBmaW5hbCByZXN1bHQgd2lsbCBhbHNvIGJlIHN0b3JlZCBpbiB0aGlzIHByb3BlcnR5Ljxici8+XHJcbiAqIC0gY29tcGxldGU6IFRoZSBmbGFnIGluZGljYXRlIHdoZXRoZXIgdGhlIGl0ZW0gaXMgY29tcGxldGVkIGJ5IHRoZSBwaXBlbGluZS48YnIvPlxyXG4gKiAtIHN0YXRlczogQW4gb2JqZWN0IHN0b3JlcyB0aGUgc3RhdGVzIG9mIGVhY2ggcGlwZSB0aGUgaXRlbSBnbyB0aHJvdWdoLCB0aGUgc3RhdGUgY2FuIGJlOiBQaXBlbGluZS5JdGVtU3RhdGUuV09SS0lORyB8IFBpcGVsaW5lLkl0ZW1TdGF0ZS5FUlJPUiB8IFBpcGVsaW5lLkl0ZW1TdGF0ZS5DT01QTEVURTxici8+XHJcbiAqIDxici8+XHJcbiAqIEl0ZW0gY2FuIGhvbGQgb3RoZXIgY3VzdG9tIHByb3BlcnRpZXMuPGJyLz5cclxuICogRWFjaCBMb2FkaW5nSXRlbXMgb2JqZWN0IHdpbGwgYmUgZGVzdHJveWVkIGZvciByZWN5Y2xlIGFmdGVyIG9uQ29tcGxldGUgY2FsbGJhY2s8YnIvPlxyXG4gKiBTbyBwbGVhc2UgZG9uJ3QgaG9sZCBpdHMgcmVmZXJlbmNlIGZvciBsYXRlciB1c2FnZSwgeW91IGNhbiBjb3B5IHByb3BlcnRpZXMgaW4gaXQgdGhvdWdoLlxyXG4gKiBAemhcclxuICogTG9hZGluZ0l0ZW1zIOaYr+S4gOS4quWKoOi9veWvueixoemYn+WIl++8jOWPr+S7peeUqOadpei+k+mAgeWKoOi9veWvueixoeWIsOWKoOi9veeuoee6v+S4reOAgjxici8+XHJcbiAqIOivt+S4jeimgeebtOaOpeS9v+eUqCBuZXcg5p6E6YCg6L+Z5Liq57G755qE5a+56LGh77yM5L2g5Y+v5Lul5L2/55SoIFtbY3JlYXRlXV0g5p2l5Yib5bu65LiA5Liq5paw55qE5Yqg6L296Zif5YiX77yM6L+Z5qC35Y+v5Lul5YWB6K645oiR5Lus55qE5YaF6YOo5a+56LGh5rGg5Zue5pS25bm26YeN5Yip55So5Yqg6L296Zif5YiX44CCXHJcbiAqIOWug+acieS4gOS4qiBtYXAg5bGe5oCn55So5p2l5a2Y5pS+5Yqg6L296aG577yM5ZyoIG1hcCDlr7nosaHkuK3lt7IgdXJsIOS4uiBrZXkg5YC844CCPGJyLz5cclxuICog5q+P5Liq5a+56LGh6YO95Lya5YyF5ZCr5LiL5YiX5bGe5oCn77yaPGJyLz5cclxuICogLSBpZO+8muivpeWvueixoeeahOagh+ivhu+8jOmAmuW4uOS4jiB1cmwg55u45ZCM44CCPGJyLz5cclxuICogLSB1cmzvvJrot6/lvoQgPGJyLz5cclxuICogLSB0eXBlOiDnsbvlnovvvIzlroPov5nmmK/pu5jorqTnmoQgVVJMIOeahOaJqeWxleWQje+8jOWPr+S7peaJi+WKqOaMh+Wumui1i+WAvOOAgjxici8+XHJcbiAqIC0gZXJyb3LvvJpwaXBlbGluZSDkuK3lj5HnlJ/nmoTplJnor6/lsIbooqvkv53lrZjlnKjov5nkuKrlsZ7mgKfkuK3jgII8YnIvPlxyXG4gKiAtIGNvbnRlbnQ6IHBpcGVsaW5lIOS4reWkhOeQhueahOS4tOaXtue7k+aenO+8jOacgOe7iOeahOe7k+aenOS5n+Wwhuiiq+WtmOWCqOWcqOi/meS4quWxnuaAp+S4reOAgjxici8+XHJcbiAqIC0gY29tcGxldGXvvJror6XmoIflv5fooajmmI7or6Xlr7nosaHmmK/lkKbpgJrov4cgcGlwZWxpbmUg5a6M5oiQ44CCPGJyLz5cclxuICogLSBzdGF0ZXPvvJror6Xlr7nosaHlrZjlgqjmr4/kuKrnrqHpgZPkuK3lr7nosaHnu4/ljobnmoTnirbmgIHvvIznirbmgIHlj6/ku6XmmK8gUGlwZWxpbmUuSXRlbVN0YXRlLldPUktJTkcgfCBQaXBlbGluZS5JdGVtU3RhdGUuRVJST1IgfCBQaXBlbGluZS5JdGVtU3RhdGUuQ09NUExFVEU8YnIvPlxyXG4gKiA8YnIvPlxyXG4gKiDlr7nosaHlj6/lrrnnurPlhbbku5boh6rlrprkuYnlsZ7mgKfjgII8YnIvPlxyXG4gKiDmr4/kuKogTG9hZGluZ0l0ZW1zIOWvueixoemDveS8muWcqCBvbkNvbXBsZXRlIOWbnuiwg+S5i+WQjuiiq+mUgOavge+8jOaJgOS7peivt+S4jeimgeaMgeacieWug+eahOW8leeUqOW5tuWcqOe7k+adn+Wbnuiwg+S5i+WQjuS+nei1luWug+eahOWGheWuueaJp+ihjOS7u+S9lemAu+i+ke+8jOaciei/meenjemcgOaxgueahOivneS9oOWPr+S7peaPkOWJjeWkjeWItuWug+eahOWGheWuueOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExvYWRpbmdJdGVtcyBleHRlbmRzIENhbGxiYWNrc0ludm9rZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGl0ZW0gc3RhdGVzIG9mIHRoZSBMb2FkaW5nSXRlbXMsIGl0cyB2YWx1ZSBjb3VsZCBiZSB7e0l0ZW1TdGF0ZS5XT1JLSU5HfX0gfCB7e0l0ZW1TdGF0ZS5DT01QTEVURX19IHwge3tJdGVtU3RhdGUuRVJST1J9fVxyXG4gICAgICogQHpoIExvYWRpbmdJdGVtcyDpmJ/liJfkuK3nmoTliqDovb3pobnnirbmgIHvvIznirbmgIHnmoTlgLzlj6/og73mmK8ge3tJdGVtU3RhdGUuV09SS0lOR319IHwge3tJdGVtU3RhdGUuQ09NUExFVEV9fSB8IHt7SXRlbVN0YXRlLkVSUk9SfX1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIEl0ZW1TdGF0ZSA9IG5ldyBsZWdhY3lDQy5FbnVtKEl0ZW1TdGF0ZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhpcyBpcyBhIGNhbGxiYWNrIHdoaWNoIHdpbGwgYmUgaW52b2tlZCB3aGlsZSBhbiBpdGVtIGZsb3cgb3V0IHRoZSBwaXBlbGluZS5cclxuICAgICAqIFlvdSBjYW4gcGFzcyB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gaW4gTG9hZGluZ0l0ZW1zLmNyZWF0ZSBvciBzZXQgaXQgbGF0ZXIuXHJcbiAgICAgKiBAemgg6L+Z5Liq5Zue6LCD5Ye95pWw5bCG5ZyoIGl0ZW0g5Yqg6L2957uT5p2f5ZCO6KKr6LCD55So44CC5L2g5Y+v5Lul5Zyo5p6E6YCg5pe25Lyg6YCS6L+Z5Liq5Zue6LCD5Ye95pWw5oiW6ICF5piv5Zyo5p6E6YCg5LmL5ZCO55u05o6l6K6+572u44CCXHJcbiAgICAgKiBAcGFyYW0gY29tcGxldGVkQ291bnQgVGhlIG51bWJlciBvZiB0aGUgaXRlbXMgdGhhdCBhcmUgYWxyZWFkeSBjb21wbGV0ZWQuXHJcbiAgICAgKiBAcGFyYW0gdG90YWxDb3VudCBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtcy5cclxuICAgICAqIEBwYXJhbSBpdGVtIFRoZSBsYXRlc3QgaXRlbSB3aGljaCBmbG93IG91dCB0aGUgcGlwZWxpbmUuXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgXHJcbiAgICAgKiBpbXBvcnQgeyBsb2cgfSBmcm9tICdjYyc7XHJcbiAgICAgKiBsb2FkaW5nSXRlbXMub25Qcm9ncmVzcyAoY29tcGxldGVkQ291bnQsIHRvdGFsQ291bnQsIGl0ZW0pIHtcclxuICAgICAqICAgICBsZXQgcHJvZ3Jlc3MgPSAoMTAwICogY29tcGxldGVkQ291bnQgLyB0b3RhbENvdW50KS50b0ZpeGVkKDIpO1xyXG4gICAgICogICAgIGxvZyhwcm9ncmVzcyArICclJyk7XHJcbiAgICAgKiB9XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uUHJvZ3Jlc3M6KChjb21wbGV0ZWRDb3VudDogbnVtYmVyLCB0b3RhbENvdW50OiBudW1iZXIsIElJdGVtKSA9PiB2b2lkKSB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGlzIGlzIGEgY2FsbGJhY2sgd2hpY2ggd2lsbCBiZSBpbnZva2VkIHdoaWxlIGFsbCBpdGVtcyBpcyBjb21wbGV0ZWQsXHJcbiAgICAgKiBZb3UgY2FuIHBhc3MgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGluIExvYWRpbmdJdGVtcy5jcmVhdGUgb3Igc2V0IGl0IGxhdGVyLlxyXG4gICAgICogQHpoIOivpeWHveaVsOWwhuWcqOWKoOi9vemYn+WIl+WFqOmDqOWujOaIkOaXtuiiq+iwg+eUqOOAguS9oOWPr+S7peWcqOaehOmAoOaXtuS8oOmAkui/meS4quWbnuiwg+WHveaVsOaIluiAheaYr+WcqOaehOmAoOS5i+WQjuebtOaOpeiuvue9ruOAglxyXG4gICAgICogQHBhcmFtIGVycm9ycyBBbGwgZXJyb3JlZCB1cmxzIHdpbGwgYmUgc3RvcmVkIGluIHRoaXMgYXJyYXksIGlmIG5vIGVycm9yIGhhcHBlbmVkLCB0aGVuIGl0IHdpbGwgYmUgbnVsbFxyXG4gICAgICogQHBhcmFtIGl0ZW1zIEFsbCBpdGVtcy5cclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIGltcG9ydCB7IGxvZyB9IGZyb20gJ2NjJztcclxuICAgICAqIGxvYWRpbmdJdGVtcy5vbkNvbXBsZXRlIChlcnJvcnMsIGl0ZW1zKSB7XHJcbiAgICAgKiAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgKiAgICAgICAgIGxvZygnQ29tcGxldGVkIHdpdGggJyArIGVycm9ycy5sZW5ndGggKyAnIGVycm9ycycpO1xyXG4gICAgICogICAgIH0gZWxzZSB7XHJcbiAgICAgKiAgICAgICAgIGxvZygnQ29tcGxldGVkICcgKyBpdGVtcy50b3RhbENvdW50ICsgJyBpdGVtcycpO1xyXG4gICAgICogICAgIH1cclxuICAgICAqIH1cclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25Db21wbGV0ZTooKGVycm9yczogc3RyaW5nW118bnVsbCwgaXRlbXM6IExvYWRpbmdJdGVtcykgPT4gdm9pZCkgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG1hcCBvZiBhbGwgaXRlbXMuXHJcbiAgICAgKiBAemgg5a2Y5YKo5omA5pyJ5Yqg6L296aG555qE5a+56LGh44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtYXA6IE1hcDxzdHJpbmcsIElJdGVtPiA9IGNyZWF0ZU1hcCh0cnVlKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbWFwIG9mIGNvbXBsZXRlZCBpdGVtcy5cclxuICAgICAqIEB6aCDlrZjlgqjlt7Lnu4/lrozmiJDnmoTliqDovb3pobnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbXBsZXRlZCA9IHt9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRvdGFsIGNvdW50IG9mIGFsbCBpdGVtcy5cclxuICAgICAqIEB6aCDmiYDmnInliqDovb3pobnnmoTmgLvmlbDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvdGFsQ291bnQgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRvdGFsIGNvdW50IG9mIGNvbXBsZXRlZCBpdGVtcy5cclxuICAgICAqIEB6aCDmiYDmnInlrozmiJDliqDovb3pobnnmoTmgLvmlbDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbXBsZXRlZENvdW50ID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBY3RpdmF0ZWQgb3Igbm90LlxyXG4gICAgICogQHpoIOaYr+WQpuWQr+eUqOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWN0aXZlOiBib29sZWFuO1xyXG5cclxuICAgIHByaXZhdGUgX2lkOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9waXBlbGluZTtcclxuICAgIHByaXZhdGUgX2Vycm9yVXJsczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfYXBwZW5kaW5nID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgX293bmVyUXVldWU6IExvYWRpbmdJdGVtc3xudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocGlwZWxpbmUsIHVybExpc3QsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl9pZCA9ICsrX3FpZDtcclxuICAgICAgICBfcXVldWVzW3RoaXMuX2lkXSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuX3BpcGVsaW5lID0gcGlwZWxpbmU7XHJcblxyXG4gICAgICAgIHRoaXMub25Qcm9ncmVzcyA9IG9uUHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlID0gb25Db21wbGV0ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3BpcGVsaW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXJsTGlzdCkge1xyXG4gICAgICAgICAgICBpZiAodXJsTGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZCh1cmxMaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWxsQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgY29uc3RydWN0b3IgZnVuY3Rpb24gb2YgTG9hZGluZ0l0ZW1zLCB0aGlzIHdpbGwgdXNlIHJlY3ljbGVkIExvYWRpbmdJdGVtcyBpbiB0aGUgaW50ZXJuYWwgcG9vbCBpZiBwb3NzaWJsZS5cclxuICAgICAqIFlvdSBjYW4gcGFzcyBvblByb2dyZXNzIGFuZCBvbkNvbXBsZXRlIGNhbGxiYWNrcyB0byB2aXN1YWxpemUgdGhlIGxvYWRpbmcgcHJvY2Vzcy5cclxuICAgICAqIEB6aCBMb2FkaW5nSXRlbXMg55qE5p6E6YCg5Ye95pWw77yM6L+Z56eN5p6E6YCg5pa55byP5Lya6YeN55So5YaF6YOo5a+56LGh57yT5Yay5rGg5Lit55qEIExvYWRpbmdJdGVtcyDpmJ/liJfvvIzku6XlsL3ph4/pgb/lhY3lr7nosaHliJvlu7rjgIJcclxuICAgICAqIOS9oOWPr+S7peS8oOmAkiBvblByb2dyZXNzIOWSjCBvbkNvbXBsZXRlIOWbnuiwg+WHveaVsOadpeiOt+efpeWKoOi9vei/m+W6puS/oeaBr+OAglxyXG4gICAgICogQHBhcmFtIHtQaXBlbGluZX0gcGlwZWxpbmUgVGhlIHBpcGVsaW5lIHRvIHByb2Nlc3MgdGhlIHF1ZXVlLlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gdXJsTGlzdCBUaGUgaXRlbXMgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Qcm9ncmVzc10gVGhlIHByb2dyZXNzaW9uIGNhbGxiYWNrLCByZWZlciB0byBbW29uUHJvZ3Jlc3NdXVxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQ29tcGxldGVdIFRoZSBjb21wbGV0aW9uIGNhbGxiYWNrLCByZWZlciB0byBbW0xvYWRpbmdJdGVtcy5vbkNvbXBsZXRlXV1cclxuICAgICAqIEByZXR1cm4ge0xvYWRpbmdJdGVtc30gVGhlIExvYWRpbmdJdGVtcyBxdWV1ZSBvYmplY3RcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIGltcG9ydCB7IGxvZywgTG9hZGluZ0l0ZW1zIH0gZnJvbSAnY2MnO1xyXG4gICAgICogTG9hZGluZ0l0ZW1zLmNyZWF0ZShsb2FkZXIsIFsnYS5wbmcnLCAnYi5wbGlzdCddLCBmdW5jdGlvbiAoY29tcGxldGVkQ291bnQsIHRvdGFsQ291bnQsIGl0ZW0pIHtcclxuICAgICAqICAgICBsZXQgcHJvZ3Jlc3MgPSAoMTAwICogY29tcGxldGVkQ291bnQgLyB0b3RhbENvdW50KS50b0ZpeGVkKDIpO1xyXG4gICAgICogICAgIGxvZyhwcm9ncmVzcyArICclJyk7XHJcbiAgICAgKiB9LCBmdW5jdGlvbiAoZXJyb3JzLCBpdGVtcykge1xyXG4gICAgICogICAgIGlmIChlcnJvcnMpIHtcclxuICAgICAqICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAqICAgICAgICAgICAgIGxvZygnRXJyb3IgdXJsOiAnICsgZXJyb3JzW2ldICsgJywgZXJyb3I6ICcgKyBpdGVtcy5nZXRFcnJvcihlcnJvcnNbaV0pKTtcclxuICAgICAqICAgICAgICAgfVxyXG4gICAgICogICAgIH1cclxuICAgICAqICAgICBlbHNlIHtcclxuICAgICAqICAgICAgICAgbGV0IHJlc3VsdF9hID0gaXRlbXMuZ2V0Q29udGVudCgnYS5wbmcnKTtcclxuICAgICAqICAgICAgICAgLy8gLi4uXHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogfSlcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlIChwaXBlbGluZSwgdXJsTGlzdCwgb25Qcm9ncmVzcz8sIG9uQ29tcGxldGU/KSB7XHJcbiAgICAgICAgaWYgKG9uUHJvZ3Jlc3MgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHVybExpc3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUgPSB1cmxMaXN0O1xyXG4gICAgICAgICAgICAgICAgdXJsTGlzdCA9IG9uUHJvZ3Jlc3MgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9uQ29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHVybExpc3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUgPSBvblByb2dyZXNzO1xyXG4gICAgICAgICAgICAgICAgb25Qcm9ncmVzcyA9IHVybExpc3Q7XHJcbiAgICAgICAgICAgICAgICB1cmxMaXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUgPSBvblByb2dyZXNzO1xyXG4gICAgICAgICAgICAgICAgb25Qcm9ncmVzcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBxdWV1ZSA9IF9wb29sLnBvcCgpO1xyXG4gICAgICAgIGlmIChxdWV1ZSkge1xyXG4gICAgICAgICAgICBxdWV1ZS5fcGlwZWxpbmUgPSBwaXBlbGluZTtcclxuICAgICAgICAgICAgcXVldWUub25Qcm9ncmVzcyA9IG9uUHJvZ3Jlc3M7XHJcbiAgICAgICAgICAgIHF1ZXVlLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlO1xyXG4gICAgICAgICAgICBfcXVldWVzW3F1ZXVlLl9pZF0gPSBxdWV1ZTtcclxuICAgICAgICAgICAgaWYgKHF1ZXVlLl9waXBlbGluZSkge1xyXG4gICAgICAgICAgICAgICAgcXVldWUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXJsTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgcXVldWUuYXBwZW5kKHVybExpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBxdWV1ZSA9IG5ldyBMb2FkaW5nSXRlbXMocGlwZWxpbmUsIHVybExpc3QsIG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHF1ZXVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHJpZXZlIHRoZSBMb2FkaW5nSXRlbXMgcXVldWUgb2JqZWN0IGZvciBhbiBpdGVtLlxyXG4gICAgICogQHpoIOmAmui/hyBpdGVtIOWvueixoeiOt+WPluWug+eahCBMb2FkaW5nSXRlbXMg6Zif5YiX44CCXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgaXRlbSB0byBxdWVyeVxyXG4gICAgICogQHJldHVybiBUaGUgTG9hZGluZ0l0ZW1zIHF1ZXVlIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0UXVldWUgKGl0ZW06IElJdGVtKTogTG9hZGluZ0l0ZW1zIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ucXVldWVJZCA/IF9xdWV1ZXNbaXRlbS5xdWV1ZUlkXSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ29tcGxldGUgYW4gaXRlbSBpbiB0aGUgTG9hZGluZ0l0ZW1zIHF1ZXVlLCBwbGVhc2UgZG8gbm90IGNhbGwgdGhpcyBtZXRob2QgdW5sZXNzIHlvdSBrbm93IHdoYXQncyBoYXBwZW5pbmcuXHJcbiAgICAgKiBAemgg6YCa55+lIExvYWRpbmdJdGVtcyDpmJ/liJfkuIDkuKogaXRlbSDlr7nosaHlt7LlrozmiJDvvIzor7fkuI3opoHosIPnlKjov5nkuKrlh73mlbDvvIzpmaTpnZ7kvaDnn6XpgZPoh6rlt7HlnKjlgZrku4DkuYjjgIJcclxuICAgICAqIEBwYXJhbSBpdGVtIFRoZSBpdGVtIHdoaWNoIGhhcyBjb21wbGV0ZWRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGl0ZW1Db21wbGV0ZSAoaXRlbTogSUl0ZW0pIHtcclxuICAgICAgICBsZXQgcXVldWUgPSBfcXVldWVzW2l0ZW0ucXVldWVJZF07XHJcbiAgICAgICAgaWYgKHF1ZXVlKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLSBDb21wbGV0ZWQgYnkgcGlwZWxpbmUgJyArIGl0ZW0uaWQgKyAnLCByZXN0OiAnICsgKHF1ZXVlLnRvdGFsQ291bnQgLSBxdWV1ZS5jb21wbGV0ZWRDb3VudC0xKSk7XHJcbiAgICAgICAgICAgIHF1ZXVlLml0ZW1Db21wbGV0ZShpdGVtLmlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluaXRRdWV1ZURlcHMgKHF1ZXVlKSB7XHJcbiAgICAgICAgbGV0IGRlcCA9IF9xdWV1ZURlcHNbcXVldWUuX2lkXTtcclxuICAgICAgICBpZiAoIWRlcCkge1xyXG4gICAgICAgICAgICBkZXAgPSBfcXVldWVEZXBzW3F1ZXVlLl9pZF0gPSB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWQ6IFtdLFxyXG4gICAgICAgICAgICAgICAgZGVwczogW11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRlcC5jb21wbGV0ZWQubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgZGVwLmRlcHMubGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlZ2lzdGVyUXVldWVEZXAgKG93bmVyLCBkZXBJZCkge1xyXG4gICAgICAgIGxldCBxdWV1ZUlkID0gb3duZXIucXVldWVJZCB8fCBvd25lcjtcclxuICAgICAgICBpZiAoIXF1ZXVlSWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcXVldWVEZXBMaXN0ID0gX3F1ZXVlRGVwc1txdWV1ZUlkXTtcclxuICAgICAgICAvLyBPd25lciBpcyByb290IHF1ZXVlXHJcbiAgICAgICAgaWYgKHF1ZXVlRGVwTGlzdCkge1xyXG4gICAgICAgICAgICBpZiAocXVldWVEZXBMaXN0LmRlcHMuaW5kZXhPZihkZXBJZCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBxdWV1ZURlcExpc3QuZGVwcy5wdXNoKGRlcElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBPd25lciBpcyBhbiBpdGVtIGluIHRoZSBpbnRlcm1lZGlhdGUgcXVldWVcclxuICAgICAgICBlbHNlIGlmIChvd25lci5pZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpZCBpbiBfcXVldWVEZXBzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcXVldWUgPSBfcXVldWVEZXBzW2lkXTtcclxuICAgICAgICAgICAgICAgIC8vIEZvdW5kIHJvb3QgcXVldWVcclxuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5kZXBzLmluZGV4T2Yob3duZXIuaWQpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5kZXBzLmluZGV4T2YoZGVwSWQpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZS5kZXBzLnB1c2goZGVwSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZmluaXNoRGVwIChkZXBJZCkge1xyXG4gICAgICAgIGZvciAobGV0IGlkIGluIF9xdWV1ZURlcHMpIHtcclxuICAgICAgICAgICAgbGV0IHF1ZXVlID0gX3F1ZXVlRGVwc1tpZF07XHJcbiAgICAgICAgICAgIC8vIEZvdW5kIHJvb3QgcXVldWVcclxuICAgICAgICAgICAgaWYgKHF1ZXVlLmRlcHMuaW5kZXhPZihkZXBJZCkgIT09IC0xICYmIHF1ZXVlLmNvbXBsZXRlZC5pbmRleE9mKGRlcElkKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXVlLmNvbXBsZXRlZC5wdXNoKGRlcElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBZGQgdXJscyB0byB0aGUgTG9hZGluZ0l0ZW1zIHF1ZXVlLlxyXG4gICAgICogQHpoIOWQkeS4gOS4qiBMb2FkaW5nSXRlbXMg6Zif5YiX5re75Yqg5Yqg6L296aG544CCXHJcbiAgICAgKiBAcGFyYW0gdXJsTGlzdCDopoHov73liqDnmoR1cmzliJfooajvvIx1cmzlj6/ku6XmmK/lr7nosaHmiJblrZfnrKbkuLJcclxuICAgICAqIEBwYXJhbSBvd25lclxyXG4gICAgICogQHJldHVybiDlnKjlt7LmjqXlj5fnmoR1cmzliJfooajkuK3vvIzlj6/ku6Xmi5Lnu53mn5Dkupvml6DmlYjpoblcclxuICAgICAqL1xyXG4gICAgYXBwZW5kICh1cmxMaXN0OiBvYmplY3RbXSwgb3duZXI/KTogSUl0ZW1bXSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvd25lciAmJiAhb3duZXIuZGVwcykge1xyXG4gICAgICAgICAgICBvd25lci5kZXBzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hcHBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICAgIGxldCBhY2NlcHRlZDogQXJyYXk8SUl0ZW0+ID0gW10sIGksIHVybCwgaXRlbTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdXJsTGlzdC5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB1cmwgPSB1cmxMaXN0W2ldO1xyXG5cclxuICAgICAgICAgICAgLy8gQWxyZWFkeSBxdWV1ZWQgaW4gYW5vdGhlciBpdGVtcyBxdWV1ZSwgdXJsIGlzIGFjdHVhbGx5IHRoZSBpdGVtXHJcbiAgICAgICAgICAgIGlmICh1cmwucXVldWVJZCAmJiAhdGhpcy5tYXBbdXJsLmlkXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXBbdXJsLmlkXSA9IHVybDtcclxuICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIGl0ZW0gZGVwcyBmb3IgY2lyY2xlIHJlZmVyZW5jZSBjaGVja1xyXG4gICAgICAgICAgICAgICAgb3duZXIgJiYgb3duZXIuZGVwcy5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgICAgICAvLyBRdWV1ZWQgYW5kIGNvbXBsZXRlZCBvciBPd25lciBjaXJjbGUgcmVmZXJlbmNlZCBieSBkZXBlbmRlbmN5XHJcbiAgICAgICAgICAgICAgICBpZiAodXJsLmNvbXBsZXRlIHx8IGNoZWNrQ2lyY2xlUmVmZXJlbmNlKG93bmVyLCB1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJy0tLS0tIENvbXBsZXRlZCBhbHJlYWR5IG9yIGNpcmNsZSByZWZlcmVuY2VkICcgKyB1cmwuaWQgKyAnLCByZXN0OiAnICsgKHRoaXMudG90YWxDb3VudCAtIHRoaXMuY29tcGxldGVkQ291bnQtMSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbUNvbXBsZXRlKHVybC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBOb3QgY29tcGxldGVkIHlldCwgc2hvdWxkIHdhaXQgaXRcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcXVldWUgPSBfcXVldWVzW3VybC5xdWV1ZUlkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocXVldWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvYWRpbmdJdGVtcy5yZWdpc3RlclF1ZXVlRGVwKG93bmVyIHx8IHRoaXMuX2lkLCB1cmwuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnKysrKysgV2FpdGVkICcgKyB1cmwuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZS5hZGRMaXN0ZW5lcih1cmwuaWQsIGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0gQ29tcGxldGVkIGJ5IHdhaXRpbmcgJyArIGl0ZW0uaWQgKyAnLCByZXN0OiAnICsgKHNlbGYudG90YWxDb3VudCAtIHNlbGYuY29tcGxldGVkQ291bnQtMSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtQ29tcGxldGUoaXRlbS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBRdWV1ZSBuZXcgaXRlbXNcclxuICAgICAgICAgICAgaWYgKGlzSWRWYWxpZCh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gY3JlYXRlSXRlbSh1cmwsIHRoaXMuX2lkKTtcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLmlkO1xyXG4gICAgICAgICAgICAgICAgLy8gTm8gZHVwbGljYXRlZCB1cmxcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5tYXBba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwW2tleV0gPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIGl0ZW0gZGVwcyBmb3IgY2lyY2xlIHJlZmVyZW5jZSBjaGVja1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyICYmIG93bmVyLmRlcHMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBMb2FkaW5nSXRlbXMucmVnaXN0ZXJRdWV1ZURlcChvd25lciB8fCB0aGlzLl9pZCwga2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBhY2NlcHRlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCcrKysrKyBBcHBlbmRlZCAnICsgaXRlbS5pZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXBwZW5kaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIE1hbnVhbGx5IGNvbXBsZXRlXHJcbiAgICAgICAgaWYgKHRoaXMuY29tcGxldGVkQ291bnQgPT09IHRoaXMudG90YWxDb3VudCkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnPT09PT0gQWxsIENvbXBsZXRlZCAnKTtcclxuICAgICAgICAgICAgdGhpcy5hbGxDb21wbGV0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcGlwZWxpbmUuZmxvd0luKGFjY2VwdGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFjY2VwdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIF9jaGlsZE9uUHJvZ3Jlc3MgKGl0ZW0pIHtcclxuICAgICAgICBpZiAodGhpcy5vblByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXAgPSBfcXVldWVEZXBzW3RoaXMuX2lkXTtcclxuICAgICAgICAgICAgdGhpcy5vblByb2dyZXNzKGRlcCA/IGRlcC5jb21wbGV0ZWQubGVuZ3RoIDogdGhpcy5jb21wbGV0ZWRDb3VudCwgZGVwID8gZGVwLmRlcHMubGVuZ3RoIDogdGhpcy50b3RhbENvdW50LCBpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ29tcGxldGUgYSBMb2FkaW5nSXRlbXMgcXVldWUsIHBsZWFzZSBkbyBub3QgY2FsbCB0aGlzIG1ldGhvZCB1bmxlc3MgeW91IGtub3cgd2hhdCdzIGhhcHBlbmluZy5cclxuICAgICAqIEB6aCDlrozmiJDkuIDkuKogTG9hZGluZ0l0ZW1zIOmYn+WIl++8jOivt+S4jeimgeiwg+eUqOi/meS4quWHveaVsO+8jOmZpOmdnuS9oOefpemBk+iHquW3seWcqOWBmuS7gOS5iOOAglxyXG4gICAgICovXHJcbiAgICBhbGxDb21wbGV0ZSAoKSB7XHJcbiAgICAgICAgbGV0IGVycm9ycyA9IHRoaXMuX2Vycm9yVXJscy5sZW5ndGggPT09IDAgPyBudWxsIDogdGhpcy5fZXJyb3JVcmxzO1xyXG4gICAgICAgIGlmICh0aGlzLm9uQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlKGVycm9ycywgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENoZWNrIHdoZXRoZXIgYWxsIGl0ZW1zIGFyZSBjb21wbGV0ZWQuXHJcbiAgICAgKiBAemgg5qOA5p+l5piv5ZCm5omA5pyJ5Yqg6L296aG56YO95bey57uP5a6M5oiQ44CCXHJcbiAgICAgKi9cclxuICAgIGlzQ29tcGxldGVkICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZWRDb3VudCA+PSB0aGlzLnRvdGFsQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2hlY2sgd2hldGhlciBhbiBpdGVtIGlzIGNvbXBsZXRlZC5cclxuICAgICAqIEB6aCDpgJrov4cgaWQg5qOA5p+l5oyH5a6a5Yqg6L296aG55piv5ZCm5bey57uP5Yqg6L295a6M5oiQ44CCXHJcbiAgICAgKiBAcGFyYW0gaWQgVGhlIGl0ZW0ncyBpZC5cclxuICAgICAqL1xyXG4gICAgaXNJdGVtQ29tcGxldGVkIChpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jb21wbGV0ZWRbaWRdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENoZWNrIHdoZXRoZXIgYW4gaXRlbSBleGlzdHMuXHJcbiAgICAgKiBAemgg6YCa6L+HIGlkIOajgOafpeWKoOi9vemhueaYr+WQpuWtmOWcqOOAglxyXG4gICAgICogQHBhcmFtIGlkIFRoZSBpdGVtJ3MgaWQuXHJcbiAgICAgKi9cclxuICAgIGV4aXN0cyAoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMubWFwW2lkXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBjb250ZW50IG9mIGFuIGludGVybmFsIGl0ZW0uXHJcbiAgICAgKiBAemgg6YCa6L+HIGlkIOiOt+WPluaMh+WumuWvueixoeeahOWGheWuueOAglxyXG4gICAgICogQHBhcmFtIGlkIFRoZSBpdGVtJ3MgaWQuXHJcbiAgICAgKi9cclxuICAgIGdldENvbnRlbnQgKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5tYXBbaWRdO1xyXG4gICAgICAgIGxldCByZXQgPSBudWxsO1xyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldCA9IGl0ZW0uY29udGVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpdGVtLmFsaWFzKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSBpdGVtLmFsaWFzLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgZXJyb3Igb2YgYW4gaW50ZXJuYWwgaXRlbS5cclxuICAgICAqIEB6aCDpgJrov4cgaWQg6I635Y+W5oyH5a6a5a+56LGh55qE6ZSZ6K+v5L+h5oGv44CCXHJcbiAgICAgKiBAcGFyYW0gaWQgVGhlIGl0ZW0ncyBpZC5cclxuICAgICAqL1xyXG4gICAgZ2V0RXJyb3IgKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5tYXBbaWRdO1xyXG4gICAgICAgIGxldCByZXQgPSBudWxsO1xyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSBpdGVtLmVycm9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uYWxpYXMpIHtcclxuICAgICAgICAgICAgICAgIHJldCA9IGl0ZW0uYWxpYXMuZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVtb3ZlIGFuIGl0ZW0sIGNhbiBvbmx5IHJlbW92ZSBjb21wbGV0ZWQgaXRlbSwgb25nb2luZyBpdGVtIGNhbiBub3QgYmUgcmVtb3ZlZC5cclxuICAgICAqIEB6aCDnp7vpmaTliqDovb3pobnvvIzov5nph4zlj6rkvJrnp7vpmaTlt7Lnu4/lrozmiJDnmoTliqDovb3pobnvvIzmraPlnKjov5vooYznmoTliqDovb3pobnlsIbkuI3og73ooqvliKDpmaTjgIJcclxuICAgICAqIEBwYXJhbSB1cmxcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlSXRlbSAodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMubWFwW3VybF07XHJcbiAgICAgICAgaWYgKCFpdGVtKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jb21wbGV0ZWRbaXRlbS5hbGlhcyB8fCB1cmxdKSByZXR1cm47XHJcblxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmNvbXBsZXRlZFt1cmxdO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLm1hcFt1cmxdO1xyXG4gICAgICAgIGlmIChpdGVtLmFsaWFzKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbXBsZXRlZFtpdGVtLmFsaWFzLmlkXTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMubWFwW2l0ZW0uYWxpYXMuaWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRDb3VudC0tO1xyXG4gICAgICAgIHRoaXMudG90YWxDb3VudC0tO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENvbXBsZXRlIGFuIGl0ZW0gaW4gdGhlIExvYWRpbmdJdGVtcyBxdWV1ZSwgcGxlYXNlIGRvIG5vdCBjYWxsIHRoaXMgbWV0aG9kIHVubGVzcyB5b3Uga25vdyB3aGF0J3MgaGFwcGVuaW5nLlxyXG4gICAgICogQHpoIOmAmuefpSBMb2FkaW5nSXRlbXMg6Zif5YiX5LiA5LiqIGl0ZW0g5a+56LGh5bey5a6M5oiQ77yM6K+35LiN6KaB6LCD55So6L+Z5Liq5Ye95pWw77yM6Zmk6Z2e5L2g55+l6YGT6Ieq5bex5Zyo5YGa5LuA5LmI44CCXHJcbiAgICAgKiBAcGFyYW0gaWQgVGhlIGl0ZW0gdXJsXHJcbiAgICAgKi9cclxuICAgIGl0ZW1Db21wbGV0ZSAoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5tYXBbaWRdO1xyXG4gICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZWdpc3RlciBvciB1bnJlZ2lzdGVyIGVycm9yc1xyXG4gICAgICAgIGxldCBlcnJvckxpc3RJZCA9IHRoaXMuX2Vycm9yVXJscy5pbmRleE9mKGlkKTtcclxuICAgICAgICBpZiAoaXRlbS5lcnJvciAmJiBlcnJvckxpc3RJZCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXJyb3JVcmxzLnB1c2goaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghaXRlbS5lcnJvciAmJiBlcnJvckxpc3RJZCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXJyb3JVcmxzLnNwbGljZShlcnJvckxpc3RJZCwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBMb2FkaW5nSXRlbXMuZmluaXNoRGVwKGl0ZW0uaWQpO1xyXG5cclxuICAgICAgICB0aGlzLmVtaXQoaWQsIGl0ZW0pO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsKGlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWRbaWRdID0gaXRlbTtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZENvdW50Kys7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uUHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgbGV0IGRlcCA9IF9xdWV1ZURlcHNbdGhpcy5faWRdO1xyXG4gICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3MoZGVwID8gZGVwLmNvbXBsZXRlZC5sZW5ndGggOiB0aGlzLmNvbXBsZXRlZENvdW50LCBkZXAgPyBkZXAuZGVwcy5sZW5ndGggOiB0aGlzLnRvdGFsQ291bnQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWxsIGNvbXBsZXRlZFxyXG4gICAgICAgIGlmICghdGhpcy5fYXBwZW5kaW5nICYmIHRoaXMuY29tcGxldGVkQ291bnQgPj0gdGhpcy50b3RhbENvdW50KSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCc9PT09PSBBbGwgQ29tcGxldGVkICcpO1xyXG4gICAgICAgICAgICB0aGlzLmFsbENvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIERlc3Ryb3kgdGhlIExvYWRpbmdJdGVtcyBxdWV1ZSwgdGhlIHF1ZXVlIG9iamVjdCB3b24ndCBiZSBnYXJiYWdlIGNvbGxlY3RlZCwgaXQgd2lsbCBiZSByZWN5Y2xlZCwgc28gZXZlcnkgYWZ0ZXIgZGVzdHJveSBpcyBub3QgcmVsaWFibGUuXHJcbiAgICAgKiBAemgg6ZSA5q+B5LiA5LiqIExvYWRpbmdJdGVtcyDpmJ/liJfvvIzov5nkuKrpmJ/liJflr7nosaHkvJrooqvlhoXpg6jnvJPlhrLmsaDlm57mlLbvvIzmiYDku6XplIDmr4HlkI7nmoTmiYDmnInlhoXpg6jkv6Hmga/pg73mmK/kuI3lj6/kvp3otZbnmoTjgIJcclxuICAgICAqL1xyXG4gICAgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9hcHBlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9waXBlbGluZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fb3duZXJRdWV1ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fZXJyb3JVcmxzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5vblByb2dyZXNzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMub25Db21wbGV0ZSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgdGhpcy5tYXAgPSBjcmVhdGVNYXAodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQgPSB7fTtcclxuXHJcbiAgICAgICAgdGhpcy50b3RhbENvdW50ID0gMDtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZENvdW50ID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgICAgICBfcXVldWVzW3RoaXMuX2lkXSA9IG51bGw7XHJcbiAgICAgICAgaWYgKF9xdWV1ZURlcHNbdGhpcy5faWRdKSB7XHJcbiAgICAgICAgICAgIF9xdWV1ZURlcHNbdGhpcy5faWRdLmNvbXBsZXRlZC5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICBfcXVldWVEZXBzW3RoaXMuX2lkXS5kZXBzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfcG9vbC5pbmRleE9mKHRoaXMpID09PSAtMSAmJiBfcG9vbC5sZW5ndGggPCBfUE9PTF9NQVhfTEVOR1RIKSB7XHJcbiAgICAgICAgICAgIF9wb29sLnB1c2godGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFkZCBhIGxpc3RlbmVyIGZvciBhbiBpdGVtLCB0aGUgY2FsbGJhY2sgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGl0ZW0gaXMgY29tcGxldGVkLlxyXG4gICAgICogQHpoIOebkeWQrOWKoOi9vemhue+8iOmAmui/hyBrZXkg5oyH5a6a77yJ55qE5a6M5oiQ5LqL5Lu244CCXHJcbiAgICAgKiBAcGFyYW0ga2V5IC0gVGhlIGl0ZW0ga2V5XHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBDYWxsYmFjayBmdW5jdGlvbiB3aGVuIGl0ZW0gbG9hZGVkXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gQ2FsbGJhY2sgY2FsbGVlXHJcbiAgICAgKi9cclxuICAgIGFkZExpc3RlbmVyIChrZXk6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCB0YXJnZXQ/OiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIub24oa2V5LCBjYWxsYmFjaywgdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ2hlY2sgaWYgdGhlIHNwZWNpZmllZCBrZXkgaGFzIGFueSByZWdpc3RlcmVkIGNhbGxiYWNrLlxyXG4gICAgICogSWYgYSBjYWxsYmFjayBpcyBhbHNvIHNwZWNpZmllZCwgaXQgd2lsbCBvbmx5IHJldHVybiB0cnVlIGlmIHRoZSBjYWxsYmFjayBpcyByZWdpc3RlcmVkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmo4Dmn6XmjIflrprnmoTliqDovb3pobnmmK/lkKbmnInlrozmiJDkuovku7bnm5HlkKzlmajjgIJcclxuICAgICAqIOWmguaenOWQjOaXtui/mOaMh+WumuS6huS4gOS4quWbnuiwg+aWueazle+8jOW5tuS4lOWbnuiwg+acieazqOWGjO+8jOWug+WPquS8mui/lOWbniB0cnVl44CCXHJcbiAgICAgKiBAcGFyYW0ga2V5IC0gVGhlIGl0ZW0ga2V5XHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBDYWxsYmFjayBmdW5jdGlvbiB3aGVuIGl0ZW0gbG9hZGVkXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gQ2FsbGJhY2sgY2FsbGVlXHJcbiAgICAgKiBAcmV0dXJuIFdoZXRoZXIgdGhlIGNvcnJlc3BvbmRpbmcgbGlzdGVuZXIgZm9yIHRoZSBpdGVtIGlzIHJlZ2lzdGVyZWRcclxuICAgICAqL1xyXG4gICAgaGFzTGlzdGVuZXIgKGtleTogc3RyaW5nLCBjYWxsYmFjaz86IEZ1bmN0aW9uLCB0YXJnZXQ/OiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFzRXZlbnRMaXN0ZW5lcihrZXksIGNhbGxiYWNrLCB0YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIuXHJcbiAgICAgKiBJdCB3aWxsIG9ubHkgcmVtb3ZlIHdoZW4ga2V5LCBjYWxsYmFjaywgdGFyZ2V0IGFsbCBtYXRjaCBjb3JyZWN0bHkuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOenu+mZpOaMh+WumuWKoOi9vemhueW3sue7j+azqOWGjOeahOWujOaIkOS6i+S7tuebkeWQrOWZqOOAglxyXG4gICAgICog5Y+q5Lya5Yig6ZmkIGtleSwgY2FsbGJhY2ssIHRhcmdldCDlnYfljLnphY3nmoTnm5HlkKzlmajjgIJcclxuICAgICAqIEBwYXJhbSBrZXkgLSBUaGUgaXRlbSBrZXlcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIENhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gaXRlbSBsb2FkZWRcclxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBDYWxsYmFjayBjYWxsZWVcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlTGlzdGVuZXIgKGtleTogc3RyaW5nLCBjYWxsYmFjaz86IEZ1bmN0aW9uLCB0YXJnZXQ/OiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIub2ZmKGtleSwgY2FsbGJhY2ssIHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVtb3ZlcyBhbGwgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgaW4gYSBjZXJ0YWluIGV2ZW50XHJcbiAgICAgKiB0eXBlIG9yIGFsbCBjYWxsYmFja3MgcmVnaXN0ZXJlZCB3aXRoIGEgY2VydGFpbiB0YXJnZXQuXHJcbiAgICAgKiBAemgg5Yig6Zmk5oyH5a6a55uu5qCH55qE5omA5pyJ5a6M5oiQ5LqL5Lu255uR5ZCs5Zmo44CCXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGtleSAtIFRoZSBpdGVtIGtleSB0byBiZSByZW1vdmVkIG9yIHRoZSB0YXJnZXQgdG8gYmUgcmVtb3ZlZFxyXG4gICAgICovXHJcbiAgICByZW1vdmVBbGxMaXN0ZW5lcnMgKGtleSkge1xyXG4gICAgICAgIHN1cGVyLnJlbW92ZUFsbChrZXkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5Mb2FkaW5nSXRlbXMgPSBMb2FkaW5nSXRlbXM7XHJcbiJdfQ==