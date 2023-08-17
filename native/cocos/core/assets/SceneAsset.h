/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Ptr.h"
#include "core/assets/Asset.h"

namespace cc {

class Scene;

class SceneAsset final : public Asset {
public:
    using Super = Asset;
    SceneAsset();
    ~SceneAsset() override;

    void initDefault(const ccstd::optional<ccstd::string> &uuid) override;

    bool validate() const override;

    inline Scene *getScene() const { return _scene.get(); }
    void setScene(Scene *scene);

private:
    /**
     * @en The scene node
     * @zh 场景节点。

    @editable
    @serializable*/
    IntrusivePtr<Scene> _scene;

    CC_DISALLOW_COPY_MOVE_ASSIGN(SceneAsset);
};

} // namespace cc
