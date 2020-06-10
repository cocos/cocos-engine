/*
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
 */

/**
 * @category loader
 */

import {createMap} from '../utils/js';
import { LoadingItems, IItem } from './loading-items';
import { EDITOR } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { warnID } from '../platform/debug';
const ItemState = LoadingItems.ItemState;

export interface IPipe {
    id: string;
    async: boolean;
    handle (item: IItem, callback);
    next?: IPipe|null;
    pipeline?: Pipeline|null;
}

function flow (pipe, item) {
    let pipeId = pipe.id;
    let itemState = item.states[pipeId];
    let next = pipe.next;
    let pipeline = pipe.pipeline;

    if (item.error || itemState === ItemState.WORKING || itemState === ItemState.ERROR) {
        return;
    }
    else if (itemState === ItemState.COMPLETE) {
        if (next) {
            flow(next, item);
        }
        else {
            pipeline.flowOut(item);
        }
    }
    else {
        item.states[pipeId] = ItemState.WORKING;
        // Pass async callback in case it's a async call
        let result = pipe.handle(item, function (err, result) {
            if (err) {
                item.error = err;
                item.states[pipeId] = ItemState.ERROR;
                pipeline.flowOut(item);
            }
            else {
                // Result can be null, then it means no result for this pipe
                if (result) {
                    item.content = result;
                }
                item.states[pipeId] = ItemState.COMPLETE;
                if (next) {
                    flow(next, item);
                }
                else {
                    pipeline.flowOut(item);
                }
            }
        });
        // If result exists (not undefined, null is ok), then we go with sync call flow
        if (result instanceof Error) {
            item.error = result;
            item.states[pipeId] = ItemState.ERROR;
            pipeline.flowOut(item);
        }
        else if (result !== undefined) {
            // Result can be null, then it means no result for this pipe
            if (result !== null) {
                item.content = result;
            }
            item.states[pipeId] = ItemState.COMPLETE;
            if (next) {
                flow(next, item);
            }
            else {
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
export class Pipeline {
    /**
     * @en The item states of the LoadingItems, its value could be {{ItemState.WORKING}} | {{ItemState.COMPLETE}} | {{ItemState.ERROR}}
     * @zh LoadingItems 队列中的加载项状态，状态的值可能是 {{ItemState.WORKING}} | {{ItemState.COMPLETE}} | {{ItemState.ERROR}}
     */
    static ItemState = ItemState;

    protected _pipes: Array<IPipe>;
    public _cache = createMap(true);

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
    constructor (pipes: IPipe[]) {
        this._pipes = pipes;

        for (let i = 0; i < pipes.length; ++i) {
            let pipe = pipes[i];
            // Must have handle and id, handle for flow, id for state flag
            if (!pipe.handle || !pipe.id) {
                continue;
            }

            pipe.pipeline = this;
            pipe.next = i < pipes.length - 1 ? pipes[i+1] : null;
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
    insertPipe (pipe: IPipe, index: number) {
        // Must have handle and id, handle for flow, id for state flag
        if (!pipe.handle || !pipe.id || index > this._pipes.length) {
            warnID(4921);
            return;
        }

        if (this._pipes.indexOf(pipe) > 0) {
            warnID(4922);
            return;
        }

        pipe.pipeline = this;

        let nextPipe: IPipe|null = null;
        if (index < this._pipes.length) {
            nextPipe = this._pipes[index];
        }

        let previousPipe: IPipe|null = null;
        if (index > 0) {
            previousPipe = this._pipes[index-1];
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
    insertPipeAfter (refPipe: IPipe, newPipe: IPipe)  {
        let index = this._pipes.indexOf(refPipe);
        if (index < 0) {
            return;
        }
        this.insertPipe(newPipe, index+1);
    }

    /**
     * @en Add a new pipe at the end of the pipeline. <br/>
     * A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
     * @zh 添加一个新的 pipe 到 pipeline 尾部。 <br/>
     * 该 pipe 必须包含一个字符串类型 ‘id’ 和 ‘handle’ 函数，该 id 在 pipeline 必须是唯一标识。
     * @param pipe The pipe to be appended
     */
    appendPipe (pipe: IPipe) {
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
    flowIn (items: Array<IItem>) {
        let i, pipe = this._pipes[0], item;
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
        }
        else {
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
    flowInDeps (owner: IItem, urlList: object[], callback: Function): IItem[] {
        let deps = LoadingItems.create(this, function (errors, items) {
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
    flowOut (item: IItem) {
        if (item.error) {
            delete this._cache[item.id];
        }
        else if (!this._cache[item.id] && !item.isScene) {
            this._cache[item.id] = item;
        }
        item.complete = true;
        LoadingItems.itemComplete(item);
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
    copyItemStates (srcItem: IItem, dstItems: IItem|Array<IItem>) {
        if (!(dstItems instanceof Array)) {
            dstItems.states = srcItem.states;
            return;
        }
        for (let i = 0; i < dstItems.length; ++i) {
            dstItems[i].states = srcItem.states;
        }
    }

    /**
     * @en Returns an item in pipeline.
     * @zh 根据 id 获取一个 item
     * @param id The id of the item
     */
    getItem (id: string): IItem|null {
        let item = this._cache[id];

        if (!item)
            return item;

        // downloader.js downloadUuid
        if (item.alias)
            item = item.alias;

        return item;
    }

    /**
     * @en Removes an completed item in pipeline.
     * It will only remove the cache in the pipeline or loader, its dependencies won't be released.
     * cc.loader provided another method to completely cleanup the resource and its dependencies,
     * please refer to {{Loader.release}}
     * @zh 移除指定的已完成 item。
     * 这将仅仅从 pipeline 或者 loader 中删除其缓存，并不会释放它所依赖的资源。
     * cc.loader 中提供了另一种删除资源及其依赖的清理方法，请参考 {{Loader.release}}
     * @param id The id of the item
     * @return succeed or not
     */
    removeItem (id: string): boolean {
        let removed = this._cache[id];
        if (removed && removed.complete) {
            delete this._cache[id];
            if (EDITOR) {
                let references = removed.references;
                if (references) {
                    let dependListener = legacyCC.AssetLibrary.dependListener;
                    if (dependListener) {
                        for (let uuid in references) {
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
    clear () {
        for (let id in this._cache) {
            let item = this._cache[id];
            delete this._cache[id];
            if (!item.complete) {
                item.error = new Error('Canceled manually');
                this.flowOut(item);
            }
        }
    }
}

legacyCC.Pipeline = Pipeline;
