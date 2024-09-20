/*
 Copyright (c) 2024 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

#include "SpineAnimation.h"

using namespace spine;

spine::Vector<Timeline*>& convertAndUseVector(const std::vector<std::shared_ptr<Timeline>>& stdVec, spine::Vector<Timeline*>& _spineVecTimelines) {
    for (const auto& element : stdVec) {
        _spineVecTimelines.add(element.get());
    }

    return _spineVecTimelines;
}

SpineAnimation::SpineAnimation(const String& name, std::vector<std::shared_ptr<Timeline>> timelines, float duration) : Animation(name, convertAndUseVector(timelines, _spineVecTimelines), duration) {
    _vecTimelines = timelines;
}

SpineAnimation::~SpineAnimation() {
    _vecTimelines.clear();
    _spineVecTimelines.clear();
    auto& timelines = getTimelines();
    timelines.clear();
}
