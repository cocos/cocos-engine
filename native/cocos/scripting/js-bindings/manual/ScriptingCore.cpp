/*
 * Copyright (c) 2017 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"

#include "cocos2d.h"

using namespace cocos2d;

ScriptingCore* ScriptingCore::getInstance()
{
    static ScriptingCore* instance = nullptr;
    if (instance == nullptr)
        instance = new (std::nothrow) ScriptingCore();

    return instance;
}

ScriptingCore::ScriptingCore()
: _callFromScript(false)
{

}

ScriptingCore::~ScriptingCore()
{

}

// Override functions

void ScriptingCore::retainScriptObject(Ref* owner, Ref* target)
{
    se::ScriptEngine::getInstance()->_retainScriptObject(owner, target);
}

void ScriptingCore::rootScriptObject(Ref* target)
{
    assert(false);
}

void ScriptingCore::releaseScriptObject(Ref* owner, Ref* target)
{
    se::ScriptEngine::getInstance()->_releaseScriptObject(owner, target);
}

void ScriptingCore::unrootScriptObject(Ref* target)
{
    assert(false);
}

void ScriptingCore::releaseAllChildrenRecursive(Node *node)
{
    const Vector<Node*>& children = node->getChildren();
    for (auto child : children)
    {
        releaseScriptObject(node, child);
        releaseAllChildrenRecursive(child);
    }
}

void ScriptingCore::releaseAllNativeRefs(Ref* owner)
{
    assert(false);
}

void ScriptingCore::removeScriptObjectByObject(Ref* obj)
{
    assert(false);
}

int ScriptingCore::executeGlobalFunction(const char* functionName)
{
    assert(false);
    return 0;
}

int ScriptingCore::sendEvent(cocos2d::ScriptEvent* evt)
{
    if (NULL == evt)
        return 0;

    // special type, can't use this code after JSAutoCompartment
    if (evt->type == kRestartGame)
    {
        restartVM();
        return 0;
    }

    switch (evt->type)
    {
        case kNodeEvent:
        {
            return handleNodeEvent(evt->data);
        }
            break;
//        case kScriptActionEvent:
//        {
//            return handleActionEvent(evt->data);
//        }
//            break;
//        case kMenuClickedEvent:
//            break;
//        case kTouchEvent:
//        {
//            TouchScriptData* data = (TouchScriptData*)evt->data;
//            return handleTouchEvent(data->nativeObject, data->actionType, data->touch, data->event);
//        }
//            break;
//        case kTouchesEvent:
//        {
//            TouchesScriptData* data = (TouchesScriptData*)evt->data;
//            return handleTouchesEvent(data->nativeObject, data->actionType, data->touches, data->event);
//        }
//            break;
//        case kComponentEvent:
//        {
//            return handleComponentEvent(evt->data);
//        }
//            break;
        default:
//            CCASSERT(false, "Invalid script event.");
            break;
    }

    return 0;
}

bool ScriptingCore::parseConfig(ConfigType type, const std::string& str)
{
    assert(false);
    return false;
}

// private methods

int ScriptingCore::handleNodeEvent(void* data)
{
    if (nullptr == data)
        return 0;

    BasicScriptData* basicScriptData = static_cast<BasicScriptData*>(data);
    if (nullptr == basicScriptData->nativeObject || nullptr == basicScriptData->value)
        return 0;

    void* node = basicScriptData->nativeObject;
    int action = *((int*)(basicScriptData->value));

    bool ret = false;
    if (action == kNodeOnEnter)
    {
        ret = se::ScriptEngine::getInstance()->_onReceiveNodeEvent(node, se::ScriptEngine::NodeEventType::ENTER);
    }
    else if (action == kNodeOnExit)
    {
        ret = se::ScriptEngine::getInstance()->_onReceiveNodeEvent(node, se::ScriptEngine::NodeEventType::EXIT);
    }
    else if (action == kNodeOnEnterTransitionDidFinish)
    {
        ret = se::ScriptEngine::getInstance()->_onReceiveNodeEvent(node, se::ScriptEngine::NodeEventType::ENTER_TRANSITION_DID_FINISH);
    }
    else if (action == kNodeOnExitTransitionDidStart)
    {
        ret = se::ScriptEngine::getInstance()->_onReceiveNodeEvent(node, se::ScriptEngine::NodeEventType::EXIT_TRANSITION_DID_START);
    }
    else if (action == kNodeOnCleanup)
    {
        ret = se::ScriptEngine::getInstance()->_onReceiveNodeEvent(node, se::ScriptEngine::NodeEventType::CLEANUP);
    }
    
    return ret ? 1 : 0;
}

void ScriptingCore::restartVM()
{
    se::ScriptEngine::getInstance()->cleanup();
    se::ScriptEngine::getInstance()->init();
    Application::getInstance()->applicationDidFinishLaunching();
}
