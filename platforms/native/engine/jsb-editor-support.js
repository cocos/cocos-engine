/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

// @ts-expect-error jsb polyfills
(function () {
    if (!globalThis.middleware) return;
    const middleware = globalThis.middleware;
    const middlewareMgr = middleware.MiddlewareManager.getInstance();
    let reference = 0;
    const director = cc.director;
    const game = cc.game;

    middleware.reset = function () {
        middleware.preRenderComponent = null;
        middleware.preRenderBufferIndex = 0;
        middleware.indicesStart = 0;
        middleware.resetIndicesStart = false;
    };
    middleware.reset();
    middleware.retain = function () {
        reference++;
    };
    middleware.release = function () {
        if (reference === 0) {
            cc.warn('middleware reference error: reference count should be greater than 0');
            return;
        }
        reference--;
    };

    director.on(cc.Director.EVENT_BEFORE_UPDATE, () => {
        if (reference === 0) return;
        middlewareMgr.update(game.deltaTime);
    });

    director.on(cc.Director.EVENT_BEFORE_DRAW, () => {
        if (reference === 0) return;
        middlewareMgr.render(game.deltaTime);

        // reset render order
        middleware.reset();

        //const batcher2D = director.root.batcher2D;
        if (globalThis.dragonBones) {
            const armaSystem = cc.internal.ArmatureSystem.getInstance();
            armaSystem.prepareRenderData();
        }
        if (globalThis.spine) {
            const skeletonSystem = cc.internal.SpineSkeletonSystem.getInstance();
            skeletonSystem.prepareRenderData();
        }
    });

    const attachInfoMgr = middlewareMgr.getAttachInfoMgr();
    attachInfoMgr.attachInfo = attachInfoMgr.getSharedBuffer();
    attachInfoMgr.setResizeCallback(function () {
        this.attachInfo = this.getSharedBuffer();
    });
    middleware.attachInfoMgr = attachInfoMgr;

    // generate get set function
    middleware.generateGetSet = function (moduleObj) {
        for (const classKey in moduleObj) {
            const classProto = moduleObj[classKey] && moduleObj[classKey].prototype;
            if (!classProto) continue;
            for (const getName in classProto) {
                const getPos = getName.search(/^get/);
                if (getPos === -1) continue;
                let propName = getName.replace(/^get/, '');
                const nameArr = propName.split('');
                const lowerFirst = nameArr[0].toLowerCase();
                const upperFirst = nameArr[0].toUpperCase();
                nameArr.splice(0, 1);
                const left = nameArr.join('');
                propName = lowerFirst + left;
                const setName = `set${upperFirst}${left}`;
                // eslint-disable-next-line no-prototype-builtins
                if (classProto.hasOwnProperty(propName)) continue;
                const setFunc = classProto[setName];
                const hasSetFunc = typeof setFunc === 'function';
                if (hasSetFunc) {
                    Object.defineProperty(classProto, propName, {
                        get () {
                            return this[getName]();
                        },
                        set (val) {
                            this[setName](val);
                        },
                        configurable: true,
                    });
                } else {
                    Object.defineProperty(classProto, propName, {
                        get () {
                            return this[getName]();
                        },
                        configurable: true,
                    });
                }
            }
        }
    };
}());
