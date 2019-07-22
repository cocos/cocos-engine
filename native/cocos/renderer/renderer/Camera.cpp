/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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

#include "Camera.h"
#include "gfx/FrameBuffer.h"
#include "math/MathUtil.h"

RENDERER_BEGIN

Camera::Camera()
{
}

Camera::~Camera()
{
    RENDERER_SAFE_RELEASE(_framebuffer);
    RENDERER_SAFE_RELEASE(_node);
}

void Camera::setFrameBuffer(FrameBuffer* framebuffer)
{
    RENDERER_SAFE_RELEASE(_framebuffer);
    _framebuffer = framebuffer;
    RENDERER_SAFE_RETAIN(_framebuffer);
}

void Camera::setWorldMatrix(const Mat4& worldMatrix)
{
    Quaternion rotation;
    worldMatrix.decompose(nullptr, &rotation, &_worldPos);

    Mat4::createTranslation(_worldPos, &_worldRTInv);
    _worldRTInv.rotate(rotation);
    _worldRTInv.inverse();
}

void Camera::setColor(float r, float g, float b, float a)
{
    _color.set(r, g, b, a);
}

void Camera::setDepth(float depth)
{
    _depth = depth;
}

void Camera::setStencil(int stencil)
{
    _stencil = stencil;
}

void Camera::setClearFlags(uint8_t flags )
{
    _clearFlags = flags;
}

void Camera::setRect(float x, float y, float w, float h)
{
    _rect.set(x, y, w, h);
}

void Camera::setStages(const std::vector<std::string>& stages)
{
    _stages = stages;
}


void Camera::setNode(NodeProxy* node)
{
    if (_node != nullptr)
    {
        _node->release();
    }
    _node = node;
    if (_node != nullptr)
    {
        _node->retain();
    }
}

void Camera::extractView(View& out, int width, int height)
{
    // rect
    out.rect.set(_rect.x * width,
                 _rect.y * height,
                 _rect.w * width,
                 _rect.h * height);
    
    // clear opts
    out.color = _color;
    out.depth = _depth;
    out.stencil = _stencil;
    out.clearFlags = _clearFlags;

    // view matrix
    //REFINE:
    _node->getWorldRT(&_worldRTInv);
    out.matView.set(_worldRTInv.getInversed());

    // projecton matrix
    float aspect = (float)width / height;
    if (ProjectionType::PERSPECTIVE == _projection)
        Mat4::createPerspective(_fov / 3.1415926 * 180, aspect, _near, _far, &out.matProj);
    else
    {
        float x = _orthoHeight * aspect;
        float y = _orthoHeight;
        Mat4::createOrthographicOffCenter(-x, x, -y, y, _near, _far, &out.matProj);
    }

    // view projection
    Mat4::multiply(out.matProj, out.matView, &out.matViewProj);
    out.matInvViewPorj.set(out.matViewProj.getInversed());
    
    // stages & framebuffer
    out.stages = _stages;
    out.frameBuffer = _framebuffer;
    
    // culling mask
    out.cullingMask = _cullingMask;
    out.cullingByID = true;
}

Vec3& Camera::screenToWorld(Vec3& out, const Vec3& screenPos, int width, int height) const
{
    float aspect = (float)width / height;
    float cx = _rect.x * width;
    float cy = _rect.y * height;
    float cw = _rect.w * width;
    float ch = _rect.h * height;
    
    // projection matrix
    Mat4 matProj;
    if (ProjectionType::PERSPECTIVE == _projection)
        Mat4::createPerspective(_fov / 3.1415926 * 180, aspect, _near, _far, &matProj);
    else
    {
        float x = _orthoHeight * aspect;
        float y = _orthoHeight;
        Mat4::createOrthographic(-x, x, -y, y, &matProj);
    }
    
    _node->getWorldRT(&(const_cast<Camera*>(this)->_worldRTInv));
    const_cast<Camera*>(this)->_worldRTInv.inverse();
    
    // view projection
    Mat4 matViewProj;
    Mat4::multiply(matProj, _worldRTInv, &matViewProj);
    
    // invert view projection
    Mat4 matInvViewProj = matViewProj.getInversed();
    
    if (ProjectionType::PERSPECTIVE == _projection)
    {
        // Caculate screen pos in far clip plane.
        out.set((screenPos.x - cx) * 2.0f / cw - 1.0f,
                (screenPos.y - cy) * 2.0f / ch - 1.0f,
                1.0f);
        
        // Transform to world position.
        matInvViewProj.transformPoint(&out);
        _node->getWorldPosition(&(const_cast<Camera*>(this)->_worldPos));
        Vec3 tmpVec3 = _worldPos;
        out = tmpVec3.lerp(out, MathUtil::lerp(_near / _far, 1, screenPos.z));
    }
    else
    {
        out.set((screenPos.x - cx) * 2.0f / cw - 1.0f,
                (screenPos.y - cy) * 2.0f / ch - 1.0f,
                screenPos.z * 2.0f - 1.0f);
        
        // Transform to world position.
        matInvViewProj.transformPoint(&out);
    }
    
    return out;
}

Vec3& Camera::worldToScreen(Vec3& out, const Vec3& worldPos, int width, int height) const
{
    float aspect = (float)width / height;
    float cx = _rect.x * width;
    float cy = _rect.y * height;
    float cw = _rect.w * width;
    float ch = _rect.h * height;
    
    // projection matrix
    Mat4 matProj;
    if (ProjectionType::PERSPECTIVE == _projection)
        Mat4::createPerspective(_fov, aspect, _near, _far, &matProj);
    else
    {
        float x = _orthoHeight * aspect;
        float y = _orthoHeight;
        Mat4::createOrthographic(-x, x, -y, y, &matProj);
    }
    
    _node->getWorldRT(&(const_cast<Camera*>(this)->_worldRTInv));
    const_cast<Camera*>(this)->_worldRTInv.inverse();
    // view projection
    Mat4 matViewProj;
    Mat4::multiply(matProj, _worldRTInv, &matViewProj);
    
    matViewProj.transformPoint(worldPos, &out);
    out.x = cx + (out.x + 1) * 0.5f * cw;
    out.y = cy + (out.y + 1) * 0.5f * ch;
    out.z = out.z * 0.5 + 0.5;
    
    return out;
}

RENDERER_END
