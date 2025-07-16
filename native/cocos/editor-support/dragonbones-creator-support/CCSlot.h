/****************************************************************************
 Copyright (c) 2012-2020 DragonBones team and other contributors
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

#ifndef DRAGONBONES_CC_SLOT_H
#define DRAGONBONES_CC_SLOT_H

#include "dragonbones/DragonBonesHeaders.h"
#include "math/Geometry.h"
#include "math/Mat4.h"
#include "middleware-adapter.h"

DRAGONBONES_NAMESPACE_BEGIN

/**
 * The Cocos2d slot.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * Cocos2d 插槽。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class CCSlot : public Slot {
    BIND_CLASS_TYPE_A(CCSlot);

public:
    // Global matrix (相对于骨骼部件)
    cc::Mat4 worldMatrix;
    // Global matrix dirty flag
    bool _worldMatDirty = true;
    // Slot triangles
    cc::middleware::Triangles triangles;
    // Slot vertex transform to World vertex
    cc::middleware::V3F_T2F_C4B *worldVerts = nullptr;
    cc::middleware::Color4B color;
    cc::Rect boundsRect;

private:
    cc::Mat4 _localMatrix;

private:
    void disposeTriangles();
    void calculWorldMatrix();
    void adjustTriangles(const unsigned vertexCount, const unsigned indicesCount);

protected:
    virtual void _onClear() override;
    virtual void _initDisplay(void *value, bool isRetain) override;
    virtual void _disposeDisplay(void *value, bool isRelease) override;
    virtual void _onUpdateDisplay() override;
    virtual void _addDisplay() override;
    virtual void _replaceDisplay(void *value, bool isArmatureDisplay) override;
    virtual void _removeDisplay() override;
    virtual void _updateZOrder() override;

public:
    virtual void _updateVisible() override;
    virtual void _updateBlendMode() override;
    virtual void _updateColor() override;
    void updateWorldMatrix();
    cc::middleware::Texture2D *getTexture() const;

protected:
    virtual void _updateFrame() override;
    virtual void _updateMesh() override;
    virtual void _updateTransform() override;
    virtual void _identityTransform() override;
};

DRAGONBONES_NAMESPACE_END

#endif // DRAGONBONES_CC_SLOT_H
