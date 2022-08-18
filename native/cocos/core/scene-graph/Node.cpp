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

#include "core/scene-graph/Node.h"
#include "base/StringUtil.h"
#include "core/data/Object.h"
#include "core/memop/CachedArray.h"
#include "core/platform/Debug.h"
#include "core/scene-graph/NodeEnum.h"
#include "core/scene-graph/Scene.h"
#include "core/utils/IDGenerator.h"
#include "math/Utils.h"

namespace cc {

// static variables

uint32_t Node::clearFrame{0};
uint32_t Node::clearRound{1000};
const uint32_t Node::TRANSFORM_ON{1 << 0};
uint32_t Node::globalFlagChangeVersion{0};

namespace {
const ccstd::string EMPTY_NODE_NAME;
IDGenerator idGenerator("Node");
} // namespace

Node::Node() : Node(EMPTY_NODE_NAME) {
}

Node::Node(const ccstd::string &name) {
#define NODE_SHARED_MEMORY_BYTE_LENGTH (20)
    static_assert(offsetof(Node, _padding) + sizeof(_padding) - offsetof(Node, _eventMask) == NODE_SHARED_MEMORY_BYTE_LENGTH, "Wrong shared memory size");
    _sharedMemoryActor.initialize(&_eventMask, NODE_SHARED_MEMORY_BYTE_LENGTH);
#undef NODE_SHARED_MEMORY_BYTE_LENGTH

    _id = idGenerator.getNewId();
    if (name.empty()) {
        _name.append("New Node");
    } else {
        _name = name;
    }
    _eventProcessor = ccnew NodeEventProcessor(this);
}

Node::~Node() {
    CC_SAFE_DELETE(_eventProcessor);
}

void Node::onBatchCreated(bool dontChildPrefab) {
    // onBatchCreated was implemented in TS, so code should never go here.
    CC_ASSERT(false);
    emit(EventTypesToJS::NODE_ON_BATCH_CREATED, dontChildPrefab);
}

Node *Node::instantiate(Node *cloned, bool isSyncedNode) {
    if (!cloned) {
        CC_ASSERT(false);
        // TODO(): cloned = legacyCC.instantiate._clone(this, this);
        return nullptr;
    }
    // TODO():
    // const newPrefabInfo = cloned._prefab;
    // if (EDITOR && newPrefabInfo) {
    //    if (cloned == = newPrefabInfo.root) {
    //        // newPrefabInfo.fileId = '';
    //    } else {
    //        // var PrefabUtils = Editor.require('scene://utils/prefab');
    //        // PrefabUtils.unlinkPrefab(cloned);
    //    }
    //}
    // if (EDITOR && legacyCC.GAME_VIEW) {
    //    const syncing = newPrefabInfo&& cloned == = newPrefabInfo.root && newPrefabInfo.sync;
    //    if (!syncing) {
    //        cloned._name += ' (Clone)';
    //    }
    //}
    cloned->_parent = nullptr;
    cloned->onBatchCreated(isSyncedNode);
    return cloned;
}

void Node::onHierarchyChangedBase(Node *oldParent) { // NOLINT(misc-unused-parameters)
    Node *newParent = _parent;
    auto *scene = dynamic_cast<Scene *>(newParent);
    if (isPersistNode() && scene == nullptr) {
        emit(EventTypesToJS::NODE_REMOVE_PERSIST_ROOT_NODE);
#if CC_EDITOR
        debug::warnID(1623);
#endif
    }
#if CC_EDITOR
    auto *curScene = getScene();
    const bool inCurrentSceneBefore = oldParent && oldParent->isChildOf(curScene);
    const bool inCurrentSceneNow = newParent && newParent->isChildOf(curScene);
    if (!inCurrentSceneBefore && inCurrentSceneNow) {
        // attached
        this->notifyEditorAttached(true);
    } else if (inCurrentSceneBefore && !inCurrentSceneNow) {
        // detached
        this->notifyEditorAttached(false);
    }
    // conflict detection
    // _Scene.DetectConflict.afterAddChild(this);
#endif

    bool shouldActiveNow = isActive() && !!(newParent && newParent->isActiveInHierarchy());
    if (isActiveInHierarchy() != shouldActiveNow) {
        // Director::getInstance()->getNodeActivator()->activateNode(this, shouldActiveNow); // TODO(xwx): use TS temporarily
        emit(EventTypesToJS::NODE_ACTIVE_NODE, shouldActiveNow);
    }
}

void Node::off(const CallbacksInvoker::KeyType &type, bool useCapture) {
    _eventProcessor->offAll(type, useCapture);
    bool hasListeners = _eventProcessor->hasEventListener(type);
    if (!hasListeners) {
        if (type == NodeEventType::TRANSFORM_CHANGED) {
            _eventMask &= ~TRANSFORM_ON;
        }
    }
}

void Node::off(const CallbacksInvoker::KeyType &type, const CallbackID &cbID, bool useCapture) {
    _eventProcessor->off(type, cbID, useCapture);
    bool hasListeners = _eventProcessor->hasEventListener(type);
    if (!hasListeners) {
        if (type == NodeEventType::TRANSFORM_CHANGED) {
            _eventMask &= ~TRANSFORM_ON;
        }
    }
}

void Node::off(const CallbacksInvoker::KeyType &type, void *target, bool useCapture) {
    _eventProcessor->off(type, target, useCapture);
    bool hasListeners = _eventProcessor->hasEventListener(type);
    if (!hasListeners) {
        if (type == NodeEventType::TRANSFORM_CHANGED) {
            _eventMask &= ~TRANSFORM_ON;
        }
    }
}

//void Node::dispatchEvent(event::Event *eve) {
//    _eventProcessor->dispatchEvent(eve);
//}

bool Node::hasEventListener(const CallbacksInvoker::KeyType &type) const {
    return _eventProcessor->hasEventListener(type);
}

bool Node::hasEventListener(const CallbacksInvoker::KeyType &type, const CallbackID &cbID) const {
    return _eventProcessor->hasEventListener(type, cbID);
}
bool Node::hasEventListener(const CallbacksInvoker::KeyType &type, void *target) const {
    return _eventProcessor->hasEventListener(type, target);
}
bool Node::hasEventListener(const CallbacksInvoker::KeyType &type, void *target, const CallbackID &cbID) const {
    return _eventProcessor->hasEventListener(type, target, cbID);
}

void Node::targetOff(const CallbacksInvoker::KeyType &type) {
    _eventProcessor->targetOff(type);
    if ((_eventMask & TRANSFORM_ON) && !_eventProcessor->hasEventListener(NodeEventType::TRANSFORM_CHANGED)) {
        _eventMask &= ~TRANSFORM_ON;
    }
}

void Node::setActive(bool isActive) {
    uint8_t isActiveU8 = isActive ? 1 : 0;
    if (_active != isActiveU8) {
        _active = isActiveU8;
        Node *parent = _parent;
        if (parent) {
            bool couldActiveInScene = parent->isActiveInHierarchy();
            if (couldActiveInScene) {
                // Director::getInstance()->getNodeActivator()->activateNode(this, isActive); // TODO(xwx): use TS temporarily
                emit(EventTypesToJS::NODE_ACTIVE_NODE, isActive);
            }
        }
    }
}

void Node::setParent(Node *parent, bool isKeepWorld /* = false */) {
    if (isKeepWorld) {
        updateWorldTransform();
    }

    if (_parent == parent) {
        return;
    }

    Node *oldParent = _parent;
    Node *newParent = parent;
#if CC_DEBUG > 0
    if (oldParent && (oldParent->_objFlags & Flags::DEACTIVATING) == Flags::DEACTIVATING) {
        debug::errorID(3821);
    }
#endif
    _parent = newParent;
    _siblingIndex = 0;
    onSetParent(oldParent, isKeepWorld);
    emit(NodeEventType::PARENT_CHANGED, oldParent);
    if (oldParent) {
        if (!(oldParent->_objFlags & Flags::DESTROYING)) {
            index_t removeAt = getIdxOfChild(oldParent->_children, this);
            // TODO(): DEV
            /*if (DEV && removeAt < 0) {
                errorID(1633);
                return;
            }*/
            if (removeAt < 0) {
                return;
            }
            oldParent->_children.erase(oldParent->_children.begin() + removeAt);
            oldParent->updateSiblingIndex();
            oldParent->emit(NodeEventType::CHILD_REMOVED, this);
        }
    }
    if (newParent) {
#if CC_DEBUG > 0
        if ((newParent->_objFlags & Flags::DEACTIVATING) == Flags::DEACTIVATING) {
            debug::errorID(3821);
        }
#endif
        newParent->_children.emplace_back(this);
        _siblingIndex = static_cast<index_t>(newParent->_children.size() - 1);
        newParent->emit(NodeEventType::CHILD_ADDED, this);
    }
    onHierarchyChanged(oldParent);
}

void Node::walk(const WalkCallback &preFunc) {
    walk(preFunc, nullptr);
}

void Node::walk(const WalkCallback &preFunc, const WalkCallback &postFunc) { //NOLINT(misc-no-recursion)
    if (preFunc) {
        preFunc(this);
    }

    for (const auto &child : _children) {
        if (child) {
            child->walk(preFunc, postFunc);
        }
    }

    if (postFunc) {
        postFunc(this);
    }
}

//Component *Node::addComponent(Component *comp) {
//    comp->_node = this; // cjh TODO: shared_ptr
//    _components.emplace_back(comp);
//
//    if (isActiveInHierarchy()) {
//        NodeActivator::activateComp(comp);
//    }
//
//    return comp;
//}
//
//void Node::removeComponent(Component *comp) {
//    auto iteComp = std::find(_components.begin(), _components.end(), comp);
//    if (iteComp != _components.end()) {
//        _components.erase(iteComp);
//    }
//}

bool Node::onPreDestroyBase() {
    Flags destroyingFlag = Flags::DESTROYING;
    _objFlags |= destroyingFlag;
    bool destroyByParent = (!!_parent) && (!!(_parent->_objFlags & destroyingFlag));
#if CC_EDITOR
    if (!destroyByParent) {
        this->notifyEditorAttached(false);
    }
#endif
    if (isPersistNode()) {
        emit(EventTypesToJS::NODE_REMOVE_PERSIST_ROOT_NODE);
    }
    if (!destroyByParent) {
        if (_parent) {
            emit(NodeEventType::PARENT_CHANGED, this);
            index_t childIdx = getIdxOfChild(_parent->_children, this);
            if (childIdx != -1) {
                _parent->_children.erase(_parent->_children.begin() + childIdx);
            }
            _siblingIndex = 0;
            _parent->updateSiblingIndex();
            _parent->emit(NodeEventType::CHILD_REMOVED, this);
        }
    }

    //NOTE: The following code is not needed now since we override Node._onPreDestroy in node.jsb.ts
    // and the logic will be done in TS.
    //    emit(NodeEventType::NODE_DESTROYED, this);
    //    for (const auto &child : _children) {
    //        child->destroyImmediate();
    //    }
    //
    //    emit(EventTypesToJS::NODE_DESTROY_COMPONENTS);

    _eventProcessor->destroy();
    return destroyByParent;
}

Node *Node::getChildByName(const ccstd::string &name) const {
    if (name.empty()) {
        CC_LOG_INFO("Invalid name");
        return nullptr;
    }
    for (const auto &child : _children) {
        if (child->_name == name) {
            return child;
        }
    }
    return nullptr;
}

void Node::setScene(Node *node) {
    node->updateScene();
}

void Node::updateScene() {
    if (_parent == nullptr) {
        return;
    }
    _scene = _parent->_scene;
    emit(EventTypesToJS::NODE_SCENE_UPDATED, _scene);
}

/* static */
index_t Node::getIdxOfChild(const ccstd::vector<IntrusivePtr<Node>> &child, Node *target) {
    auto iteChild = std::find(child.begin(), child.end(), target);
    if (iteChild != child.end()) {
        return static_cast<index_t>(iteChild - child.begin());
    }
    return CC_INVALID_INDEX;
}

Node *Node::getChildByUuid(const ccstd::string &uuid) const {
    if (uuid.empty()) {
        CC_LOG_INFO("Invalid uuid");
        return nullptr;
    }
    for (const auto &child : _children) {
        if (child->_id == uuid) {
            return child;
        }
    }
    return nullptr;
}

bool Node::isChildOf(Node *parent) const {
    const Node *child = this;
    do {
        if (child == parent) {
            return true;
        }
        child = child->_parent;
    } while (child);
    return false;
}

void Node::removeAllChildren() {
    for (auto i = static_cast<index_t>(_children.size() - 1); i >= 0; --i) {
        if (_children[i]) {
            _children[i]->setParent(nullptr);
        }
    }
    _children.clear();
}

void Node::setSiblingIndex(index_t index) {
    if (!_parent) {
        return;
    }
    if (!!(_parent->_objFlags & Flags::DEACTIVATING)) {
        debug::errorID(3821);
        return;
    }
    ccstd::vector<IntrusivePtr<Node>> &siblings = _parent->_children;
    index = index != -1 ? index : static_cast<index_t>(siblings.size()) - 1;
    index_t oldIdx = getIdxOfChild(siblings, this);
    if (index != oldIdx) {
        if (oldIdx != CC_INVALID_INDEX) {
            siblings.erase(siblings.begin() + oldIdx);
        }
        if (index < siblings.size()) {
            siblings.insert(siblings.begin() + index, this);
        } else {
            siblings.emplace_back(this);
        }
        _parent->updateSiblingIndex();
        if (onSiblingIndexChanged != nullptr) {
            onSiblingIndexChanged(index);
        }
    }
}

Node *Node::getChildByPath(const ccstd::string &path) const {
    size_t end = 0;
    ccstd::vector<ccstd::string> segments = StringUtil::split(path, "/");
    auto *lastNode = const_cast<Node *>(this);
    for (const ccstd::string &segment : segments) {
        if (segment.empty()) {
            continue;
        }
        Node *next{nullptr};
        if (lastNode) {
            for (const auto &child : lastNode->_children) {
                if (child->_name == segment) {
                    next = child;
                    break;
                }
            }
            lastNode = next;
        } else {
            break;
        }
    }
    return lastNode;
}

//
void Node::setPositionInternal(float x, float y, float z, bool calledFromJS) {
    _localPosition.set(x, y, z);
    invalidateChildren(TransformBit::POSITION);

    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::POSITION);
    }

    if (!calledFromJS) {
        notifyLocalPositionUpdated();
    }
}

void Node::setRotationInternal(float x, float y, float z, float w, bool calledFromJS) {
    _localRotation.set(x, y, z, w);
    _eulerDirty = true;

    invalidateChildren(TransformBit::ROTATION);

    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::ROTATION);
    }

    if (!calledFromJS) {
        notifyLocalRotationUpdated();
    }
}

void Node::setRotationFromEuler(float x, float y, float z) {
    _euler.set(x, y, z);
    Quaternion::fromEuler(x, y, z, &_localRotation);
    _eulerDirty = false;
    invalidateChildren(TransformBit::ROTATION);
    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::ROTATION);
    }

    notifyLocalRotationUpdated();
}

void Node::setScaleInternal(float x, float y, float z, bool calledFromJS) {
    _localScale.set(x, y, z);

    invalidateChildren(TransformBit::SCALE);
    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::SCALE);
    }

    if (!calledFromJS) {
        notifyLocalScaleUpdated();
    }
}
void Node::updateWorldTransform() { //NOLINT(misc-no-recursion)
    uint32_t dirtyBits = 0;
    updateWorldTransformRecursive(dirtyBits);
}

void Node::updateWorldTransformRecursive(uint32_t &dirtyBits) { //NOLINT(misc-no-recursion)
    const uint32_t currDirtyBits = getDirtyFlag();
    if (!currDirtyBits) {
        return;
    }

    Node *parent = getParent();
    if (parent && parent->getDirtyFlag()) {
        parent->updateWorldTransformRecursive(dirtyBits);
    }
    dirtyBits |= currDirtyBits;
    if (parent) {
        if (dirtyBits & static_cast<uint32_t>(TransformBit::POSITION)) {
            _worldPosition.transformMat4(_localPosition, parent->_worldMatrix);
            _worldMatrix.m[12] = _worldPosition.x;
            _worldMatrix.m[13] = _worldPosition.y;
            _worldMatrix.m[14] = _worldPosition.z;
        }
        if (dirtyBits & static_cast<uint32_t>(TransformBit::RS)) {
            Mat4::fromRTS(_localRotation, _localPosition, _localScale, &_worldMatrix);
            Mat4::multiply(parent->_worldMatrix, _worldMatrix, &_worldMatrix);
            if (dirtyBits & static_cast<uint32_t>(TransformBit::ROTATION)) {
                Quaternion::multiply(parent->_worldRotation, _localRotation, &_worldRotation);
            }
            Quaternion quat = _worldRotation;
            quat.conjugate();
            Mat3 m3Out(quat);
            Mat3 m32WorldMat(_worldMatrix);
            Mat3::multiply(m3Out, m32WorldMat, &m3Out);
            _worldScale.set(m3Out.m[0], m3Out.m[4], m3Out.m[8]);
        }
    } else {
        if (dirtyBits & static_cast<uint32_t>(TransformBit::POSITION)) {
            _worldPosition.set(_localPosition);
            _worldMatrix.m[12] = _worldPosition.x;
            _worldMatrix.m[13] = _worldPosition.y;
            _worldMatrix.m[14] = _worldPosition.z;
        }
        if (dirtyBits & static_cast<uint32_t>(TransformBit::RS)) {
            if (dirtyBits & static_cast<uint32_t>(TransformBit::ROTATION)) {
                _worldRotation.set(_localRotation);
            }
            if (dirtyBits & static_cast<uint32_t>(TransformBit::SCALE)) {
                _worldScale.set(_localScale);
                Mat4::fromRTS(_worldRotation, _worldPosition, _worldScale, &_worldMatrix);
            }
        }
    }
    setDirtyFlag(static_cast<uint32_t>(TransformBit::NONE));
}

const Mat4 &Node::getWorldMatrix() const { //NOLINT(misc-no-recursion)
    const_cast<Node *>(this)->updateWorldTransform();
    return _worldMatrix;
}

Mat4 Node::getWorldRS() {
    updateWorldTransform();
    Mat4 target{_worldMatrix};
    target.m[12] = target.m[13] = target.m[14] = 0;
    return target;
}

Mat4 Node::getWorldRT() {
    updateWorldTransform();
    Mat4 target;
    Mat4::fromRT(_worldRotation, _worldPosition, &target);
    return target;
}

void Node::invalidateChildren(TransformBit dirtyBit) { //NOLINT(misc-no-recursion)
    auto curDirtyBit{static_cast<uint32_t>(dirtyBit)};
    const uint32_t hasChangedFlags = getChangedFlags();
    const uint32_t dirtyFlags = getDirtyFlag();
    if (isValid() && (dirtyFlags & hasChangedFlags & curDirtyBit) != curDirtyBit) {
        setDirtyFlag(dirtyFlags | curDirtyBit);
        setChangedFlags(hasChangedFlags | curDirtyBit);

        for (Node *child : getChildren()) {
            child->invalidateChildren(dirtyBit | TransformBit::POSITION);
        }
    }
}

void Node::setWorldPosition(float x, float y, float z) {
    _worldPosition.set(x, y, z);
    if (_parent) {
        _parent->updateWorldTransform();
        Mat4 invertWMat{_parent->_worldMatrix};
        invertWMat.inverse();
        _localPosition.transformMat4(_worldPosition, invertWMat);
    } else {
        _localPosition.set(_worldPosition);
    }
    notifyLocalPositionUpdated();

    invalidateChildren(TransformBit::POSITION);

    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::POSITION);
    }
}

const Vec3 &Node::getWorldPosition() const {
    const_cast<Node *>(this)->updateWorldTransform();
    return _worldPosition;
}

void Node::setWorldRotation(float x, float y, float z, float w) {
    _worldRotation.set(x, y, z, w);
    if (_parent) {
        _parent->updateWorldTransform();
        _localRotation.set(_parent->_worldRotation.getConjugated());
        _localRotation.multiply(_worldRotation);
    } else {
        _localRotation.set(_worldRotation);
    }

    _eulerDirty = true;

    invalidateChildren(TransformBit::ROTATION);

    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::ROTATION);
    }

    notifyLocalRotationUpdated();
}

const Quaternion &Node::getWorldRotation() const { //NOLINT(misc-no-recursion)
    const_cast<Node *>(this)->updateWorldTransform();
    return _worldRotation;
}

void Node::setWorldScale(float x, float y, float z) {
    _worldScale.set(x, y, z);
    if (_parent != nullptr) {
        _parent->updateWorldTransform();
        Mat3 mat3;
        Mat3::fromQuat(_parent->_worldRotation.getConjugated(), &mat3);
        Mat3 b;
        Mat3::fromMat4(_parent->_worldMatrix, &b);
        Mat3::multiply(mat3, b, &mat3);
        Mat3 mat3Scaling;
        mat3Scaling.m[0] = _worldScale.x;
        mat3Scaling.m[4] = _worldScale.y;
        mat3Scaling.m[8] = _worldScale.z;

        mat3.inverse();
        Mat3::multiply(mat3Scaling, mat3, &mat3);
        _localScale.x = Vec3{mat3.m[0], mat3.m[1], mat3.m[2]}.length();
        _localScale.y = Vec3{mat3.m[3], mat3.m[4], mat3.m[5]}.length();
        _localScale.z = Vec3{mat3.m[6], mat3.m[7], mat3.m[8]}.length();
    } else {
        _localScale = _worldScale;
    }

    notifyLocalScaleUpdated();

    invalidateChildren(TransformBit::SCALE);
    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::SCALE);
    }
}

const Vec3 &Node::getWorldScale() const {
    const_cast<Node *>(this)->updateWorldTransform();
    return _worldScale;
}

void Node::setForward(const Vec3 &dir) {
    const float len = dir.length();
    Vec3 v3Temp = dir * (-1.F / len);
    Quaternion qTemp{Quaternion::identity()};
    Quaternion::fromViewUp(v3Temp, &qTemp);
    setWorldRotation(qTemp);
}

void Node::setAngle(float val) {
    _euler.set(0, 0, val);
    Quaternion::createFromAngleZ(val, &_localRotation);
    _eulerDirty = false;
    invalidateChildren(TransformBit::ROTATION);
    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::ROTATION);
    }

    notifyLocalRotationUpdated();
}

void Node::onSetParent(Node *oldParent, bool keepWorldTransform) {
    if (_parent) {
        if ((oldParent == nullptr || oldParent->_scene != _parent->_scene) && _parent->_scene != nullptr) {
            walk(setScene);
        }
    }

    if (keepWorldTransform) {
        if (_parent) {
            _parent->updateWorldTransform();
            if (mathutils::approx<float>(_parent->_worldMatrix.determinant(), 0.F, mathutils::EPSILON)) {
                CC_LOG_WARNING("14300");
                _dirtyFlag |= static_cast<uint32_t>(TransformBit::TRS);
                updateWorldTransform();
            } else {
                Mat4 tmpMat4 = _parent->_worldMatrix.getInversed() * _worldMatrix;
                Mat4::toRTS(tmpMat4, &_localRotation, &_localPosition, &_localScale);
            }
        } else {
            _localPosition.set(_worldPosition);
            _localRotation.set(_worldRotation);
            _localScale.set(_worldScale);
        }

        notifyLocalPositionRotationScaleUpdated();
        _eulerDirty = true;
    }
    invalidateChildren(TransformBit::TRS);
}

void Node::rotate(const Quaternion &rot, NodeSpace ns /* = NodeSpace::LOCAL*/, bool calledFromJS /* = false*/) {
    Quaternion qTempA{rot};
    qTempA.normalize();
    if (ns == NodeSpace::LOCAL) {
        _localRotation *= qTempA;
    } else if (ns == NodeSpace::WORLD) {
        Quaternion qTempB{Quaternion::identity()};
        qTempB = qTempA * getWorldRotation();
        qTempA = _worldRotation;
        qTempA.inverse();
        qTempB = qTempA * qTempB;
        _localRotation = _localRotation * qTempB;
    }
    _eulerDirty = true;
    invalidateChildren(TransformBit::ROTATION);
    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::ROTATION);
    }

    if (!calledFromJS) {
        notifyLocalRotationUpdated();
    }
}

void Node::lookAt(const Vec3 &pos, const Vec3 &up) {
    Vec3 vTemp = getWorldPosition();
    Quaternion qTemp{Quaternion::identity()};
    vTemp -= pos;
    vTemp.normalize();
    Quaternion::fromViewUp(vTemp, up, &qTemp);
    setWorldRotation(qTemp);
}

Vec3 Node::inverseTransformPoint(const Vec3 &p) { //NOLINT(misc-no-recursion)
    Vec3 out(p);
    inverseTransformPointRecursive(out);
    return out;
}

void Node::inverseTransformPointRecursive(Vec3 &out) const { //NOLINT(misc-no-recursion)
    auto *parent = getParent();
    if (!parent) {
        return;
    }
    parent->inverseTransformPointRecursive(out);
    Vec3::transformInverseRTS(out, getRotation(), getPosition(), getScale(), &out);
}

void Node::setMatrix(const Mat4 &val) {
    val.decompose(&_localScale, &_localRotation, &_localPosition);
    notifyLocalPositionRotationScaleUpdated();

    invalidateChildren(TransformBit::TRS);
    _eulerDirty = true;
    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::TRS);
    }
}

void Node::setWorldRotationFromEuler(float x, float y, float z) {
    Quaternion::fromEuler(x, y, z, &_worldRotation);
    if (_parent) {
        _parent->updateWorldTransform();
        _localRotation = _parent->_worldRotation.getConjugated() * _worldRotation;
    } else {
        _localRotation = _worldRotation;
    }
    _eulerDirty = true;

    invalidateChildren(TransformBit::ROTATION);
    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::ROTATION);
    }

    notifyLocalRotationUpdated();
}

void Node::setRTSInternal(Quaternion *rot, Vec3 *pos, Vec3 *scale, bool calledFromJS) {
    uint32_t dirtyBit = 0;
    if (rot) {
        dirtyBit |= static_cast<uint32_t>(TransformBit::ROTATION);
        _localRotation = *rot;
        _eulerDirty = true;
    }
    if (pos) {
        _localPosition = *pos;
        dirtyBit |= static_cast<uint32_t>(TransformBit::POSITION);
    }
    if (scale) {
        _localScale = *scale;
        dirtyBit |= static_cast<uint32_t>(TransformBit::SCALE);
    }

    if (!calledFromJS) {
        notifyLocalPositionRotationScaleUpdated();
    }

    if (dirtyBit) {
        invalidateChildren(static_cast<TransformBit>(dirtyBit));
        if (_eventMask & TRANSFORM_ON) {
            emit(NodeEventType::TRANSFORM_CHANGED, dirtyBit);
        }
    }
}

void Node::resetChangedFlags() {
    globalFlagChangeVersion++;
}

void Node::clearNodeArray() {
    if (clearFrame < clearRound) {
        clearFrame++;
    } else {
        clearFrame = 0;
    }
}

ccstd::string Node::getPathInHierarchy() const {
    ccstd::string result = getName();
    Node *curNode = getParent();
    while (curNode && curNode->getParent()) {
        result.insert(0, "/").insert(0, curNode->getName());
        curNode = curNode->getParent();
    }
    return result;
}

void Node::translate(const Vec3 &trans, NodeSpace ns) {
    Vec3 v3Temp{trans};
    if (ns == NodeSpace::LOCAL) {
        v3Temp.transformQuat(_localRotation);
        _localPosition.x += v3Temp.x;
        _localPosition.y += v3Temp.y;
        _localPosition.z += v3Temp.z;
    } else if (ns == NodeSpace::WORLD) {
        if (_parent) {
            Quaternion qTemp = _parent->getWorldRotation();
            qTemp.inverse();
            v3Temp.transformQuat(qTemp);
            Vec3 scale{_worldScale};
            _localPosition.x += v3Temp.x / scale.x;
            _localPosition.y += v3Temp.y / scale.y;
            _localPosition.z += v3Temp.z / scale.z;
        } else {
            _localPosition.x += trans.x;
            _localPosition.y += trans.y;
            _localPosition.z += trans.z;
        }
    }

    notifyLocalPositionUpdated();

    invalidateChildren(TransformBit::POSITION);
    if (_eventMask & TRANSFORM_ON) {
        emit(NodeEventType::TRANSFORM_CHANGED, TransformBit::POSITION);
    }
}

bool Node::onPreDestroy() {
    bool result = onPreDestroyBase();
    // TODO(Lenovo): bookOfChange free
    return result;
}

void Node::onHierarchyChanged(Node *oldParent) {
    emit(EventTypesToJS::NODE_REATTACH);
    _eventProcessor->reattach();
    onHierarchyChangedBase(oldParent);
}

/* static */
//Node *Node::find(const ccstd::string &path, Node *referenceNode /* = nullptr*/) {
//    return cc::find(path, referenceNode);
//}

// For deserialization
// void Node::_setChild(index_t i, Node *child) {
//    if (i < _children.size()) {
//        _children[i] = child;
//    } else {
//        CC_LOG_ERROR("Invalid index (%d) for Node children (size: %u)", i, static_cast<uint32_t>(_children.size()));
//    }
//}
//
// Node *Node::_getChild(index_t i) {
//    if (i < _children.size()) {
//        return _children[i];
//    }
//    CC_LOG_ERROR("Invalid index (%d) for Node children (size: %u)", i, static_cast<uint32_t>(_children.size()));
//    return nullptr;
//}
//
// void Node::_setChildrenSize(uint32_t size) {
//    _children.resize(size);
//}
//
// uint32_t Node::_getChildrenSize() {
//    return _children.size();
//}
//
void Node::_setChildren(ccstd::vector<IntrusivePtr<Node>> &&children) {
    _children = std::move(children);
}

//

} // namespace cc
