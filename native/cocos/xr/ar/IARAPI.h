/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <array>

namespace cc {
namespace ar {

using Pose = std::array<float, 7>;
using Matrix = std::array<float, 16>;
using TexCoords = std::array<float, 8>;
using LightVal = std::array<float, 3>;

class IARAPI {
public:
    virtual ~IARAPI() = default;
    virtual void config(int featureMask) = 0;
    virtual uint32_t getSupportMask() = 0;
    virtual void start() = 0;
    virtual void start(void* env, void* context) = 0;
    virtual void resume() = 0;
    virtual void resume(void* env, void* context) = 0;
    virtual void pause() = 0;
    virtual void update() = 0;
    virtual int getAPIState() = 0;

    virtual Pose getCameraPose() = 0;
    virtual Matrix getCameraViewMatrix() = 0;
    virtual Matrix getCameraProjectionMatrix() = 0;
    virtual TexCoords getCameraTexCoords() = 0;

    virtual void enableCameraAutoFocus(bool enable) = 0;
    virtual void enableCameraDepth(bool enable) = 0;
    virtual void setDisplayGeometry(uint32_t rotation, uint32_t width, uint32_t height) = 0;
    virtual void setCameraClip(float near, float far) = 0;
    virtual void setCameraTextureName(int id) = 0;
    virtual void* getCameraTextureRef() = 0;
    virtual uint8_t* getCameraDepthBuffer() = 0;

    virtual void enableLightEstimate(bool enable) = 0;
    virtual LightVal getMainLightDirection() = 0;
    virtual LightVal getMainLightIntensity() = 0;

    virtual int tryHitAttachAnchor(int id) = 0;
    virtual Pose getAnchorPose(int id) = 0;

    virtual bool raycast(float xPx, float yPx, uint32_t trackableTypeMask) = 0;
    virtual Pose getRaycastPose() = 0;
    virtual int getRaycastTrackableId() = 0;
    virtual int getRaycastTrackableType() = 0;

    // for jsb array
    virtual int getInfoLength() = 0;

    // plane detection
    virtual void enablePlane(bool enable) = 0;
    virtual void setPlaneDetectionMode(int mode) = 0;
    virtual void setPlaneMaxTrackingNumber(int count) = 0;
    virtual float* getAddedPlanesInfo() = 0;
    virtual float* getUpdatedPlanesInfo() = 0;
    virtual float* getRemovedPlanesInfo() = 0;
    virtual float* getPlanePolygon(int id) = 0;

    // scene mesh reconstruction
    virtual void enableSceneMesh(bool enable) = 0;
    virtual float* getAddedSceneMesh() = 0;
    virtual float* getUpdatedSceneMesh() = 0;
    virtual int* getRemovedSceneMesh() = 0;
    virtual int* requireSceneMesh() = 0;
    virtual float* getSceneMeshVertices(int id) = 0;
    virtual int* getSceneMeshTriangleIndices(int id) = 0;
    virtual void endRequireSceneMesh() = 0;

    // image recognition & tracking
    virtual void enableImageTracking(bool enable) = 0;
    virtual void addImageToLib(const std::string& name) = 0;
    virtual void addImageToLibWithSize(const std::string& name, float widthInMeters) = 0;
    virtual void setImageMaxTrackingNumber(int number) = 0;
    virtual float* getAddedImagesInfo() = 0;
    virtual float* getUpdatedImagesInfo() = 0;
    virtual float* getRemovedImagesInfo() = 0;

    // object recognition & tracking
    virtual void enableObjectTracking(bool enable) = 0;
    virtual void addObjectToLib(const std::string& name) = 0;
    virtual float* getAddedObjectsInfo() = 0;
    virtual float* getUpdatedObjectsInfo() = 0;
    virtual float* getRemovedObjectsInfo() = 0;

    // face detection & tracking
    virtual void enableFaceTracking(bool enable) = 0;
    virtual float* getAddedFacesInfo() = 0;
    virtual float* getUpdatedFacesInfo() = 0;
    virtual float* getRemovedFacesInfo() = 0;
    virtual float* getFaceBlendShapes(int id) = 0;
};

} // namespace ar
} // namespace cc
