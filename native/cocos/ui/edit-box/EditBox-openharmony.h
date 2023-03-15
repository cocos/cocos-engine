/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "EditBox.h"
#include "cocos/application/ApplicationManager.h"
#include "platform/openharmony/napi/NapiHelper.h"
#include "cocos/bindings/jswrapper/SeApi.h"

namespace cc {

class OpenHarmonyEditBox : public EditBox {
public:
    static void GetInterfaces(std::vector<napi_property_descriptor>& descriptors);
    
    static napi_value napiOnComplete(napi_env env, napi_callback_info info);
    static napi_value napiOnTextChange(napi_env env, napi_callback_info info);

    static napi_value show(const std::string& inputMessage);
    static napi_value hide();
private:
    static napi_ref showEditBoxFunction;
    static napi_ref hideEditBoxFunction;

};

} // namespace cc


