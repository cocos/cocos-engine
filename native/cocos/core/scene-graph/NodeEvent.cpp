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

#include "core/scene-graph/NodeEvent.h"

namespace cc {

// Internal NodeEventType : 0~99
// Internal EventTypesToJS : 100~199
// Internal Game event : 200~299
// Internal Director Event Type: 300~399
const CallbacksInvoker::KeyType NodeEventType::TOUCH_START{0};                  //{"touch-start"};
const CallbacksInvoker::KeyType NodeEventType::TOUCH_MOVE{1};                   //{"touch-move"};
const CallbacksInvoker::KeyType NodeEventType::TOUCH_END{2};                    //{"touch-end"};
const CallbacksInvoker::KeyType NodeEventType::TOUCH_CANCEL{3};                 //{"touch-cancel"};
const CallbacksInvoker::KeyType NodeEventType::MOUSE_DOWN{4};                   //{"mouse-down"};
const CallbacksInvoker::KeyType NodeEventType::MOUSE_MOVE{5};                   //{"mouse-move"};
const CallbacksInvoker::KeyType NodeEventType::MOUSE_UP{6};                     //{"mouse-up"};
const CallbacksInvoker::KeyType NodeEventType::MOUSE_WHEEL{7};                  //{"mouse-wheel"};
const CallbacksInvoker::KeyType NodeEventType::MOUSE_ENTER{8};                  //{"mouse-enter"};
const CallbacksInvoker::KeyType NodeEventType::MOUSE_LEAVE{9};                  //{"mouse-leave"};
const CallbacksInvoker::KeyType NodeEventType::KEY_DOWN{10};                    //{"keydown"};
const CallbacksInvoker::KeyType NodeEventType::KEY_UP{11};                      //{"keyup"};
const CallbacksInvoker::KeyType NodeEventType::DEVICEMOTION{12};                //{"devicemotion"};
const CallbacksInvoker::KeyType NodeEventType::TRANSFORM_CHANGED{13};           //{"transform-changed"};
const CallbacksInvoker::KeyType NodeEventType::SCENE_CHANGED_FOR_PERSISTS{14};  //{"scene-changed-for-persists"};
const CallbacksInvoker::KeyType NodeEventType::SIZE_CHANGED{15};                //{"size-changed"};
const CallbacksInvoker::KeyType NodeEventType::ANCHOR_CHANGED{16};              //{"anchor-changed"};
const CallbacksInvoker::KeyType NodeEventType::COLOR_CHANGED{17};               //{"color-changed"};
const CallbacksInvoker::KeyType NodeEventType::CHILD_ADDED{18};                 //{"child-added"};
const CallbacksInvoker::KeyType NodeEventType::CHILD_REMOVED{19};               //{"child-removed"};
const CallbacksInvoker::KeyType NodeEventType::PARENT_CHANGED{20};              //{"parent-changed"};
const CallbacksInvoker::KeyType NodeEventType::NODE_DESTROYED{21};              //{"node-destroyed"};
const CallbacksInvoker::KeyType NodeEventType::LAYER_CHANGED{22};               //{"layer-changed"};
const CallbacksInvoker::KeyType NodeEventType::SIBLING_ORDER_CHANGED{23};       //{"sibling-order-changed"};
const CallbacksInvoker::KeyType NodeEventType::ACTIVE_IN_HIERARCHY_CHANGED{24}; //{"active-in-hierarchy-changed"};

} // namespace cc
