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

#pragma once

#include <vector>
#include <string>
#include "base/ccTypes.h"
#include "math/Vec3.h"
#include "math/Mat4.h"
#include "../Macro.h"
#include "../Types.h"
#include "View.h"
#include "../scene/NodeProxy.hpp"

#ifdef  near
#undef near
#endif

#ifdef  far
#undef far
#endif

RENDERER_BEGIN

class FrameBuffer;

/**
 * @addtogroup renderer
 * @{
 */

/**
 *  @brief Manage scene camera.
 */
class Camera : public Ref
{
public:
    /**
     *  @brief The default constructor.
     */
    Camera();
    /**
     *  @brief The default destructor.
     */
    ~Camera();
    
    /**
     *  @brief Gets the camera type.
     */
    ProjectionType getType() const { return _projection; }
    /**
     *  @brief Sets the camera type.
     */
    inline void setType(ProjectionType value) { _projection = value; }
    /**
     *  @brief Gets the view height for orthographic camera.
     */
    inline float getOrthoHeight() const { return _orthoHeight; }
    /**
     *  @brief Sets the view height for orthographic camera.
     */
    inline void setOrthoHeight(float value) { _orthoHeight = value; }
    /**
     *  @brief Gets the field of view for the camera.
     */
    inline float getFov() const { return _fov; }
    /**
     *  @brief Sets the field of view for the camera.
     */
    inline void setFov(float fov) { _fov = fov; }
    /**
     *  @brief Gets the near clip plane.
     */
    inline float getNear() const { return _near; }
    /**
     *  @brief Sets the near clip plane.
     */
    inline void setNear(float near) { _near = near; }
    /**
     *  @brief Gets the far clip plane.
     */
    inline float getFar() const { return _far; }
    /**
     *  @brief Sets the far clip plane.
     */
    inline void setFar(float far) { _far = far; }
    /**
     *  @brief Gets the clear color.
     */
    inline void getColor(Color4F& out) const { out = _color; }
    /**
     *  @brief Sets the clear color.
     */
    void setColor(float r, float g, float b, float a);
    /**
     *  @brief Gets the depth of the camera, camera of smaller depth gets rendered earlier.
     */
    inline float getDepth() const { return _depth; }
    /**
     *  @brief Sets the depth of the camera, camera of smaller depth gets rendered earlier
     */
    void setDepth(float depth);
    /**
     *  @brief Gets the culling mask.
     */
    inline int getCullingMask() const { return _cullingMask; }
    /**
     *  @brief Sets the culling mask.
     */
    inline void setCullingMask(int mask) { _cullingMask = mask; }
    /**
     *  @brief Gets the stencil value to clear
     */
    inline int getStencil() const { return _stencil; }
    /**
     *  @brief Sets the stencil value to clear
     */
    void setStencil(int stencil);
    /**
     *  @brief Gets the clear flags including color, stencil and depth.
     */
    inline uint8_t getClearFlags() const { return _clearFlags; }
    /**
     *  @brief Sets the clear flags including color, stencil and depth.
     */
    void setClearFlags(uint8_t flags );
    /**
     *  @brief Gets rect.
     */
    inline Rect* getRect(Rect& out) const { out = _rect; return &out; }
    /**
     *  @brief Sets rect.
     */
    void setRect(float x, float y, float w, float h);
    /**
     *  @brief Gets stages.
     */
    inline const std::vector<std::string>& getStages() const { return _stages; }
    /**
     *  @brief Sets stages.
     */
    void setStages(const std::vector<std::string>& stages);
    /**
     *  @brief Gets the frame buffer as render target.
     */
    inline FrameBuffer* getFrameBuffer() const { return _framebuffer; }
    /**
     *  @brief Sets the frame buffer as render target.
     */
    void setFrameBuffer(FrameBuffer* framebuffer);
    /**
     *  @brief Sets the world matrix.
     */
    void setWorldMatrix(const Mat4& worldMatrix);
    /**
     *  @brief Extracts the camera info to view.
     */
    void extractView(View& view, int width, int height);
    /**
     *  @brief Transform a screen position to world in the current camera projection.
     */
    Vec3& screenToWorld(Vec3& out, const Vec3& screenPos, int width, int height);
    /**
     *  @brief Transform a world position to screen in the current camera projection.
     */
    Vec3& worldToScreen(Vec3& out, const Vec3& worldPos, int width, int height);
    /**
     *  @brief Transform a screen position to world space
     */
    Mat4& worldMatrixToScreen(Mat4& out, const Mat4& worldMatrix, int width, int height);
    /**
     *  @brief Sets the related node proxy which provids model matrix for camera.
     */
    void setNode(NodeProxy* node);
    /**
     *  @brief Gets the related node proxy which provids model matrix for camera.
     */
    inline NodeProxy* getNode() const { return _node; }
    /**
     *  @brief Sets the camera render priority.
     */
    void setPriority(int priority) { _priority = priority; }
    /**
     *  @brief Gets the camera render priority.
     */
    int getPriority() const { return _priority; }
private:
    void calcMatrices(const int width, const int height);
private:
    NodeProxy* _node = nullptr;
    ProjectionType _projection = ProjectionType::PERSPECTIVE;
    
    // clear options
    Color4F _color = {0.2f, 0.3f, 0.47f, 1.f};
    float _depth = 1.f;
    int _stencil = 1;
    int _cullingMask = 1;
    uint8_t _clearFlags = ClearFlag::COLOR | ClearFlag::DEPTH;
    
    // stage & framebuffer
    std::vector<std::string> _stages;
    FrameBuffer* _framebuffer = nullptr;
    
    // projection properties
    float _near = 0.01f;
    float _far = 1000.0f;
    float _fov = RENDERER_PI / 4.0f;
    Rect _rect = {0, 0, 1, 1};
    
    // ortho properties
    float _orthoHeight = 10.f;
    
    Mat4 _worldRTInv;
    Vec3 _worldPos;
    
    Mat4 _matView;
    Mat4 _matProj;
    Mat4 _matViewProj;
    Mat4 _matInvViewProj;
    
    Vec3 _temp_v3;
    Mat4 _temp_mat4;
    
    int _priority = 0;
};

// end of renderer group
/// @}

RENDERER_END
