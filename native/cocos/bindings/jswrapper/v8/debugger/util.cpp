// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

#include "util.h"

#if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR

    //cjh #include "string_bytes.h"
    //#include "node_buffer.h"
    //#include "node_internals.h"
    #include <stdio.h>

namespace node {

using v8::Isolate;
using v8::Local;
using v8::String;
using v8::Value;

template <typename T>
static void MakeUtf8String(Isolate *isolate,
                           Local<Value> value,
                           T *target) {
    Local<String> string;
    if (!value->ToString(isolate->GetCurrentContext()).ToLocal(&string))
        return;

    const size_t storage = 3 * string->Length() + 1;
    target->AllocateSufficientStorage(storage);
    const int flags =
        String::NO_NULL_TERMINATION | String::REPLACE_INVALID_UTF8;
    const int length = string->WriteUtf8(isolate, target->out(), (int)storage, 0, flags);
    target->SetLengthAndZeroTerminate(length);
}

Utf8Value::Utf8Value(Isolate *isolate, Local<Value> value) {
    if (value.IsEmpty())
        return;

    MakeUtf8String(isolate, value, this);
}

TwoByteValue::TwoByteValue(Isolate *isolate, Local<Value> value) {
    if (value.IsEmpty()) {
        return;
    }

    Local<String> string;
    if (!value->ToString(isolate->GetCurrentContext()).ToLocal(&string))
        if (string.IsEmpty())
            return;

    // Allocate enough space to include the null terminator
    const size_t storage = string->Length() + 1;
    AllocateSufficientStorage(storage);

    const int flags = String::NO_NULL_TERMINATION;
    const int length = string->Write(isolate, out(), 0, (int)storage, flags);
    SetLengthAndZeroTerminate(length);
}

BufferValue::BufferValue(Isolate *isolate, Local<Value> value) {
    // Slightly different take on Utf8Value. If value is a String,
    // it will return a Utf8 encoded string. If value is a Buffer,
    // it will copy the data out of the Buffer as is.
    if (value.IsEmpty()) {
        // Dereferencing this object will return nullptr.
        Invalidate();
        return;
    }

    if (value->IsString()) {
        MakeUtf8String(isolate, value, this);
        //cjh   } else if (Buffer::HasInstance(value)) {
        //    const size_t len = Buffer::Length(value);
        //    // Leave place for the terminating '\0' byte.
        //    AllocateSufficientStorage(len + 1);
        //    memcpy(out(), Buffer::Data(value), len);
        //    SetLengthAndZeroTerminate(len);
    } else {
        Invalidate();
    }
}

void LowMemoryNotification() {
    //  if (v8_initialized) {
    auto isolate = v8::Isolate::GetCurrent();
    if (isolate != nullptr) {
        isolate->LowMemoryNotification();
    }
    //  }
}

void DumpBacktrace(FILE *fp) {
}

} // namespace node

#endif // #if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR
