/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
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

#pragma once

#include <string>

#include "core/data/Object.h"
#include "core/platform/Macro.h"
#include "core/scene-graph/ComponentProxy.h"
#include "math/Geometry.h"

#include "bindings/jswrapper/Accessor.h"
#include "bindings/jswrapper/HasJSThisObject.h"
#include "v8/ScriptEngine.h"

namespace se {
class Object;
class Value;
} // namespace se

namespace cc {

class Node;

namespace scene {
class RenderScene;
}

#define JS_SCOPE se::AutoHandleScope jsHandleSope

#define COMPONENT_EXECUTION_ORDER(cls, priority)           \
private:                                                   \
    static constexpr int32_t _executionOrder = (priority); \
                                                           \
public:                                                    \
    int32_t getExecutionOrder() const override { return cls::_executionOrder; }

#define COMPONENT_BASE_EXECUTION_ORDER(cls, priority)      \
private:                                                   \
    static constexpr int32_t _executionOrder = (priority); \
                                                           \
public:                                                    \
    virtual int32_t getExecutionOrder() const { return cls::_executionOrder; }

class ComponentProxy : public CCObject, public se::HasJSThisObject {
public:
    COMPONENT_BASE_EXECUTION_ORDER(ComponentProxy, 0)

    using Super = CCObject;

    ~ComponentProxy() override = default;

    virtual const std::string &getName() const { return _name; }
    void setName(const std::string &value) { _name = value; }

    /**
     * @en The uuid for editor.
     * @zh 组件的 uuid，用于编辑器。
     * @readOnly
     * @example
     * ```ts
     * import { log } from 'cc';
     * log(comp.uuid);
     * ```
    //  */
    virtual std::string getUuid() const {
        return getJSProperty<std::string>("uuid");
    }

    /**
    * @en Indicates whether this component is enabled or not.
    * @zh 表示该组件自身是否启用。
    * @default true
    * @example
    * ```ts
    * import { log } from 'cc';
    * comp.enabled = true;
    * log(comp.enabled);
    * ```
    */
    virtual inline bool isEnabled() const {
        return getJSProperty<bool>("enabled");
    }

    virtual void setEnabled(bool value) {
        setJSProperty("enabled", value);
    }

    /**
    * @en Indicates whether this component is enabled and its node is also active in the hierarchy.
    * @zh 表示该组件是否被启用并且所在的节点也处于激活状态。
    * @readOnly
    * @example
    * ```ts
    * import { log } from 'cc';
    * log(comp.enabledInHierarchy);
    * ```
    */
    bool isEnabledInHierarchy() const {
        return getJSProperty<bool>("enabledInHierarchy");
    }

    /**
     * @en Returns a value which used to indicate the onLoad get called or not.
     * @zh 返回一个值用来判断 onLoad 是否被调用过，不等于 0 时调用过，等于 0 时未调用。
     * @readOnly
     * @example
     * ```ts
     * import { log } from 'cc';
     * log(this._isOnLoadCalled > 0);
     * ```
     */
    inline bool isOnLoadCalled() {
        return hasFlag(_objFlags, CCObject::Flags::IS_ON_LOAD_CALLED);
    }

    virtual Node *getNode() const {
        if (!_nodeCache) {
            _nodeCache = getJSProperty<Node *>("node");
        }
        return _nodeCache;
    }

    virtual void setNode(Node *node) {
        _nodeCache = node;
        setJSProperty("node", node);
    }

    virtual CCObject::Flags getObjFlags() {
        return _objFlags;
    }

    virtual void setObjFlags(CCObject::Flags v) {
        _objFlags = v;
    }

    scene::RenderScene *_getRenderScene() const {
        if (!_renderSceneCache) { 
            JS_SCOPE;
            se::Value scene = se::accessor::invoke(getJSThis(), "_getRenderScene");
            _renderSceneCache = scene.toObject()->getTypedPrivateData<scene::RenderScene>();
        }
        return _renderSceneCache;
    }

    // LIFECYCLE METHODS

    // Cocos Creator provides lifecycle methods that you can specify to hook into this process.
    // We provide Pre methods, which are called right before something happens, and Post methods which are called right after something happens.

    /**
     * @en Update is called every frame, if the Component is enabled.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 如果该组件启用，则每帧调用 update。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     * @param dt - the delta time in seconds it took to complete the last frame
     */
    virtual void update(float dt) {}

    /**
     * @en LateUpdate is called every frame, if the Component is enabled.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 如果该组件启用，则每帧调用 LateUpdate。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     * @param dt - the delta time in seconds it took to complete the last frame
     */
    virtual void lateUpdate(float dt) {}

    /**
     * @en `__preload` is called before every onLoad.<br/>
     * It is used to initialize the builtin components internally,<br/>
     * to avoid checking whether onLoad is called before every public method calls.<br/>
     * This method should be removed if script priority is supported.
     * @zh `__preload` 在每次onLoad之前调用。<br/>
     * 它用于在内部初始化内置组件，<br/>
     * 以避免在每次公有方法调用之前检查是否调用了onLoad。<br/>
     * 如果支持脚本优先级，则应删除此方法。
     * @private
     */
    virtual void __preload() {} //NOLINT(readability-identifier-naming, bugprone-reserved-identifier)

    /**
     * @en
     * When attaching to an active node or its node first activated.<br/>
     * onLoad is always called before any start functions, this allows you to order initialization of scripts.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh
     * 当附加到一个激活的节点上或者其节点第一次激活时候调用。onLoad 总是会在任何 start 方法调用前执行，这能用于安排脚本的初始化顺序。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    virtual void onLoad() {}

    /**
     * @en
     * Called before all scripts' update if the Component is enabled the first time.<br/>
     * Usually used to initialize some logic which need to be called after all components' `onload` methods called.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh
     * 如果该组件第一次启用，则在所有组件的 update 之前调用。通常用于需要在所有组件的 onLoad 初始化完毕后执行的逻辑。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    virtual void start() {}

    /**
     * @en Called when this component becomes enabled and its node is active.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 当该组件被启用，并且它的节点也激活时。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    virtual void onEnable() {}

    /**
     * @en Called when this component becomes disabled or its node becomes inactive.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 当该组件被禁用或节点变为无效时调用。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    virtual void onDisable() {}

    /**
     * @en Called when this component will be destroyed.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 当该组件被销毁时调用<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    virtual void onDestroy() {}

    /**
     * @en
     * onRestore is called after the user clicks the Reset item in the Inspector's context menu or performs
     * an undo operation on this component.<br/>
     * <br/>
     * If the component contains the "internal state", short for "temporary member variables which not included<br/>
     * in its CCClass properties", then you may need to implement this function.<br/>
     * <br/>
     * The editor will call the getset accessors of your component to record/restore the component's state<br/>
     * for undo/redo operation. However, in extreme cases, it may not works well. Then you should implement<br/>
     * this function to manually synchronize your component's "internal states" with its public properties.<br/>
     * Once you implement this function, all the getset accessors of your component will not be called when<br/>
     * the user performs an undo/redo operation. Which means that only the properties with default value<br/>
     * will be recorded or restored by editor.<br/>
     * <br/>
     * Similarly, the editor may failed to reset your component correctly in extreme cases. Then if you need<br/>
     * to support the reset menu, you should manually synchronize your component's "internal states" with its<br/>
     * properties in this function. Once you implement this function, all the getset accessors of your component<br/>
     * will not be called during reset operation. Which means that only the properties with default value<br/>
     * will be reset by editor.
     *
     * This function is only called in editor mode.
     * @zh
     * onRestore 是用户在检查器菜单点击 Reset 时，对此组件执行撤消操作后调用的。<br/>
     * <br/>
     * 如果组件包含了“内部状态”（不在 CCClass 属性中定义的临时成员变量），那么你可能需要实现该方法。<br/>
     * <br/>
     * 编辑器执行撤销/重做操作时，将调用组件的 get set 来录制和还原组件的状态。
     * 然而，在极端的情况下，它可能无法良好运作。<br/>
     * 那么你就应该实现这个方法，手动根据组件的属性同步“内部状态”。
     * 一旦你实现这个方法，当用户撤销或重做时，组件的所有 get set 都不会再被调用。
     * 这意味着仅仅指定了默认值的属性将被编辑器记录和还原。<br/>
     * <br/>
     * 同样的，编辑可能无法在极端情况下正确地重置您的组件。<br/>
     * 于是如果你需要支持组件重置菜单，你需要在该方法中手工同步组件属性到“内部状态”。<br/>
     * 一旦你实现这个方法，组件的所有 get set 都不会在重置操作时被调用。
     * 这意味着仅仅指定了默认值的属性将被编辑器重置。
     * <br/>
     * 此方法仅在编辑器下会被调用。
     */
    virtual void onRestore() {}

    virtual void onFocusInEditor() {}

    virtual void onLostFocusInEditor() {}

private:
    mutable Node *_nodeCache{nullptr};
    mutable scene::RenderScene *_renderSceneCache{nullptr};
};

} // namespace cc
