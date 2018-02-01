/*
 * Copyright (c) 2016 Chukong Technologies Inc.
 * Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
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

#ifndef __SCRIPTING_CORE_H__
#define __SCRIPTING_CORE_H__

#include "base/CCScriptSupport.h"

/**
 * @addtogroup jsb
 * @{
 */

/**
 * @brief @~english ScriptingCore is the main class which manages interaction with JavaScript environment
 * @details @~english It creates the JavaScript context and its global object.
 * It also manages object bindings between C++ scope and JavaScript scope,
 * for most cocos2d classes, if you create an object in JavaScript scope, it will also create a C++ object,
 * ScriptingCore will manage a proxy between them and synchronize the life cycle.
 * It can:
 * - Execute JavaScript functions in different ways with different parameters
 * - Evaluate JavaScript commands or string
 * - Execute a JavaScript file
 * - Clean a JavaScript file cache
 * - Clean all JavaScript files
 * - Cleanup or reset the JavaScript context
 * - Invoke garbage collection of JavaScript context
 * - etc...
 */
class ScriptingCore : public cocos2d::ScriptEngineProtocol
{
public:
    virtual ~ScriptingCore();

    /**@~english
     * ScriptingCore is a singleton class, you can retrieve its instance with this function.
     * @return @~english The ScriptingCore instance.
     */
    static ScriptingCore *getInstance();
    
    /**@~english
     * Gets the script type, for ScriptingCore, it will return `cocos2d::kScriptTypeJavascript`
     * @return `cocos2d::kScriptTypeJavascript`
     */
    virtual cocos2d::ccScriptType getScriptType() override { return cocos2d::kScriptTypeJavascript; };
    
    /**
     * Reflect the retain relationship to script scope
     */
    virtual void retainScriptObject(cocos2d::Ref* owner, cocos2d::Ref* target) override;
    
    /**
     * Add the script object to root object
     */
    virtual void rootScriptObject(cocos2d::Ref* target) override;
    
    /**
     * Reflect the release relationship to script scope
     */
    virtual void releaseScriptObject(cocos2d::Ref* owner, cocos2d::Ref* target) override;
    
    /**
     * Remove the script object from root object
     */
    virtual void unrootScriptObject(cocos2d::Ref* target) override;
    
    /**
     * Release all children in script scope
     */
    virtual void releaseAllChildrenRecursive(cocos2d::Node *node) override;
    
    /**
     * Release all native refs for the given owner in script scope
     */
    virtual void releaseAllNativeRefs(cocos2d::Ref* owner) override;
    
    /**
     * @brief @~english Removes the C++ object's linked JavaScript proxy object from JavaScript context
     * @param obj @~english Object to be removed
     */
    virtual void removeScriptObjectByObject(cocos2d::Ref* obj) override;
    
    /**
     * @brief @~english Useless in ScriptingCore, please use evalString
     * @see evalString
     */
    virtual int executeString(const char* codes) override { return 0; }

    /**
     @brief Useless in ScriptingCore, please use runScript
     @param filename String object holding the filename of the script file that is to be executed
     */
    virtual  int executeScriptFile(const char* filename) override { return 0; }

    /**
     @brief @~english Useless in ScriptingCore, please use executeFunctionWithOwner
     @param functionName String object holding the name of the function, in the global script environment, that is to be executed.
     @return The integer value returned from the script function.
     */
    virtual int executeGlobalFunction(const char* functionName) override;

    virtual int sendEvent(cocos2d::ScriptEvent* message) override;
    
    virtual bool parseConfig(ConfigType type, const std::string& str) override;
    /**
     * @brief @~english Useless in ScriptingCore
     * @return @~english false
     */
    virtual bool handleAssert(const char *msg) override { return false; }

    virtual void setCalledFromScript(bool callFromScript) override { _callFromScript = callFromScript; };
    virtual bool isCalledFromScript() override { return _callFromScript; };

    void restartVM();

    enum class NodeEventType
    {
        ENTER,
        EXIT,
        ENTER_TRANSITION_DID_FINISH,
        EXIT_TRANSITION_DID_START,
        CLEANUP
    };

    using NodeEventListener = bool(*)(void*, NodeEventType);
    bool setNodeEventListener(NodeEventListener listener);

private:
    ScriptingCore();

    int handleActionEvent(void* data);
    int handleNodeEvent(void* data);

    NodeEventListener _nodeEventListener;
    bool _callFromScript;
};

#endif /* __SCRIPTING_CORE_H__ */
