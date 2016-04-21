/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

var CCObject = require('./CCObject');
var PersistentMask = CCObject.Flags.PersistentMask;
var _isDomNode = require('./utils').isDomNode;

/**
 * !#en Clones the object original and returns the clone.
 *
 * See [Clone exists Entity](/en/scripting/create-destroy-entities/#instantiate)
 *
 * !#zh 复制给定的对象
 *
 * 详细用法可参考[复制已有Entity](/zh/scripting/create-destroy-entities/#instantiate)
 *
 * Instantiate 时，function 和 dom 等非可序列化对象会直接保留原有引用，Asset 会直接进行浅拷贝，可序列化类型会进行深拷贝。
 * <del>对于 Entity / Component 等 Scene Object，如果对方也会被一起 Instantiate，则重定向到新的引用，否则保留为原来的引用。</del>
 *
 * @method instantiate
 * @param {Object} original - An existing object that you want to make a copy of.
 * @return {Object} the newly instantiated object
 */
function instantiate (original) {
    if (typeof original !== 'object' || Array.isArray(original)) {
        cc.error('The thing you want to instantiate must be an object');
        return null;
    }
    if (!original) {
        cc.error('The thing you want to instantiate is nil');
        return null;
    }
    if (original instanceof CCObject && !original.isValid) {
        cc.error('The thing you want to instantiate is destroyed');
        return null;
    }

    var clone;
    if (original instanceof CCObject) {
        // invoke _instantiate method if supplied
        if (original._instantiate) {
            cc.game._isCloning = true;
            clone = original._instantiate();
            cc.game._isCloning = false;
            return clone;
        }
        else if (original instanceof cc.Asset) {
            // 不允许用通用方案实例化资源
            cc.error('The instantiate method for given asset do not implemented');
            return null;
        }
    }

    cc.game._isCloning = true;
    clone = doInstantiate(original);
    cc.game._isCloning = false;
    return clone;
}

/*
 * Reserved tags:
 * - _iN$t: the cloned instance
 */

var objsToClearTmpVar = [];   // 用于重设临时变量

///**
// * Do instantiate object, the object to instantiate must be non-nil.
// * 这是一个通用的 instantiate 方法，可能效率比较低。
// * 之后可以给各种类型重载快速实例化的特殊实现，但应该在单元测试中将结果和这个方法的结果进行对比。
// * 值得注意的是，这个方法不可重入，不支持 mixin。
// *
// * @param {Object} obj - 该方法仅供内部使用，用户需负责保证参数合法。什么参数是合法的请参考 cc.instantiate 的实现。
// * @param {Node} [parent] - 只有在该对象下的场景物体会被克隆。
// * @return {Object}
// * @private
// */
function doInstantiate (obj, parent) {
    if (Array.isArray(obj)) {
        cc.error('Can not instantiate array');
        return null;
    }
    if (_isDomNode && _isDomNode(obj)) {
        cc.error('Can not instantiate DOM element');
        return null;
    }

    var clone = enumerateObject(obj, parent);

    for (var i = 0, len = objsToClearTmpVar.length; i < len; ++i) {
        objsToClearTmpVar[i]._iN$t = null;
    }
    objsToClearTmpVar.length = 0;

    return clone;
}

///**
// * @param {Object} obj - The object to instantiate, typeof must be 'object' and should not be an array.
// * @return {Object} - the instantiated instance
// */
var enumerateObject = function (obj, parent) {
    var value, type, key;
    var klass = obj.constructor;
    var clone = new klass();
    obj._iN$t = clone;
    objsToClearTmpVar.push(obj);
    if (cc.Class._isCCClass(klass)) {
        var props = klass.__props__;
        for (var p = 0; p < props.length; p++) {
            key = props[p];
            var attrs = cc.Class.attr(klass, key);
            if (attrs.serializable !== false) {
                value = obj[key];
                type = typeof value;
                if (type === 'object') {
                    clone[key] = value ? instantiateObj(value, parent, clone, key) : value;
                }
                else {
                    clone[key] = (type !== 'function') ? value : null;
                }
            }
        }
        if (CC_EDITOR && (clone instanceof cc._BaseNode || clone instanceof cc.Component)) {
            clone._id = '';
        }
    }
    else {
        // primitive javascript object
        for (key in obj) {
            if ( !obj.hasOwnProperty(key) ||
                 // starts with "__" but not "__type__"
                 (key.charCodeAt(0) === 95 && key.charCodeAt(1) === 95 && key !== '__type__')
               ) {
                continue;
            }
            value = obj[key];
            if (value === clone) {
                continue;   // value is obj._iN$t
            }
            // instantiate field
            type = typeof value;
            if (type === 'object') {
                clone[key] = value ? instantiateObj(value, parent, clone, key) : value;
            }
            else {
                clone[key] = (type !== 'function') ? value : null;
            }
        }
    }
    if (obj instanceof CCObject) {
        clone._objFlags &= PersistentMask;
    }
    return clone;
};

///**
// * @return {Object} - the original non-nil object, typeof must be 'object'
// */
function instantiateObj (obj, parent, ownerObj, ownerKey) {
    // 目前使用“_iN$t”这个特殊字段来存实例化后的对象，这样做主要是为了防止循环引用
    // 注意，为了避免循环引用，所有新创建的实例，必须在赋值前被设为源对象的_iN$t
    var clone = obj._iN$t;
    if (clone) {
        // has been instantiated
        return clone;
    }

    if ( !cc.isValid(obj) ) {
        return null;
    }

    if (obj instanceof cc.Asset) {
        // 所有资源直接引用，不需要拷贝
        return obj;
    }
    else if (Array.isArray(obj)) {
        var len = obj.length;
        clone = new Array(len);
        obj._iN$t = clone;
        for (var i = 0; i < len; ++i) {
            var value = obj[i];
            // instantiate field
            var type = typeof value;
            if (type === 'object') {
                clone[i] = value ? instantiateObj(value, parent, clone, '' + i) : value;
            }
            else {
                clone[i] = (type !== 'function') ? value : null;
            }
        }
        objsToClearTmpVar.push(obj);
        return clone;
    }
    else if (obj instanceof cc.ValueType) {
        return obj.clone();
    }
    else {
        var ctor = obj.constructor;
        if (cc.Class._isCCClass(ctor)) {
            if (parent) {
                if (parent instanceof cc.Component) {
                    if (obj instanceof cc._BaseNode || obj instanceof cc.Component) {
                        return obj;
                    }
                }
                else if (parent instanceof cc._BaseNode) {
                    if (obj instanceof cc._BaseNode) {
                        if (!obj.isChildOf(parent)) {
                            // should not clone other nodes if not descendant
                            return obj;
                        }
                    }
                    else if (obj instanceof cc.Component) {
                        if (!obj.node.isChildOf(parent)) {
                            // should not clone other component if not descendant
                            return obj;
                        }
                    }
                }
            }
        }
        else if (ctor !== Object) {
            // unknown type
            return obj;
        }
        return enumerateObject(obj, parent);
    }
}

instantiate._clone = doInstantiate;
cc.instantiate = instantiate;
module.exports = instantiate;
