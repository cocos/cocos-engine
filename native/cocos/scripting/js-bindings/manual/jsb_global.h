/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

namespace se {
    class Object;
    class Class;
    class Value;
}

extern se::Object* __jsbObj;
extern se::Object* __glObj;

bool jsb_register_global_variables(se::Object* global);

void jsb_init_file_operation_delegate();
bool jsb_enable_debugger(const std::string& debuggerServerAddr, uint32_t port, bool isWaitForConnect = false);
bool jsb_set_extend_property(const char* ns, const char* clsName);
bool jsb_run_script(const std::string& filePath, se::Value* rval = nullptr);
bool jsb_run_script_module(const std::string& filePath, se::Value* rval = nullptr);

void jsb_set_xxtea_key(const std::string& key);

bool jsb_global_load_image(const std::string& path, const se::Value& callbackVal);
