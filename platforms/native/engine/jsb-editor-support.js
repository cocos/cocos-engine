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
    if (!window.middleware) return;

    const middlewareMgr = middleware.MiddlewareManager.getInstance();
    let reference = 0;
    const director = cc.director;
    const game = cc.game;

    const nativeXYZUVC = middleware.vfmtPosUvColor = 9;
    const nativeXYZUVCC = middleware.vfmtPosUvTwoColor = 13;

    const vfmtPosUvColor = cc.internal.vfmtPosUvColor;
    const vfmtPosUvTwoColor = cc.internal.vfmtPosUvTwoColor;

    const renderInfoLookup = middleware.RenderInfoLookup = {};
    renderInfoLookup[nativeXYZUVC] = [];
    renderInfoLookup[nativeXYZUVCC] = [];

    middleware.reset = function () {
        middleware.preRenderComponent = null;
        middleware.preRenderBufferIndex = 0;
        middleware.preRenderBufferType = nativeXYZUVC;
        middleware.renderOrder = 0;
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
        if (reference === 0) {
            const uvcBuffers = renderInfoLookup[nativeXYZUVC];
            for (let i = 0; i < uvcBuffers.length; i++) {
                cc.UI.MeshRenderData.remove(uvcBuffers[i]);
            }
            uvcBuffers.length = 0;
            const uvccBuffers = renderInfoLookup[nativeXYZUVCC];
            for (let i = 0; i < uvccBuffers.length; i++) {
                cc.UI.MeshRenderData.remove(uvccBuffers[i]);
            }
            uvccBuffers.length = 0;
        }
    };

    function CopyNativeBufferToJS (renderer, nativeFormat, jsFormat) {
        if (!renderer) return;

        const bufferCount = middlewareMgr.getBufferCount(nativeFormat);
        for (let i = 0; i < bufferCount; i++) {
            const ibBytesLength = middlewareMgr.getIBTypedArrayLength(nativeFormat, i);
            const srcVertexCount = 65535;
            const srcIndicesCount = ibBytesLength / 2; // USHORT
            const srcVertexFloatCount = srcVertexCount * nativeFormat;

            let buffer = renderInfoLookup[nativeFormat][i];
            if (!buffer)  {
                buffer = cc.UI.MeshRenderData.add(jsFormat);
            }
            buffer.reset();
            buffer.request(srcVertexCount, srcIndicesCount);

            const vBuf = buffer.vData;
            const iBuf = buffer.iData;

            const srcVBuf = middlewareMgr.getVBTypedArray(nativeFormat, i);
            const srcIBuf = middlewareMgr.getIBTypedArray(nativeFormat, i);

            vBuf.set(srcVBuf.subarray(0, srcVertexFloatCount), 0);
            iBuf.set(srcIBuf.subarray(0, srcIndicesCount), 0);

            // forbid js upload data, call by middleware
            // buffer.uploadBuffers();

            // forbid auto merge, because of it's meaningless
            renderInfoLookup[nativeFormat][i] = buffer;
        }
    }

    director.on(cc.Director.EVENT_BEFORE_UPDATE, () => {
        if (reference === 0) return;
        middlewareMgr.update(game.deltaTime);
    });

    director.on(cc.Director.EVENT_BEFORE_DRAW, () => {
        if (reference === 0) return;
        middlewareMgr.render(game.deltaTime);

        // reset render order
        middleware.reset();

        const batcher2D = director.root.batcher2D;
        CopyNativeBufferToJS(batcher2D, nativeXYZUVC, vfmtPosUvColor);
        CopyNativeBufferToJS(batcher2D, nativeXYZUVCC, vfmtPosUvTwoColor);
    });

    const renderInfoMgr = middlewareMgr.getRenderInfoMgr();
    renderInfoMgr.renderInfo = renderInfoMgr.getSharedBuffer();
    renderInfoMgr.setResizeCallback(function () {
        this.attachInfo = this.getSharedBuffer();
    });
    renderInfoMgr.__middleware__ = middleware;

    const attachInfoMgr = middlewareMgr.getAttachInfoMgr();
    attachInfoMgr.attachInfo = attachInfoMgr.getSharedBuffer();
    attachInfoMgr.setResizeCallback(function () {
        this.attachInfo = this.getSharedBuffer();
    });

    middleware.renderInfoMgr = renderInfoMgr;
    middleware.attachInfoMgr = attachInfoMgr;

    // generate get set function
    middleware.generateGetSet = function (moduleObj) {
        for (const classKey in moduleObj) {
            const classProto = moduleObj[classKey] && moduleObj[classKey].prototype;
            if (!classProto) continue;
            for (const getName in classProto) {
                const getPos = getName.search(/^get/);
                if (getPos == -1) continue;
                let propName = getName.replace(/^get/, '');
                const nameArr = propName.split('');
                const lowerFirst = nameArr[0].toLowerCase();
                const upperFirst = nameArr[0].toUpperCase();
                nameArr.splice(0, 1);
                const left = nameArr.join('');
                propName = lowerFirst + left;
                const setName = `set${upperFirst}${left}`;
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
