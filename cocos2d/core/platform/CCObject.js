/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

var js = require('./js');
var CCClass = require('./CCClass');

// definitions for CCObject.Flags

var Destroyed = 1 << 0;
var RealDestroyed = 1 << 1;
var ToDestroy = 1 << 2;
var DontSave = 1 << 3;
var EditorOnly = 1 << 4;
var Dirty = 1 << 5;
var DontDestroy = 1 << 6;
var Destroying = 1 << 7;
var Deactivating = 1 << 8;
var LockedInEditor = 1 << 9;
//var HideInGame = 1 << 9;
var HideInHierarchy = 1 << 10;

var IsOnEnableCalled = 1 << 11;
var IsEditorOnEnableCalled = 1 << 12;
var IsPreloadStarted = 1 << 13;
var IsOnLoadCalled = 1 << 14;
var IsOnLoadStarted = 1 << 15;
var IsStartCalled = 1 << 16;

var IsRotationLocked = 1 << 17;
var IsScaleLocked = 1 << 18;
var IsAnchorLocked = 1 << 19;
var IsSizeLocked = 1 << 20;
var IsPositionLocked = 1 << 21;

//var Hide = HideInGame | HideInHierarchy;
// should not clone or serialize these flags
var PersistentMask = ~(ToDestroy | Dirty | Destroying | DontDestroy | Deactivating |
                       IsPreloadStarted | IsOnLoadStarted | IsOnLoadCalled | IsStartCalled |
                       IsOnEnableCalled | IsEditorOnEnableCalled |
                       IsRotationLocked | IsScaleLocked | IsAnchorLocked | IsSizeLocked | IsPositionLocked
                       /*RegisteredInEditor*/);

/**
 * The base class of most of all the objects in Fireball.
 * @class Object
 *
 * @main
 * @private
 */
function CCObject () {
    /**
     * @property {String} _name
     * @default ""
     * @private
     */
    this._name = '';

    /**
     * @property {Number} _objFlags
     * @default 0
     * @private
     */
    this._objFlags = 0;
}
CCClass.fastDefine('cc.Object', CCObject, { _name: '', _objFlags: 0 });

/**
 * Bit mask that controls object states.
 * @enum Flags
 * @static
 * @private
 */
js.value(CCObject, 'Flags', {

    Destroyed,
    //ToDestroy: ToDestroy,

    /**
     * !#en The object will not be saved.
     * !#zh 该对象将不会被保存。
     * @property {Number} DontSave
     */
    DontSave,

    /**
     * !#en The object will not be saved when building a player.
     * !#zh 构建项目时，该对象将不会被保存。
     * @property {Number} EditorOnly
     */
    EditorOnly,

    Dirty,

    /**
     * !#en Dont destroy automatically when loading a new scene.
     * !#zh 加载一个新场景时，不自动删除该对象。
     * @property DontDestroy
     * @private
     */
    DontDestroy,

    PersistentMask,

    // FLAGS FOR ENGINE

    Destroying,

    /**
     * !#en The node is deactivating.
     * !#zh 节点正在反激活的过程中。
     * @property Deactivating
     * @private
     */
    Deactivating,

    /**
     * !#en The lock node, when the node is locked, cannot be clicked in the scene.
     * !#zh 锁定节点，锁定后场景内不能点击。
     * 
     * @property LockedInEditor
     * @private
     */
    LockedInEditor,

    ///**
    // * !#en
    // * Hide in game and hierarchy.
    // * This flag is readonly, it can only be used as an argument of scene.addEntity() or Entity.createWithFlags().
    // * !#zh
    // * 在游戏和层级中隐藏该对象。<br/>
    // * 该标记只读，它只能被用作 scene.addEntity()的一个参数。
    // * @property {Number} HideInGame
    // */
    //HideInGame: HideInGame,

    // FLAGS FOR EDITOR

    /**
     * !#en Hide the object in editor.
     * !#zh 在编辑器中隐藏该对象。
     * @property {Number} HideInHierarchy
     */
    HideInHierarchy: HideInHierarchy,

    ///**
    // * !#en
    // * Hide in game view, hierarchy, and scene view... etc.
    // * This flag is readonly, it can only be used as an argument of scene.addEntity() or Entity.createWithFlags().
    // * !#zh
    // * 在游戏视图，层级，场景视图等等...中隐藏该对象。
    // * 该标记只读，它只能被用作 scene.addEntity()的一个参数。
    // * @property {Number} Hide
    // */
    //Hide: Hide,

    // FLAGS FOR COMPONENT

    IsPreloadStarted,
    IsOnLoadStarted,
    IsOnLoadCalled,
    IsOnEnableCalled,
    IsStartCalled,
    IsEditorOnEnableCalled,

    IsPositionLocked,
    IsRotationLocked,
    IsScaleLocked,
    IsAnchorLocked,
    IsSizeLocked,
});

var objectsToDestroy = [];

function deferredDestroy () {
    var deleteCount = objectsToDestroy.length;
    for (var i = 0; i < deleteCount; ++i) {
        var obj = objectsToDestroy[i];
        if (!(obj._objFlags & Destroyed)) {
            obj._destroyImmediate();
        }
    }
    // if we called b.destory() in a.onDestroy(), objectsToDestroy will be resized,
    // but we only destroy the objects which called destory in this frame.
    if (deleteCount === objectsToDestroy.length) {
        objectsToDestroy.length = 0;
    }
    else {
        objectsToDestroy.splice(0, deleteCount);
    }

    if (CC_EDITOR) {
        deferredDestroyTimer = null;
    }
}

js.value(CCObject, '_deferredDestroy', deferredDestroy);

if (CC_EDITOR) {
    js.value(CCObject, '_clearDeferredDestroyTimer', function () {
        if (deferredDestroyTimer !== null) {
            clearImmediate(deferredDestroyTimer);
            deferredDestroyTimer = null;
        }
    });
}

// MEMBER

/**
 * @class Object
 */

var prototype = CCObject.prototype;

/**
 * !#en The name of the object.
 * !#zh 该对象的名称。
 * @property {String} name
 * @default ""
 * @example
 * obj.name = "New Obj";
 */
js.getset(prototype, 'name',
    function () {
        return this._name;
    },
    function (value) {
        this._name = value;
    },
    true
);

/**
 * !#en
 * Indicates whether the object is not yet destroyed. (It will not be available after being destroyed)<br>
 * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
 * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
 * If you want to determine whether the current frame has called `destroy`, use `cc.isValid(obj, true)`,
 * but this is often caused by a particular logical requirements, which is not normally required.
 *
 * !#zh
 * 表示该对象是否可用（被 destroy 后将不可用）。<br>
 * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。如果希望判断当前帧是否调用过 `destroy`，请使用 `cc.isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
 *
 * @property {Boolean} isValid
 * @default true
 * @readOnly
 * @example
 * var node = new cc.Node();
 * cc.log(node.isValid);    // true
 * node.destroy();
 * cc.log(node.isValid);    // true, still valid in this frame
 * // after a frame...
 * cc.log(node.isValid);    // false, destroyed in the end of last frame
 */
js.get(prototype, 'isValid', function () {
    return !(this._objFlags & Destroyed);
}, true);

if (CC_EDITOR || CC_TEST) {
    js.get(prototype, 'isRealValid', function () {
        return !(this._objFlags & RealDestroyed);
    });
}

var deferredDestroyTimer = null;

/**
 * !#en
 * Destroy this Object, and release all its own references to other objects.<br/>
 * Actual object destruction will delayed until before rendering.
 * From the next frame, this object is not usable any more.
 * You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
 * !#zh
 * 销毁该对象，并释放所有它对其它对象的引用。<br/>
 * 实际销毁操作会延迟到当前帧渲染前执行。从下一帧开始，该对象将不再可用。
 * 您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。
 * @method destroy
 * @return {Boolean} whether it is the first time the destroy being called
 * @example
 * obj.destroy();
 */
prototype.destroy = function () {
    if (this._objFlags & Destroyed) {
        cc.warnID(5000);
        return false;
    }
    if (this._objFlags & ToDestroy) {
        return false;
    }
    this._objFlags |= ToDestroy;
    objectsToDestroy.push(this);

    if (CC_EDITOR && deferredDestroyTimer === null && cc.engine && ! cc.engine._isUpdating) {
        // auto destroy immediate in edit mode
        deferredDestroyTimer = setImmediate(deferredDestroy);
    }
    return true;
};

if (CC_EDITOR || CC_TEST) {
    /*
     * !#en
     * In fact, Object's "destroy" will not trigger the destruct operation in Firebal Editor.
     * The destruct operation will be executed by Undo system later.
     * !#zh
     * 事实上，对象的 “destroy” 不会在编辑器中触发析构操作，
     * 析构操作将在 Undo 系统中**延后**执行。
     * @method realDestroyInEditor
     * @private
     */
    prototype.realDestroyInEditor = function () {
        if ( !(this._objFlags & Destroyed) ) {
            cc.warnID(5001);
            return;
        }
        if (this._objFlags & RealDestroyed) {
            cc.warnID(5000);
            return;
        }
        this._destruct();
        this._objFlags |= RealDestroyed;
    };
}

function compileDestruct (obj, ctor) {
    var shouldSkipId = obj instanceof cc._BaseNode || obj instanceof cc.Component;
    var idToSkip = shouldSkipId ? '_id' : null;

    var key, propsToReset = {};
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key === idToSkip) {
                continue;
            }
            switch (typeof obj[key]) {
                case 'string':
                    propsToReset[key] = '';
                    break;
                case 'object':
                case 'function':
                    propsToReset[key] = null;
                    break;
            }
        }
    }
    // Overwrite propsToReset according to Class
    if (cc.Class._isCCClass(ctor)) {
        var attrs = cc.Class.Attr.getClassAttrs(ctor);
        var propList = ctor.__props__;
        for (var i = 0; i < propList.length; i++) {
            key = propList[i];
            var attrKey = key + cc.Class.Attr.DELIMETER + 'default';
            if (attrKey in attrs) {
                if (shouldSkipId && key === '_id') {
                    continue;
                }
                switch (typeof attrs[attrKey]) {
                    case 'string':
                        propsToReset[key] = '';
                        break;
                    case 'object':
                    case 'function':
                        propsToReset[key] = null;
                        break;
                    case 'undefined':
                        propsToReset[key] = undefined;
                        break;
                }
            }
        }
    }

    if (CC_SUPPORT_JIT) {
        // compile code
        var func = '';
        for (key in propsToReset) {
            var statement;
            if (CCClass.IDENTIFIER_RE.test(key)) {
                statement = 'o.' + key + '=';
            }
            else {
                statement = 'o[' + CCClass.escapeForJS(key) + ']=';
            }
            var val = propsToReset[key];
            if (val === '') {
                val = '""';
            }
            func += (statement + val + ';\n');
        }
        return Function('o', func);
    }
    else {
        return function (o) {
            for (var key in propsToReset) {
                o[key] = propsToReset[key];
            }
        };
    }
}

/**
 * Clear all references in the instance.
 *
 * NOTE: this method will not clear the getter or setter functions which defined in the instance of CCObject.
 *       You can override the _destruct method if you need, for example:
 *       _destruct: function () {
 *           for (var key in this) {
 *               if (this.hasOwnProperty(key)) {
 *                   switch (typeof this[key]) {
 *                       case 'string':
 *                           this[key] = '';
 *                           break;
 *                       case 'object':
 *                       case 'function':
 *                           this[key] = null;
 *                           break;
 *               }
 *           }
 *       }
 *
 * @method _destruct
 * @private
 */
prototype._destruct = function () {
    var ctor = this.constructor;
    var destruct = ctor.__destruct__;
    if (!destruct) {
        destruct = compileDestruct(this, ctor);
        js.value(ctor, '__destruct__', destruct, true);
    }
    destruct(this);
};

/**
 * Called before the object being destroyed.
 * @method _onPreDestroy
 * @private
 */
prototype._onPreDestroy = null;

prototype._destroyImmediate = function () {
    if (this._objFlags & Destroyed) {
        cc.errorID(5000);
        return;
    }
    // engine internal callback
    if (this._onPreDestroy) {
        this._onPreDestroy();
    }

    if ((CC_TEST ? (/* make CC_EDITOR mockable*/ Function('return !CC_EDITOR'))() : !CC_EDITOR) || cc.engine._isPlaying) {
        this._destruct();
    }

    this._objFlags |= Destroyed;
};

if (CC_EDITOR) {
    /**
     * The customized serialization for this object. (Editor Only)
     * @method _serialize
     * @param {Boolean} exporting
     * @return {object} the serialized json data object
     * @private
     */
    prototype._serialize = null;
}

/**
 * Init this object from the custom serialized data.
 * @method _deserialize
 * @param {Object} data - the serialized json data
 * @param {_Deserializer} ctx
 * @private
 */
prototype._deserialize = null;

/**
 * @module cc
 */

/**
 * !#en
 * Checks whether the object is non-nil and not yet destroyed.<br>
 * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
 * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
 * If you want to determine whether the current frame has called `destroy`, use `cc.isValid(obj, true)`,
 * but this is often caused by a particular logical requirements, which is not normally required.
 *
 * !#zh
 * 检查该对象是否不为 null 并且尚未销毁。<br>
 * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。如果希望判断当前帧是否调用过 `destroy`，请使用 `cc.isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
 *
 * @method isValid
 * @param {any} value
 * @param {Boolean} [strictMode=false] - If true, Object called destroy() in this frame will also treated as invalid.
 * @return {Boolean} whether is valid
 * @example
 * var node = new cc.Node();
 * cc.log(cc.isValid(node));    // true
 * node.destroy();
 * cc.log(cc.isValid(node));    // true, still valid in this frame
 * // after a frame...
 * cc.log(cc.isValid(node));    // false, destroyed in the end of last frame
 */
cc.isValid = function (value, strictMode) {
    if (typeof value === 'object') {
        return !!value && !(value._objFlags & (strictMode ? (Destroyed | ToDestroy) : Destroyed));
    }
    else {
        return typeof value !== 'undefined';
    }
};

if (CC_EDITOR || CC_TEST) {
    js.value(CCObject, '_willDestroy', function (obj) {
        return !(obj._objFlags & Destroyed) && (obj._objFlags & ToDestroy) > 0;
    });
    js.value(CCObject, '_cancelDestroy', function (obj) {
        obj._objFlags &= ~ToDestroy;
        js.array.fastRemove(objectsToDestroy, obj);
    });
}

cc.Object = module.exports = CCObject;
