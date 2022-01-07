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

#include "core/event/EventTypesToJS.h"

namespace cc {

// Internal NodeEventType : 0~99
// Internal EventTypesToJS : 100~199
// Internal Game event : 200~299
// Internal Director Event Type: 300~399
const CallbacksInvoker::KeyType EventTypesToJS::ROOT_BATCH2D_INIT{100};           //{"ROOT_BATCH2D_INIT"};
const CallbacksInvoker::KeyType EventTypesToJS::ROOT_BATCH2D_UPDATE{101};         //{"ROOT_BATCH2D_UPDATE"};
const CallbacksInvoker::KeyType EventTypesToJS::ROOT_BATCH2D_UPLOAD_BUFFERS{102}; //{"ROOT_BATCH2D_UPLOAD_BUFFERS"};
const CallbacksInvoker::KeyType EventTypesToJS::ROOT_BATCH2D_RESET{103};          //{"ROOT_BATCH2D_RESET"};

const CallbacksInvoker::KeyType EventTypesToJS::NODE_REATTACH{104};                 //{"NODE_REATTACH"};
const CallbacksInvoker::KeyType EventTypesToJS::NODE_REMOVE_PERSIST_ROOT_NODE{105}; //{"NODE_REMOVE_PERSIST_ROOT_NODE"};
const CallbacksInvoker::KeyType EventTypesToJS::NODE_DESTROY_COMPONENTS{106};       //{"NODE_DESTROY_COMPONENTS"};
const CallbacksInvoker::KeyType EventTypesToJS::NODE_UI_TRANSFORM_DIRTY{107};       //{"NODE_UI_TRANSFORM_DIRTY"};
const CallbacksInvoker::KeyType EventTypesToJS::NODE_ACTIVE_NODE{108};              //{"NODE_ACTIVE_NODE"};
const CallbacksInvoker::KeyType EventTypesToJS::NODE_ON_BATCH_CREATED{109};         //{"NODE_ON_BATCH_CREATED"};

const CallbacksInvoker::KeyType EventTypesToJS::MODEL_UPDATE_TRANSFORM{110};            //{"MODEL_UPDATE_TRANSFORM"};
const CallbacksInvoker::KeyType EventTypesToJS::MODEL_UPDATE_UBO{111};                  //{"MODEL_UPDATE_UBO"};
const CallbacksInvoker::KeyType EventTypesToJS::MODEL_UPDATE_LOCAL_DESCRIPTORS{112};    //{"MODEL_UPDATE_LOCAL_DESCRIPTORS"};
const CallbacksInvoker::KeyType EventTypesToJS::MODEL_UPDATE_INSTANCED_ATTRIBUTES{113}; //{"MODEL_UPDATE_INSTANCED_ATTRIBUTES"};
const CallbacksInvoker::KeyType EventTypesToJS::MODEL_GET_MACRO_PATCHES{114};           //{"MODEL_GET_MACRO_PATCHES"};

const CallbacksInvoker::KeyType EventTypesToJS::DIRECTOR_BEFORE_COMMIT{115}; //{"MODEL_GET_MACRO_PATCHES"};

const CallbacksInvoker::KeyType EventTypesToJS::SIMPLE_TEXTURE_GFX_TEXTURE_UPDATED{116};
const CallbacksInvoker::KeyType EventTypesToJS::TEXTURE_BASE_GFX_SAMPLER_UPDATED{117};

const CallbacksInvoker::KeyType EventTypesToJS::NODE_SCENE_UPDATED{118};

const CallbacksInvoker::KeyType EventTypesToJS::MATERIAL_PASSES_UPDATED{119};

const CallbacksInvoker::KeyType EventTypesToJS::NODE_LOCAL_POSITION_UPDATED{120};
const CallbacksInvoker::KeyType EventTypesToJS::NODE_LOCAL_ROTATION_UPDATED{121};
const CallbacksInvoker::KeyType EventTypesToJS::NODE_LOCAL_SCALE_UPDATED{122};
const CallbacksInvoker::KeyType EventTypesToJS::NODE_LOCAL_POSITION_ROTATION_SCALE_UPDATED{123};

} // namespace cc
