(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/js.js", "./loading-items.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/js.js"), require("./loading-items.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.loadingItems, global.defaultConstants, global.globalExports, global.debug);
    global.pipeline = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _js, _loadingItems, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Pipeline = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var ItemState = _loadingItems.LoadingItems.ItemState;

  function flow(pipe, item) {
    var pipeId = pipe.id;
    var itemState = item.states[pipeId];
    var next = pipe.next;
    var pipeline = pipe.pipeline;

    if (item.error || itemState === ItemState.WORKING || itemState === ItemState.ERROR) {
      return;
    } else if (itemState === ItemState.COMPLETE) {
      if (next) {
        flow(next, item);
      } else {
        pipeline.flowOut(item);
      }
    } else {
      item.states[pipeId] = ItemState.WORKING; // Pass async callback in case it's a async call

      var result = pipe.handle(item, function (err, result) {
        if (err) {
          item.error = err;
          item.states[pipeId] = ItemState.ERROR;
          pipeline.flowOut(item);
        } else {
          // Result can be null, then it means no result for this pipe
          if (result) {
            item.content = result;
          }

          item.states[pipeId] = ItemState.COMPLETE;

          if (next) {
            flow(next, item);
          } else {
            pipeline.flowOut(item);
          }
        }
      }); // If result exists (not undefined, null is ok), then we go with sync call flow

      if (result instanceof Error) {
        item.error = result;
        item.states[pipeId] = ItemState.ERROR;
        pipeline.flowOut(item);
      } else if (result !== undefined) {
        // Result can be null, then it means no result for this pipe
        if (result !== null) {
          item.content = result;
        }

        item.states[pipeId] = ItemState.COMPLETE;

        if (next) {
          flow(next, item);
        } else {
          pipeline.flowOut(item);
        }
      }
    }
  }
  /**
   * @en
   * A pipeline describes a sequence of manipulations, each manipulation is called a pipe.<br/>
   * It's designed for loading process. so items should be urls, and the url will be the identity of each item during the process.<br/>
   * A list of items can flow in the pipeline and it will output the results of all pipes.<br/>
   * They flow in the pipeline like water in tubes, they go through pipe by pipe separately.<br/>
   * Finally all items will flow out the pipeline and the process is finished.
   *
   * @zh
   * pipeline 描述了一系列的操作，每个操作都被称为 pipe。<br/>
   * 它被设计来做加载过程的流程管理。所以 item 应该是 url，并且该 url 将是在处理中的每个 item 的身份标识。<br/>
   * 一个 item 列表可以在 pipeline 中流动，它将输出加载项经过所有 pipe 之后的结果。<br/>
   * 它们穿过 pipeline 就像水在管子里流动，将会按顺序流过每个 pipe。<br/>
   * 最后当所有加载项都流出 pipeline 时，整个加载流程就结束了。
   */


  var Pipeline = /*#__PURE__*/function () {
    /**
     * @en The item states of the LoadingItems, its value could be {{ItemState.WORKING}} | {{ItemState.COMPLETE}} | {{ItemState.ERROR}}
     * @zh LoadingItems 队列中的加载项状态，状态的值可能是 {{ItemState.WORKING}} | {{ItemState.COMPLETE}} | {{ItemState.ERROR}}
     */

    /**
     * @en The constructor of the Pipeline, the order of pipes will remain as given.
     * A pipe is an {{IPipe}} object which must have an `id` and a `handle` function, the `id` must be unique.
     * It should also include an `async` property to identify whether the pipe's `handle` function is asynchronous.
     * @zh 构造函数，通过一系列的 pipe 来构造一个新的 pipeline，pipes 将会在给定的顺序中被锁定。<br/>
     * 一个 pipe 就是一个对象，它包含了字符串类型的 ‘id’ 和 ‘handle’ 函数，在 pipeline 中 id 必须是唯一的。<br/>
     * 它还可以包括 ‘async’ 属性以确定它是否是一个异步过程。
     * @param pipes All pipes for constructing the pipeline
     * @example
     * ```
     *  let pipeline = new Pipeline([
     *      {
     *          id: 'Downloader',
     *          handle: function (item, callback) {},
     *          async: true
     *      },
     *      {id: 'Parser', handle: function (item) {}, async: false}
     *  ]);
     * ```
     */
    function Pipeline(pipes) {
      _classCallCheck(this, Pipeline);

      this._pipes = void 0;
      this._cache = (0, _js.createMap)(true);
      this._pipes = pipes;

      for (var i = 0; i < pipes.length; ++i) {
        var pipe = pipes[i]; // Must have handle and id, handle for flow, id for state flag

        if (!pipe.handle || !pipe.id) {
          continue;
        }

        pipe.pipeline = this;
        pipe.next = i < pipes.length - 1 ? pipes[i + 1] : null;
      }
    }
    /**
     * @en Insert a new pipe at the given index of the pipeline. <br/>
     * A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
     * @zh 在给定的索引位置插入一个新的 pipe。<br/>
     * 一个 pipe 必须包含一个字符串类型的 ‘id’ 和 ‘handle’ 函数，该 id 在 pipeline 必须是唯一标识。
     * @param pipe The pipe to be inserted
     * @param index The index to insert
     */


    _createClass(Pipeline, [{
      key: "insertPipe",
      value: function insertPipe(pipe, index) {
        // Must have handle and id, handle for flow, id for state flag
        if (!pipe.handle || !pipe.id || index > this._pipes.length) {
          (0, _debug.warnID)(4921);
          return;
        }

        if (this._pipes.indexOf(pipe) > 0) {
          (0, _debug.warnID)(4922);
          return;
        }

        pipe.pipeline = this;
        var nextPipe = null;

        if (index < this._pipes.length) {
          nextPipe = this._pipes[index];
        }

        var previousPipe = null;

        if (index > 0) {
          previousPipe = this._pipes[index - 1];
        }

        if (previousPipe) {
          previousPipe.next = pipe;
        }

        pipe.next = nextPipe;

        this._pipes.splice(index, 0, pipe);
      }
      /**
       * @en Insert a pipe to the end of an existing pipe. The existing pipe must be a valid pipe in the pipeline.
       * @zh 在当前 pipeline 的一个已知 pipe 后面插入一个新的 pipe。
       * @param refPipe An existing pipe in the pipeline.
       * @param newPipe The pipe to be inserted.
       */

    }, {
      key: "insertPipeAfter",
      value: function insertPipeAfter(refPipe, newPipe) {
        var index = this._pipes.indexOf(refPipe);

        if (index < 0) {
          return;
        }

        this.insertPipe(newPipe, index + 1);
      }
      /**
       * @en Add a new pipe at the end of the pipeline. <br/>
       * A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
       * @zh 添加一个新的 pipe 到 pipeline 尾部。 <br/>
       * 该 pipe 必须包含一个字符串类型 ‘id’ 和 ‘handle’ 函数，该 id 在 pipeline 必须是唯一标识。
       * @param pipe The pipe to be appended
       */

    }, {
      key: "appendPipe",
      value: function appendPipe(pipe) {
        // Must have handle and id, handle for flow, id for state flag
        if (!pipe.handle || !pipe.id) {
          return;
        }

        pipe.pipeline = this;
        pipe.next = null;

        if (this._pipes.length > 0) {
          this._pipes[this._pipes.length - 1].next = pipe;
        }

        this._pipes.push(pipe);
      }
      /**
       * @en
       * Let new items flow into the pipeline. <br/>
       * Each item can be a simple url string or an object,
       * if it's an object, it must contain `id` property. <br/>
       * You can specify its type by `type` property, by default, the type is the extension name in url. <br/>
       * By adding a `skips` property including pipe ids, you can skip these pipe. <br/>
       * The object can contain any supplementary property as you want. <br/>
       * @zh
       * 让新的 item 流入 pipeline 中。<br/>
       * 这里的每个 item 可以是一个简单字符串类型的 url 或者是一个对象,
       * 如果它是一个对象的话，他必须要包含 ‘id’ 属性。<br/>
       * 你也可以指定它的 ‘type’ 属性类型，默认情况下，该类型是 ‘url’ 的后缀名。<br/>
       * 也通过添加一个 包含 ‘skips’ 属性的 item 对象，你就可以跳过 skips 中包含的 pipe。<br/>
       * 该对象可以包含任何附加属性。
       * @param items The {{IItem}} to be appended to the current pipeline
       * @example
       * ```
       *  pipeline.flowIn([
       *      'res/Background.png',
       *      {
       *          id: 'res/scene.json',
       *          type: 'scene',
       *          name: 'scene',
       *          skips: ['Downloader']
       *      }
       *  ]);
       * ```
       */

    }, {
      key: "flowIn",
      value: function flowIn(items) {
        var i,
            pipe = this._pipes[0],
            item;

        if (pipe) {
          // Cache all items first, in case synchronous loading flow same item repeatly
          for (i = 0; i < items.length; i++) {
            item = items[i];
            if (!item.isScene) this._cache[item.id] = item;
          }

          for (i = 0; i < items.length; i++) {
            item = items[i];
            flow(pipe, item);
          }
        } else {
          for (i = 0; i < items.length; i++) {
            this.flowOut(items[i]);
          }
        }
      }
      /**
       * @en
       * Let new items flow into the pipeline and give a callback when the list of items are all completed. <br/>
       * This is for loading dependencies for an existing item in flow, usually used in a pipe logic. <br/>
       * For example, we have a loader for scene configuration file in JSON, the scene will only be fully loaded  <br/>
       * after all its dependencies are loaded, then you will need to use function to flow in all dependencies  <br/>
       * found in the configuration file, and finish the loader pipe only after all dependencies are loaded (in the callback).
       * @zh
       * 让新 items 流入 pipeline 并且当 item 列表完成时进行回调函数。<br/>
       * 这个 API 的使用通常是为了加载依赖项。<br/>
       * 例如：<br/>
       * 我们需要加载一个场景配置的 JSON 文件，该场景会将所有的依赖项全部都加载完毕以后，进行回调表示加载完毕。
       * @param owner The owner item
       * @param urlList The list of urls to be appended as dependencies of the owner.
       * @param callback The callback to be invoked when all dependencies are completed.
       * @return Items accepted by the pipeline
       */

    }, {
      key: "flowInDeps",
      value: function flowInDeps(owner, urlList, callback) {
        var deps = _loadingItems.LoadingItems.create(this, function (errors, items) {
          callback(errors, items);
          items.destroy();
        });

        return deps.append(urlList, owner);
      }
      /**
       * @en This function is invoked when an item has completed all pipes, it will flow out of the pipeline.
       * @zh 这个函数会在 `item` 完成了所有管道，它会被标记为 `complete` 并流出管线。
       * @param item The item which is completed
       */

    }, {
      key: "flowOut",
      value: function flowOut(item) {
        if (item.error) {
          delete this._cache[item.id];
        } else if (!this._cache[item.id] && !item.isScene) {
          this._cache[item.id] = item;
        }

        item.complete = true;

        _loadingItems.LoadingItems.itemComplete(item);
      }
      /**
       * @en
       * Copy the item states from one source item to all destination items. <br/>
       * It's quite useful when a pipe generate new items from one source item,<br/>
       * then you should flowIn these generated items into pipeline, <br/>
       * but you probably want them to skip all pipes the source item already go through,<br/>
       * you can achieve it with this API. <br/>
       * <br/>
       * For example, an unzip pipe will generate more items, but you won't want them to pass unzip or download pipe again.
       * @zh
       * 从一个源 item 向所有目标 item 复制它的 pipe 状态，用于避免重复通过部分 pipe。<br/>
       * 当一个源 item 生成了一系列新的 items 时很有用，<br/>
       * 你希望让这些新的依赖项进入 pipeline，但是又不希望它们通过源 item 已经经过的 pipe，<br/>
       * 但是你可能希望他们源 item 已经通过并跳过所有 pipes，<br/>
       * 这个时候就可以使用这个 API。
       * @param srcItem The source item
       * @param dstItems A single destination item or an array of destination items
       */

    }, {
      key: "copyItemStates",
      value: function copyItemStates(srcItem, dstItems) {
        if (!(dstItems instanceof Array)) {
          dstItems.states = srcItem.states;
          return;
        }

        for (var i = 0; i < dstItems.length; ++i) {
          dstItems[i].states = srcItem.states;
        }
      }
      /**
       * @en Returns an item in pipeline.
       * @zh 根据 id 获取一个 item
       * @param id The id of the item
       */

    }, {
      key: "getItem",
      value: function getItem(id) {
        var item = this._cache[id];
        if (!item) return item; // downloader.js downloadUuid

        if (item.alias) item = item.alias;
        return item;
      }
      /**
       * @en Removes an completed item in pipeline.
       * It will only remove the cache in the pipeline or loader, its dependencies won't be released.
       * `loader` provided another method to completely cleanup the resource and its dependencies,
       * please refer to {{Loader.release}}
       * @zh 移除指定的已完成 item。
       * 这将仅仅从 pipeline 或者 loader 中删除其缓存，并不会释放它所依赖的资源。
       * `loader` 中提供了另一种删除资源及其依赖的清理方法，请参考 {{Loader.release}}
       * @param id The id of the item
       * @return succeed or not
       */

    }, {
      key: "removeItem",
      value: function removeItem(id) {
        var removed = this._cache[id];

        if (removed && removed.complete) {
          delete this._cache[id];

          if (_defaultConstants.EDITOR) {
            var references = removed.references;

            if (references) {
              var dependListener = _globalExports.legacyCC.AssetLibrary.dependListener;

              if (dependListener) {
                for (var uuid in references) {
                  dependListener.off(uuid, references[uuid]);
                }
              }

              removed.references = null;
            }
          }
        }

        return removed;
      }
      /**
       * @en Clear the current pipeline, this function will clean up the items.
       * @zh 清空当前 pipeline，该函数将清理 items。
       */

    }, {
      key: "clear",
      value: function clear() {
        for (var id in this._cache) {
          var _item = this._cache[id];
          delete this._cache[id];

          if (!_item.complete) {
            _item.error = new Error('Canceled manually');
            this.flowOut(_item);
          }
        }
      }
    }]);

    return Pipeline;
  }();

  _exports.Pipeline = Pipeline;
  Pipeline.ItemState = ItemState;
  _globalExports.legacyCC.Pipeline = Pipeline;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9waXBlbGluZS50cyJdLCJuYW1lcyI6WyJJdGVtU3RhdGUiLCJMb2FkaW5nSXRlbXMiLCJmbG93IiwicGlwZSIsIml0ZW0iLCJwaXBlSWQiLCJpZCIsIml0ZW1TdGF0ZSIsInN0YXRlcyIsIm5leHQiLCJwaXBlbGluZSIsImVycm9yIiwiV09SS0lORyIsIkVSUk9SIiwiQ09NUExFVEUiLCJmbG93T3V0IiwicmVzdWx0IiwiaGFuZGxlIiwiZXJyIiwiY29udGVudCIsIkVycm9yIiwidW5kZWZpbmVkIiwiUGlwZWxpbmUiLCJwaXBlcyIsIl9waXBlcyIsIl9jYWNoZSIsImkiLCJsZW5ndGgiLCJpbmRleCIsImluZGV4T2YiLCJuZXh0UGlwZSIsInByZXZpb3VzUGlwZSIsInNwbGljZSIsInJlZlBpcGUiLCJuZXdQaXBlIiwiaW5zZXJ0UGlwZSIsInB1c2giLCJpdGVtcyIsImlzU2NlbmUiLCJvd25lciIsInVybExpc3QiLCJjYWxsYmFjayIsImRlcHMiLCJjcmVhdGUiLCJlcnJvcnMiLCJkZXN0cm95IiwiYXBwZW5kIiwiY29tcGxldGUiLCJpdGVtQ29tcGxldGUiLCJzcmNJdGVtIiwiZHN0SXRlbXMiLCJBcnJheSIsImFsaWFzIiwicmVtb3ZlZCIsIkVESVRPUiIsInJlZmVyZW5jZXMiLCJkZXBlbmRMaXN0ZW5lciIsImxlZ2FjeUNDIiwiQXNzZXRMaWJyYXJ5IiwidXVpZCIsIm9mZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0EsTUFBTUEsU0FBUyxHQUFHQywyQkFBYUQsU0FBL0I7O0FBVUEsV0FBU0UsSUFBVCxDQUFlQyxJQUFmLEVBQXFCQyxJQUFyQixFQUEyQjtBQUN2QixRQUFJQyxNQUFNLEdBQUdGLElBQUksQ0FBQ0csRUFBbEI7QUFDQSxRQUFJQyxTQUFTLEdBQUdILElBQUksQ0FBQ0ksTUFBTCxDQUFZSCxNQUFaLENB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QUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGxvYWRlclxyXG4gKi9cclxuXHJcbmltcG9ydCB7Y3JlYXRlTWFwfSBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IExvYWRpbmdJdGVtcywgSUl0ZW0gfSBmcm9tICcuL2xvYWRpbmctaXRlbXMnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgd2FybklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5jb25zdCBJdGVtU3RhdGUgPSBMb2FkaW5nSXRlbXMuSXRlbVN0YXRlO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGlwZSB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgYXN5bmM6IGJvb2xlYW47XHJcbiAgICBoYW5kbGUgKGl0ZW06IElJdGVtLCBjYWxsYmFjayk7XHJcbiAgICBuZXh0PzogSVBpcGV8bnVsbDtcclxuICAgIHBpcGVsaW5lPzogUGlwZWxpbmV8bnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gZmxvdyAocGlwZSwgaXRlbSkge1xyXG4gICAgbGV0IHBpcGVJZCA9IHBpcGUuaWQ7XHJcbiAgICBsZXQgaXRlbVN0YXRlID0gaXRlbS5zdGF0ZXNbcGlwZUlkXTtcclxuICAgIGxldCBuZXh0ID0gcGlwZS5uZXh0O1xyXG4gICAgbGV0IHBpcGVsaW5lID0gcGlwZS5waXBlbGluZTtcclxuXHJcbiAgICBpZiAoaXRlbS5lcnJvciB8fCBpdGVtU3RhdGUgPT09IEl0ZW1TdGF0ZS5XT1JLSU5HIHx8IGl0ZW1TdGF0ZSA9PT0gSXRlbVN0YXRlLkVSUk9SKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXRlbVN0YXRlID09PSBJdGVtU3RhdGUuQ09NUExFVEUpIHtcclxuICAgICAgICBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICBmbG93KG5leHQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcGlwZWxpbmUuZmxvd091dChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpdGVtLnN0YXRlc1twaXBlSWRdID0gSXRlbVN0YXRlLldPUktJTkc7XHJcbiAgICAgICAgLy8gUGFzcyBhc3luYyBjYWxsYmFjayBpbiBjYXNlIGl0J3MgYSBhc3luYyBjYWxsXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHBpcGUuaGFuZGxlKGl0ZW0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVycm9yID0gZXJyO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zdGF0ZXNbcGlwZUlkXSA9IEl0ZW1TdGF0ZS5FUlJPUjtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lLmZsb3dPdXQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZXN1bHQgY2FuIGJlIG51bGwsIHRoZW4gaXQgbWVhbnMgbm8gcmVzdWx0IGZvciB0aGlzIHBpcGVcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbnRlbnQgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0YXRlc1twaXBlSWRdID0gSXRlbVN0YXRlLkNPTVBMRVRFO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmbG93KG5leHQsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGlwZWxpbmUuZmxvd091dChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIElmIHJlc3VsdCBleGlzdHMgKG5vdCB1bmRlZmluZWQsIG51bGwgaXMgb2spLCB0aGVuIHdlIGdvIHdpdGggc3luYyBjYWxsIGZsb3dcclxuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgaXRlbS5lcnJvciA9IHJlc3VsdDtcclxuICAgICAgICAgICAgaXRlbS5zdGF0ZXNbcGlwZUlkXSA9IEl0ZW1TdGF0ZS5FUlJPUjtcclxuICAgICAgICAgICAgcGlwZWxpbmUuZmxvd091dChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gUmVzdWx0IGNhbiBiZSBudWxsLCB0aGVuIGl0IG1lYW5zIG5vIHJlc3VsdCBmb3IgdGhpcyBwaXBlXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY29udGVudCA9IHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpdGVtLnN0YXRlc1twaXBlSWRdID0gSXRlbVN0YXRlLkNPTVBMRVRFO1xyXG4gICAgICAgICAgICBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgZmxvdyhuZXh0LCBpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lLmZsb3dPdXQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQSBwaXBlbGluZSBkZXNjcmliZXMgYSBzZXF1ZW5jZSBvZiBtYW5pcHVsYXRpb25zLCBlYWNoIG1hbmlwdWxhdGlvbiBpcyBjYWxsZWQgYSBwaXBlLjxici8+XHJcbiAqIEl0J3MgZGVzaWduZWQgZm9yIGxvYWRpbmcgcHJvY2Vzcy4gc28gaXRlbXMgc2hvdWxkIGJlIHVybHMsIGFuZCB0aGUgdXJsIHdpbGwgYmUgdGhlIGlkZW50aXR5IG9mIGVhY2ggaXRlbSBkdXJpbmcgdGhlIHByb2Nlc3MuPGJyLz5cclxuICogQSBsaXN0IG9mIGl0ZW1zIGNhbiBmbG93IGluIHRoZSBwaXBlbGluZSBhbmQgaXQgd2lsbCBvdXRwdXQgdGhlIHJlc3VsdHMgb2YgYWxsIHBpcGVzLjxici8+XHJcbiAqIFRoZXkgZmxvdyBpbiB0aGUgcGlwZWxpbmUgbGlrZSB3YXRlciBpbiB0dWJlcywgdGhleSBnbyB0aHJvdWdoIHBpcGUgYnkgcGlwZSBzZXBhcmF0ZWx5Ljxici8+XHJcbiAqIEZpbmFsbHkgYWxsIGl0ZW1zIHdpbGwgZmxvdyBvdXQgdGhlIHBpcGVsaW5lIGFuZCB0aGUgcHJvY2VzcyBpcyBmaW5pc2hlZC5cclxuICpcclxuICogQHpoXHJcbiAqIHBpcGVsaW5lIOaPj+i/sOS6huS4gOezu+WIl+eahOaTjeS9nO+8jOavj+S4quaTjeS9nOmDveiiq+ensOS4uiBwaXBl44CCPGJyLz5cclxuICog5a6D6KKr6K6+6K6h5p2l5YGa5Yqg6L296L+H56iL55qE5rWB56iL566h55CG44CC5omA5LulIGl0ZW0g5bqU6K+l5pivIHVybO+8jOW5tuS4lOivpSB1cmwg5bCG5piv5Zyo5aSE55CG5Lit55qE5q+P5LiqIGl0ZW0g55qE6Lqr5Lu95qCH6K+G44CCPGJyLz5cclxuICog5LiA5LiqIGl0ZW0g5YiX6KGo5Y+v5Lul5ZyoIHBpcGVsaW5lIOS4rea1geWKqO+8jOWug+Wwhui+k+WHuuWKoOi9vemhuee7j+i/h+aJgOaciSBwaXBlIOS5i+WQjueahOe7k+aenOOAgjxici8+XHJcbiAqIOWug+S7rOepv+i/hyBwaXBlbGluZSDlsLHlg4/msLTlnKjnrqHlrZDph4zmtYHliqjvvIzlsIbkvJrmjInpobrluo/mtYHov4fmr4/kuKogcGlwZeOAgjxici8+XHJcbiAqIOacgOWQjuW9k+aJgOacieWKoOi9vemhuemDvea1geWHuiBwaXBlbGluZSDml7bvvIzmlbTkuKrliqDovb3mtYHnqIvlsLHnu5PmnZ/kuobjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQaXBlbGluZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgaXRlbSBzdGF0ZXMgb2YgdGhlIExvYWRpbmdJdGVtcywgaXRzIHZhbHVlIGNvdWxkIGJlIHt7SXRlbVN0YXRlLldPUktJTkd9fSB8IHt7SXRlbVN0YXRlLkNPTVBMRVRFfX0gfCB7e0l0ZW1TdGF0ZS5FUlJPUn19XHJcbiAgICAgKiBAemggTG9hZGluZ0l0ZW1zIOmYn+WIl+S4reeahOWKoOi9vemhueeKtuaAge+8jOeKtuaAgeeahOWAvOWPr+iDveaYryB7e0l0ZW1TdGF0ZS5XT1JLSU5HfX0gfCB7e0l0ZW1TdGF0ZS5DT01QTEVURX19IHwge3tJdGVtU3RhdGUuRVJST1J9fVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgSXRlbVN0YXRlID0gSXRlbVN0YXRlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfcGlwZXM6IEFycmF5PElQaXBlPjtcclxuICAgIHB1YmxpYyBfY2FjaGUgPSBjcmVhdGVNYXAodHJ1ZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBQaXBlbGluZSwgdGhlIG9yZGVyIG9mIHBpcGVzIHdpbGwgcmVtYWluIGFzIGdpdmVuLlxyXG4gICAgICogQSBwaXBlIGlzIGFuIHt7SVBpcGV9fSBvYmplY3Qgd2hpY2ggbXVzdCBoYXZlIGFuIGBpZGAgYW5kIGEgYGhhbmRsZWAgZnVuY3Rpb24sIHRoZSBgaWRgIG11c3QgYmUgdW5pcXVlLlxyXG4gICAgICogSXQgc2hvdWxkIGFsc28gaW5jbHVkZSBhbiBgYXN5bmNgIHByb3BlcnR5IHRvIGlkZW50aWZ5IHdoZXRoZXIgdGhlIHBpcGUncyBgaGFuZGxlYCBmdW5jdGlvbiBpcyBhc3luY2hyb25vdXMuXHJcbiAgICAgKiBAemgg5p6E6YCg5Ye95pWw77yM6YCa6L+H5LiA57O75YiX55qEIHBpcGUg5p2l5p6E6YCg5LiA5Liq5paw55qEIHBpcGVsaW5l77yMcGlwZXMg5bCG5Lya5Zyo57uZ5a6a55qE6aG65bqP5Lit6KKr6ZSB5a6a44CCPGJyLz5cclxuICAgICAqIOS4gOS4qiBwaXBlIOWwseaYr+S4gOS4quWvueixoe+8jOWug+WMheWQq+S6huWtl+espuS4suexu+Wei+eahCDigJhpZOKAmSDlkowg4oCYaGFuZGxl4oCZIOWHveaVsO+8jOWcqCBwaXBlbGluZSDkuK0gaWQg5b+F6aG75piv5ZSv5LiA55qE44CCPGJyLz5cclxuICAgICAqIOWug+i/mOWPr+S7peWMheaLrCDigJhhc3luY+KAmSDlsZ7mgKfku6Xnoa7lrprlroPmmK/lkKbmmK/kuIDkuKrlvILmraXov4fnqIvjgIJcclxuICAgICAqIEBwYXJhbSBwaXBlcyBBbGwgcGlwZXMgZm9yIGNvbnN0cnVjdGluZyB0aGUgcGlwZWxpbmVcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqICBsZXQgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUoW1xyXG4gICAgICogICAgICB7XHJcbiAgICAgKiAgICAgICAgICBpZDogJ0Rvd25sb2FkZXInLFxyXG4gICAgICogICAgICAgICAgaGFuZGxlOiBmdW5jdGlvbiAoaXRlbSwgY2FsbGJhY2spIHt9LFxyXG4gICAgICogICAgICAgICAgYXN5bmM6IHRydWVcclxuICAgICAqICAgICAgfSxcclxuICAgICAqICAgICAge2lkOiAnUGFyc2VyJywgaGFuZGxlOiBmdW5jdGlvbiAoaXRlbSkge30sIGFzeW5jOiBmYWxzZX1cclxuICAgICAqICBdKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAocGlwZXM6IElQaXBlW10pIHtcclxuICAgICAgICB0aGlzLl9waXBlcyA9IHBpcGVzO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpcGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGxldCBwaXBlID0gcGlwZXNbaV07XHJcbiAgICAgICAgICAgIC8vIE11c3QgaGF2ZSBoYW5kbGUgYW5kIGlkLCBoYW5kbGUgZm9yIGZsb3csIGlkIGZvciBzdGF0ZSBmbGFnXHJcbiAgICAgICAgICAgIGlmICghcGlwZS5oYW5kbGUgfHwgIXBpcGUuaWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwaXBlLnBpcGVsaW5lID0gdGhpcztcclxuICAgICAgICAgICAgcGlwZS5uZXh0ID0gaSA8IHBpcGVzLmxlbmd0aCAtIDEgPyBwaXBlc1tpKzFdIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5zZXJ0IGEgbmV3IHBpcGUgYXQgdGhlIGdpdmVuIGluZGV4IG9mIHRoZSBwaXBlbGluZS4gPGJyLz5cclxuICAgICAqIEEgcGlwZSBtdXN0IGNvbnRhaW4gYW4gYGlkYCBpbiBzdHJpbmcgYW5kIGEgYGhhbmRsZWAgZnVuY3Rpb24sIHRoZSBpZCBtdXN0IGJlIHVuaXF1ZSBpbiB0aGUgcGlwZWxpbmUuXHJcbiAgICAgKiBAemgg5Zyo57uZ5a6a55qE57Si5byV5L2N572u5o+S5YWl5LiA5Liq5paw55qEIHBpcGXjgII8YnIvPlxyXG4gICAgICog5LiA5LiqIHBpcGUg5b+F6aG75YyF5ZCr5LiA5Liq5a2X56ym5Liy57G75Z6L55qEIOKAmGlk4oCZIOWSjCDigJhoYW5kbGXigJkg5Ye95pWw77yM6K+lIGlkIOWcqCBwaXBlbGluZSDlv4XpobvmmK/llK/kuIDmoIfor4bjgIJcclxuICAgICAqIEBwYXJhbSBwaXBlIFRoZSBwaXBlIHRvIGJlIGluc2VydGVkXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IHRvIGluc2VydFxyXG4gICAgICovXHJcbiAgICBpbnNlcnRQaXBlIChwaXBlOiBJUGlwZSwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIC8vIE11c3QgaGF2ZSBoYW5kbGUgYW5kIGlkLCBoYW5kbGUgZm9yIGZsb3csIGlkIGZvciBzdGF0ZSBmbGFnXHJcbiAgICAgICAgaWYgKCFwaXBlLmhhbmRsZSB8fCAhcGlwZS5pZCB8fCBpbmRleCA+IHRoaXMuX3BpcGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB3YXJuSUQoNDkyMSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9waXBlcy5pbmRleE9mKHBpcGUpID4gMCkge1xyXG4gICAgICAgICAgICB3YXJuSUQoNDkyMik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBpcGUucGlwZWxpbmUgPSB0aGlzO1xyXG5cclxuICAgICAgICBsZXQgbmV4dFBpcGU6IElQaXBlfG51bGwgPSBudWxsO1xyXG4gICAgICAgIGlmIChpbmRleCA8IHRoaXMuX3BpcGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBuZXh0UGlwZSA9IHRoaXMuX3BpcGVzW2luZGV4XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwcmV2aW91c1BpcGU6IElQaXBlfG51bGwgPSBudWxsO1xyXG4gICAgICAgIGlmIChpbmRleCA+IDApIHtcclxuICAgICAgICAgICAgcHJldmlvdXNQaXBlID0gdGhpcy5fcGlwZXNbaW5kZXgtMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJldmlvdXNQaXBlKSB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzUGlwZS5uZXh0ID0gcGlwZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGlwZS5uZXh0ID0gbmV4dFBpcGU7XHJcblxyXG4gICAgICAgIHRoaXMuX3BpcGVzLnNwbGljZShpbmRleCwgMCwgcGlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5zZXJ0IGEgcGlwZSB0byB0aGUgZW5kIG9mIGFuIGV4aXN0aW5nIHBpcGUuIFRoZSBleGlzdGluZyBwaXBlIG11c3QgYmUgYSB2YWxpZCBwaXBlIGluIHRoZSBwaXBlbGluZS5cclxuICAgICAqIEB6aCDlnKjlvZPliY0gcGlwZWxpbmUg55qE5LiA5Liq5bey55+lIHBpcGUg5ZCO6Z2i5o+S5YWl5LiA5Liq5paw55qEIHBpcGXjgIJcclxuICAgICAqIEBwYXJhbSByZWZQaXBlIEFuIGV4aXN0aW5nIHBpcGUgaW4gdGhlIHBpcGVsaW5lLlxyXG4gICAgICogQHBhcmFtIG5ld1BpcGUgVGhlIHBpcGUgdG8gYmUgaW5zZXJ0ZWQuXHJcbiAgICAgKi9cclxuICAgIGluc2VydFBpcGVBZnRlciAocmVmUGlwZTogSVBpcGUsIG5ld1BpcGU6IElQaXBlKSAge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3BpcGVzLmluZGV4T2YocmVmUGlwZSk7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5zZXJ0UGlwZShuZXdQaXBlLCBpbmRleCsxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBZGQgYSBuZXcgcGlwZSBhdCB0aGUgZW5kIG9mIHRoZSBwaXBlbGluZS4gPGJyLz5cclxuICAgICAqIEEgcGlwZSBtdXN0IGNvbnRhaW4gYW4gYGlkYCBpbiBzdHJpbmcgYW5kIGEgYGhhbmRsZWAgZnVuY3Rpb24sIHRoZSBpZCBtdXN0IGJlIHVuaXF1ZSBpbiB0aGUgcGlwZWxpbmUuXHJcbiAgICAgKiBAemgg5re75Yqg5LiA5Liq5paw55qEIHBpcGUg5YiwIHBpcGVsaW5lIOWwvumDqOOAgiA8YnIvPlxyXG4gICAgICog6K+lIHBpcGUg5b+F6aG75YyF5ZCr5LiA5Liq5a2X56ym5Liy57G75Z6LIOKAmGlk4oCZIOWSjCDigJhoYW5kbGXigJkg5Ye95pWw77yM6K+lIGlkIOWcqCBwaXBlbGluZSDlv4XpobvmmK/llK/kuIDmoIfor4bjgIJcclxuICAgICAqIEBwYXJhbSBwaXBlIFRoZSBwaXBlIHRvIGJlIGFwcGVuZGVkXHJcbiAgICAgKi9cclxuICAgIGFwcGVuZFBpcGUgKHBpcGU6IElQaXBlKSB7XHJcbiAgICAgICAgLy8gTXVzdCBoYXZlIGhhbmRsZSBhbmQgaWQsIGhhbmRsZSBmb3IgZmxvdywgaWQgZm9yIHN0YXRlIGZsYWdcclxuICAgICAgICBpZiAoIXBpcGUuaGFuZGxlIHx8ICFwaXBlLmlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBpcGUucGlwZWxpbmUgPSB0aGlzO1xyXG4gICAgICAgIHBpcGUubmV4dCA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BpcGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fcGlwZXNbdGhpcy5fcGlwZXMubGVuZ3RoIC0gMV0ubmV4dCA9IHBpcGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BpcGVzLnB1c2gocGlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIExldCBuZXcgaXRlbXMgZmxvdyBpbnRvIHRoZSBwaXBlbGluZS4gPGJyLz5cclxuICAgICAqIEVhY2ggaXRlbSBjYW4gYmUgYSBzaW1wbGUgdXJsIHN0cmluZyBvciBhbiBvYmplY3QsXHJcbiAgICAgKiBpZiBpdCdzIGFuIG9iamVjdCwgaXQgbXVzdCBjb250YWluIGBpZGAgcHJvcGVydHkuIDxici8+XHJcbiAgICAgKiBZb3UgY2FuIHNwZWNpZnkgaXRzIHR5cGUgYnkgYHR5cGVgIHByb3BlcnR5LCBieSBkZWZhdWx0LCB0aGUgdHlwZSBpcyB0aGUgZXh0ZW5zaW9uIG5hbWUgaW4gdXJsLiA8YnIvPlxyXG4gICAgICogQnkgYWRkaW5nIGEgYHNraXBzYCBwcm9wZXJ0eSBpbmNsdWRpbmcgcGlwZSBpZHMsIHlvdSBjYW4gc2tpcCB0aGVzZSBwaXBlLiA8YnIvPlxyXG4gICAgICogVGhlIG9iamVjdCBjYW4gY29udGFpbiBhbnkgc3VwcGxlbWVudGFyeSBwcm9wZXJ0eSBhcyB5b3Ugd2FudC4gPGJyLz5cclxuICAgICAqIEB6aFxyXG4gICAgICog6K6p5paw55qEIGl0ZW0g5rWB5YWlIHBpcGVsaW5lIOS4reOAgjxici8+XHJcbiAgICAgKiDov5nph4znmoTmr4/kuKogaXRlbSDlj6/ku6XmmK/kuIDkuKrnroDljZXlrZfnrKbkuLLnsbvlnovnmoQgdXJsIOaIluiAheaYr+S4gOS4quWvueixoSxcclxuICAgICAqIOWmguaenOWug+aYr+S4gOS4quWvueixoeeahOivne+8jOS7luW/hemhu+imgeWMheWQqyDigJhpZOKAmSDlsZ7mgKfjgII8YnIvPlxyXG4gICAgICog5L2g5Lmf5Y+v5Lul5oyH5a6a5a6D55qEIOKAmHR5cGXigJkg5bGe5oCn57G75Z6L77yM6buY6K6k5oOF5Ya15LiL77yM6K+l57G75Z6L5pivIOKAmHVybOKAmSDnmoTlkI7nvIDlkI3jgII8YnIvPlxyXG4gICAgICog5Lmf6YCa6L+H5re75Yqg5LiA5LiqIOWMheWQqyDigJhza2lwc+KAmSDlsZ7mgKfnmoQgaXRlbSDlr7nosaHvvIzkvaDlsLHlj6/ku6Xot7Pov4cgc2tpcHMg5Lit5YyF5ZCr55qEIHBpcGXjgII8YnIvPlxyXG4gICAgICog6K+l5a+56LGh5Y+v5Lul5YyF5ZCr5Lu75L2V6ZmE5Yqg5bGe5oCn44CCXHJcbiAgICAgKiBAcGFyYW0gaXRlbXMgVGhlIHt7SUl0ZW19fSB0byBiZSBhcHBlbmRlZCB0byB0aGUgY3VycmVudCBwaXBlbGluZVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogIHBpcGVsaW5lLmZsb3dJbihbXHJcbiAgICAgKiAgICAgICdyZXMvQmFja2dyb3VuZC5wbmcnLFxyXG4gICAgICogICAgICB7XHJcbiAgICAgKiAgICAgICAgICBpZDogJ3Jlcy9zY2VuZS5qc29uJyxcclxuICAgICAqICAgICAgICAgIHR5cGU6ICdzY2VuZScsXHJcbiAgICAgKiAgICAgICAgICBuYW1lOiAnc2NlbmUnLFxyXG4gICAgICogICAgICAgICAgc2tpcHM6IFsnRG93bmxvYWRlciddXHJcbiAgICAgKiAgICAgIH1cclxuICAgICAqICBdKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBmbG93SW4gKGl0ZW1zOiBBcnJheTxJSXRlbT4pIHtcclxuICAgICAgICBsZXQgaSwgcGlwZSA9IHRoaXMuX3BpcGVzWzBdLCBpdGVtO1xyXG4gICAgICAgIGlmIChwaXBlKSB7XHJcbiAgICAgICAgICAgIC8vIENhY2hlIGFsbCBpdGVtcyBmaXJzdCwgaW4gY2FzZSBzeW5jaHJvbm91cyBsb2FkaW5nIGZsb3cgc2FtZSBpdGVtIHJlcGVhdGx5XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLmlzU2NlbmUpIHRoaXMuX2NhY2hlW2l0ZW0uaWRdID0gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIGZsb3cocGlwZSwgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG93T3V0KGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTGV0IG5ldyBpdGVtcyBmbG93IGludG8gdGhlIHBpcGVsaW5lIGFuZCBnaXZlIGEgY2FsbGJhY2sgd2hlbiB0aGUgbGlzdCBvZiBpdGVtcyBhcmUgYWxsIGNvbXBsZXRlZC4gPGJyLz5cclxuICAgICAqIFRoaXMgaXMgZm9yIGxvYWRpbmcgZGVwZW5kZW5jaWVzIGZvciBhbiBleGlzdGluZyBpdGVtIGluIGZsb3csIHVzdWFsbHkgdXNlZCBpbiBhIHBpcGUgbG9naWMuIDxici8+XHJcbiAgICAgKiBGb3IgZXhhbXBsZSwgd2UgaGF2ZSBhIGxvYWRlciBmb3Igc2NlbmUgY29uZmlndXJhdGlvbiBmaWxlIGluIEpTT04sIHRoZSBzY2VuZSB3aWxsIG9ubHkgYmUgZnVsbHkgbG9hZGVkICA8YnIvPlxyXG4gICAgICogYWZ0ZXIgYWxsIGl0cyBkZXBlbmRlbmNpZXMgYXJlIGxvYWRlZCwgdGhlbiB5b3Ugd2lsbCBuZWVkIHRvIHVzZSBmdW5jdGlvbiB0byBmbG93IGluIGFsbCBkZXBlbmRlbmNpZXMgIDxici8+XHJcbiAgICAgKiBmb3VuZCBpbiB0aGUgY29uZmlndXJhdGlvbiBmaWxlLCBhbmQgZmluaXNoIHRoZSBsb2FkZXIgcGlwZSBvbmx5IGFmdGVyIGFsbCBkZXBlbmRlbmNpZXMgYXJlIGxvYWRlZCAoaW4gdGhlIGNhbGxiYWNrKS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6K6p5pawIGl0ZW1zIOa1geWFpSBwaXBlbGluZSDlubbkuJTlvZMgaXRlbSDliJfooajlrozmiJDml7bov5vooYzlm57osIPlh73mlbDjgII8YnIvPlxyXG4gICAgICog6L+Z5LiqIEFQSSDnmoTkvb/nlKjpgJrluLjmmK/kuLrkuobliqDovb3kvp3otZbpobnjgII8YnIvPlxyXG4gICAgICog5L6L5aaC77yaPGJyLz5cclxuICAgICAqIOaIkeS7rOmcgOimgeWKoOi9veS4gOS4quWcuuaZr+mFjee9rueahCBKU09OIOaWh+S7tu+8jOivpeWcuuaZr+S8muWwhuaJgOacieeahOS+nei1lumhueWFqOmDqOmDveWKoOi9veWujOavleS7peWQju+8jOi/m+ihjOWbnuiwg+ihqOekuuWKoOi9veWujOavleOAglxyXG4gICAgICogQHBhcmFtIG93bmVyIFRoZSBvd25lciBpdGVtXHJcbiAgICAgKiBAcGFyYW0gdXJsTGlzdCBUaGUgbGlzdCBvZiB1cmxzIHRvIGJlIGFwcGVuZGVkIGFzIGRlcGVuZGVuY2llcyBvZiB0aGUgb3duZXIuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiBhbGwgZGVwZW5kZW5jaWVzIGFyZSBjb21wbGV0ZWQuXHJcbiAgICAgKiBAcmV0dXJuIEl0ZW1zIGFjY2VwdGVkIGJ5IHRoZSBwaXBlbGluZVxyXG4gICAgICovXHJcbiAgICBmbG93SW5EZXBzIChvd25lcjogSUl0ZW0sIHVybExpc3Q6IG9iamVjdFtdLCBjYWxsYmFjazogRnVuY3Rpb24pOiBJSXRlbVtdIHtcclxuICAgICAgICBsZXQgZGVwcyA9IExvYWRpbmdJdGVtcy5jcmVhdGUodGhpcywgZnVuY3Rpb24gKGVycm9ycywgaXRlbXMpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3JzLCBpdGVtcyk7XHJcbiAgICAgICAgICAgIGl0ZW1zLmRlc3Ryb3koKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZGVwcy5hcHBlbmQodXJsTGlzdCwgb3duZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoaXMgZnVuY3Rpb24gaXMgaW52b2tlZCB3aGVuIGFuIGl0ZW0gaGFzIGNvbXBsZXRlZCBhbGwgcGlwZXMsIGl0IHdpbGwgZmxvdyBvdXQgb2YgdGhlIHBpcGVsaW5lLlxyXG4gICAgICogQHpoIOi/meS4quWHveaVsOS8muWcqCBgaXRlbWAg5a6M5oiQ5LqG5omA5pyJ566h6YGT77yM5a6D5Lya6KKr5qCH6K6w5Li6IGBjb21wbGV0ZWAg5bm25rWB5Ye6566h57q/44CCXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgaXRlbSB3aGljaCBpcyBjb21wbGV0ZWRcclxuICAgICAqL1xyXG4gICAgZmxvd091dCAoaXRlbTogSUl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbS5lcnJvcikge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY2FjaGVbaXRlbS5pZF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKCF0aGlzLl9jYWNoZVtpdGVtLmlkXSAmJiAhaXRlbS5pc1NjZW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlW2l0ZW0uaWRdID0gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlbS5jb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgTG9hZGluZ0l0ZW1zLml0ZW1Db21wbGV0ZShpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ29weSB0aGUgaXRlbSBzdGF0ZXMgZnJvbSBvbmUgc291cmNlIGl0ZW0gdG8gYWxsIGRlc3RpbmF0aW9uIGl0ZW1zLiA8YnIvPlxyXG4gICAgICogSXQncyBxdWl0ZSB1c2VmdWwgd2hlbiBhIHBpcGUgZ2VuZXJhdGUgbmV3IGl0ZW1zIGZyb20gb25lIHNvdXJjZSBpdGVtLDxici8+XHJcbiAgICAgKiB0aGVuIHlvdSBzaG91bGQgZmxvd0luIHRoZXNlIGdlbmVyYXRlZCBpdGVtcyBpbnRvIHBpcGVsaW5lLCA8YnIvPlxyXG4gICAgICogYnV0IHlvdSBwcm9iYWJseSB3YW50IHRoZW0gdG8gc2tpcCBhbGwgcGlwZXMgdGhlIHNvdXJjZSBpdGVtIGFscmVhZHkgZ28gdGhyb3VnaCw8YnIvPlxyXG4gICAgICogeW91IGNhbiBhY2hpZXZlIGl0IHdpdGggdGhpcyBBUEkuIDxici8+XHJcbiAgICAgKiA8YnIvPlxyXG4gICAgICogRm9yIGV4YW1wbGUsIGFuIHVuemlwIHBpcGUgd2lsbCBnZW5lcmF0ZSBtb3JlIGl0ZW1zLCBidXQgeW91IHdvbid0IHdhbnQgdGhlbSB0byBwYXNzIHVuemlwIG9yIGRvd25sb2FkIHBpcGUgYWdhaW4uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS7juS4gOS4qua6kCBpdGVtIOWQkeaJgOacieebruaghyBpdGVtIOWkjeWItuWug+eahCBwaXBlIOeKtuaAge+8jOeUqOS6jumBv+WFjemHjeWkjemAmui/h+mDqOWIhiBwaXBl44CCPGJyLz5cclxuICAgICAqIOW9k+S4gOS4qua6kCBpdGVtIOeUn+aIkOS6huS4gOezu+WIl+aWsOeahCBpdGVtcyDml7blvojmnInnlKjvvIw8YnIvPlxyXG4gICAgICog5L2g5biM5pyb6K6p6L+Z5Lqb5paw55qE5L6d6LWW6aG56L+b5YWlIHBpcGVsaW5l77yM5L2G5piv5Y+I5LiN5biM5pyb5a6D5Lus6YCa6L+H5rqQIGl0ZW0g5bey57uP57uP6L+H55qEIHBpcGXvvIw8YnIvPlxyXG4gICAgICog5L2G5piv5L2g5Y+v6IO95biM5pyb5LuW5Lus5rqQIGl0ZW0g5bey57uP6YCa6L+H5bm26Lez6L+H5omA5pyJIHBpcGVz77yMPGJyLz5cclxuICAgICAqIOi/meS4quaXtuWAmeWwseWPr+S7peS9v+eUqOi/meS4qiBBUEnjgIJcclxuICAgICAqIEBwYXJhbSBzcmNJdGVtIFRoZSBzb3VyY2UgaXRlbVxyXG4gICAgICogQHBhcmFtIGRzdEl0ZW1zIEEgc2luZ2xlIGRlc3RpbmF0aW9uIGl0ZW0gb3IgYW4gYXJyYXkgb2YgZGVzdGluYXRpb24gaXRlbXNcclxuICAgICAqL1xyXG4gICAgY29weUl0ZW1TdGF0ZXMgKHNyY0l0ZW06IElJdGVtLCBkc3RJdGVtczogSUl0ZW18QXJyYXk8SUl0ZW0+KSB7XHJcbiAgICAgICAgaWYgKCEoZHN0SXRlbXMgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuICAgICAgICAgICAgZHN0SXRlbXMuc3RhdGVzID0gc3JjSXRlbS5zdGF0ZXM7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkc3RJdGVtcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBkc3RJdGVtc1tpXS5zdGF0ZXMgPSBzcmNJdGVtLnN0YXRlcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBhbiBpdGVtIGluIHBpcGVsaW5lLlxyXG4gICAgICogQHpoIOagueaNriBpZCDojrflj5bkuIDkuKogaXRlbVxyXG4gICAgICogQHBhcmFtIGlkIFRoZSBpZCBvZiB0aGUgaXRlbVxyXG4gICAgICovXHJcbiAgICBnZXRJdGVtIChpZDogc3RyaW5nKTogSUl0ZW18bnVsbCB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jYWNoZVtpZF07XHJcblxyXG4gICAgICAgIGlmICghaXRlbSlcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcblxyXG4gICAgICAgIC8vIGRvd25sb2FkZXIuanMgZG93bmxvYWRVdWlkXHJcbiAgICAgICAgaWYgKGl0ZW0uYWxpYXMpXHJcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLmFsaWFzO1xyXG5cclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZW1vdmVzIGFuIGNvbXBsZXRlZCBpdGVtIGluIHBpcGVsaW5lLlxyXG4gICAgICogSXQgd2lsbCBvbmx5IHJlbW92ZSB0aGUgY2FjaGUgaW4gdGhlIHBpcGVsaW5lIG9yIGxvYWRlciwgaXRzIGRlcGVuZGVuY2llcyB3b24ndCBiZSByZWxlYXNlZC5cclxuICAgICAqIGBsb2FkZXJgIHByb3ZpZGVkIGFub3RoZXIgbWV0aG9kIHRvIGNvbXBsZXRlbHkgY2xlYW51cCB0aGUgcmVzb3VyY2UgYW5kIGl0cyBkZXBlbmRlbmNpZXMsXHJcbiAgICAgKiBwbGVhc2UgcmVmZXIgdG8ge3tMb2FkZXIucmVsZWFzZX19XHJcbiAgICAgKiBAemgg56e76Zmk5oyH5a6a55qE5bey5a6M5oiQIGl0ZW3jgIJcclxuICAgICAqIOi/meWwhuS7heS7heS7jiBwaXBlbGluZSDmiJbogIUgbG9hZGVyIOS4reWIoOmZpOWFtue8k+WtmO+8jOW5tuS4jeS8mumHiuaUvuWug+aJgOS+nei1lueahOi1hOa6kOOAglxyXG4gICAgICogYGxvYWRlcmAg5Lit5o+Q5L6b5LqG5Y+m5LiA56eN5Yig6Zmk6LWE5rqQ5Y+K5YW25L6d6LWW55qE5riF55CG5pa55rOV77yM6K+35Y+C6ICDIHt7TG9hZGVyLnJlbGVhc2V9fVxyXG4gICAgICogQHBhcmFtIGlkIFRoZSBpZCBvZiB0aGUgaXRlbVxyXG4gICAgICogQHJldHVybiBzdWNjZWVkIG9yIG5vdFxyXG4gICAgICovXHJcbiAgICByZW1vdmVJdGVtIChpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHJlbW92ZWQgPSB0aGlzLl9jYWNoZVtpZF07XHJcbiAgICAgICAgaWYgKHJlbW92ZWQgJiYgcmVtb3ZlZC5jb21wbGV0ZSkge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY2FjaGVbaWRdO1xyXG4gICAgICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVmZXJlbmNlcyA9IHJlbW92ZWQucmVmZXJlbmNlcztcclxuICAgICAgICAgICAgICAgIGlmIChyZWZlcmVuY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlcGVuZExpc3RlbmVyID0gbGVnYWN5Q0MuQXNzZXRMaWJyYXJ5LmRlcGVuZExpc3RlbmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXBlbmRMaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB1dWlkIGluIHJlZmVyZW5jZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZExpc3RlbmVyLm9mZih1dWlkLCByZWZlcmVuY2VzW3V1aWRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkLnJlZmVyZW5jZXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZW1vdmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENsZWFyIHRoZSBjdXJyZW50IHBpcGVsaW5lLCB0aGlzIGZ1bmN0aW9uIHdpbGwgY2xlYW4gdXAgdGhlIGl0ZW1zLlxyXG4gICAgICogQHpoIOa4heepuuW9k+WJjSBwaXBlbGluZe+8jOivpeWHveaVsOWwhua4heeQhiBpdGVtc+OAglxyXG4gICAgICovXHJcbiAgICBjbGVhciAoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5fY2FjaGUpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jYWNoZVtpZF07XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jYWNoZVtpZF07XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5jb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5lcnJvciA9IG5ldyBFcnJvcignQ2FuY2VsZWQgbWFudWFsbHknKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd091dChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuUGlwZWxpbmUgPSBQaXBlbGluZTtcclxuIl19