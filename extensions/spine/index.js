/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

/**
 * !#en
 * The global main namespace of Spine, all classes, functions,
 * properties and constants of Spine are defined in this namespace
 * !#zh
 * Spine 的全局的命名空间，
 * 与 Spine 相关的所有的类，函数，属性，常量都在这个命名空间中定义。
 * @module sp
 * @main sp
 */

/*
 * Reference:
 * http://esotericsoftware.com/spine-runtime-terminology
 * http://esotericsoftware.com/files/runtime-diagram.png
 * http://en.esotericsoftware.com/spine-using-runtimes
 */

var _global = typeof window === 'undefined' ? global : window;
var _isUseSpine = true;

if (CC_NATIVERENDERER && _global.spine === undefined) {
    _isUseSpine = false;
}

if (_isUseSpine) {
    _global.sp = {};

    /**
     * !#en
     * The global time scale of Spine.
     * !#zh
     * Spine 全局时间缩放率。
     * @example
     * sp.timeScale = 0.8;
     */
    sp._timeScale = 1.0;
    Object.defineProperty(sp, 'timeScale', {
        get () {
            return this._timeScale;
        },
        set (value) {
            this._timeScale = value;
        },
        configurable: true,
    });

    // The attachment type of spine. It contains three type: REGION(0), BOUNDING_BOX(1), MESH(2) and SKINNED_MESH.
    sp.ATTACHMENT_TYPE = {
        REGION: 0,
        BOUNDING_BOX: 1,
        MESH: 2,
        SKINNED_MESH:3
    };

    /**
     * !#en The event type of spine skeleton animation.
     * !#zh 骨骼动画事件类型。
     * @enum AnimationEventType
     */
    sp.AnimationEventType = cc.Enum({
        /**
         * !#en The play spine skeleton animation start type.
         * !#zh 开始播放骨骼动画。
         * @property {Number} START
         */
        START: 0,
        /**
         * !#en Another entry has replaced this entry as the current entry. This entry may continue being applied for mixing.
         * !#zh 当前的 entry 被其他的 entry 替换。当使用 mixing 时，当前的 entry 会继续运行。
         */
        INTERRUPT: 1,
        /**
         * !#en The play spine skeleton animation finish type.
         * !#zh 播放骨骼动画结束。
         * @property {Number} END
         */
        END: 2,
        /**
         * !#en The entry will be disposed.
         * !#zh entry 将被销毁。
         */
        DISPOSE: 3,
        /**
         * !#en The play spine skeleton animation complete type.
         * !#zh 播放骨骼动画完成。
         * @property {Number} COMPLETE
         */
        COMPLETE: 4,
        /**
         * !#en The spine skeleton animation event type.
         * !#zh 骨骼动画事件。
         * @property {Number} EVENT
         */
        EVENT: 5
    });

    /**
     * @module sp
     */
    if (!CC_EDITOR || !Editor.isMainProcess) {
        
        if (CC_NATIVERENDERER) {
            sp.spine = _global.spine;
        } else {
            sp.spine = require('./lib/spine');
            require('./skeleton-texture');
        }

        require('./skeleton-data');
        require('./vertex-effect-delegate');
        require('./Skeleton');
        require('./spine-assembler');
    }
    else {
        require('./skeleton-data');
    }
}

/**
 * !#en
 * `sp.spine` is the namespace for official Spine Runtime, which officially implemented and maintained by Spine.<br>
 * Please refer to the official documentation for its detailed usage: [http://en.esotericsoftware.com/spine-using-runtimes](http://en.esotericsoftware.com/spine-using-runtimes)
 * !#zh
 * sp.spine 模块是 Spine 官方运行库的 API 入口，由 Spine 官方统一实现和维护，具体用法请参考：[http://zh.esotericsoftware.com/spine-using-runtimes](http://zh.esotericsoftware.com/spine-using-runtimes)
 * @module sp.spine
 * @main sp.spine
 */
