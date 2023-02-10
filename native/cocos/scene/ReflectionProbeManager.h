/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once
#include "base/Macros.h"
#include "base/Ptr.h"
#include "renderer/pipeline/Define.h"
#include "scene/Camera.h"
namespace cc {
namespace scene {
class ReflectionProbe;
// namespace scene
class ReflectionProbeManager final {
public:
    static ReflectionProbeManager* getInstance();
    ReflectionProbeManager();
    ~ReflectionProbeManager() = default;
    void registerProbe(scene::ReflectionProbe* probe);
    void unRegisterProbe(scene::ReflectionProbe* probe);
    const ccstd::vector<scene::ReflectionProbe*>& getAllProbes() const { return _probes; }
    ReflectionProbe* getReflectionProbeById(int32_t probeId);
    int32_t getMaxProbeId();
private: 
    ccstd::vector<scene::ReflectionProbe*> _probes;
};

} // namespace scene
} // namespace cc
