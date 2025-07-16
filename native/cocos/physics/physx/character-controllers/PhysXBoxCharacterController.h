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
****************************************************************************/

#pragma once

#include "physics/physx/character-controllers/PhysXCharacterController.h"

namespace cc {
namespace physics {

class PhysXBoxCharacterController final : public PhysXCharacterController, public IBoxCharacterController {
public:
    PhysXBoxCharacterController();
    ~PhysXBoxCharacterController() override = default;
    
    // IBoxCharacterController
    void setHalfHeight(float v) override;
    void setHalfSideExtent(float v) override;
    void setHalfForwardExtent(float v) override;
    // IBoxCharacterController END

private:
    float _mHalfHeight;
    float _mHalfSideExtent;
    float _mHalfForwardExtent;
    void create() override;
    void onComponentSet() override;
    void updateScale() override;
    void updateGeometry();
};

} // namespace physics
} // namespace cc
