/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#pragma once

#include "base/std/container/string.h"

#include "base/Macros.h"
#include "base/RefCounted.h"
#include "base/TypeDef.h"

namespace se {
class Object;
}

namespace cc {

/**
 * @en
 * The base class of most of all the objects in Cocos Creator.
 * @zh
 * 大部分对象的基类。
 * @private
 */
class CCObject : public RefCounted /*cjh implements EditorExtendableObject*/ {
public:
    // definitions for CCObject.Flags
    enum class Flags : FlagBits {
        ZERO = 0,
        DESTROYED = 1 << 0,
        REAL_DESTROYED = 1 << 1,
        TO_DESTROY = 1 << 2,
        /**
         * @en The object will not be saved.
         * @zh 该对象将不会被保存。
         */
        DONT_SAVE = 1 << 3,
        /**
         * @en The object will not be saved when building a player.
         * @zh 构建项目时，该对象将不会被保存。
         */
        EDITOR_ONLY = 1 << 4,
        DIRTY = 1 << 5,
        /**
         * @en Dont destroy automatically when loading a new scene.
         * @zh 加载一个新场景时，不自动删除该对象。
         * @private
         */
        DONT_DESTROY = 1 << 6,
        DESTROYING = 1 << 7,
        /**
         * @en The node is deactivating.
         * @zh 节点正在反激活的过程中。
         * @private
         */
        DEACTIVATING = 1 << 8,
        /**
         * @en The lock node, when the node is locked, cannot be clicked in the scene.
         * @zh 锁定节点，锁定后场景内不能点击。
         * @private
         */
        LOCKED_IN_EDITOR = 1 << 9,
        /**
         * @en Hide the object in editor.
         * @zh 在编辑器中隐藏该对象。
         */
        HIDE_IN_HIERARCHY = 1 << 10,

        IS_ON_ENABLE_CALLED = 1 << 11,
        IS_EDITOR_ON_ENABLE_CALLED = 1 << 12,
        IS_PRELOAD_STARTED = 1 << 13,
        IS_ON_LOAD_CALLED = 1 << 14,
        IS_ON_LOAD_STARTED = 1 << 15,
        IS_START_CALLED = 1 << 16,

        IS_ROTATION_LOCKED = 1 << 17,
        IS_SCALE_LOCKED = 1 << 18,
        IS_ANCHOR_LOCKED = 1 << 19,
        IS_SIZE_LOCKED = 1 << 20,
        IS_POSITION_LOCKED = 1 << 21,

        // Distributed
        IS_REPLICATED = 1 << 22,
        IS_CLIENT_LOAD = 1 << 23,

        // var Hide = HideInGame | HideInEditor;
        // should not clone or serialize these flags
        PERSISTENT_MASK = ~(TO_DESTROY | DIRTY | DESTROYING | DONT_DESTROY | DEACTIVATING | IS_PRELOAD_STARTED | IS_ON_LOAD_STARTED | IS_ON_LOAD_CALLED | IS_START_CALLED | IS_ON_ENABLE_CALLED | IS_EDITOR_ON_ENABLE_CALLED | IS_ROTATION_LOCKED | IS_SCALE_LOCKED | IS_ANCHOR_LOCKED | IS_SIZE_LOCKED | IS_POSITION_LOCKED
                            /* RegisteredInEditor */),

        // all the hideFlags
        /**
         * @en The object will not be saved and hide the object in editor,and lock node, when the node is locked,
         * cannot be clicked in the scene,and The object will not be saved when building a player.
         * @zh 该对象将不会被保存,构建项目时，该对象将不会被保存, 锁定节点，锁定后场景内不能点击, 在编辑器中隐藏该对象。
         */
        ALL_HIDE_MASKS = DONT_SAVE | EDITOR_ONLY | LOCKED_IN_EDITOR | HIDE_IN_HIERARCHY,
    };

    static void deferredDestroy();

    // cjh    public declare [editorExtrasTag]: unknown;

    Flags _objFlags{Flags::ZERO};
    ccstd::string _name;

    explicit CCObject(ccstd::string name = "");
    ~CCObject() override;

    // MEMBER

    /**
     * @en The name of the object.
     * @zh 该对象的名称。
     * @default ""
     * @example
     * ```
     * obj.name = "New Obj";
     * ```
     */
    inline const ccstd::string& getName() const { return _name; }
    inline void setName(const ccstd::string& value) { _name = value; }

    /**
     * @en After inheriting CCObject objects, control whether you need to hide, lock, serialize, and other functions.
     * @zh 在继承 CCObject 对象后，控制是否需要隐藏，锁定，序列化等功能。
     */
    inline void setHideFlags(Flags hideFlags);
    inline Flags getHideFlags() const;

    /**
     * @en
     * Indicates whether the object is not yet destroyed. (It will not be available after being destroyed)<br>
     * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
     * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
     * If you want to determine whether the current frame has called `destroy`, use `isValid(obj, true)`,
     * but this is often caused by a particular logical requirements, which is not normally required.
     *
     * @zh
     * 表示该对象是否可用（被 destroy 后将不可用）。<br>
     * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。<br>
     * 因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。<br>
     * 如果希望判断当前帧是否调用过 `destroy`，请使用 `isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
     * @default true
     * @readOnly
     * @example
     * ```ts
     * import { Node, log } from 'cc';
     * const node = new Node();
     * log(node.isValid);    // true
     * node.destroy();
     * log(node.isValid);    // true, still valid in this frame
     * // after a frame...
     * log(node.isValid);    // false, destroyed in the end of last frame
     * ```
     */
    inline bool isValid() const;

    virtual void destruct();

    /**
     * @en
     * Destroy this Object, and release all its own references to other objects.<br/>
     * Actual object destruction will delayed until before rendering.
     * From the next frame, this object is not usable any more.
     * You can use `isValid(obj)` to check whether the object is destroyed before accessing it.
     * @zh
     * 销毁该对象，并释放所有它对其它对象的引用。<br/>
     * 实际销毁操作会延迟到当前帧渲染前执行。从下一帧开始，该对象将不再可用。
     * 您可以在访问对象之前使用 `isValid(obj)` 来检查对象是否已被销毁。
     * @return whether it is the first time the destroy being called
     * @example
     * ```
     * obj.destroy();
     * ```
     */
    virtual bool destroy();

    /**
     * Clear all references in the instance.
     *
     * NOTE: this method will not clear the getter or setter functions which defined in the instance of CCObject.
     *       You can override the _destruct method if you need, for example:
     *       _destruct: function () {
     *           for (var key in this) {
     *               if (hasOwnProperty(key)) {
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
     */

    void destroyImmediate();

    virtual ccstd::string toString() const { return ""; };

    inline void setScriptObject(se::Object* seObj) { _scriptObject = seObj; }
    inline se::Object* getScriptObject() const { return _scriptObject; }

protected:
    virtual bool onPreDestroy() {
        // FIXME: need reture value
        return true;
    }

    se::Object* _scriptObject{nullptr}; // weak reference
};

CC_ENUM_BITWISE_OPERATORS(CCObject::Flags);

inline bool CCObject::isValid() const {
    return !(_objFlags & Flags::DESTROYED);
}

inline void CCObject::setHideFlags(Flags hideFlags) {
    Flags flags = hideFlags & Flags::ALL_HIDE_MASKS;
    _objFlags = (_objFlags & ~Flags::ALL_HIDE_MASKS) | flags;
}

inline CCObject::Flags CCObject::getHideFlags() const {
    return _objFlags & Flags::ALL_HIDE_MASKS;
}

/*
 * @en
 * Checks whether the object is non-nil and not yet destroyed.<br>
 * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
 * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
 * If you want to determine whether the current frame has called `destroy`, use `isValid(obj, true)`,
 * but this is often caused by a particular logical requirements, which is not normally required.
 *
 * @zh
 * 检查该对象是否不为 null 并且尚未销毁。<br>
 * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。<br>
 * 因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。<br>
 * 如果希望判断当前帧是否调用过 `destroy`，请使用 `isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
 *
 * @method isValid
 * @param value
 * @param [strictMode=false] - If true, Object called destroy() in this frame will also treated as invalid.
 * @return whether is valid
 * @example
 * ```
 * import { Node, log } from 'cc';
 * var node = new Node();
 * log(isValid(node));    // true
 * node.destroy();
 * log(isValid(node));    // true, still valid in this frame
 * // after a frame...
 * log(isValid(node));    // false, destroyed in the end of last frame
 * ```
 */
bool isObjectValid(CCObject* value, bool strictMode = false);

} // namespace cc
