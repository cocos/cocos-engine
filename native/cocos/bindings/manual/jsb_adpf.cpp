/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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
*****************************************************************************/

#include "application/ApplicationManager.h"
#include "bindings/jswrapper/SeApi.h"

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include "platform/android/adpf_manager.h"
#endif

#if CC_PLATFORM == CC_PLATFORM_ANDROID && CC_SUPPORT_ADPF

struct VmCallback {
    uint32_t vmId{0xFEFEFEFE};
    se::Value *cbFn{nullptr};
    void reset() {
        vmId = 0xFEFEFEFE;
        delete cbFn;
        cbFn = nullptr;
    }
};
static VmCallback vmCallback;
static bool jsb_adpf_onThermalStatusChanged_set(se::State &state) { // NOLINT

    auto fn = state.args()[0];
    vmCallback.reset();
    if (fn.isNullOrUndefined()) {
        return true;
    }
    CC_ASSERT_TRUE(fn.toObject()->isFunction());
    auto *scriptEngine = se::ScriptEngine::getInstance();
    if (vmCallback.vmId != scriptEngine->getVMId()) {
        vmCallback.vmId = scriptEngine->getVMId();
        scriptEngine->addBeforeCleanupHook([]() {
            vmCallback.reset();
        });
    }

    vmCallback.cbFn = new se::Value(fn.toObject(), true);
    // NOLINTNEXTLINE
    ADPFManager::getInstance().setThermalListener(+[](int prevStatus, int currentStatus) {
        CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([=]() {
            se::AutoHandleScope scope;
            se::ValueArray args;
            args.push_back(se::Value(prevStatus));
            args.push_back(se::Value(currentStatus));
            args.push_back(se::Value(ATHERMAL_STATUS_NONE));
            args.push_back(se::Value(ATHERMAL_STATUS_SHUTDOWN));
            CC_ASSERT_EQ(vmCallback.vmId, se::ScriptEngine::getInstance()->getVMId());
            if (vmCallback.cbFn && vmCallback.cbFn->isObject() && vmCallback.cbFn->toObject()->isFunction()) {
                vmCallback.cbFn->toObject()->call(args, nullptr);
            }
        });
    });
    return true;
}
SE_BIND_PROP_SET(jsb_adpf_onThermalStatusChanged_set)

static bool jsb_adpf_onThermalStatusChanged_get(se::State &state) { // NOLINT
    if (!vmCallback.cbFn) {
        state.rval().setUndefined();
    } else {
        state.rval().setObject(vmCallback.cbFn->toObject());
    }
    return true;
}
SE_BIND_PROP_GET(jsb_adpf_onThermalStatusChanged_get)

static bool jsb_adpf_getThermalStatus(se::State &state) { // NOLINT
    int statusInt = ADPFManager::getInstance().getThermalStatus();
    state.rval().setUint32(statusInt);
    return true;
}
SE_BIND_PROP_GET(jsb_adpf_getThermalStatus)

static bool jsb_adpf_getThermalStatusMin(se::State &state) { // NOLINT
    state.rval().setUint32(ATHERMAL_STATUS_NONE);
    return true;
}
SE_BIND_PROP_GET(jsb_adpf_getThermalStatusMin)
static bool jsb_adpf_getThermalStatusMax(se::State &state) { // NOLINT
    state.rval().setUint32(ATHERMAL_STATUS_SHUTDOWN);
    return true;
}
SE_BIND_PROP_GET(jsb_adpf_getThermalStatusMax)

static bool jsb_adpf_getThermalStatusNormalized(se::State &state) { // NOLINT
    float statusNormalized = ADPFManager::getInstance().getThermalStatusNormalized();
    state.rval().setFloat(statusNormalized);
    return true;
}
SE_BIND_PROP_GET(jsb_adpf_getThermalStatusNormalized)
static bool jsb_adpf_getThermalHeadroom(se::State &state) { // NOLINT
    float headroom = ADPFManager::getInstance().getThermalHeadroom();
    state.rval().setFloat(headroom);
    return true;
}
SE_BIND_PROP_GET(jsb_adpf_getThermalHeadroom)

void jsb_register_ADPF(se::Object *ns) { // NOLINT
    se::Value adpfObj{se::Object::createPlainObject()};
    adpfObj.toObject()->defineProperty("thermalHeadroom", _SE(jsb_adpf_getThermalHeadroom), nullptr);
    adpfObj.toObject()->defineProperty("thermalStatus", _SE(jsb_adpf_getThermalStatus), nullptr);
    adpfObj.toObject()->defineProperty("thermalStatusMin", _SE(jsb_adpf_getThermalStatusMin), nullptr);
    adpfObj.toObject()->defineProperty("thermalStatusMax", _SE(jsb_adpf_getThermalStatusMax), nullptr);
    adpfObj.toObject()->defineProperty("thermalStatusNormalized", _SE(jsb_adpf_getThermalStatusNormalized), nullptr);
    adpfObj.toObject()->defineProperty("thermalHeadroom", _SE(jsb_adpf_getThermalHeadroom), nullptr);
    adpfObj.toObject()->defineProperty("onThermalStatusChanged", _SE(jsb_adpf_onThermalStatusChanged_get), _SE(jsb_adpf_onThermalStatusChanged_set));
    ns->setProperty("adpf", adpfObj);
}
#else
void jsb_register_ADPF(se::Object *ns) {} // NOLINT
#endif // CC_PLATFORM_ANDROID
