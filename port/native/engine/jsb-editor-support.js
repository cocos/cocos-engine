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
(function(){
    if (window.middleware === undefined) return;

    let middlewareMgr = middleware.MiddlewareManager.getInstance();
    let director = cc.director;

    middleware.renderOrder = 0;
    middleware.vfmtPosUvColor = 9;
    middleware.vfmtPosUvTwoColor = 13;
    director.on(cc.Director.EVENT_BEFORE_DRAW,function(){
        middlewareMgr.update(director._deltaTime);
        middlewareMgr.render(director._deltaTime);
        // reset render order
        middleware.renderOrder = 0;
    })

    let renderInfoMgr = middlewareMgr.getRenderInfoMgr();
    renderInfoMgr.renderInfo = renderInfoMgr.getSharedBuffer();
    renderInfoMgr.setResizeCallback(function() {
        this.attachInfo = this.getSharedBuffer();
    });
    renderInfoMgr.__middleware__ = middleware;

    let attachInfoMgr = middlewareMgr.getAttachInfoMgr();
    attachInfoMgr.attachInfo = attachInfoMgr.getSharedBuffer();
    attachInfoMgr.setResizeCallback(function() {
        this.attachInfo = this.getSharedBuffer();
    });

    middleware.renderInfoMgr = renderInfoMgr;
    middleware.attachInfoMgr = attachInfoMgr;

    // generate get set function
    middleware.generateGetSet = function (moduleObj) {
        for (let classKey in moduleObj) {
            let classProto = moduleObj[classKey] && moduleObj[classKey].prototype;
            if (!classProto) continue;
            for (let getName in classProto) {
                let getPos = getName.search(/^get/);
                if (getPos == -1) continue;
                let propName = getName.replace(/^get/, '');
                let nameArr = propName.split('');
                let lowerFirst = nameArr[0].toLowerCase();
                let upperFirst = nameArr[0].toUpperCase();
                nameArr.splice(0, 1);
                let left = nameArr.join('');
                propName = lowerFirst + left;
                let setName = 'set' + upperFirst + left;
                if (classProto.hasOwnProperty(propName)) continue;
                let setFunc = classProto[setName];
                let hasSetFunc = typeof setFunc === 'function';
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
})();
