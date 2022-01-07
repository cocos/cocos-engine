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

#include <vector>
#include "base/Ptr.h"
#include "base/TypeDef.h"
#include "cocos/base/Any.h"
//#include "core/components/Component.h"
//#include "core/event/Event.h"
#include "core/event/EventTypesToJS.h"
#include "core/scene-graph/BaseNode.h"
#include "core/scene-graph/Layers.h"
#include "core/scene-graph/NodeEnum.h"
#include "core/scene-graph/NodeEvent.h"
#include "core/scene-graph/NodeEventProcessor.h"

#include "math/Mat3.h"
#include "math/Mat4.h"
#include "math/Quaternion.h"
#include "math/Vec3.h"
#include "math/Vec4.h"

namespace cc {

class Scene;
class NodeEventProcessor;
//class NodeUiProperties;

/**
 * Event types emitted by Node
 */
using EventType = NodeEventType;
/**
 * Bit masks for Node transformation parts
 */
using TransformDirtyBit = TransformBit;

class Node : public BaseNode {
public:
    class UserData : public RefCounted {
    public:
        ~UserData() override = default;

    protected:
        UserData() = default;
    };

    using Super = BaseNode;

    static const uint32_t TRANSFORM_ON;
    static const uint32_t DESTROYING;
    static const uint32_t DEACTIVATING;
    static const uint32_t DONT_DESTROY;

    static Node *instantiate(Node *cloned, bool isSyncedNode);
    // for walk
    static std::vector<std::vector<Node *>> stacks;
    static index_t                          stackId;

    static void    setScene(Node *);
    static index_t getIdxOfChild(const std::vector<IntrusivePtr<Node>> &, Node *);

    static bool isStatic; // cjh TODO: add getter / setter

    /**
     * @en Finds a node by hierarchy path, the path is case-sensitive.
     * It will traverse the hierarchy by splitting the path using '/' character.
     * This function will still returns the node even if it is inactive.
     * It is recommended to not use this function every frame instead cache the result at startup.
     * @zh 通过路径从节点树中查找节点的方法，路径是大小写敏感的，并且通过 `/` 来分隔节点层级。
     * 即使节点的状态是未启用的也可以找到，建议将结果缓存，而不是每次需要都去查找。
     * @param path The path of the target node
     * @param referenceNode If given, the search will be limited in the sub node tree of the reference node
     */
    //    static Node *find(const std::string &path, Node *referenceNode = nullptr);

    /**
     * @en Determine whether the given object is a normal Node. Will return false if [[Scene]] given.
     * @zh 指定对象是否是普通的节点？如果传入 [[Scene]] 会返回 false。
     */
    template <typename T>
    static bool isNode(T *obj);

    static void resetChangedFlags();
    static void clearNodeArray();

    Node();
    explicit Node(const std::string &name);
    ~Node() override;

    void setParent(Node *parent, bool isKeepWorld = false);

    Scene *getScene() const;

    void walk(const std::function<void(Node *)> &preFunc);
    void walk(const std::function<void(Node *)> &preFunc, const std::function<void(Node *)> &postFunc);

    template <typename Target, typename... Args>
    void on(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture = false);

    template <typename... Args>
    void on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename... Args>
    void on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename... Args>
    void on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, bool useCapture = false);

    template <typename Target, typename... Args>
    void on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, bool useCapture = false);

    template <typename Target, typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, bool useCapture = false);

    template <typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, bool useCapture = false);

    template <typename Target, typename... Args>
    void once(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture = false);

    template <typename... Args>
    void once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename... Args>
    void once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename Target, typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture = false);

    template <typename... Args>
    void once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, bool useCapture = false);

    template <typename Target, typename... Args>
    void once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, bool useCapture = false);

    template <typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, bool useCapture = false);

    template <typename Target, typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, bool useCapture = false);

    void off(const CallbacksInvoker::KeyType &type, bool useCapture = false);

    void off(const CallbacksInvoker::KeyType &type, CallbackInfoBase::ID cbID, bool useCapture = false);

    void off(const CallbacksInvoker::KeyType &type, void *target, bool useCapture = false);

    template <typename Target, typename... Args>
    void off(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture = false);

    template <typename... Args>
    void emit(const CallbacksInvoker::KeyType &type, Args &&...args);

    //    void dispatchEvent(event::Event *event);
    bool hasEventListener(const CallbacksInvoker::KeyType &type) const;
    bool hasEventListener(const CallbacksInvoker::KeyType &type, CallbackInfoBase::ID cbID) const;
    bool hasEventListener(const CallbacksInvoker::KeyType &type, void *target) const;
    bool hasEventListener(const CallbacksInvoker::KeyType &type, void *target, CallbackInfoBase::ID cbID) const;

    template <typename Target, typename... Args>
    bool hasEventListener(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target) const;

    void targetOff(const CallbacksInvoker::KeyType &type);

    bool destroy() override {
        if (CCObject::destroy()) {
            setActive(false);
            return true;
        }
        return false;
    }
    inline void destroyAllChildren() {
        for (const auto &child : _children) {
            child->destroy();
        }
    }
    inline void updateSiblingIndex() {
        index_t i = 0;
        for (const auto &child : _children) {
            child->_siblingIndex = i++;
        }
        emit(NodeEventType::SIBLING_ORDER_CHANGED);
    }

    inline void addChild(Node *node) { node->setParent(this); }
    inline void removeChild(Node *node) const {
        auto idx = getIdxOfChild(_children, node);
        if (idx != -1) {
            node->setParent(nullptr);
        }
    }
    inline void removeFromParent() {
        if (_parent) {
            _parent->removeChild(this);
        }
    }
    void removeAllChildren();
    bool isChildOf(Node *parent);

    void setActive(bool isActive);

    void setSiblingIndex(index_t index);

    inline bool isPersistNode() const {
        return static_cast<FlagBits>(_objFlags & Flags::DONT_DESTROY) > 0;
    }

    inline void setPersistNode(bool val) {
        val ? _objFlags |= Flags::DONT_DESTROY : _objFlags &= ~Flags::DONT_DESTROY;
    }

    inline const std::string &getUuid() const {
        return _id;
    }

    inline bool isActive() const { return _active; }

    inline bool isActiveInHierarchy() const { return _activeInHierarchyArr[0] != 0; }
    inline void setActiveInHierarchy(bool v) { _activeInHierarchyArr[0] = (v ? 1 : 0); }
    inline void setActiveInHierarchyPtr(uint8_t *ptr) { _activeInHierarchyArr = ptr; }

    virtual void                                  onPostActivated(bool active) {}
    inline const std::vector<IntrusivePtr<Node>> &getChildren() const { return _children; }
    inline Node *                                 getParent() const { return _parent; }
    inline NodeEventProcessor *                   getEventProcessor() const { return _eventProcessor; }

    Node *           getChildByUuid(const std::string &) const;
    Node *           getChildByName(const std::string &) const;
    Node *           getChildByPath(const std::string &) const;
    inline index_t   getSiblingIndex() const { return _siblingIndex; }
    inline UserData *getUserData() { return _userData.get(); }
    inline void      setUserData(UserData *data) { _userData = data; }
    inline void      insertChild(Node *child, index_t siblingIndex) {
        child->setParent(this);
        child->setSiblingIndex(siblingIndex);
    }

    void invalidateChildren(TransformBit dirtyBit);

    void        translate(const Vec3 &, NodeSpace ns = NodeSpace::LOCAL);
    void        rotate(const Quaternion &rot, NodeSpace ns = NodeSpace::LOCAL, bool calledFromJS = false);
    inline void rotateForJS(float x, float y, float z, float w, NodeSpace ns = NodeSpace::LOCAL) {
        rotate(Quaternion(x, y, z, w), ns, true);
    }
    void lookAt(const Vec3 &pos, const Vec3 &up = Vec3::UNIT_Y);

    void pauseSystemEvents(bool recursive) {}  // cjh TODO:
    void resumeSystemEvents(bool recursive) {} // cjh TODO:

    // ===============================
    // transform
    // ===============================

    /**
     * @en Set position in local coordinate system
     * @zh 设置本地坐标
     * @param position Target position
     */
    inline void setPosition(const Vec3 &pos) { setPosition(pos.x, pos.y, pos.z); }
    inline void setPosition(float x, float y) { setPosition(x, y, _localPosition.z); }
    inline void setPosition(float x, float y, float z) { setPositionInternal(x, y, z, false); }
    inline void setPositionInternal(float x, float y, bool calledFromJS) { setPositionInternal(x, y, _localPosition.z, calledFromJS); }
    void        setPositionInternal(float x, float y, float z, bool calledFromJS);
    inline void setPositionForJS(float x, float y, float z) { _localPosition.set(x, y, z); }
    /**
     * @en Get position in local coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
     * @zh 获取本地坐标，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
     * @param out Set the result to out vector
     * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
     */
    const Vec3 &getPosition() const { return _localPosition; }

    /**
     * @en Set rotation in local coordinate system with a quaternion representing the rotation
     * @zh 用四元数设置本地旋转
     * @param rotation Rotation in quaternion
     */
    inline void setRotation(const Quaternion &rotation) { setRotation(rotation.x, rotation.y, rotation.z, rotation.w); }
    inline void setRotation(float x, float y, float z, float w) { setRotationInternal(x, y, z, w, false); }
    void        setRotationInternal(float x, float y, float z, float w, bool calledFromJS);
    inline void setRotationForJS(float x, float y, float z, float w) { _localRotation.set(x, y, z, w); }

    inline void setEulerAngles(const Vec3 &val) { setRotationFromEuler(val.x, val.y, val.z); }
    inline void setRotationFromEuler(const Vec3 &val) { setRotationFromEuler(val.x, val.y, val.z); }
    inline void setRotationFromEuler(float x, float y) { setRotationFromEuler(x, y, _euler.z); }
    void        setRotationFromEuler(float x, float y, float z);
    inline void setRotationFromEulerForJS(float x, float y, float z) { _euler.set(x, y, z); }
    /**
     * @en Get rotation as quaternion in local coordinate system, please try to pass `out` quaternion and reuse it to avoid garbage.
     * @zh 获取本地旋转，注意，尽可能传递复用的 [[Quat]] 以避免产生垃圾。
     * @param out Set the result to out quaternion
     * @return If `out` given, the return value equals to `out`, otherwise a new quaternion will be generated and return
     */
    const Quaternion &getRotation() const { return _localRotation; }

    /**
     * @en Set scale in local coordinate system
     * @zh 设置本地缩放
     * @param scale Target scale
     */
    inline void setScale(const Vec3 &scale) { setScale(scale.x, scale.y, scale.z); }
    inline void setScale(float x, float y) { setScale(x, y, _localScale.z); }
    inline void setScale(float x, float y, float z) { setScaleInternal(x, y, z, false); }
    inline void setScaleInternal(float x, float y, bool calledFromJS) { setScaleInternal(x, y, _localScale.z, calledFromJS); }
    void        setScaleInternal(float x, float y, float z, bool calledFromJS);
    inline void setScaleForJS(float x, float y, float z) { _localScale.set(x, y, z); }
    /**
     * @en Get scale in local coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
     * @zh 获取本地缩放，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
     * @param out Set the result to out vector
     * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
     */
    const Vec3 &getScale() const { return _localScale; }

    /**
     * @en Inversely transform a point from world coordinate system to local coordinate system.
     * @zh 逆向变换一个空间点，一般用于将世界坐标转换到本地坐标系中。
     * @param out The result point in local coordinate system will be stored in this vector
     * @param p A position in world coordinate system
     */
    void inverseTransformPoint(Vec3 &out, const Vec3 &p);

    /**
     * @en Set position in world coordinate system
     * @zh 设置世界坐标
     * @param position Target position
     */
    inline void setWorldPosition(const Vec3 &pos) { setWorldPosition(pos.x, pos.y, pos.z); }
    void        setWorldPosition(float x, float y, float z);

    /**
     * @en Get position in world coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
     * @zh 获取世界坐标，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
     * @param out Set the result to out vector
     * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
     */
    const Vec3 &getWorldPosition() const;

    /**
     * @en Set rotation in world coordinate system with a quaternion representing the rotation
     * @zh 用四元数设置世界坐标系下的旋转
     * @param rotation Rotation in quaternion
     */
    inline void setWorldRotation(const Quaternion &rotation) { setWorldRotation(rotation.x, rotation.y, rotation.z, rotation.w); }
    void        setWorldRotation(float x, float y, float z, float w);
    /**
     * @en Get rotation as quaternion in world coordinate system, please try to pass `out` quaternion and reuse it to avoid garbage.
     * @zh 获取世界坐标系下的旋转，注意，尽可能传递复用的 [[Quat]] 以避免产生垃圾。
     * @param out Set the result to out quaternion
     * @return If `out` given, the return value equals to `out`, otherwise a new quaternion will be generated and return
     */
    const Quaternion &getWorldRotation() const;

    /**
     * @en Set rotation in world coordinate system with euler angles
     * @zh 用欧拉角设置世界坐标系下的旋转
     * @param x X axis rotation
     * @param y Y axis rotation
     * @param z Z axis rotation
     */
    inline void setWorldScale(const Vec3 &scale) { setWorldScale(scale.x, scale.y, scale.z); }
    void        setWorldScale(float x, float y, float z);

    /**
     * @en Get scale in world coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
     * @zh 获取世界缩放，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
     * @param out Set the result to out vector
     * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
     */
    const Vec3 &getWorldScale() const;

    void setWorldRotationFromEuler(float x, float y, float z);

    /**
     * @en Local transformation matrix
     * @zh 本地坐标系变换矩阵
     */
    void setMatrix(const Mat4 &val);

    /**
     * @en Update the world transform information if outdated
     * @zh 更新节点的世界变换信息
     */
    void updateWorldTransform();

    /**
     * @en Get a world transform matrix
     * @zh 获取世界变换矩阵
     * @param out Set the result to out matrix
     * @return If `out` given, the return value equals to `out`, otherwise a new matrix will be generated and return
     */
    const Mat4 &getWorldMatrix() const;

    /**
     * @en Get a world transform matrix with only rotation and scale
     * @zh 获取只包含旋转和缩放的世界变换矩阵
     * @param out Set the result to out matrix
     * @return If `out` given, the return value equals to `out`, otherwise a new matrix will be generated and return
     */
    Mat4 getWorldRS();

    /**
     * @en Get a world transform matrix with only rotation and translation
     * @zh 获取只包含旋转和位移的世界变换矩阵
     * @param out Set the result to out matrix
     * @return If `out` given, the return value equals to `out`, otherwise a new matrix will be generated and return
     */
    Mat4 getWorldRT();

    /**
     * @en Set local transformation with rotation, position and scale separately.
     * @zh 一次性设置所有局部变换（平移、旋转、缩放）信息
     * @param rot The rotation
     * @param pos The position
     * @param scale The scale
     */
    void        setRTSInternal(Quaternion *rot, Vec3 *pos, Vec3 *scale, bool calledFromJS);
    inline void setRTS(Quaternion *rot, Vec3 *pos, Vec3 *scale) { setRTSInternal(rot, pos, scale, false); }

    inline void setForward(const Vec3 &dir) {
        const float len    = dir.length();
        Vec3        v3Temp = dir * (-1.F / len);
        Quaternion  qTemp{Quaternion::identity()};
        Quaternion::fromViewUp(v3Temp, &qTemp);
        setWorldRotation(qTemp);
    }
    void setAngle(float);

    inline const Vec3 &getEulerAngles() {
        if (_eulerDirty) {
            Quaternion::toEuler(_localRotation, false, &_euler);
            _eulerDirty = false;
        }
        return _euler;
    }

    inline float getAngle() const {
        return _euler.z;
    }

    inline Vec3 getForward() {
        Vec3 forward{0, 0, -1};
        forward.transformQuat(_worldRotation);
        return forward;
    }

    inline Vec3 getUp() {
        Vec3 up{0, 1, 0};
        up.transformQuat(_worldRotation);
        return up;
    }

    inline Vec3 getRight() {
        Vec3 right{1, 0, 0};
        right.transformQuat(_worldRotation);
        return right;
    }

    /**
     * @en Whether the node's transformation have changed during the current frame.
     * @zh 这个节点的空间变换信息在当前帧内是否有变过？
     */
    inline uint32_t getChangedFlags() const { return _flagChange; }
    inline void     setChangedFlags(uint32_t value) { _flagChange = value; }

    inline void     setDirtyFlag(uint32_t value) { _dirtyFlag = value; }
    inline uint32_t getDirtyFlag() const { return _dirtyFlag; }
    inline void     setLayer(uint32_t layer) {
        _layerArr[0] = layer;
        emit(NodeEventType::LAYER_CHANGED, layer);
    }
    inline uint32_t getLayer() const { return _layerArr[0]; }
    inline void     setLayerPtr(uint32_t *ptr) { _layerArr = ptr; }

    //    inline NodeUiProperties *getUIProps() const { return _uiProps.get(); }

    inline void setUIPropsTransformDirtyPtr(uint32_t *pDirty) { _uiTransformDirty = pDirty; }

    //    // ------------------  Component code start -----------------------------
    //    // TODO(Lenovo):
    //
    //    template <typename T, typename = std::enable_if_t<std::is_base_of<Component, T>::value>>
    //    static Component *findComponent(Node * /*node*/) {
    //        // cjh TODO:
    //        CC_ASSERT(false);
    //        return nullptr;
    //    }
    //
    //    template <typename T, typename = std::enable_if_t<std::is_base_of<Component, T>::value>>
    //    static Component *findComponents(Node * /*node*/, const std::vector<Component *> & /*components*/) {
    //        // cjh TODO:
    //        CC_ASSERT(false);
    //        return nullptr;
    //    }
    //
    //    template <typename T, typename = std::enable_if_t<std::is_base_of<Component, T>::value>>
    //    static Component *findChildComponent(const std::vector<Node *> & /*children*/) {
    //        // cjh TODO:
    //        CC_ASSERT(false);
    //        return nullptr;
    //    }
    //
    //    template <typename T, typename = std::enable_if_t<std::is_base_of<Component, T>::value>>
    //    static void findChildComponents(const std::vector<Node *> & /*children*/, std::vector<Component *> & /*components*/) {
    //        // cjh TODO:
    //        CC_ASSERT(false);
    //    }
    //
    //    template <typename T, typename = std::enable_if_t<std::is_base_of_v<Component, T>, T>>
    //    T *addComponent() {
    //        T *comp = new T();
    //        return static_cast<T *>(addComponent(comp));
    //    }
    //
    //    template <typename T, typename std::enable_if_t<std::is_base_of<Component, T>::value>>
    //    void removeComponent() {
    //        for (auto iter = _components.begin(); iter != _components.end(); ++iter) {
    //            if (dynamic_cast<T *>(*iter) != nullptr) {
    //                _components.erase(iter);
    //            }
    //        }
    //    }
    //
    //    Component *addComponent(Component *comp);
    //    void       removeComponent(Component *comp);
    //
    //    template <typename T, typename = std::enable_if_t<std::is_base_of<Component, T>::value>>
    //    Component *getComponent() const {
    //        for (auto *component : _components) {
    //            if (dynamic_cast<T *>(component) != nullptr) {
    //                return component;
    //            }
    //        }
    //        return nullptr;
    //    }
    //
    //    // TODO(Lenovo):
    //    template <typename T, typename std::enable_if_t<std::is_base_of<Component, T>::value>>
    //    std::vector<Component *> getComponents() const {
    //        // cjh TODO:
    //        CC_ASSERT(false);
    //        return {};
    //    };
    //
    //    template <typename T, typename std::enable_if_t<std::is_base_of<Component, T>::value>>
    //    Component *getComponentInChildren(const T & /*comp*/) const {
    //        // cjh TODO:
    //        CC_ASSERT(false);
    //        return nullptr;
    //    }
    //
    //    template <typename T, typename std::enable_if_t<std::is_base_of<Component, T>::value>>
    //    std::vector<Component *> getComponentsInChildren() const {
    //        // cjh TODO:
    //        CC_ASSERT(false);
    //        return {};
    //    }
    //
    //    inline std::vector<Component *> getComponents() const { return _components; }
    //
    //    void                     checkMultipleComp(Component *comp) {}
    //    std::vector<Component *> _components;
    //
    //    friend void componentCorrupted(Node *node, Component *comp, uint32_t index);
    // ------------------  Component code end -----------------------------

    // For deserialization
    //    void     _setChild(index_t i, Node *child);
    //    Node *   _getChild(index_t i);
    //    void     _setChildrenSize(uint32_t size);
    //    uint32_t _getChildrenSize();
    void _setChildren(std::vector<IntrusivePtr<Node>> &&children); // NOLINT
    // For JS wrapper.
    inline uint32_t getEventMask() const { return _eventMask; }
    inline void     setEventMask(uint32_t mask) { _eventMask = mask; }

protected:
    bool onPreDestroy() override;

    void onSetParent(Node *oldParent, bool keepWorldTransform);

    virtual void updateScene();

    void onHierarchyChanged(Node *);
    void onHierarchyChangedBase(Node *oldParent);

    virtual void onBatchCreated(bool dontChildPrefab);

    bool onPreDestroyBase();

    static uint32_t clearFrame;
    static uint32_t clearRound;

private:
    inline void notifyLocalPositionUpdated() {
        emit(EventTypesToJS::NODE_LOCAL_POSITION_UPDATED, _localPosition.x, _localPosition.y, _localPosition.z);
    }

    inline void notifyLocalRotationUpdated() {
        emit(EventTypesToJS::NODE_LOCAL_ROTATION_UPDATED, _localRotation.x, _localRotation.y, _localRotation.z, _localRotation.w);
    }

    inline void notifyLocalScaleUpdated() {
        emit(EventTypesToJS::NODE_LOCAL_SCALE_UPDATED, _localScale.x, _localScale.y, _localScale.z);
    }

    inline void notifyLocalPositionRotationScaleUpdated() {
        emit(EventTypesToJS::NODE_LOCAL_POSITION_ROTATION_SCALE_UPDATED,
             _localPosition.x, _localPosition.y, _localPosition.z,
             _localRotation.x, _localRotation.y, _localRotation.z, _localRotation.w,
             _localScale.x, _localScale.y, _localScale.z);
    }

protected:
    Scene *             _scene{nullptr};
    NodeEventProcessor *_eventProcessor{nullptr};

    uint32_t _eventMask{0};

    Mat4     _rtMat{Mat4::IDENTITY};
    cc::Mat4 _worldMatrix{Mat4::IDENTITY};

    uint32_t _flagChange{0};
    uint32_t _dirtyFlag{0};

    bool _eulerDirty{false};
    //    IntrusivePtr<NodeUiProperties> _uiProps;
    //    bool _activeInHierarchy{false};
    // Shared memory with JS.
    uint8_t * _activeInHierarchyArr{nullptr};
    uint32_t *_layerArr{nullptr};

public:
    std::function<void(index_t)> onSiblingIndexChanged{nullptr};
    index_t                      _siblingIndex{0};
    // For deserialization
    std::string                     _id;
    std::vector<IntrusivePtr<Node>> _children;
    Node *                          _parent{nullptr};
    bool                            _active{true};

private:
    // local transform
    cc::Vec3       _localPosition{Vec3::ZERO};
    cc::Quaternion _localRotation{Quaternion::identity()};
    cc::Vec3       _localScale{Vec3::ONE};
    // world transform
    cc::Vec3       _worldPosition{Vec3::ZERO};
    cc::Quaternion _worldRotation{Quaternion::identity()};
    cc::Vec3       _worldScale{Vec3::ONE};
    //
    Vec3 _euler{0, 0, 0};

    //

    IntrusivePtr<UserData> _userData;
    friend class NodeActivator;
    friend class Scene;

    // Used to shared memory of Node._uiProps._uiTransformDirty.
    uint32_t *_uiTransformDirty{nullptr};

    CC_DISALLOW_COPY_MOVE_ASSIGN(Node);
};

template <typename T>
bool Node::isNode(T *obj) {
    return dynamic_cast<Node *>(obj) != nullptr && dynamic_cast<Scene *>(obj) == nullptr;
}

template <typename... Args>
void Node::emit(const CallbacksInvoker::KeyType &type, Args &&...args) {
    _eventProcessor->emit(type, std::forward<Args>(args)...);
}

template <typename Target, typename... Args>
void Node::on(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture) {
    if (type == NodeEventType::TRANSFORM_CHANGED) {
        _eventMask |= TRANSFORM_ON;
    }
    _eventProcessor->on(type, memberFn, target, useCapture);
}

template <typename... Args>
void Node::on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool useCapture) {
    if (type == NodeEventType::TRANSFORM_CHANGED) {
        _eventMask |= TRANSFORM_ON;
    }
    _eventProcessor->on(type, std::forward<std::function<void(Args...)>>(callback), cbID, useCapture);
}

template <typename Target, typename... Args>
void Node::on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture) {
    if (type == NodeEventType::TRANSFORM_CHANGED) {
        _eventMask |= TRANSFORM_ON;
    }
    _eventProcessor->on(type, std::forward<std::function<void(Args...)>>(callback), target, cbID, useCapture);
}

template <typename Target, typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
Node::on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture) {
    if (type == NodeEventType::TRANSFORM_CHANGED) {
        _eventMask |= TRANSFORM_ON;
    }
    _eventProcessor->on(type, callback, target, cbID, useCapture);
}

template <typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
Node::on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, CallbackInfoBase::ID &cbID, bool useCapture) {
    if (type == NodeEventType::TRANSFORM_CHANGED) {
        _eventMask |= TRANSFORM_ON;
    }
    _eventProcessor->on(type, callback, cbID, useCapture);
}

template <typename... Args>
void Node::on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, bool useCapture) {
    CallbackInfoBase::ID unusedID{0};
    on(type, callback, unusedID, useCapture);
}

template <typename Target, typename... Args>
void Node::on(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, bool useCapture) {
    CallbackInfoBase::ID unusedID{0};
    on(type, callback, target, unusedID, useCapture);
}

template <typename Target, typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
Node::on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, bool useCapture) {
    CallbackInfoBase::ID unusedID{0};
    on(type, callback, target, unusedID, useCapture);
}

template <typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
Node::on(const CallbacksInvoker::KeyType &type, LambdaType &&callback, bool useCapture) {
    CallbackInfoBase::ID unusedID{0};
    on(type, callback, unusedID, useCapture);
}
template <typename Target, typename... Args>
void Node::once(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture) {
    _eventProcessor->once(type, memberFn, target, useCapture);
}
template <typename... Args>
void Node::once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &cbID, bool useCapture) {
    _eventProcessor->once(type, callback, cbID, useCapture);
}

template <typename Target, typename... Args>
void Node::once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture) {
    _eventProcessor->once(type, std::forward<std::function<void(Args...)>>(callback), target, cbID, useCapture);
}

template <typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
Node::once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, CallbackInfoBase::ID &cbID, bool useCapture) {
    _eventProcessor->once(type, callback, cbID, useCapture);
}

template <typename Target, typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
Node::once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, CallbackInfoBase::ID &cbID, bool useCapture) {
    _eventProcessor->once(type, callback, target, cbID, useCapture);
}

template <typename... Args>
void Node::once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, bool useCapture) {
    CallbackInfoBase::ID unusedID{0};
    once(type, callback, unusedID, useCapture);
}

template <typename Target, typename... Args>
void Node::once(const CallbacksInvoker::KeyType &type, std::function<void(Args...)> &&callback, Target *target, bool useCapture) {
    CallbackInfoBase::ID unusedID{0};
    once(type, callback, target, unusedID, useCapture);
}

template <typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
Node::once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, bool useCapture) {
    CallbackInfoBase::ID unusedID{0};
    once(type, callback, unusedID, useCapture);
}

template <typename Target, typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
Node::once(const CallbacksInvoker::KeyType &type, LambdaType &&callback, Target *target, bool useCapture) {
    CallbackInfoBase::ID unusedID{0};
    once(type, callback, target, unusedID, useCapture);
}

template <typename Target, typename... Args>
void Node::off(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target, bool useCapture) {
    _eventProcessor->off(type, memberFn, target, useCapture);
    bool hasListeners = _eventProcessor->hasEventListener(type);
    if (!hasListeners) {
        if (type == NodeEventType::TRANSFORM_CHANGED) {
            _eventMask &= ~TRANSFORM_ON;
        }
    }
}

template <typename Target, typename... Args>
bool Node::hasEventListener(const CallbacksInvoker::KeyType &type, void (Target::*memberFn)(Args...), Target *target) const {
    return _eventProcessor->hasEventListener(type, memberFn, target);
}

} // namespace cc
