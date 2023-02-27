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

#include "core/scene-graph/Scene.h"
#include "core/scene-graph/SceneGlobals.h"
// #include "core/Director.h"
#include "core/Root.h"
//#include "core/scene-graph/NodeActivator.h"
#include "engine/EngineEvents.h"

namespace cc {

Scene::Scene(const ccstd::string &name)
: Node(name) {
    // _activeInHierarchy is initalized to 'false', so doesn't need to set it to false again
    //    _activeInHierarchy = false;
    if (Root::getInstance() != nullptr) {
        _renderScene = Root::getInstance()->createScene({});
    }
    _globals = ccnew SceneGlobals();
}

Scene::Scene() : Scene("") {}

Scene::~Scene() = default;

void Scene::setSceneGlobals(SceneGlobals *globals) { _globals = globals; }

void Scene::load() {
    events::SceneLoad::broadcast();
    if (!_inited) {
        //cjh        if (TEST) {
        //            CC_ASSERT(!_activeInHierarchy, 'Should deactivate ActionManager by default');
        //        }
        // expandNestedPrefabInstanceNode(this); // TODO(xwx): expandNestedPrefabInstanceNode not implement yet
        // applyTargetOverrides(this); // TODO(xwx): applyTargetOverrides not implement yet
        //cjh _onBatchCreated is implemented in TS now, so comment the following line
        //        onBatchCreated(false); //cjh EDITOR && _prefabSyncedInLiveReload);
        _inited = true;
    }
    _scene = this;
    // static method can't use this as parameter type
    walk(Node::setScene);
}

void Scene::activate(bool active /* = true */) { // NOLINT(misc-unused-parameters)
#if CC_EDITOR
    this->notifyEditorAttached(active);
#endif
    //cjh
    //    Director::getInstance()->getNodeActivator()->activateNode(this, active);
    //     The test environment does not currently support the renderer
    //        if (!TEST) {
    _globals->activate(this);
    if (_renderScene) {
        _renderScene->activate();
    }
    //        }
}

void Scene::onBatchCreated(bool dontSyncChildPrefab) {
    // Moved from Node::onBatchCreated, Node::onBatchCreated only emits event to JS now.
    if (_parent) {
        index_t idx = getIdxOfChild(_parent->_children, this);
        if (idx != CC_INVALID_INDEX) {
            _siblingIndex = idx;
        }
    }
    //

    auto len = static_cast<int32_t>(_children.size());
    for (int32_t i = 0; i < len; ++i) {
        _children[i]->setSiblingIndex(i);
        _children[i]->onBatchCreated(dontSyncChildPrefab);
    }
}

bool Scene::destroy() {
    bool success = Super::destroy();
    if (success) {
        for (auto &child : _children) {
            child->setActive(false);
        }
    }

    if (_renderScene != nullptr) {
        Root::getInstance()->destroyScene(_renderScene);
    }

    _active = false;
    setActiveInHierarchy(false);
    return success;
}

} // namespace cc
